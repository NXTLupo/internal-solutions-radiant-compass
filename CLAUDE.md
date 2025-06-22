# Claude Memory - NXT Humans Internal Solutions Template

This repository is a production-ready template for building AI-powered applications using modern best practices. It provides developers with a comprehensive foundation for FastAPI + React + AI agents using CopilotKit CoAgents with LangGraph.

## Quick Context

**Project Type**: Internal Solutions Template for NXT Humans
**Stack**: FastAPI (backend) + React (frontend) + CopilotKit CoAgents (AI runtime) + PostgreSQL + Docker
**Purpose**: Accelerate development of AI-powered internal tools and applications

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

1. **Start services**: `make up` or `docker compose up -d`
2. **Run migrations**: `make backend-migrate`
3. **Access applications**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/docs
   - CoAgent Runtime: http://localhost:4000/health
   - Documentation: http://localhost:8090

## Key Implementation Details

### Database Models Pattern
```python
from typing import Optional
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str

class UserCreate(SQLModel):
    email: str
    name: str
```

### Agent Integration Pattern
```typescript
// CoAgent runtime with LangGraph
const copilotKitRuntime = new CopilotRuntime({
  agents: [
    new LangGraphAgent({
      name: "research_agent",
      description: "AI research assistant with web search",
      agent: researchAgent,
    })
  ]
});
```

### React Integration Pattern
```tsx
<CopilotKit runtimeUrl="http://localhost:4000/copilotkit">
  <CopilotSidebar
    labels={{
      title: "AI Research Assistant",
      initial: "Hi! I can help you research any topic.",
    }}
  >
    <YourMainApp />
  </CopilotSidebar>
</CopilotKit>
```

## Deployment

- **Azure Container Apps**: Production deployment via GitHub Actions
- **Consistent naming**: Image names must match between `docker-compose.yml` and `containerapp.yaml`
- **Environment variables**: All secrets managed via GitHub organization secrets
- **Multi-container**: Backend, frontend, coagent-runtime, and docs services

## Code Quality Standards

- **Python**: autoflake, autopep8, ruff, isort, pylint with 88-char line length
- **TypeScript**: ESLint with React hooks and accessibility rules
- **Security**: Non-root containers, no hardcoded secrets, proper CORS
- **Testing**: pytest for backend, containerized test execution

This template accelerates development of AI-powered internal tools while following NXT Humans' established best practices for security, scalability, and maintainability.