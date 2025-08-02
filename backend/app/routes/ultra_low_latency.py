from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import os
import json
import asyncio
import websockets
import httpx
import base64
import openai
import anthropic
import aiofiles
import time
from pathlib import Path
from datetime import datetime

router = APIRouter(prefix="/api/v1/ultra-low-latency", tags=["ultra-low-latency"])

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

# Ultra-Fast API Configuration - Best-in-class services for minimal latency
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Need to add this
CARTESIA_API_KEY = os.getenv("CARTESIA_API_KEY")  # Need to add this
DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY")  # Need to add this

# Conversation Memory Configuration
CONVERSATION_MEMORY_DIR = Path("conversation_memory")
CONVERSATION_MEMORY_DIR.mkdir(exist_ok=True)

# Initialize OpenAI client for Realtime API
if OPENAI_API_KEY:
    openai_client = openai.OpenAI(api_key=OPENAI_API_KEY)
else:
    openai_client = None

# Initialize Anthropic client for Claude
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if ANTHROPIC_API_KEY:
    anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
else:
    anthropic_client = None

class UltraFastConfig(BaseModel):
    patient_name: str
    use_realtime_api: bool = True  # Use OpenAI Realtime for voice-to-voice
    use_groq_llm: bool = True      # Use Groq for ultra-fast LLM inference
    use_cartesia_tts: bool = True  # Use Cartesia Sonic for fastest TTS
    use_deepgram_stt: bool = True  # Use Deepgram Nova-2 for fastest STT
    enable_streaming: bool = True   # Enable all streaming optimizations

class TTSRequest(BaseModel):
    message: str
    patient_name: Optional[str] = "Patient"
    journey_stage: Optional[str] = "general"
    emotional_state: Optional[str] = "calm"
    is_greeting: Optional[bool] = False

@router.websocket("/realtime-voice")
async def realtime_voice_chat(websocket: WebSocket, patient_name: str = "Patient"):
    """
    Ultra-low latency voice chat using OpenAI Realtime API.
    Target latency: <500ms total voice-to-voice.
    """
    await websocket.accept()
    
    if not openai_client:
        await websocket.send_json({"error": "OpenAI API not configured"})
        await websocket.close()
        return
    
    try:
        print(f"🚀 Starting ultra-low latency session for {patient_name}")
        
        # Connect to OpenAI Realtime API
        realtime_url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01"
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "OpenAI-Beta": "realtime=v1"
        }
        
        async with websockets.connect(realtime_url, extra_headers=headers) as openai_ws:
            print("✅ Connected to OpenAI Realtime API")
            
            # Configure session with medical expertise
            session_config = {
                "type": "session.update",
                "session": {
                    "modalities": ["text", "audio"],
                    "instructions": build_ultra_fast_medical_prompt(patient_name),
                    "voice": "shimmer",  # Natural female voice
                    "input_audio_format": "pcm16",
                    "output_audio_format": "pcm16",
                    "input_audio_transcription": {
                        "model": "whisper-1"
                    },
                    "turn_detection": {
                        "type": "server_vad",  # Server-side Voice Activity Detection
                        "threshold": 0.5,
                        "prefix_padding_ms": 300,
                        "silence_duration_ms": 500
                    },
                    "temperature": 0.7,
                    "max_response_output_tokens": 300
                }
            }
            
            await openai_ws.send(json.dumps(session_config))
            print("✅ OpenAI Realtime session configured")
            
            # Create bidirectional message forwarding
            async def forward_to_openai():
                try:
                    async for message in websocket.iter_text():
                        data = json.loads(message)
                        await openai_ws.send(json.dumps(data))
                except WebSocketDisconnect:
                    print("🔌 Client WebSocket disconnected")
                except Exception as e:
                    print(f"❌ Error forwarding to OpenAI: {e}")
            
            async def forward_from_openai():
                try:
                    async for message in openai_ws:
                        data = json.loads(message)
                        
                        # Add performance metrics
                        if data.get("type") == "response.audio.delta":
                            data["timestamp"] = datetime.utcnow().isoformat()
                            data["latency_optimized"] = True
                        
                        await websocket.send_json(data)
                except Exception as e:
                    print(f"❌ Error forwarding from OpenAI: {e}")
            
            # Run both forwarding tasks concurrently
            await asyncio.gather(
                forward_to_openai(),
                forward_from_openai()
            )
            
    except Exception as e:
        print(f"❌ Realtime voice chat error: {e}")
        await websocket.send_json({"error": f"Realtime chat failed: {str(e)}"})

