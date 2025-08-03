from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional
from anthropic import AsyncAnthropic
import os
from app.db import get_session
from app.security import HIPAASecurityManager, get_client_ip

router = APIRouter(prefix="/ai", tags=["AI Analysis"])

# Configure Anthropic Claude client
client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class SymptomAnalysisRequest(BaseModel):
    symptom: str
    severity: int
    duration: str
    context: Optional[str] = None
    emotionalState: str

class AIInsight(BaseModel):
    interpretation: str
    urgencyLevel: str
    recommendations: List[str]
    reassurance: str
    nextSteps: List[str]
    whenToSeekCare: str
    confidence: int

@router.post("/analyze-symptoms", response_model=AIInsight)
async def analyze_symptoms(
    request_data: SymptomAnalysisRequest,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    AI-powered symptom analysis using Claude 3.7 Sonnet
    
    This endpoint provides empathetic, medically-informed guidance while maintaining
    appropriate disclaimers about not replacing professional medical advice.
    """
    
    try:
        # Create a comprehensive prompt for medical symptom analysis
        system_prompt = """You are SymptomSage, a compassionate AI health assistant designed to provide supportive, evidence-based guidance for people experiencing health concerns. Your role is to:

1. Provide empathetic, reassuring responses that acknowledge the person's emotional state
2. Offer medically-informed interpretations based on symptoms described
3. Suggest appropriate next steps and self-care recommendations
4. Determine appropriate urgency levels (low, moderate, high, urgent)
5. Always emphasize that this is supportive guidance, not a medical diagnosis
6. Encourage professional medical consultation when appropriate

Guidelines:
- Be warm, empathetic, and reassuring while remaining medically responsible
- Consider the person's emotional state and provide appropriate emotional support
- Use clear, accessible language avoiding medical jargon
- Provide specific, actionable recommendations
- Always include appropriate disclaimers about seeking professional medical care
- Consider symptom severity, duration, and context in your assessment

Response format should include:
- interpretation: A clear, empathetic explanation of what the symptoms might mean
- urgencyLevel: One of "low", "moderate", "high", "urgent"
- recommendations: 3-5 specific self-care recommendations
- reassurance: A personalized, comforting message based on their emotional state
- nextSteps: 2-4 actionable next steps for seeking care or managing symptoms
- whenToSeekCare: Clear guidance on when to seek immediate medical attention"""

        user_prompt = f"""Please analyze these symptoms with empathy and medical knowledge:

Symptom Description: "{request_data.symptom}"
Severity Level (1-10): {request_data.severity}
Duration: {request_data.duration}
Additional Context: {request_data.context or "None provided"}
Emotional State: {request_data.emotionalState}

The person is feeling {request_data.emotionalState} about their symptoms. Please provide comprehensive, compassionate guidance that addresses both their physical symptoms and emotional needs."""

        # Call Anthropic Claude 3.7 Sonnet API (latest available)
        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=1000,
            temperature=0.3,  # Lower temperature for more consistent medical advice
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        ai_response = response.content[0].text
        
        # Parse the AI response (this would be enhanced with structured output)
        # For now, we'll extract key components using simple parsing
        ai_insight = parse_ai_response(ai_response, request_data)
        
        # Log the AI interaction for audit purposes (HIPAA compliance)
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,  # This would be the actual user ID when authentication is added
            action="AI_SYMPTOM_ANALYSIS",
            resource="SymptomAnalysis",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "symptom_severity": request_data.severity,
                "urgency_level": ai_insight.urgencyLevel,
                "emotional_state": request_data.emotionalState
            }
        )
        
        return ai_insight
        
    except Exception as e:
        # Log the error
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="AI_SYMPTOM_ANALYSIS_ERROR",
            resource="SymptomAnalysis",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="failure",
            details={"error": str(e)}
        )
        
        raise HTTPException(
            status_code=500,
            detail="Unable to process symptom analysis at this time. Please try again or consult with a healthcare professional."
        )

def parse_ai_response(ai_response: str, request_data: SymptomAnalysisRequest) -> AIInsight:
    """
    Parse the AI response into structured format
    This is a simplified parser - in production, we'd use structured output from Claude
    """
    
    # Default values based on input data
    urgency_map = {
        range(1, 3): "low",
        range(3, 5): "moderate", 
        range(5, 8): "high",
        range(8, 11): "urgent"
    }
    
    urgency = "moderate"
    for severity_range, level in urgency_map.items():
        if request_data.severity in severity_range:
            urgency = level
            break
    
    # Enhanced parsing would extract specific sections from AI response
    # For now, we'll create a structured response based on the AI content
    
    return AIInsight(
        interpretation=f"Based on your symptoms of {request_data.symptom} with severity {request_data.severity}/10 lasting {request_data.duration}, here's what this might mean: {ai_response[:200]}...",
        urgencyLevel=urgency,
        recommendations=[
            "Keep a detailed symptom diary with timing and triggers",
            "Monitor symptoms closely for any changes",
            "Stay hydrated and get adequate rest",
            "Avoid activities that might worsen symptoms" if request_data.severity >= 5 else "Continue normal activities with attention to symptom changes"
        ],
        reassurance=get_emotional_reassurance(request_data.emotionalState),
        nextSteps=get_urgency_next_steps(urgency),
        whenToSeekCare=get_seek_care_guidance(urgency),
        confidence=85  # This would be determined by AI model confidence
    )

def get_emotional_reassurance(emotional_state: str) -> str:
    """Provide personalized reassurance based on emotional state"""
    reassurance_map = {
        "anxious": "I understand you're feeling anxious about these symptoms, and that's completely natural. It shows you're being attentive to your health, which is important. Many symptoms have manageable explanations, and seeking guidance is the right step.",
        "worried": "It's understandable that you're worried - experiencing new or concerning symptoms can be unsettling. You're taking the right approach by seeking information and being proactive about your health.",
        "panicked": "I can sense you're feeling quite overwhelmed right now, and I want you to know that's okay. Take a deep breath. Most symptoms, even concerning ones, have treatable causes. You're being responsible by seeking guidance.",
        "calm": "I appreciate that you're approaching this calmly and thoughtfully. This balanced perspective will serve you well as you navigate next steps for your health."
    }
    
    return reassurance_map.get(emotional_state, "You're taking a responsible approach to your health by seeking guidance. This proactive attitude is valuable for your overall well-being.")

def get_urgency_next_steps(urgency: str) -> List[str]:
    """Get next steps based on urgency level"""
    steps_map = {
        "low": [
            "Continue monitoring symptoms for changes",
            "Schedule a routine appointment with your primary care physician",
            "Maintain your normal activities while staying attentive to symptoms"
        ],
        "moderate": [
            "Schedule an appointment with your healthcare provider within a few days",
            "Prepare a detailed description of your symptoms",
            "Consider having someone accompany you to the appointment"
        ],
        "high": [
            "Contact your healthcare provider within 24 hours",
            "Consider urgent care if your primary doctor isn't available",
            "Have someone available to assist you if symptoms worsen"
        ],
        "urgent": [
            "Seek immediate medical attention at an emergency room",
            "Call 911 if symptoms are life-threatening",
            "Bring your medical history and current medications"
        ]
    }
    
    return steps_map.get(urgency, steps_map["moderate"])

def get_seek_care_guidance(urgency: str) -> str:
    """Get guidance on when to seek immediate care"""
    guidance_map = {
        "low": "Seek medical attention if symptoms worsen, persist longer than expected, or if you develop additional concerning symptoms.",
        "moderate": "Seek medical attention if symptoms significantly worsen, become severe, or if you develop additional symptoms like fever or severe pain.",
        "high": "Seek immediate medical attention if symptoms worsen rapidly, become severe, or if you experience difficulty breathing, chest pain, or severe pain.",
        "urgent": "This requires immediate medical attention. Do not delay - go to the emergency room or call 911 immediately."
    }
    
    return guidance_map.get(urgency, guidance_map["moderate"])