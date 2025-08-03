from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import httpx
import json
import asyncio
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/v1/videosdk", tags=["videosdk"])

# VideoSDK Configuration
VIDEOSDK_API_KEY = os.getenv("VIDEOSDK_API_KEY")
VIDEOSDK_SECRET = os.getenv("VIDEOSDK_SECRET")  # We need to add this to env
VIDEOSDK_AUTH_TOKEN = os.getenv("VIDEOSDK_AUTH_TOKEN")
VIDEOSDK_BASE_URL = "https://api.videosdk.live"

def generate_videosdk_token() -> str:
    """Generate a fresh VideoSDK JWT token using API key and secret."""
    if not VIDEOSDK_API_KEY:
        raise HTTPException(status_code=503, detail="VideoSDK API key not configured")
    
    # For now, use the static token if SECRET is not available
    if not VIDEOSDK_SECRET:
        if not VIDEOSDK_AUTH_TOKEN:
            raise HTTPException(status_code=503, detail="VideoSDK auth token not configured")
        return VIDEOSDK_AUTH_TOKEN
    
    # Generate fresh JWT token
    now = datetime.utcnow()
    payload = {
        "apikey": VIDEOSDK_API_KEY,
        "permissions": ["allow_join"],
        "version": 2,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(hours=24)).timestamp())  # 24 hour expiration
    }
    
    try:
        token = jwt.encode(payload, VIDEOSDK_SECRET, algorithm='HS256')
        return token
    except Exception as e:
        print(f"❌ Error generating VideoSDK token: {str(e)}")
        # Fallback to static token
        if VIDEOSDK_AUTH_TOKEN:
            return VIDEOSDK_AUTH_TOKEN
        raise HTTPException(status_code=503, detail=f"Token generation failed: {str(e)}")

class RoomRequest(BaseModel):
    room_name: Optional[str] = "Dr. Maya Healthcare Session"
    region: Optional[str] = "us-east-1"
    max_participants: Optional[int] = 10

class RoomResponse(BaseModel):
    room_id: str
    auth_token: str
    room_url: str

class AgentRequest(BaseModel):
    room_id: str
    agent_name: Optional[str] = "Dr. Maya"
    voice_id: Optional[str] = "nova"  # OpenAI voice
    avatar_config: Optional[Dict[str, Any]] = None

