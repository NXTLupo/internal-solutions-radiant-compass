from fastapi import APIRouter, HTTPException, Depends, Request, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from anthropic import AsyncAnthropic
import os
import PyPDF2
import io
from app.db import get_session
from app.security import HIPAASecurityManager, get_client_ip

router = APIRouter(prefix="/medical", tags=["Medical Translation"])

# Configure Anthropic Claude client
client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class TranslationRequest(BaseModel):
    medical_text: str
    document_type: str  # "pathology", "treatment_plan", "lab_results", "consultation_notes"
    target_grade_level: int = 6  # Default to 6th grade reading level
    include_checklist: bool = True
    patient_context: Optional[str] = None

class TranslationResponse(BaseModel):
    simplified_text: str
    grade_level: int
    key_points: List[str]
    medical_terms_glossary: Dict[str, str]
    consultation_checklist: Optional[List[str]] = None
    confidence_score: int
    original_complexity_score: int

class PathologyTranslationRequest(BaseModel):
    pathology_text: str
    cancer_type: Optional[str] = None
    patient_age: Optional[int] = None
    include_visual_aids: bool = True

class PathologyTranslationResponse(BaseModel):
    patient_friendly_summary: str
    detailed_explanation: str
    key_findings: List[Dict[str, Any]]
    prognosis_explanation: str
    next_steps: List[str]
    questions_to_ask_doctor: List[str]
    medical_terms_explained: Dict[str, str]
    urgency_level: str  # "routine", "concerning", "urgent"

