from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import httpx
import base64
import asyncio

router = APIRouter(prefix="/api/v1/heygen", tags=["heygen"])

# HeyGen Configuration
HEYGEN_API_KEY = os.getenv("HEYGEN_API_KEY")
HEYGEN_BASE_URL = "https://api.heygen.com"

class StreamingSessionRequest(BaseModel):
    avatar_name: Optional[str] = "Kristin_public_2_20240108"  # Updated to working 2024 avatar
    voice_id: Optional[str] = "1bd001e7e50f421d891986aad5158bc8"
    quality: Optional[str] = "high"

class StreamingSessionResponse(BaseModel):
    session_id: str
    sdp: str
    ice_servers: list
    session_info: Dict[str, Any]

@router.post("/create-session", response_model=StreamingSessionResponse)
async def create_streaming_session(request: StreamingSessionRequest):
    """
    Create a new HeyGen streaming session for avatar video.
    """
    if not HEYGEN_API_KEY:
        raise HTTPException(status_code=503, detail="HeyGen API key not configured")
    
    try:
        print(f"🎭 Creating HeyGen streaming session with avatar: {request.avatar_name}")
        
        # Decode the base64 API key
        try:
            decoded_key = base64.b64decode(HEYGEN_API_KEY).decode('utf-8')
        except Exception:
            decoded_key = HEYGEN_API_KEY  # Use as-is if not base64
        
        headers = {
            "x-api-key": decoded_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "avatar_name": request.avatar_name,
            "voice": {
                "voice_id": request.voice_id,
                "rate": 1.0,
                "emotion": "friendly"
            },
            "quality": request.quality,
            "video_encoding": "h264"
        }
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{HEYGEN_BASE_URL}/v1/streaming.new",
                headers=headers,
                json=payload
            )
            
            print(f"📡 HeyGen API Response Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ HeyGen streaming session created successfully")
                
                return StreamingSessionResponse(
                    session_id=data.get("session_id", ""),
                    sdp=data.get("sdp", ""),
                    ice_servers=data.get("ice_servers", []),
                    session_info=data
                )
            else:
                error_text = response.text
                print(f"❌ HeyGen API Error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeyGen API error: {error_text}"
                )
                
    except httpx.TimeoutException:
        print("❌ HeyGen API timeout")
        raise HTTPException(status_code=408, detail="HeyGen API timeout")
    except Exception as e:
        print(f"❌ Error creating HeyGen session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Session creation failed: {str(e)}")

@router.post("/speak")
async def speak_with_avatar(session_id: str, text: str):
    """
    Make the HeyGen avatar speak the given text.
    """
    if not HEYGEN_API_KEY:
        raise HTTPException(status_code=503, detail="HeyGen API key not configured")
    
    try:
        print(f"🗣️ Making HeyGen avatar speak: {text[:50]}...")
        
        # Decode the base64 API key
        try:
            decoded_key = base64.b64decode(HEYGEN_API_KEY).decode('utf-8')
        except Exception:
            decoded_key = HEYGEN_API_KEY
        
        headers = {
            "x-api-key": decoded_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "session_id": session_id,
            "text": text,
            "task_type": "talk"
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"{HEYGEN_BASE_URL}/v1/streaming.task",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                print("✅ HeyGen avatar speech initiated")
                return {"status": "success", "message": "Avatar is speaking"}
            else:
                error_text = response.text
                print(f"❌ HeyGen speak error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeyGen speak error: {error_text}"
                )
                
    except Exception as e:
        print(f"❌ Error making avatar speak: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Avatar speak failed: {str(e)}")

@router.post("/close-session")
async def close_streaming_session(session_id: str):
    """
    Close a HeyGen streaming session.
    """
    if not HEYGEN_API_KEY:
        raise HTTPException(status_code=503, detail="HeyGen API key not configured")
    
    try:
        print(f"🔚 Closing HeyGen session: {session_id}")
        
        # Decode the base64 API key
        try:
            decoded_key = base64.b64decode(HEYGEN_API_KEY).decode('utf-8')
        except Exception:
            decoded_key = HEYGEN_API_KEY
        
        headers = {
            "x-api-key": decoded_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "session_id": session_id
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{HEYGEN_BASE_URL}/v1/streaming.stop",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                print("✅ HeyGen session closed successfully")
                return {"status": "success", "message": "Session closed"}
            else:
                error_text = response.text
                print(f"❌ HeyGen close error: {response.status_code} - {error_text}")
                # Don't raise exception for close errors, just log
                return {"status": "warning", "message": f"Close warning: {error_text}"}
                
    except Exception as e:
        print(f"❌ Error closing HeyGen session: {str(e)}")
        return {"status": "error", "message": f"Close failed: {str(e)}"}

@router.get("/avatars")
async def get_available_avatars():
    """
    Get list of available HeyGen avatars.
    """
    if not HEYGEN_API_KEY:
        raise HTTPException(status_code=503, detail="HeyGen API key not configured")
    
    try:
        # Decode the base64 API key
        try:
            decoded_key = base64.b64decode(HEYGEN_API_KEY).decode('utf-8')
        except Exception:
            decoded_key = HEYGEN_API_KEY
        
        headers = {
            "x-api-key": decoded_key
        }
        
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(
                f"{HEYGEN_BASE_URL}/v1/avatar.list",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                return {"avatars": data.get("avatars", [])}
            else:
                error_text = response.text
                print(f"❌ HeyGen avatars error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"HeyGen avatars error: {error_text}"
                )
                
    except Exception as e:
        print(f"❌ Error getting avatars: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Get avatars failed: {str(e)}")

@router.get("/health")
async def heygen_health_check():
    """Check HeyGen service health."""
    return {
        "heygen_api_configured": HEYGEN_API_KEY is not None,
        "base_url": HEYGEN_BASE_URL,
        "status": "healthy"
    }