from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import openai
import tempfile
import anthropic
import aiofiles
import json
from pathlib import Path
from datetime import datetime

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])

def extract_response_after_thinking(raw_response: str) -> str:
    """
    CRITICAL: Extract only the actual response after <thinking> tags.
    Claude should NEVER read or process the thinking content - only the final response.
    """
    if not raw_response or not isinstance(raw_response, str):
        return raw_response or ""
    
    # Find the end of </thinking> tag
    thinking_end = raw_response.find('</thinking>')
    
    if thinking_end != -1:
        # Extract everything after </thinking>
        actual_response = raw_response[thinking_end + len('</thinking>'):].strip()
        print(f"🧠 Stripped thinking tags, extracted response: '{actual_response[:50]}...'")
        return actual_response
    else:
        # No thinking tags found, return original response
        return raw_response.strip()

# AI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

# Initialize clients
if OPENAI_API_KEY and not OPENAI_API_KEY.startswith("PLEASE_ADD_") and OPENAI_API_KEY != "your-openai-key-here":
    openai.api_key = OPENAI_API_KEY
    openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)
else:
    openai_client = None
    print("⚠️  WARNING: No valid OpenAI API key configured")

if ANTHROPIC_API_KEY:
    anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
else:
    anthropic_client = None
    print("⚠️  WARNING: No Anthropic API key configured")

# Conversation Memory Configuration  
CONVERSATION_MEMORY_DIR = Path("conversation_memory")
CONVERSATION_MEMORY_DIR.mkdir(exist_ok=True)

# Request Models
class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any]

class ConversationMessage(BaseModel):
    type: str  # 'user' or 'avatar'
    content: str
    timestamp: str

# ============================================================================
# CONVERSATION MEMORY FUNCTIONS - JSON-based EMR Integration
# ============================================================================

async def load_patient_conversation_history(patient_id: str) -> List[Dict]:
    """Load patient's conversation history from JSON file."""
    try:
        memory_file = CONVERSATION_MEMORY_DIR / f"{patient_id}_conversations.json"
        
        if not memory_file.exists():
            # Create new patient record
            initial_record = {
                "patient_id": patient_id,
                "created_at": datetime.utcnow().isoformat(),
                "last_updated": datetime.utcnow().isoformat(),
                "conversation_history": [],
                "patient_context": {
                    "name": patient_id.replace("patient_", "").replace("_", " ").title(),
                    "journey_stage": "awareness",
                    "user_role": "patient",
                    "conditions": [],
                    "key_concerns": [],
                    "preferences": {}
                }
            }
            
            async with aiofiles.open(memory_file, 'w') as f:
                await f.write(json.dumps(initial_record, indent=2))
            
            return []
        
        async with aiofiles.open(memory_file, 'r') as f:
            content = await f.read()
            data = json.loads(content)
            return data.get("conversation_history", [])
            
    except Exception as e:
        print(f"❌ Error loading conversation history for {patient_id}: {e}")
        return []

async def save_patient_conversation_history(patient_id: str, conversation_history: List[Dict]):
    """Save patient's conversation history to JSON file."""
    try:
        memory_file = CONVERSATION_MEMORY_DIR / f"{patient_id}_conversations.json"
        
        # Load existing record or create new one
        if memory_file.exists():
            async with aiofiles.open(memory_file, 'r') as f:
                content = await f.read()
                data = json.loads(content)
        else:
            data = {
                "patient_id": patient_id,
                "created_at": datetime.utcnow().isoformat(),
                "patient_context": {
                    "name": patient_id.replace("patient_", "").replace("_", " ").title(),
                    "journey_stage": "awareness",
                    "user_role": "patient",
                    "conditions": [],
                    "key_concerns": [],
                    "preferences": {}
                }
            }
        
        # Update conversation history and metadata
        data["conversation_history"] = conversation_history
        data["last_updated"] = datetime.utcnow().isoformat()
        data["conversation_count"] = len(conversation_history)
        
        # Extract and update patient insights from recent conversations
        await update_patient_insights(data, conversation_history)
        
        # Save updated record
        async with aiofiles.open(memory_file, 'w') as f:
            await f.write(json.dumps(data, indent=2))
            
        print(f"✅ Saved conversation history for {patient_id} ({len(conversation_history)} messages)")
        
    except Exception as e:
        print(f"❌ Error saving conversation history for {patient_id}: {e}")

