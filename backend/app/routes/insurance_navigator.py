from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from anthropic import AsyncAnthropic
import os
from datetime import datetime
from app.db import get_session
from app.security import HIPAASecurityManager, get_client_ip

router = APIRouter(prefix="/insurance-navigator", tags=["Insurance Navigator"])

# Configure Anthropic Claude client
client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class InsuranceProfile(BaseModel):
    insurance_type: str  # "private", "medicare", "medicaid", "tricare", "uninsured"
    plan_name: Optional[str] = None
    group_number: Optional[str] = None
    member_id: Optional[str] = None
    deductible: Optional[float] = None
    out_of_pocket_max: Optional[float] = None
    copay_specialist: Optional[float] = None
    coinsurance_percentage: Optional[float] = None
    prior_auth_required: List[str] = []
    network_restrictions: bool = True
    formulary_tier: Optional[str] = None

class TreatmentCosts(BaseModel):
    treatment_name: str
    base_cost: float
    insurance_coverage: float  # percentage
    estimated_out_of_pocket: float
    prior_authorization_required: bool
    appeal_likelihood: Optional[str] = None
    alternative_options: List[str] = []

class FinancialAssistanceProgram(BaseModel):
    program_name: str
    provider: str  # "pharmaceutical", "hospital", "nonprofit", "government"
    eligibility_criteria: Dict[str, Any]
    benefit_amount: Optional[float] = None
    benefit_percentage: Optional[float] = None
    application_deadline: Optional[str] = None
    contact_info: Dict[str, str]
    required_documents: List[str]
    processing_time: str

class InsuranceNavigationRequest(BaseModel):
    insurance_profile: InsuranceProfile
    diagnosis: str
    proposed_treatments: List[str]
    annual_income: Optional[float] = None
    household_size: Optional[int] = None
    employment_status: str = "employed"
    geographic_location: str
    urgency_level: str = "standard"

class NavigationResponse(BaseModel):
    coverage_analysis: List[TreatmentCosts]
    financial_assistance_programs: List[FinancialAssistanceProgram]
    appeal_strategies: List[Dict[str, Any]]
    cost_reduction_tips: List[str]
    payment_plan_options: List[Dict[str, Any]]
    total_estimated_costs: Dict[str, float]
    financial_impact_assessment: Dict[str, Any]
    next_steps: List[str]
    emergency_resources: List[Dict[str, str]]

