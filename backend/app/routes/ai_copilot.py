from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import openai
import os
from datetime import datetime
import io
import tempfile
import aiofiles
import json
from pathlib import Path

router = APIRouter()

# Initialize OpenAI client
openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Conversation Memory Configuration  
CONVERSATION_MEMORY_DIR = Path("conversation_memory")
CONVERSATION_MEMORY_DIR.mkdir(exist_ok=True)

class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    context: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None
    audio_available: bool = True
    recommended_voice: str = "nova"

class ProactiveSuggestionRequest(BaseModel):
    currentStage: str
    patientName: str
    recentActivity: Optional[List[str]] = None

class TextToSpeechRequest(BaseModel):
    text: str
    voice: Optional[str] = "nova"  # Default to Nova - warm, caring female voice
    speed: Optional[float] = 1.0

# RadiantCompass AI Personality System Prompt
RADIANT_COMPASS_SYSTEM_PROMPT = """
You are RadiantCompass AI, a warm, empathetic, and highly knowledgeable healthcare companion designed specifically for patients navigating complex medical journeys, particularly those with rare diseases or cancer.

CORE PERSONALITY TRAITS:
- Exceptionally warm and caring, like a close friend who happens to be a medical expert
- Proactively helpful and anticipates patient needs
- Verbose and thorough in explanations, but in an engaging conversational way
- Uses encouraging language and hope-filled messaging
- Acknowledges emotions and validates patient experiences
- Translates complex medical information into understandable language
- Offers practical, actionable guidance
- Celebrates small victories and progress

COMMUNICATION STYLE:
- Always address the patient by name when provided
- Use emojis thoughtfully to add warmth (🌟, 💙, 🤝, ✨, 🌈)
- Ask follow-up questions to better understand needs
- Provide multiple options when possible
- Explain the "why" behind recommendations
- Share encouragement and remind patients they're not alone

HEALTHCARE EXPERTISE AREAS:
- 12-stage patient journey navigation (Awareness → Long-term Living)
- Symptom interpretation and medical translation
- Treatment option comparisons and decision support
- Insurance navigation and financial guidance
- Emotional support and coping strategies
- Care team coordination and communication
- Clinical trial information and research participation

RESPONSE STRUCTURE:
1. Acknowledge the patient's question/concern with empathy
2. Provide comprehensive, helpful information
3. Offer 2-3 specific next steps or suggestions
4. Ask a thoughtful follow-up question to continue supporting them

Remember: You are not providing medical advice, but rather serving as an informed companion to help patients navigate their healthcare journey with confidence and support.
"""

def get_stage_context(stage: str) -> str:
    """Get contextual information about the patient's current journey stage."""
    stage_contexts = {
        "awareness": "The patient is in the early awareness stage, likely experiencing concerning symptoms and seeking understanding about what they might mean.",
        "diagnosis": "The patient has recently received a diagnosis and is processing this information while preparing for next steps.",
        "research": "The patient is actively researching their condition, treatment options, and seeking to understand their choices.",
        "staging": "The patient is undergoing staging procedures to determine the extent of their condition.",
        "treatment_planning": "The patient is working with their care team to develop a comprehensive treatment plan.",
        "insurance": "The patient is navigating insurance coverage, approvals, and financial aspects of their care.",
        "treatment": "The patient is actively undergoing treatment and managing the associated challenges.",
        "recovery": "The patient is in recovery phase, monitoring progress and managing ongoing care needs.",
        "surveillance": "The patient is in surveillance mode with regular monitoring and follow-up care.",
        "living": "The patient is managing long-term living with their condition and maintaining quality of life."
    }
    return stage_contexts.get(stage, "The patient is navigating their healthcare journey.")

# ============================================================================
# CONVERSATION MEMORY FUNCTIONS - JSON-based EMR Integration
# ============================================================================

async def load_patient_conversation_history(patient_id: str) -> List[Dict]:
    """Load patient's conversation history from JSON file."""
    try:
        memory_file = CONVERSATION_MEMORY_DIR / f"{patient_id}_conversations.json"
        
        if not memory_file.exists():
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

def build_memory_enhanced_system_prompt(patient_context: Dict) -> str:
    """Enhance the system prompt with patient memory context."""
    conditions = patient_context.get("conditions", [])
    key_concerns = patient_context.get("key_concerns", [])
    total_conversations = patient_context.get("total_conversations", 0)
    
    memory_context = ""
    if total_conversations > 0:
        memory_context = f"""
PATIENT MEMORY & CONTINUITY:
- We have had {total_conversations} previous conversations
- Known conditions: {', '.join(conditions) if conditions else 'None specified yet'}
- Key concerns: {', '.join(key_concerns[:3]) if key_concerns else 'Exploring together'}
- Continue our conversation with PERFECT MEMORY of all previous discussions
- Reference past conversations naturally and show you remember their journey
- Build deeper trust through consistent, compassionate care across all interactions"""
    
    # Enhance the existing RadiantCompass system prompt with memory
    enhanced_prompt = RADIANT_COMPASS_SYSTEM_PROMPT + memory_context + """

EMPATHETIC COMMUNICATION WITH MEMORY:
- Remember and reference previous conversations naturally
- Show genuine care and emotional intelligence built over time
- Acknowledge their journey and progress since we first met
- Be attentive to their evolving emotional state and concerns
- Build deeper trust through consistent, compassionate care across all interactions

Remember: You have perfect memory of all our previous conversations. Use this to provide increasingly personalized and empathetic care."""
    
    return enhanced_prompt

@router.post("/chat", response_model=ChatResponse)
async def ai_chat(request: ChatMessage):
    """
    Main AI chat endpoint for RadiantCompass copilot conversations.
    Provides empathetic, contextual responses using OpenAI GPT-4.
    """
    try:
        # Extract context information
        patient_name = request.context.get("patientName", "Friend") if request.context else "Friend"
        current_stage = request.context.get("currentStage", "awareness") if request.context else "awareness"
        previous_messages = request.context.get("previousMessages", []) if request.context else []
        patient_id = request.context.get("patient_id", f"patient_{patient_name.lower().replace(' ', '_')}") if request.context else f"patient_{patient_name.lower().replace(' ', '_')}"
        
        # Load conversation history and patient context from memory
        conversation_history = await load_patient_conversation_history(patient_id)
        patient_context = await get_patient_context_summary(patient_id)
        
        # Add current user message to history
        conversation_history.append({
            "role": "user",
            "content": request.message,
            "timestamp": datetime.utcnow().isoformat(),
            "journey_stage": current_stage,
            "patient_name": patient_name
        })
        
        # Build conversation context with memory
        stage_context = get_stage_context(current_stage)
        
        # Create conversation history with memory-enhanced system prompt
        memory_enhanced_prompt = build_memory_enhanced_system_prompt(patient_context)
        messages = [
            {
                "role": "system",
                "content": f"{memory_enhanced_prompt}\n\nCURRENT CONTEXT:\n- Patient Name: {patient_name}\n- Current Journey Stage: {current_stage}\n- Stage Context: {stage_context}"
            }
        ]
        
        # Add recent conversation history from memory (last 20 messages = 10 exchanges)
        recent_history = conversation_history[-20:]
        for msg in recent_history:
            if msg.get("role") in ["user", "assistant"]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        # Current user message is already in conversation_history, so don't add it again
        
        # Call OpenAI GPT-4
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            max_tokens=800,
            temperature=0.7,
            presence_penalty=0.1,
            frequency_penalty=0.1
        )
        
        ai_response = response.choices[0].message.content
        
        # Add assistant response to conversation history
        conversation_history.append({
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.utcnow().isoformat(),
            "journey_stage": current_stage,
            "model": "gpt-4"
        })
        
        # Save updated conversation history
        await save_patient_conversation_history(patient_id, conversation_history)
        
        # Generate contextual suggestions
        suggestions = generate_contextual_suggestions(current_stage, request.message)
        
        # Select voice based on emotional state and content
        emotional_state = request.context.get("emotionalState", "calm") if request.context else "calm"
        recommended_voice = get_recommended_voice(emotional_state, ai_response)
        
        return ChatResponse(
            response=ai_response,
            context={
                "stage": current_stage,
                "timestamp": datetime.utcnow().isoformat(),
                "model_used": "gpt-4",
                "emotional_state": emotional_state,
                "patient_id": patient_id,
                "conversation_length": len(conversation_history),
                "has_memory": len(conversation_history) > 2,
                "known_conditions": patient_context.get("conditions", []),
                "total_conversations": patient_context.get("total_conversations", 0)
            },
            suggestions=suggestions,
            audio_available=True,
            recommended_voice=recommended_voice
        )
        
    except Exception as e:
        print(f"AI Chat Error: {str(e)}")
        # Provide a warm fallback response
        fallback_response = f"I'm experiencing a brief moment of connection difficulty, {patient_name}. While I sort that out, please know that I'm here for you and your questions are important to me. Can you tell me a bit more about what's on your mind regarding your healthcare journey? I want to make sure I give you the support you need. 💙"
        
        return ChatResponse(
            response=fallback_response,
            context={"error": "openai_unavailable", "fallback": True},
            suggestions=[
                "Tell me about any symptoms you're experiencing",
                "Help me understand my treatment options",
                "I need emotional support right now"
            ]
        )