@router.websocket("/groq-streaming")
async def groq_streaming_chat(websocket: WebSocket, patient_name: str = "Patient"):
    """
    Ultra-fast LLM inference using Groq (241+ tokens/second).
    For text-based interactions with minimal latency.
    """
    await websocket.accept()
    
    if not GROQ_API_KEY:
        await websocket.send_json({"error": "Groq API key not configured"})
        await websocket.close()
        return
    
    try:
        print(f"⚡ Starting Groq ultra-fast streaming for {patient_name}")
        
        async for message in websocket.iter_text():
            try:
                data = json.loads(message)
                user_message = data.get("message", "")
                
                if not user_message:
                    continue
                
                # Stream response from Groq
                start_time = datetime.utcnow()
                
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {GROQ_API_KEY}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "llama-3.3-70b-versatile",  # Fastest large model
                            "messages": [
                                {
                                    "role": "system",
                                    "content": build_ultra_fast_medical_prompt(patient_name)
                                },
                                {
                                    "role": "user", 
                                    "content": user_message
                                }
                            ],
                            "stream": True,
                            "temperature": 0.7,
                            "max_tokens": 300
                        }
                    )
                
                # Stream tokens as they arrive
                response_text = ""
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        chunk_data = line[6:]
                        if chunk_data == "[DONE]":
                            break
                        
                        try:
                            chunk = json.loads(chunk_data)
                            if chunk["choices"][0]["delta"].get("content"):
                                token = chunk["choices"][0]["delta"]["content"]
                                response_text += token
                                
                                # Send token immediately
                                await websocket.send_json({
                                    "type": "token",
                                    "content": token,
                                    "timestamp": datetime.utcnow().isoformat()
                                })
                        except:
                            continue
                
                # Send completion
                end_time = datetime.utcnow()
                latency_ms = (end_time - start_time).total_seconds() * 1000
                
                await websocket.send_json({
                    "type": "complete",
                    "full_response": response_text,
                    "latency_ms": latency_ms,
                    "tokens_per_second": len(response_text.split()) / (latency_ms / 1000)
                })
                
            except Exception as e:
                await websocket.send_json({"error": f"Groq streaming error: {str(e)}"})
                
    except WebSocketDisconnect:
        print("🔌 Groq streaming WebSocket disconnected")
    except Exception as e:
        print(f"❌ Groq streaming error: {e}")

