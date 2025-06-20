from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import JSON
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

# User Model
class UserBase(SQLModel):
    email: str = Field(index=True, unique=True)
    username: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Relationships
    conversations: list["Conversation"] = Relationship(back_populates="user")

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