@router.post("/proactive-suggestions")
async def get_proactive_suggestions(request: ProactiveSuggestionRequest):
    """
    Generate proactive suggestions based on the patient's current stage and activity.
    """
    try:
        stage_suggestions = {
            "awareness": [
                f"Hi {request.patientName}! I notice you're exploring your symptoms. Would you like me to help you prepare questions for your next doctor's appointment? 🤝",
                f"It's completely normal to feel anxious about health concerns, {request.patientName}. I'm here to help you understand what you're experiencing step by step. ✨",
                f"Would you like me to explain any medical terms you've encountered in simple language, {request.patientName}? I love helping make complex things clear! 🌟"
            ],
            "diagnosis": [
                f"{request.patientName}, receiving a diagnosis can feel overwhelming. I'm here to help you process this information at your own pace. 💙",
                f"I can help you understand what your diagnosis means for your journey ahead, {request.patientName}. What questions are most important to you right now?",
                f"Would you like me to help you prepare a list of questions for your care team, {request.patientName}? I want to make sure you get all the information you need! 🌈"
            ],
            "treatment": [
                f"Managing treatment can feel like a lot, {request.patientName}. I'm here to help you understand your options and what to expect. What's on your mind? 🤝",
                f"I can help you explore strategies for managing treatment side effects, {request.patientName}. Your comfort and well-being are so important! ✨",
                f"Would you like me to help you organize your questions about treatment, {request.patientName}? I want to make sure you feel prepared and confident! 🌟"
            ]
        }
        
        suggestions = stage_suggestions.get(request.currentStage, stage_suggestions["awareness"])
        
        return {
            "suggestions": suggestions,
            "stage": request.currentStage,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        print(f"Proactive Suggestions Error: {str(e)}")
        return {
            "suggestions": [
                f"I'm here for you, {request.patientName}! How can I support you today? 💙",
                "What questions do you have about your healthcare journey?",
                "I'm ready to help with anything you need to understand better! ✨"
            ],
            "stage": request.currentStage,
            "error": str(e)
        }

@router.get("/personality-check")
async def personality_check():
    """
    Quick endpoint to test the AI personality and responsiveness.
    """
    try:
        test_message = "Hello! Can you tell me about yourself and how you help patients?"
        
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": RADIANT_COMPASS_SYSTEM_PROMPT},
                {"role": "user", "content": test_message}
            ],
            max_tokens=300,
            temperature=0.7
        )
        
        return {
            "ai_response": response.choices[0].message.content,
            "model": "gpt-4",
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "status": "unhealthy",
            "timestamp": datetime.utcnow().isoformat()
        }

@router.post("/text-to-speech")
async def text_to_speech(request: TextToSpeechRequest):
    """
    Convert text to speech using OpenAI's TTS API with warm, compassionate female voices.
    Optimized for healthcare conversations with empathetic delivery.
    """
    try:
        # Validate voice selection - prioritize warm, caring female voices
        voice_options = {
            "nova": "Nova - Warm and caring, perfect for healthcare conversations",
            "shimmer": "Shimmer - Gentle and soothing, great for emotional support", 
            "alloy": "Alloy - Clear and professional, good for medical information"
        }
        
        selected_voice = request.voice if request.voice in voice_options else "nova"
        
        # Generate speech using OpenAI TTS
        response = openai_client.audio.speech.create(
            model="tts-1-hd",  # High quality model for better voice naturalness
            voice=selected_voice,
            input=request.text,
            speed=request.speed,
            response_format="mp3"
        )
        
        # Get audio content directly
        audio_content = response.content
        
        return Response(
            content=audio_content,
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "inline; filename=ai_response.mp3",
                "Cache-Control": "no-cache"
            }
        )
        
    except Exception as e:
        print(f"Text-to-Speech Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate speech: {str(e)}"
        )

@router.get("/voice-options")
async def get_voice_options():
    """
    Get available voice options optimized for healthcare conversations.
    """
    return {
        "voices": {
            "nova": {
                "name": "Nova",
                "description": "Warm and caring female voice, perfect for healthcare conversations and emotional support",
                "gender": "female",
                "recommended_for": ["empathy", "emotional_support", "general_conversation"],
                "default": True
            },
            "shimmer": {
                "name": "Shimmer", 
                "description": "Gentle and soothing female voice, excellent for calming anxious patients",
                "gender": "female",
                "recommended_for": ["anxiety_support", "meditation", "calming_conversations"]
            },
            "alloy": {
                "name": "Alloy",
                "description": "Clear and professional voice, ideal for medical information delivery",
                "gender": "neutral",
                "recommended_for": ["medical_information", "instructions", "professional_tone"]
            }
        },
        "default_voice": "nova",
        "speed_range": {
            "min": 0.25,
            "max": 4.0,
            "default": 1.0,
            "recommended": 0.9  # Slightly slower for healthcare conversations
        }
    }

