# AI Assistant Development Template - Implementation Plan

## Overview

This template repository will provide developers with a production-ready foundation for building AI-powered applications using modern best practices. The template integrates FastAPI (backend), React (frontend), CopilotKit CoAgents with LangGraph, and follows all principles outlined in the existing guide documents.

## Architecture & Project Structure

Following the established architecture guidelines, the project will use this structure:

```
ai-assistant-template/
├── docs/
│   ├── mkdocs.yml
│   ├── requirements.txt
│   └── docs/
│       ├── index.md
│       ├── setup.md
│       └── deployment.md
├── backend/
│   ├── alembic.ini
│   ├── migrations/
│   ├── app/
│   │   ├── main.py
│   │   ├── db.py
│   │   ├── models.py
│   │   ├── agents/
│   │   │   ├── __init__.py
│   │   │   └── langgraph_agent.py
│   │   └── copilot/
│   │       ├── __init__.py
│   │       └── runtime.py
│   ├── pyproject.toml
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── lib/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── components.json
├── coagent-runtime/
│   ├── src/
│   │   ├── index.ts
│   │   ├── agent.ts
│   │   └── tools.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   ├── Dockerfile.docs
│   └── Dockerfile.coagent-runtime
├── compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Technology Stack

### Backend (FastAPI)
- **FastAPI 0.115.12** - High-performance async web framework
- **SQLModel ^0.0.24** - Type-safe ORM with Pydantic integration
- **Alembic ^1.15.2** - Database migrations
- **AsyncPG ^0.30.0** - Async PostgreSQL driver
- **Poetry** - Dependency management

### Frontend (React)
- **Vite** - Fast build tool and dev server
- **React 18** with TypeScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library
- **CopilotKit** - AI-powered UI components

### AI/Agent Layer
- **LangGraph (Node.js)** - Agent workflow orchestration
- **CopilotKit CoAgents Runtime** - Human-in-the-loop AI agents (Express server)
- **OpenAI GPT-4** - LLM provider
- **Tavily AI** - Search capabilities for agents

### Infrastructure
- **Docker** - Containerization with multi-stage builds
- **PostgreSQL** - Primary database
- **Poetry/UV** - Python package management
- **Pre-commit hooks** - Code quality enforcement

## Phase 1: Project Scaffolding (CLI Commands)

### 1.1 Repository Initialization
```bash
# Create project directory
mkdir ai-assistant-template
cd ai-assistant-template

# Initialize git repository
git init
```

### 1.2 Backend Setup (FastAPI)
```bash
# Create backend directory and initialize Poetry
mkdir backend
cd backend

# Initialize Poetry project
poetry init --name "ai-assistant-backend" --version "0.1.0" --python "^3.9"

# Add core dependencies
poetry add fastapi==0.115.12
poetry add "uvicorn[standard]"==0.34.2
poetry add pydantic==2.11.3
poetry add pydantic-settings==2.9.1
poetry add httpx==0.28.1
poetry add python-dotenv==1.1.0
poetry add sqlmodel==0.0.24
poetry add alembic==1.15.2
poetry add asyncpg==0.30.0

# Add development dependencies
poetry add --group dev autoflake autopep8 ruff isort pylint pre-commit pytest

# Create app structure
mkdir -p app/agents app/copilot migrations
touch app/__init__.py app/main.py app/db.py app/models.py
touch app/agents/__init__.py app/agents/langgraph_agent.py
touch app/copilot/__init__.py app/copilot/runtime.py

cd ..
```

### 1.3 Frontend Setup (React + Vite + TypeScript)
```bash
# Create React project with Vite
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Initialize shadcn/ui
npx shadcn@latest init

# Add common shadcn components
npx shadcn@latest add button card input textarea badge alert

# Install CopilotKit CoAgents
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/react-textarea
npm install @copilotkit/runtime-client-gql @copilotkit/shared

cd ..
```

### 1.4 CoAgent Runtime Service (Node.js/Express)
```bash
# Create coagent runtime service
mkdir coagent-runtime
cd coagent-runtime