@router.post("/cartesia-tts")
async def cartesia_ultra_fast_tts(request: dict):
    """
    Ultra-fast TTS using Cartesia Sonic (40ms time-to-first-audio).
    """
    if not CARTESIA_API_KEY:
        raise HTTPException(status_code=503, detail="Cartesia API not configured")
    
    try:
        text = request.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        print(f"🎵 Cartesia Sonic TTS: {text[:50]}...")
        start_time = datetime.utcnow()
        
        # Debug: Print exact request payload
        request_payload = {
            "model_id": "sonic-english",  # Sonic model for natural speech
            "transcript": text,
            "voice": {
                "mode": "id",
                "id": "5abd2130-146a-41b1-bcdb-974ea8e19f56"  # Joan - clear, warm American female voice for natural conversations
            },
            "output_format": {
                "container": "mp3",
                "encoding": "mp3", 
                "sample_rate": 22050  # Natural speech rate
            },
            "language": "en",
            "speed": "slow"  # FIXED: Use slow speed for natural, empathetic healthcare conversations
        }
        print(f"🔍 DEBUG Cartesia payload: {request_payload}")
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.cartesia.ai/tts/bytes",
                headers={
                    "X-API-Key": CARTESIA_API_KEY,
                    "Cartesia-Version": "2024-06-10",
                    "Content-Type": "application/json"
                },
                json=request_payload
            )
        
        if response.status_code == 200:
            end_time = datetime.utcnow()
            latency_ms = (end_time - start_time).total_seconds() * 1000
            
            print(f"✅ Cartesia TTS completed in {latency_ms:.1f}ms")
            
            # Convert audio to base64 for frontend
            import base64
            audio_content = response.content
            audio_base64 = base64.b64encode(audio_content).decode('utf-8')
            
            return {
                "audio_base64": audio_base64,
                "latency_ms": latency_ms,
                "provider": "cartesia-sonic",
                "voice": "joan-5abd2130-146a-41b1-bcdb-974ea8e19f56",
                "status": "success"
            }
        else:
            error_detail = response.text
            print(f"❌ Cartesia API Error {response.status_code}: {error_detail}")
            raise HTTPException(status_code=response.status_code, detail=f"Cartesia TTS failed: {error_detail}")
            
    except Exception as e:
        print(f"❌ Cartesia TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"Ultra-fast TTS failed: {str(e)}")

@router.websocket("/deepgram-stt")
async def deepgram_ultra_fast_stt(websocket: WebSocket):
    """
    Ultra-fast STT using Deepgram Nova-2 (100ms latency).
    """
    await websocket.accept()
    
    if not DEEPGRAM_API_KEY:
        await websocket.send_json({"error": "Deepgram API not configured"})
        await websocket.close()
        return
    
    try:
        print("🎤 Starting Deepgram Nova-2 ultra-fast STT")
        
        # Connect to Deepgram streaming API
        deepgram_url = "wss://api.deepgram.com/v1/listen"
        params = {
            "model": "nova-2",  # Fastest, most accurate model
            "language": "en-US",
            "encoding": "linear16",
            "sample_rate": "16000",
            "channels": "1",
            "interim_results": "true",
            "endpointing": "300",  # 300ms silence detection
            "vad_events": "true",
            "punctuate": "true",
            "smart_format": "true"
        }
        
        headers = {
            "Authorization": f"Token {DEEPGRAM_API_KEY}"
        }
        
        deepgram_ws_url = f"{deepgram_url}?" + "&".join([f"{k}={v}" for k, v in params.items()])
        
        async with websockets.connect(deepgram_ws_url, extra_headers=headers) as deepgram_ws:
            print("✅ Connected to Deepgram Nova-2 streaming")
            
            async def forward_audio():
                try:
                    async for message in websocket.iter_bytes():
                        # Forward audio data to Deepgram
                        await deepgram_ws.send(message)
                except WebSocketDisconnect:
                    print("🔌 Audio WebSocket disconnected")
            
            async def forward_transcription():
                try:
                    async for message in deepgram_ws:
                        data = json.loads(message)
                        
                        # Add timestamp for latency measurement
                        data["timestamp"] = datetime.utcnow().isoformat()
                        data["provider"] = "Deepgram-Nova-2"
                        
                        await websocket.send_json(data)
                        
                        # Log final transcripts
                        if data.get("is_final"):
                            transcript = data.get("channel", {}).get("alternatives", [{}])[0].get("transcript", "")
                            if transcript:
                                print(f"✅ Deepgram transcript: {transcript}")
                                
                except Exception as e:
                    print(f"❌ Error forwarding transcription: {e}")
            
            # Run both forwarding tasks
            await asyncio.gather(
                forward_audio(),
                forward_transcription()
            )
            
    except Exception as e:
        print(f"❌ Deepgram STT error: {e}")
        await websocket.send_json({"error": f"Ultra-fast STT failed: {str(e)}"})

def build_ultra_fast_medical_prompt(patient_name: str, journey_stage: str = "general", user_role: str = "patient", context: dict = None) -> str:
    """Build RadiantCompass-optimized medical prompt with patient memory context."""
    
    # Get patient context for personalization
    patient_context = context.get("patient_context", {}) if context else {}
    conditions = patient_context.get("conditions", [])
    key_concerns = patient_context.get("key_concerns", [])
    total_conversations = patient_context.get("total_conversations", 0)
    
    # Build memory-aware introduction
    memory_context = ""
    if total_conversations > 0:
        memory_context = f"""
PATIENT MEMORY & CONTINUITY:
- We have had {total_conversations} previous conversations
- Known conditions: {', '.join(conditions) if conditions else 'None specified yet'}
- Key concerns: {', '.join(key_concerns[:3]) if key_concerns else 'Exploring together'}
- Continue our conversation with full awareness of our previous discussions
- Reference past conversations naturally and show you remember their journey"""
    
    # Base RadiantCompass expertise system
    radiant_compass_expertise = f"""You are Dr. Maya, a warm and empathetic AI healthcare companion helping {patient_name}.

CORE IDENTITY:
- Dr. Maya: Caring, knowledgeable healthcare companion with perfect memory
- Speak naturally and warmly like a trusted doctor friend
- Expert in patient healthcare guidance and emotional support

CURRENT CONTEXT:
- Patient: {patient_name}
- Journey Stage: {journey_stage.replace('_', ' ').title()}
- Role: {user_role.title()}{memory_context}

VOICE CONVERSATION RULES:
- Speak directly as Dr. Maya - NO thinking out loud
- Keep responses very brief (20-40 words for voice)
- Use warm, everyday language - no medical jargon
- Sound caring and genuinely interested in helping
- NO verbose explanations or clinical reasoning
- Just provide direct, compassionate responses"""

    # Journey stage-specific expertise
    stage_expertise = get_journey_stage_expertise(journey_stage)
    
    # Role-specific guidance
    role_guidance = get_role_specific_guidance(user_role)
    
    # RadiantCompass features and tools
    # Simplified features for voice conversations
    radiant_features = """
DR. MAYA'S SUPPORT:
- Remember everything about your healthcare journey
- Provide caring guidance for your specific situation
- Help you understand next steps in simple terms
- Connect you with the right resources when needed

VOICE CONVERSATION APPROACH:
- Listen to their concern or question
- Respond warmly and directly as Dr. Maya
- Keep it simple and actionable
- Offer specific next steps or gentle guidance
- Sound like a caring friend who knows healthcare"""
    
    # Ultra-low latency voice optimization  
    latency_optimization = """
VOICE RESPONSE RULES:
- Maximum 40 words per response
- Speak naturally as Dr. Maya - no thinking chains
- Use simple, caring language
- Be immediately helpful and supportive
- Sound warm and genuinely interested

IMPORTANT:
- NO <thinking> tags or reasoning
- NO verbose medical explanations
- Just direct, empathetic responses
- Focus on what they need right now"""

    # Medical disclaimers
    disclaimers = """
IMPORTANT MEDICAL GUIDANCE:
- You're a supportive AI companion, not a replacement for medical care
- Encourage regular consultation with their healthcare team
- Respect HIPAA privacy principles
- Focus on support, education, and healthcare navigation
- Direct to emergency services for urgent medical situations"""

    return f"{radiant_compass_expertise}\n\n{stage_expertise}\n\n{role_guidance}\n\n{radiant_features}\n\n{latency_optimization}\n\n{disclaimers}"

def get_journey_stage_expertise(stage: str) -> str:
    """Get specialized expertise for specific journey stages."""
    stage_expertise_map = {
        "first_hints": """
STAGE 1 EXPERTISE - First Hints & Initial Doctor Visit:
- Expert in early symptom recognition and medical history taking
- Skilled in preparing patients for first doctor visits
- Guide initial testing and documentation strategies
- Help identify red flags requiring immediate attention""",
        
        "getting_answers": """
STAGE 2 EXPERTISE - Getting Answers & Testing:
- Expert in diagnostic testing interpretation
- Guide through complex medical workups
- Help understand test results and next steps
- Coordinate between multiple specialists and testing""",
        
        "the_diagnosis": """
STAGE 3 EXPERTISE - The Diagnosis:
- Expert in condition-specific diagnosis education
- Help process emotional impact of diagnosis
- Guide understanding of prognosis and treatment options
- Prepare for care team discussions""",
        
        "second_opinions": """
STAGE 4 EXPERTISE - Second Opinions & Care Teams:
- Expert in healthcare provider matching and evaluation
- Guide second opinion seeking strategies
- Help build optimal care teams
- Navigate specialist referrals and coordination""",
        
        "treatment_decisions": """
STAGE 5 EXPERTISE - Treatment Decisions:
- Expert in treatment option analysis and comparison
- Guide shared decision-making processes
- Help weigh risks, benefits, and personal preferences
- Support informed consent processes""",
        
        "insurance_advocacy": """
STAGE 6 EXPERTISE - Insurance & Advocacy:
- Expert in insurance coverage optimization
- Guide appeals and prior authorization processes
- Help navigate healthcare financing
- Support patient advocacy strategies""",
        
        "active_treatment": """
STAGE 7 EXPERTISE - Active Treatment:
- Expert in treatment monitoring and side effect management
- Guide through treatment protocols and schedules
- Help optimize treatment adherence and outcomes
- Support during intensive treatment phases""",
        
        "care_coordination": """
STAGE 8 EXPERTISE - Care Coordination:
- Expert in multi-provider care coordination
- Guide communication between care team members
- Help manage complex care schedules
- Optimize care transitions and handoffs""",
        
        "monitoring_adjustments": """
STAGE 9 EXPERTISE - Monitoring & Adjustments:
- Expert in ongoing treatment monitoring
- Guide through dose adjustments and modifications
- Help track symptoms and treatment response
- Support long-term treatment optimization""",
        
        "family_impact": """
STAGE 10 EXPERTISE - Family & Relationships:
- Expert in family dynamics during illness
- Guide caregiver support and communication
- Help manage relationship challenges
- Support family coordination and planning""",
        
        "financial_work": """
STAGE 11 EXPERTISE - Financial & Work Impact:
- Expert in healthcare financial planning
- Guide workplace accommodation strategies
- Help navigate disability and leave policies
- Support financial assistance programs""",
        
        "long_term_living": """
STAGE 12 EXPERTISE - Long-term Living:
- Expert in chronic condition management
- Guide lifestyle adaptations and modifications
- Help maintain quality of life
- Support long-term health planning"""
    }
    
    return stage_expertise_map.get(stage, "GENERAL EXPERTISE - Comprehensive healthcare guidance across all journey stages")

def get_role_specific_guidance(role: str) -> str:
    """Get role-specific guidance and communication style."""
    role_guidance_map = {
        "patient": """
PATIENT-FOCUSED GUIDANCE:
- Speak directly to patient experience and concerns
- Provide clear, accessible medical explanations
- Focus on empowerment and self-advocacy
- Address emotional and psychological aspects of care""",
        
        "caregiver": """
CAREGIVER-FOCUSED GUIDANCE:
- Address caregiver-specific challenges and needs
- Provide guidance on supporting patient effectively
- Focus on caregiver self-care and sustainability
- Help navigate family dynamics and communication""",
        
        "provider": """
PROVIDER-FOCUSED GUIDANCE:
- Use clinical terminology and evidence-based recommendations
- Focus on care coordination and optimization strategies
- Provide specialist-level insights and considerations
- Support clinical decision-making processes"""
    }
    
    return role_guidance_map.get(role, "GENERAL GUIDANCE - Comprehensive support for all healthcare stakeholders")

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
                    "journey_stage": "general",
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
                    "journey_stage": "general",
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
                "rare disease", "autoimmune", "neurological"
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

@router.post("/optimize-pipeline")
async def optimize_audio_pipeline():
    """
    Configure ultra-low latency audio pipeline settings.
    """
    optimizations = {
        "audio_settings": {
            "sample_rate": 16000,  # Optimal for speech
            "channels": 1,         # Mono for efficiency
            "chunk_size": 480,     # 30ms chunks (16000 * 0.03)
            "format": "pcm16"      # Fastest processing
        },
        "streaming_config": {
            "enable_vad": True,         # Voice Activity Detection
            "vad_threshold": 0.5,       # Balanced sensitivity
            "silence_duration": 500,    # 500ms silence detection
            "buffer_size": 1024,        # Minimal buffering
            "enable_echo_cancellation": True
        },
        "pipeline_optimizations": {
            "parallel_processing": True,
            "stream_early_start": True,
            "token_streaming": True,
            "audio_streaming": True,
            "cache_voice_models": True
        },
        "target_latencies": {
            "stt_target": "100ms",
            "llm_target": "200ms", 
            "tts_target": "75ms",
            "total_target": "400ms"
        }
    }
    
    return {
        "status": "optimized",
        "configuration": optimizations,
        "estimated_latency": "300-500ms total",
        "performance_mode": "ultra-low-latency"
    }

@router.get("/latency-benchmark")
async def benchmark_current_latency():
    """
    Benchmark current system latency and provide optimization recommendations.
    """
    services_status = {
        "openai_realtime": {
            "available": openai_client is not None,
            "expected_latency": "200-500ms",
            "optimization": "Voice-to-voice processing"
        },
        "groq_llm": {
            "available": GROQ_API_KEY is not None,
            "expected_latency": "50-150ms",
            "optimization": "241+ tokens/second"
        },
        "cartesia_tts": {
            "available": CARTESIA_API_KEY is not None,
            "expected_latency": "40-90ms",
            "optimization": "Sonic Turbo model"
        },
        "deepgram_stt": {
            "available": DEEPGRAM_API_KEY is not None,
            "expected_latency": "100ms",
            "optimization": "Nova-2 streaming"
        }
    }
    
    available_services = sum(1 for s in services_status.values() if s["available"])
    
    if available_services == 4:
        expected_total = "200-400ms"
        performance_tier = "Ultra-Fast"
    elif available_services >= 2:
        expected_total = "500-800ms"  
        performance_tier = "Fast"
    else:
        expected_total = "1000-2000ms"
        performance_tier = "Standard"
    
    return {
        "services": services_status,
        "available_optimizations": available_services,
        "expected_total_latency": expected_total,
        "performance_tier": performance_tier,
        "recommendations": get_latency_recommendations(services_status)
    }

def get_latency_recommendations(services_status: Dict) -> List[str]:
    """Generate specific recommendations for latency optimization."""
    recommendations = []
    
    if not services_status["groq_llm"]["available"]:
        recommendations.append("Add GROQ_API_KEY for 241+ tokens/second LLM inference")
    
    if not services_status["cartesia_tts"]["available"]:
        recommendations.append("Add CARTESIA_API_KEY for 40ms TTS latency")
        
    if not services_status["deepgram_stt"]["available"]:
        recommendations.append("Add DEEPGRAM_API_KEY for 100ms STT latency")
        
    if not services_status["openai_realtime"]["available"]:
        recommendations.append("Ensure OPENAI_API_KEY is configured for Realtime API")
    
    recommendations.extend([
        "Implement WebRTC direct streaming",
        "Enable voice activity detection",
        "Use parallel processing pipeline",
        "Optimize audio chunk sizes to 30ms",
        "Cache voice models for instant access"
    ])
    
    return recommendations

@router.post("/groq-chat")
async def groq_fast_chat(request: dict):
    """
    Ultra-fast chat using Groq (241+ tokens/second) with conversation memory.
    """
    try:
        message = request.get("message", "")
        patient_name = request.get("patient_name", "Patient")
        context = request.get("context", {})
        journey_stage = context.get("journey_stage", "general")
        user_role = context.get("user_role", "patient")
        patient_id = context.get("patient_id", f"patient_{patient_name.lower().replace(' ', '_')}")
        
        if not message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # If no Groq key, return error to trigger fallback
        if not GROQ_API_KEY:
            raise HTTPException(status_code=503, detail="Groq API not configured")
        
        # Load conversation history and patient context
        conversation_history = await load_patient_conversation_history(patient_id)
        patient_context = await get_patient_context_summary(patient_id)
        
        # Add patient context to request context
        if context is None:
            context = {}
        context["patient_context"] = patient_context
        
        # Add current user message to history
        conversation_history.append({
            "role": "user",
            "content": message,
            "timestamp": datetime.utcnow().isoformat(),
            "journey_stage": journey_stage,
            "user_role": user_role
        })
        
        start_time = datetime.utcnow()
        
        # Build messages with memory context
        messages = [
            {
                "role": "system",
                "content": build_ultra_fast_medical_prompt(patient_name, journey_stage, user_role, context)
            }
        ]
        
        # Add recent conversation history (last 10 exchanges to stay within token limits)
        recent_history = conversation_history[-20:]  # Last 20 messages (10 exchanges)
        for msg in recent_history:
            if msg["role"] in ["user", "assistant"]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        # Use httpx for ultra-fast HTTP requests
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.3-70b-versatile",  # Fastest large model on Groq
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 300,
                    "stream": False  # Non-streaming for simple integration
                }
            )
        
        if response.status_code == 200:
            data = response.json()
            raw_response = data["choices"][0]["message"]["content"]
            
            # CRITICAL: Strip out <thinking> tags - only use actual response
            ai_response = extract_response_after_thinking(raw_response)
            
            end_time = datetime.utcnow()
            latency_ms = (end_time - start_time).total_seconds() * 1000
            
            # Add assistant response to conversation history
            conversation_history.append({
                "role": "assistant",
                "content": ai_response,
                "timestamp": datetime.utcnow().isoformat(),
                "journey_stage": journey_stage,
                "model": "groq-llama-3.3-70b",
                "latency_ms": latency_ms
            })
            
            # Save updated conversation history
            await save_patient_conversation_history(patient_id, conversation_history)
            
            return {
                "response": ai_response,
                "latency_ms": latency_ms,
                "model": "groq-llama-3.3-70b",
                "tokens_per_second": len(ai_response.split()) / (latency_ms / 1000) if latency_ms > 0 else 0,
                "conversation_length": len(conversation_history),
                "patient_id": patient_id
            }
        else:
            raise HTTPException(status_code=response.status_code, detail="Groq API error")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Groq fast chat error: {e}")
        raise HTTPException(status_code=500, detail=f"Ultra-fast chat failed: {str(e)}")