@router.post("/analyze-coverage", response_model=NavigationResponse)
async def analyze_insurance_coverage(
    request_data: InsuranceNavigationRequest,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    Analyze insurance coverage and provide comprehensive financial navigation
    
    Uses AI to assess insurance benefits, identify cost-saving opportunities,
    and recommend financial assistance programs based on patient profile.
    """
    
    try:
        system_prompt = f"""You are InsuranceNavigator, an expert healthcare financial advocate and insurance specialist. Your expertise includes:

1. Insurance plan analysis and benefit interpretation
2. Prior authorization strategies and appeal processes
3. Financial assistance program identification and eligibility
4. Healthcare cost reduction and payment negotiation
5. Patient advocacy and financial toxicity prevention
6. Medicare, Medicaid, and private insurance navigation

Patient Insurance Profile:
- Insurance Type: {request_data.insurance_profile.insurance_type}
- Plan: {request_data.insurance_profile.plan_name or 'Not specified'}
- Deductible: ${request_data.insurance_profile.deductible or 'Unknown'}
- Out-of-pocket Max: ${request_data.insurance_profile.out_of_pocket_max or 'Unknown'}
- Network Restrictions: {request_data.insurance_profile.network_restrictions}

Clinical Context:
- Diagnosis: {request_data.diagnosis}
- Proposed Treatments: {', '.join(request_data.proposed_treatments)}
- Urgency Level: {request_data.urgency_level}

Financial Context:
- Annual Income: ${request_data.annual_income or 'Not provided'}
- Household Size: {request_data.household_size or 'Not provided'}
- Employment Status: {request_data.employment_status}
- Location: {request_data.geographic_location}

Your mission:
1. Analyze insurance coverage for each proposed treatment
2. Calculate realistic out-of-pocket cost estimates
3. Identify applicable financial assistance programs
4. Develop prior authorization and appeal strategies
5. Recommend cost reduction approaches
6. Assess financial toxicity risk and mitigation
7. Provide actionable next steps and resources

Guidelines:
- Prioritize patient financial protection and advocacy
- Provide realistic cost estimates with ranges
- Include both immediate and long-term financial planning
- Address insurance denial and appeal processes
- Consider patient's ability to pay and income level
- Recommend patient advocacy and social work resources
- Include emergency financial assistance options
- Address transportation, lodging, and indirect costs

Response should be comprehensive, actionable, and focused on reducing financial burden while ensuring access to necessary care."""

        user_prompt = f"""Please provide comprehensive insurance navigation and financial planning for this patient:

INSURANCE PROFILE:
Type: {request_data.insurance_profile.insurance_type}
Plan: {request_data.insurance_profile.plan_name or 'Not specified'}
Deductible: ${request_data.insurance_profile.deductible if request_data.insurance_profile.deductible else 'Unknown'}
Out-of-pocket Maximum: ${request_data.insurance_profile.out_of_pocket_max if request_data.insurance_profile.out_of_pocket_max else 'Unknown'}
Prior Auth Requirements: {', '.join(request_data.insurance_profile.prior_auth_required) if request_data.insurance_profile.prior_auth_required else 'None specified'}

MEDICAL SITUATION:
Diagnosis: {request_data.diagnosis}
Proposed Treatments: {', '.join(request_data.proposed_treatments)}
Urgency: {request_data.urgency_level}

FINANCIAL SITUATION:
Annual Income: ${request_data.annual_income if request_data.annual_income else 'Not provided'}
Household Size: {request_data.household_size if request_data.household_size else 'Not provided'}
Employment: {request_data.employment_status}
Location: {request_data.geographic_location}

Please provide:
1. Detailed coverage analysis for each treatment with cost estimates
2. Financial assistance program recommendations with eligibility criteria
3. Prior authorization and appeal strategies
4. Cost reduction techniques and negotiation tips
5. Payment plan and financing options
6. Financial toxicity risk assessment
7. Emergency resources for immediate financial needs
8. Step-by-step action plan for financial navigation

Focus on practical, actionable advice that empowers the patient to navigate insurance challenges and minimize financial burden while accessing necessary care."""

        # Call Claude API for insurance navigation
        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=3000,
            temperature=0.3,  # Balanced temperature for practical financial advice
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        ai_response = response.content[0].text
        
        # Parse AI response into structured navigation advice
        navigation_result = parse_insurance_navigation_response(ai_response, request_data)
        
        # Log the insurance navigation for audit
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,  # Would be actual user ID when authentication is added
            action="INSURANCE_NAVIGATION",
            resource="InsuranceNavigator",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "insurance_type": request_data.insurance_profile.insurance_type,
                "diagnosis": request_data.diagnosis,
                "treatments_analyzed": len(request_data.proposed_treatments),
                "urgency_level": request_data.urgency_level,
                "estimated_total_cost": navigation_result.total_estimated_costs.get("total_out_of_pocket", 0)
            }
        )
        
        return navigation_result
        
    except Exception as e:
        # Log the error
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="INSURANCE_NAVIGATION_ERROR",
            resource="InsuranceNavigator",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="failure",
            details={"error": str(e)}
        )
        
        raise HTTPException(
            status_code=500,
            detail="Unable to analyze insurance coverage at this time. Please contact a patient financial advocate for assistance."
        )

@router.post("/appeal-assistance")
async def generate_appeal_letter(
    treatment_name: str,
    denial_reason: str,
    insurance_profile: InsuranceProfile,
    medical_justification: str,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    Generate insurance appeal letter with medical justification
    
    Creates comprehensive appeal documentation based on denial reason
    and medical necessity evidence.
    """
    
    try:
        system_prompt = """You are AppealAdvocate, an expert in insurance appeals and medical necessity documentation. Your role is to craft compelling, evidence-based appeal letters that maximize the likelihood of coverage approval.

Key principles:
1. Lead with clear medical necessity and urgency
2. Reference specific insurance policy language when possible
3. Include relevant clinical guidelines and evidence
4. Address the specific denial reason directly
5. Maintain professional, factual tone
6. Include physician perspective and clinical rationale
7. Emphasize patient safety and standard of care

Your appeals should be thorough, well-organized, and persuasive while maintaining complete medical accuracy."""

        user_prompt = f"""Please generate a comprehensive insurance appeal letter for the following case:

TREATMENT: {treatment_name}
DENIAL REASON: {denial_reason}
INSURANCE TYPE: {insurance_profile.insurance_type}
PLAN: {insurance_profile.plan_name or 'Not specified'}

MEDICAL JUSTIFICATION:
{medical_justification}

Please provide:
1. A complete appeal letter addressing the specific denial
2. Key points to emphasize in the appeal
3. Supporting documentation recommendations
4. Timeline and follow-up strategy
5. Alternative appeal approaches if initial appeal fails

Format the letter professionally with appropriate medical and insurance terminology."""

        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=2000,
            temperature=0.2,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )
        
        appeal_result = parse_appeal_response(response.content[0].text)
        
        # Log the appeal generation
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="APPEAL_LETTER_GENERATED",
            resource="InsuranceNavigator",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "treatment": treatment_name,
                "denial_reason": denial_reason,
                "insurance_type": insurance_profile.insurance_type
            }
        )
        
        return appeal_result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to generate appeal letter: {str(e)}"
        )

