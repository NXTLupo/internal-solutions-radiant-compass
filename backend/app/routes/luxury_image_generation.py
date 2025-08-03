from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
import os
import httpx
import asyncio
import time
import json

router = APIRouter(prefix="/api/v1/luxury", tags=["luxury-imaging"])

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class LuxuryImageRequest(BaseModel):
    prompt: str
    size: Optional[Literal["1024x1024", "1792x1024", "1024x1792"]] = "1024x1024"
    quality: Optional[Literal["standard", "hd"]] = "hd"
    style: Optional[Literal["vivid", "natural"]] = "natural"
    healthcare_context: Optional[str] = None

class ImageAnalysisRequest(BaseModel):
    image_url: str
    analysis_prompt: str

@router.post("/generate-luxury-healthcare-image")
async def generate_luxury_healthcare_image(request: LuxuryImageRequest):
    """
    Generate luxury healthcare environment images using OpenAI DALL-E 3 
    with specialized healthcare prompts for premium patient experiences.
    """
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")
    
    start_time = time.time()
    
    try:
        # Enhanced prompt for luxury healthcare environments
        enhanced_prompt = f"""
        {request.prompt}
        
        LUXURY HEALTHCARE DESIGN REQUIREMENTS:
        - Premium medical facility with 5-star hotel aesthetics
        - Warm, natural lighting with floor-to-ceiling windows
        - High-end materials: marble, warm woods, premium fabrics
        - Calming color palette: soft blues, warm whites, natural tones
        - Fresh flowers, living plants, water features
        - Comfortable, designer furniture with medical functionality
        - Privacy and comfort prioritized in every detail
        - Professional medical equipment seamlessly integrated
        - Healing environment that reduces anxiety and promotes wellness
        - Photorealistic, architectural photography style
        - Ultra-high quality, magazine-worthy interior design
        
        Style: Premium healthcare interior design, luxury medical facility, healing environment, professional photography, natural lighting, calming atmosphere
        """
        
        if request.healthcare_context:
            enhanced_prompt += f"\n\nSpecific Context: {request.healthcare_context}"
        
        print(f"🎨 Generating luxury healthcare image: {request.prompt[:50]}...")
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "dall-e-3",
                    "prompt": enhanced_prompt,
                    "size": request.size,
                    "quality": request.quality,
                    "style": request.style,
                    "n": 1
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                image_url = data["data"][0]["url"]
                revised_prompt = data["data"][0].get("revised_prompt", enhanced_prompt)
                
                latency_ms = int((time.time() - start_time) * 1000)
                
                print(f"✅ Luxury healthcare image generated: {latency_ms}ms")
                
                return {
                    "image_url": image_url,
                    "revised_prompt": revised_prompt,
                    "original_prompt": request.prompt,
                    "generation_time_ms": latency_ms,
                    "size": request.size,
                    "quality": request.quality,
                    "style": request.style
                }
            else:
                error_text = response.text
                print(f"❌ OpenAI Image Generation Error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Image generation failed: {error_text}"
                )
                
    except httpx.TimeoutException:
        print("❌ OpenAI Image Generation timeout")
        raise HTTPException(status_code=408, detail="Image generation timeout")
    except Exception as e:
        print(f"❌ Error generating luxury healthcare image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

@router.post("/analyze-image")
async def analyze_luxury_image(request: ImageAnalysisRequest):
    """
    Analyze images using GPT-4 Vision to ensure they meet luxury healthcare standards.
    """
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")
    
    start_time = time.time()
    
    try:
        print(f"🔍 Analyzing luxury healthcare image with GPT-4 Vision...")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "gpt-4-vision-preview",
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a luxury healthcare design expert and medical facility consultant. Analyze images for adherence to premium healthcare design standards, patient comfort, and therapeutic environment principles."
                        },
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": f"Please analyze this luxury healthcare environment image. {request.analysis_prompt}\n\nProvide detailed feedback on:\n1. Luxury design quality and premium aesthetics\n2. Healthcare functionality and patient comfort\n3. Healing environment principles (lighting, color, materials)\n4. Areas for improvement\n5. Overall rating (1-10) for luxury healthcare standards"
                                },
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": request.image_url,
                                        "detail": "high"
                                    }
                                }
                            ]
                        }
                    ],
                    "max_tokens": 500,
                    "temperature": 0.7
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                analysis = data["choices"][0]["message"]["content"]
                
                latency_ms = int((time.time() - start_time) * 1000)
                
                print(f"✅ Image analysis completed: {latency_ms}ms")
                
                return {
                    "analysis": analysis,
                    "image_url": request.image_url,
                    "analysis_prompt": request.analysis_prompt,
                    "analysis_time_ms": latency_ms,
                    "model": "gpt-4-vision-preview"
                }
            else:
                error_text = response.text
                print(f"❌ GPT-4 Vision Analysis Error: {response.status_code} - {error_text}")
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Image analysis failed: {error_text}"
                )
                
    except Exception as e:
        print(f"❌ Error analyzing luxury healthcare image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")

@router.post("/generate-stage-imagery")
async def generate_stage_imagery():
    """
    Generate complete set of luxury healthcare images for all journey stages.
    """
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")
    
    stage_prompts = [
        {
            "stage": 1,
            "title": "Welcome & Discovery",
            "prompt": "Serene spa-like medical reception with warm lighting, comfortable seating, fresh flowers, and calming water feature",
            "context": "First impression area where patients begin their healthcare journey"
        },
        {
            "stage": 2,
            "title": "Expert Evaluation", 
            "prompt": "Modern diagnostic center with floor-to-ceiling windows, natural light, comfortable examination rooms with premium finishes and calming nature views",
            "context": "Advanced diagnostic and evaluation facility"
        },
        {
            "stage": 3,
            "title": "Treatment Planning",
            "prompt": "Elegant consultation room with warm wood finishes, comfortable leather seating around a marble conference table, soft ambient lighting, and inspirational medical artwork",
            "context": "Collaborative treatment planning and decision-making space"
        },
        {
            "stage": 4,
            "title": "Pre-Treatment Preparation",
            "prompt": "Tranquil preparation suite with meditation corner, soft fabrics, essential oil diffuser, comfortable reclining chairs, and panoramic garden views",
            "context": "Wellness and preparation area for treatment optimization"
        }
    ]
    
    results = []
    
    for stage_info in stage_prompts:
        try:
            request = LuxuryImageRequest(
                prompt=stage_info["prompt"],
                healthcare_context=stage_info["context"],
                quality="hd",
                style="natural"
            )
            
            result = await generate_luxury_healthcare_image(request)
            results.append({
                "stage_id": stage_info["stage"],
                "stage_title": stage_info["title"],
                "image_url": result["image_url"],
                "generation_time_ms": result["generation_time_ms"]
            })
            
            print(f"✅ Generated luxury image for Stage {stage_info['stage']}: {stage_info['title']}")
            
            # Add delay to respect API rate limits
            await asyncio.sleep(2)
            
        except Exception as e:
            print(f"❌ Failed to generate image for Stage {stage_info['stage']}: {str(e)}")
            results.append({
                "stage_id": stage_info["stage"],
                "stage_title": stage_info["title"],
                "error": str(e)
            })
    
    return {
        "generated_images": results,
        "total_stages": len(stage_prompts),
        "successful_generations": len([r for r in results if "image_url" in r])
    }

@router.get("/health")
async def luxury_imaging_health():
    """Check luxury imaging service health."""
    return {
        "openai_configured": OPENAI_API_KEY is not None,
        "dall_e_3_available": True,
        "gpt_4_vision_available": True,
        "status": "healthy"
    }