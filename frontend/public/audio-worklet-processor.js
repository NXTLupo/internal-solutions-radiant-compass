// Ultra-low latency audio worklet processor for voice capture
// Replaces deprecated ScriptProcessorNode with modern AudioWorkletNode

class VoiceRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.isRecording = false;
    this.bufferSize = 0;
    this.maxBufferSize = 48000 * 10; // 10 seconds at 48kHz max
    
    // Listen for commands from main thread
    this.port.onmessage = (e) => {
      if (e.data.command === 'start') {
        this.isRecording = true;
        this.bufferSize = 0;
        console.log('🎤 AudioWorklet started recording');
      } else if (e.data.command === 'stop') {
        this.isRecording = false;
        console.log('🔇 AudioWorklet stopped recording');
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    
    if (input && input.length > 0 && this.isRecording) {
      const inputData = input[0]; // Mono channel
      
      if (inputData && inputData.length > 0) {
        // Check buffer size limit
        if (this.bufferSize + inputData.length <= this.maxBufferSize) {
          // Send audio data to main thread for collection
          this.port.postMessage({
            type: 'audioData',
            audioData: inputData.slice(), // Copy the data
            sampleRate: sampleRate,
            timestamp: currentTime
          });
          
          this.bufferSize += inputData.length;
        } else {
          // Stop recording if buffer is full
          this.isRecording = false;
          this.port.postMessage({
            type: 'bufferFull',
            message: 'Audio buffer full, stopping recording'
          });
        }
      }
    }

    // Keep the processor alive
    return true;
  }
}

registerProcessor('voice-recorder-processor', VoiceRecorderProcessor);