# Initialize Node.js project
npm init -y

# Install CopilotKit runtime dependencies
npm install @copilotkit/runtime
npm install @copilotkit/shared

# Install LangGraph and LangChain dependencies
npm install @langchain/core @langchain/openai @langchain/community
npm install langgraph

# Install Express and utilities
npm install express cors dotenv
npm install --save-dev @types/node @types/express typescript tsx nodemon

# Install search capabilities
npm install tavily

# Initialize TypeScript
npx tsc --init

# Create app structure
mkdir src
touch src/index.ts src/agent.ts src/tools.ts

cd ..
```

### 1.5 Docker Configuration
```bash
# Create docker directory
mkdir docker

# Create Docker Compose file
touch compose.yml

# Create Dockerfiles
touch docker/Dockerfile.backend
touch docker/Dockerfile.frontend  
touch docker/Dockerfile.docs
touch docker/Dockerfile.coagent-runtime
```

### 1.6 Documentation Setup
```bash
# Create docs structure
mkdir -p docs/docs
touch docs/mkdocs.yml docs/requirements.txt
touch docs/docs/index.md docs/docs/setup.md docs/docs/deployment.md
```

### 1.7 Configuration Files
```bash
# Create environment and config files
touch .env.example .gitignore
touch README.md
```

## Phase 2: Core Implementation

### 2.1 Backend Implementation
- **Database Models**: User, Conversation, Message, Agent entities with SQLModel
- **Async Database Setup**: AsyncEngine, AsyncSession with proper dependency injection
- **API Routes**: RESTful endpoints for conversations, messages, agents
- **Authentication**: JWT-based auth with FastAPI security utilities
- **Alembic Migrations**: Database schema versioning

### 2.2 CoAgent Runtime Service (Express + CopilotKit)

#### Express Server with CopilotKit Runtime
```typescript
// src/index.ts
import express from 'express';
import cors from 'cors';
import { CopilotRuntime, LangGraphAgent } from '@copilotkit/runtime';
import { researchAgent } from './agent';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize CopilotKit Runtime with LangGraph agent
const copilotKitRuntime = new CopilotRuntime({
  agents: [
    new LangGraphAgent({
      name: "research_agent",
      description: "AI research assistant with web search capabilities",
      agent: researchAgent,
    })
  ]
});

// Add CopilotKit endpoint
app.use('/copilotkit', copilotKitRuntime.handler);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`CoAgent runtime server running on port ${port}`);
  console.log(`CopilotKit endpoint available at: http://localhost:${port}/copilotkit`);
});
```

#### LangGraph Agent Implementation (TypeScript)
```typescript
// src/agent.ts
import { StateGraph, END } from "langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { searchWeb, calculate } from './tools';

interface AgentState {
  messages: (HumanMessage | AIMessage)[];
  currentStep?: string;
}

// Define agent nodes
async function searchNode(state: AgentState): Promise<AgentState> {
  const lastMessage = state.messages[state.messages.length - 1];
  
  if (lastMessage instanceof HumanMessage) {
    const searchResult = await searchWeb(lastMessage.content);
    return {
      ...state,
      messages: [...state.messages, new AIMessage(`Search result: ${searchResult}`)],
      currentStep: "search"
    };
  }
  
  return state;
}

async function analyzeNode(state: AgentState): Promise<AgentState> {
  const llm = new ChatOpenAI({ modelName: "gpt-4", temperature: 0 });
  
  const analysisPrompt = new HumanMessage(
    "Analyze the search results and provide a comprehensive response."
  );
  
  const response = await llm.invoke([...state.messages, analysisPrompt]);
  
  return {
    ...state,
    messages: [...state.messages, response],
    currentStep: "analyze"
  };
}

async function respondNode(state: AgentState): Promise<AgentState> {
  return {
    ...state,
    currentStep: "respond"
  };
}

