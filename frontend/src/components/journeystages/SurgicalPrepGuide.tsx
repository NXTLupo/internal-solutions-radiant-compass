import React from 'react';

interface SurgicalPrepGuideProps {
  isActive?: boolean;
  autoFillData?: any;
}

export const SurgicalPrepGuide: React.FC<SurgicalPrepGuideProps> = ({ isActive, autoFillData }) => {
  return (
    <div style={{
      padding: '24px',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
    }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: '#111827',
        margin: '0 0 16px 0'
      }}>
        Surgical Prep Guide
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#6B7280',
        margin: 0
      }}>
        This is a placeholder for the Surgical Prep Guide tool. It will be implemented soon.
      </p>
    </div>
  );
};