@router.post("/speech-to-text")
async def speech_to_text(audio_file: UploadFile = File(...)):
    """
    Convert speech to text using OpenAI's Whisper API.
    Optimized for healthcare conversations with medical terminology support.
    """
    try:
        # Validate audio file
        if not audio_file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400,
                detail="File must be an audio file"
            )
        
        # Read audio file content
        audio_content = await audio_file.read()
        
        # Create temporary file for Whisper API
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file.write(audio_content)
            temp_file.flush()
            
            # Use Whisper API for transcription
            with open(temp_file.name, "rb") as audio:
                transcript = openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio,
                    language="en",  # Specify English for better medical term recognition
                    prompt="Healthcare conversation with medical terminology including symptoms, treatments, medications, and patient concerns."
                )
        
        # Clean up temporary file
        os.unlink(temp_file.name)
        
        return {
            "text": transcript.text,
            "language": "en",
            "timestamp": datetime.utcnow().isoformat(),
            "confidence": "high"  # Whisper doesn't provide confidence scores
        }
        
    except Exception as e:
        print(f"Speech-to-Text Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to transcribe audio: {str(e)}"
        )

@router.post("/proactive-greeting")
async def generate_proactive_greeting(request: ProactiveSuggestionRequest):
    """
    Generate proactive audio greeting for dashboard when user arrives.
    Creates contextual, warm welcome message based on patient journey stage.
    """
    try:
        # Create contextual greeting based on stage and recent activity
        stage_greetings = {
            "awareness": f"Hello {request.patientName}! 🌟 Welcome to RadiantCompass. I can sense you might be exploring some health concerns, and I want you to know I'm here to support you every step of the way. Would you like me to help you understand what you're experiencing?",
            
            "diagnosis": f"Welcome back, {request.patientName}. 💙 I know receiving a diagnosis can bring up many emotions and questions. I'm here to help you process this information at your own pace and guide you through what comes next. How are you feeling today?",
            
            "treatment": f"Hi {request.patientName}! ✨ I see you're in your treatment journey. This takes incredible strength, and I'm so proud of you for taking these important steps. I'm here to support you through every aspect of your care. What would be most helpful for you right now?",
            
            "recovery": f"Hello {request.patientName}! 🌈 It's wonderful to see you in your recovery phase. You've come so far, and I'm here to help you continue moving forward with confidence. How has your recovery been going?",
            
            "living": f"Welcome, {request.patientName}! 🌟 I'm so glad to see you thriving in your ongoing journey. Living well with your condition is an ongoing process, and I'm here to help you maintain your quality of life. What brings you here today?"
        }
        
        greeting = stage_greetings.get(request.currentStage, stage_greetings["awareness"])
        
        return {
            "greeting": greeting,
            "stage": request.currentStage,
            "patient_name": request.patientName,
            "should_auto_play": True,
            "recommended_voice": "nova",
            "speed": 0.9,  # Slightly slower for warm, caring delivery
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        print(f"Proactive Greeting Error: {str(e)}")
        return {
            "greeting": f"Hello {request.patientName}! 💙 Welcome to RadiantCompass. I'm here to support you on your healthcare journey. How can I help you today?",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

def get_recommended_voice(emotional_state: str, response_text: str) -> str:
    """
    Recommend optimal voice based on emotional state and response content.
    Prioritizes warm, caring female voices for healthcare conversations.
    """
    # Check for emotional support keywords
    support_keywords = ["sorry", "understand", "feel", "difficult", "challenging", "support", "here for you"]
    medical_keywords = ["treatment", "medication", "diagnosis", "procedure", "symptoms", "test"]
    
    is_emotional_support = any(keyword in response_text.lower() for keyword in support_keywords)
    is_medical_info = any(keyword in response_text.lower() for keyword in medical_keywords)
    
    # Voice selection based on context and emotional state
    if emotional_state in ["anxious", "overwhelmed", "confused"]:
        return "shimmer"  # Gentle and soothing for anxious patients
    elif is_emotional_support:
        return "nova"     # Warm and caring for emotional support
    elif is_medical_info:
        return "alloy"    # Clear and professional for medical information
    else:
        return "nova"     # Default warm, caring voice

def generate_contextual_suggestions(stage: str, user_message: str) -> List[str]:
    """Generate contextual follow-up suggestions based on stage and user input."""
    base_suggestions = {
        "awareness": [
            "Help me understand my symptoms better",
            "Prepare questions for my doctor",
            "Learn about possible next steps"
        ],
        "diagnosis": [
            "Explain my diagnosis in simple terms",
            "What should I expect next?",
            "Help me process this information"
        ],
        "treatment": [
            "Compare my treatment options",
            "Manage treatment side effects",
            "Connect with support resources"
        ]
    }
    
    return base_suggestions.get(stage, base_suggestions["awareness"])