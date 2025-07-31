from typing import Optional, List
from datetime import datetime, date
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import JSON, Text
from enum import Enum

class ConversationStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class AgentStatus(str, Enum):
    IDLE = "idle"
    RUNNING = "running"
    COMPLETED = "completed"
    ERROR = "error"

# RadiantCompass Patient Journey Enums
class UserRole(str, Enum):
    PATIENT = "patient"
    CAREGIVER = "caregiver"
    FAMILY_MEMBER = "family_member"
    MEDICAL_PROFESSIONAL = "medical_professional"
    SUPPORT_STAFF = "support_staff"

class JourneyStage(str, Enum):
    AWARENESS_ORIENTATION = "awareness_orientation"
    ORGANIZE_PLAN = "organize_plan"
    EXPLORE_DECIDE = "explore_decide"
    COORDINATE_COMMIT = "coordinate_commit"
    UNDERGO_TREATMENT = "undergo_treatment"
    EARLY_RECOVERY = "early_recovery"
    LONG_TERM_LIVING = "long_term_living"

class ConditionSeverity(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"

class TreatmentStatus(str, Enum):
    PLANNED = "planned"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    DISCONTINUED = "discontinued"

class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"

class SymptomSeverity(str, Enum):
    NONE = "none"
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    EXTREME = "extreme"

# User Model (Extended for RadiantCompass)
class UserBase(SQLModel):
    email: str = Field(index=True, unique=True)
    username: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    role: UserRole = Field(default=UserRole.PATIENT)
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    conversations: list["Conversation"] = Relationship(back_populates="user")
    patient_profile: Optional["PatientProfile"] = Relationship(back_populates="user")
    care_team_memberships: list["CareTeamMember"] = Relationship(back_populates="user")

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class UserUpdate(SQLModel):
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

# Conversation Model
class ConversationBase(SQLModel):
    title: str
    status: ConversationStatus = Field(default=ConversationStatus.ACTIVE)

class Conversation(ConversationBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    user: User = Relationship(back_populates="conversations")
    messages: list["Message"] = Relationship(back_populates="conversation")

class ConversationCreate(ConversationBase):
    pass

class ConversationRead(ConversationBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

class ConversationUpdate(SQLModel):
    title: Optional[str] = None
    status: Optional[ConversationStatus] = None

# Message Model
class MessageBase(SQLModel):
    content: str
    role: MessageRole
    message_metadata: Optional[dict] = Field(default=None, sa_column=Column(JSON))

class Message(MessageBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    conversation: Conversation = Relationship(back_populates="messages")

class MessageCreate(MessageBase):
    conversation_id: int

class MessageRead(MessageBase):
    id: int
    conversation_id: int
    created_at: datetime

# Agent Session Model
class AgentSessionBase(SQLModel):
    agent_name: str
    status: AgentStatus = Field(default=AgentStatus.IDLE)
    current_step: Optional[str] = None
    state_data: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    result_data: Optional[dict] = Field(default=None, sa_column=Column(JSON))

class AgentSession(AgentSessionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class AgentSessionCreate(AgentSessionBase):
    conversation_id: int

class AgentSessionRead(AgentSessionBase):
    id: int
    conversation_id: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

class AgentSessionUpdate(SQLModel):
    status: Optional[AgentStatus] = None
    current_step: Optional[str] = None
    state_data: Optional[dict] = None
    result_data: Optional[dict] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

# ============================================================================
# RADIANTCOMPASS PATIENT JOURNEY MODELS
# ============================================================================

# Patient Profile Model
class PatientProfileBase(SQLModel):
    medical_record_number: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None
    primary_language: str = Field(default="English")
    preferred_communication: str = Field(default="email")
    accessibility_needs: Optional[str] = None
    current_journey_stage: JourneyStage = Field(default=JourneyStage.AWARENESS_ORIENTATION)
    
class PatientProfile(PatientProfileBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    user: User = Relationship(back_populates="patient_profile")
    conditions: list["MedicalCondition"] = Relationship(back_populates="patient")
    journey_progress: list["JourneyProgress"] = Relationship(back_populates="patient")
    care_plans: list["CarePlan"] = Relationship(back_populates="patient")

class PatientProfileCreate(PatientProfileBase):
    user_id: int

class PatientProfileRead(PatientProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

# Medical Condition Model
class MedicalConditionBase(SQLModel):
    condition_name: str = Field(index=True)
    icd_10_code: Optional[str] = None
    diagnosis_date: Optional[date] = None
    severity: ConditionSeverity = Field(default=ConditionSeverity.MODERATE)
    is_rare_disease: bool = Field(default=True)
    description: Optional[str] = Field(sa_column=Column(Text))
    prognosis: Optional[str] = Field(sa_column=Column(Text))
    
class MedicalCondition(MedicalConditionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    patient: PatientProfile = Relationship(back_populates="conditions")
    treatments: list["Treatment"] = Relationship(back_populates="condition")

class MedicalConditionCreate(MedicalConditionBase):
    patient_id: int

class MedicalConditionRead(MedicalConditionBase):
    id: int
    patient_id: int
    created_at: datetime

# Care Team Models
class CareTeam(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    team_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    members: list["CareTeamMember"] = Relationship(back_populates="care_team")

class CareTeamMember(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    care_team_id: int = Field(foreign_key="careteam.id")
    user_id: int = Field(foreign_key="user.id")
    role_description: str
    specialization: Optional[str] = None
    contact_info: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    care_team: CareTeam = Relationship(back_populates="members")
    user: User = Relationship(back_populates="care_team_memberships")

# Journey Progress Model
class JourneyProgress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    stage: JourneyStage
    stage_status: str = Field(default="in_progress")  # not_started, in_progress, completed
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    progress_percentage: int = Field(default=0, ge=0, le=100)
    key_milestones: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    notes: Optional[str] = Field(sa_column=Column(Text))
    
    # Relationships
    patient: PatientProfile = Relationship(back_populates="journey_progress")

# Treatment and Medication Models
class Treatment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    condition_id: int = Field(foreign_key="medicalcondition.id")
    treatment_name: str
    treatment_type: str  # medication, surgery, therapy, radiation, etc.
    status: TreatmentStatus = Field(default=TreatmentStatus.PLANNED)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    side_effects: Optional[str] = Field(sa_column=Column(Text))
    notes: Optional[str] = Field(sa_column=Column(Text))
    
    # Relationships
    condition: MedicalCondition = Relationship(back_populates="treatments")

# Symptom Tracking Model
class SymptomEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    symptom_name: str
    severity: SymptomSeverity
    occurrence_date: date
    occurrence_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    triggers: Optional[str] = None
    relief_methods: Optional[str] = None
    notes: Optional[str] = Field(sa_column=Column(Text))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Appointment Model
class Appointment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    provider_name: str
    appointment_type: str
    appointment_date: date
    appointment_time: str
    duration_minutes: int = Field(default=60)
    location: Optional[str] = None
    status: AppointmentStatus = Field(default=AppointmentStatus.SCHEDULED)
    preparation_notes: Optional[str] = Field(sa_column=Column(Text))
    post_visit_notes: Optional[str] = Field(sa_column=Column(Text))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Care Plan Model
class CarePlan(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    plan_name: str
    description: str = Field(sa_column=Column(Text))
    created_by: str  # Healthcare provider name
    start_date: date
    target_end_date: Optional[date] = None
    goals: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    interventions: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    patient: PatientProfile = Relationship(back_populates="care_plans")

# Peer Story Model
class PeerStory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(foreign_key="user.id")
    condition_name: str
    journey_stage: JourneyStage
    title: str
    story_content: str = Field(sa_column=Column(Text))
    is_anonymous: bool = Field(default=False)
    is_approved: bool = Field(default=False)
    helpful_votes: int = Field(default=0)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Resource Library Model
class ResourceLibrary(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str = Field(sa_column=Column(Text))
    content_type: str  # article, video, pdf, checklist, etc.
    content_url: Optional[str] = None
    content_data: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    condition_tags: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    journey_stage_tags: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    is_featured: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Insurance and Logistics Model
class InsuranceInfo(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    provider_name: str
    policy_number: str
    group_number: Optional[str] = None
    coverage_details: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    deductible_amount: Optional[float] = None
    out_of_pocket_max: Optional[float] = None
    coverage_start_date: Optional[date] = None
    coverage_end_date: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Mental Health Check-in Model
class MentalHealthCheckIn(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    check_in_date: date
    mood_rating: int = Field(ge=1, le=10)  # 1-10 scale
    anxiety_level: int = Field(ge=1, le=10)
    energy_level: int = Field(ge=1, le=10)
    pain_level: int = Field(ge=0, le=10)
    sleep_quality: int = Field(ge=1, le=10)
    journal_entry: Optional[str] = Field(sa_column=Column(Text))
    created_at: datetime = Field(default_factory=datetime.utcnow)

# AI-Generated Content Model
class AIGeneratedContent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patientprofile.id")
    content_type: str  # quick_start_guide, journey_map, care_recommendations, etc.
    title: str
    content: str = Field(sa_column=Column(Text))
    personalization_data: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    generated_by_agent: str
    is_reviewed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)