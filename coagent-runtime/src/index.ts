import express from 'express';
import cors from 'cors';
import { 
  CopilotRuntime, 
  AnthropicAdapter, 
  copilotRuntimeNodeHttpEndpoint
} from '@copilotkit/runtime';
import Anthropic from '@anthropic-ai/sdk';
import { toolOrchestrator, toolDemonstrationHandler } from './tools/toolOrchestrator.js';
import { createSymptomTrackerWorkflow } from './workflows/SymptomTracker.js';

// Enhanced action definitions for autonomous symptom tracking
const autonomousSymptomActions: any[] = [
  {
    name: "enableAutonomousSymptomTracking",
    description: "Enable autonomous mode for real-time symptom tracking based on patient conversation.",
    parameters: [],
    handler: async () => {
      console.log('[CoAgent] Autonomous symptom tracking enabled');
      return { success: true };
    }
  },
  {
    name: "updateSymptomData", 
    description: "Update both symptom and severity data simultaneously in real-time.",
    parameters: [
      { name: "symptom", type: "string" as const, description: "The symptom to be logged." },
      { name: "severity", type: "number" as const, description: "The severity of the symptom from 1 to 10." }
    ],
    handler: async ({ symptom, severity }: { symptom: string; severity: number }) => {
      console.log(`[CoAgent] Updating symptom data: ${symptom} at severity ${severity}`);
      return { success: true, symptom, severity };
    }
  },
  {
    name: "submitSymptomLog",
    description: "Submit the symptom log form autonomously.",
    parameters: [],
    handler: async () => {
      console.log('[CoAgent] Submitting symptom log');
      return { success: true };
    }
  }
];

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
  actions: [toolOrchestrator, toolDemonstrationHandler, ...autonomousSymptomActions]
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'radiantcompass-enhanced-coagent-runtime',
    aiModel: 'claude-3-7-sonnet-20250219',
    aiProvider: 'Anthropic Claude 3.7',
    availableActions: 3,
    availableTools: '36+',
    totalStages: 12,
    enhancedCapabilities: [
      'autonomous_tool_demonstrations',
      'comprehensive_journey_support',
      'intelligent_symptom_tracking',
      'real_time_workflow_execution',
      'tool_panel_integration'
    ],
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
    ],
    demonstrationTools: [
      'symptom-tracker',
      'medical-translator', 
      'compare-care',
      'insurance-analyzer',
      'recovery-tracker',
      'survivorship-planner'
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
  console.log(`🌅 RadiantCompass Enhanced CoAgent Runtime listening at http://localhost:${port}`);
  console.log(`📡 CopilotKit endpoint: http://localhost:${port}/copilotkit`);
  console.log(`🧠 Powered by Claude 3.7 Sonnet (claude-3-7-sonnet-20250219)`);
  console.log(`🤖 Loaded 3 core actions: Tool Orchestrator + Tool Demonstrations + Autonomous Symptom Actions`);
  console.log(`✨ Enhanced 12-Stage Patient Journey AI Assistant Ready`);
  console.log(`🛠️  Tool Panel Integration: 36+ tools across all journey stages`);
  console.log(`🎯 Autonomous Demonstrations: Symptom tracker, medical translator, care comparison, insurance analyzer, recovery tracker, survivorship planner`);
  console.log(`🔧 Available Capabilities: Tool demonstrations, symptom interpretation, medical translation, care comparison, decision support, crisis assistance`);
  console.log(`🎵 Working TTS Framework: Maintaining fixed 22050Hz/44100Hz playback rate compensation`);
  console.log(`🚀 Enhanced Experience: Voice chat + Tool panel + Autonomous workflows`);
});