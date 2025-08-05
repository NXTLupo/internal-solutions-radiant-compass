import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/premium-design-system.css';

interface PremiumVoiceExperienceProps {
  onExit: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  latency_ms?: number;
  emotion?: 'calm' | 'concerned' | 'encouraging' | 'celebratory';
}

// === PREMIUM WALL-TO-WALL VOICE EXPERIENCE ===
export const PremiumVoiceExperience: React.FC<PremiumVoiceExperienceProps> = ({ onExit }) => {
  // === CORE STATES ===
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentLatency, setCurrentLatency] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [drMayaEmotion, setDrMayaEmotion] = useState<'calm' | 'listening' | 'thinking' | 'speaking'>('calm');

  // === REFS ===
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // === PATIENT CONTEXT ===
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

  // === SPEECH RECOGNITION SETUP ===
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
      console.log('🎤 Premium Voice: Speech recognized:', transcript);
      
      setIsListening(false);
      setIsProcessing(true);
      setDrMayaEmotion('thinking');
      
      // Add user message with premium styling
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: transcript,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, userMessage]);

      // Process with ultra-fast AI
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

  // === TTS SERVICE CHECK ===
  const checkTTSService = useCallback(async () => {
    try {
      console.log('🔍 Checking premium TTS service...');
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/health');
      const result = await response.json();
      
      if (result.cartesia_available) {
        console.log('✅ Premium Cartesia TTS service available');
        return true;
      } else {
        console.log('⚠️ Cartesia not available, using premium fallback');
        return true;
      }
    } catch (error) {
      console.error('❌ Premium TTS service check error:', error);
      return false;
    }
  }, []);

  // === AI PROCESSING ===
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
            journeyStage: patientContext.journeyStage,
            emotionalState: patientContext.emotionalState,
            patient_id: patientContext.patient_id,
            userRole: patientContext.userRole,
            interface: 'premium_voice_experience'
          }
        })
      });

      const result = await response.json();
      const aiLatency = Date.now() - startTime;
      setCurrentLatency(aiLatency);
      
      console.log(`⚡ Premium AI response: ${aiLatency}ms`);
      
      // Determine Dr. Maya's emotional response
      const emotion = result.response.includes('concern') ? 'concerned' :
                    result.response.includes('great') || result.response.includes('wonderful') ? 'encouraging' :
                    result.response.includes('celebrate') ? 'celebratory' : 'calm';
      
      // Add AI message with emotion
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date().toLocaleTimeString(),
        latency_ms: aiLatency,
        emotion
      };
      setChatMessages(prev => [...prev, assistantMessage]);

      // Generate premium speech
      await generateSpeechWithCartesia(result.response);
      
    } catch (error) {
      console.error('❌ Premium AI error:', error);
      setIsProcessing(false);
      setDrMayaEmotion('calm');
    }
  };

  // === PREMIUM TTS ===
  const generateSpeechWithCartesia = async (text: string) => {
    try {
      console.log('🎵 Premium Dr. Maya voice generation...');
      setIsSpeaking(true);
      setDrMayaEmotion('speaking');
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/cartesia-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });

      if (!response.ok) {
        throw new Error(`Premium TTS failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.audio_base64) {
        console.log(`✅ Premium voice completed in ${result.latency_ms}ms`);
        await playTTSAudio(result.audio_base64);
      }
      
    } catch (error) {
      console.error('❌ Premium TTS error:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
      setDrMayaEmotion('calm');
    }
  };

  // === PREMIUM AUDIO PLAYBACK ===
  const playTTSAudio = async (audioBase64: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      // Decode base64 audio
      const binaryString = atob(audioBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decode and play audio with premium quality settings
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer.slice(0));
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      // CRITICAL: Premium voice fix for natural speech
      const cartesiaSampleRate = 22050;
      const contextSampleRate = audioContextRef.current.sampleRate;
      let playbackRate = cartesiaSampleRate / contextSampleRate * 0.95; // Premium natural pace
      
      console.log(`🎵 Premium playback rate: ${playbackRate} for natural Dr. Maya voice`);
      
      source.playbackRate.value = playbackRate;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        setIsProcessing(false);
        setDrMayaEmotion('calm');
        console.log('✅ Premium Dr. Maya finished speaking');
      };
      
      source.start();
      
    } catch (error) {
      console.error('❌ Premium audio playback error:', error);
      setIsSpeaking(false);
      setIsProcessing(false);
      setDrMayaEmotion('calm');
    }
  };

  // === CONNECTION SETUP ===
  const connectToVoiceSystem = useCallback(async () => {
    try {
      setConnectionError(null);
      console.log('🚀 Initializing premium voice experience...');
      
      const speechReady = initializeSpeechRecognition();
      if (!speechReady) return;

      const ttsReady = await checkTTSService();
      if (!ttsReady) {
        setConnectionError('Premium voice service not available');
        return;
      }

      setIsConnected(true);
      
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: '🌟 Premium voice experience ready - Dr. Maya is here for you',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages([systemMessage]);

      // Premium auto-greeting
      setTimeout(() => {
        generateSpeechWithCartesia(`Hello ${patientContext.patientName}, I'm Dr. Maya. I'm here to support you through every step of your journey. How can I help you today?`);
      }, 1000);

    } catch (error) {
      console.error('❌ Premium connection error:', error);
      setConnectionError('Failed to initialize premium voice experience');
    }
  }, [initializeSpeechRecognition, checkTTSService, patientContext.patientName]);

  // === VOICE CONTROL ===
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

  // === CLEANUP ===
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  // === DR. MAYA AVATAR ANIMATION ===
  const getDrMayaAvatar = () => {
    const baseStyle = {
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      transition: 'all var(--transition-smooth)',
      boxShadow: 'var(--shadow-prominent)',
      border: '4px solid var(--neutral-white)'
    };

    switch (drMayaEmotion) {
      case 'listening':
        return (
          <div style={{
            ...baseStyle,
            background: 'linear-gradient(135deg, #4A90E2, #64B5F6)',
            boxShadow: '0 0 64px rgba(74, 144, 226, 0.4)',
            animation: 'pulse 1.5s infinite'
          }}>
            <img 
              src="/dr-maya-professional.jpg" 
              alt="Dr. Maya - Listening" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        );
      case 'thinking':
        return (
          <div style={{
            ...baseStyle,
            background: 'linear-gradient(135deg, #9013FE, #BA68C8)',
            boxShadow: '0 0 64px rgba(144, 19, 254, 0.4)',
            transform: 'scale(1.05)'
          }}>
            <img 
              src="/dr-maya-professional.jpg" 
              alt="Dr. Maya - Thinking" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        );
      case 'speaking':
        return (
          <div style={{
            ...baseStyle,
            background: 'linear-gradient(135deg, #FF6B35, #FF8A65)',
            boxShadow: '0 0 64px rgba(255, 107, 53, 0.4)',
            animation: 'pulse 0.8s infinite'
          }}>
            <img 
              src="/dr-maya-professional.jpg" 
              alt="Dr. Maya - Speaking" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        );
      default:
        return (
          <div style={{
            ...baseStyle,
            background: 'linear-gradient(135deg, #7ED321, #8BC34A)',
            boxShadow: '0 0 32px rgba(126, 211, 33, 0.3)'
          }}>
            <img 
              src="/dr-maya-professional.jpg" 
              alt="Dr. Maya - Ready" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        );
    }
  };

  // === CONNECTION SCREEN ===
  if (!isConnected) {
    return (
      <div className="voice-chat-fullscreen">
        {/* Premium Header */}
        <div className="voice-header-premium">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button 
              onClick={onExit}
              className="btn-ghost"
              style={{ fontSize: '24px', padding: 'var(--space-small)' }}
            >
              ← Exit
            </button>
            <h1 style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--neutral-900)' }}>
              Premium Dr. Maya Experience
            </h1>
            <div style={{ width: '80px' }} />
          </div>
        </div>

        {/* Connection Content */}
        <div className="voice-content-premium" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <div style={{ marginBottom: 'var(--space-hero)' }}>
              <div style={{
                width: '200px',
                height: '200px',
                margin: '0 auto',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-radiant), var(--primary-hope))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '72px',
                boxShadow: 'var(--shadow-dramatic)',
                animation: 'pulse 2s infinite'
              }}>
                👩‍⚕️
              </div>
            </div>
            
            <h2 style={{ 
              fontSize: 'var(--font-hero)', 
              fontWeight: 800, 
              color: 'var(--neutral-white)',
              marginBottom: 'var(--space-medium)',
              textShadow: '0 2px 16px rgba(0,0,0,0.3)'
            }}>
              Premium Voice Experience
            </h2>
            
            <p style={{ 
              fontSize: 'var(--font-subtitle)', 
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 'var(--space-large)',
              textShadow: '0 1px 8px rgba(0,0,0,0.2)'
            }}>
              Wall-to-wall immersive conversation with Dr. Maya<br/>
              Ultra-fast AI • Natural voice • Life-saving guidance
            </p>

            {connectionError && (
              <div style={{
                background: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                borderRadius: 'var(--radius-medium)',
                padding: 'var(--space-medium)',
                marginBottom: 'var(--space-large)',
                backdropFilter: 'var(--blur-medium)'
              }}>
                <p style={{ color: '#FFCDD2' }}>{connectionError}</p>
              </div>
            )}

            <button
              onClick={connectToVoiceSystem}
              className="btn-premium"
              style={{
                fontSize: 'var(--font-subtitle)',
                padding: 'var(--space-medium) var(--space-hero)',
                background: 'linear-gradient(135deg, var(--neutral-white), var(--neutral-100))',
                color: 'var(--neutral-900)',
                boxShadow: 'var(--shadow-prominent)',
                fontWeight: 700
              }}
            >
              Begin Premium Experience
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === MAIN PREMIUM VOICE INTERFACE ===
  return (
    <div className="voice-chat-fullscreen">
      {/* Premium Header */}
      <div className="voice-header-premium">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => { setIsConnected(false); onExit(); }}
            className="btn-ghost"
            style={{ fontSize: '18px', fontWeight: 600 }}
          >
            ← Exit Voice Experience
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-medium)' }}>
            <div>
              <h1 style={{ fontSize: 'var(--font-title)', fontWeight: 700, color: 'var(--neutral-900)' }}>
                Dr. Maya Premium
              </h1>
              <p style={{ fontSize: 'var(--font-caption)', color: 'var(--neutral-600)' }}>
                Ultra-fast • Natural voice • Always caring
              </p>
            </div>
          </div>
          
          {currentLatency && (
            <div style={{
              background: 'var(--success)',
              color: 'white',
              padding: 'var(--space-micro) var(--space-small)',
              borderRadius: 'var(--radius-medium)',
              fontSize: 'var(--font-caption)',
              fontWeight: 600
            }}>
              {currentLatency}ms
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area - Wall to Wall */}
      <div className="voice-content-premium">
        {/* Dr. Maya Avatar - Central Focus */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: 'var(--space-large)',
          zIndex: 10 
        }}>
          {getDrMayaAvatar()}
        </div>

        {/* Chat Messages - Generous Spacing */}
        <div 
          ref={chatContainerRef}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-medium)',
            overflowY: 'auto',
            padding: '0 var(--space-large)',
            marginBottom: 'var(--space-large)'
          }}
        >
          {chatMessages.map((message) => (
            <div 
              key={message.id} 
              className={`chat-bubble-premium ${message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
              style={{
                alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                boxShadow: message.emotion === 'encouraging' ? '0 8px 32px rgba(126, 211, 33, 0.2)' :
                          message.emotion === 'concerned' ? '0 8px 32px rgba(255, 152, 0, 0.2)' :
                          'var(--shadow-soft)'
              }}
            >
              <p style={{ 
                margin: 0, 
                fontSize: 'var(--font-subtitle)',
                lineHeight: 1.6,
                fontWeight: message.type === 'system' ? 600 : 400
              }}>
                {message.content}
              </p>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginTop: 'var(--space-small)',
                opacity: 0.7
              }}>
                <span style={{ fontSize: 'var(--font-caption)' }}>
                  {message.timestamp}
                </span>
                {message.latency_ms && (
                  <span style={{ 
                    fontSize: 'var(--font-caption)',
                    background: 'rgba(255,255,255,0.2)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-small)'
                  }}>
                    {message.latency_ms}ms
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Voice Controls */}
      <div className="voice-controls-premium">
        <button
          onClick={toggleListening}
          className="voice-button-premium"
          disabled={isProcessing || isSpeaking}
          style={{
            background: isListening 
              ? 'linear-gradient(135deg, #F44336, #EF5350)' 
              : isProcessing 
              ? 'linear-gradient(135deg, #FF9800, #FFB74D)'
              : isSpeaking 
              ? 'linear-gradient(135deg, #4CAF50, #66BB6A)'
              : 'linear-gradient(135deg, var(--primary-radiant), #FF8A65)',
            color: 'white',
            fontSize: '48px',
            cursor: isProcessing || isSpeaking ? 'not-allowed' : 'pointer',
            transform: isListening ? 'scale(1.1)' : 'scale(1)',
            animation: isListening ? 'pulse 1s infinite' : 'none'
          }}
          aria-label={
            isListening ? "Listening - Click to stop" :
            isProcessing ? "Processing your message..." :
            isSpeaking ? "Dr. Maya is speaking..." :
            "Click to start talking"
          }
        >
          {isListening ? '🔴' : 
           isProcessing ? '🧠' : 
           isSpeaking ? '🔊' : '🎤'}
        </button>
        
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ 
            fontSize: 'var(--font-subtitle)', 
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 'var(--space-small)',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)'
          }}>
            {isListening ? "🔴 Listening carefully..." :
             isProcessing ? "🧠 Dr. Maya is thinking..." :
             isSpeaking ? "🔊 Dr. Maya is speaking..." :
             "Ready to listen - Click to talk"}
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 'var(--space-medium)',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              fontSize: 'var(--font-caption)', 
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.1)',
              padding: 'var(--space-micro) var(--space-small)',
              borderRadius: 'var(--radius-medium)',
              backdropFilter: 'var(--blur-subtle)'
            }}>
              ⚡ Web Speech (0ms)
            </span>
            <span style={{ 
              fontSize: 'var(--font-caption)', 
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.1)',
              padding: 'var(--space-micro) var(--space-small)',
              borderRadius: 'var(--radius-medium)',
              backdropFilter: 'var(--blur-subtle)'
            }}>
              🧠 Groq AI (&lt;200ms)
            </span>
            <span style={{ 
              fontSize: 'var(--font-caption)', 
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.1)',
              padding: 'var(--space-micro) var(--space-small)',
              borderRadius: 'var(--radius-medium)',
              backdropFilter: 'var(--blur-subtle)'
            }}>
              🎵 Cartesia (&lt;100ms)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};