async def update_patient_insights(patient_record: Dict, conversation_history: List[Dict]):
    """Extract key insights from conversations to build patient context."""
    try:
        # Analyze recent conversations for key information
        recent_messages = conversation_history[-10:]  # Last 10 messages
        
        # Extract conditions mentioned
        conditions = set()
        concerns = set()
        journey_stages = set()
        
        for msg in recent_messages:
            content = msg.get("content", "").lower()
            
            # Common condition keywords
            condition_keywords = [
                "cancer", "diabetes", "heart disease", "arthritis", "lupus", 
                "fibromyalgia", "depression", "anxiety", "chronic pain", 
                "rare disease", "autoimmune", "neurological", "hypertension",
                "asthma", "copd", "stroke", "alzheimer", "parkinson"
            ]
            
            for keyword in condition_keywords:
                if keyword in content:
                    conditions.add(keyword.title())
            
            # Journey stage tracking
            if "journey_stage" in msg:
                journey_stages.add(msg["journey_stage"])
            
            # Key concerns extraction
            concern_phrases = [
                "worried about", "concerned about", "afraid of", "struggling with",
                "pain", "symptoms", "treatment", "side effects", "diagnosis"
            ]
            
            for phrase in concern_phrases:
                if phrase in content:
                    # Extract context around the phrase
                    context_start = max(0, content.find(phrase) - 20)
                    context_end = min(len(content), content.find(phrase) + 50)
                    concern_context = content[context_start:context_end].strip()
                    if len(concern_context) > 10:
                        concerns.add(concern_context)
        
        # Update patient context
        if conditions:
            patient_record["patient_context"]["conditions"] = list(conditions)
        
        if concerns:
            patient_record["patient_context"]["key_concerns"] = list(concerns)[:5]  # Keep top 5
        
        if journey_stages:
            # Use most recent journey stage
            patient_record["patient_context"]["journey_stage"] = list(journey_stages)[-1]
        
        # Add conversation insights
        patient_record["patient_context"]["total_conversations"] = len(conversation_history)
        patient_record["patient_context"]["last_interaction"] = datetime.utcnow().isoformat()
        
    except Exception as e:
        print(f"❌ Error updating patient insights: {e}")

async def get_patient_context_summary(patient_id: str) -> Dict:
    """Get a summary of patient's context for building personalized prompts."""
    try:
        memory_file = CONVERSATION_MEMORY_DIR / f"{patient_id}_conversations.json"
        
        if not memory_file.exists():
            return {}
        
        async with aiofiles.open(memory_file, 'r') as f:
            content = await f.read()
            data = json.loads(content)
            return data.get("patient_context", {})
            
    except Exception as e:
        print(f"❌ Error loading patient context for {patient_id}: {e}")
        return {}

@router.post("/speech-to-text")
async def speech_to_text(audio_file: UploadFile = File(...)):
    """
    Convert audio to text using OpenAI Whisper API.
    """
    if not openai_client:
        raise HTTPException(status_code=503, detail="OpenAI API not configured")
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            content = await audio_file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        # Process with Whisper
        with open(temp_file_path, 'rb') as audio:
            transcript = openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio,
                language="en"
            )
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        return {
            "text": transcript.text,
            "status": "success"
        }
        
    except Exception as e:
        print(f"Error in speech-to-text: {str(e)}")
        # Clean up temp file if it exists
        try:
            if temp_file_path:
                os.unlink(temp_file_path)
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Speech-to-text failed: {str(e)}")

