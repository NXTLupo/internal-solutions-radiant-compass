from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from typing import List, Dict, Any
from anthropic import AsyncAnthropic
import os
from app.db import get_session
from app.security import HIPAASecurityManager, get_client_ip
from sqlalchemy.ext.asyncio import AsyncSession
import json

router = APIRouter()

# Configure Anthropic Claude client
client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class TreatmentRequest(BaseModel):
    cancer_type: str
    cancer_stage: str
    markers: str
    previous_treatments: str

class TreatmentResponse(BaseModel):
    treatmentOptions: List[Dict[str, Any]]

@router.post("/treatment-options", response_model=TreatmentResponse)
async def get_treatment_options(
    request_data: TreatmentRequest,
    request: Request,
    session: AsyncSession = Depends(get_session)
):
    try:
        system_prompt = """You are TreatmentArchitect, an AI expert in oncology and personalized medicine. Your role is to provide a comparative analysis of treatment options based on patient data. You must return a JSON object with a single key: 'treatmentOptions'. Each option should include fields for name, category, description, efficacy, sideEffects, duration, cost, and novelty, each with a 'value' (numeric 1-10, except for duration in months) and a 'label' (string)."""

        user_prompt = f"""Analyze treatment options for a patient with:
- Cancer Type: {request_data.cancer_type}
- Stage: {request_data.cancer_stage}
- Biomarkers: {request_data.markers}
- Previous Treatments: {request_data.previous_treatments}

Provide a comparative analysis of at least 3 relevant treatment modalities (e.g., Chemotherapy, Targeted Therapy, Immunotherapy). For each, provide the name, category, description, efficacy, side effects, duration, cost, and novelty. Return the response as a JSON object with a single key: 'treatmentOptions'."""

        response = await client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=2048,
            temperature=0.5,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt}
            ]
        )

        ai_response = response.content[0].text
        parsed_response = json.loads(ai_response)

        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None,  # Replace with actual user ID
            action="TREATMENT_OPTIONS_GENERATED",
            resource="TreatmentArchitect",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="success",
            details={
                "cancer_type": request_data.cancer_type,
                "cancer_stage": request_data.cancer_stage,
            }
        )

        return parsed_response

    except Exception as e:
        await HIPAASecurityManager.log_audit_event(
            session=session,
            user_id=None, # Replace with actual user ID
            action="TREATMENT_OPTIONS_ERROR",
            resource="TreatmentArchitect",
            ip_address=get_client_ip(request),
            user_agent=request.headers.get("user-agent"),
            status="failure",
            details={"error": str(e)}
        )
        raise HTTPException(
            status_code=500,
            detail="Unable to generate treatment options at this time."
        )
