from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from anthropic import AsyncAnthropic
import os
from datetime import datetime
from app.db import get_session
from app.security import HIPAASecurityManager, get_client_ip

router = APIRouter(prefix="/provider-prophet", tags=["Provider Prophet"])

# Configure Anthropic Claude client
client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class PatientPreferences(BaseModel):
    communication_style: str  # "detailed", "concise", "supportive", "clinical"
    treatment_philosophy: str  # "aggressive", "conservative", "balanced", "patient_choice"
    experience_priorities: List[str]  # ["volume", "outcomes", "innovation", "accessibility", "cultural_fit"]
    location_preferences: Dict[str, Any]
    insurance_requirements: List[str]
    language_preferences: List[str] = ["English"]
    cultural_considerations: List[str] = []
    accessibility_needs: List[str] = []

class ProviderProfile(BaseModel):
    id: str
    name: str
    specialty: str
    subspecialty: Optional[str] = None
    institution: str
    location: Dict[str, Any]
    credentials: List[str]
    experience_years: int
    annual_case_volume: int
    specialty_focus: List[str]
    treatment_philosophy: str
    communication_style: str
    languages_spoken: List[str]
    cultural_competencies: List[str]
    research_interests: List[str]
    clinical_trials_active: int
    patient_satisfaction_scores: Dict[str, float]
    outcome_metrics: Dict[str, Any]
    availability: Dict[str, Any]
    insurance_accepted: List[str]
    telemedicine_available: bool
    accessibility_features: List[str]

class MatchingCriteria(BaseModel):
    patient_profile: Dict[str, Any]
    patient_preferences: PatientPreferences
    condition_requirements: Dict[str, Any]
    urgency_level: str = "standard"
    geographic_radius: int = 50  # miles
    include_telemedicine: bool = True

class ProviderMatch(BaseModel):
    provider: ProviderProfile
    match_score: float  # 0-100
    compatibility_factors: Dict[str, float]
    strengths: List[str]
    considerations: List[str]
    predicted_satisfaction: float
    estimated_wait_time: str
    recommendation_reasoning: str

class ProphetResponse(BaseModel):
    matched_providers: List[ProviderMatch]
    matching_insights: Dict[str, Any]
    alternative_suggestions: List[str]
    optimization_recommendations: List[str]
    confidence_score: float

