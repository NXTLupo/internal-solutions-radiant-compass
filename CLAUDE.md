# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**RadiantCompass** is a comprehensive AI-powered healthcare platform designed to guide rare disease patients through a transformative 12-stage journey from first symptoms to long-term survivorship. Built using NXT Humans' production template architecture, it addresses the complex needs of 400K+ U.S. patients receiving rare-disease diagnoses annually.

**Technology Stack**: 
- **Backend**: FastAPI 0.115.12 + SQLModel + Alembic + PostgreSQL + AsyncSession
- **Frontend**: React 19 + Vite 6 + TypeScript 5.8 + TailwindCSS 4.1 + CopilotKit 1.9
- **AI Runtime**: Express + CopilotKit CoAgents + OpenAI integration  
- **Infrastructure**: Docker multi-stage builds + Azure Container Apps + GitHub Actions

**Mission**: Transform every rare-disease diagnosis, from the first incomprehensible lab result to lasting remission, into a guided path of clarity, compassion, and choice.

## Essential Documentation References

### Development Guides
All detailed implementation patterns are documented in `@docs/docs/guides/`:

- **@docs/docs/guides/architecture.md** - Project structure and Docker best practices
- **@docs/docs/guides/fastapi.md** - FastAPI + SQLModel + Alembic patterns and async database setup
- **@docs/docs/guides/python.md** - Python code quality, package management, and deployment practices
- **@docs/docs/guides/react.md** - React + TypeScript + Vite frontend patterns (currently empty - needs implementation)
- **@docs/docs/guides/optimized-dockerfiles.md** - Multi-stage Docker builds and production optimization
- **@docs/docs/guides/internal-solutions.md** - Azure Container Apps deployment and CI/CD workflows

### Configuration Files
- **@.env.example** - All required environment variables with examples
- **@compose.yml** - Docker Compose service definitions for all components
- **@Makefile** - Essential commands for service management via docker compose exec

### Cursor AI Rules
Domain-specific rules are organized in `.cursor/rules/` for automatic context loading:
- **@.cursor/rules/nxt-humans-standards.mdc** - Main overview (always applied)
- **@backend/.cursor/rules/fastapi-patterns.mdc** - Backend-specific patterns
- **@frontend/.cursor/rules/react-patterns.mdc** - Frontend-specific patterns
- **@docker/.cursor/rules/docker-patterns.mdc** - Container patterns
- **@.cursor/rules/azure-deployment.mdc** - Azure deployment patterns

## Architecture Overview

```
├── backend/                 # FastAPI + SQLModel + Alembic
│   ├── app/
│   │   ├── main.py         # Minimal FastAPI app with async patterns
│   │   ├── db.py           # AsyncSession and database management
│   │   ├── models.py       # SQLModel table definitions
│   │   ├── agents/         # LangGraph agent implementations
│   │   └── copilot/        # CopilotKit integration
│   └── migrations/         # Alembic database migrations
├── frontend/               # React + TypeScript + Vite + TailwindCSS
│   └── src/
│       ├── components/     # UI components with CopilotKit integration
│       └── App.tsx        # Main app with CopilotSidebar
├── coagent-runtime/        # Express + CopilotKit + LangGraph
│   └── src/
│       ├── index.ts       # Express server with CopilotKit runtime
│       ├── agent.ts       # LangGraph agent workflows
│       └── tools.ts       # Tavily search and other tools
├── docker/                 # Multi-stage Dockerfiles
├── docs/                   # MkDocs Material documentation
└── compose.yml            # Full-stack orchestration
```

## Key Technology Patterns

### Backend (FastAPI)
- **Async-first**: All database operations use `AsyncSession` and `AsyncEngine`
- **Dependency injection**: `Depends(get_session)` pattern for database sessions
- **SQLModel**: Type-safe ORM with Pydantic integration for DTOs
- **Alembic**: Database migrations with `alembic revision --autogenerate`
- **Minimal main.py**: Delegates business logic to separate modules

### Frontend (React)
- **CopilotKit Integration**: AI-powered UI with `CopilotSidebar` and agent status display
- **TypeScript**: Full type safety across components
- **TailwindCSS**: Utility-first styling with responsive design
- **Vite**: Fast build tool with hot reloading

### AI/Agent Layer (CoAgent Runtime)
- **Express Server**: Self-hosted CopilotKit runtime at `/copilotkit` endpoint
- **LangGraph Agents**: Multi-step reasoning workflows with TypeScript
- **Tool Integration**: Tavily search, calculations, and custom tools
- **Human-in-the-loop**: Breakpoints for user input and approval

### Infrastructure
- **Docker**: Multi-stage builds with non-root users for security
- **PostgreSQL**: Primary database with health checks
- **Azure Container Apps**: Production deployment via GitHub Actions

## Essential Commands

### Primary Development Commands
Use the **@Makefile** for all service management:

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

# CoAgent Runtime (Express + CopilotKit)
cd coagent-runtime && npm install && npm run dev  # Runtime server on :4000
```

### Port Configuration
- **Frontend**: http://localhost:9502 (Docker) / :5173 (dev)
- **Backend API**: http://localhost:9500 (Docker) / :8000 (dev) 
- **CoAgent Runtime**: http://localhost:9501 (Docker) / :4000 (dev)
- **PostgreSQL**: localhost:5432
- **Documentation**: http://localhost:9003

## Environment Setup

### Required API Keys
Copy `.env.example` to `.env` and configure:

```bash
# Core AI Services
OPENAI_API_KEY=sk-...                    # OpenAI GPT models for CoAgent runtime
ANTHROPIC_API_KEY=...                    # Claude models (if using)
TAVILY_API_KEY=...                       # Web search capabilities

# Specialized AI Services  
GROQ_API_KEY=...                         # Fast inference
CARTESIA_API_KEY=...                     # Real-time voice synthesis
DEEPGRAM_API_KEY=...                     # Speech-to-text
TOGETHER_API_KEY=...                     # Open-source model hosting
ELEVENLABS_API_KEY=...                   # Advanced TTS
HUGGINGFACE_API_KEY=...                  # ML model access
LUMA_API_KEY=...                         # Video generation

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

## Development Workflow

### Quick Start
```bash
1. cp .env.example .env              # Copy environment template
2. # Edit .env with your API keys    # Configure required services
3. make dev-setup                    # Initialize and start all services
4. make backend-migrate              # Run database migrations
```

### Application Access
- **Frontend**: http://localhost:9502 - Patient dashboard with AI sidebar
- **Backend API**: http://localhost:9500/docs - FastAPI Swagger documentation  
- **CoAgent Runtime**: http://localhost:9501/health - CopilotKit health check
- **Database**: `make db-shell` - Direct PostgreSQL access
- **Documentation**: http://localhost:9003 - MkDocs project documentation

## High-Level Architecture

### RadiantCompass Patient Journey Framework
The platform implements a sophisticated 12-stage patient journey system:

**Stage 1-2**: Awareness & Orientation → Diagnosis  
**Stage 3-4**: Research & Compare-Care → Staging & Baseline Testing  
**Stage 5-6**: Treatment Planning → Pre-treatment Preparation  
**Stage 7-8**: Active Treatment → Treatment Monitoring  
**Stage 9-10**: Early Recovery → Transition Planning  
**Stage 11-12**: Long-term Living → Ongoing Survivorship  

### Core AI Components

**RadiantCompass CoAgent Runtime** (`coagent-runtime/src/index.ts`):
- Express server hosting CopilotKit runtime at `/copilotkit` endpoint
- OpenAI integration for conversational AI capabilities  
- Awareness tools for Stage 1 patient orientation (`awarenessTools.ts`)
- Designed for progressive enhancement with LangGraph workflows