@router.post("/translate", response_model=TranslationResponse)
async def translate_medical_text(
    request_data: TranslationRequest,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    Translate complex medical text into patient-friendly language
    
    Uses Claude 3.7 Sonnet to convert medical jargon into accessible,
    empathetic explanations while maintaining medical accuracy.
    """
    
    try:
        # Create specialized prompt based on document type
        system_prompt = f"""You are MedTranslator, an expert medical translator who specializes in converting complex medical documentation into clear, accessible language that patients and families can understand.

Your mission is to:
1. Translate medical jargon into {request_data.target_grade_level}th-grade reading level language
2. Maintain complete medical accuracy while improving accessibility
3. Provide empathetic, reassuring context when appropriate
4. Create practical action items and questions for patients
5. Highlight critical information that requires immediate attention

Document Type: {request_data.document_type}
Target Reading Level: {request_data.target_grade_level}th grade
Patient Context: {request_data.patient_context or "Not provided"}

Guidelines:
- Use simple, everyday words instead of medical terminology
- Explain complex concepts with analogies when helpful
- Organize information in logical, easy-to-follow sections
- Provide emotional support and reassurance where appropriate
- Always maintain the medical accuracy of the original content
- Include pronunciation guides for essential medical terms
- Suggest specific questions patients should ask their healthcare team

Response should include:
- simplified_text: Complete translation in accessible language
- key_points: 3-5 most important takeaways
- medical_terms_glossary: Key medical terms with simple definitions
- consultation_checklist: Questions patients should ask (if requested)
- confidence_score: Your confidence in the translation accuracy (1-100)"""

        document_specific_prompts = {
            "pathology": "Focus on explaining test results, what they mean for treatment options, and next steps. Be especially careful to provide hope and context while being honest about findings.",
            "treatment_plan": "Explain treatment options, timelines, side effects, and what to expect. Help patients understand their choices and feel empowered in decision-making.",
            "lab_results": "Interpret numerical values, explain what's normal vs. concerning, and provide context for changes over time.",
            "consultation_notes": "Summarize key discussion points, decisions made, and follow-up actions in an organized, actionable format."
        }
        
        user_prompt = f"""Please translate this medical text into patient-friendly language:

MEDICAL TEXT TO TRANSLATE:
{request_data.medical_text}

SPECIFIC FOCUS FOR {request_data.document_type.upper()}:
{document_specific_prompts.get(request_data.document_type, "Provide clear, accessible translation maintaining medical accuracy.")}

Please provide a comprehensive translation that helps the patient understand their health information clearly and feel empowered to participate in their care."""

        # Call Claude API
        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=1500,
            temperature=0.3,  # Lower temperature for more consistent medical translation
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        ai_response = response.content[0].text
        
        # Parse the AI response (enhanced parsing would be implemented)
        translation_result = parse_translation_response(ai_response, request_data)
        
        # Log the translation for audit purposes (HIPAA compliance)
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,  # Would be actual user ID when authentication is added
            action="MEDICAL_TRANSLATION",
            resource="MedicalTranslation",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "document_type": request_data.document_type,
                "target_grade_level": request_data.target_grade_level,
                "text_length": len(request_data.medical_text),
                "confidence_score": translation_result.confidence_score
            }
        )
        
        return translation_result
        
    except Exception as e:
        # Log the error
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="MEDICAL_TRANSLATION_ERROR",
            resource="MedicalTranslation",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="failure",
            details={"error": str(e)}
        )
        
        raise HTTPException(
            status_code=500,
            detail="Unable to process medical translation at this time. Please consult with your healthcare provider for clarification."
        )

@router.post("/translate-pathology", response_model=PathologyTranslationResponse)
async def translate_pathology_report(
    request_data: PathologyTranslationRequest,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    Specialized pathology report translation with enhanced emotional support
    
    Provides comprehensive, compassionate translation of pathology reports
    with specific focus on patient empowerment and next-step guidance.
    """
    
    try:
        system_prompt = """You are PathologyWise, a specialized medical translator focused on pathology reports. Your expertise is in taking complex pathology findings and creating clear, compassionate explanations that help patients understand their diagnosis while maintaining hope and empowerment.

Your approach:
1. Lead with the most important information in accessible language
2. Provide context for what findings mean for treatment and prognosis
3. Explain medical terms with simple analogies
4. Offer emotional support and realistic hope
5. Create actionable next steps and empowering questions
6. Assess urgency level based on findings

Key principles:
- Start with what the patient most needs to know
- Use "your results show" rather than "the specimen demonstrates"
- Explain staging and grading in understandable terms
- Provide context for treatment implications
- Balance honesty with hope and support
- Include specific questions to ask the medical team

Response should include comprehensive pathology translation with emotional intelligence."""

        user_prompt = f"""Please provide a comprehensive, compassionate translation of this pathology report:

PATHOLOGY REPORT:
{request_data.pathology_text}

PATIENT CONTEXT:
Cancer Type: {request_data.cancer_type or "Not specified"}
Patient Age: {request_data.patient_age or "Not provided"}
Include Visual Aids: {request_data.include_visual_aids}

Please provide:
1. A brief, clear summary of what the results mean
2. Detailed explanation in accessible language
3. Key findings with practical implications
4. Realistic but hopeful prognosis context
5. Specific next steps and timeline
6. Empowering questions for the medical team
7. Simple definitions of medical terms used
8. Assessment of urgency level for follow-up

Focus on empowering the patient with understanding while providing appropriate emotional support."""

        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=2000,
            temperature=0.3,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        ai_response = response.content[0].text
        
        # Parse pathology-specific response
        pathology_result = parse_pathology_response(ai_response, request_data)
        
        # Log the pathology translation
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="PATHOLOGY_TRANSLATION",
            resource="PathologyTranslation", 
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "cancer_type": request_data.cancer_type,
                "urgency_level": pathology_result.urgency_level,
                "text_length": len(request_data.pathology_text)
            }
        )
        
        return pathology_result
        
    except Exception as e:
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="PATHOLOGY_TRANSLATION_ERROR",
            resource="PathologyTranslation",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="failure",
            details={"error": str(e)}
        )
        
        raise HTTPException(
            status_code=500,
            detail="Unable to process pathology translation. Please discuss these results with your healthcare provider."
        )

@router.post("/translate-pdf")
async def translate_pdf_document(
    file: UploadFile = File(...),
    document_type: str = "pathology",
    target_grade_level: int = 6,
    request: Request = None,
    session: AsyncSession = Depends(get_session)
):
    """
    Upload and translate PDF medical documents
    
    Extracts text from PDF medical documents and provides
    patient-friendly translations with comprehensive support.
    """
    
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
        # Read PDF content
        pdf_content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
        
        # Extract text from all pages
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() + "\n"
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        # Create translation request
        translation_request = TranslationRequest(
            medical_text=extracted_text,
            document_type=document_type,
            target_grade_level=target_grade_level,
            include_checklist=True
        )
        
        # Process translation
        result = await translate_medical_text(translation_request, request, session)
        
        return {
            "filename": file.filename,
            "pages_processed": len(pdf_reader.pages),
            "translation": result
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing PDF: {str(e)}"
        )