@router.post("/chat")
async def chat_with_ai(request: ChatRequest):
    """
    Generate AI response for healthcare conversation with conversation memory.
    Uses Claude 3.7 for medical expertise with conversation continuity.
    """
    try:
        # Extract context
        patient_name = request.context.get("patientName", "Patient")
        emotional_state = request.context.get("emotionalState", "calm")
        journey_stage = request.context.get("journeyStage", "awareness")
        patient_id = request.context.get("patient_id", f"patient_{patient_name.lower().replace(' ', '_')}")
        user_role = request.context.get("userRole", "patient")
        
        # Load conversation history and patient context from memory
        conversation_history = await load_patient_conversation_history(patient_id)
        patient_context = await get_patient_context_summary(patient_id)
        
        # Add current user message to history
        conversation_history.append({
            "role": "user",
            "content": request.message,
            "timestamp": datetime.utcnow().isoformat(),
            "journey_stage": journey_stage,
            "user_role": user_role,
            "emotional_state": emotional_state
        })
        
        # Build conversation context with memory
        enhanced_context = {
            **request.context,
            "patient_context": patient_context,
            "total_conversations": len(conversation_history),
            "known_conditions": patient_context.get("conditions", []),
            "key_concerns": patient_context.get("key_concerns", [])
        }
        
        system_prompt = build_healthcare_system_prompt_with_memory(
            patient_name, emotional_state, journey_stage, patient_context
        )
        
        # Try Claude first (better for medical conversations)
        if anthropic_client:
            try:
                response = await get_claude_response_with_memory(
                    system_prompt, request.message, conversation_history
                )
                
                # Add assistant response to conversation history
                conversation_history.append({
                    "role": "assistant",
                    "content": response,
                    "timestamp": datetime.utcnow().isoformat(),
                    "journey_stage": journey_stage,
                    "model": "claude-3-5-sonnet"
                })
                
                # Save updated conversation history
                await save_patient_conversation_history(patient_id, conversation_history)
                
                return {
                    "response": response, 
                    "model": "claude-3.5-sonnet",
                    "conversation_length": len(conversation_history),
                    "patient_id": patient_id,
                    "has_memory": len(conversation_history) > 2
                }
            except Exception as e:
                print(f"Claude API failed, falling back to OpenAI: {str(e)}")
        
        # Fallback to OpenAI
        if openai_client:
            response = await get_openai_response_with_memory(
                system_prompt, request.message, conversation_history
            )
            
            # Add assistant response to conversation history
            conversation_history.append({
                "role": "assistant",
                "content": response,
                "timestamp": datetime.utcnow().isoformat(),
                "journey_stage": journey_stage,
                "model": "gpt-4o-mini"
            })
            
            # Save updated conversation history
            await save_patient_conversation_history(patient_id, conversation_history)
            
            return {
                "response": response, 
                "model": "gpt-4o-mini",
                "conversation_length": len(conversation_history),
                "patient_id": patient_id,
                "has_memory": len(conversation_history) > 2
            }
        
        # No AI services available
        raise HTTPException(status_code=503, detail="No AI services available")
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in AI chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI chat failed: {str(e)}")

