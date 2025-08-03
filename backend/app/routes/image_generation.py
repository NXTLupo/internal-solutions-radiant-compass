from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional
import os
import httpx
from app.db import get_session
from app.security import HIPAASecurityManager, get_client_ip

router = APIRouter(prefix="/ai", tags=["AI Image Generation"])

class CalmingImageRequest(BaseModel):
    prompt: str
    style: Optional[str] = "calming_illustration"
    size: Optional[str] = "1024x1024"
    quality: Optional[str] = "standard"

class ImageResponse(BaseModel):
    image_url: str
    revised_prompt: str

@router.post("/generate-calming-image", response_model=ImageResponse)
async def generate_calming_image(
    request_data: CalmingImageRequest,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    Generate calming, wellness-focused illustrations using GPT-4o + DALL-E 3
    
    This endpoint creates beautiful, soothing images for healthcare environments
    that promote healing, comfort, and positive emotions.
    """
    
    try:
        # Get OpenAI API key
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        # Enhanced calming illustration prompt with wellness focus
        enhanced_prompt = f"""
        Calming wellness illustration: {request_data.prompt}
        
        Style requirements:
        - Soft, soothing colors (pastels, blues, greens, warm tones)
        - Peaceful, serene, and comforting atmosphere
        - Nature-inspired elements (gentle flowers, flowing water, soft clouds)
        - Warm lighting and gentle gradients
        - Promotes feelings of calm, hope, and healing
        - Suitable for healthcare environments and all ages
        - Abstract or artistic rather than literal medical content
        - Focus on wellness, recovery, and positive emotions
        """
        
        # Step 1: Use GPT-4o to enhance and optimize the prompt for medical accuracy
        async with httpx.AsyncClient(timeout=60.0) as client:
            prompt_response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a wellness art expert specializing in calming, therapeutic illustrations for healthcare environments. Create prompts for beautiful, soothing artwork that promotes healing and peace."
                        },
                        {
                            "role": "user",
                            "content": f"Create an optimized prompt for a calming wellness illustration based on this request: {enhanced_prompt}"
                        }
                    ],
                    "max_tokens": 300
                }
            )
        
        if prompt_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to optimize prompt with GPT-4o")
        
        optimized_prompt = prompt_response.json()["choices"][0]["message"]["content"]
        
        # Step 2: Use DALL-E 3 to generate the actual image with the GPT-4o optimized prompt
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {openai_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "dall-e-3",
                    "prompt": optimized_prompt,
                    "n": 1,
                    "size": request_data.size,
                    "quality": request_data.quality,
                    "style": "natural"
                }
            )
        
        if response.status_code != 200:
            error_detail = response.text
            raise HTTPException(
                status_code=response.status_code,
                detail=f"OpenAI API error: {error_detail}"
            )
        
        result = response.json()
        
        # Extract image data
        if not result.get("data"):
            raise HTTPException(status_code=500, detail="No image data received from OpenAI")
        
        image_data = result["data"][0]
        image_url = image_data.get("url")
        revised_prompt = image_data.get("revised_prompt", request_data.prompt)
        
        # Log the AI interaction for audit purposes (HIPAA compliance)
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,  # This would be the actual user ID when authentication is added
            action="AI_IMAGE_GENERATION",
            resource="CalmingIllustration",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "prompt_length": len(request_data.prompt),
                "image_size": request_data.size,
                "style": request_data.style
            }
        )
        
        return ImageResponse(
            image_url=image_url,
            revised_prompt=revised_prompt
        )
        
    except httpx.RequestError as e:
        # Log the error
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="AI_IMAGE_GENERATION_ERROR",
            resource="CalmingIllustration",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="failure",
            details={"error": f"Network error: {str(e)}"}
        )
        
        raise HTTPException(
            status_code=500,
            detail="Network error connecting to OpenAI. Please try again."
        )
    
    except Exception as e:
        # Log the error
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="AI_IMAGE_GENERATION_ERROR",
            resource="CalmingIllustration",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="failure",
            details={"error": str(e)}
        )
        
        raise HTTPException(
            status_code=500,
            detail="Unable to generate medical image at this time. Please try again."
        )

@router.get("/test-openai-connection")
async def test_openai_connection():
    """Test OpenAI API connectivity"""
    try:
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            return {"status": "error", "message": "OpenAI API key not configured"}
        
        # Test with a simple API call
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                "https://api.openai.com/v1/models",
                headers={
                    "Authorization": f"Bearer {openai_api_key}",
                }
            )
        
        if response.status_code == 200:
            models = response.json()
            dalle_models = [model["id"] for model in models.get("data", []) if "dall-e" in model["id"]]
            return {
                "status": "success", 
                "message": "OpenAI API connected successfully",
                "dalle_models_available": dalle_models
            }
        else:
            return {
                "status": "error", 
                "message": f"OpenAI API error: {response.status_code}",
                "detail": response.text
            }
    
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Connection failed: {str(e)}"
        }