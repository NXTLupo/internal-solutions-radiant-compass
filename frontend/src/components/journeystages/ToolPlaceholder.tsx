import React from 'react';

interface ToolPlaceholderProps {
  isActive?: boolean;
  autoFillData?: {
    toolName?: string;
    [key: string]: any;
  };
}

export const ToolPlaceholder: React.FC<ToolPlaceholderProps> = ({ autoFillData }) => {
  const toolName = autoFillData?.toolName || 'This tool';

  return (
    <div style={{
      padding: '24px',
      border: '1px dashed #D1D5DB',
      borderRadius: '12px',
      backgroundColor: '#F9FAFB',
      textAlign: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
    }}>
      <div style={{
        fontSize: '24px',
        marginBottom: '12px'
      }}>
        🛠️
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: '#111827',
        margin: '0 0 8px 0'
      }}>
        {toolName}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#6B7280',
        margin: 0
      }}>
        This tool is currently under development and will be available soon.
      </p>
      {autoFillData?.demonstrationMode && (
         <div style={{
            marginTop: '16px',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: '#FEFCE8',
            color: '#A16207',
            fontSize: '12px',
            fontWeight: 500,
            display: 'inline-block'
         }}>
            🤖 Dr. Maya is acknowledging this tool's placeholder.
         </div>
      )}
    </div>
  );
};
