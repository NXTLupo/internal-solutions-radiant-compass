from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.db import get_session, init_db, close_db
from app.models import (
    User, UserCreate, UserRead, UserUpdate,
    Conversation, ConversationCreate, ConversationRead, ConversationUpdate,
    Message, MessageCreate, MessageRead,
    AgentSession, AgentSessionCreate, AgentSessionRead, AgentSessionUpdate
)
from app.routes import awareness

# Create FastAPI app
app = FastAPI(
    title="RadiantCompass Patient Journey API",
    description="Backend API for RadiantCompass Patient Journey Platform with AI-powered guidance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(awareness.router)

@app.on_event("startup")
async def on_startup():
    """Initialize database on startup"""
    await init_db()

@app.on_event("shutdown") 
async def on_shutdown():
    """Close database connections on shutdown"""
    await close_db()

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "radiantcompass-patient-journey-api"}

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "RadiantCompass Patient Journey API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }

# User endpoints
@app.post("/users/", response_model=UserRead)
async def create_user(
    user: UserCreate,
    session: AsyncSession = Depends(get_session)
):
    """Create a new user"""
    # Check if user already exists
    existing_user = await session.exec(
        select(User).where((User.email == user.email) | (User.username == user.username))
    )
    if existing_user.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    
    # Hash password (in production, use proper password hashing)
    hashed_password = f"hashed_{user.password}"  # Replace with proper hashing
    
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        is_active=user.is_active,
        hashed_password=hashed_password
    )
    
    session.add(db_user)
    await session.commit()
    await session.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserRead)
async def get_user(
    user_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get user by ID"""
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@app.get("/users/", response_model=List[UserRead])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    """List users with pagination"""
    result = await session.exec(select(User).offset(skip).limit(limit))
    return result.all()

# Conversation endpoints
@app.post("/conversations/", response_model=ConversationRead)
async def create_conversation(
    conversation: ConversationCreate,
    user_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Create a new conversation"""
    # Verify user exists
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db_conversation = Conversation(
        title=conversation.title,
        status=conversation.status,
        user_id=user_id
    )
    
    session.add(db_conversation)
    await session.commit()
    await session.refresh(db_conversation)
    return db_conversation

@app.get("/conversations/{conversation_id}", response_model=ConversationRead)
async def get_conversation(
    conversation_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get conversation by ID"""
    conversation = await session.get(Conversation, conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    return conversation

@app.get("/users/{user_id}/conversations/", response_model=List[ConversationRead])
async def list_user_conversations(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    """List conversations for a user"""
    result = await session.exec(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .offset(skip)
        .limit(limit)
    )
    return result.all()

# Message endpoints
@app.post("/messages/", response_model=MessageRead)
async def create_message(
    message: MessageCreate,
    session: AsyncSession = Depends(get_session)
):
    """Create a new message"""
    # Verify conversation exists
    conversation = await session.get(Conversation, message.conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    db_message = Message(
        content=message.content,
        role=message.role,
        conversation_id=message.conversation_id,
        message_metadata=message.message_metadata
    )
    
    session.add(db_message)
    await session.commit()
    await session.refresh(db_message)
    return db_message

@app.get("/conversations/{conversation_id}/messages/", response_model=List[MessageRead])
async def list_conversation_messages(
    conversation_id: int,
    skip: int = 0,
    limit: int = 100,
    session: AsyncSession = Depends(get_session)
):
    """List messages for a conversation"""
    result = await session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .offset(skip)
        .limit(limit)
    )
    return result.all()

# Agent session endpoints
@app.post("/agent-sessions/", response_model=AgentSessionRead)
async def create_agent_session(
    agent_session: AgentSessionCreate,
    session: AsyncSession = Depends(get_session)
):
    """Create a new agent session"""
    # Verify conversation exists
    conversation = await session.get(Conversation, agent_session.conversation_id)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    db_agent_session = AgentSession(
        agent_name=agent_session.agent_name,
        status=agent_session.status,
        current_step=agent_session.current_step,
        state_data=agent_session.state_data,
        result_data=agent_session.result_data,
        conversation_id=agent_session.conversation_id
    )
    
    session.add(db_agent_session)
    await session.commit()
    await session.refresh(db_agent_session)
    return db_agent_session

@app.get("/agent-sessions/{session_id}", response_model=AgentSessionRead)
async def get_agent_session(
    session_id: int,
    session: AsyncSession = Depends(get_session)
):
    """Get agent session by ID"""
    agent_session = await session.get(AgentSession, session_id)
    if not agent_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent session not found"
        )
    return agent_session

@app.put("/agent-sessions/{session_id}", response_model=AgentSessionRead)
async def update_agent_session(
    session_id: int,
    update_data: AgentSessionUpdate,
    session: AsyncSession = Depends(get_session)
):
    """Update agent session"""
    agent_session = await session.get(AgentSession, session_id)
    if not agent_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent session not found"
        )
    
    # Update fields
    update_dict = update_data.dict(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(agent_session, field, value)
    
    session.add(agent_session)
    await session.commit()
    await session.refresh(agent_session)
    return agent_session

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )