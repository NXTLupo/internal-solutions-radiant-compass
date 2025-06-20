import express from 'express';
import cors from 'cors';
import { CopilotRuntime, LangGraphAgent } from '@copilotkit/runtime';
import { researchAgent } from './agent';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.COAGENT_RUNTIME_PORT || 4000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
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
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'coagent-runtime'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CopilotKit CoAgent Runtime',
    version: '1.0.0',
    endpoints: {
      copilotkit: '/copilotkit',
      health: '/health'
    }
  });
});

app.listen(port, () => {
  console.log(`> CoAgent runtime server running on port ${port}`);
  console.log(`=á CopilotKit endpoint available at: http://localhost:${port}/copilotkit`);
  console.log(`=š Health check: http://localhost:${port}/health`);
});