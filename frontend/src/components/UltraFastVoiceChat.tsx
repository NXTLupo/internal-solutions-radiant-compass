import React, { useState, useRef, useEffect, useCallback } from 'react';

interface UltraFastVoiceChatProps {
  onNavigateHome?: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  latency_ms?: number;
}

export function UltraFastVoiceChat({ onNavigateHome }: UltraFastVoiceChatProps = {}) {
  // Core states
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentLatency, setCurrentLatency] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Audio refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Patient context
  const [patientContext] = useState({
    patientName: "Alex Johnson",
    emotionalState: "calm",
    journeyStage: "awareness",
    patient_id: "patient_alex_johnson",
    userRole: "patient"
  });

  // Initialize ultra-fast speech recognition (Web Speech API)
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setConnectionError('Speech recognition not supported in this browser');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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
      
      // Add user message
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
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return true;
  }, []);

  // Check backend TTS service availability
  const checkTTSService = useCallback(async () => {
    try {
      console.log('🔍 Checking backend TTS service...');
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/health');
      const result = await response.json();
      
      if (result.cartesia_available) {
        console.log('✅ Cartesia TTS service available via backend');
        return true;
      } else {
        console.log('⚠️ Cartesia not available, will use OpenAI TTS fallback');
        return true; // Still proceed - backend has fallback
      }
    } catch (error) {
      console.error('❌ TTS service check error:', error);
      return false;
    }
  }, []);

  // Process with Groq AI (ultra-fast)
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
            userRole: patientContext.userRole
          }
        })
      });

      const result = await response.json();
      const aiLatency = Date.now() - startTime;
      
      console.log(`⚡ Groq AI response: ${aiLatency}ms`);
      
      // Add AI message
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.response,
        timestamp: new Date().toLocaleTimeString(),
        latency_ms: aiLatency
      };
      setChatMessages(prev => [...prev, assistantMessage]);

      // Generate speech with Cartesia
      await generateSpeechWithCartesia(result.response);
      
    } catch (error) {
      console.error('❌ Groq AI error:', error);
      setIsProcessing(false);
    }
  };

  // Generate speech with Cartesia Sonic (ultra-human voice)
  const generateSpeechWithCartesia = async (text: string) => {
    try {
      console.log('🎵 Generating speech with Dr. Maya (Joan - warm female voice)...');
      setIsSpeaking(true);
      
      const response = await fetch('http://localhost:9500/api/v1/ultra-low-latency/cartesia-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });

      if (!response.ok) {
        throw new Error(`Cartesia TTS failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.audio_base64) {
        console.log(`✅ Cartesia Sonic TTS completed in ${result.latency_ms}ms`);
        await playTTSAudio(result.audio_base64);
      }
      
    } catch (error) {
      console.error('❌ Cartesia TTS error:', error);
      setIsProcessing(false);
      setIsSpeaking(false);
    }
  };

  // Play TTS audio from base64
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
      
      // Decode and play audio
      const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer.slice(0));
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      
      // CRITICAL FIX: Handle sample rate mismatch that causes chipmunk voice
      // Cartesia generates at 22050Hz, but Web Audio API resamples to context rate causing chipmunk voice
      const cartesiaSampleRate = 22050; // Cartesia Sonic output rate
      const actualSampleRate = audioBuffer.sampleRate;
      const contextSampleRate = audioContextRef.current.sampleRate;
      
      console.log(`🔍 Audio Debug - Cartesia: ${cartesiaSampleRate}Hz, Decoded: ${actualSampleRate}Hz, Context: ${contextSampleRate}Hz`);
      
      // FORCE playback rate compensation - Web Audio API resampling causes chipmunk voice
      // Even though actualSampleRate matches contextSampleRate, we need to compensate for the original Cartesia rate
      let playbackRate = cartesiaSampleRate / contextSampleRate;
      console.log(`⚙️ FORCING playback rate to ${playbackRate} (${cartesiaSampleRate}/${contextSampleRate}) to fix Cartesia resampling chipmunk voice`);
      
      // Additional safety adjustment for natural speech
      playbackRate = playbackRate * 0.95; // Fine-tune for most natural speech pace
      
      source.playbackRate.value = playbackRate;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        setIsProcessing(false);
        console.log('✅ Dr. Maya finished speaking');
      };
      
      source.start();
      
    } catch (error) {
      console.error('❌ TTS audio playback error:', error);
      setIsSpeaking(false);
      setIsProcessing(false);
    }
  };

  // Connect to ultra-fast voice system
  const connectToVoiceSystem = useCallback(async () => {
    try {
      setConnectionError(null);
      
      console.log('🚀 Initializing ultra-fast voice system...');
      
      // Initialize Web Speech API (instant STT)
      const speechReady = initializeSpeechRecognition();
      if (!speechReady) return;

      // Check backend TTS service
      const ttsReady = await checkTTSService();
      if (!ttsReady) {
        setConnectionError('Backend TTS service not available');
        return;
      }

      setIsConnected(true);
      
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: '🚀 Ultra-fast voice system ready (Web Speech API + Groq + Cartesia)',
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages([systemMessage]);

      // Auto-greet
      setTimeout(() => {
        generateSpeechWithCartesia(`Hello ${patientContext.patientName}, I'm Dr. Maya. How are you feeling today?`);
      }, 1000);

    } catch (error) {
      console.error('❌ Connection error:', error);
      setConnectionError('Failed to initialize ultra-fast voice system');
    }
  }, [initializeSpeechRecognition, checkTTSService, patientContext.patientName]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (!isConnected || isProcessing || isSpeaking) return;

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
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

  // Connection interface
  if (!isConnected) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-orange-200">
          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <button onClick={onNavigateHome} className="p-2 rounded-full hover:bg-orange-100 text-orange-600">←</button>
            )}
            <h1 className="text-xl font-semibold text-gray-900">Ultra-Fast Dr. Maya</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">⚡</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Ultra-Fast Voice Chat v2.0</h2>
            <p className="text-gray-600 mb-8">
              ⚡ Web Speech API + Groq Llama-3.3 + Cartesia Sonic (&lt;400ms total) 🎵
            </p>

            {connectionError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{connectionError}</p>
              </div>
            )}

            <button
              onClick={connectToVoiceSystem}
              className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold text-lg hover:bg-orange-600 transition-colors"
            >
              Connect Ultra-Fast System
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main interface
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-orange-200">
        <div className="flex items-center gap-3">
          <button onClick={() => { setIsConnected(false); onNavigateHome?.(); }} className="p-2 rounded-full hover:bg-orange-100 text-orange-600">←</button>
          <div className="relative">
            <img src="/dr-maya-professional.jpg" alt="Dr. Maya" className="w-12 h-12 rounded-full border-2 border-orange-300" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dr. Maya Ultra-Fast</h1>
            <p className="text-sm text-gray-600">Web Speech + Groq + Cartesia</p>
          </div>
        </div>
        
        {currentLatency && (
          <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
            {currentLatency}ms
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div key={message.id} className={`flex items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' ? 'bg-blue-100 text-blue-600' : 
              message.type === 'system' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {message.type === 'user' ? '👤' : message.type === 'system' ? '⚡' : '👩‍⚕️'}
            </div>
            
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.type === 'user' ? 'bg-blue-500 text-white' :
              message.type === 'system' ? 'bg-green-500 text-white' : 'bg-white text-gray-900 shadow-sm border border-orange-100'
            }`}>
              <p className="text-sm">{message.content}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className={`text-xs opacity-70 ${message.type === 'user' || message.type === 'system' ? 'text-white' : 'text-gray-500'}`}>
                  {message.timestamp}
                </p>
                {message.latency_ms && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">{message.latency_ms}ms</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Control */}
      <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-orange-200">
        <div className="text-center">
          <button
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full font-bold text-white text-lg transition-all duration-200 ${
              isListening ? 'bg-red-500 scale-110 shadow-2xl ring-8 ring-red-200 animate-pulse' :
              isProcessing ? 'bg-yellow-500 cursor-not-allowed' :
              isSpeaking ? 'bg-green-500 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-lg'
            }`}
            disabled={isProcessing || isSpeaking}
          >
            {isListening ? '🔴' : isProcessing ? '⚡' : isSpeaking ? '🔊' : '🎤'}
          </button>
          
          <p className="mt-4 text-sm text-gray-600">
            {isListening ? "🔴 Listening with Web Speech API..." :
             isProcessing ? "⚡ Processing with Groq ultra-fast..." :
             isSpeaking ? "🔊 Dr. Maya speaking with Cartesia voice..." :
             "Click to talk instantly"}
          </p>
          
          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
            <span>⚡ Web Speech API (0ms)</span>
            <span>🧠 Groq (&lt;200ms)</span>
            <span>🎵 Cartesia (&lt;100ms)</span>
          </div>
        </div>
      </div>
    </div>
  );
}