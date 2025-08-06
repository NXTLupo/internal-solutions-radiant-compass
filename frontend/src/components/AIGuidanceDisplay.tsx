import React from 'react';
import { useAppState } from './AppStateProvider';

export const AIGuidanceDisplay: React.FC = () => {
  const { guidance } = useAppState();

  if (!guidance) {
    return null;
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #D1D5DB', 
      borderRadius: '8px', 
      background: 'linear-gradient(to right, #EFF6FF, #E0F2FE)', 
      marginBottom: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      color: '#1F2937',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '24px', marginRight: '12px', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))' }}>👩‍⚕️</span>
        <h4 style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#111827' }}>Dr. Maya's Guidance</h4>
      </div>
      <p style={{ margin: 0, lineHeight: 1.6, fontSize: '15px' }}>{guidance}</p>
    </div>
  );
};
