import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ElegantToolPanel } from './ElegantToolPanel';
import { SymptomTracker } from './journeystages/SymptomTracker';
import { ConditionExplainer } from './journeystages/ConditionExplainer';
import { TreatmentCalendar } from './tools/TreatmentCalendar';
import { AppointmentPrepGuide } from './journeystages/AppointmentPrepGuide';
import { SymptomSage } from './journeystages/SymptomSage';
import { SecondOpinionGuide } from './journeystages/SecondOpinionGuide';
import { useCopilotAction } from '@copilotkit/react-core';

interface EnhancedVoiceExperienceProps {
  onNavigateHome?: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'tool-demo';
  content: string;
  timestamp: string;
  latency_ms?: number;
  activatedTool?: string;
  toolData?: any;
  toolDemonstration?: {
    toolId: string;
    toolName: string;
    stage: number;
  };
}

// ENHANCED PREMIUM STYLES WITH TOOL PANEL LAYOUT
const styles = {
  // FULL SCREEN CONTAINER WITH TWO-COLUMN LAYOUT
  fullScreen: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFEFE 100%)',
    display: 'flex',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif',
    zIndex: 9999,
    overflow: 'hidden',
    letterSpacing: '-0.01em'
  },

  // MAIN VOICE CHAT AREA (RIGHT SIDE)
  voiceChatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden'
  },

  // PREMIUM HEALTHCARE HEADER
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(229, 231, 235, 0.6)',
    padding: '24px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
  },

  exitButton: {
    background: 'transparent',
    border: '1px solid rgba(229, 231, 235, 0.6)',
    fontSize: '15px',
    fontWeight: 500,
    color: '#475569',
    cursor: 'pointer',
    padding: '10px 18px',
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '-0.01em'
  },

  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },

  titleText: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0F172A',
    margin: 0,
    letterSpacing: '-0.02em'
  },

  subtitle: {
    fontSize: '15px',
    color: '#64748B',
    margin: 0,
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  latencyBadge: {
    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    color: 'white',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
    letterSpacing: '-0.01em'
  },

  // MAIN CONTENT AREA
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden'
  },

  // DR MAYA PREMIUM AVATAR SECTION  
  avatarSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px 32px 24px 32px',
    flexShrink: 0,
    position: 'relative' as const
  },

  avatar: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
    border: '4px solid rgba(248, 250, 252, 0.8)',
    objectFit: 'cover' as const,
    position: 'relative' as const,
    zIndex: 2
  },

  avatarListening: {
    boxShadow: '0 0 40px rgba(59, 130, 246, 0.4), 0 8px 32px rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.6)',
    transform: 'scale(1.05)'
  },

  avatarThinking: {
    boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 8px 32px rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.6)',
    transform: 'scale(1.02)'
  },

  avatarSpeaking: {
    boxShadow: '0 0 40px rgba(16, 185, 129, 0.4), 0 8px 32px rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.6)',
    transform: 'scale(1.08)'
  },

  avatarDemonstrating: {
    boxShadow: '0 0 40px rgba(245, 158, 11, 0.4), 0 8px 32px rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.6)',
    transform: 'scale(1.06)'
  },

  // PREMIUM CHAT MESSAGES CONTAINER
  chatContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '0 32px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    scrollBehavior: 'smooth' as const
  },

  // PREMIUM MESSAGE BUBBLES
  messageBubble: {
    maxWidth: '80%',
    padding: '18px 24px',
    borderRadius: '24px',
    fontSize: '16px',
    lineHeight: 1.6,
    position: 'relative' as const,
    wordWrap: 'break-word' as const,
    wordBreak: 'break-word' as const,
    letterSpacing: '-0.01em'
  },

  userBubble: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: '#FFFFFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '8px',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25), 0 2px 8px rgba(59, 130, 246, 0.15)'
  },

  assistantBubble: {
    background: 'rgba(248, 250, 252, 0.8)',
    color: '#0F172A',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '8px',
    border: '1px solid rgba(226, 232, 240, 0.6)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02)',
    backdropFilter: 'blur(8px)'
  },

  systemBubble: {
    background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    color: '#FFFFFF',
    alignSelf: 'center',
    textAlign: 'center' as const,
    fontSize: '15px',
    fontWeight: 500,
    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)'
  },

  toolDemoBubble: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    color: '#FFFFFF',
    alignSelf: 'center',
    textAlign: 'center' as const,
    fontSize: '15px',
    fontWeight: 500,
    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.25)'
  },

  messageContent: {
    margin: 0,
    fontSize: '16px',
    lineHeight: 1.6,
    fontWeight: 400,
    letterSpacing: '-0.01em'
  },

  messageFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '12px',
    opacity: 0.6
  },

  timestamp: {
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  latencyTag: {
    fontSize: '11px',
    background: 'rgba(0, 0, 0, 0.08)',
    padding: '4px 8px',
    borderRadius: '8px',
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  // PREMIUM VOICE CONTROLS - ALWAYS VISIBLE
  controlsContainer: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(229, 231, 235, 0.4)',
    padding: '32px 32px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px',
    flexShrink: 0,
    boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.02)'
  },

  voiceButton: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '32px',
    color: 'white',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    position: 'relative' as const
  },

  voiceButtonListening: {
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    transform: 'scale(1.15)',
    boxShadow: '0 0 40px rgba(239, 68, 68, 0.4), 0 8px 32px rgba(239, 68, 68, 0.3)'
  },

  voiceButtonProcessing: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    cursor: 'not-allowed',
    boxShadow: '0 0 32px rgba(245, 158, 11, 0.3), 0 8px 24px rgba(245, 158, 11, 0.2)'
  },

  voiceButtonSpeaking: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    cursor: 'not-allowed',
    transform: 'scale(1.1)',
    boxShadow: '0 0 36px rgba(16, 185, 129, 0.4), 0 8px 28px rgba(16, 185, 129, 0.25)'
  },

  voiceButtonReady: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(59, 130, 246, 0.2)'
  },

  statusText: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0F172A',
    textAlign: 'center' as const,
    margin: 0,
    letterSpacing: '-0.01em'
  },

  techSpecs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap' as const
  },

  techSpec: {
    fontSize: '12px',
    color: '#64748B',
    background: 'rgba(248, 250, 252, 0.8)',
    padding: '6px 12px',
    borderRadius: '12px',
    fontWeight: 500,
    letterSpacing: '-0.01em',
    border: '1px solid rgba(226, 232, 240, 0.6)'
  },

  // CONNECTION SCREEN
  connectionScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 32px'
  },

  connectionContent: {
    textAlign: 'center' as const,
    maxWidth: '480px'
  },

  connectionAvatar: {
    width: '140px',
    height: '140px',
    margin: '0 auto 40px auto',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '56px',
    boxShadow: '0 12px 48px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(59, 130, 246, 0.2)'
  },

  connectionTitle: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '16px',
    letterSpacing: '-0.02em'
  },

  connectionSubtitle: {
    fontSize: '16px',
    color: '#64748B',
    marginBottom: '32px',
    lineHeight: 1.6,
    letterSpacing: '-0.01em'
  },

  errorBox: {
    background: 'rgba(254, 242, 242, 0.8)',
    border: '1px solid rgba(254, 202, 202, 0.6)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '24px',
    backdropFilter: 'blur(8px)'
  },

  errorText: {
    color: '#DC2626',
    fontSize: '14px',
    margin: 0,
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  connectButton: {
    fontSize: '16px',
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(59, 130, 246, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '-0.01em'
  }
};

export function EnhancedVoiceExperience({ onNavigateHome }: EnhancedVoiceExperienceProps = {}) {
  // Core states
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDemonstratingTool, setIsDemonstratingTool] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentLatency, setCurrentLatency] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [drMayaEmotion, setDrMayaEmotion] = useState<'calm' | 'listening' | 'thinking' | 'speaking' | 'demonstrating'>('calm');
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [toolData, setToolData] = useState<any>(null);

  // Audio refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Patient context
  const [patientContext] = useState({
    patientName: "Alex Johnson",
    emotionalState: "hopeful",
    journeyStage: "awareness",
    patient_id: "patient_alex_johnson",
    userRole: "patient"
  });

  // Tool click handler that will be passed to ElegantToolPanel
  const handleToolPanelClick = async (tool: { id: string; name: string; description: string; stage: number }) => {
    console.log(`[EnhancedVoiceExperience] Tool panel click received: ${tool.name}`);
    return await showToolVisually(tool.id, tool.name, tool.description, tool.stage);
  };

  // Enhanced CopilotKit action to handle tool demonstrations with visual display
  const showToolVisually = async (toolId: string, toolName: string, toolDescription: string, stage: number) => {
      console.log(`[EnhancedVoiceExperience] Visually displaying tool: ${toolName}`);
      
      setIsDemonstratingTool(true);
      setDrMayaEmotion('demonstrating');

      // Create Dr. Maya's response with visual tool activation
      const demonstrationResponse = `I'm bringing up the ${toolName} tool right now! You'll see it appear below.

🛠️ **${toolName} - Visual Tool Activated**

${toolDescription}

Let me walk you through this tool step by step. Watch as the interface loads below - I'll guide you through each feature autonomously and show you exactly how it works in your healthcare journey.

**What you're seeing:**
- Interactive tool interface
- Real-time functionality  
- Automated demonstration
- Step-by-step guidance

The tool is now loading below this message!`;

      // Add the assistant message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: demonstrationResponse,
        timestamp: new Date().toLocaleTimeString(),
        activatedTool: getToolComponentName(toolId),
        toolData: {
          demonstrationMode: true,
          toolName: toolName,
          stage: stage,
          autoDemo: true
        }
      };

      setChatMessages(prev => [...prev, assistantMessage]);

      // Set active tool for visual display
      setActiveTool(getToolComponentName(toolId));
      setToolData({
        demonstrationMode: true,
        toolName: toolName,
        stage: stage,
        autoDemo: true,
        ...getToolSpecificData(toolId)
      });

      // Generate speech for the demonstration
      await generateSpeechWithCartesia(
        `Perfect! I'm bringing up the ${toolName} tool right now. You can see it loading in the chat area below. This tool helps ${toolDescription.toLowerCase()}. Let me walk you through its features step by step.`
      );

      setTimeout(() => {
        setIsDemonstratingTool(false);
        setDrMayaEmotion('calm');
      }, 3000);

      return {
        success: true,
        message: `${toolName} tool is now displayed visually`,
        toolActivated: toolId,
        visualDisplay: true
      };
    };

  // CopilotKit action to handle tool demonstrations
  useCopilotAction({
    name: "showToolVisually",
    description: "Display a tool component visually in the chat area and provide autonomous demonstration.",
    parameters: [
      { name: "toolId", type: "string", description: "The unique identifier of the tool" },
      { name: "toolName", type: "string", description: "The name of the tool" },
      { name: "toolDescription", type: "string", description: "Description of the tool" },
      { name: "stage", type: "number", description: "Journey stage number" }
    ],
    handler: async ({ toolId, toolName, toolDescription, stage }) => {
      return await showToolVisually(toolId, toolName, toolDescription, stage);
    }
  });

  // Helper function to map tool IDs to component names
  const getToolComponentName = (toolId: string): string => {
    switch (toolId) {
      // Stage 1 - First Hints & Initial Visit
      case 'symptom-tracker': return 'SymptomTracker';
      case 'appointment-prep': return 'AppointmentPrepGuide';
      case 'ai-symptom-sage': return 'SymptomSage';
      
      // Stage 2 - Specialist Work-up & Diagnosis  
      case 'medical-translator': return 'ConditionExplainer';
      case 'question-generator': return 'AppointmentPrepGuide'; // Similar functionality
      case 'peer-connection': return 'ConditionExplainer'; // Community aspect
      
      // Stage 3 - Research & Compare-Care
      case 'compare-care': return 'SecondOpinionGuide';
      case 'insurance-analyzer': return 'ConditionExplainer'; // Information display
      case 'travel-planner': return 'TreatmentCalendar'; // Planning tool
      
      // Stage 4 - Staging & Testing
      case 'treatment-calendar': return 'TreatmentCalendar';
      case 'test-coordinator': return 'TreatmentCalendar'; // Scheduling related
      case 'results-repository': return 'ConditionExplainer'; // Information display
      
      // Stage 5 - Treatment Planning
      case 'tumor-board': return 'SecondOpinionGuide'; // Expert consultation
      case 'treatment-visualizer': return 'ConditionExplainer'; // Information display
      case 'trial-matcher': return 'SecondOpinionGuide'; // Research matching
      
      // Stage 6 - Insurance & Travel Setup
      case 'appeals-assistant': return 'ConditionExplainer'; // Information display
      case 'cost-calculator': return 'TreatmentCalendar'; // Planning tool
      case 'accommodation-concierge': return 'TreatmentCalendar'; // Planning tool
      
      // Stage 7 - Neoadjuvant Therapy (using treatment-calendar from tools)
      case 'side-effect-tracker': return 'SymptomTracker'; // Similar tracking
      case 'nutrition-support': return 'ConditionExplainer'; // Information display
      
      // Stage 8 - Surgery & Local Treatment
      case 'surgical-prep': return 'AppointmentPrepGuide'; // Preparation
      case 'virtual-tour': return 'ConditionExplainer'; // Information display
      case 'recovery-tracker': return 'SymptomTracker'; // Progress tracking
      
      // Stage 9 - Maintenance Therapy
      case 'recovery-planner': return 'TreatmentCalendar'; // Planning
      case 'complementary-guide': return 'ConditionExplainer'; // Information
      case 'completion-countdown': return 'SymptomTracker'; // Progress tracking
      
      // Stage 10 - Early Recovery
      case 'milestone-tracker': return 'SymptomTracker'; // Progress tracking
      case 'rehab-program': return 'TreatmentCalendar'; // Scheduling
      case 'scan-anxiety': return 'ConditionExplainer'; // Information/support
      
      // Stage 11 - Surveillance & Rehabilitation
      case 'surveillance-manager': return 'TreatmentCalendar'; // Scheduling
      case 'survivorship-planner': return 'TreatmentCalendar'; // Long-term planning
      case 'lifestyle-optimizer': return 'ConditionExplainer'; // Information
      
      // Stage 12 - Long-term Living
      case 'survivorship-care': return 'TreatmentCalendar'; // Long-term care
      case 'mentorship-program': return 'ConditionExplainer'; // Community
      case 'legacy-docs': return 'ConditionExplainer'; // Documentation
      
      default: 
        console.log(`[getToolComponentName] Unknown tool ID: ${toolId}, using ConditionExplainer as fallback`);
        return 'ConditionExplainer'; // Better fallback for information display
    }
  };

  // Helper function to render the appropriate tool component
  const renderToolComponent = (componentName: string, toolData: any, key: string = 'tool-component') => {
    const commonProps = {
      isActive: true,
      autoFillData: toolData,
      onDataUpdate: (data: any) => console.log(`${componentName} data:`, data)
    };

    switch (componentName) {
      case 'SymptomTracker':
        return <SymptomTracker key={key} {...commonProps} />;
      case 'ConditionExplainer':
        return <ConditionExplainer key={key} {...commonProps} />;
      case 'TreatmentCalendar':
        return <TreatmentCalendar key={key} {...commonProps} />;
      case 'AppointmentPrepGuide':
        return <AppointmentPrepGuide key={key} {...commonProps} />;
      case 'SymptomSage':
        return <SymptomSage key={key} {...commonProps} />;
      case 'SecondOpinionGuide':
        return <SecondOpinionGuide key={key} {...commonProps} />;
      default:
        console.log(`[renderToolComponent] Unknown component: ${componentName}, rendering ConditionExplainer`);
        return <ConditionExplainer key={key} {...commonProps} />;
    }
  };

  // Helper function to get tool-specific demonstration data
  const getToolSpecificData = (toolId: string): any => {
    switch (toolId) {
      case 'symptom-tracker':
        return {
          symptom: 'demonstration headache',
          severity: 6,
          notes: 'Demonstrating autonomous symptom tracking'
        };
      case 'medical-translator':
        return {
          conditionName: 'sample medical condition',
          description: 'Demonstrating medical translation capabilities'
        };
      case 'treatment-calendar':
        return {
          appointments: [],
          demonstrationMode: true
        };
      default:
        return {};
    }
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setConnectionError('Speech recognition not supported in this browser');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎤 Speech recognized:', transcript);
      
      setIsListening(false);
      setIsProcessing(true);
      setDrMayaEmotion('thinking');
      
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: transcript,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, userMessage]);

      await processWithGroqAI(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setIsProcessing(false);
      setDrMayaEmotion('calm');
    };

    recognition.onend = () => {
      setIsListening(false);
      setDrMayaEmotion('calm');
    };

    recognitionRef.current = recognition;
    return true;
  }, []);

  // Check TTS service
  const checkTTSService = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/health');
      const result = await response.json();
      return result.cartesia_available || true; // Fallback allowed
    } catch (error) {
      console.error('❌ TTS service check error:', error);
      return false;
    }
  }, []);

  // Enhanced AI processing with autonomous tool usage
  const processWithGroqAI = async (transcript: string) => {
    try {
      const startTime = Date.now();
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript,
          patient_name: patientContext.patientName,
          context: {
            ...patientContext,
            toolPanelActive: true,
            demonstrationMode: isDemonstratingTool,
            availableTools: [
              'symptom-tracker', 'appointment-prep', 'treatment-calendar', 
              'medical-translator', 'question-generator', 'compare-care'
            ]
          }
        })
      });

      const result = await response.json();
      const aiLatency = Date.now() - startTime;
      setCurrentLatency(aiLatency);
      
      // Analyze Dr. Maya's response for tool usage indicators
      const toolToActivate = detectToolUsageFromResponse(result.response, transcript);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date().toLocaleTimeString(),
        latency_ms: aiLatency,
        activatedTool: toolToActivate ? getToolComponentName(toolToActivate.toolId) : undefined,
        toolData: toolToActivate ? getContextualToolData(toolToActivate.toolId, transcript, result.response) : undefined
      };
      setChatMessages(prev => [...prev, assistantMessage]);

      // If a tool should be activated, do it automatically
      if (toolToActivate) {
        console.log(`[AI Auto-Tool] Detected tool usage: ${toolToActivate.toolName}`);
        setTimeout(async () => {
          setIsDemonstratingTool(true);
          setDrMayaEmotion('demonstrating');
          setActiveTool(getToolComponentName(toolToActivate.toolId));
          setToolData(getContextualToolData(toolToActivate.toolId, transcript, result.response));
          
          // Brief pause then return to normal
          setTimeout(() => {
            setIsDemonstratingTool(false);
            setDrMayaEmotion('calm');
          }, 5000);
        }, 1000);
      }

      await generateSpeechWithCartesia(result.response);
      
    } catch (error) {
      console.error('❌ AI error:', error);
      setIsProcessing(false);
      setDrMayaEmotion('calm');
    }
  };

  // Detect tool usage from Dr. Maya's response
  const detectToolUsageFromResponse = (response: string, userInput: string): { toolId: string; toolName: string } | null => {
    const lowerResponse = response.toLowerCase();
    const lowerInput = userInput.toLowerCase();
    
    // Appointment/Calendar related
    if (lowerResponse.includes('check your schedule') || 
        lowerResponse.includes('next appointment') || 
        lowerResponse.includes('calendar') ||
        lowerInput.includes('appointment') ||
        lowerInput.includes('schedule')) {
      return { toolId: 'treatment-calendar', toolName: 'Treatment Calendar' };
    }
    
    // Question preparation
    if (lowerResponse.includes('prepare questions') || 
        lowerResponse.includes('start a note') ||
        lowerResponse.includes('question list') ||
        lowerInput.includes('questions')) {
      return { toolId: 'appointment-prep', toolName: 'Appointment Prep' };
    }
    
    // Food/Symptom tracking
    if (lowerResponse.includes('food diary') || 
        lowerResponse.includes('track your food') ||
        lowerResponse.includes('track symptoms') ||
        lowerInput.includes('what can i eat') ||
        lowerInput.includes('symptoms')) {
      return { toolId: 'symptom-tracker', toolName: 'Symptom Tracker' };
    }
    
    // Medical information/translation
    if (lowerResponse.includes('explain') || 
        lowerResponse.includes('translate') ||
        lowerResponse.includes('medical terms') ||
        lowerInput.includes('what does') ||
        lowerInput.includes('explain this')) {
      return { toolId: 'medical-translator', toolName: 'Medical Translator' };
    }
    
    return null;
  };

  // Get contextual tool data based on conversation
  const getContextualToolData = (toolId: string, userInput: string, aiResponse: string): any => {
    const baseData = {
      demonstrationMode: true,
      conversationContext: {
        userInput,
        aiResponse,
        timestamp: new Date().toISOString()
      }
    };
    
    switch (toolId) {
      case 'treatment-calendar':
        return {
          ...baseData,
          appointments: [
            {
              id: 'next-1',
              date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
              time: '10:00 AM',
              title: 'Follow-up Consultation',
              provider: 'Dr. Sarah Johnson',
              location: 'Medical Center - Room 204',
              type: 'consultation',
              status: 'upcoming',
              notes: 'Come prepared with questions about treatment progress'
            }
          ],
          activeFromConversation: true
        };
        
      case 'appointment-prep':
        return {
          ...baseData,
          primaryConcern: userInput.includes('questions') ? 
            'Questions about upcoming appointment and treatment plan' : 
            'General appointment preparation',
          suggestedQuestions: [
            'What should I expect during this appointment?',
            'Are there any side effects I should watch for?',
            'What lifestyle changes should I consider?',
            'How is my treatment progressing?'
          ],
          activeFromConversation: true
        };
        
      case 'symptom-tracker':
        return {
          ...baseData,
          symptom: userInput.includes('eat') ? 'Food and nutrition concerns' : 'General symptoms',
          severity: 3,
          notes: `Patient asked: "${userInput}". Dr. Maya suggested tracking.`,
          trackingType: userInput.includes('eat') ? 'nutrition' : 'symptoms',
          activeFromConversation: true
        };
        
      case 'medical-translator':
        return {
          ...baseData,
          conditionName: 'Patient inquiry',
          description: `Explaining medical information related to: "${userInput}"`,
          activeFromConversation: true
        };
        
      default:
        return baseData;
    }
  };

  // Generate speech with Cartesia
  const generateSpeechWithCartesia = async (text: string) => {
    try {
      setIsSpeaking(true);
      setDrMayaEmotion('speaking');
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/cartesia-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });

      if (!response.ok) throw new Error(`TTS failed: ${response.status}`);

      const result = await response.json();
      if (result.audio_base64) {
        await playTTSAudio(result.audio_base64);
      }
      
    } catch (error) {
      console.error('❌ TTS error:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      setDrMayaEmotion('calm');
    }
  };

  // Play TTS audio
  const playTTSAudio = async (audioBase64: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer.slice(0));
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      // Fix chipmunk voice with sample rate compensation
      const cartesiaSampleRate = 22050;
      const contextSampleRate = audioContextRef.current.sampleRate;
      let playbackRate = cartesiaSampleRate / contextSampleRate * 0.95;
      
      source.playbackRate.value = playbackRate;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        setIsProcessing(false);
        setDrMayaEmotion('calm');
      };
      
      source.start();
      
    } catch (error) {
      console.error('❌ Audio playback error:', error);
      setIsSpeaking(false);
      setIsProcessing(false);
      setDrMayaEmotion('calm');
    }
  };

  // Connect to voice system
  const connectToVoiceSystem = useCallback(async () => {
    try {
      setConnectionError(null);
      
      const speechReady = initializeSpeechRecognition();
      if (!speechReady) return;

      const ttsReady = await checkTTSService();
      if (!ttsReady) {
        setConnectionError('Voice service not available');
        return;
      }

      setIsConnected(true);
      
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: '✅ Dr. Maya is ready with enhanced tool demonstrations',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages([systemMessage]);

      setTimeout(() => {
        generateSpeechWithCartesia(`Hello ${patientContext.patientName}, I'm Dr. Maya. I'm here to support you through every step of your journey. You can now use the tool panel on the left to explore all the tools available for your current stage, and I'll demonstrate each one for you. How can I help you today?`);
      }, 1000);

    } catch (error) {
      console.error('❌ Connection error:', error);
      setConnectionError('Failed to initialize enhanced voice experience');
    }
  }, [initializeSpeechRecognition, checkTTSService, patientContext.patientName]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (!isConnected || isProcessing || isSpeaking || isDemonstratingTool) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      setDrMayaEmotion('listening');
      recognitionRef.current?.start();
    }
  }, [isConnected, isListening, isProcessing, isSpeaking, isDemonstratingTool]);

  // Get avatar style based on emotion
  const getAvatarStyle = () => {
    const baseStyle = { ...styles.avatar };
    switch (drMayaEmotion) {
      case 'listening':
        return { ...baseStyle, ...styles.avatarListening };
      case 'thinking':
        return { ...baseStyle, ...styles.avatarThinking };
      case 'speaking':
        return { ...baseStyle, ...styles.avatarSpeaking };
      case 'demonstrating':
        return { ...baseStyle, ...styles.avatarDemonstrating };
      default:
        return baseStyle;
    }
  };

  // Get voice button style
  const getVoiceButtonStyle = () => {
    if (isListening) return { ...styles.voiceButton, ...styles.voiceButtonListening };
    if (isProcessing || isDemonstratingTool) return { ...styles.voiceButton, ...styles.voiceButtonProcessing };
    if (isSpeaking) return { ...styles.voiceButton, ...styles.voiceButtonSpeaking };
    return { ...styles.voiceButton, ...styles.voiceButtonReady };
  };

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  // CONNECTION SCREEN
  if (!isConnected) {
    return (
      <div style={styles.fullScreen}>
        <ElegantToolPanel onToolClick={handleToolPanelClick} />
        <div style={styles.voiceChatArea}>
          <div style={styles.header}>
            <button 
              style={styles.exitButton}
              onClick={onNavigateHome}
              onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              ← Exit
            </button>
            <div style={styles.headerTitle}>
              <h1 style={styles.titleText}>Enhanced Dr. Maya Experience</h1>
            </div>
            <div style={{ width: '80px' }} />
          </div>

          <div style={{ ...styles.content, ...styles.connectionScreen }}>
            <div style={styles.connectionContent}>
              <div style={styles.connectionAvatar}>👩‍⚕️</div>
              <h2 style={styles.connectionTitle}>Voice Chat + Tool Demonstrations</h2>
              <p style={styles.connectionSubtitle}>
                Talk with Dr. Maya and explore all RadiantCompass tools.<br/>
                Select any tool from the left panel for autonomous demonstrations.
              </p>

              {connectionError && (
                <div style={styles.errorBox}>
                  <p style={styles.errorText}>{connectionError}</p>
                </div>
              )}

              <button
                style={styles.connectButton}
                onClick={connectToVoiceSystem}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#2563EB';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#3B82F6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Start Enhanced Experience
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ENHANCED INTERFACE WITH TOOL PANEL
  return (
    <div style={styles.fullScreen}>
      {/* Tool Panel - Left Side */}
      <ElegantToolPanel onToolClick={handleToolPanelClick} />

      {/* Voice Chat Area - Right Side */}
      <div style={styles.voiceChatArea}>
        {/* Header */}
        <div style={styles.header}>
          <button 
            style={styles.exitButton}
            onClick={() => { setIsConnected(false); onNavigateHome?.(); }}
            onMouseOver={(e) => e.currentTarget.style.background = '#F3F4F6'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            ← Exit Enhanced Experience
          </button>
          
          <div style={styles.headerTitle}>
            <div>
              <h1 style={styles.titleText}>Dr. Maya Enhanced</h1>
              <p style={styles.subtitle}>Voice + Tool Demonstrations</p>
            </div>
          </div>
          
          {currentLatency && (
            <div style={styles.latencyBadge}>{currentLatency}ms</div>
          )}
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {/* Dr. Maya Avatar */}
          <div style={styles.avatarSection}>
            <img 
              src="/dr-maya-professional.jpg"
              alt="Dr. Maya"
              style={getAvatarStyle()}
            />
          </div>

          {/* Chat Messages */}
          <div ref={chatContainerRef} style={styles.chatContainer}>
            {chatMessages.map((message) => {
              let bubbleStyle;
              switch (message.type) {
                case 'user':
                  bubbleStyle = styles.userBubble;
                  break;
                case 'system':
                  bubbleStyle = styles.systemBubble;
                  break;
                case 'tool-demo':
                  bubbleStyle = styles.toolDemoBubble;
                  break;
                default:
                  bubbleStyle = styles.assistantBubble;
              }
              
              return (
                <div key={message.id}>
                  <div style={{ ...styles.messageBubble, ...bubbleStyle }}>
                    <p style={styles.messageContent}>{message.content}</p>
                    <div style={styles.messageFooter}>
                      <span style={styles.timestamp}>{message.timestamp}</span>
                      {message.latency_ms && (
                        <span style={styles.latencyTag}>{message.latency_ms}ms</span>
                      )}
                    </div>
                  </div>

                  {/* Show activated tool after assistant message */}
                  {message.type === 'assistant' && message.activatedTool && (
                    <div style={{ marginTop: '16px' }}>
                      {renderToolComponent(message.activatedTool, message.toolData, `message-${message.id}`)}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Show currently active tool */}
            {activeTool && (
              <div style={{ marginTop: '16px' }}>
                {renderToolComponent(activeTool, toolData, 'active-tool')}
              </div>
            )}
          </div>
        </div>

        {/* Voice Controls */}
        <div style={styles.controlsContainer}>
          <button
            style={getVoiceButtonStyle()}
            onClick={toggleListening}
            disabled={isProcessing || isSpeaking || isDemonstratingTool}
            onMouseOver={(e) => {
              if (!isProcessing && !isSpeaking && !isListening && !isDemonstratingTool) {
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseOut={(e) => {
              if (!isListening) {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {isListening ? '🔴' : 
             isDemonstratingTool ? '🎯' :
             isProcessing ? '🧠' : 
             isSpeaking ? '🔊' : '🎤'}
          </button>
          
          <p style={styles.statusText}>
            {isListening ? "Listening..." :
             isDemonstratingTool ? "Demonstrating tool..." :
             isProcessing ? "Dr. Maya is thinking..." :
             isSpeaking ? "Dr. Maya is speaking..." :
             "Tap to talk or select tools"}
          </p>
          
          <div style={styles.techSpecs}>
            <span style={styles.techSpec}>⚡ Web Speech</span>
            <span style={styles.techSpec}>🧠 Groq AI</span>
            <span style={styles.techSpec}>🎵 Cartesia Voice</span>
            <span style={styles.techSpec}>🛠️ Tool Panel</span>
          </div>
        </div>
      </div>
    </div>
  );
}