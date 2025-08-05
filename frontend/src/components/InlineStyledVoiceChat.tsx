import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SymptomTracker } from './journeystages/SymptomTracker';
import { ConditionExplainer } from './journeystages/ConditionExplainer';
import { useAppState } from './AppStateProvider';

interface InlineStyledVoiceChatProps {
  onNavigateHome?: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  latency_ms?: number;
  activatedTool?: string;
  toolData?: any;
}

// PREMIUM HEALTHCARE CONCIERGE DESIGN - INLINE STYLES
const styles = {
  // FULL SCREEN PREMIUM WHITE WITH SUBTLE WARMTH
  fullScreen: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFEFE 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif',
    zIndex: 9999,
    overflow: 'hidden',
    letterSpacing: '-0.01em'
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
    padding: '48px 32px',
    flexShrink: 0,
    position: 'relative' as const
  },

  avatar: {
    width: '160px',
    height: '160px',
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
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '24px',
    flexShrink: 0,
    boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.02)'
  },

  voiceButton: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '36px',
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
    fontSize: '18px',
    fontWeight: 600,
    color: '#0F172A',
    textAlign: 'center' as const,
    margin: 0,
    letterSpacing: '-0.01em'
  },

  techSpecs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap' as const
  },

  techSpec: {
    fontSize: '13px',
    color: '#64748B',
    background: 'rgba(248, 250, 252, 0.8)',
    padding: '8px 16px',
    borderRadius: '16px',
    fontWeight: 500,
    letterSpacing: '-0.01em',
    border: '1px solid rgba(226, 232, 240, 0.6)'
  },

  // PREMIUM CONNECTION SCREEN
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
    width: '160px',
    height: '160px',
    margin: '0 auto 48px auto',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '64px',
    boxShadow: '0 12px 48px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(59, 130, 246, 0.2)'
  },

  connectionTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: '20px',
    letterSpacing: '-0.02em'
  },

  connectionSubtitle: {
    fontSize: '18px',
    color: '#64748B',
    marginBottom: '40px',
    lineHeight: 1.6,
    letterSpacing: '-0.01em'
  },

  errorBox: {
    background: 'rgba(254, 242, 242, 0.8)',
    border: '1px solid rgba(254, 202, 202, 0.6)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '32px',
    backdropFilter: 'blur(8px)'
  },

  errorText: {
    color: '#DC2626',
    fontSize: '15px',
    margin: 0,
    fontWeight: 500,
    letterSpacing: '-0.01em'
  },

  connectButton: {
    fontSize: '18px',
    padding: '16px 40px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: 600,
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(59, 130, 246, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '-0.01em'
  }
};

export function InlineStyledVoiceChat({ onNavigateHome }: InlineStyledVoiceChatProps = {}) {
  // Core states
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentLatency, setCurrentLatency] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [drMayaEmotion, setDrMayaEmotion] = useState<'calm' | 'listening' | 'thinking' | 'speaking'>('calm');
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
      console.log('🔍 Checking TTS service...');
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/health');
      const result = await response.json();
      
      if (result.cartesia_available) {
        console.log('✅ Cartesia TTS available');
        return true;
      } else {
        console.log('⚠️ Using fallback TTS');
        return true;
      }
    } catch (error) {
      console.error('❌ TTS service check error:', error);
      return false;
    }
  }, []);

  // Check for tool triggers and get available tools
  const checkForToolTriggers = async (message: string) => {
    try {
      const response = await fetch(`http://localhost:9500/api/v1/journey/${patientContext.journeyStage}`);
      if (!response.ok) return null;
      
      const journeyData = await response.json();
      const availableTools = journeyData.tools || [];
      
      // Check if message contains any tool triggers
      const messageWords = message.toLowerCase().split(' ');
      const triggeredTools = availableTools.filter(tool => 
        tool.triggers.some(trigger => 
          messageWords.some(word => word.includes(trigger.toLowerCase()))
        )
      );
      
      return { availableTools, triggeredTools };
    } catch (error) {
      console.error('❌ Error checking tool triggers:', error);
      return null;
    }
  };

  // Process with Groq AI and integrate tools
  const processWithGroqAI = async (transcript: string) => {
    try {
      const startTime = Date.now();
      
      // Check for available tools and triggers
      const toolData = await checkForToolTriggers(transcript);
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript,
          patient_name: patientContext.patientName,
          context: {
            journeyStage: patientContext.journeyStage,
            emotionalState: patientContext.emotionalState,
            patient_id: patientContext.patient_id,
            userRole: patientContext.userRole,
            availableTools: toolData?.availableTools || [],
            triggeredTools: toolData?.triggeredTools || []
          }
        })
      });

      const result = await response.json();
      const aiLatency = Date.now() - startTime;
      setCurrentLatency(aiLatency);
      
      console.log(`⚡ AI response: ${aiLatency}ms`);
      
      // Create enhanced message with dynamic tool activation
      let enhancedResponse = result.response;
      let activatedToolName = null;
      let extractedToolData = null;
      
      // Check if Dr. Maya's response indicates she should activate a tool
      const lowerResponse = result.response.toLowerCase();
      
      // Activate Symptom Tracker if Dr. Maya mentions tracking symptoms
      if ((lowerResponse.includes('track') && (lowerResponse.includes('symptom') || lowerResponse.includes('pain'))) ||
          lowerResponse.includes('symptom log') || 
          lowerResponse.includes('symptom tracker') ||
          (toolData?.triggeredTools?.some(t => t.component === 'SymptomTracker'))) {
        
        activatedToolName = 'SymptomTracker';
        
        // Extract symptom information from the conversation
        const userMessage = transcript.toLowerCase();
        extractedToolData = {
          symptom: extractSymptomFromText(userMessage),
          severity: extractSeverityFromText(userMessage),
          notes: `Discussed with Dr. Maya on ${new Date().toLocaleDateString()}: "${transcript}"`
        };
      }
      
      // Activate Condition Explainer if Dr. Maya mentions explaining conditions
      else if ((lowerResponse.includes('explain') && lowerResponse.includes('condition')) ||
               lowerResponse.includes('condition explainer') ||
               (lowerResponse.includes('understand') && (lowerResponse.includes('diagnosis') || lowerResponse.includes('condition'))) ||
               (toolData?.triggeredTools?.some(t => t.component === 'ConditionExplainer'))) {
        
        activatedToolName = 'ConditionExplainer';
        
        // Extract condition information
        const userMessage = transcript.toLowerCase();
        extractedToolData = {
          conditionName: extractConditionFromText(userMessage),
          description: `Dr. Maya is explaining this condition based on your questions.`,
          nextSteps: ['Discuss with your healthcare provider', 'Keep tracking symptoms', 'Follow up as recommended']
        };
      }
      
      // Update tool states
      if (activatedToolName) {
        setActiveTool(activatedToolName);
        setToolData(extractedToolData);
        enhancedResponse += `\n\n🔧 *Activating ${activatedToolName.replace(/([A-Z])/g, ' $1').trim()}...*`;
      }
      
      // Add general tool suggestions if no specific tool was activated
      if (!activatedToolName && toolData?.availableTools && toolData.availableTools.length > 0) {
        const toolNames = toolData.availableTools.map(t => t.name).join(', ');
        enhancedResponse += `\n\nℹ️ Available tools: ${toolNames}`;
      }
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: enhancedResponse,
        timestamp: new Date().toLocaleTimeString(),
        latency_ms: aiLatency,
        activatedTool: activatedToolName,
        toolData: extractedToolData
      };
      setChatMessages(prev => [...prev, assistantMessage]);

      await generateSpeechWithCartesia(result.response); // Use original response for TTS (shorter)
      
    } catch (error) {
      console.error('❌ AI error:', error);
      setIsProcessing(false);
      setDrMayaEmotion('calm');
    }
  };

  // Generate speech with Cartesia
  const generateSpeechWithCartesia = async (text: string) => {
    try {
      console.log('🎵 Generating speech with Dr. Maya...');
      setIsSpeaking(true);
      setDrMayaEmotion('speaking');
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/cartesia-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });

      if (!response.ok) {
        throw new Error(`TTS failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.audio_base64) {
        console.log(`✅ TTS completed in ${result.latency_ms}ms`);
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
      
      // CRITICAL: Fix chipmunk voice with sample rate compensation
      const cartesiaSampleRate = 22050;
      const contextSampleRate = audioContextRef.current.sampleRate;
      let playbackRate = cartesiaSampleRate / contextSampleRate * 0.95;
      
      console.log(`🎵 Playback rate: ${playbackRate} for natural voice`);
      
      source.playbackRate.value = playbackRate;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        setIsProcessing(false);
        setDrMayaEmotion('calm');
        console.log('✅ Dr. Maya finished speaking');
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
      console.log('🚀 Initializing voice system...');
      
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
        content: '✅ Dr. Maya is ready to help you',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages([systemMessage]);

      setTimeout(() => {
        generateSpeechWithCartesia(`Hello ${patientContext.patientName}, I'm Dr. Maya. I'm here to support you through every step of your journey. How can I help you today?`);
      }, 1000);

    } catch (error) {
      console.error('❌ Connection error:', error);
      setConnectionError('Failed to initialize voice experience');
    }
  }, [initializeSpeechRecognition, checkTTSService, patientContext.patientName]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (!isConnected || isProcessing || isSpeaking) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      setDrMayaEmotion('listening');
      recognitionRef.current?.start();
    }
  }, [isConnected, isListening, isProcessing, isSpeaking]);

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  // Helper functions to extract data from user speech
  const extractSymptomFromText = (text: string): string => {
    const symptomKeywords = [
      'headache', 'pain', 'fatigue', 'nausea', 'dizziness', 'fever', 'cough', 
      'shortness of breath', 'chest pain', 'stomach pain', 'back pain',
      'joint pain', 'muscle pain', 'weakness', 'tingling', 'numbness'
    ];
    
    for (const symptom of symptomKeywords) {
      if (text.includes(symptom)) {
        return symptom;
      }
    }
    
    // Look for "I have..." or "I feel..." patterns
    const patterns = [
      /i have (\w+)/gi,
      /i feel (\w+)/gi,
      /experiencing (\w+)/gi,
      /(\w+) symptoms?/gi
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || 'unspecified symptom';
      }
    }
    
    return 'symptoms mentioned in conversation';
  };

  const extractSeverityFromText = (text: string): number => {
    if (text.includes('severe') || text.includes('terrible') || text.includes('unbearable')) return 8;
    if (text.includes('bad') || text.includes('intense') || text.includes('strong')) return 6;
    if (text.includes('moderate') || text.includes('noticeable')) return 5;
    if (text.includes('mild') || text.includes('slight') || text.includes('little')) return 3;
    return 5; // Default moderate
  };

  const extractConditionFromText = (text: string): string => {
    const conditions = [
      'diabetes', 'hypertension', 'arthritis', 'asthma', 'cancer', 
      'depression', 'anxiety', 'migraine', 'fibromyalgia', 'lupus'
    ];
    
    for (const condition of conditions) {
      if (text.includes(condition)) {
        return condition;
      }
    }
    
    // Look for "diagnosed with..." patterns
    const diagnosisPattern = /diagnosed with (\w+)/gi;
    const match = text.match(diagnosisPattern);
    if (match) {
      return match[1];
    }
    
    return 'condition discussed';
  };

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
      default:
        return baseStyle;
    }
  };

  // Get voice button style
  const getVoiceButtonStyle = () => {
    if (isListening) return { ...styles.voiceButton, ...styles.voiceButtonListening };
    if (isProcessing) return { ...styles.voiceButton, ...styles.voiceButtonProcessing };
    if (isSpeaking) return { ...styles.voiceButton, ...styles.voiceButtonSpeaking };
    return { ...styles.voiceButton, ...styles.voiceButtonReady };
  };

  // CONNECTION SCREEN
  if (!isConnected) {
    return (
      <div style={styles.fullScreen}>
        <div style={styles.header}>
          <button 
            style={styles.exitButton}
            onClick={onNavigateHome}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#F3F4F6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            ← Exit
          </button>
          <div style={styles.headerTitle}>
            <h1 style={styles.titleText}>Dr. Maya Voice Chat</h1>
          </div>
          <div style={{ width: '80px' }} />
        </div>

        <div style={{ ...styles.content, ...styles.connectionScreen }}>
          <div style={styles.connectionContent}>
            <div style={styles.connectionAvatar}>
              👩‍⚕️
            </div>
            
            <h2 style={styles.connectionTitle}>
              Voice Chat with Dr. Maya
            </h2>
            
            <p style={styles.connectionSubtitle}>
              Talk naturally with Dr. Maya using voice chat.<br/>
              Ultra-fast AI responses with natural voice.
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
              Start Voice Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN VOICE INTERFACE
  return (
    <div style={styles.fullScreen}>
      {/* Header */}
      <div style={styles.header}>
        <button 
          style={styles.exitButton}
          onClick={() => { setIsConnected(false); onNavigateHome?.(); }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#F3F4F6';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          ← Exit Voice Chat
        </button>
        
        <div style={styles.headerTitle}>
          <div>
            <h1 style={styles.titleText}>Dr. Maya</h1>
            <p style={styles.subtitle}>Voice Assistant</p>
          </div>
        </div>
        
        {currentLatency && (
          <div style={styles.latencyBadge}>
            {currentLatency}ms
          </div>
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
        <div 
          ref={chatContainerRef}
          style={styles.chatContainer}
        >
          {chatMessages.map((message) => {
            const bubbleStyle = message.type === 'user' ? styles.userBubble :
                              message.type === 'system' ? styles.systemBubble : styles.assistantBubble;
            
            return (
              <div key={message.id}>
                <div 
                  style={{ ...styles.messageBubble, ...bubbleStyle }}
                >
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
                  <div>
                    {message.activatedTool === 'SymptomTracker' && (
                      <SymptomTracker 
                        isActive={true}
                        autoFillData={message.toolData}
                        onDataUpdate={(data) => console.log('Symptom data:', data)}
                      />
                    )}
                    {message.activatedTool === 'ConditionExplainer' && (
                      <ConditionExplainer 
                        isActive={true}
                        autoFillData={message.toolData}
                        onDataUpdate={(data) => console.log('Condition data:', data)}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Show currently active tool */}
          {activeTool && (
            <div>
              {activeTool === 'SymptomTracker' && (
                <SymptomTracker 
                  isActive={true}
                  autoFillData={toolData}
                  onDataUpdate={(data) => console.log('Current symptom data:', data)}
                />
              )}
              {activeTool === 'ConditionExplainer' && (
                <ConditionExplainer 
                  isActive={true}
                  autoFillData={toolData}
                  onDataUpdate={(data) => console.log('Current condition data:', data)}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Voice Controls - ALWAYS VISIBLE */}
      <div style={styles.controlsContainer}>
        <button
          style={getVoiceButtonStyle()}
          onClick={toggleListening}
          disabled={isProcessing || isSpeaking}
          onMouseOver={(e) => {
            if (!isProcessing && !isSpeaking && !isListening) {
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
           isProcessing ? '🧠' : 
           isSpeaking ? '🔊' : '🎤'}
        </button>
        
        <p style={styles.statusText}>
          {isListening ? "Listening..." :
           isProcessing ? "Dr. Maya is thinking..." :
           isSpeaking ? "Dr. Maya is speaking..." :
           "Tap to talk"}
        </p>
        
        <div style={styles.techSpecs}>
          <span style={styles.techSpec}>⚡ Web Speech</span>
          <span style={styles.techSpec}>🧠 Groq AI</span>
          <span style={styles.techSpec}>🎵 Cartesia Voice</span>
        </div>
      </div>
    </div>
  );
}