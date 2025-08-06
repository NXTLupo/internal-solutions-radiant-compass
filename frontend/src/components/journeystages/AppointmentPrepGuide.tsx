import React, { useState, useEffect } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { AIGuidanceDisplay } from '../AIGuidanceDisplay';

interface AppointmentPrepGuideProps {
  isActive?: boolean;
  autoFillData?: any;
  onDataUpdate?: (data: any) => void;
}

export const AppointmentPrepGuide: React.FC<AppointmentPrepGuideProps> = ({ 
  isActive = false, 
  autoFillData,
  onDataUpdate 
}) => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [concerns, setConcerns] = useState('');
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);

  useEffect(() => {
    if (autoFillData?.demonstrationMode) {
      setIsAutonomousMode(true);
      
      // Use contextual data from conversation
      if (autoFillData?.primaryConcern) {
        setConcerns(autoFillData.primaryConcern);
        console.log('[AppointmentPrepGuide] Using contextual concern from conversation');
      }
      
      if (autoFillData?.suggestedQuestions && autoFillData.suggestedQuestions.length > 0) {
        setQuestions(autoFillData.suggestedQuestions);
        console.log('[AppointmentPrepGuide] Using contextual questions from conversation');
      }
      
      // Notify parent of updates
      if (onDataUpdate) {
        onDataUpdate({
          concerns: autoFillData?.primaryConcern || concerns,
          questions: autoFillData?.suggestedQuestions || questions,
          activeFromConversation: autoFillData?.activeFromConversation || false
        });
      }
    }
  }, [autoFillData, onDataUpdate]);

  useCopilotAction({
    name: "addQuestionToList",
    description: "Add a question to the list for the doctor.",
    parameters: [{ name: "question", type: "string" }],
    handler: async ({ question }) => {
      setQuestions(prev => [...prev, question]);
    },
  });

  useCopilotAction({
    name: "setPrimaryConcern",
    description: "Set the primary concern to discuss with the doctor.",
    parameters: [{ name: "concern", type: "string" }],
    handler: async ({ concern }) => {
      setConcerns(concern);
    },
  });

  return (
    <div style={{ 
      padding: '20px', 
      border: isAutonomousMode ? '2px solid #3B82F6' : '1px solid #E5E7EB', 
      borderRadius: '12px', 
      background: isAutonomousMode ? 'linear-gradient(135deg, #EBF8FF 0%, #F0F9FF 100%)' : '#fff',
      boxShadow: isAutonomousMode ? '0 4px 12px rgba(59, 130, 246, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {isAutonomousMode && (
        <div style={{
          backgroundColor: '#DBEAFE',
          border: '1px solid #3B82F6',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🤖</span>
            <div>
              <div style={{ fontWeight: 600, color: '#1E40AF', fontSize: '14px' }}>Dr. Maya is actively preparing your appointment</div>
              <div style={{ fontSize: '12px', color: '#3730A3' }}>
                I've analyzed our conversation and prepared questions based on your concerns
              </div>
            </div>
          </div>
        </div>
      )}
      
      <AIGuidanceDisplay />
      <div style={{ marginTop: '20px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#111827' }}>Appointment Preparation Guide</h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 500 }}>
            My Primary Concern
          </label>
          <textarea
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="e.g., 'The persistent fatigue I've been feeling for the last 3 weeks.'"
            style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
          />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: 500 }}>
            Questions for My Doctor
          </label>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
            {questions.map((q, i) => (
              <li key={i} style={{ marginBottom: '8px' }}>{q}</li>
            ))}
            {questions.length === 0 && <p style={{ color: '#9CA3AF', margin: 0 }}>Dr. Maya will help you generate questions.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};
