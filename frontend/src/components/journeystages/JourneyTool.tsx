import React from 'react';

// Import the real tool components
import { SymptomTracker } from './SymptomTracker';
import { AppointmentPrepGuide } from './AppointmentPrepGuide';
// ... import other real tools as they are built

// Create a mapping from component names to components
const toolRegistry: { [key: string]: React.FC } = {
  SymptomTracker,
  AppointmentPrepGuide,
  // ... register other real tools here
};

interface JourneyToolProps {
  componentName: string;
}

const JourneyTool: React.FC<JourneyToolProps> = ({ componentName }) => {
  const ToolComponent = toolRegistry[componentName];

  if (!ToolComponent) {
    // Fallback to a generic placeholder if the component isn't registered
    return (
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9f9' }}>
        <h3 style={{ marginTop: 0 }}>{componentName}</h3>
        <p>This is a placeholder for the {componentName} tool. The full implementation is pending.</p>
      </div>
    );
  }

  return <ToolComponent />;
};

export default JourneyTool;
