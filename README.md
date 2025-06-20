# AI Assistant Template

A production-ready template for building AI-powered applications using modern best practices. This template integrates FastAPI (backend), React (frontend), and CopilotKit CoAgents with LangGraph for human-in-the-loop AI agents.

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- Poetry (Python package manager)
- Git

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd ai-assistant-template
cp .env.example .env
# Edit .env with your API keys
```

### 2. Backend Setup

```bash
cd backend
poetry install
poetry run alembic upgrade head
poetry run fastapi dev app/main.py
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. CoAgent Runtime Setup

```bash
cd coagent-runtime
npm install
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- CoAgent Runtime: http://localhost:4000
- API Documentation: http://localhost:8000/docs

## 🏗️ Architecture

```
ai-assistant-template/
├── backend/          # FastAPI + SQLModel + Alembic
├── frontend/         # React + Vite + TypeScript + Tailwind
├── coagent-runtime/  # Express + CopilotKit + LangGraph
├── docker/           # Docker configurations
├── docs/             # MkDocs documentation
└── compose.yml       # Docker Compose
```

## 🧠 Features

- **FastAPI Backend**: Async API with SQLModel and Alembic migrations
- **React Frontend**: Modern UI with TypeScript and Tailwind CSS
- **AI Agents**: LangGraph agents with CopilotKit integration
- **Human-in-the-Loop**: Interactive AI workflows with approval steps
- **Real-time Updates**: Streaming agent execution with progress display
- **Production Ready**: Docker containerization and security best practices

## 📖 Documentation

See the `/docs` directory for comprehensive setup and development guides:

- [Setup Guide](docs/docs/setup.md)
- [Deployment Guide](docs/docs/deployment.md)
- [API Documentation](http://localhost:8000/docs) (when running)

## 🛠️ Development

### Backend Development

```bash
cd backend
poetry run fastapi dev app/main.py
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### CoAgent Runtime Development

```bash
cd coagent-runtime
npm run dev
```

### Full Stack with Docker

```bash
docker compose up --build
```

## 🔑 Environment Variables

Copy `.env.example` to `.env` and configure:

- `OPENAI_API_KEY`: Your OpenAI API key
- `TAVILY_API_KEY`: Tavily search API key  
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET_KEY`: Secret for JWT tokens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>