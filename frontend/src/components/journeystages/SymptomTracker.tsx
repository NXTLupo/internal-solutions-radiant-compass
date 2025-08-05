import React, { useState, useEffect } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { AIGuidanceDisplay } from '../AIGuidanceDisplay';

export const SymptomTracker: React.FC = () => {
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  // AI Action to set the symptom field with autonomous mode indication
  useCopilotAction({
    name: "setSymptomField",
    description: "Set the symptom description in the Symptom Tracker tool autonomously.",
    parameters: [{ name: "symptom", type: "string", description: "The symptom to be logged." }],
    handler: async ({ symptom }) => {
      setSymptom(symptom);
      setIsAutonomousMode(true);
      setLastUpdate(`Updated symptom: ${symptom}`);
      console.log(`[SymptomTracker] AI autonomously set symptom: ${symptom}`);
    },
  });

  // AI Action to set the severity slider with autonomous indication
  useCopilotAction({
    name: "setSeverityField",
    description: "Set the severity level in the Symptom Tracker tool autonomously.",
    parameters: [{ name: "severity", type: "number", description: "The severity of the symptom from 1 to 10." }],
    handler: async ({ severity }) => {
      setSeverity(severity);
      setIsAutonomousMode(true);
      setLastUpdate(`Updated severity: ${severity}/10`);
      console.log(`[SymptomTracker] AI autonomously set severity: ${severity}`);
    },
  });

  // AI Action to update both symptom and severity simultaneously (for real-time updates)
  useCopilotAction({
    name: "updateSymptomData",
    description: "Update both symptom and severity data simultaneously in real-time.",
    parameters: [
      { name: "symptom", type: "string", description: "The symptom to be logged." },
      { name: "severity", type: "number", description: "The severity of the symptom from 1 to 10." }
    ],
    handler: async ({ symptom, severity }) => {
      setSymptom(symptom);
      setSeverity(severity);
      setIsAutonomousMode(true);
      setLastUpdate(`Real-time update: ${symptom} (${severity}/10)`);
      console.log(`[SymptomTracker] AI real-time update: ${symptom} at severity ${severity}`);
    },
  });

  // AI Action to submit the form autonomously
  useCopilotAction({
    name: "submitSymptomLog",
    description: "Submit the symptom log form autonomously.",
    handler: async () => {
      // In a real application, this would send the data to the backend.
      console.log(`[SymptomTracker] AI autonomously submitting: Symptom: ${symptom}, Severity: ${severity}`);
      setIsSubmitted(true);
      setLastUpdate('Symptom logged successfully');
    },
  });

  // AI Action to enter autonomous mode for real-time symptom tracking
  useCopilotAction({
    name: "enableAutonomousSymptomTracking",
    description: "Enable autonomous mode for real-time symptom tracking based on patient conversation.",
    handler: async () => {
      setIsAutonomousMode(true);
      setLastUpdate('Autonomous tracking enabled');
      console.log(`[SymptomTracker] Autonomous mode enabled for real-time tracking`);
    },
  });

  if (isSubmitted) {
    return (
      <div style={{ padding: '20px', border: '1px solid #4CAF50', borderRadius: '8px', background: '#F1F8E9', textAlign: 'center' }}>
        <AIGuidanceDisplay />
        <h3 style={{ marginTop: 0, color: '#2E7D32' }}>Symptom Logged Successfully!</h3>
        <p>Your symptom has been saved to your private health journal.</p>
        <button onClick={() => setIsSubmitted(false)} style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#4CAF50', color: 'white', cursor: 'pointer' }}>
          Log Another Symptom
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #E5E7EB', borderRadius: '8px', background: '#fff' }}>
      <AIGuidanceDisplay />
      
      {/* Autonomous Mode Indicator */}
      {isAutonomousMode && (
        <div style={{ 
          marginTop: '12px', 
          padding: '8px 12px', 
          background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)', 
          borderRadius: '6px', 
          color: 'white', 
          fontSize: '14px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: '#FFF',
            animation: 'pulse 2s infinite'
          }} />
          <span>🤖 AI is filling this out for you</span>
        </div>
      )}

      {/* Last Update Indicator */}
      {lastUpdate && (
        <div style={{
          marginTop: '8px',
          padding: '6px 10px',
          background: '#F3F4F6',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#6B7280',
          fontStyle: 'italic'
        }}>
          {lastUpdate}
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#111827' }}>
          {isAutonomousMode ? 'Symptom Being Tracked Autonomously' : 'Log a New Symptom'}
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="symptom" style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 500 }}>
            Symptom {isAutonomousMode && <span style={{ color: '#10B981', fontSize: '12px' }}>● AI Controlled</span>}
          </label>
          <input
            type="text"
            id="symptom"
            value={symptom}
            onChange={(e) => !isAutonomousMode && setSymptom(e.target.value)}
            placeholder={isAutonomousMode ? "AI is filling this based on your conversation..." : "e.g., 'Headache', 'Fatigue'"}
            style={{ 
              width: '100%', 
              padding: '10px', 
              borderRadius: '6px', 
              border: isAutonomousMode ? '2px solid #10B981' : '1px solid #D1D5DB',
              background: isAutonomousMode ? '#F0FDF4' : '#fff',
              cursor: isAutonomousMode ? 'not-allowed' : 'text'
            }}
            readOnly={isAutonomousMode}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="severity" style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 500 }}>
            Severity (1-10) {isAutonomousMode && <span style={{ color: '#10B981', fontSize: '12px' }}>● AI Controlled</span>}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="range"
              id="severity"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => !isAutonomousMode && setSeverity(parseInt(e.target.value))}
              style={{ 
                flexGrow: 1,
                cursor: isAutonomousMode ? 'not-allowed' : 'pointer',
                opacity: isAutonomousMode ? 0.7 : 1
              }}
              disabled={isAutonomousMode}
            />
            <span style={{ 
              fontWeight: 600, 
              color: isAutonomousMode ? '#10B981' : '#111827', 
              minWidth: '20px', 
              textAlign: 'center',
              background: isAutonomousMode ? '#F0FDF4' : 'transparent',
              padding: '4px 8px',
              borderRadius: '4px',
              border: isAutonomousMode ? '1px solid #10B981' : 'none'
            }}>
              {severity}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsSubmitted(true)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: 'none',
            background: '#3B82F6',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#2563EB'}
          onMouseOut={(e) => e.currentTarget.style.background = '#3B82F6'}
        >
          Log Symptom
        </button>
      </div>
    </div>
  );
};