# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RadiantCompass** is a comprehensive AI-powered healthcare platform designed to guide rare disease patients through a transformative 12-stage journey from first symptoms to long-term survivorship. Built using NXT Humans' production template architecture, it addresses the complex needs of 400K+ U.S. patients receiving rare-disease diagnoses annually.

**Technology Stack**: 
- **Backend**: FastAPI 0.115.12 + SQLModel + Alembic + PostgreSQL + AsyncSession
- **Frontend**: React 19 + Vite 6 + TypeScript 5.8 + TailwindCSS 4.1 + CopilotKit 1.9
- **AI Runtime**: Express + CopilotKit CoAgents + Anthropic Claude 3.7 Sonnet integration  
- **Infrastructure**: Docker multi-stage builds + Azure Container Apps + GitHub Actions

**Mission**: Transform every rare-disease diagnosis, from the first incomprehensible lab result to lasting remission, into a guided path of clarity, compassion, and choice.

## Essential Commands

### Primary Development Commands
Use the **Makefile** for all service management:

```bash
# Quick Start
make dev-setup            # Copy .env, build, and start all services
make up                   # Start all services  
make health               # Check all service status
make logs                 # View all service logs (real-time)

# Backend Development
make backend-shell        # Interactive bash shell in backend container
make backend-migrate      # Run Alembic database migrations  
make backend-test         # Run pytest in temporary container with dev deps
make backend-lint         # Run ruff, pylint code quality checks
make backend-format       # Auto-format with autoflake, autopep8, ruff, isort

# Database Operations
make db-shell            # Interactive PostgreSQL psql shell
make db-backup FILE="backup_$(date +%Y%m%d).sql"  # Create timestamped backup
make db-restore FILE="backup.sql"                 # Restore from backup file

# Service Management  
make coagent-shell       # Access Node.js CoAgent runtime container
make frontend-logs       # View nginx frontend service logs
make docs-restart        # Restart MkDocs documentation service
```

### Manual Development Commands
If not using Docker:

```bash
# Backend (FastAPI)
cd backend && poetry install && poetry run alembic upgrade head
poetry run fastapi dev app/main.py  # Development server on :8000

# Frontend (React + Vite)
cd frontend && npm install && npm run dev  # Development server on :5173
npm run lint                                # ESLint with React 19 + TypeScript rules

# CoAgent Runtime (Express + CopilotKit)  
cd coagent-runtime && npm install && npm run dev  # Runtime server on :4000

# Testing & Quality
cd backend && make backend-test             # Run pytest with temporary container
cd backend && make backend-lint             # Run ruff + pylint checks  
cd backend && make backend-format           # Auto-format Python code
```

### Port Configuration
- **Frontend**: http://localhost:9502 (Docker) / :5173 (dev)
- **Backend API**: http://localhost:9500 (Docker) / :8000 (dev) 
- **CoAgent Runtime**: http://localhost:9501 (Docker) / :4000 (dev)
- **PostgreSQL**: localhost:5432
- **Documentation**: http://localhost:9003

## Architecture Overview

### Core Application Structure
```
├── backend/                 # FastAPI + SQLModel + Alembic
│   ├── app/
│   │   ├── main.py         # Minimal FastAPI app with async patterns
│   │   ├── db.py           # AsyncSession and database management
│   │   ├── models.py       # SQLModel table definitions
│   │   └── routes/         # Healthcare-specific API endpoints
├── frontend/               # React + TypeScript + Vite + TailwindCSS
│   └── src/
│       ├── components/     # UI components with CopilotKit integration
│       └── App.tsx        # Main app with CopilotSidebar
├── coagent-runtime/        # Express + CopilotKit + Anthropic Claude
│   └── src/
│       ├── index.ts       # Express server with CopilotKit runtime
│       └── tools/         # Journey-aware AI tools
├── docker/                 # Multi-stage Dockerfiles
├── docs/                   # MkDocs Material documentation
└── compose.yml            # Full-stack orchestration
```

### Healthcare-Specific Architecture

**RadiantCompass Patient Journey Framework**:
The platform implements a sophisticated 12-stage patient journey system:

**Stage 1-2**: Awareness & Orientation → Diagnosis  
**Stage 3-4**: Research & Compare-Care → Staging & Baseline Testing  
**Stage 5-6**: Treatment Planning → Pre-treatment Preparation  
**Stage 7-8**: Active Treatment → Treatment Monitoring  
**Stage 9-10**: Early Recovery → Transition Planning  
**Stage 11-12**: Long-term Living → Ongoing Survivorship  

### Database Architecture

**Comprehensive Patient Models** (`backend/app/models.py`):
- **12-Stage Journey Tracking**: `JourneyProgress`, `JourneyStage` enums
- **Healthcare Entities**: `PatientProfile`, `MedicalCondition`, `Treatment`, `CareTeam`
- **Compliance Features**: `SymptomEntry`, `MentalHealthCheckIn`, `InsuranceInfo`
- **AI Content Management**: `AIGeneratedContent`, `PeerStory`, `ResourceLibrary`

**Key Relationships**:
```python
User (1) → (1) PatientProfile → (M) MedicalCondition → (M) Treatment
PatientProfile → (M) JourneyProgress  # Track 12-stage progression
PatientProfile → (M) CareTeam → (M) CareTeamMember  # Multi-provider coordination
```

### AI Integration Architecture

**RadiantCompass CoAgent Runtime** (`coagent-runtime/src/index.ts`):
- Express server hosting CopilotKit runtime at `/copilotkit` endpoint
- Anthropic Claude 3.7 Sonnet integration for conversational AI capabilities  
- Awareness tools for Stage 1 patient orientation (`awarenessTools.ts`)
- Journey tools for multi-stage patient guidance (`journeyTools.ts`)
- Currently implements minimal tools - designed for progressive enhancement

**Healthcare-Specific AI Routes** (`backend/app/routes/`):
- `awareness.py` - Patient orientation and symptom interpretation
- `ai_chat.py` - Conversational health guidance  
- `ultra_low_latency.py` - Real-time voice interaction for critical moments
- `tts_comparison.py` - Multi-provider text-to-speech for accessibility
- `videosdk.py` - Video consultation integration
- `medical_translation.py` - Clinical terminology simplification

## Environment Setup

### Required API Keys
Copy `.env.example` to `.env` and configure:

```bash
# Core AI Services
ANTHROPIC_API_KEY=sk-ant-...             # Claude 3.7 Sonnet for CoAgent runtime (PRIMARY)
OPENAI_API_KEY=sk-...                    # OpenAI GPT models (backup/optional)
TAVILY_API_KEY=...                       # Web search capabilities

# Specialized AI Services  
GROQ_API_KEY=...                         # Fast inference
CARTESIA_API_KEY=...                     # Real-time voice synthesis
DEEPGRAM_API_KEY=...                     # Speech-to-text
TOGETHER_API_KEY=...                     # Open-source model hosting
ELEVENLABS_API_KEY=...                   # Advanced TTS
HUGGINGFACE_API_KEY=...                  # ML model access

# VideoSDK Integration
VIDEOSDK_API_KEY=...                     # Video calling platform
VIDEOSDK_SECRET=...                      # VideoSDK authentication  
VIDEOSDK_AUTH_TOKEN=...                  # VideoSDK token

# Database & Security
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/ai_assistant
JWT_SECRET_KEY=your-secret-key-here      # Authentication tokens
PHI_ENCRYPTION_KEY=...                   # PHI data encryption (healthcare)

# Frontend
VITE_COPILOT_RUNTIME_URL=http://localhost:9501/copilotkit
```

### Healthcare Compliance
- **PHI Encryption**: `PHI_ENCRYPTION_KEY` required for HIPAA compliance
- **Audit Logging**: All patient interactions are logged for compliance
- **Access Controls**: JWT-based authentication with role-based permissions

## Development Patterns

### Backend Patterns (FastAPI + SQLModel)
- **Async-first**: All database operations use `AsyncSession` and `AsyncEngine`
- **Dependency injection**: `Depends(get_session)` pattern for database sessions
- **Healthcare Models**: Comprehensive patient journey modeling (20+ SQLModel tables)
- **Alembic Migrations**: `alembic revision --autogenerate -m "description"`

