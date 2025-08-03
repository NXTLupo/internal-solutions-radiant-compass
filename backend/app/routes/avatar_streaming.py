from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import httpx
import uuid
from datetime import datetime, timedelta
import jwt

router = APIRouter()

# HeyGen API Configuration
HEYGEN_CONFIG = {
    "server_url": "https://api.heygen.com",
    "api_key": os.getenv("HEYGEN_API_KEY"),  # Set in environment
    "default_avatar_id": "Wayne_20240711",  # Professional healthcare avatar
    "default_voice_id": "2d5b0e6cf36f460aa7fc47e3eee8f10e"  # Warm female voice
}

# Request/Response Models
class AvatarTokenRequest(BaseModel):
    patientName: str
    emotionalState: str
    journeyStage: str

class AvatarSessionRequest(BaseModel):
    sessionToken: str
    avatarId: Optional[str] = None
    voiceId: Optional[str] = None
    quality: str = "high"
    videoEncoding: str = "H264"
    patientContext: Dict[str, Any]

class AvatarTextRequest(BaseModel):
    sessionId: str
    sessionToken: str
    text: str
    taskType: str = "talk"

class AvatarControlRequest(BaseModel):
    sessionId: str
    sessionToken: str

# In-memory session storage (in production, use Redis or database)
active_sessions = {}

@router.post("/token")
async def create_avatar_token(request: AvatarTokenRequest):
    """
    Create a secure session token for avatar streaming.
    This prevents exposing HeyGen API keys to the frontend.
    """
    try:
        # Create a JWT token with patient context
        payload = {
            "patient_name": request.patientName,
            "emotional_state": request.emotionalState,
            "journey_stage": request.journeyStage,
            "created_at": datetime.utcnow().isoformat(),
            "expires_at": (datetime.utcnow() + timedelta(hours=2)).isoformat(),
            "session_id": str(uuid.uuid4())
        }
        
        # Use JWT secret from environment
        jwt_secret = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
        token = jwt.encode(payload, jwt_secret, algorithm="HS256")
        
        return {
            "token": token,
            "expires_in": 7200,  # 2 hours
            "patient_context": {
                "name": request.patientName,
                "emotional_state": request.emotionalState,
                "journey_stage": request.journeyStage
            }
        }
        
    except Exception as e:
        print(f"Error creating avatar token: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create session token")

@router.post("/create-session")
async def create_avatar_session(request: AvatarSessionRequest):
    """
    Create a new HeyGen avatar streaming session.
    Proxies the request to HeyGen API to keep API keys secure.
    """
    try:
        # Verify session token
        jwt_secret = os.getenv("JWT_SECRET_KEY", "dev-secret-key")
        try:
            payload = jwt.decode(request.sessionToken, jwt_secret, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Session token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid session token")
        
        # Check if HeyGen API key is available
        if not HEYGEN_CONFIG["api_key"] or HEYGEN_CONFIG["api_key"] in ["your-heygen-key-here", "PLEASE_ADD_REAL_HEYGEN_API_KEY"]:
            raise HTTPException(
                status_code=503, 
                detail="HeyGen API key not configured. Please add your real HeyGen API key to the .env file. Get one from https://app.heygen.com/settings/api-keys"
            )
        
        # Get HeyGen session token
        heygen_token = await get_heygen_session_token()
        
        # Create avatar session
        avatar_id = request.avatarId or HEYGEN_CONFIG["default_avatar_id"]
        voice_id = request.voiceId or HEYGEN_CONFIG["default_voice_id"]
        
        session_data = {
            "quality": request.quality,
            "avatar_name": avatar_id,
            "voice": {
                "voice_id": voice_id,
                "rate": 1.0,
                "emotion": get_voice_emotion_for_state(request.patientContext.get("emotionalState", "calm"))
            },
            "version": "v2",
            "video_encoding": request.videoEncoding,
            # Add patient context for personalized responses
            "knowledge": {
                "patient_name": request.patientContext.get("name", "Patient"),
                "journey_stage": request.patientContext.get("journeyStage", "awareness"),
                "emotional_state": request.patientContext.get("emotionalState", "calm")
            }
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{HEYGEN_CONFIG['server_url']}/v1/streaming.new",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {heygen_token}"
                },
                json=session_data
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeyGen API error: {response.text}"
                )
            
            session_info = response.json()
            
            # Store session info for later use
            session_id = session_info.get("session_id")
            if session_id:
                active_sessions[session_id] = {
                    "heygen_token": heygen_token,
                    "patient_context": request.patientContext,
                    "created_at": datetime.utcnow(),
                    "session_info": session_info
                }
            
            return session_info
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating avatar session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create avatar session")

