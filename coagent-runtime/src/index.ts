import express from 'express';
import cors from 'cors';
import { 
  CopilotRuntime, 
  AnthropicAdapter, 
  copilotRuntimeNodeHttpEndpoint
} from '@copilotkit/runtime';
import Anthropic from '@anthropic-ai/sdk';
import { toolOrchestrator } from './tools/toolOrchestrator.js';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Anthropic setup for Claude 3.7
const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY || 'your-anthropic-api-key-here' 
});

// CopilotKit runtime setup with RadiantCompass comprehensive journey tools using Claude 3.7
const serviceAdapter = new AnthropicAdapter({ 
  anthropic: anthropic as any,
  model: "claude-3-7-sonnet-20250219"  // Claude 3.7 Sonnet (actual 3.7)
});

const runtime = new CopilotRuntime({
  actions: [toolOrchestrator]
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'radiantcompass-coagent-runtime',
    aiModel: 'claude-3-7-sonnet-20250219',
    aiProvider: 'Anthropic Claude 3.7',
    availableTools: 1,
    totalStages: 12,
    currentCapabilities: [
      'awareness_orientation',
      'organize_plan', 
      'explore_decide',
      'coordinate_commit',
      'undergo_treatment',
      'early_recovery',
      'surveillance_rehabilitation',
      'long_term_living',
      'emergency_crisis_support'
    ]
  });
});

// CopilotKit endpoint
app.use('/copilotkit', copilotRuntimeNodeHttpEndpoint({
  endpoint: '/copilotkit',
  runtime,
  serviceAdapter,
}));

app.listen(port, () => {
  console.log(`🌅 RadiantCompass CoAgent Runtime listening at http://localhost:${port}`);
  console.log(`📡 CopilotKit endpoint: http://localhost:${port}/copilotkit`);
  console.log(`🧠 Powered by Claude 3.7 Sonnet (claude-3-5-sonnet-20241022)`);
  console.log(`🤖 Loaded 1 tool orchestrator`);
  console.log(`✨ Full 12-Stage Patient Journey AI Assistant Ready`);
  console.log(`🔧 Available Tools: Symptom interpretation, medical translation, care comparison, decision support, crisis assistance`);
  console.log(`🎯 Working TTS Framework: Maintaining fixed 22050Hz/44100Hz playback rate compensation`);
});