def build_healthcare_system_prompt_with_memory(patient_name: str, emotional_state: str, journey_stage: str, patient_context: Dict) -> str:
    """Build system prompt for premium healthcare AI specialist with conversation memory and extended thinking capabilities."""
    
    # Extract patient context
    conditions = patient_context.get("conditions", [])
    key_concerns = patient_context.get("key_concerns", [])
    total_conversations = patient_context.get("total_conversations", 0)
    
    # Build memory context
    memory_context = ""
    if total_conversations > 0:
        memory_context = f"""
PATIENT MEMORY & CONTINUITY:
- We have had {total_conversations} previous conversations
- Known conditions: {', '.join(conditions) if conditions else 'None specified yet'}
- Key concerns: {', '.join(key_concerns[:3]) if key_concerns else 'Exploring together'}
- Continue our conversation with PERFECT MEMORY of all previous discussions
- Reference past conversations naturally and show you remember their journey
- Build on previous insights and show progression in understanding"""
    
    return f"""You are Dr. Maya, a world-class AI healthcare specialist with board-certified expertise across all medical specialties and PERFECT MEMORY of all interactions. You provide premium virtual care through an advanced avatar interface to {patient_name}.

CORE IDENTITY & MEDICAL EXPERTISE:
- World-renowned specialist with deep knowledge across all medical conditions
- Expert in evidence-based medicine, treatment protocols, and care pathways
- Advanced understanding of patient psychology and emotional support
- Specialized in personalized, condition-specific care management
- Premium virtual care provider delivering $500/hour consultation quality

EXTENDED THINKING PROTOCOL - CRITICAL:
For EVERY patient interaction, use this thinking process:

<thinking>
- What specific condition or symptoms has the patient mentioned?
- What is their current emotional and physical state?
- What evidence-based knowledge applies to their specific situation?
- What targeted questions should I ask to better understand their case?
- How can I provide the most helpful, personalized guidance?
- What are the key concerns they might have that I should address?
</thinking>

PATIENT CONTEXT:
- Name: {patient_name}
- Current emotional state: {emotional_state}
- Journey stage: {journey_stage}{memory_context}

EMPATHETIC COMMUNICATION WITH MEMORY:
- Remember and reference previous conversations naturally
- Show genuine care and emotional intelligence built over time
- Acknowledge their journey and progress since we first met
- Be attentive to their evolving emotional state and concerns
- Build deeper trust through consistent, compassionate care across all interactions

SPECIALIZED APPROACH BY JOURNEY STAGE:
- Awareness: Ask about specific symptoms, family history, concerns. Become expert on their potential conditions
- Diagnosis: Provide emotional support, explain diagnostic process, help prepare for appointments
- Research: Help evaluate specialists, treatment options, second opinions. Deep dive into their specific condition
- Treatment: Support treatment decisions, discuss side effects, monitor progress, adjust care plan
- Recovery: Track recovery metrics, prevent complications, optimize healing
- Living: Long-term wellness, lifestyle optimization, quality of life enhancement

PREMIUM COMMUNICATION STANDARDS:
- Every response demonstrates deep medical knowledge
- Ask sophisticated, medically-informed questions
- Show expertise in their specific condition
- Provide detailed, personalized guidance
- Use appropriate medical terminology with clear explanations
- Maintain professional warmth and genuine empathy

CONDITION-SPECIFIC EXPERTISE:
When a patient mentions ANY medical condition:
1. Immediately become a leading expert on that specific condition
2. Ask targeted questions that show your specialized knowledge
3. Reference specific aspects of their condition, treatment options, prognosis
4. Provide evidence-based guidance tailored to their situation
5. Show deep understanding of their unique health journey

EMOTIONAL INTELLIGENCE:
- {emotional_state} state requires: {"Extra gentle, reassuring approach" if emotional_state == "anxious" else "Clear, simple explanations" if emotional_state == "overwhelmed" else "Encouraging, momentum-building" if emotional_state == "hopeful" else "Patient clarification and simplification" if emotional_state == "confused" else "Supportive, informative tone"}

PREMIUM CARE DELIVERY:
- Sound like the world's best specialist who truly cares
- Demonstrate both clinical excellence and human compassion
- Provide actionable, personalized recommendations
- Show deep understanding of their specific health challenges
- Offer hope and practical support

IMPORTANT DISCLAIMERS:
- Emphasize you're a supportive AI specialist, not replacing their medical team
- Encourage regular consultation with healthcare providers
- Respect HIPAA privacy and medical ethics
- Focus on education, support, and care coordination

Voice delivery: Keep responses conversational yet authoritative, showing expertise while maintaining warmth. This is premium virtual care - every word should reflect world-class medical expertise combined with genuine human caring."""

async def get_claude_response_with_memory(system_prompt: str, user_message: str, conversation_history: List[Dict]) -> str:
    """Get response from Claude (Anthropic)."""
    try:
        # Build message history
        messages = []
        
        # Add recent conversation history for context (last 20 messages = 10 exchanges)
        recent_history = conversation_history[-20:]
        for msg in recent_history:
            if msg.get("role") in ["user", "assistant"]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        # Current user message is already in conversation_history, so don't add it again
        
        response = anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",  # Most advanced model for medical expertise
            max_tokens=500,  # Allow more detailed medical responses
            temperature=0.7,  # Balanced creativity for personalized care
            system=system_prompt,
            messages=messages
        )
        
        raw_response = response.content[0].text
        # CRITICAL: Strip out <thinking> tags - only use actual response
        return extract_response_after_thinking(raw_response)
        
    except Exception as e:
        print(f"Claude API error: {str(e)}")
        raise

