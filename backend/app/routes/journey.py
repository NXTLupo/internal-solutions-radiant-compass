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
        "stage_name": "Stage 1: First Hints & Initial Doctor Visit",
        "tools": [
            {"name": "Symptom Tracking Tool", "component": "SymptomTracker", "triggers": ["symptom", "feel", "pain", "track", "log"], "metadata": {}},
            {"name": "Appointment Preparation Guide", "component": "AppointmentPrepGuide", "triggers": ["appointment", "prepare", "doctor", "visit"], "metadata": {}},
            {"name": "AI Symptom Sage", "component": "SymptomSage", "triggers": ["interpret", "understand my symptoms", "what could this be"], "metadata": {}},
        ],
        "chat_prompt": "I'm experiencing some symptoms and I'm not sure what to do. Help me track them and prepare for my doctor's visit."
    },
    "diagnosis": {
        "stage_name": "Stage 2: Specialist Work-up & Diagnosis",
        "tools": [
            {"name": "AI Translation Engine", "component": "PathologyTranslator", "triggers": ["pathology", "report", "test results", "translate", "decode", "understand my results"], "metadata": {}},
            {"name": "Guided Question Generator", "component": "QuestionGenerator", "triggers": ["questions", "ask my doctor", "what to ask"], "metadata": {}},
            {"name": "Peer Connection Platform", "component": "PeerConnector", "triggers": ["connect", "find others", "talk to someone", "peer support"], "metadata": {}},
        ],
        "chat_prompt": "I've just received a diagnosis and I'm overwhelmed. Help me understand the medical jargon and connect with others who have been through this."
    },
    "research_compare": {
        "stage_name": "Stage 3: Research & 'Compare-Care' Phase",
        "tools": [
            {"name": "Compare-My-Care™ Tool", "component": "CompareMyCare", "triggers": ["compare", "hospitals", "treatment centers", "rank", "find the best"], "metadata": {}},
            {"name": "Insurance Coverage Analyzer", "component": "InsuranceAnalyzer", "triggers": ["insurance", "coverage", "network", "cost"], "metadata": {}},
            {"name": "Centralized Medical Record Hub", "component": "MedicalRecordHub", "triggers": ["records", "medical history", "gather my files"], "metadata": {}},
        ],
        "chat_prompt": "I need to decide where to get treatment. Help me compare hospitals and understand my insurance coverage."
    },
    "staging_testing": {
        "stage_name": "Stage 4: Full Staging & Baseline Testing",
        "tools": [
            {"name": "Insurance Navigation Assistant", "component": "InsuranceNavigator", "triggers": ["insurance", "denial", "approval", "scan"], "metadata": {}},
            {"name": "Staging Translation Tool", "component": "StagingTranslator", "triggers": ["staging", "what does my stage mean", "translate stage"], "metadata": {}},
            {"name": "Digital Results Repository", "component": "ResultsRepository", "triggers": ["results", "test results", "view my scans"], "metadata": {}},
        ],
        "chat_prompt": "I'm going through a lot of tests to determine my cancer stage. Help me navigate insurance approvals and understand the results."
    },
    "treatment_planning": {
        "stage_name": "Stage 5: Multidisciplinary Treatment Planning",
        "tools": [
            {"name": "Virtual Tumor Board Interface", "component": "VirtualTumorBoard", "triggers": ["tumor board", "treatment plan", "my plan"], "metadata": {}},
            {"name": "Clinical Trial Matching Service", "component": "ClinicalTrialMatcher", "triggers": ["clinical trial", "trial eligibility", "research study"], "metadata": {}},
            {"name": "Decision Support Framework", "component": "DecisionSupport", "triggers": ["decision", "choose a treatment", "pros and cons"], "metadata": {}},
        ],
        "chat_prompt": "My doctors are creating a treatment plan. Help me understand it, explore clinical trials, and make the best decision for me."
    },
    "insurance_travel": {
        "stage_name": "Stage 6: Insurance Confirmation & Travel Setup",
        "tools": [
            {"name": "Insurance Appeals Assistant", "component": "InsuranceAppeals", "triggers": ["appeal", "denied", "insurance appeal"], "metadata": {}},
            {"name": "Cost Estimation Calculator", "component": "CostEstimator", "triggers": ["cost", "how much", "financial", "estimate"], "metadata": {}},
            {"name": "Accommodation Concierge", "component": "AccommodationConcierge", "triggers": ["travel", "hotel", "where to stay", "accommodation"], "metadata": {}},
        ],
        "chat_prompt": "I'm preparing for treatment, but I'm facing insurance and travel hurdles. Help me with appeals, cost estimates, and finding a place to stay."
    },
    "neoadjuvant_therapy": {
        "stage_name": "Stage 7: Up-front (Neoadjuvant) Therapy",
        "tools": [
            {"name": "Side Effect Tracking App", "component": "SideEffectTracker", "triggers": ["side effect", "symptom", "how I feel", "track side effects"], "metadata": {}},
            {"name": "Symptom Severity Assessment", "component": "SymptomAssessor", "triggers": ["how bad is this", "should I call the doctor", "assess symptom"], "metadata": {}},
            {"name": "Medication Management System", "component": "MedicationManager", "triggers": ["medication", "pills", "manage my meds"], "metadata": {}},
        ],
        "chat_prompt": "I'm undergoing treatment and dealing with side effects. Help me track them and manage my medications."
    },
    "definitive_treatment": {
        "stage_name": "Stage 8: Definitive Surgery or Local Treatment",
        "tools": [
            {"name": "Pre-surgical Preparation Suite", "component": "SurgicalPrep", "triggers": ["surgery", "prepare for surgery", "operation"], "metadata": {}},
            {"name": "Recovery Milestone Tracker", "component": "RecoveryTracker", "triggers": ["recovery", "after surgery", "milestones"], "metadata": {}},
            {"name": "Discharge Planning Assistant", "component": "DischargePlanner", "triggers": ["discharge", "going home", "leaving the hospital"], "metadata": {}},
        ],
        "chat_prompt": "I'm preparing for surgery. Help me get ready, track my recovery, and plan for my discharge."
    },
    "adjuvant_therapy": {
        "stage_name": "Stage 9: Adjuvant or Maintenance Therapy",
        "tools": [
            {"name": "Integrated Recovery Planner", "component": "RecoveryPlanner", "triggers": ["recovery plan", "balance treatment", "plan my recovery"], "metadata": {}},
            {"name": "Survivorship Transition Planning", "component": "SurvivorshipPlanner", "triggers": ["survivorship", "life after treatment", "what's next"], "metadata": {}},
            {"name": "Financial Assistance Navigator", "component": "FinancialNavigator", "triggers": ["financial assistance", "help with costs", "afford"], "metadata": {}},
        ],
        "chat_prompt": "I'm in the next phase of my treatment. Help me plan my recovery and prepare for life after cancer."
    },
    "early_recovery": {
        "stage_name": "Stage 10: Early Recovery (First Three Months)",
        "tools": [
            {"name": "Scan Anxiety Management Tools", "component": "ScanxietyManager", "triggers": ["scanxiety", "anxious about scan", "scan coming up"], "metadata": {}},
            {"name": "Personalized Rehabilitation Program", "component": "RehabProgram", "triggers": ["rehab", "physical therapy", "get stronger"], "metadata": {}},
            {"name": "Return-to-Work Planning", "component": "ReturnToWorkPlanner", "triggers": ["return to work", "back to work", "job"], "metadata": {}},
        ],
        "chat_prompt": "I'm in the early stages of recovery. Help me manage scan anxiety and plan my return to daily life."
    },
    "surveillance": {
        "stage_name": "Stage 11: Surveillance & Rehabilitation (Years 1-5)",
        "tools": [
            {"name": "Surveillance Schedule Manager", "component": "SurveillanceScheduler", "triggers": ["surveillance", "monitoring", "schedule my scans"], "metadata": {}},
            {"name": "Symptom Assessment Tool", "component": "SymptomAssessor", "triggers": ["is this normal", "new symptom", "recurrence"], "metadata": {}},
            {"name": "Survivorship Care Plan Creator", "component": "SurvivorshipCarePlanner", "triggers": ["care plan", "long term plan", "survivorship plan"], "metadata": {}},
        ],
        "chat_prompt": "I'm in long-term surveillance. Help me manage my follow-up schedule and assess any new symptoms."
    },
    "long_term_living": {
        "stage_name": "Stage 12: Long-term Living",
        "tools": [
            {"name": "Survivor Mentorship Program", "component": "SurvivorMentorship", "triggers": ["mentor", "help others", "give back"], "metadata": {}},
            {"name": "Legacy Documentation System", "component": "LegacyDocumentation", "triggers": ["my story", "document my journey", "medical history"], "metadata": {}},
            {"name": "Provider Transition Assistant", "component": "ProviderTransition", "triggers": ["new doctor", "primary care", "transition care"], "metadata": {}},
        ],
        "chat_prompt": "I'm a long-term survivor. Help me find ways to give back and manage my health for the long run."
    }
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