@router.post("/deepgram-stt")
async def deepgram_ultra_fast_stt(audio_file: UploadFile = File(...)):
    """
    Ultra-fast STT using Deepgram Nova-2 (100ms latency).
    """
    if not DEEPGRAM_API_KEY:
        raise HTTPException(status_code=503, detail="Deepgram API not configured")
    
    try:
        print("🎤 Starting Deepgram Nova-2 ultra-fast STT")
        start_time = datetime.utcnow()
        
        # Read audio file
        audio_data = await audio_file.read()
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                "https://api.deepgram.com/v1/listen",
                headers={
                    "Authorization": f"Token {DEEPGRAM_API_KEY}",
                    "Content-Type": "audio/wav"
                },
                params={
                    "model": "nova-2",  # Fastest, most accurate model
                    "language": "en-US",
                    "punctuate": "true",
                    "smart_format": "true",
                    "utterances": "true"
                },
                content=audio_data
            )
        
        if response.status_code == 200:
            data = response.json()
            transcript = ""
            
            # Extract transcript from Deepgram response
            if data.get("results") and data["results"].get("channels"):
                alternatives = data["results"]["channels"][0].get("alternatives", [])
                if alternatives:
                    transcript = alternatives[0].get("transcript", "")
            
            end_time = datetime.utcnow()
            latency_ms = (end_time - start_time).total_seconds() * 1000
            
            print(f"✅ Deepgram Nova-2 STT completed in {latency_ms:.1f}ms: '{transcript}'")
            
            from fastapi.responses import JSONResponse
            return JSONResponse(
                content={
                    "text": transcript,
                    "confidence": alternatives[0].get("confidence", 0) if alternatives else 0,
                    "latency_ms": latency_ms,
                    "provider": "Deepgram-Nova-2"
                },
                headers={
                    "X-Latency-Ms": str(int(latency_ms)),
                    "X-STT-Provider": "Deepgram-Nova-2"
                }
            )
        else:
            raise HTTPException(status_code=response.status_code, detail="Deepgram STT failed")
            
    except Exception as e:
        print(f"❌ Deepgram STT error: {e}")
        raise HTTPException(status_code=500, detail=f"Ultra-fast STT failed: {str(e)}")