**Healthcare-Specific AI Routes** (`backend/app/routes/`):
- `awareness.py` - Patient orientation and symptom interpretation
- `ai_chat.py` - Conversational health guidance  
- `ultra_low_latency.py` - Real-time voice interaction for critical moments
- `tts_comparison.py` - Multi-provider text-to-speech for accessibility
- `videosdk.py` - Video consultation integration
- `medical_translation.py` - Clinical terminology simplification

### Database Architecture Highlights

**Comprehensive Patient Models** (`backend/app/models.py:187-413`):
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

### Current Implementation Status
- ✅ **Backend**: FastAPI with comprehensive healthcare data models (20+ SQLModel tables)
- ✅ **Database**: PostgreSQL with Alembic migrations, healthcare-compliant schema
- ✅ **Frontend**: React 19 + Vite 6 + TypeScript + TailwindCSS with CopilotKit integration
- ✅ **AI Runtime**: Express server with OpenAI adapter, awareness-stage tools implemented
- ✅ **Docker**: Multi-stage builds for all services with health checks
- ✅ **Documentation**: MkDocs with comprehensive development guides
- 🚧 **Patient Journey**: Stage 1 (Awareness) tools implemented, 11 stages planned
- 🚧 **LangGraph Integration**: Basic OpenAI adapter ready for workflow enhancement

## Key Implementation Details

### Database Models Pattern
The backend implements comprehensive models for AI conversation management:
```python
# Key models: User, Conversation, Message, AgentSession
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    full_name: Optional[str] = None
    is_active: bool = True
    hashed_password: str

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    status: str = "active"
    user_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AgentSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    agent_name: str
    status: str = "idle"  # idle, running, completed, error
    current_step: Optional[str] = None
    state_data: Optional[Dict] = Field(default=None, sa_column=Column(JSON))
    result_data: Optional[Dict] = Field(default=None, sa_column=Column(JSON))
```

### CoAgent Runtime Implementation
Currently implements a minimal OpenAI adapter setup:
```typescript
// src/index.ts - Basic OpenAI integration
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const serviceAdapter = new OpenAIAdapter({ openai: openai as any });
const runtime = new CopilotRuntime();

app.use('/copilotkit', (req, res, next) => {
  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: '/copilotkit',
    runtime,
    serviceAdapter,
  });
  return handler({ request: req } as any, res, next);
});
```

**Note**: LangGraph agent implementation is planned but not yet implemented. Current setup provides basic ChatGPT integration through CopilotKit.

### React Frontend Architecture
Built with React 19, TypeScript, and CopilotKit integration:
```tsx
// App.tsx - Main application with AI sidebar
function App() {
  const runtimeUrl = import.meta.env.VITE_COPILOT_RUNTIME_URL || "http://localhost:4000/copilotkit";

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <AppStateProvider>
        <CopilotSidebar
          labels={{
            title: "AI Research Assistant",
            initial: "Hi! I can help you research any topic...",
          }}
          defaultOpen={true}
          className="h-screen"
        >
          <main className="flex-1 p-6 h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Main application content */}
          </main>
        </CopilotSidebar>
      </AppStateProvider>
    </CopilotKit>
  );
}
```

**Key Features**: AgentStatusDisplay component, AppStateProvider for shared state, responsive design with TailwindCSS.

## Deployment

- **Azure Container Apps**: Production deployment via GitHub Actions
- **Consistent naming**: Image names must match between `docker-compose.yml` and `containerapp.yaml`
- **Environment variables**: All secrets managed via GitHub organization secrets
- **Multi-container**: Backend, frontend, coagent-runtime, and docs services

## Important Development Notes

### Package Management
- **Backend**: Uses `pyproject.toml` instead of Poetry lock file (mixed Poetry/pip approach)
- **Frontend**: React 19 with Vite 6 and modern TypeScript config
- **CoAgent Runtime**: Basic Node.js setup with CopilotKit runtime