@router.post("/match-providers", response_model=ProphetResponse)
async def match_providers(
    matching_criteria: MatchingCriteria,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    Use AI to match patients with optimal healthcare providers
    
    Analyzes patient preferences, medical needs, and provider characteristics
    to predict optimal patient-provider relationships and outcomes.
    """
    
    try:
        system_prompt = f"""You are ProviderProphet, an expert AI system specialized in patient-provider matching and healthcare relationship optimization. Your expertise includes:

1. Provider-patient compatibility assessment
2. Communication style matching and preferences
3. Clinical expertise and volume analysis
4. Geographic and accessibility considerations
5. Cultural competency and language matching
6. Outcome prediction and satisfaction modeling
7. Healthcare navigation and referral optimization

Patient Profile Analysis:
- Communication Style: {matching_criteria.patient_preferences.communication_style}
- Treatment Philosophy: {matching_criteria.patient_preferences.treatment_philosophy}
- Priority Factors: {', '.join(matching_criteria.patient_preferences.experience_priorities)}
- Location Preferences: {matching_criteria.patient_preferences.location_preferences}
- Cultural Considerations: {', '.join(matching_criteria.patient_preferences.cultural_considerations) if matching_criteria.patient_preferences.cultural_considerations else 'None specified'}
- Language Preferences: {', '.join(matching_criteria.patient_preferences.language_preferences)}

Clinical Requirements:
- Condition: {matching_criteria.condition_requirements.get('diagnosis', 'Not specified')}
- Urgency Level: {matching_criteria.urgency_level}
- Geographic Radius: {matching_criteria.geographic_radius} miles
- Telemedicine: {'Accepted' if matching_criteria.include_telemedicine else 'Not preferred'}

Your mission:
1. Analyze patient-provider compatibility across multiple dimensions
2. Predict relationship success and patient satisfaction
3. Consider clinical expertise, volume, and outcomes
4. Evaluate communication style and cultural fit
5. Assess practical factors (location, insurance, availability)
6. Generate personalized matching scores and recommendations
7. Provide insights for optimizing provider selection

Guidelines:
- Prioritize patient safety and clinical quality
- Balance patient preferences with medical necessity
- Consider both quantitative metrics and qualitative factors
- Provide transparent reasoning for matching recommendations
- Address potential barriers or concerns
- Suggest alternative options when primary matches aren't optimal
- Focus on long-term relationship success and patient outcomes

Response should provide comprehensive matching analysis with actionable provider recommendations."""

        user_prompt = f"""Please analyze and match healthcare providers for this patient profile:

PATIENT PREFERENCES:
Communication Style: {matching_criteria.patient_preferences.communication_style}
Treatment Philosophy: {matching_criteria.patient_preferences.treatment_philosophy}
Priority Factors: {', '.join(matching_criteria.patient_preferences.experience_priorities)}
Location: {matching_criteria.patient_preferences.location_preferences}
Insurance Requirements: {', '.join(matching_criteria.patient_preferences.insurance_requirements)}
Languages: {', '.join(matching_criteria.patient_preferences.language_preferences)}
Cultural Considerations: {', '.join(matching_criteria.patient_preferences.cultural_considerations) if matching_criteria.patient_preferences.cultural_considerations else 'None'}
Accessibility Needs: {', '.join(matching_criteria.patient_preferences.accessibility_needs) if matching_criteria.patient_preferences.accessibility_needs else 'None'}

CLINICAL REQUIREMENTS:
Condition: {matching_criteria.condition_requirements.get('diagnosis', 'Cancer care')}
Stage/Severity: {matching_criteria.condition_requirements.get('stage', 'Not specified')}
Specific Needs: {matching_criteria.condition_requirements.get('specific_requirements', 'Comprehensive oncology care')}
Urgency: {matching_criteria.urgency_level}

GEOGRAPHIC PARAMETERS:
Search Radius: {matching_criteria.geographic_radius} miles
Telemedicine Options: {'Include' if matching_criteria.include_telemedicine else 'Exclude'}

Please provide:
1. Top provider matches with detailed compatibility analysis
2. Matching scores based on patient priorities and clinical needs
3. Predicted patient satisfaction and relationship success factors
4. Specific strengths and considerations for each provider match
5. Alternative suggestions if primary matches have limitations
6. Optimization recommendations for improving provider selection
7. Insights into factors most important for this patient's success

Focus on creating meaningful, personalized matches that optimize both clinical outcomes and patient experience."""

        # Call Claude API for provider matching
        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=3000,
            temperature=0.4,  # Moderate temperature for balanced clinical and personal matching
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        ai_response = response.content[0].text
        
        # Parse AI response into structured provider matches
        prophet_result = parse_provider_matching_response(ai_response, matching_criteria)
        
        # Log the provider matching for audit
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,  # Would be actual user ID when authentication is added
            action="PROVIDER_MATCHING",
            resource="ProviderProphet",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "urgency_level": matching_criteria.urgency_level,
                "geographic_radius": matching_criteria.geographic_radius,
                "providers_matched": len(prophet_result.matched_providers),
                "confidence_score": prophet_result.confidence_score,
                "primary_priorities": matching_criteria.patient_preferences.experience_priorities[:3]
            }
        )
        
        return prophet_result
        
    except Exception as e:
        # Log the error
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="PROVIDER_MATCHING_ERROR",
            resource="ProviderProphet",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="failure",
            details={"error": str(e)}
        )
        
        raise HTTPException(
            status_code=500,
            detail="Unable to match providers at this time. Please contact your care coordinator for provider referrals."
        )

@router.post("/analyze-compatibility")
async def analyze_provider_compatibility(
    provider_id: str,
    patient_profile: Dict[str, Any],
    patient_preferences: PatientPreferences,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    Analyze compatibility between specific patient and provider
    
    Provides detailed compatibility assessment for a specific
    patient-provider pairing with actionable insights.
    """
    
    try:
        # Mock provider lookup - in production would query provider database
        mock_provider = get_mock_provider(provider_id)
        
        system_prompt = """You are CompatibilityAnalyzer, an expert in patient-provider relationship assessment. Your role is to provide detailed compatibility analysis between a specific patient and healthcare provider.

Focus on:
1. Communication style alignment and potential friction points
2. Treatment philosophy compatibility and shared decision-making
3. Cultural competency and sensitivity factors
4. Practical considerations (location, scheduling, insurance)
5. Clinical expertise match for patient's specific needs
6. Predicted relationship satisfaction and success factors
7. Specific strategies for optimizing the patient-provider relationship

Provide honest, balanced assessment that helps patients make informed decisions about their healthcare relationships."""

        user_prompt = f"""Please analyze the compatibility between this patient and provider:

PATIENT PROFILE:
Communication Preference: {patient_preferences.communication_style}
Treatment Philosophy: {patient_preferences.treatment_philosophy}
Cultural Background: {', '.join(patient_preferences.cultural_considerations) if patient_preferences.cultural_considerations else 'Not specified'}
Language Preference: {', '.join(patient_preferences.language_preferences)}
Priority Factors: {', '.join(patient_preferences.experience_priorities)}

PROVIDER PROFILE:
Name: {mock_provider['name']}
Specialty: {mock_provider['specialty']}
Institution: {mock_provider['institution']}
Experience: {mock_provider['experience_years']} years
Communication Style: {mock_provider['communication_style']}
Treatment Philosophy: {mock_provider['treatment_philosophy']}
Languages: {', '.join(mock_provider['languages_spoken'])}
Cultural Competencies: {', '.join(mock_provider['cultural_competencies'])}
Patient Satisfaction: {mock_provider['patient_satisfaction_scores']['overall']}/5.0

Please provide:
1. Overall compatibility score and assessment
2. Strengths of this patient-provider match
3. Potential areas of concern or misalignment
4. Specific recommendations for optimizing the relationship
5. Questions the patient should ask during their consultation
6. Alternative providers if compatibility concerns are significant

Focus on practical insights that help the patient prepare for and succeed in this healthcare relationship."""

        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=1500,
            temperature=0.3,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        compatibility_result = parse_compatibility_analysis(response.content[0].text, mock_provider)
        
        # Log the compatibility analysis
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="COMPATIBILITY_ANALYSIS",
            resource="ProviderProphet",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "provider_id": provider_id,
                "compatibility_score": compatibility_result.get("compatibility_score", 0),
                "analysis_type": "detailed_assessment"
            }
        )
        
        return compatibility_result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to analyze provider compatibility: {str(e)}"
        )