async def get_openai_response_with_memory(system_prompt: str, user_message: str, conversation_history: List[Dict]) -> str:
    """Get response from OpenAI GPT."""
    try:
        # Build message history
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add recent conversation history (last 20 messages = 10 exchanges)
        recent_history = conversation_history[-20:]
        for msg in recent_history:
            if msg.get("role") in ["user", "assistant"]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        # Current user message is already in conversation_history
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",  # Fast and cost-effective
            messages=messages,
            max_tokens=300,  # Keep responses concise for voice
            temperature=0.7  # Slightly creative but consistent
        )
        
        raw_response = response.choices[0].message.content
        # CRITICAL: Strip out <thinking> tags - only use actual response
        return extract_response_after_thinking(raw_response)
        
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        raise

@router.post("/text-to-speech")
async def text_to_speech(request: dict):
    """
    Convert text to speech using OpenAI's advanced TTS API.
    """
    if not openai_client:
        raise HTTPException(status_code=503, detail="OpenAI API not configured")
    
    try:
        text = request.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        # Use OpenAI's TTS API with natural voice
        response = openai_client.audio.speech.create(
            model="tts-1",  # Fast model for real-time
            voice="nova",   # Natural female voice - warm and engaging
            input=text,
            speed=0.9       # Slightly slower for healthcare context
        )
        
        # Convert audio to base64 for frontend
        import base64
        audio_content = response.content
        audio_base64 = base64.b64encode(audio_content).decode('utf-8')
        
        return {
            "audio_base64": audio_base64,
            "provider": "openai",
            "voice": "nova",
            "status": "success"
        }
        
    except Exception as e:
        print(f"Error in text-to-speech: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {str(e)}")

@router.post("/generate-avatar")
async def generate_avatar():
    """
    Generate a compassionate female doctor image using OpenAI GPT IMAGE responses API.
    """
    if not openai_client:
        raise HTTPException(status_code=503, detail="OpenAI API not configured")
    
    try:
        print("🎨 Generating Dr. Maya avatar using GPT IMAGE responses API...")
        
        # Generate image using OpenAI's responses API with image generation tool
        response = openai_client.responses.create(
            model="gpt-4.1-mini",
            input="Generate an image of a compassionate female doctor with warm, kind eyes and a gentle smile. Professional medical attire, soft lighting, approachable and trustworthy appearance. Healthcare professional portrait, clean background, photorealistic style. Conveying empathy, expertise, and caring bedside manner.",
            tools=[{"type": "image_generation"}],
        )
        
        print("✅ GPT IMAGE response received, extracting image data...")
        
        # Extract image data from response
        image_data = [
            output.result
            for output in response.output
            if output.type == "image_generation_call"
        ]
        
        if image_data:
            import base64
            
            # Decode base64 image data
            image_base64 = image_data[0]
            image_bytes = base64.b64decode(image_base64)
            
            print(f"✅ GPT IMAGE generated {len(image_bytes)} bytes of image data")
            
            # Return the image as a direct response
            from fastapi.responses import Response
            return Response(
                content=image_bytes,
                media_type="image/png",
                headers={
                    "Content-Disposition": "inline; filename=dr_maya_avatar.png",
                    "Cache-Control": "public, max-age=3600"
                }
            )
        else:
            print("❌ No image data returned from GPT IMAGE API")
            raise HTTPException(status_code=500, detail="No image data returned from GPT IMAGE API")
        
    except Exception as e:
        print(f"❌ Error generating avatar with GPT IMAGE: {str(e)}")
        raise HTTPException(status_code=500, detail=f"GPT IMAGE generation failed: {str(e)}")

@router.get("/health")
async def ai_health_check():
    """Check AI service availability."""
    return {
        "openai_available": openai_client is not None,
        "anthropic_available": anthropic_client is not None,
        "whisper_available": openai_client is not None,
        "tts_available": openai_client is not None,
        "image_generation_available": openai_client is not None,
        "status": "healthy"
    }