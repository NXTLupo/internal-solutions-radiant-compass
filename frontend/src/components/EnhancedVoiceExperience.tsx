import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ElegantToolPanel } from './ElegantToolPanel';
import { SymptomTracker } from './journeystages/SymptomTracker';
import { ConditionExplainer } from './journeystages/ConditionExplainer';
import { TreatmentCalendar } from './tools/TreatmentCalendar';
import { AppointmentPrepGuide } from './journeystages/AppointmentPrepGuide';
import { SymptomSage } from './journeystages/SymptomSage';
import { SecondOpinionGuide } from './journeystages/SecondOpinionGuide';
import { InsuranceAnalyzer } from './journeystages/InsuranceAnalyzer';
import { TestCoordinator } from './journeystages/TestCoordinator';
import { CostCalculator } from './journeystages/CostCalculator';
import { RecoveryTracker } from './journeystages/RecoveryTracker';
import { MilestoneTracker } from './journeystages/MilestoneTracker';
import { SurvivorshipPlanner } from './journeystages/SurvivorshipPlanner';
import { AppealsAssistant } from './journeystages/AppealsAssistant';
import { SurgicalPrepGuide } from './journeystages/SurgicalPrepGuide';
import { RecoveryPlanner } from './journeystages/RecoveryPlanner';
import { ToolPlaceholder } from './journeystages/ToolPlaceholder';
import { useCopilotAction } from '@copilotkit/react-core';
import RadiantCompassLogo from '../assets/radiant-compass-logo.png';
import { 
  Activity, Stethoscope, Search, Calendar, Users, 
  Shield, Pill, Scissors, Heart, TrendingUp, 
  Eye, Sparkles, ChevronRight, Play
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  stage: number;
  priority: 'high' | 'medium' | 'low';
}