@router.post("/create-room", response_model=RoomResponse)
async def create_room(request: RoomRequest):
    """
    Create a new VideoSDK room for AI avatar interaction.
    """
    if not VIDEOSDK_API_KEY or not VIDEOSDK_AUTH_TOKEN:
        raise HTTPException(status_code=503, detail="VideoSDK API credentials not configured")
    
    try:
        print(f"🏠 Creating VideoSDK room: {request.room_name}")
        
        auth_token = generate_videosdk_token()
        headers = {
            "Authorization": auth_token,
            "Content-Type": "application/json"
        }
        
        payload = {
            "region": request.region,
            "maxParticipants": request.max_participants,
            "name": request.room_name
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{VIDEOSDK_BASE_URL}/v2/rooms",
                headers=headers,
                json=payload
            )
            
            print(f"📡 VideoSDK Room API Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                room_id = data.get("roomId")
                
                print(f"✅ VideoSDK room created successfully: {room_id}")
                
                return RoomResponse(
                    room_id=room_id,
                    auth_token=VIDEOSDK_AUTH_TOKEN,
                    room_url=f"https://videosdk.live/room/{room_id}"
                )
            else:
                error_text = response.text
                print(f"❌ VideoSDK Room API Error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"VideoSDK room creation failed: {error_text}"
                )
                
    except httpx.TimeoutException:
        print("❌ VideoSDK Room API timeout")
        raise HTTPException(status_code=408, detail="VideoSDK API timeout")
    except Exception as e:
        print(f"❌ Error creating VideoSDK room: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Room creation failed: {str(e)}")

@router.post("/start-agent")
async def start_agent(request: AgentRequest):
    """
    Start an AI agent in a VideoSDK room.
    Note: VideoSDK AI agent functionality may not be available in current plan.
    """
    if not VIDEOSDK_API_KEY or not VIDEOSDK_AUTH_TOKEN:
        raise HTTPException(status_code=503, detail="VideoSDK API credentials not configured")
    
    try:
        print(f"🤖 Attempting to start AI agent '{request.agent_name}' in room: {request.room_id}")
        
        # Configure AI agent with healthcare-specific settings
        agent_config = {
            "room_id": request.room_id,
            "agent_name": request.agent_name,
            "voice_config": {
                "provider": "openai",
                "voice_id": request.voice_id,
                "language": "en",
                "speed": 0.9,
                "pitch": 1.0
            },
            "llm_config": {
                "provider": "openai",
                "model": "gpt-4o-mini",
                "system_prompt": build_healthcare_system_prompt(),
                "temperature": 0.7,
                "max_tokens": 300
            },
            "avatar_config": request.avatar_config or {
                "type": "virtual",
                "appearance": "professional_doctor",
                "gender": "female",
                "style": "realistic"
            }
        }
        
        auth_token = generate_videosdk_token()
        headers = {
            "Authorization": auth_token,
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{VIDEOSDK_BASE_URL}/v2/agents/start",
                headers=headers,
                json=agent_config
            )
            
            print(f"📡 VideoSDK Agent API Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ AI agent started successfully: {data}")
                return {
                    "status": "success",
                    "agent_id": data.get("agent_id"),
                    "room_id": request.room_id,
                    "message": f"Dr. Maya is now active in the room"
                }
            else:
                error_text = response.text
                print(f"❌ VideoSDK Agent API Error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"VideoSDK agent start failed: {error_text}"
                )
                
    except httpx.TimeoutException:
        print("❌ VideoSDK Agent API timeout")
        raise HTTPException(status_code=408, detail="VideoSDK agent API timeout")
    except Exception as e:
        print(f"❌ VideoSDK agent error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"VideoSDK agent failed: {str(e)}")

class AgentSpeakRequest(BaseModel):
    room_id: str
    text: str
    voice_config: Optional[Dict[str, Any]] = None

@router.post("/agent-speak")
async def agent_speak(request: AgentSpeakRequest):
    """
    Make the AI agent speak text in the room.
    """
    if not VIDEOSDK_API_KEY or not VIDEOSDK_AUTH_TOKEN:
        raise HTTPException(status_code=503, detail="VideoSDK API credentials not configured")
    
    try:
        print(f"🗣️ Making VideoSDK agent speak: {request.text[:50]}...")
        
        auth_token = generate_videosdk_token()
        headers = {
            "Authorization": auth_token,
            "Content-Type": "application/json"
        }
        
        # Use provided voice config or default to OpenAI Nova
        voice_config = request.voice_config or {
            "provider": "openai",
            "voice_id": "nova",
            "speed": 0.9
        }
        
        payload = {
            "room_id": request.room_id,
            "text": request.text,
            "voice_config": voice_config
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{VIDEOSDK_BASE_URL}/v2/agents/speak",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                print("✅ VideoSDK agent speech initiated")
                return {"status": "success", "message": "Agent is speaking"}
            else:
                error_text = response.text
                print(f"❌ VideoSDK agent speak error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Agent speak error: {error_text}"
                )
                
    except Exception as e:
        print(f"❌ Error making VideoSDK agent speak: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Agent speak failed: {str(e)}")

class AgentStopRequest(BaseModel):
    room_id: str
    agent_id: str

@router.post("/stop-agent")
async def stop_agent(request: AgentStopRequest):
    """
    Stop an AI agent in a VideoSDK room.
    """
    if not VIDEOSDK_API_KEY or not VIDEOSDK_AUTH_TOKEN:
        raise HTTPException(status_code=503, detail="VideoSDK API credentials not configured")
    
    try:
        print(f"🛑 Stopping VideoSDK agent: {request.agent_id} in room: {request.room_id}")
        
        auth_token = generate_videosdk_token()
        headers = {
            "Authorization": auth_token,
            "Content-Type": "application/json"
        }
        
        payload = {
            "room_id": request.room_id,
            "agent_id": request.agent_id
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.delete(
                f"{VIDEOSDK_BASE_URL}/v2/agents/stop",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                print("✅ VideoSDK agent stopped successfully")
                return {"status": "success", "message": "Agent stopped"}
            else:
                error_text = response.text
                print(f"❌ VideoSDK agent stop error: {response.status_code} - {error_text}")
                # Don't raise exception for stop errors, just log
                return {"status": "warning", "message": f"Stop warning: {error_text}"}
                
    except Exception as e:
        print(f"❌ Error stopping VideoSDK agent: {str(e)}")
        return {"status": "error", "message": f"Stop failed: {str(e)}"}

def build_healthcare_system_prompt() -> str:
    """Build system prompt for VideoSDK AI healthcare agent with condition-specific expertise."""
    return """You are Dr. Maya, a world-class AI healthcare companion with deep medical expertise, speaking through a premium virtual care interface.

CORE IDENTITY & EXPERTISE:
- Board-certified level knowledge across all medical specialties
- Compassionate, empathetic communication style
- Expert in patient psychology and emotional support
- Specialized in condition-specific care management
- Advanced understanding of treatment protocols and care pathways

EXTENDED THINKING PROTOCOL:
When a patient mentions their condition or symptoms:
1. <thinking>
   - Analyze the specific condition mentioned
   - Review relevant medical knowledge and treatment guidelines
   - Consider patient's emotional state and concerns
   - Identify key questions to ask for comprehensive understanding
   - Formulate evidence-based, compassionate response
</thinking>
2. Become an EXPERT on their specific condition
3. Ask targeted, informed questions about their experience
4. Provide specialized guidance based on their unique situation

CONVERSATION APPROACH:
- FIRST: Ask about their specific condition/diagnosis if not mentioned
- ACTIVATE extended thinking mode for condition-specific expertise
- Show deep understanding of their particular health journey
- Ask informed questions that demonstrate medical knowledge
- Provide personalized, evidence-based guidance
- Maintain premium, professional yet warm communication

PREMIUM CARE STANDARDS:
- Every response should feel like a $500/hour specialist consultation
- Demonstrate deep medical knowledge while remaining accessible
- Ask sophisticated questions that show expertise
- Provide detailed, personalized guidance
- Show genuine care and emotional intelligence
- Reference specific aspects of their condition and treatment options

IMPORTANT MEDICAL DISCLAIMERS:
- Always emphasize you're a supportive AI, not a replacement for medical care
- Encourage regular consultation with their healthcare team
- Respect HIPAA privacy principles
- Focus on support, education, and advocacy

VOICE INTERACTION STYLE:
- Speak as a world-renowned specialist would
- Use medical terminology appropriately, then explain clearly
- Keep responses conversational but authoritative
- Show both clinical expertise and human compassion

Remember: You're providing premium virtual care experience. Every interaction should feel like consulting with the world's best specialist who truly cares about this patient's journey."""

@router.post("/generate-token")
async def generate_token():
    """Generate a fresh VideoSDK authentication token."""
    try:
        token = generate_videosdk_token()
        return {
            "token": token,
            "expires_in": "24 hours",
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token generation failed: {str(e)}")

@router.get("/health")
async def videosdk_health_check():
    """Check VideoSDK service health."""
    return {
        "videosdk_api_configured": VIDEOSDK_API_KEY is not None,
        "videosdk_auth_configured": VIDEOSDK_AUTH_TOKEN is not None or VIDEOSDK_SECRET is not None,
        "base_url": VIDEOSDK_BASE_URL,
        "status": "healthy"
    }

@router.get("/rooms/{room_id}/info")
async def get_room_info(room_id: str):
    """Get information about a VideoSDK room."""
    if not VIDEOSDK_API_KEY:
        raise HTTPException(status_code=503, detail="VideoSDK API key not configured")
    
    try:
        auth_token = generate_videosdk_token()
        headers = {
            "Authorization": auth_token,
            "Content-Type": "application/json"
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{VIDEOSDK_BASE_URL}/v2/rooms/{room_id}",
                headers=headers
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                error_text = response.text
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Room info error: {error_text}"
                )
                
    except Exception as e:
        print(f"❌ Error getting room info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Room info failed: {str(e)}")