@router.get("/financial-assistance/{diagnosis}")
async def find_financial_assistance(
    diagnosis: str,
    income_level: Optional[float] = None,
    insurance_type: Optional[str] = None,
    location: Optional[str] = None,
    session: AsyncSession = Depends(get_session)
):
    """
    Find financial assistance programs based on diagnosis and patient profile
    
    Returns comprehensive list of applicable assistance programs including
    pharmaceutical, hospital, nonprofit, and government resources.
    """
    
    try:
        # In production, this would query real financial assistance databases
        mock_programs = [
            FinancialAssistanceProgram(
                program_name="Patient Access Network Foundation",
                provider="nonprofit",
                eligibility_criteria={
                    "income_limit": "400% of Federal Poverty Level",
                    "insurance_required": True,
                    "diagnosis_specific": True
                },
                benefit_amount=15000,
                contact_info={
                    "phone": "1-866-316-7263",
                    "website": "https://panfoundation.org",
                    "email": "info@panfoundation.org"
                },
                required_documents=[
                    "Tax returns or income verification",
                    "Insurance cards",
                    "Medical records confirming diagnosis"
                ],
                processing_time="2-3 weeks"
            ),
            FinancialAssistanceProgram(
                program_name="Pharmaceutical Company Patient Assistance",
                provider="pharmaceutical",
                eligibility_criteria={
                    "income_limit": "300% of Federal Poverty Level",
                    "uninsured_or_underinsured": True
                },
                benefit_percentage=80.0,
                contact_info={
                    "phone": "1-800-XXX-XXXX",
                    "website": "manufacturer-assistance.com"
                },
                required_documents=[
                    "Income verification",
                    "Prescription from physician",
                    "Insurance denial letter (if applicable)"
                ],
                processing_time="4-6 weeks"
            )
        ]
        
        return {
            "programs_found": len(mock_programs),
            "search_criteria": {
                "diagnosis": diagnosis,
                "income_level": income_level,
                "insurance_type": insurance_type,
                "location": location
            },
            "programs": mock_programs,
            "total_potential_savings": sum(p.benefit_amount or 0 for p in mock_programs),
            "application_priority": "Submit applications in order of processing time and benefit amount"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to search financial assistance programs: {str(e)}"
        )