### Testing Setup
- **Backend**: pytest available via dev dependencies
- **Frontend**: No testing framework configured yet
- **Integration**: Manual testing via health check endpoints

## Critical Files & Development Patterns

### Essential Files to Understand
- **`backend/app/main.py:1-308`** - Complete FastAPI app with healthcare CRUD endpoints
- **`backend/app/models.py:187-413`** - Comprehensive patient journey data models (20+ tables)
- **`frontend/src/App.tsx`** - React 19 app with CopilotSidebar for patient interaction
- **`coagent-runtime/src/index.ts`** - Express server with OpenAI adapter and awareness tools
- **`compose.yml`** - Multi-service Docker orchestration with health checks
- **`Makefile`** - Essential development commands for all services
- **`COMPREHENSIVE_FEATURE_REQUIREMENTS.md`** - Complete feature specification (12-stage journey)

### RadiantCompass Healthcare Context
The `radiant requirements/` folder contains comprehensive project documentation:
- **Patient Journey Maps**: 12-stage HTML/PDF visualization of patient experience
- **Feature Requirements**: Detailed pain points and AI solutions for each journey stage
- **Market Analysis**: $12B rare-disease market targeting 400K+ annual patients
- **Clinical Workflows**: Integration patterns for healthcare provider systems

### Development Patterns to Follow

**Healthcare Data Security**:
- All PHI data must use `PHI_ENCRYPTION_KEY` encryption
- Audit logging required for patient interactions (`AgentSession` tracking)
- Role-based access control via `UserRole` enum (patient, caregiver, medical_professional)

**AI-First Architecture**:
- CoAgent runtime provides conversational interface for all patient interactions
- Backend routes serve as specialized AI endpoints (not traditional REST APIs)
- Frontend integrates CopilotSidebar as primary interaction method

**Progressive Journey Enhancement**:
- Current: Stage 1 (Awareness) tools implemented
- Next: Expand `awarenessTools.ts` and implement Stage 2-12 workflows
- Each stage requires specific AI tools, database tracking, and patient guidance

## Code Quality & Compliance

### Code Standards
- **Python**: autoflake, autopep8, ruff, isort, pylint with 88-char line length (`make backend-format`)
- **TypeScript**: ESLint with React 19 + TypeScript 5.8 rules (`npm run lint`)
- **Security**: Non-root containers, environment-based secrets, CORS configured for healthcare
- **Database**: Async SQLModel with comprehensive foreign key relationships and healthcare audit trails

### Healthcare Compliance Standards
- **HIPAA Compliance**: PHI encryption, audit logging, access controls implemented
- **Clinical Accuracy**: All medical terminology and patient guidance requires clinical review
- **Accessibility**: Multi-modal interfaces (text, voice, video) for diverse patient needs
- **International**: Designed for global rare-disease patient populations

### Testing Strategy
- **Backend**: pytest with healthcare scenario coverage (`make backend-test`)
- **Frontend**: Manual testing via CopilotSidebar integration (testing framework planned)
- **AI Agents**: Conversation flow testing via CoAgent runtime health checks
- **Compliance**: Audit log verification and PHI encryption validation

## Summary

RadiantCompass represents a transformative approach to healthcare AI, providing comprehensive patient journey guidance through sophisticated 12-stage workflows. The platform combines modern web technologies with specialized healthcare AI capabilities, targeting the critical needs of rare-disease patients and their care teams.

**Key Differentiators**:
- Comprehensive 12-stage patient journey framework
- Healthcare-compliant architecture with PHI encryption
- Multi-modal AI interfaces (conversational, voice, video)
- Extensive patient data modeling (20+ specialized healthcare tables)
- Real-time AI guidance tailored to patient journey stage
- Integration-ready for healthcare provider systems

This implementation provides a solid technical foundation for RadiantCompass patient journey mapping with modern AI integration capabilities, positioned to serve the $12B rare-disease market.