### Frontend Patterns (React + CopilotKit)
- **CopilotKit Integration**: AI-powered UI with patient interaction sidebar
- **Journey-Aware Components**: Components adapt to patient's journey stage
- **Healthcare UI**: Apple-inspired design with accessibility considerations
- **Voice Interface**: FloatingActionButton for Dr. Maya voice experience

### AI Runtime Patterns (Express + Anthropic)
- **Claude 3.7 Integration**: Primary AI backend for healthcare conversations
- **Journey Tools**: Stage-specific AI capabilities for patient guidance
- **Healthcare Context**: AI responses tailored to rare-disease patient needs
- **Progressive Enhancement**: Tools expand based on journey stage

## Critical Implementation Notes

### Healthcare Data Security
- All PHI data must use `PHI_ENCRYPTION_KEY` encryption
- Audit logging required for patient interactions (`AgentSession` tracking)
- Role-based access control via `UserRole` enum (patient, caregiver, medical_professional)

### Current Implementation Status
- ✅ **Backend**: FastAPI with comprehensive healthcare data models (20+ SQLModel tables)
- ✅ **Database**: PostgreSQL with Alembic migrations, healthcare-compliant schema
- ✅ **Frontend**: React 19 + CopilotKit integration with patient dashboard
- ✅ **AI Runtime**: Claude 3.7 Sonnet adapter with basic awareness tools
- ✅ **Docker**: Multi-stage builds for all services with health checks
- 🚧 **Patient Journey**: Stage 1 (Awareness) tools implemented, 11 stages planned
- 🚧 **AI Tools**: Basic awareness tools ready for expansion

### Patient Journey Development Pattern
- Current: Stage 1 (Awareness) routes and tools implemented
- Next: Expand awareness tools and implement Stage 2-12 workflows
- Each stage requires specific AI tools, database tracking, and patient guidance
- Reference `COMPREHENSIVE_FEATURE_REQUIREMENTS.md` for complete feature specifications

## Testing and Quality

### Testing Commands
- **Backend**: `make backend-test` - Run pytest with healthcare scenario coverage
- **Frontend**: Manual testing via CopilotSidebar integration (testing framework planned)
- **AI Runtime**: Conversation flow testing via health check endpoints

### Code Quality Standards
- **Python**: autoflake, autopep8, ruff, isort, pylint with 88-char line length
- **TypeScript**: ESLint with React 19 + TypeScript 5.8 rules
- **Healthcare Compliance**: PHI encryption validation and audit log verification

## Documentation and Resources

### Essential Documentation
- **`docs/docs/guides/`**: Detailed implementation patterns for all technologies
- **`COMPREHENSIVE_FEATURE_REQUIREMENTS.md`**: Complete 12-stage feature specification
- **`compose.yml`**: Service orchestration and environment configuration
- **`Makefile`**: Essential development commands

### Healthcare Context
- **Market**: $12B rare-disease market targeting 400K+ annual patients
- **Patient Data**: `EHR/` directory contains 65,000+ synthetic healthcare records for testing
- **Journey Maps**: 12-stage HTML/PDF visualization in `radiant requirements/`
- **Compliance**: HIPAA-compliant architecture with PHI encryption and audit trails

## Key Development Guidelines

### NXT Humans Standards
- Follow patterns documented in production template architecture
- Use Docker for all services with multi-stage builds and health checks
- Implement async-first patterns for all database operations
- Maintain healthcare compliance with PHI encryption and audit logging

### RadiantCompass-Specific Patterns
- **Patient-Centric**: All features designed around 12-stage patient journey
- **AI-First**: CoAgent runtime provides conversational interface for all interactions
- **Compliance-Ready**: Built-in HIPAA compliance with audit logging and encryption
- **Progressive Enhancement**: Start with Stage 1 features, expand systematically

This architecture provides a solid foundation for serving the critical needs of rare-disease patients through transformative AI-powered healthcare guidance.