def parse_translation_response(ai_response: str, request_data: TranslationRequest) -> TranslationResponse:
    """
    Parse AI response into structured translation format
    Enhanced parsing would extract specific sections from AI response
    """
    
    # This is a simplified parser - production version would use structured output
    simplified_text = ai_response[:500] + "..." if len(ai_response) > 500 else ai_response
    
    # Extract key points (would be enhanced with better parsing)
    key_points = [
        "Your test results have been reviewed by medical experts",
        "The findings help guide your treatment plan",
        "Your healthcare team will discuss next steps with you"
    ]
    
    # Basic medical terms glossary
    medical_terms = {
        "pathology": "the study of disease by examining tissue samples",
        "biopsy": "a small sample of tissue taken for examination",
        "malignant": "cancerous cells that can spread to other parts of the body",
        "benign": "non-cancerous cells that typically don't spread"
    }
    
    # Generate consultation checklist if requested
    consultation_checklist = None
    if request_data.include_checklist:
        consultation_checklist = [
            "What do these results mean for my treatment options?",
            "What are the next steps in my care plan?",
            "How quickly do we need to make decisions?",
            "What support resources are available to me?",
            "Who else should I involve in these discussions?"
        ]
    
    return TranslationResponse(
        simplified_text=simplified_text,
        grade_level=request_data.target_grade_level,
        key_points=key_points,
        medical_terms_glossary=medical_terms,
        consultation_checklist=consultation_checklist,
        confidence_score=88,
        original_complexity_score=85
    )

def parse_pathology_response(ai_response: str, request_data: PathologyTranslationRequest) -> PathologyTranslationResponse:
    """
    Parse AI response for pathology-specific translation
    Production version would have sophisticated parsing
    """
    
    # Simplified parsing - production would extract structured sections
    patient_summary = "Your pathology results provide important information about your condition. The tissue sample was carefully examined to understand the specific characteristics of your diagnosis."
    
    detailed_explanation = ai_response[:800] + "..." if len(ai_response) > 800 else ai_response
    
    key_findings = [
        {
            "finding": "Tissue Type Identification",
            "explanation": "The pathologist identified the specific type of cells present",
            "clinical_significance": "This helps determine the most effective treatment approach"
        },
        {
            "finding": "Stage and Grade Assessment", 
            "explanation": "The extent and aggressiveness of the condition was evaluated",
            "clinical_significance": "This information guides treatment timing and intensity"
        }
    ]
    
    next_steps = [
        "Schedule a follow-up appointment with your oncologist within 1-2 weeks",
        "Discuss treatment options based on these specific findings",
        "Consider getting a second opinion if desired",
        "Begin connecting with support resources and patient advocacy groups"
    ]
    
    questions_to_ask = [
        "Based on these pathology results, what are my treatment options?",
        "What is the recommended timeline for starting treatment?",
        "What does this mean for my long-term prognosis?",
        "Are there clinical trials I should consider?",
        "What support resources do you recommend for me and my family?"
    ]
    
    medical_terms = {
        "differentiation": "how much the cancer cells look like normal cells",
        "margins": "the edges of the tissue sample, showing if all abnormal cells were removed",
        "staging": "describing the size and spread of cancer",
        "grading": "how abnormal the cancer cells look under a microscope"
    }
    
    # Determine urgency based on keywords (would be enhanced with AI analysis)
    urgency_keywords = ["urgent", "immediate", "aggressive", "rapidly"]
    urgency_level = "routine"
    if any(keyword in ai_response.lower() for keyword in urgency_keywords):
        urgency_level = "concerning" if "urgent" not in ai_response.lower() else "urgent"
    
    return PathologyTranslationResponse(
        patient_friendly_summary=patient_summary,
        detailed_explanation=detailed_explanation,
        key_findings=key_findings,
        prognosis_explanation="Your healthcare team will use these results to create a personalized treatment plan designed to give you the best possible outcomes.",
        next_steps=next_steps,
        questions_to_ask_doctor=questions_to_ask,
        medical_terms_explained=medical_terms,
        urgency_level=urgency_level
    )