@router.get("/provider-search")
async def search_providers(
    specialty: str,
    location: Optional[str] = None,
    radius: int = 25,
    insurance: Optional[List[str]] = None,
    min_experience: int = 0,
    languages: Optional[List[str]] = None,
    session: AsyncSession = Depends(get_session)
):
    """
    Search for healthcare providers based on criteria
    
    Returns list of providers matching search criteria with
    basic information and availability.
    """
    
    try:
        # Mock provider search - in production would query provider database
        mock_providers = get_mock_provider_search_results(
            specialty=specialty,
            location=location,
            radius=radius,
            insurance=insurance,
            min_experience=min_experience,
            languages=languages
        )
        
        return {
            "providers_found": len(mock_providers),
            "search_criteria": {
                "specialty": specialty,
                "location": location,
                "radius": radius,
                "insurance": insurance,
                "min_experience": min_experience,
                "languages": languages
            },
            "providers": mock_providers,
            "search_suggestions": [
                "Consider expanding search radius for more options",
                "Telemedicine providers may offer additional flexibility",
                "Specialist referrals from primary care providers often have priority scheduling"
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to search providers: {str(e)}"
        )

def parse_provider_matching_response(ai_response: str, matching_criteria: MatchingCriteria) -> ProphetResponse:
    """
    Parse AI response into structured provider matching results
    Production version would use sophisticated parsing
    """
    
    # Mock provider matches with realistic data
    mock_providers = [
        ProviderProfile(
            id="provider_001",
            name="Dr. Sarah Chen",
            specialty="Medical Oncology",
            subspecialty="Thoracic Oncology",
            institution="Memorial Cancer Center",
            location={
                "city": "New York",
                "state": "NY",
                "distance": 15.2,
                "address": "1275 York Avenue"
            },
            credentials=["MD", "PhD", "Board Certified Medical Oncology"],
            experience_years=18,
            annual_case_volume=450,
            specialty_focus=["Lung Cancer", "Mesothelioma", "Thoracic Malignancies"],
            treatment_philosophy="balanced",
            communication_style="detailed",
            languages_spoken=["English", "Mandarin"],
            cultural_competencies=["Asian-American Healthcare", "Multilingual Care"],
            research_interests=["Immunotherapy", "Precision Medicine", "Clinical Trials"],
            clinical_trials_active=8,
            patient_satisfaction_scores={
                "overall": 4.8,
                "communication": 4.9,
                "wait_time": 4.2,
                "staff_courtesy": 4.7
            },
            outcome_metrics={
                "survival_outcomes": "Above national average",
                "complication_rates": "Below average",
                "patient_reported_outcomes": "Excellent"
            },
            availability={
                "next_appointment": "2 weeks",
                "urgent_availability": "48 hours",
                "telemedicine": True
            },
            insurance_accepted=["Medicare", "Medicaid", "Blue Cross", "Aetna", "Cigna"],
            telemedicine_available=True,
            accessibility_features=["Wheelchair accessible", "Translation services", "Patient navigator"]
        ),
        ProviderProfile(
            id="provider_002",
            name="Dr. Michael Rodriguez",
            specialty="Medical Oncology",
            subspecialty="Hematologic Malignancies",
            institution="University Medical Center",
            location={
                "city": "Philadelphia", 
                "state": "PA",
                "distance": 22.8,
                "address": "3400 Civic Center Blvd"
            },
            credentials=["MD", "Board Certified Medical Oncology", "Fellowship Hematology"],
            experience_years=12,
            annual_case_volume=380,
            specialty_focus=["Blood Cancers", "Bone Marrow Transplant", "CAR-T Therapy"],
            treatment_philosophy="aggressive",
            communication_style="clinical",
            languages_spoken=["English", "Spanish"],
            cultural_competencies=["Hispanic Healthcare", "Bilingual Care"],
            research_interests=["CAR-T Cell Therapy", "Stem Cell Transplant", "Novel Therapeutics"],
            clinical_trials_active=12,
            patient_satisfaction_scores={
                "overall": 4.6,
                "communication": 4.4,
                "wait_time": 4.8,
                "staff_courtesy": 4.5
            },
            outcome_metrics={
                "survival_outcomes": "Excellent for complex cases",
                "complication_rates": "Average",
                "patient_reported_outcomes": "Good"
            },
            availability={
                "next_appointment": "3 weeks",
                "urgent_availability": "72 hours", 
                "telemedicine": True
            },
            insurance_accepted=["Medicare", "Blue Cross", "United Healthcare", "Aetna"],
            telemedicine_available=True,
            accessibility_features=["Wheelchair accessible", "Spanish translation", "Financial counseling"]
        )
    ]
    
    # Create provider matches with scoring
    matched_providers = []
    for provider in mock_providers:
        # Calculate match score based on patient preferences
        match_score = calculate_provider_match_score(provider, matching_criteria)
        
        provider_match = ProviderMatch(
            provider=provider,
            match_score=match_score,
            compatibility_factors={
                "clinical_expertise": 92.0,
                "communication_fit": 88.0,
                "location_convenience": 85.0,
                "availability": 78.0,
                "cultural_competency": 95.0
            },
            strengths=[
                "Excellent clinical outcomes in specialty area",
                "Strong communication and patient satisfaction scores", 
                "Active in cutting-edge research and clinical trials",
                "Comprehensive support services available"
            ],
            considerations=[
                "Moderate wait time for routine appointments",
                "High patient volume may limit consultation time",
                "Consider scheduling preferences and availability"
            ],
            predicted_satisfaction=4.7,
            estimated_wait_time=provider.availability["next_appointment"],
            recommendation_reasoning=f"Dr. {provider.name.split()[-1]} is highly recommended based on their {provider.experience_years} years of experience, excellent patient outcomes, and strong match with your treatment preferences and communication style."
        )
        
        matched_providers.append(provider_match)
    
    # Sort by match score
    matched_providers.sort(key=lambda x: x.match_score, reverse=True)
    
    return ProphetResponse(
        matched_providers=matched_providers,
        matching_insights={
            "primary_matching_factors": ["Clinical expertise", "Communication style", "Location convenience"],
            "patient_priority_alignment": "Strong match with volume and outcome preferences",
            "geographic_considerations": "Both providers within preferred radius",
            "insurance_compatibility": "All options covered by patient insurance",
            "cultural_factors": "Language and cultural competency well-matched"
        },
        alternative_suggestions=[
            "Consider expanding geographic search radius for additional options",
            "Telemedicine consultations available for follow-up care",
            "Second opinion consultations available at both institutions"
        ],
        optimization_recommendations=[
            "Schedule initial consultation with top 2 matched providers",
            "Prepare list of questions about treatment philosophy and communication preferences",
            "Consider patient navigator services for care coordination",
            "Discuss clinical trial opportunities during consultations"
        ],
        confidence_score=87.5
    )

def calculate_provider_match_score(provider: ProviderProfile, criteria: MatchingCriteria) -> float:
    """Calculate compatibility score between patient and provider"""
    
    score = 0.0
    
    # Clinical expertise weighting
    if "volume" in criteria.patient_preferences.experience_priorities:
        score += min(provider.annual_case_volume / 500, 1.0) * 25
    
    if "outcomes" in criteria.patient_preferences.experience_priorities:
        score += provider.patient_satisfaction_scores["overall"] / 5.0 * 25
    
    # Communication style alignment
    comm_match = 1.0 if provider.communication_style == criteria.patient_preferences.communication_style else 0.7
    score += comm_match * 20
    
    # Location convenience
    distance_score = max(0, (50 - provider.location["distance"]) / 50)
    score += distance_score * 15
    
    # Innovation/research factor
    if "innovation" in criteria.patient_preferences.experience_priorities:
        score += min(provider.clinical_trials_active / 10, 1.0) * 15
    
    return min(score, 100.0)

def get_mock_provider(provider_id: str) -> Dict[str, Any]:
    """Get mock provider data for compatibility analysis"""
    return {
        "name": "Dr. Sarah Chen",
        "specialty": "Medical Oncology",
        "institution": "Memorial Cancer Center",
        "experience_years": 18,
        "communication_style": "detailed",
        "treatment_philosophy": "balanced",
        "languages_spoken": ["English", "Mandarin"],
        "cultural_competencies": ["Asian-American Healthcare", "Multilingual Care"],
        "patient_satisfaction_scores": {"overall": 4.8}
    }

def parse_compatibility_analysis(ai_response: str, provider: Dict[str, Any]) -> Dict[str, Any]:
    """Parse provider compatibility analysis"""
    return {
        "compatibility_score": 88.5,
        "overall_assessment": "Strong compatibility with excellent clinical match",
        "strengths": [
            "Excellent alignment in communication preferences",
            "Shared treatment philosophy supports collaborative decision-making",
            "Strong clinical expertise in patient's condition",
            "Cultural competency and language support available"
        ],
        "considerations": [
            "High patient volume may affect appointment availability",
            "Detailed communication style may extend consultation times",
            "Consider scheduling preferences for optimal experience"
        ],
        "optimization_tips": [
            "Schedule longer initial consultation to establish relationship",
            "Prepare written questions to maximize consultation efficiency",
            "Utilize patient portal for ongoing communication",
            "Consider patient navigator services if available"
        ],
        "consultation_questions": [
            "What is your approach to treatment decision-making with patients?",
            "How do you typically communicate test results and treatment updates?",
            "What support resources are available for patients and families?",
            "How do you coordinate care with other specialists?"
        ]
    }

def get_mock_provider_search_results(specialty: str, location: str = None, radius: int = 25, insurance: List[str] = None, min_experience: int = 0, languages: List[str] = None) -> List[Dict[str, Any]]:
    """Generate mock provider search results"""
    return [
        {
            "id": "provider_001",
            "name": "Dr. Sarah Chen",
            "specialty": specialty,
            "institution": "Memorial Cancer Center",
            "location": {"city": "New York", "state": "NY", "distance": 15.2},
            "experience_years": 18,
            "patient_rating": 4.8,
            "next_available": "2 weeks",
            "accepting_new_patients": True,
            "telemedicine_available": True
        },
        {
            "id": "provider_002", 
            "name": "Dr. Michael Rodriguez",
            "specialty": specialty,
            "institution": "University Medical Center",
            "location": {"city": "Philadelphia", "state": "PA", "distance": 22.8},
            "experience_years": 12,
            "patient_rating": 4.6,
            "next_available": "3 weeks",
            "accepting_new_patients": True,
            "telemedicine_available": True
        }
    ]