interface JourneyStage {
  id: number;
  name: string;
  theme: string;
  icon: React.ComponentType;
  color: string;
  gradient: string;
  tools: Tool[];
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 1,
    name: "First Hints & Initial Visit",
    theme: "Fear to Understanding",
    icon: Activity,
    color: "#10B981",
    gradient: "from-emerald-400 to-emerald-600",
    tools: [
      { id: "symptom-tracker", name: "Symptom Tracker", description: "Track symptoms with AI analysis", category: "tracking", icon: "📊", stage: 1, priority: "high" },
      { id: "appointment-prep", name: "Appointment Prep", description: "Optimize doctor visits", category: "planning", icon: "📋", stage: 1, priority: "high" },
      { id: "ai-symptom-sage", name: "AI Symptom Sage", description: "Real-time symptom interpretation", category: "ai", icon: "🧠", stage: 1, priority: "high" }
    ]
  },
  {
    id: 2,
    name: "Specialist Work-up & Diagnosis",
    theme: "Shock to Clarity", 
    icon: Stethoscope,
    color: "#3B82F6",
    gradient: "from-blue-400 to-blue-600",
    tools: [
      { id: "medical-translator", name: "Medical Translator", description: "Convert reports to plain language", category: "translation", icon: "🔤", stage: 2, priority: "high" },
      { id: "question-generator", name: "Question Generator", description: "AI consultation checklists", category: "preparation", icon: "❓", stage: 2, priority: "high" },
      { id: "peer-connection", name: "Peer Connection", description: "Connect with similar cases", category: "community", icon: "👥", stage: 2, priority: "medium" }
    ]
  },
  {
    id: 3,
    name: "Research & Compare-Care",
    theme: "Confusion to Clarity",
    icon: Search,
    color: "#8B5CF6", 
    gradient: "from-purple-400 to-purple-600",
    tools: [
      { id: "compare-care", name: "Compare-My-Care™", description: "Rank hospitals by outcomes", category: "comparison", icon: "⚖️", stage: 3, priority: "high" },
      { id: "insurance-analyzer", name: "Insurance Analyzer", description: "Coverage navigation", category: "financial", icon: "🛡️", stage: 3, priority: "high" },
      { id: "travel-planner", name: "Travel Planner", description: "Logistics coordination", category: "logistics", icon: "✈️", stage: 3, priority: "medium" }
    ]
  },
  {
    id: 4,
    name: "Staging & Testing",
    theme: "Uncertainty to Planning",
    icon: Calendar,
    color: "#F59E0B",
    gradient: "from-amber-400 to-amber-600", 
    tools: [
      { id: "treatment-calendar", name: "Treatment Calendar", description: "Schedule and track appointments", category: "scheduling", icon: "🗓️", stage: 4, priority: "high" },
      { id: "test-coordinator", name: "Test Coordinator", description: "Coordinate multiple tests", category: "scheduling", icon: "🔬", stage: 4, priority: "high" },
      { id: "results-repository", name: "Results Repository", description: "Organize test results", category: "organization", icon: "📁", stage: 4, priority: "medium" }
    ]
  }
];

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
    background: 'linear-gradient(135deg, #F0F2F5 0%, #E0E0E0 100%)', 
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
    overflow: 'hidden',
    backgroundColor: '#FFFFFF', 
    borderRadius: '20px', 
    margin: '20px', 
    boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 5px 20px rgba(0,0,0,0.06)' 
  },

  // PREMIUM HEALTHCARE HEADER
  header: {
    background: '#FFFFFF',
    borderBottom: '1px solid #EEEEEE',
    padding: '24px 36px', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)' 
  },

  exitButton: {
    background: '#F5F5F5',
    border: 'none',
    fontSize: '16px', 
    fontWeight: 500,
    color: '#616161',
    cursor: 'pointer',
    padding: '10px 20px', 
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    letterSpacing: '-0.01em',
    boxShadow: '0 3px 6px rgba(0,0,0,0.05)' 
  },

  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px' 
  },

  titleText: {
    fontSize: '26px', 
    fontWeight: 700,
    color: '#212121',
    margin: 0,
    letterSpacing: '-0.02em'
  },

  subtitle: {
    fontSize: '16px', 
    color: '#757575',
    margin: 0,
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  latencyBadge: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)', 
    color: 'white',
    padding: '6px 14px', 
    borderRadius: '20px', 
    fontSize: '14px', 
    fontWeight: 600,
    boxShadow: '0 3px 10px rgba(76, 175, 80, 0.3)', 
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
    padding: '50px 36px 24px 36px', 
    flexShrink: 0,
    position: 'relative' as const
  },

  avatar: {
    width: '150px', 
    height: '150px', 
    borderRadius: '50%',
    transition: 'all 0.3s ease-out',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.05)', 
    border: '4px solid #FFFFFF', 
    objectFit: 'cover' as const,
    position: 'relative' as const,
    zIndex: 2
  },

  avatarListening: {
    boxShadow: '0 0 40px rgba(33, 150, 243, 0.5), 0 8px 32px rgba(33, 150, 243, 0.3)', 
    borderColor: '#2196F3',
    transform: 'scale(1.1)' 
  },

  avatarThinking: {
    boxShadow: '0 0 40px rgba(156, 39, 176, 0.5), 0 8px 32px rgba(156, 39, 176, 0.3)', 
    borderColor: '#9C27B0',
    transform: 'scale(1.07)' 
  },

  avatarSpeaking: {
    boxShadow: '0 0 40px rgba(76, 175, 80, 0.5), 0 8px 32px rgba(76, 175, 80, 0.3)', 
    borderColor: '#4CAF50',
    transform: 'scale(1.12)' 
  },

  avatarDemonstrating: {
    boxShadow: '0 0 40px rgba(255, 152, 0, 0.5), 0 8px 32px rgba(255, 152, 0, 0.3)', 
    borderColor: '#FF9800',
    transform: 'scale(1.09)' 
  },

  // PREMIUM CHAT MESSAGES CONTAINER
  chatContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '0 36px', 
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px', 
    scrollBehavior: 'smooth' as const,
    paddingBottom: '30px' 
  },

  // PREMIUM MESSAGE BUBBLES
  messageBubble: {
    maxWidth: '70%', 
    padding: '20px 24px', 
    borderRadius: '24px', 
    fontSize: '17px', 
    lineHeight: 1.6,
    position: 'relative' as const,
    wordWrap: 'break-word' as const,
    wordBreak: 'break-word' as const,
    letterSpacing: '-0.01em',
    boxShadow: '0 3px 10px rgba(0,0,0,0.06)' 
  },

  userBubble: {
    background: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)', 
    color: '#FFFFFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '8px', 
    boxShadow: '0 5px 15px rgba(33, 150, 243, 0.25)' 
  },

  assistantBubble: {
    background: '#F5F5F5', 
    color: '#424242',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '8px', 
    border: '1px solid #EEEEEE',
    boxShadow: '0 3px 10px rgba(0,0,0,0.04)' 
  },

  systemBubble: {
    background: 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)', 
    color: '#FFFFFF',
    alignSelf: 'center',
    textAlign: 'center' as const,
    fontSize: '16px', 
    fontWeight: 500,
    boxShadow: '0 5px 15px rgba(76, 175, 80, 0.25)' 
  },

  toolDemoBubble: {
    background: 'linear-gradient(135deg, #FFB300 0%, #FB8C00 100%)', 
    color: '#FFFFFF',
    alignSelf: 'center',
    textAlign: 'center' as const,
    fontSize: '16px', 
    fontWeight: 500,
    boxShadow: '0 5px 15px rgba(255, 152, 0, 0.25)' 
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
    marginTop: '14px', 
    opacity: 0.7,
    fontSize: '12px' 
  },

  timestamp: {
    fontSize: '12px', 
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  latencyTag: {
    fontSize: '11px', 
    background: 'rgba(0, 0, 0, 0.08)',
    padding: '4px 9px', 
    borderRadius: '8px', 
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  // PREMIUM VOICE CONTROLS - ALWAYS VISIBLE
  controlsContainer: {
    background: '#FFFFFF',
    borderTop: '1px solid #EEEEEE',
    padding: '30px 36px', 
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px', 
    flexShrink: 0,
    boxShadow: '0 -3px 10px rgba(0,0,0,0.04)' 
  },

  voiceButton: {
    width: '100px', 
    height: '100px', 
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '32px', 
    color: 'white',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.1)', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    position: 'relative' as const
  },

  voiceButtonListening: {
    background: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)', 
    transform: 'scale(1.15)',
    boxShadow: '0 0 40px rgba(229, 57, 53, 0.5), 0 8px 32px rgba(229, 57, 53, 0.4)' 
  },

  voiceButtonProcessing: {
    background: 'linear-gradient(135deg, #FFB300 0%, #FB8C00 100%)', 
    cursor: 'not-allowed',
    boxShadow: '0 0 30px rgba(255, 152, 0, 0.4), 0 8px 24px rgba(255, 152, 0, 0.3)' 
  },

  voiceButtonSpeaking: {
    background: 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%)', 
    cursor: 'not-allowed',
    transform: 'scale(1.12)',
    boxShadow: '0 0 35px rgba(76, 175, 80, 0.5), 0 8px 28px rgba(76, 175, 80, 0.35)' 
  },

  voiceButtonReady: {
    background: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)', 
    boxShadow: '0 8px 32px rgba(33, 150, 243, 0.35), 0 4px 16px rgba(33, 150, 243, 0.25)' 
  },

  statusText: {
    fontSize: '17px', 
    fontWeight: 600,
    color: '#424242',
    textAlign: 'center' as const,
    margin: 0,
    letterSpacing: '-0.01em'
  },

  techSpecs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '14px', 
    flexWrap: 'wrap' as const
  },

  techSpec: {
    fontSize: '12px', 
    color: '#757575',
    background: '#F0F0F0',
    padding: '6px 12px', 
    borderRadius: '12px', 
    fontWeight: 500,
    letterSpacing: '-0.01em',
    border: '1px solid #E0E0E0'
  },

  // CONNECTION SCREEN
  connectionScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px 36px', 
    backgroundColor: '#F8F9FA', 
    borderRadius: '20px', 
    margin: '20px', 
    boxShadow: '0 10px 40px rgba(0,0,0,0.1), 0 5px 20px rgba(0,0,0,0.06)' 
  },

  connectionContent: {
    textAlign: 'center' as const,
    maxWidth: '450px' 
  },

  connectionAvatar: {
    width: '150px', 
    height: '150px', 
    margin: '0 auto 40px auto', 
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #42A5F5 0%, #2196F3 100%)', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '56px', 
    boxShadow: '0 10px 30px rgba(33, 150, 243, 0.35), 0 5px 15px rgba(33, 150, 243, 0.25)' 
  },

  connectionTitle: {
    fontSize: '30px', 
    fontWeight: 700,
    color: '#212121',
    marginBottom: '16px', 
    letterSpacing: '-0.02em'
  },

  connectionSubtitle: {
    fontSize: '17px', 
    color: '#616161',
    marginBottom: '32px', 
    lineHeight: 1.6,
    letterSpacing: '-0.01em'
  },

  errorBox: {
    background: '#FFEBEE', 
    border: '1px solid #EF9A9A',
    borderRadius: '16px', 
    padding: '16px', 
    marginBottom: '24px', 
    boxShadow: '0 3px 10px rgba(229, 57, 53, 0.15)' 
  },

  errorText: {
    color: '#D32F2F',
    fontSize: '14px', 
    margin: 0,
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  connectButton: {
    fontSize: '17px', 
    padding: '14px 32px', 
    background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)', 
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '14px', 
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 8px 32px rgba(76, 175, 80, 0.35), 0 4px 16px rgba(76, 175, 80, 0.25)', 
    transition: 'all 0.2s ease',
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
  const handleToolPanelClick = async (tool: { id: string; name: string; string; stage: number }) => {
    console.log(`[EnhancedVoiceExperience] Tool panel click received: ${tool.name}`);
    return await showToolVisually(tool.id, tool.name, tool.description, tool.stage);
  };

  // Comprehensive tool knowledge base with expert descriptions
  const getToolExpertDescription = (toolId: string): { description: string; prompts: string[]; benefits: string[] } => {
    const toolKnowledge: Record<string, { description: string; prompts: string[]; benefits: string[] }> = {
      'symptom-tracker': {
        description: "The Symptom Tracker is your digital health companion that uses AI to analyze patterns in your symptoms over time. It helps identify triggers, monitor progression, and provides valuable data for your healthcare team. This tool is particularly powerful for rare disease patients where subtle changes can be significant.",
        prompts: [
          "What symptoms have you been experiencing lately?",
          "How would you rate the severity on a scale of 1-10?",
          "When did you first notice these symptoms?",
          "Are there any activities or times of day when symptoms worsen?"
        ],
        benefits: [
          "Identify symptom patterns and triggers",
          "Provide detailed data to your doctors",
          "Track treatment effectiveness",
          "Early detection of changes in your condition"
        ]
      },
      'treatment-calendar': {
        description: "Your Treatment Calendar is a comprehensive scheduling system that coordinates all aspects of your healthcare journey. It integrates appointments, treatments, lab work, and follow-ups into one intelligent system that helps you prepare for each visit and tracks your progress through treatment protocols.",
        prompts: [
          "What type of appointment would you like to schedule?",
          "Who is your primary oncologist or specialist?",
          "Do you need help coordinating transportation or accommodations?",
          "Would you like reminders set up for pre-appointment preparations?"
        ],
        benefits: [
          "Never miss important appointments",
          "Coordinate complex treatment schedules",
          "Prepare questions and concerns in advance",
          "Track your progress through treatment phases"
        ]
      },
      'appointment-prep': {
        description: "The Appointment Prep Guide transforms stressful medical visits into productive, organized sessions. It helps you articulate your concerns clearly, generates relevant questions based on your situation, and ensures you maximize the value of every minute with your healthcare providers.",
        prompts: [
          "What's your main concern for this appointment?",
          "Have you had any new symptoms since your last visit?",
          "Are there any medications or treatments you want to discuss?",
          "Do you have specific questions about your prognosis or treatment options?"
        ],
        benefits: [
          "Organize thoughts before appointments",
          "Generate relevant, personalized questions",
          "Track appointment outcomes",
          "Improve communication with your medical team"
        ]
      },
      'insurance-analyzer': {
        description: "The Insurance Analyzer is your personal healthcare finance navigator. It breaks down complex insurance policies into understandable terms, identifies coverage gaps, helps you understand out-of-pocket costs, and guides you through the appeals process when needed.",
        prompts: [
          "What insurance plan do you currently have?",
          "Are you facing any coverage denials or issues?",
          "What treatments or medications need coverage verification?",
          "Do you need help understanding your benefits or deductibles?"
        ],
        benefits: [
          "Decode complex insurance terminology",
          "Identify coverage opportunities",
          "Calculate potential out-of-pocket costs",
          "Navigate appeals and prior authorizations"
        ]
      },
      'ai-symptom-sage': {
        description: "AI Symptom Sage provides real-time interpretation of your symptoms using advanced medical AI. It helps you understand what your body might be telling you, suggests when to seek immediate care versus monitoring at home, and provides evidence-based insights about symptom patterns in rare diseases.",
        prompts: [
          "Describe the symptoms you're experiencing in detail",
          "How long have these symptoms been present?",
          "Are these symptoms new or have they changed recently?",
          "Are you taking any medications that might be related?"
        ],
        benefits: [
          "Real-time symptom interpretation",
          "Evidence-based severity assessment",
          "Guidance on when to seek immediate care",
          "Understanding of symptom relationships"
        ]
      },
      'test-coordinator': {
        description: "The Test Coordinator streamlines your diagnostic journey by organizing multiple tests, tracking results, ensuring proper preparation, and helping you understand what each test means for your care. It's especially valuable when dealing with complex rare disease workups requiring multiple specialists.",
        prompts: [
          "What tests has your doctor ordered?",
          "Do you need help understanding test preparation requirements?",
          "Are you waiting for any test results?",
          "Do you have questions about what specific tests are looking for?"
        ],
        benefits: [
          "Coordinate complex test schedules",
          "Ensure proper test preparation",
          "Track and organize results",
          "Understand test purposes and implications"
        ]
      }
    };
    
    return toolKnowledge[toolId] || {
      description: `The ${toolId.replace('-', ' ')} tool is designed to support your healthcare journey with specialized functionality tailored to your needs.`,
      prompts: ["How can I help you with this tool today?"],
      benefits: ["Personalized healthcare support"]
    };
  };

  // Enhanced CopilotKit action to handle tool demonstrations with visual display
  const showToolVisually = async (toolId: string, toolName: string, toolDescription: string, stage: number) => {
      console.log(`[EnhancedVoiceExperience] Visually displaying tool: ${toolName}`);
      
      setIsDemonstratingTool(true);
      setDrMayaEmotion('demonstrating');

      // Get comprehensive tool information
      const toolInfo = getToolExpertDescription(toolId);

      // Create Dr. Maya's comprehensive response with visual tool activation
      const demonstrationResponse = `🌟 **${toolName} - Expert Tool Demonstration**

**About This Tool:**
${toolInfo.description}

**Key Benefits:**
${toolInfo.benefits.map((benefit, index) => `• ${benefit}`).join('\n')}

**Let's Get Started:**
I'm now bringing up the ${toolName} interface below. To make this demonstration most valuable for you, I'd like to gather some information:

${toolInfo.prompts.map((prompt, index) => `${index + 1}. ${prompt}`).join('\n')}

The tool interface is loading below - you'll see it populate with relevant information as we work together. Watch as I demonstrate each feature and guide you through the process step by step.

🛠️ **Tool Interface Active Below** 👇`;

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
      // Stage 1: Fully implemented
      case 'symptom-tracker': return 'SymptomTracker';
      case 'appointment-prep': return 'AppointmentPrepGuide';
      case 'ai-symptom-sage': return 'SymptomSage';

      // Stage 2: Partially implemented
      case 'medical-translator': return 'ConditionExplainer'; // Basic placeholder
      case 'question-generator': return 'AppointmentPrepGuide'; // Re-uses existing component
      case 'peer-connection': return 'ToolPlaceholder';

      // Stage 3: Partially implemented
      case 'compare-care': return 'SecondOpinionGuide'; // Basic placeholder
      case 'insurance-analyzer': return 'InsuranceAnalyzer';
      case 'travel-planner': return 'ToolPlaceholder';

      // Stage 4: Partially implemented
      case 'treatment-calendar': return 'TreatmentCalendar'; // Well-implemented
      case 'test-coordinator': return 'TestCoordinator';
      case 'results-repository': return 'ToolPlaceholder';

      // Stages 5-12: All use the new placeholder
      case 'tumor-board':
      case 'treatment-visualizer':
      case 'trial-matcher':
      case 'appeals-assistant': return 'AppealsAssistant';
      case 'cost-calculator': return 'CostCalculator';
      case 'accommodation-concierge':
      case 'side-effect-tracker':
      case 'nutrition-support':
      case 'surgical-prep': return 'SurgicalPrepGuide';
      case 'virtual-tour':
      case 'recovery-tracker': return 'RecoveryTracker';
      case 'recovery-planner': return 'RecoveryPlanner';
      case 'complementary-guide':
      case 'completion-countdown':
      case 'milestone-tracker': return 'MilestoneTracker';
      case 'rehab-program':
      case 'scan-anxiety':
      case 'surveillance-manager':
      case 'survivorship-planner': return 'SurvivorshipPlanner';
      case 'lifestyle-optimizer':
      case 'survivorship-care':
      case 'mentorship-program':
      case 'legacy-docs':
        return 'ToolPlaceholder';

      default: 
        console.log(`[getToolComponentName] Unknown tool ID: ${toolId}, using ToolPlaceholder as fallback`);
        return 'ToolPlaceholder';
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
      case 'InsuranceAnalyzer':
        return <InsuranceAnalyzer key={key} {...commonProps} />;
      case 'TestCoordinator':
        return <TestCoordinator key={key} {...commonProps} />;
      case 'CostCalculator':
        return <CostCalculator key={key} {...commonProps} />;
      case 'RecoveryTracker':
        return <RecoveryTracker key={key} {...commonProps} />;
      case 'MilestoneTracker':
        return <MilestoneTracker key={key} {...commonProps} />;
      case 'SurvivorshipPlanner':
        return <SurvivorshipPlanner key={key} {...commonProps} />;
      case 'AppealsAssistant':
        return <AppealsAssistant key={key} {...commonProps} />;
      case 'SurgicalPrepGuide':
        return <SurgicalPrepGuide key={key} {...commonProps} />;
      case 'RecoveryPlanner':
        return <RecoveryPlanner key={key} {...commonProps} />;
      case 'ToolPlaceholder':
        return <ToolPlaceholder key={key} {...commonProps} />;
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

  const getContextualToolData = (toolId: string, userInput: string, aiResponse: string): any => {
    const toolName = JOURNEY_STAGES.flatMap(stage => stage.tools).find(tool => tool.id === toolId)?.name || toolId;
    const toolInfo = getToolExpertDescription(toolId);

    const baseData = {
      toolName: toolName,
      demonstrationMode: true,
      conversationContext: {
        userInput,
        aiResponse,
        timestamp: new Date().toISOString()
      },
      expertDescription: toolInfo.description,
      suggestedPrompts: toolInfo.prompts,
      keyBenefits: toolInfo.benefits
    };
    
    switch (toolId) {
      case 'treatment-calendar':
        return {
          ...baseData,
          appointments: [
            {
              id: 'contextual-1',
              date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              time: '10:00 AM',
              title: 'Follow-up Consultation',
              provider: 'Dr. Sarah Johnson',
              location: 'Medical Center - Room 204',
              type: 'consultation',
              status: 'upcoming',
              notes: 'Review treatment progress and discuss next steps'
            },
            {
              id: 'contextual-2',
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              time: '2:30 PM',
              title: 'Lab Work & Blood Tests',
              provider: 'Lab Services',
              location: 'Hospital Lab Wing',
              type: 'test',
              status: 'upcoming',
              notes: 'Fasting required - no food after midnight'
            }
          ],
          activeFromConversation: true,
          demonstrationFeatures: [
            'Smart scheduling coordination',
            'Automatic appointment reminders',
            'Preparation instructions',
            'Provider contact information'
          ]
        };
        
      case 'appointment-prep':
        return {
          ...baseData,
          primaryConcern: userInput.toLowerCase().includes('questions') ? 
            'Questions about upcoming appointment and treatment plan' : 
            userInput.toLowerCase().includes('symptoms') ?
            'Discussing current symptoms and changes' :
            'General appointment preparation and health updates',
          suggestedQuestions: [
            'What should I expect during this appointment?',
            'Are there any side effects I should watch for?',
            'What lifestyle changes should I consider?',
            'How is my treatment progressing?',
            'Are there any new treatments I should consider?'
          ],
          activeFromConversation: true,
          preparationChecklist: [
            'Bring current medication list',
            'Prepare symptom timeline',
            'Write down specific questions',
            'Gather recent test results'
          ]
        };
        
      case 'symptom-tracker':
        return {
          ...baseData,
          symptom: userInput.toLowerCase().includes('fatigue') ? 'Persistent fatigue and energy levels' :
                   userInput.toLowerCase().includes('pain') ? 'Pain management and tracking' :
                   userInput.toLowerCase().includes('eat') ? 'Nutrition and appetite concerns' : 
                   'General symptom monitoring',
          severity: 3,
          notes: `Patient mentioned: "${userInput}". Tracking recommended for pattern analysis.`,
          trackingType: userInput.toLowerCase().includes('eat') ? 'nutrition' : 'symptoms',
          activeFromConversation: true,
          demoEntries: [
            { date: new Date().toISOString().split('T')[0], symptom: 'Mild fatigue', severity: 3, notes: 'After morning activities' },
            { date: new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0], symptom: 'Energy levels', severity: 4, notes: 'Better after rest' }
          ]
        };
        
      case 'insurance-analyzer':
        return {
          ...baseData,
          currentPlan: 'Comprehensive Health Plan',
          coverageAnalysis: {
            deductible: '$2,500',
            outOfPocketMax: '$8,500',
            copaySpecialist: '$50',
            coinsurance: '20%'
          },
          pendingClaims: [
            { service: 'MRI Scan', status: 'Under Review', amount: '$3,200' },
            { service: 'Specialist Consultation', status: 'Approved', amount: '$450' }
          ],
          recommendedActions: [
            'Review coverage for upcoming treatments',
            'Check prior authorization requirements',
            'Verify provider network status'
          ],
          activeFromConversation: true
        };
        
      case 'test-coordinator':
        return {
          ...baseData,
          scheduledTests: [
            {
              testName: 'Complete Blood Count (CBC)',
              date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              preparation: 'No special preparation required',
              location: 'Hospital Lab - Building A',
              status: 'scheduled'
            },
            {
              testName: 'Imaging Study (CT Scan)',
              date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              preparation: 'No food 4 hours before exam. Contrast material will be used.',
              location: 'Radiology Department',
              status: 'pending_schedule'
            }
          ],
          coordinationFeatures: [
            'Automated scheduling optimization',
            'Preparation reminder system',
            'Results tracking and alerts',
            'Provider communication hub'
          ],
          activeFromConversation: true
        };
        
      case 'ai-symptom-sage':
        return {
          ...baseData,
          currentSymptoms: userInput.toLowerCase().includes('fatigue') ? ['Persistent fatigue', 'Reduced energy'] :
                          userInput.toLowerCase().includes('pain') ? ['Localized pain', 'Discomfort'] :
                          ['General symptoms from conversation'],
          aiInsights: [
            'Symptoms may be related to treatment progression',
            'Consider tracking patterns over next week',
            'Important to discuss with healthcare provider',
            'No immediate red flags identified'
          ],
          recommendations: [
            'Continue current monitoring approach',
            'Document any changes in severity',
            'Schedule follow-up if symptoms persist',
            'Maintain current treatment regimen'
          ],
          confidenceLevel: 85,
          activeFromConversation: true
        };
        
      case 'medical-translator':
        return {
          ...baseData,
          medicalTerm: userInput.includes('diagnosis') ? 'Recent diagnosis information' :
                      userInput.includes('treatment') ? 'Treatment terminology' :
                      'Medical information from conversation',
          plainLanguageExplanation: `Based on your question about "${userInput}", let me help translate any complex medical terms into clear, understandable language.`,
          relatedConcepts: [
            'Treatment options and alternatives',
            'Expected outcomes and timelines',
            'Potential side effects to monitor',
            'Follow-up care requirements'
          ],
          activeFromConversation: true
        };
        
      default:
        return {
          ...baseData,
          demoData: {
            userContext: userInput,
            aiContext: aiResponse,
            demonstrationMode: true
          },
          placeholderInfo: `This tool (${toolName}) is being demonstrated based on your conversation context.`,
          activeFromConversation: true
        };
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
              onMouseOver={(e) => e.currentTarget.style.background = '#E0E0E0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#F5F5F5'}
            >
              ← Exit
            </button>
            <div style={styles.headerTitle}>
              <img src={RadiantCompassLogo} alt="Radiant Compass Logo" style={{ width: '40px', height: '40px' }} />
              <h1 style={styles.titleText}>RadiantCompass</h1>
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
                  e.currentTarget.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(76, 175, 80, 0.4), 0 4px 16px rgba(76, 175, 80, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.3), 0 3px 10px rgba(76, 175, 80, 0.2)';
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
            onMouseOver={(e) => e.currentTarget.style.background = '#E0E0E0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#F5F5F5'}
          >
            ← Exit Enhanced Experience
          </button>
          
          <div style={styles.headerTitle}>
            <img src={RadiantCompassLogo} alt="Radiant Compass Logo" style={{ width: '40px', height: '40px' }} />
            <h1 style={styles.titleText}>RadiantCompass</h1>
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
                    <div style={{ marginTop: '20px' }}>
                      {renderToolComponent(message.activatedTool, message.toolData, `message-${message.id}`)}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Show currently active tool */}
            {activeTool && (
              <div style={{ marginTop: '20px' }}>
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
                e.currentTarget.style.transform = 'scale(1.08)';
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