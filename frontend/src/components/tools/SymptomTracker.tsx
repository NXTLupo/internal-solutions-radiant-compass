import React, { useState, useEffect } from 'react';

interface SymptomEntry {
  id: string;
  symptom: string;
  severity: number;
  frequency: string;
  duration: string;
  triggers: string;
  notes: string;
  timestamp: string;
}

interface SymptomTrackerProps {
  isActive?: boolean;
  onDataUpdate?: (data: SymptomEntry) => void;
  autoFillData?: Partial<SymptomEntry>;
}

export const SymptomTracker: React.FC<SymptomTrackerProps> = ({ 
  isActive = false, 
  onDataUpdate,
  autoFillData 
}) => {
  const [currentEntry, setCurrentEntry] = useState<SymptomEntry>({
    id: Date.now().toString(),
    symptom: '',
    severity: 5,
    frequency: '',
    duration: '',
    triggers: '',
    notes: '',
    timestamp: new Date().toISOString()
  });

  // Auto-fill when Dr. Maya provides data
  useEffect(() => {
    if (autoFillData) {
      setCurrentEntry(prev => ({ ...prev, ...autoFillData }));
    }
  }, [autoFillData]);

  // Notify parent when data changes
  useEffect(() => {
    onDataUpdate?.(currentEntry);
  }, [currentEntry, onDataUpdate]);

  const handleFieldUpdate = (field: keyof SymptomEntry, value: string | number) => {
    setCurrentEntry(prev => ({ ...prev, [field]: value }));
  };

  const severityColors = [
    '#10B981', '#22C55E', '#84CC16', '#EAB308', '#F97316', 
    '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'
  ];

  if (!isActive) return null;

  return (
    <div style={{
      background: '#FFFFFF',
      border: '2px solid #3B82F6',
      borderRadius: '16px',
      padding: '24px',
      margin: '16px 0',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.15)',
      animation: 'slideIn 0.3s ease-out',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '20px' 
      }}>
        <div style={{ 
          fontSize: '24px',
          background: '#3B82F6',
          borderRadius: '8px',
          padding: '8px',
          color: 'white' 
        }}>
          📊
        </div>
        <div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#111827',
            margin: 0 
          }}>
            Symptom Tracker
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#6B7280',
            margin: 0 
          }}>
            Dr. Maya is helping you track this symptom
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {/* Symptom Name */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '4px' 
          }}>
            What symptom are you experiencing?
          </label>
          <input
            type="text"
            value={currentEntry.symptom}
            onChange={(e) => handleFieldUpdate('symptom', e.target.value)}
            placeholder="e.g., headache, fatigue, nausea..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
          />
        </div>

        {/* Severity Scale */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '8px' 
          }}>
            Severity Level: {currentEntry.severity}/10
          </label>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Mild</span>
            <input
              type="range"
              min="1"
              max="10"
              value={currentEntry.severity}
              onChange={(e) => handleFieldUpdate('severity', parseInt(e.target.value))}
              style={{
                flex: 1,
                height: '6px',
                background: `linear-gradient(to right, ${severityColors[currentEntry.severity - 1]} 0%, ${severityColors[currentEntry.severity - 1]} ${currentEntry.severity * 10}%, #E5E7EB ${currentEntry.severity * 10}%, #E5E7EB 100%)`,
                borderRadius: '3px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '12px', color: '#6B7280' }}>Severe</span>
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '4px' 
          }}>
            How often does this occur?
          </label>
          <select
            value={currentEntry.frequency}
            onChange={(e) => handleFieldUpdate('frequency', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              background: 'white',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Select frequency...</option>
            <option value="constant">Constant</option>
            <option value="several-times-day">Several times a day</option>
            <option value="once-daily">Once daily</option>
            <option value="few-times-week">Few times a week</option>
            <option value="once-week">Once a week</option>
            <option value="rarely">Rarely</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '4px' 
          }}>
            How long does it typically last?
          </label>
          <input
            type="text"
            value={currentEntry.duration}
            onChange={(e) => handleFieldUpdate('duration', e.target.value)}
            placeholder="e.g., 30 minutes, 2 hours, all day..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '14px', 
            fontWeight: 500, 
            color: '#374151',
            marginBottom: '4px' 
          }}>
            Additional notes
          </label>
          <textarea
            value={currentEntry.notes}
            onChange={(e) => handleFieldUpdate('notes', e.target.value)}
            placeholder="Any additional details about this symptom..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      <div style={{ 
        marginTop: '20px',
        padding: '12px',
        background: '#F0F9FF',
        borderRadius: '8px',
        border: '1px solid #BAE6FD'
      }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#0369A1',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💡</span>
          Dr. Maya is filling this out based on your conversation. You can edit any details.
        </p>
      </div>
    </div>
  );
};