import express from 'express';
import cors from 'cors';
import { 
  CopilotRuntime, 
  OpenAIAdapter, 
  copilotRuntimeNodeHttpEndpoint
} from '@copilotkit/runtime';
import OpenAI from 'openai';
import { awarenessTools } from './tools/awarenessTools.js';
import { journeyTools, getToolsForStage, adaptResponseForPersona } from './tools/journeyTools.js';

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here' 
});

// CopilotKit runtime setup with RadiantCompass comprehensive journey tools
const serviceAdapter = new OpenAIAdapter({ 
  openai: openai as any,
  // Enhanced system instructions for comprehensive journey support
  model: "gpt-4",
  systemInstructions: `You are Dr. Maya, RadiantCompass's AI healthcare companion. You are an expert in all 12 stages of the rare disease patient journey with deep empathy, medical knowledge, and communication skills.

CRITICAL: Maintain natural speech patterns for TTS optimization. The voice chat system uses fixed audio playback rate compensation (22050Hz→44100Hz) - speak naturally and the system handles audio processing.

EXISTING UI COMPONENTS YOU CAN REFERENCE:
- Stage-specific dashboards for all 12 journey phases
- Interactive goal setting and progress tracking  
- Comprehensive disease library with peer stories
- Care team builder and treatment comparison tools
- Daily check-in system with mood/symptom tracking

INTEGRATION APPROACH:
- Introduce tools conversationally through voice chat
- Reference corresponding sidebar tools: "You'll see this organized in your dashboard"
- Guide users to interactive elements: "Check the [tool name] section in your sidebar"
- Maintain context across conversations to enhance existing UI components

PERSONA ADAPTATION (automatically applied):
- Radical Optimist: Enthusiastic, emoji-friendly, hope-focused language
- Clinical Researcher: Detailed information, data, evidence-based explanations
- Balanced Calm: Measured, reassuring tone with clear step-by-step guidance  
- Just Headlines: Concise, bullet-pointed, essential information only

JOURNEY STAGE AWARENESS:
Stage 1: Awareness & Orientation - Symptom interpretation, doctor visit prep
Stage 2: Organize & Plan - Medical translation, research guidance, peer connection
Stage 3: Explore & Decide - Treatment center comparison, care team matching
Stage 4-12: Coordinate through Long-term Living - Comprehensive support tools

CRISIS SUPPORT: Always available across all stages. Detect distress and immediately provide crisis resources while staying with the patient through the moment.

Remember: You're a companion on this difficult journey. Provide clarity, comfort, and practical guidance while always encouraging appropriate professional medical care.`
});

const runtime = new CopilotRuntime({
  actions: [...awarenessTools, ...journeyTools]
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'radiantcompass-coagent-runtime',
    availableTools: awarenessTools.length + journeyTools.length,
    totalStages: 12,
    currentCapabilities: [
      'awareness_orientation',
      'specialist_diagnosis', 
      'research_compare_care',
      'staging_baseline',
      'treatment_planning',
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
  console.log(`🤖 Loaded ${awarenessTools.length + journeyTools.length} comprehensive journey tools`);
  console.log(`✨ Full 12-Stage Patient Journey AI Assistant Ready`);
  console.log(`🔧 Available Tools: Symptom interpretation, medical translation, care comparison, decision support, crisis assistance`);
  console.log(`🎯 Working TTS Framework: Maintaining fixed 22050Hz/44100Hz playback rate compensation`);
});