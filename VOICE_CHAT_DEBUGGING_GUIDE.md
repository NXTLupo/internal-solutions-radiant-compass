# Voice Chat Debugging Guide: Dr. Maya TTS Implementation

## Executive Summary

This document chronicles the extensive debugging process required to implement functional voice chat for Dr. Maya in the RadiantCompass healthcare AI platform. The primary challenge was resolving persistent "chipmunk voice" issues where text-to-speech output was playing at extremely high speeds, making it unintelligible.

**Root Cause**: Multiple JavaScript component versions running simultaneously due to browser caching, causing conflicting audio processing pipelines.

**Final Solution**: Complete component cleanup, Docker cache clearing, and forced rebuilds to eliminate JavaScript bundle conflicts.

---

## Timeline of Issues and Solutions

### Initial Problem Statement
- **Issue**: MediaRecorder API compatibility issues causing `NotSupportedError: Failed to execute 'start' on 'MediaRecorder'`
- **User Feedback**: "nope - 🎤 Initializing Web Audio API system..." with 9970ms latency
- **Secondary Issue**: AI thinking tags being spoken aloud instead of just the response

### Phase 1: MediaRecorder Replacement (Initially Successful)
**Implementation**: Replaced MediaRecorder with Web Audio API ScriptProcessor
```typescript
// OLD: MediaRecorder approach (failed in many browsers)
const mediaRecorder = new MediaRecorder(stream);

// NEW: Web Audio API approach (universal compatibility)
const audioContext = new AudioContext();
const source = audioContext.createMediaStreamSource(stream);
const processor = audioContext.createScriptProcessor(4096, 1, 1);
```

**Result**: Solved browser compatibility but introduced new audio processing complexities.

### Phase 2: Ultra-Low Latency Pipeline Development
**Challenge**: User demanded <500ms total latency but system was taking 10+ seconds
**Implementation**: 
- Web Speech API for instant browser-based STT (0ms)
- Groq Llama-3.3 for ultra-fast AI processing (~150ms)  
- Cartesia Sonic for human TTS (~100ms)

**API Integration Issues Encountered**:

1. **Cartesia Speed Parameter Rejection**
   ```json
   // FAILED: Invalid speed parameter
   {
     "speed": 1.2  // API returned 422 "error in speed"
   }
   
   // FIXED: Use string-based speed
   {
     "speed": "slow"  // Accepted by API
   }
   ```

2. **Audio Format Compatibility**
   ```python
   # FAILED: Raw PCM data caused Whisper failures
   audio_data = audio_buffer.tobytes()
   
   # FIXED: Proper WAV format with headers
   wav_data = create_wav_file(audio_buffer, sample_rate=16000)
   ```

### Phase 3: The Persistent Chipmunk Voice Mystery

**Symptoms**: Despite implementing slow TTS settings, voice output remained extremely fast and high-pitched.

**Debugging Attempts**:

1. **Speed Parameter Verification**
   ```python
   # Tried multiple speed variations
   "speed": "slow"
   "speed": 0.5  
   "speed": "normal"
   # All still resulted in chipmunk voice
   ```

2. **Audio Playback Rate Investigation**
   ```javascript
   // Suspected audio playback rate issues
   source.playbackRate.value = 0.5;  // No effect
   
   // Verified audio sample rate
   console.log('Sample rate:', audioBuffer.sampleRate);  // Correct: 22050Hz
   ```

3. **API Response Analysis**
   ```javascript
   // Logs showed correct API responses
   console.log('✅ Cartesia Sonic TTS completed in 2113ms');
   console.log('🎵 Generating speech with Dr. Maya (Joan - warm female voice)...');
   ```

### Phase 4: The Root Cause Discovery

**Critical Insight**: Browser console logs revealed multiple JavaScript bundles running simultaneously:

```javascript
// OLD COMPONENT (cached): index-X7xdGhur.js
🔌 Connecting to Cartesia WebSocket...
WebSocket connection to 'wss://api.cartesia.ai/tts/websocket' failed:
❌ Cartesia WebSocket error
❌ Cartesia WebSocket not connected
// Falls back to fast OpenAI TTS = CHIPMUNK VOICE

// NEW COMPONENT (working): index-C0N6NGFU.js  
🎵 Generating speech with Dr. Maya (Joan - warm female voice)...
✅ Cartesia Sonic TTS completed in 2113.6ms
// Correct Joan voice implementation
```

**The Problem**: Both old `DrMayaVoiceChat` and new `UltraFastVoiceChat` components were active simultaneously due to:
- Browser JavaScript bundle caching
- Docker build cache retaining old component references
- Component import conflicts in dashboard files

---

## Technical Architecture Issues

### Component Conflict Analysis

1. **File Structure Problems**
   ```
   frontend/src/components/
   ├── DrMayaVoiceChat.tsx           # OLD - causing conflicts
   ├── DrMayaWorkingVoiceChat.tsx.bak # BACKUP - also causing conflicts  
   └── UltraFastVoiceChat.tsx        # NEW - correct implementation
   ```

2. **Import Inconsistencies**
   ```typescript
   // RadiantDashboard.tsx and PatientDashboard.tsx had mixed imports
   import { DrMayaVoiceChat } from './DrMayaVoiceChat';     // CACHED
   import { UltraFastVoiceChat } from './UltraFastVoiceChat'; // CORRECT
   ```

3. **Docker Cache Issues**
   ```dockerfile
   # Docker was caching old JavaScript builds
   COPY frontend/src ./src     # Included deleted components in cache
   RUN npm run build          # Built both old and new components
   ```

### Audio Processing Pipeline Conflicts

The dual component issue created competing audio pipelines:

**Pipeline A (Old Component)**:
```
Web Speech API → Groq AI → Cartesia WebSocket (FAILED) → OpenAI TTS Fallback (FAST) → Chipmunk Voice
```

**Pipeline B (New Component)**:
```  
Web Speech API → Groq AI → Cartesia REST API (SUCCESS) → Joan Voice (SLOW) → Correct Output
```

Both pipelines ran simultaneously, with the fast fallback dominating the audio output.

---

## Solution Implementation

### Step 1: Complete Component Cleanup
```bash
# Remove all old voice chat components
rm frontend/src/components/DrMayaVoiceChat.tsx
rm frontend/src/components/DrMayaWorkingVoiceChat.tsx.bak

# Verify no remaining references
grep -r "DrMayaVoiceChat" frontend/src/  # Should return nothing
```

### Step 2: Force Docker Cache Clear
```bash
# Stop all services
docker compose -f compose.yml down

# Remove cached images
docker image rm internal-solutions-radiant-compass-frontend
docker image rm internal-solutions-radiant-compass-coagent-runtime

# Clear build cache
docker builder prune -f

# Rebuild with no cache
docker compose -f compose.yml build --no-cache frontend coagent-runtime
```

### Step 3: Verify Clean Implementation
```typescript
// Ensure only UltraFastVoiceChat is imported
// RadiantDashboard.tsx
import { UltraFastVoiceChat } from './UltraFastVoiceChat';

// PatientDashboard.tsx  
import { UltraFastVoiceChat } from './UltraFastVoiceChat';
```

### Step 4: Test Verification
After implementation, verify single component operation:
```javascript
// Should only see NEW component logs
🚀 Initializing ultra-fast voice system...
🎵 Generating speech with Dr. Maya (Joan - warm female voice)...
✅ Cartesia Sonic TTS completed in 2113ms
```

---

## Lessons Learned for Future Development

### 1. Browser Caching Is Aggressive
- Always force hard refreshes when testing component changes
- Use `docker build --no-cache` for significant component modifications
- Implement cache-busting strategies in development

### 2. Component Naming Conflicts
- Completely remove old components before implementing new ones
- Use globally unique component names to avoid conflicts
- Implement proper component lifecycle management

### 3. Audio API Complexity
- Web Audio API requires careful buffer management
- Audio format compatibility varies between TTS providers
- Always implement proper error handling for audio playback

### 4. Multi-Service Debugging
- Use structured logging to track audio pipeline flow
- Implement unique identifiers for concurrent requests
- Monitor both client-side and server-side audio processing

### 5. API Integration Pitfalls
- TTS APIs have varying parameter formats (string vs numeric speeds)
- WebSocket vs REST API reliability differs significantly
- Always implement graceful fallbacks for TTS services

---

## Debugging Checklist for Future Voice Issues

### When Voice Chat Isn't Working:

1. **Check Component Conflicts**
   ```bash
   # Verify only one voice chat component exists
   find frontend/src -name "*Voice*" -type f
   
   # Check for cached components
   grep -r "VoiceChat" frontend/src/
   ```

2. **Verify Docker Cache State**
   ```bash
   # Force clean rebuild if components changed
   docker compose down
   docker image rm $(docker images -q internal-solutions-radiant-compass*)
   docker compose build --no-cache
   ```

3. **Monitor Browser Console**
   ```javascript
   // Look for multiple component initialization
   // Should see only ONE of these patterns:
   "🚀 Initializing ultra-fast voice system..."
   
   // NOT multiple competing systems
   ```

4. **Test Audio Pipeline**
   ```bash
   # Test TTS endpoint directly
   curl -X POST "http://localhost:9500/api/v1/ultra-low-latency/cartesia-tts" \
        -H "Content-Type: application/json" \
        -d '{"text": "Hello, this is a test"}'
   ```

5. **Verify API Keys**
   ```bash
   # Ensure all required keys are set
   echo $CARTESIA_API_KEY
   echo $OPENAI_API_KEY
   echo $GROQ_API_KEY
   ```

### When Voice Is Too Fast (Chipmunk):

1. **Check for Component Multiplicity**
   - Multiple components = competing audio pipelines
   - Fast fallbacks override slow primary TTS
   
2. **Verify TTS Provider**
   ```javascript
   // Should see Cartesia, not OpenAI fallback
   console.log('Using Cartesia Joan voice with slow speed');
   ```

3. **Audio Playback Verification**
   ```javascript
   // Verify audio buffer sample rate
   console.log('Audio sample rate:', audioBuffer.sampleRate);
   // Should be 22050 for Cartesia, 16000 for OpenAI
   ```

---

## Component Architecture Recommendations

### Preferred Voice Chat Architecture:
```
UltraFastVoiceChat.tsx (Single Source of Truth)
├── Web Speech API (STT)
├── Groq Llama-3.3 (AI Processing)  
├── Cartesia Sonic (Primary TTS)
└── OpenAI TTS (Fallback Only)
```

### Anti-Patterns to Avoid:
- Multiple voice chat components in same application
- Mixed MediaRecorder and Web Audio API implementations
- Concurrent WebSocket and REST TTS connections
- Cached component references after major changes

### Development Best Practices:
- Use single voice chat component per application
- Implement comprehensive error logging
- Force cache clears after component architecture changes
- Test voice output manually after any TTS modifications
- Use unique component names to prevent conflicts

---

## Emergency Recovery Procedures

### If Voice Chat Completely Breaks:

1. **Restore from Known Working State**
   ```bash
   git checkout f4ebe4e  # Last known working commit
   docker compose down && docker compose build --no-cache
   ```

2. **Component Reset**
   ```bash
   # Remove all voice components
   rm frontend/src/components/*Voice*.tsx
   
   # Restore only UltraFastVoiceChat
   git checkout HEAD -- frontend/src/components/UltraFastVoiceChat.tsx
   ```

3. **Full System Reset**
   ```bash
   # Nuclear option: complete rebuild
   docker system prune -a
   git clean -fdx
   docker compose build --no-cache
   ```

This debugging experience demonstrates the complexity of modern web audio implementations and the critical importance of proper component lifecycle management in React applications with Docker containerization.