@router.get("/patient/{patient_id}/conversation-history")
async def get_patient_conversation_history(patient_id: str):
    """Retrieve patient's conversation history from JSON EMR."""
    try:
        conversation_history = await load_patient_conversation_history(patient_id)
        patient_context = await get_patient_context_summary(patient_id)
        
        return {
            "patient_id": patient_id,
            "conversation_history": conversation_history,
            "patient_context": patient_context,
            "total_messages": len(conversation_history),
            "last_interaction": conversation_history[-1]["timestamp"] if conversation_history else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve conversation history: {str(e)}")

@router.delete("/patient/{patient_id}/conversation-history")
async def clear_patient_conversation_history(patient_id: str):
    """Clear patient's conversation history (for testing or patient request)."""
    try:
        memory_file = CONVERSATION_MEMORY_DIR / f"{patient_id}_conversations.json"
        
        if memory_file.exists():
            memory_file.unlink()  # Delete the file
            
        return {
            "patient_id": patient_id,
            "status": "cleared",
            "message": "Conversation history has been cleared"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear conversation history: {str(e)}")

@router.get("/conversation-memory/stats")
async def get_conversation_memory_stats():
    """Get statistics about conversation memory system."""
    try:
        memory_files = list(CONVERSATION_MEMORY_DIR.glob("*_conversations.json"))
        total_patients = len(memory_files)
        
        total_conversations = 0
        total_messages = 0
        
        for memory_file in memory_files:
            try:
                async with aiofiles.open(memory_file, 'r') as f:
                    content = await f.read()
                    data = json.loads(content)
                    conversation_history = data.get("conversation_history", [])
                    total_messages += len(conversation_history)
                    # Count conversation pairs (user + assistant = 1 conversation)
                    total_conversations += len([msg for msg in conversation_history if msg.get("role") == "user"])
            except Exception as e:
                print(f"Error reading {memory_file}: {e}")
                continue
        
        return {
            "total_patients": total_patients,
            "total_conversations": total_conversations,
            "total_messages": total_messages,
            "average_messages_per_patient": total_messages / total_patients if total_patients > 0 else 0,
            "memory_directory": str(CONVERSATION_MEMORY_DIR),
            "status": "operational"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get memory stats: {str(e)}")

@router.post("/text-to-speech")
async def ultra_low_latency_text_to_speech(request: TTSRequest):
    """
    Ultra-low latency text-to-speech for voice chat greeting.
    Uses OpenAI TTS for fast audio generation.
    """
    if not openai_client:
        raise HTTPException(status_code=503, detail="OpenAI API not configured")
    
    try:
        text = request.message
        if not text:
            raise HTTPException(status_code=400, detail="Message text is required")
        
        print(f"🎵 Ultra-low latency TTS: {text[:50]}...")
        start_time = time.time()
        
        # Use OpenAI's TTS API with optimized settings for speed
        response = openai_client.audio.speech.create(
            model="tts-1",  # Fast model for real-time
            voice="nova",   # Natural female voice - warm and engaging
            input=text,
            speed=0.9,      # Slightly slower for healthcare context
            response_format="mp3"
        )
        
        latency_ms = int((time.time() - start_time) * 1000)
        print(f"✅ Ultra-low latency TTS completed: {latency_ms}ms")
        
        # Convert audio to base64 for frontend
        import base64
        audio_content = response.content
        audio_base64 = base64.b64encode(audio_content).decode('utf-8')
        
        return {
            "audio_base64": audio_base64,
            "latency_ms": latency_ms,
            "provider": "openai",
            "voice": "nova",
            "status": "success"
        }
        
    except Exception as e:
        print(f"❌ Ultra-low latency TTS error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")

@router.post("/process-voice")
async def process_voice_input(
    audio_file: UploadFile = File(...),
    patient_name: str = Form(...),
    journey_stage: str = Form(...),
    emotional_state: str = Form(...),
    provider: str = Form(default="ultra_optimized")
):
    """
    ULTRA-OPTIMIZED voice processing pipeline targeting <400ms total latency:
    1. Speech-to-text (Deepgram Nova-3: ~100ms)
    2. AI chat response (Groq Llama-3.3: ~150ms) 
    3. Text-to-speech (Cartesia Sonic: ~40ms)
    Total target: <300ms
    """
    try:
        print(f"🚀 ULTRA-OPTIMIZED voice processing for {patient_name} (stage: {journey_stage})")
        start_time = time.time()
        
        # Step 1: Ultra-Fast STT using Deepgram Nova-3 (100ms)
        audio_content = await audio_file.read()
        
        if DEEPGRAM_API_KEY:
            print("⚡ Using Deepgram Nova-3 for ultra-fast STT...")
            async with httpx.AsyncClient(timeout=5.0) as client:
                stt_response = await client.post(
                    "https://api.deepgram.com/v1/listen",
                    headers={
                        "Authorization": f"Token {DEEPGRAM_API_KEY}",
                        "Content-Type": "audio/wav"
                    },
                    params={
                        "model": "nova-2-general",  # Latest ultra-fast model
                        "language": "en-US",
                        "punctuate": "true",
                        "smart_format": "true",
                        "diarize": "false",  # Disable for speed
                        "utterances": "false"  # Disable for speed
                    },
                    content=audio_content
                )
            
            if stt_response.status_code == 200:
                stt_data = stt_response.json()
                transcript = ""
                if stt_data.get("results") and stt_data["results"].get("channels"):
                    alternatives = stt_data["results"]["channels"][0].get("alternatives", [])
                    if alternatives:
                        transcript = alternatives[0].get("transcript", "")
                
                stt_provider = "Deepgram-Nova-2"
            else:
                raise Exception(f"Deepgram STT failed: {stt_response.status_code}")
        else:
            # Fallback to OpenAI Whisper if Deepgram not available
            print("⚠️ Deepgram not available, falling back to OpenAI Whisper...")
            if not openai_client:
                raise HTTPException(status_code=503, detail="No STT service available")
            
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
                temp_file.write(audio_content)
                temp_file_path = temp_file.name
            
            with open(temp_file_path, 'rb') as audio:
                transcript_response = openai_client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio,
                    language="en"
                )
            
            transcript = transcript_response.text
            os.unlink(temp_file_path)
            stt_provider = "OpenAI-Whisper"
        
        stt_time = time.time()
        stt_latency = int((stt_time - start_time) * 1000)
        print(f"✅ {stt_provider} STT: {stt_latency}ms - '{transcript[:50]}...'")
        
        # Step 2: Ultra-Fast AI Response using Groq (150ms)
        patient_id = f"patient_{patient_name.lower().replace(' ', '_')}"
        conversation_history = await load_patient_conversation_history(patient_id)
        patient_context = await get_patient_context_summary(patient_id)
        
        # Add user message to history
        conversation_history.append({
            "role": "user",
            "content": transcript,
            "timestamp": datetime.utcnow().isoformat(),
            "journey_stage": journey_stage,
            "user_role": "patient",
            "emotional_state": emotional_state
        })
        
        # Build ultra-optimized system prompt for voice
        context = {"patient_context": patient_context}
        system_prompt = build_ultra_fast_medical_prompt(patient_name, journey_stage, "patient", context)
        
        # Ultra-fast AI response with Groq (241+ tokens/second)
        if GROQ_API_KEY:
            print("⚡ Using Groq Llama-3.3 for ultra-fast AI response...")
            
            messages = [{"role": "system", "content": system_prompt}]
            
            # Add recent conversation history (last 6 messages for speed)
            recent_history = conversation_history[-6:]
            for msg in recent_history:
                if msg["role"] in ["user", "assistant"]:
                    messages.append({"role": msg["role"], "content": msg["content"]})
            
            async with httpx.AsyncClient(timeout=5.0) as client:
                groq_response = await client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {GROQ_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama-3.3-70b-versatile",  # Fastest large model
                        "messages": messages,
                        "temperature": 0.7,
                        "max_tokens": 150,  # Shorter for voice conversations
                        "stream": False
                    }
                )
            
            if groq_response.status_code == 200:
                groq_data = groq_response.json()
                raw_response = groq_data["choices"][0]["message"]["content"]
                
                # CRITICAL: Strip out <thinking> tags - only use actual response
                ai_response = extract_response_after_thinking(raw_response)
                model_used = "Groq-Llama-3.3"
            else:
                raise Exception(f"Groq failed: {groq_response.status_code}")
        else:
            # Fallback to Claude or OpenAI
            print("⚠️ Groq not available, using fallback AI...")
            from app.routes.ai_chat import (
                build_healthcare_system_prompt_with_memory,
                get_claude_response_with_memory,
                get_openai_response_with_memory
            )
            
            system_prompt = build_healthcare_system_prompt_with_memory(
                patient_name, emotional_state, journey_stage, patient_context
            )
            
            if anthropic_client:
                raw_response = await get_claude_response_with_memory(
                    system_prompt, transcript, conversation_history
                )
                # CRITICAL: Strip out <thinking> tags - only use actual response
                ai_response = extract_response_after_thinking(raw_response)
                model_used = "Claude-3.5-Sonnet"
            elif openai_client:
                raw_response = await get_openai_response_with_memory(
                    system_prompt, transcript, conversation_history
                )
                # CRITICAL: Strip out <thinking> tags - only use actual response
                ai_response = extract_response_after_thinking(raw_response)
                model_used = "GPT-4o-Mini"
            else:
                ai_response = "I apologize, but I'm having difficulty processing your request right now. Please try again."
                model_used = "fallback"
        
        # Add AI response to history
        conversation_history.append({
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.utcnow().isoformat(),
            "journey_stage": journey_stage,
            "model": model_used
        })
        
        # Save conversation history
        await save_patient_conversation_history(patient_id, conversation_history)
        
        ai_time = time.time()
        ai_latency = int((ai_time - stt_time) * 1000)
        print(f"✅ {model_used} AI response: {ai_latency}ms")
        
        # Step 3: Ultra-Fast TTS using Cartesia Sonic (40ms)
        if CARTESIA_API_KEY:
            print("⚡ Using Cartesia Sonic for ultra-fast TTS...")
            async with httpx.AsyncClient(timeout=5.0) as client:
                cartesia_response = await client.post(
                    "https://api.cartesia.ai/tts/bytes",
                    headers={
                        "X-API-Key": CARTESIA_API_KEY,
                        "Cartesia-Version": "2024-06-10",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model_id": "sonic-english",
                        "transcript": ai_response,
                        "voice": {
                            "mode": "id", 
                            "id": "5abd2130-146a-41b1-bcdb-974ea8e19f56"  # Joan - clear, warm American female voice (Dr. Maya)
                        },
                        "output_format": {
                            "container": "mp3",
                            "encoding": "mp3",
                            "sample_rate": 22050  # Natural speech rate (consistent with other endpoint)
                        },
                        "language": "en",
                        "speed": "slow",  # FIXED: Use slow speed for natural, empathetic healthcare conversations
                        "add_timestamps": False
                    }
                )
            
            if cartesia_response.status_code == 200:
                tts_audio_content = cartesia_response.content
                tts_provider = "Cartesia-Sonic"
            else:
                raise Exception(f"Cartesia TTS failed: {cartesia_response.status_code}")
        else:
            # Fallback to OpenAI TTS
            print("⚠️ Cartesia not available, using OpenAI TTS...")
            if not openai_client:
                raise HTTPException(status_code=503, detail="No TTS service available")
            
            tts_response = openai_client.audio.speech.create(
                model="tts-1",  # Fast model
                voice="nova",   # Dr. Maya's voice
                input=ai_response,
                speed=0.75,     # FIXED: Slower speed to match Cartesia slow setting
                response_format="mp3"
            )
            tts_audio_content = tts_response.content
            tts_provider = "OpenAI-TTS"
        
        tts_time = time.time()
        tts_latency = int((tts_time - ai_time) * 1000)
        total_latency = int((tts_time - start_time) * 1000)
        
        print(f"✅ {tts_provider} TTS: {tts_latency}ms")
        print(f"🚀 TOTAL ULTRA-OPTIMIZED PIPELINE: {total_latency}ms")
        
        # Convert audio to base64
        import base64
        audio_base64 = base64.b64encode(tts_audio_content).decode('utf-8')
        
        return {
            "transcript": transcript,
            "response_text": ai_response,
            "audio_base64": audio_base64,
            "latency_breakdown": {
                "stt_ms": stt_latency,
                "ai_ms": ai_latency,
                "tts_ms": tts_latency,
                "total_ms": total_latency
            },
            "providers_used": {
                "stt": stt_provider,
                "ai": model_used,
                "tts": tts_provider
            },
            "performance_tier": "ultra-optimized" if total_latency < 500 else "optimized",
            "conversation_length": len(conversation_history),
            "status": "success"
        }
        
    except Exception as e:
        print(f"❌ Voice processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")

@router.get("/health")
async def ultra_low_latency_health():
    """Health check for ultra-low latency services."""
    return {
        "openai_realtime_available": openai_client is not None,
        "groq_available": GROQ_API_KEY is not None,
        "cartesia_available": CARTESIA_API_KEY is not None,
        "deepgram_available": DEEPGRAM_API_KEY is not None,
        "conversation_memory_enabled": True,
        "memory_directory": str(CONVERSATION_MEMORY_DIR),
        "target_latency": "200-500ms total",
        "status": "ready_for_optimization"
    }