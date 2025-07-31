import express from 'express';
import cors from 'cors';
import { 
  CopilotRuntime, 
  OpenAIAdapter, 
  copilotRuntimeNodeHttpEndpoint 
} from '@copilotkit/runtime';
import OpenAI from 'openai';
import { awarenessTools } from './tools/awarenessTools';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here' 
});

// CopilotKit runtime setup with RadiantCompass tools
const serviceAdapter = new OpenAIAdapter({ openai: openai as any });
const runtime = new CopilotRuntime({
  actions: awarenessTools
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'radiantcompass-coagent-runtime',
    availableTools: awarenessTools.length,
    stage: 'awareness-orientation'
  });
});

// CopilotKit endpoint
app.use('/copilotkit', (req, res, next) => {
  const handler = copilotRuntimeNodeHttpEndpoint({
    endpoint: '/copilotkit',
    runtime,
    serviceAdapter,
  });
  return handler({ request: req } as any, res, next);
});

app.listen(port, () => {
  console.log(`🌅 RadiantCompass CoAgent Runtime listening at http://localhost:${port}`);
  console.log(`📡 CopilotKit endpoint: http://localhost:${port}/copilotkit`);
  console.log(`🤖 Loaded ${awarenessTools.length} awareness & orientation tools`);
  console.log(`✨ Stage 1: Awareness & Orientation AI Assistant Ready`);
});