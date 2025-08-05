
import React, { useState } from 'react';
import { RadiantLogo } from './RadiantLogo';
import { UltraFastVoiceChat } from './UltraFastVoiceChat';

export const PremiumPatientDashboard: React.FC = () => {
  const [showVoiceChat, setShowVoiceChat] = useState(false);

  if (showVoiceChat) {
    return <UltraFastVoiceChat onNavigateHome={() => setShowVoiceChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full bg-surface border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <RadiantLogo size="md" />
          <p className="text-secondary">Sarah Johnson</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto py-12 px-6 text-center">
        <img 
          src="/dr-maya-professional.jpg" 
          alt="Dr. Maya" 
          className="w-48 h-48 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
        />
        <h1 className="text-4xl font-bold text-text-primary mb-2">Welcome, Sarah</h1>
        <p className="text-lg text-text-secondary mb-8">Dr. Maya is here to help you.</p>
        
        <button 
          onClick={() => setShowVoiceChat(true)}
          className="px-12 py-4 bg-accent text-white font-semibold rounded-full shadow-interactive hover:opacity-90 transition-opacity text-lg"
        >
          Start Voice Chat
        </button>
      </main>
    </div>
  );
};