@router.post("/start-session")
async def start_avatar_session(request: AvatarControlRequest):
    """
    Start the avatar streaming session.
    """
    try:
        session_data = active_sessions.get(request.sessionId)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # All sessions are real HeyGen sessions
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{HEYGEN_CONFIG['server_url']}/v1/streaming.start",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {session_data['heygen_token']}"
                },
                json={"session_id": request.sessionId}
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeyGen API error: {response.text}"
                )
            
            return response.json()
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error starting avatar session: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to start avatar session")

@router.post("/send-text")
async def send_text_to_avatar(request: AvatarTextRequest):
    """
    Send text to the avatar for speech synthesis.
    """
    try:
        session_data = active_sessions.get(request.sessionId)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # All sessions are real HeyGen sessions
        
        # Enhance text with patient context for more personalized responses
        enhanced_text = enhance_text_with_context(
            request.text, 
            session_data["patient_context"]
        )
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{HEYGEN_CONFIG['server_url']}/v1/streaming.task",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {session_data['heygen_token']}"
                },
                json={
                    "session_id": request.sessionId,
                    "text": enhanced_text,
                    "task_type": request.taskType
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeyGen API error: {response.text}"
                )
            
            return response.json()
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error sending text to avatar: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send text to avatar")

@router.post("/close-session")
async def close_avatar_session(request: AvatarControlRequest):
    """
    Close the avatar streaming session.
    """
    try:
        session_data = active_sessions.get(request.sessionId)
        if not session_data:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # All sessions are real HeyGen sessions
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{HEYGEN_CONFIG['server_url']}/v1/streaming.stop",
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {session_data['heygen_token']}"
                },
                json={"session_id": request.sessionId}
            )
            
            # Clean up session data regardless of response
            if request.sessionId in active_sessions:
                del active_sessions[request.sessionId]
            
            if response.status_code != 200:
                print(f"Warning: HeyGen session close error: {response.text}")
                # Don't raise an error here, as the session is being cleaned up anyway
            
            return {"status": "closed", "message": "Session closed successfully"}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error closing avatar session: {str(e)}")
        # Clean up session data even if there's an error
        if request.sessionId in active_sessions:
            del active_sessions[request.sessionId]
        raise HTTPException(status_code=500, detail="Failed to close avatar session")

# Helper functions
async def get_heygen_session_token() -> str:
    """Get session token from HeyGen API."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{HEYGEN_CONFIG['server_url']}/v1/streaming.create_token",
                headers={
                    "Content-Type": "application/json",
                    "X-Api-Key": HEYGEN_CONFIG["api_key"]
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"HeyGen token error: {response.text}")
            
            data = response.json()
            return data["data"]["token"]
            
    except Exception as e:
        print(f"Error getting HeyGen token: {str(e)}")
        raise

# Mock session function removed - only real HeyGen API supported

def get_voice_emotion_for_state(emotional_state: str) -> str:
    """Map patient emotional state to avatar voice emotion."""
    emotion_mapping = {
        "anxious": "supportive",
        "overwhelmed": "calm",
        "confused": "patient",
        "hopeful": "encouraging",
        "calm": "warm"
    }
    return emotion_mapping.get(emotional_state, "warm")

def enhance_text_with_context(text: str, patient_context: Dict[str, Any]) -> str:
    """Enhance avatar text with patient context for more personalized delivery."""
    patient_name = patient_context.get("name", "")
    emotional_state = patient_context.get("emotionalState", "calm")
    journey_stage = patient_context.get("journeyStage", "awareness")
    
    # Add subtle personalization without being overly repetitive
    if patient_name and patient_name not in text and len(text) > 100:
        # Only add name to longer responses to avoid repetition
        if text.startswith("Hello") or text.startswith("Hi"):
            text = text.replace("Hello", f"Hello {patient_name}", 1).replace("Hi", f"Hi {patient_name}", 1)
    
    # Add emotional context cues for delivery
    if emotional_state == "anxious":
        text = f"[Speaking gently and reassuringly] {text}"
    elif emotional_state == "hopeful":
        text = f"[Speaking with warm encouragement] {text}"
    elif emotional_state == "overwhelmed":
        text = f"[Speaking slowly and calmly] {text}"
    
    return text

@router.get("/sessions")
async def get_active_sessions():
    """Get information about active avatar sessions (for debugging)."""
    return {
        "active_sessions": len(active_sessions),
        "sessions": {
            session_id: {
                "created_at": session_data["created_at"].isoformat(),
                "patient_name": session_data["patient_context"].get("name", "Unknown"),
                "heygen_session": True
            }
            for session_id, session_data in active_sessions.items()
        }
    }