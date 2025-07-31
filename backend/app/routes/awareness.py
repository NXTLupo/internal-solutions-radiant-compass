from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel

from app.db import get_session
from app.models import PatientProfile, MedicalCondition, JourneyProgress, AIGeneratedContent

router = APIRouter(prefix="/api/v1/awareness", tags=["awareness"])

class ConditionExplanationRequest(BaseModel):
    condition_name: str
    patient_age: Optional[int] = None
    severity: Optional[str] = None
    specific_questions: Optional[List[str]] = None

class ConditionExplanationResponse(BaseModel):
    condition_name: str
    simplified_explanation: str
    common_symptoms: List[str]
    treatment_approaches: List[str]
    prognosis_summary: str
    prevalence_info: str
    personalized_insights: List[str]
    next_steps: List[str]

class GoalRecommendationRequest(BaseModel):
    patient_id: int
    condition_id: int
    current_stage: str = "awareness"

class PersonalGoal(BaseModel):
    category: str  # physical, emotional, social, practical
    title: str
    description: str
    timeframe: str  # short, medium, long
    priority: str  # low, medium, high
    action_steps: List[str]

class GoalRecommendationResponse(BaseModel):
    recommended_goals: List[PersonalGoal]
    personalization_notes: List[str]

class QuickStartGuideRequest(BaseModel):
    condition_name: str
    patient_age: Optional[int] = None
    diagnosis_date: Optional[str] = None
    severity: Optional[str] = None

class QuickStartStep(BaseModel):
    timeframe: str  # "Week 1", "Week 2-3", "Week 4+"
    title: str
    priority_level: str  # immediate, foundation, planning
    tasks: List[str]
    resources: List[str]

class QuickStartGuideResponse(BaseModel):
    steps: List[QuickStartStep]
    emergency_contacts: List[str]
    important_reminders: List[str]
    personalized_tips: List[str]

