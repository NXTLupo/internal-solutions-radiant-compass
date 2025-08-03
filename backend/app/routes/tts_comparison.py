from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Literal
import os
import httpx
import asyncio
import time
from io import BytesIO
import json

router = APIRouter(prefix="/api/v1/tts", tags=["tts"])

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
HEYGEN_API_KEY = os.getenv("HEYGEN_API_KEY")

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = "nova"  # Default to OpenAI Nova
    provider: Optional[Literal["openai", "elevenlabs", "heygen", "fastest"]] = "fastest"
    speed: Optional[float] = 0.6  # FIXED: Much slower default for natural healthcare conversation

class TTSBenchmarkResult(BaseModel):
    provider: str
    latency_ms: int
    audio_size_bytes: int
    tokens_per_second: Optional[float] = None
    quality_score: Optional[int] = None  # 1-10 scale

@router.post("/openai")
async def openai_tts(request: TTSRequest):
    """OpenAI TTS - High quality, good speed, excellent healthcare voices."""
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")
    
    start_time = time.time()
    
    try:
        print(f"🎵 OpenAI TTS: {request.text[:50]}... (voice: {request.voice})")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/audio/speech",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "tts-1-hd",  # High quality model
                    "input": request.text,
                    "voice": request.voice,
                    "speed": request.speed,
                    "response_format": "mp3"
                }
            )
            
            if response.status_code == 200:
                audio_data = response.content
                latency_ms = int((time.time() - start_time) * 1000)
                
                print(f"✅ OpenAI TTS completed: {latency_ms}ms, {len(audio_data)} bytes")
                
                return StreamingResponse(
                    BytesIO(audio_data),
                    media_type="audio/mpeg",
                    headers={
                        "X-Latency-MS": str(latency_ms),
                        "X-Provider": "openai",
                        "X-Audio-Size": str(len(audio_data)),
                        "Cache-Control": "no-cache"
                    }
                )
            else:
                raise HTTPException(status_code=response.status_code, detail=f"OpenAI TTS failed: {response.text}")
                
    except Exception as e:
        print(f"❌ OpenAI TTS error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"OpenAI TTS failed: {str(e)}")

@router.post("/elevenlabs")
async def elevenlabs_tts(request: TTSRequest):
    """ElevenLabs TTS - Ultra-realistic voices, premium quality."""
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=503, detail="ElevenLabs API key not configured")
    
    start_time = time.time()
    
    # ElevenLabs healthcare-optimized voices
    voice_mapping = {
        "nova": "21m00Tcm4TlvDq8ikWAM",  # Rachel - Professional female
        "alloy": "29vD33N1CtxCmqQRPOHJ",  # Drew - Professional male  
        "echo": "21m00Tcm4TlvDq8ikWAM",  # Rachel - fallback
        "fable": "AZnzlk1XvdvUeBnXmlld",  # Domi - Warm female
        "onyx": "29vD33N1CtxCmqQRPOHJ",  # Drew - fallback
        "shimmer": "EXAVITQu4vr4xnSDxMaL"  # Bella - Caring female
    }
    
    voice_id = voice_mapping.get(request.voice, "21m00Tcm4TlvDq8ikWAM")
    
    try:
        print(f"🎵 ElevenLabs TTS: {request.text[:50]}... (voice: {voice_id})")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
                headers={
                    "xi-api-key": ELEVENLABS_API_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "text": request.text,
                    "model_id": "eleven_turbo_v2",  # Fastest model
                    "voice_settings": {
                        "stability": 0.7,
                        "similarity_boost": 0.8,
                        "style": 0.2,  # Professional style
                        "use_speaker_boost": True
                    }
                }
            )
            
            if response.status_code == 200:
                audio_data = response.content
                latency_ms = int((time.time() - start_time) * 1000)
                
                print(f"✅ ElevenLabs TTS completed: {latency_ms}ms, {len(audio_data)} bytes")
                
                return StreamingResponse(
                    BytesIO(audio_data),
                    media_type="audio/mpeg",
                    headers={
                        "X-Latency-MS": str(latency_ms),
                        "X-Provider": "elevenlabs",
                        "X-Audio-Size": str(len(audio_data)),
                        "Cache-Control": "no-cache"
                    }
                )
            else:
                raise HTTPException(status_code=response.status_code, detail=f"ElevenLabs TTS failed: {response.text}")
                
    except Exception as e:
        print(f"❌ ElevenLabs TTS error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"ElevenLabs TTS failed: {str(e)}")

@router.post("/heygen")
async def heygen_tts(request: TTSRequest):
    """HeyGen TTS - Avatar-optimized voices with video integration capability."""
    if not HEYGEN_API_KEY:
        raise HTTPException(status_code=503, detail="HeyGen API key not configured")
    
    start_time = time.time()
    
    try:
        print(f"🎵 HeyGen TTS: {request.text[:50]}... (voice: {request.voice})")
        
        # HeyGen typically requires avatar setup, but we'll try direct TTS
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.heygen.com/v1/streaming.create_token",
                headers={
                    "x-api-key": HEYGEN_API_KEY,
                    "Content-Type": "application/json"
                },
                json={
                    "text": request.text,
                    "voice_id": request.voice,
                    "avatar_id": "default_professional_female"  # Healthcare-appropriate
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                # HeyGen typically returns a streaming token, not direct audio
                # This would need avatar session setup for full functionality
                latency_ms = int((time.time() - start_time) * 1000)
                
                print(f"⚠️ HeyGen requires avatar session setup - falling back to OpenAI")
                # Fallback to OpenAI for now
                return await openai_tts(request)
                
            else:
                print(f"⚠️ HeyGen TTS not available - falling back to OpenAI")
                return await openai_tts(request)
                
    except Exception as e:
        print(f"⚠️ HeyGen TTS error: {str(e)} - falling back to OpenAI")
        return await openai_tts(request)

@router.post("/fastest")
async def fastest_tts(request: TTSRequest):
    """Automatically select the fastest available TTS provider."""
    
    # Benchmark all available providers
    results = []
    
    # Test OpenAI
    if OPENAI_API_KEY:
        try:
            start_time = time.time()
            test_response = await openai_tts(TTSRequest(text="Speed test", voice=request.voice))
            latency = int((time.time() - start_time) * 1000)
            results.append({"provider": "openai", "latency_ms": latency, "quality": 8})
        except:
            pass
    
    # Test ElevenLabs  
    if ELEVENLABS_API_KEY:
        try:
            start_time = time.time()
            test_response = await elevenlabs_tts(TTSRequest(text="Speed test", voice=request.voice))
            latency = int((time.time() - start_time) * 1000)
            results.append({"provider": "elevenlabs", "latency_ms": latency, "quality": 10})
        except:
            pass
    
    if not results:
        raise HTTPException(status_code=503, detail="No TTS providers available")
    
    # For healthcare, balance speed and quality
    # ElevenLabs gets bonus for quality, OpenAI gets bonus for reliability
    def score_provider(result):
        speed_score = max(0, 100 - (result["latency_ms"] / 50))  # Penalty for slow
        quality_bonus = result["quality"] * 10
        if result["provider"] == "openai":
            reliability_bonus = 20  # OpenAI is more reliable
        else:
            reliability_bonus = 0
        return speed_score + quality_bonus + reliability_bonus
    
    best_provider = max(results, key=score_provider)
    
    print(f"🏆 Fastest TTS for healthcare: {best_provider['provider']} ({best_provider['latency_ms']}ms)")
    
    # Use the best provider
    if best_provider["provider"] == "elevenlabs":
        return await elevenlabs_tts(request)
    else:
        return await openai_tts(request)

@router.post("/benchmark")
async def benchmark_all_tts(request: TTSRequest):
    """Benchmark all available TTS providers and return results."""
    results = []
    
    # Test OpenAI
    if OPENAI_API_KEY:
        try:
            start_time = time.time()
            response = await openai_tts(request)
            latency_ms = int((time.time() - start_time) * 1000)
            results.append({
                "provider": "openai",
                "latency_ms": latency_ms,
                "quality_score": 8,  # High quality, reliable
                "healthcare_optimized": True,
                "status": "success"
            })
        except Exception as e:
            results.append({
                "provider": "openai", 
                "status": "failed",
                "error": str(e)
            })
    
    # Test ElevenLabs
    if ELEVENLABS_API_KEY:
        try:
            start_time = time.time()
            response = await elevenlabs_tts(request)
            latency_ms = int((time.time() - start_time) * 1000)
            results.append({
                "provider": "elevenlabs",
                "latency_ms": latency_ms,
                "quality_score": 10,  # Best quality
                "healthcare_optimized": True,
                "status": "success"
            })
        except Exception as e:
            results.append({
                "provider": "elevenlabs",
                "status": "failed", 
                "error": str(e)
            })
    
    # Test HeyGen
    if HEYGEN_API_KEY:
        results.append({
            "provider": "heygen",
            "status": "requires_avatar_setup",
            "quality_score": 9,
            "healthcare_optimized": True,
            "note": "Requires avatar session for full functionality"
        })
    else:
        results.append({
            "provider": "heygen",
            "status": "not_configured"
        })
    
    return {
        "benchmark_results": results,
        "recommendation": "elevenlabs" if any(r.get("provider") == "elevenlabs" and r.get("status") == "success" for r in results) else "openai",
        "test_text": request.text
    }

@router.get("/health")
async def tts_health_check():
    """Check TTS provider availability."""
    return {
        "openai_configured": OPENAI_API_KEY is not None,
        "elevenlabs_configured": ELEVENLABS_API_KEY is not None,
        "heygen_configured": HEYGEN_API_KEY is not None,
        "status": "healthy"
    }