@router.post("/cost-estimate")
async def estimate_treatment_costs(
    treatments: List[str],
    insurance_profile: InsuranceProfile,
    location: str,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    """
    Provide detailed cost estimates for treatments based on insurance and location
    
    Calculates comprehensive cost breakdown including direct medical costs,
    indirect costs, and potential financial assistance.
    """
    
    try:
        # Mock cost estimation - in production would use real cost databases
        treatment_costs = []
        
        for treatment in treatments:
            if "surgery" in treatment.lower():
                base_cost = 85000
                coverage = 80
            elif "chemotherapy" in treatment.lower():
                base_cost = 12000
                coverage = 85
            elif "radiation" in treatment.lower():
                base_cost = 25000
                coverage = 90
            else:
                base_cost = 15000
                coverage = 75
            
            # Adjust for insurance type
            if insurance_profile.insurance_type == "medicare":
                coverage += 5
            elif insurance_profile.insurance_type == "medicaid":
                coverage += 10
            elif insurance_profile.insurance_type == "uninsured":
                coverage = 0
            
            out_of_pocket = base_cost * (1 - coverage / 100)
            
            treatment_costs.append(TreatmentCosts(
                treatment_name=treatment,
                base_cost=base_cost,
                insurance_coverage=coverage,
                estimated_out_of_pocket=out_of_pocket,
                prior_authorization_required="chemo" in treatment.lower() or "targeted" in treatment.lower(),
                appeal_likelihood="high" if coverage < 70 else "moderate",
                alternative_options=["Generic alternatives", "Clinical trials", "Financial assistance programs"]
            ))
        
        total_base = sum(t.base_cost for t in treatment_costs)
        total_out_of_pocket = sum(t.estimated_out_of_pocket for t in treatment_costs)
        
        # Log cost estimation
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,
            action="COST_ESTIMATION",
            resource="InsuranceNavigator",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "treatments_analyzed": len(treatments),
                "total_estimated_cost": total_base,
                "estimated_out_of_pocket": total_out_of_pocket,
                "insurance_type": insurance_profile.insurance_type
            }
        )
        
        return {
            "treatment_costs": treatment_costs,
            "cost_summary": {
                "total_base_cost": total_base,
                "total_out_of_pocket": total_out_of_pocket,
                "potential_savings": total_base - total_out_of_pocket,
                "coverage_percentage": ((total_base - total_out_of_pocket) / total_base * 100) if total_base > 0 else 0
            },
            "cost_reduction_opportunities": [
                "Apply for financial assistance programs",
                "Negotiate payment plans with providers",
                "Consider clinical trial participation",
                "Explore generic or biosimilar alternatives",
                "Review in-network vs out-of-network options"
            ],
            "indirect_costs": {
                "transportation": "Estimated $200-500 per month",
                "lodging": "Estimated $100-200 per night if travel required",
                "lost_wages": "Consider Family Medical Leave Act (FMLA) options",
                "caregiving_costs": "May qualify for respite care assistance"
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to estimate treatment costs: {str(e)}"
        )

def parse_insurance_navigation_response(ai_response: str, request_data: InsuranceNavigationRequest) -> NavigationResponse:
    """
    Parse AI response into structured insurance navigation advice
    Production version would use sophisticated parsing
    """
    
    # Mock coverage analysis
    coverage_analysis = []
    for treatment in request_data.proposed_treatments:
        if "surgery" in treatment.lower():
            base_cost = 125000.0
            coverage = 75.0 if request_data.insurance_profile.insurance_type == "private" else 85.0
        elif "chemotherapy" in treatment.lower():
            base_cost = 75000.0
            coverage = 80.0
        else:
            base_cost = 45000.0
            coverage = 70.0
        
        out_of_pocket = base_cost * (1 - coverage / 100)
        
        coverage_analysis.append(TreatmentCosts(
            treatment_name=treatment,
            base_cost=base_cost,
            insurance_coverage=coverage,
            estimated_out_of_pocket=out_of_pocket,
            prior_authorization_required=True,
            appeal_likelihood="moderate",
            alternative_options=["Financial assistance", "Payment plans", "Clinical trials"]
        ))
    
    # Mock financial assistance programs
    financial_programs = [
        FinancialAssistanceProgram(
            program_name="Cancer Care Co-Payment Assistance",
            provider="nonprofit",
            eligibility_criteria={
                "income_limit": "400% Federal Poverty Level",
                "cancer_diagnosis": True,
                "insurance_required": True
            },
            benefit_amount=10000.0,
            contact_info={
                "phone": "1-800-813-4673",
                "website": "https://cancercare.org",
                "email": "info@cancercare.org"
            },
            required_documents=[
                "Tax returns",
                "Insurance cards",
                "Medical records"
            ],
            processing_time="2-3 weeks"
        )
    ]
    
    # Calculate total costs
    total_out_of_pocket = sum(cost.estimated_out_of_pocket for cost in coverage_analysis)
    total_base_cost = sum(cost.base_cost for cost in coverage_analysis)
    
    return NavigationResponse(
        coverage_analysis=coverage_analysis,
        financial_assistance_programs=financial_programs,
        appeal_strategies=[
            {
                "strategy": "Medical Necessity Appeal",
                "description": "Emphasize clinical guidelines and physician recommendation",
                "success_rate": "65-75%",
                "timeline": "30-60 days"
            },
            {
                "strategy": "External Review Request", 
                "description": "Independent medical review if internal appeal fails",
                "success_rate": "40-50%",
                "timeline": "45-60 days"
            }
        ],
        cost_reduction_tips=[
            "Apply for patient assistance programs immediately after diagnosis",
            "Negotiate payment plans with all providers before treatment begins", 
            "Consider clinical trials which may provide free treatment",
            "Review in-network providers to minimize out-of-pocket costs",
            "Ask about financial hardship programs at treatment facilities",
            "Explore transportation and lodging assistance programs"
        ],
        payment_plan_options=[
            {
                "type": "Hospital payment plan",
                "terms": "0% interest, 12-24 month terms typically available",
                "requirements": "Financial hardship documentation"
            },
            {
                "type": "Medical credit cards",
                "terms": "Promotional 0% APR periods available",
                "caution": "High interest rates after promotional period"
            }
        ],
        total_estimated_costs={
            "total_base_cost": total_base_cost,
            "total_out_of_pocket": total_out_of_pocket,
            "potential_assistance": sum(p.benefit_amount or 0 for p in financial_programs),
            "net_patient_cost": max(0, total_out_of_pocket - sum(p.benefit_amount or 0 for p in financial_programs))
        },
        financial_impact_assessment={
            "financial_toxicity_risk": "moderate" if total_out_of_pocket < 50000 else "high",
            "affordability_score": min(10, max(1, 10 - (total_out_of_pocket / (request_data.annual_income or 50000)) * 10)),
            "recommended_interventions": [
                "Immediate financial counseling consultation",
                "Social work referral for assistance program applications",
                "Consider palliative care consultation for symptom management"
            ]
        },
        next_steps=[
            "Schedule appointment with hospital financial counselor within 48 hours",
            "Apply for identified financial assistance programs immediately",
            "Request itemized estimates from all providers",
            "Confirm all providers are in-network before treatment",
            "Document all insurance communications and denials"
        ],
        emergency_resources=[
            {
                "name": "Emergency Financial Assistance Hotline",
                "phone": "1-800-813-4673",
                "description": "Immediate financial counseling and emergency assistance"
            },
            {
                "name": "National Cancer Legal Helpline",
                "phone": "1-866-843-2572", 
                "description": "Free legal assistance for insurance and employment issues"
            }
        ]
    )

def parse_appeal_response(ai_response: str) -> Dict[str, Any]:
    """Parse appeal letter response"""
    return {
        "appeal_letter": ai_response[:1000] + "...",  # Truncated for demo
        "key_arguments": [
            "Medical necessity based on current clinical guidelines",
            "Standard of care for patient's specific condition and stage",
            "Lack of viable alternative treatments with similar efficacy"
        ],
        "supporting_documents": [
            "Physician letter of medical necessity",
            "Relevant clinical studies and guidelines",
            "Prior treatment history and outcomes",
            "Insurance policy language supporting coverage"
        ],
        "timeline": {
            "initial_submission": "Within 30 days of denial",
            "follow_up": "14 days after submission",
            "external_review": "If internal appeal denied"
        },
        "success_probability": "65-75% based on medical necessity documentation"
    }