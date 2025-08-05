import React, { useState, useEffect } from 'react';

interface ConditionData {
  id: string;
  conditionName: string;
  description: string;
  commonSymptoms: string[];
  possibleCauses: string[];
  nextSteps: string[];
  riskFactors: string[];
  whenToSeekHelp: string[];
  timestamp: string;
}

interface ConditionExplainerProps {
  isActive?: boolean;
  onDataUpdate?: (data: ConditionData) => void;
  autoFillData?: Partial<ConditionData>;
}

export const ConditionExplainer: React.FC<ConditionExplainerProps> = ({ 
  isActive = false, 
  onDataUpdate,
  autoFillData 
}) => {
  const [conditionData, setConditionData] = useState<ConditionData>({
    id: Date.now().toString(),
    conditionName: '',
    description: '',
    commonSymptoms: [],
    possibleCauses: [],
    nextSteps: [],
    riskFactors: [],
    whenToSeekHelp: [],
    timestamp: new Date().toISOString()
  });

  // Auto-fill when Dr. Maya provides data
  useEffect(() => {
    if (autoFillData) {
      setConditionData(prev => ({ ...prev, ...autoFillData }));
    }
  }, [autoFillData]);

  // Notify parent when data changes
  useEffect(() => {
    onDataUpdate?.(conditionData);
  }, [conditionData, onDataUpdate]);

  const handleFieldUpdate = (field: keyof ConditionData, value: string | string[]) => {
    setConditionData(prev => ({ ...prev, [field]: value }));
  };

  const InfoSection: React.FC<{ 
    title: string; 
    icon: string; 
    items: string[]; 
    isLoading?: boolean;
  }> = ({ title, icon, items, isLoading = false }) => (
    <div style={{
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        marginBottom: '12px' 
      }}>
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: 600, 
          color: '#1F2937',
          margin: 0 
        }}>
          {title}
        </h4>
      </div>
      
      {isLoading ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#6B7280',
          fontSize: '14px'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #E5E7EB',
            borderTopColor: '#3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Dr. Maya is researching this for you...
        </div>
      ) : items.length > 0 ? (
        <ul style={{
          margin: 0,
          paddingLeft: '20px',
          color: '#374151'
        }}>
          {items.map((item, index) => (
            <li key={index} style={{ 
              marginBottom: '4px',
              fontSize: '14px',
              lineHeight: 1.5
            }}>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ 
          color: '#9CA3AF',
          fontSize: '14px',
          margin: 0,
          fontStyle: 'italic'
        }}>
          Information will appear here as Dr. Maya explains...
        </p>
      )}
    </div>
  );

  if (!isActive) return null;

  return (
    <div style={{
      background: '#FFFFFF',
      border: '2px solid #10B981',
      borderRadius: '16px',
      padding: '24px',
      margin: '16px 0',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)',
      animation: 'slideIn 0.3s ease-out',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          fontSize: '24px',
          background: '#10B981',
          borderRadius: '8px',
          padding: '8px',
          color: 'white' 
        }}>
          🔍
        </div>
        <div>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#111827',
            margin: 0 
          }}>
            Condition Explainer
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#6B7280',
            margin: 0 
          }}>
            Dr. Maya is explaining your condition
          </p>
        </div>
      </div>

      {/* Condition Name Input */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '14px', 
          fontWeight: 500, 
          color: '#374151',
          marginBottom: '4px' 
        }}>
          Condition or Diagnosis
        </label>
        <input
          type="text"
          value={conditionData.conditionName}
          onChange={(e) => handleFieldUpdate('conditionName', e.target.value)}
          placeholder="e.g., Type 2 Diabetes, Rheumatoid Arthritis..."
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
          onFocus={(e) => e.target.style.borderColor = '#10B981'}
          onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
        />
      </div>

      {/* Main Description */}
      {conditionData.description && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            color: '#15803D',
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 What is {conditionData.conditionName}?
          </h4>
          <p style={{ 
            color: '#166534',
            fontSize: '14px',
            margin: 0,
            lineHeight: 1.6
          }}>
            {conditionData.description}
          </p>
        </div>
      )}

      {/* Information Sections */}
      <InfoSection 
        title="Common Symptoms" 
        icon="🎯" 
        items={conditionData.commonSymptoms}
        isLoading={conditionData.conditionName && conditionData.commonSymptoms.length === 0}
      />

      <InfoSection 
        title="Possible Causes" 
        icon="🔗" 
        items={conditionData.possibleCauses}
        isLoading={conditionData.conditionName && conditionData.possibleCauses.length === 0}
      />

      <InfoSection 
        title="Next Steps" 
        icon="📋" 
        items={conditionData.nextSteps}
        isLoading={conditionData.conditionName && conditionData.nextSteps.length === 0}
      />

      <InfoSection 
        title="When to Seek Immediate Help" 
        icon="🚨" 
        items={conditionData.whenToSeekHelp}
        isLoading={conditionData.conditionName && conditionData.whenToSeekHelp.length === 0}
      />

      <div style={{ 
        marginTop: '20px',
        padding: '12px',
        background: '#FEF3C7',
        borderRadius: '8px',
        border: '1px solid #FCD34D'
      }}>
        <p style={{ 
          fontSize: '14px', 
          color: '#92400E',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>⚠️</span>
          This information is for educational purposes. Always consult your healthcare provider for medical advice.
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};