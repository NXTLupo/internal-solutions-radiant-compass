from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/api/v1/journey", tags=["journey"])

class Tool(BaseModel):
    name: str
    component: str
    triggers: List[str]
    metadata: Dict[str, Any]

class JourneyStageManifest(BaseModel):
    stage_name: str
    tools: List[Tool]
    chat_prompt: str

# This registry is now more detailed, including conversational triggers for each tool.
# This information is derived from the COMPREHENSIVE_FEATURE_REQUIREMENTS.md document.
journey_manifest_registry = {
    "awareness": {
        "tools": [
            {
                "name": "Symptom Tracker", 
                "component": "SymptomTracker", 
                "triggers": ["symptom", "feel", "pain", "not right", "weird", "track"],
                "metadata": {}
            },
            {
                "name": "Condition Explainer", 
                "component": "ConditionExplainer", 
                "triggers": ["condition", "diagnosis", "what is", "learn about", "understand"],
                "metadata": {}
            },
        ],
        "chat_prompt": "I am in the awareness stage. I have some symptoms and I'm not sure what they mean. Help me track my symptoms and understand potential conditions."
    },
    "diagnosis": {
        "tools": [
            {
                "name": "Pathology Report Translator", 
                "component": "PathologyTranslator", 
                "triggers": ["pathology", "report", "test results", "translate", "decode"],
                "metadata": {}
            },
            {
                "name": "Second Opinion Guide", 
                "component": "SecondOpinionGuide", 
                "triggers": ["second opinion", "another doctor", "confirm", "different perspective"],
                "metadata": {}
            },
        ],
        "chat_prompt": "I have just received a diagnosis and I'm trying to understand what it means for me. Help me translate my pathology report and guide me on getting a second opinion."
    }
    # ... other stages would be defined here, following the same structure.
}


@router.get("/{stage_name}", response_model=JourneyStageManifest)
async def get_journey_stage_manifest(stage_name: str) -> JourneyStageManifest:
    manifest = journey_manifest_registry.get(stage_name)
    
    if not manifest:
        raise HTTPException(status_code=404, detail=f"Journey stage manifest for '{stage_name}' not found.")
        
    return JourneyStageManifest(
        stage_name=stage_name,
        tools=manifest["tools"],
        chat_prompt=manifest["chat_prompt"]
    )
