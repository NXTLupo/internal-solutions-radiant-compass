import React from 'react';

interface RecoveryTrackerProps {
  isActive?: boolean;
  autoFillData?: any;
}

export const RecoveryTracker: React.FC<RecoveryTrackerProps> = ({ isActive, autoFillData }) => {
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
        Recovery Tracker
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#6B7280',
        margin: 0
      }}>
        This is a placeholder for the Recovery Tracker tool. It will be implemented soon.
      </p>
    </div>
  );
};
