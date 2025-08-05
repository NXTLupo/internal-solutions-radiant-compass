import React from 'react';

interface ElegantVoiceInterfaceProps {
  isListening: boolean;
  onListen: () => void;
}

export const ElegantVoiceInterface: React.FC<ElegantVoiceInterfaceProps> = ({ isListening, onListen }) => {
  return (
    <div 
      className="w-[400px] h-[600px] bg-surface rounded-lg shadow-card flex flex-col items-center justify-center p-8"
      style={{ borderRadius: 'var(--radius-lg)' }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <img src="/dr-maya-professional.jpg" alt="Dr. Maya" className="w-24 h-24 rounded-full mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Dr. Maya</h2>
        <p className="text-secondary">AI Health Companion</p>
      </div>

      {/* Chat Bubble */}
      <div className="bg-background p-4 rounded-md mb-8">
        <p className="text-center">Hello, how can I assist you today?</p>
      </div>

      {/* Listen Button */}
      <button 
        onClick={onListen}
        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-orange-500' : 'bg-orange-400'}`}
        style={{ 
          background: isListening ? 'var(--color-primary-orange)' : '#FDBA74',
          boxShadow: isListening ? '0 0 20px rgba(217, 119, 6, 0.5)' : 'none'
        }}
      >
        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
          <path d="M5.5 4.5a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8a.5.5 0 01-.5-.5zM10 18a5 5 0 005-5h-1a4 4 0 01-8 0H5a5 5 0 005 5z" />
        </svg>
      </button>
      <p className="text-muted mt-4">Tap to speak</p>
    </div>
  );
};