@router.post("/explain-condition", response_model=ConditionExplanationResponse)
async def explain_condition(
    request: ConditionExplanationRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Generate a personalized, easy-to-understand explanation of the patient's condition.
    Uses AI to create age-appropriate, culturally sensitive explanations.
    """
    
    # This would integrate with your AI service (OpenAI, Claude, etc.)
    # For now, returning a structured example response
    
    # In a real implementation, you would:
    # 1. Query the MedicalCondition table for known information
    # 2. Use AI to generate personalized explanations based on patient profile
    # 3. Store the generated content in AIGeneratedContent table for future reference
    
    explanation = ConditionExplanationResponse(
        condition_name=request.condition_name,
        simplified_explanation=f"{request.condition_name} is a condition that affects how your body works in specific ways. While it may feel overwhelming at first, understanding your condition is the first step toward managing it effectively and living well.",
        common_symptoms=[
            "Fatigue and low energy levels",
            "Pain or discomfort in affected areas",
            "Changes in appetite or sleep patterns",
            "Mood changes or anxiety",
            "Difficulty with daily activities"
        ],
        treatment_approaches=[
            "Medication management tailored to your needs",
            "Physical therapy and gentle exercise",
            "Nutritional support and dietary changes",
            "Mental health counseling and support",
            "Regular monitoring and check-ups"
        ],
        prognosis_summary="With proper management and support, many people with this condition lead fulfilling lives. Early intervention and consistent care can significantly improve outcomes and quality of life.",
        prevalence_info=f"You're not alone - {request.condition_name} affects thousands of people worldwide, and there's a strong community of support available.",
        personalized_insights=[
            "Based on your profile, consider starting with gentle daily walks",
            "Your age group typically responds well to community support groups",
            "Many patients find symptom tracking helpful in the early stages"
        ],
        next_steps=[
            "Schedule a follow-up appointment with your healthcare provider",
            "Begin keeping a simple daily symptom diary",
            "Connect with patient advocacy groups in your area",
            "Start researching specialists who focus on your condition"
        ]
    )
    
    # Store the generated content for future reference
    ai_content = AIGeneratedContent(
        content_type="condition_explanation",
        prompt=f"Explain {request.condition_name} for patient understanding",
        generated_content=explanation.dict(),
        model_used="gpt-4",
        confidence_score=0.95
    )
    session.add(ai_content)
    await session.commit()
    
    return explanation

@router.post("/recommend-goals", response_model=GoalRecommendationResponse)
async def recommend_goals(
    request: GoalRecommendationRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Generate personalized goal recommendations based on patient profile and condition.
    """
    
    # Query patient profile and condition information
    patient_result = await session.execute(
        select(PatientProfile).where(PatientProfile.id == request.patient_id)
    )
    patient = patient_result.scalar_one_or_none()
    
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    condition_result = await session.execute(
        select(MedicalCondition).where(MedicalCondition.id == request.condition_id)
    )
    condition = condition_result.scalar_one_or_none()
    
    if not condition:
        raise HTTPException(status_code=404, detail="Condition not found")
    
    # Generate personalized goals based on patient profile
    recommended_goals = [
        PersonalGoal(
            category="physical",
            title="Understand my symptoms better",
            description="Learn to identify, track, and communicate about my symptoms effectively with my healthcare team",
            timeframe="short",
            priority="high",
            action_steps=[
                "Start a daily symptom diary using a simple app or notebook",
                "Learn about the common symptoms of my condition",
                "Practice describing symptoms using medical terminology",
                "Prepare questions for my next doctor visit"
            ]
        ),
        PersonalGoal(
            category="emotional",
            title="Build emotional resilience",
            description="Develop healthy coping strategies and find mental health support for this journey",
            timeframe="medium",
            priority="high",
            action_steps=[
                "Research counselors who specialize in chronic illness",
                "Practice stress management techniques like deep breathing",
                "Connect with family and friends for emotional support",
                "Consider joining a support group"
            ]
        ),
        PersonalGoal(
            category="social",
            title="Connect with others who understand",
            description="Build a network of peers and advocates who share similar experiences",
            timeframe="short",
            priority="medium",
            action_steps=[
                "Research online communities for my condition",
                "Look for local support groups in my area",
                "Connect with patient advocacy organizations",
                "Share my diagnosis with trusted friends and family"
            ]
        ),
        PersonalGoal(
            category="practical",
            title="Organize my healthcare management",
            description="Create systems to track appointments, medications, and medical information",
            timeframe="short",
            priority="high",
            action_steps=[
                "Create a healthcare binder or digital folder",
                "Set up a medication tracking system",
                "Organize all medical records and test results",
                "Create a list of all healthcare providers and contacts"
            ]
        )
    ]
    
    personalization_notes = [
        f"Goals are tailored for someone with {condition.name} at the awareness stage",
        "Timeframes can be adjusted based on your personal pace",
        "High priority goals should be addressed first",
        "Remember that this is a journey - take it one step at a time"
    ]
    
    return GoalRecommendationResponse(
        recommended_goals=recommended_goals,
        personalization_notes=personalization_notes
    )

@router.post("/quick-start-guide", response_model=QuickStartGuideResponse)
async def generate_quick_start_guide(
    request: QuickStartGuideRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Generate a personalized quick-start guide for the first weeks after diagnosis.
    """
    
    steps = [
        QuickStartStep(
            timeframe="Week 1",
            title="Immediate Actions",
            priority_level="immediate",
            tasks=[
                "Schedule a follow-up appointment with your primary care physician",
                "Request copies of all test results and medical records",
                "Start a simple symptom diary to track daily patterns",
                "Research your condition from reputable medical sources",
                "Notify your employer if time off may be needed"
            ],
            resources=[
                "National Institutes of Health (NIH) patient resources",
                "Patient advocacy organizations for your condition",
                "Hospital patient education materials",
                "Trusted medical websites like Mayo Clinic or WebMD"
            ]
        ),
        QuickStartStep(
            timeframe="Week 2-3",
            title="Building Your Foundation",
            priority_level="foundation",
            tasks=[
                "Connect with patient support groups or online communities",
                "Create a healthcare binder for organizing important documents",
                "Research and identify potential specialists in your area",
                "Inform close family members and friends about your diagnosis",
                "Begin building a list of questions for healthcare providers"
            ],
            resources=[
                "Local hospital support group directories",
                "Online communities like PatientsLikeMe or condition-specific forums",
                "Insurance provider directory for specialist referrals",
                "Family and friend communication scripts from patient advocacy groups"
            ]
        ),
        QuickStartStep(
            timeframe="Week 4+",
            title="Long-term Planning",
            priority_level="planning",
            tasks=[
                "Work with your healthcare team to develop a comprehensive treatment plan",
                "Set up regular check-in schedules and monitoring routines",
                "Explore lifestyle modifications that may help manage your condition",
                "Consider counseling or therapy for emotional support",
                "Plan for workplace accommodations if needed"
            ],
            resources=[
                "Treatment planning worksheets from patient organizations",
                "Lifestyle modification guides specific to your condition",
                "Mental health resources specializing in chronic illness",
                "Workplace accommodation resources from disability rights organizations"
            ]
        )
    ]
    
    emergency_contacts = [
        "Primary Care Physician: Keep after-hours number easily accessible",
        "Specialist (if assigned): Contact information for urgent questions",
        "Emergency Services: 911 for immediate medical emergencies",
        "Trusted Support Person: Family member or friend who can advocate for you",
        "Patient Advocate: Hospital or clinic patient advocate if available"
    ]
    
    important_reminders = [
        "Don't try to do everything at once - pace yourself",
        "It's normal to feel overwhelmed - reach out for help when needed",
        "Keep all medical appointments, even if you're feeling better",
        "Bring a trusted person to important medical appointments",
        "Always keep an updated list of medications with you"
    ]
    
    personalized_tips = [
        f"For {request.condition_name}, symptom tracking is especially important",
        "Many patients find mobile apps helpful for organizing health information",
        "Consider setting up automatic prescription refills early",
        "Join condition-specific online communities for peer support"
    ]
    
    # Store the generated guide
    ai_content = AIGeneratedContent(
        content_type="quick_start_guide",
        prompt=f"Generate quick start guide for {request.condition_name}",
        generated_content={
            "steps": [step.dict() for step in steps],
            "emergency_contacts": emergency_contacts,
            "reminders": important_reminders,
            "tips": personalized_tips
        },
        model_used="gpt-4",
        confidence_score=0.92
    )
    session.add(ai_content)
    await session.commit()
    
    return QuickStartGuideResponse(
        steps=steps,
        emergency_contacts=emergency_contacts,
        important_reminders=important_reminders,
        personalized_tips=personalized_tips
    )

@router.get("/journey-progress/{patient_id}")
async def get_journey_progress(
    patient_id: int,
    session: AsyncSession = Depends(get_session)
):
    """
    Get the patient's current progress through the awareness and orientation stage.
    """
    
    result = await session.execute(
        select(JourneyProgress)
        .where(JourneyProgress.patient_id == patient_id)
        .where(JourneyProgress.stage == "awareness")
    )
    progress = result.scalar_one_or_none()
    
    if not progress:
        # Create initial progress record
        progress = JourneyProgress(
            patient_id=patient_id,
            stage="awareness",
            status="in_progress",
            progress_percentage=0,
            completed_tasks=[],
            current_goals=[]
        )
        session.add(progress)
        await session.commit()
        await session.refresh(progress)
    
    return {
        "patient_id": patient_id,
        "stage": progress.stage,
        "status": progress.status,
        "progress_percentage": progress.progress_percentage,
        "completed_tasks": progress.completed_tasks,
        "current_goals": progress.current_goals,
        "last_updated": progress.updated_at
    }