// Create the agent workflow
export const researchAgent = new StateGraph<AgentState>({
  channels: {
    messages: [],
    currentStep: undefined
  }
})
  .addNode("search", searchNode)
  .addNode("analyze", analyzeNode)  
  .addNode("respond", respondNode)
  .addEdge("search", "analyze")
  .addEdge("analyze", "respond")
  .addEdge("respond", END)
  .setEntryPoint("search")
  .compile();
```

#### Tool Definitions (TypeScript)
```typescript
// src/tools.ts
import { TavilySearchResults } from "tavily";

const tavilyClient = new TavilySearchResults({
  apiKey: process.env.TAVILY_API_KEY,
});

export async function searchWeb(query: string): Promise<string> {
  try {
    const results = await tavilyClient.invoke({
      query,
      maxResults: 5,
    });
    
    return results.map(r => `${r.title}: ${r.content}`).join('\n\n');
  } catch (error) {
    return `Search error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export function calculate(expression: string): string {
  try {
    // In production, use a safer math evaluator like mathjs
    const result = Function(`"use strict"; return (${expression})`)();
    return String(result);
  } catch (error) {
    return `Calculation error: ${error instanceof Error ? error.message : 'Invalid expression'}`;
  }
}
```

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

Key Features:
- **Express Runtime**: CopilotKit runtime server with Express.js
- **LangGraph Integration**: Multi-step reasoning workflows with TypeScript
- **Tool Calling**: Web search via Tavily, calculations, and custom tools
- **Streaming Support**: Real-time agent execution with progress updates
- **Human-in-the-Loop**: Breakpoints for user input and approval
- **TypeScript**: Full type safety across the agent implementation

### 2.3 Frontend Implementation

#### CopilotKit React Integration
```tsx
// src/App.tsx
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

function App() {
  return (
    <CopilotKit runtimeUrl="http://localhost:4000/copilotkit">
      <CopilotSidebar
        labels={{
          title: "AI Research Assistant",
          initial: "Hi! I can help you research any topic using web search and analysis.",
        }}
        defaultOpen={true}
        className="h-screen"
      >
        <main className="p-6 h-full">
          <h1 className="text-2xl font-bold mb-4">AI Assistant Template</h1>
          <p>Your AI assistant is ready in the sidebar!</p>
        </main>
      </CopilotSidebar>
    </CopilotKit>
  );
}

export default App;
```

#### Advanced Agent UI Components
```tsx
// src/components/AgentUI.tsx
import { useCopilotAgent, useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";

export function AgentStatusDisplay() {
  const { agentState } = useCopilotAgent("research_agent");
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <h3 className="font-semibold">Agent Status</h3>
      </CardHeader>
      <CardContent>
        <Badge variant={agentState.status === "running" ? "default" : "secondary"}>
          {agentState.status}
        </Badge>
        {agentState.currentStep && (
          <p className="text-sm text-muted-foreground mt-2">
            Current step: {agentState.currentStep}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Readable State Integration
```tsx
// src/components/StateProvider.tsx
import { useCopilotReadable } from "@copilotkit/react-core";
import { useState, useEffect } from "react";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [appData, setAppData] = useState({
    currentProject: "AI Template",
    userPreferences: { theme: "light", notifications: true },
    recentSearches: []
  });

  // Make app state readable by the agent
  useCopilotReadable({
    description: "Current application state and user context",
    value: appData,
  });

  return <>{children}</>;
}
```

Key Features:
- **CopilotKit Provider**: Connects to self-hosted runtime at `/copilotkit`
- **Agent UI Components**: Real-time agent status and progress display
- **Readable State**: Bi-directional state sharing between app and agent
- **Shadcn/ui Components**: Consistent, accessible UI components
- **TypeScript Integration**: Full type safety across the application
- **Tailwind Styling**: Responsive design with dark/light mode support

### 2.4 Docker Configuration
- **Multi-stage builds** for optimized production images
- **Specific version tags** for reproducible builds
- **Non-root users** for security
- **Health checks** for all services
- **Volume management** for persistent data

## Phase 3: Advanced Features

### 3.1 Agent Capabilities
- **Multi-turn conversations** with memory
- **Tool calling** for external API integration
- **Human-in-the-loop** breakpoints for approval workflows
- **Streaming responses** for real-time interaction
- **Agent templating** for different use cases

### 3.2 Security & Production Readiness
- **Environment variable management** with validation
- **API rate limiting** and security headers  
- **Database connection pooling** and optimization
- **Error handling** and logging
- **Monitoring** and health checks

### 3.3 Development Experience
- **Pre-commit hooks** for code quality
- **Automated testing** setup
- **Hot reloading** for development
- **Clear documentation** and setup guides
- **Environment-specific configurations**

## Phase 4: Documentation & Templates

### 4.1 Developer Documentation
- **Comprehensive README** with quick start guide
- **API Documentation** with FastAPI auto-generated docs
- **Agent Development Guide** for customizing LangGraph agents
- **Deployment Instructions** for various platforms
- **Contributing Guidelines** for template maintenance

### 4.2 Template Customization
- **Configuration templates** for different use cases
- **Example agents** demonstrating various patterns
- **UI component examples** showing CopilotKit integration
- **Testing examples** for backend and frontend
- **CI/CD pipeline templates**

## Key CLI Commands Summary

### Project Creation Sequence
```bash
# 1. Initialize project
mkdir ai-assistant-template && cd ai-assistant-template
git init

# 2. Backend setup  
mkdir backend && cd backend
poetry init && poetry add fastapi uvicorn sqlmodel alembic asyncpg
cd ..

# 3. Frontend setup
npm create vite@latest frontend -- --template react-ts
cd frontend && npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn@latest init
npx shadcn@latest add button card input textarea badge alert
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/react-textarea
npm install @copilotkit/runtime-client-gql @copilotkit/shared
cd ..

# 4. CoAgent runtime with Express + CopilotKit setup
mkdir coagent-runtime && cd coagent-runtime
npm init -y
npm install @copilotkit/runtime @copilotkit/shared
npm install @langchain/core @langchain/openai @langchain/community langgraph
npm install express cors dotenv tavily
npm install --save-dev @types/node @types/express typescript tsx nodemon
npx tsc --init
cd ..

# 5. Docker and config
mkdir docker
touch compose.yml .env.example .gitignore README.md
```

### Development Commands
```bash
# Backend development
cd backend && poetry run fastapi dev app/main.py

# Frontend development  
cd frontend && npm run dev

# CoAgent runtime (CopilotKit endpoint)
cd coagent-runtime && npm run dev

# Full stack with Docker
docker compose up --build
```

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/ai_assistant

# OpenAI
OPENAI_API_KEY=sk-...

# CopilotKit (only needed for hosted version)
# COPILOTKIT_API_KEY=...  # Not needed for self-hosted

# Tavily Search
TAVILY_API_KEY=...

# JWT Secret
JWT_SECRET_KEY=your-secret-key-here

# Environment
ENVIRONMENT=development
DEBUG=true
```

## Success Criteria

1. **Rapid Scaffolding**: Developers can create a fully functional AI assistant app in under 30 minutes
2. **Production Ready**: All code follows established best practices and security guidelines  
3. **Extensible Architecture**: Easy to add new agents, tools, and UI components
4. **Documentation**: Complete setup and customization guides
5. **Modern Stack**: Uses latest stable versions of all frameworks
6. **Developer Experience**: Hot reloading, type safety, and clear error messages
7. **AI Integration**: Seamless CopilotKit and LangGraph integration with examples

## Next Steps

1. **Review this plan** for completeness and accuracy
2. **Begin implementation** starting with Phase 1 scaffolding
3. **Test each component** as it's built
4. **Document decisions** and any deviations from the plan
5. **Create example applications** demonstrating template usage

This implementation plan provides a comprehensive roadmap for creating a production-ready AI assistant development template that incorporates all required technologies and follows established best practices.