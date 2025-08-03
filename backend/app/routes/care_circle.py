from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.db import get_session

router = APIRouter()

class CareCircleMember(BaseModel):
    id: str
    name: str
    role: str
    relationship: str
    contactInfo: Dict[str, Any]
    permissions: Dict[str, bool]
    communicationStyle: str
    lastActive: str
    status: str

class Task(BaseModel):
    id: str
    title: str
    description: str
    assignedTo: List[str]
    dueDate: str
    priority: str
    category: str
    status: str
    notes: List[str]

class Update(BaseModel):
    id: str
    author: str
    content: str
    type: str
    timestamp: str
    audienceLevel: str
    reactions: Dict[str, List[str]]

class CareCircleResponse(BaseModel):
    members: List[CareCircleMember]
    tasks: List[Task]
    updates: List[Update]

@router.get("/care-circle/{user_id}", response_model=CareCircleResponse)
async def get_care_circle(user_id: int, session: AsyncSession = Depends(get_session)):
    # In a real application, you would fetch this data from the database
    # based on the user_id.
    mock_members = [
        {
            "id": "1",
            "name": "Andrew Fegley",
            "role": "patient",
            "relationship": "Self",
            "contactInfo": {"phone": "555-0123", "email": "andrew@example.com", "emergencyContact": False},
            "permissions": {"viewMedicalInfo": True, "receiveUpdates": True, "manageAppointments": True, "communicateWithProviders": True},
            "communicationStyle": "clinical_researcher",
            "lastActive": "2 minutes ago",
            "status": "active"
        },
        {
            "id": "2",
            "name": "Sarah Fegley",
            "role": "primary_caregiver",
            "relationship": "Spouse",
            "contactInfo": {"phone": "555-0124", "email": "sarah@example.com", "emergencyContact": True},
            "permissions": {"viewMedicalInfo": True, "receiveUpdates": True, "manageAppointments": True, "communicateWithProviders": True},
            "communicationStyle": "balanced_calm",
            "lastActive": "15 minutes ago",
            "status": "active"
        },
    ]

    mock_tasks = [
        {
            "id": "1",
            "title": "Schedule PET scan follow-up",
            "description": "Need to book follow-up PET scan for 3 months post-treatment",
            "assignedTo": ["1", "2"],
            "dueDate": "2025-02-15",
            "priority": "high",
            "category": "medical",
            "status": "pending",
            "notes": ["Insurance pre-auth needed", "Dr. Chen recommended 3-month interval"]
        },
    ]

    mock_updates = [
        {
            "id": "1",
            "author": "Andrew Fegley",
            "content": "Just finished my consultation with Dr. Chen. PET scan shows continued improvement - SUVmax down from 8.2 to 6.9 in the omental mass. No new lesions detected. Plan is to continue current treatment for 2 more cycles, then reassess. Feeling optimistic!",
            "type": "medical",
            "timestamp": "2 hours ago",
            "audienceLevel": "support_circle",
            "reactions": {"❤️": ["2", "3"], "🙏": ["3"], "💪": ["2"]}
        },
    ]

    return {
        "members": mock_members,
        "tasks": mock_tasks,
        "updates": mock_updates,
    }
