# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Name**: Radiant Compass - AI-Powered Patient Journey Mapping
**Stack**: FastAPI (backend) + React (frontend) + CopilotKit CoAgents (AI runtime) + PostgreSQL + Docker
**Purpose**: AI assistant for healthcare patient journey mapping and analysis, built using NXT Humans' production template

This repository implements an AI-powered solution for RadiantCompass patient journey mapping, leveraging the NXT Humans internal solutions template architecture.

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

Use the **@Makefile** for all service management:

```bash
# Development
make up                    # Start all services
make dev-setup            # Initialize development environment
make logs                 # View all service logs
make health               # Check service status

# Backend
make backend-shell        # Open bash shell in backend container
make backend-migrate      # Run Alembic migrations
make backend-test         # Run pytest (creates temp container with dev deps)
make backend-lint         # Run ruff and pylint

# Database
make db-shell            # Open psql shell
make db-backup FILE="backup.sql"    # Create database backup
make db-restore FILE="backup.sql"   # Restore from backup

# Service management
make coagent-shell       # Access Node.js runtime container
make frontend-logs       # View nginx logs
make docs-restart        # Restart documentation service
```

## Environment Setup

1. **Copy environment template**: `cp .env.example .env`
2. **Required API keys**:
   - `OPENAI_API_KEY` - For LLM capabilities
   - `TAVILY_API_KEY` - For web search tools
   - `JWT_SECRET_KEY` - For authentication
3. **Database**: PostgreSQL connection via `DATABASE_URL`
4. **Frontend**: `VITE_COPILOT_RUNTIME_URL` points to CoAgent runtime

## Development Workflow

1. **Environment setup**: `cp .env.example .env` and configure API keys
2. **Start services**: `make up` or `docker compose up -d`  
3. **Run migrations**: `make backend-migrate`
4. **Access applications**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs
   - CoAgent Runtime: http://localhost:4000/health
   - Documentation: http://localhost:8090

### Current Implementation Status
- ✅ **Backend**: FastAPI with SQLModel, complete CRUD operations for Users, Conversations, Messages, and AgentSessions
- ✅ **Database**: PostgreSQL with Alembic migrations configured
- ✅ **Frontend**: React 19 + Vite 6 + TypeScript + TailwindCSS with CopilotKit integration
- ✅ **CoAgent Runtime**: Express server with OpenAI adapter for CopilotKit
- ✅ **Docker**: Multi-stage builds for all services with health checks
- ✅ **Documentation**: MkDocs with comprehensive guides

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

### Key Files to Understand
- `backend/app/main.py`: Complete FastAPI application with all CRUD endpoints (lines 70-291)
- `frontend/src/App.tsx`: React application with CopilotKit sidebar integration
- `coagent-runtime/src/index.ts`: Express server with OpenAI adapter
- `compose.yml`: Multi-service Docker configuration with health checks
- `Makefile`: Comprehensive development commands for all services

### RadiantCompass Context
The `radiant requirements/` folder contains project-specific documentation:
- Patient journey mapping HTML/PDF files
- Requirements documentation for healthcare AI assistant
- Suggests focus on patient experience analysis and journey visualization

## Code Quality Standards

- **Python**: autoflake, autopep8, ruff, isort, pylint with 88-char line length (configured in pyproject.toml)
- **Frontend**: ESLint with React 19 + TypeScript rules
- **Security**: Non-root containers, environment-based secrets, CORS configured
- **Database**: Async SQLModel with proper foreign key relationships

This implementation provides a solid foundation for RadiantCompass patient journey mapping with modern AI integration capabilities.