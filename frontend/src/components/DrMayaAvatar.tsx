import React, { useState, useEffect } from 'react';

/**
 * Clean Dr. Maya Avatar Component
 * Matches the clean medical interface inspiration
 * Uses real professional photo of Dr. Maya
 * Simple, elegant styling without excessive effects
 */

type AvatarMode = 
  | 'welcoming'
  | 'listening' 
  | 'speaking'
  | 'concerned'
  | 'encouraging'
  | 'celebrating'
  | 'crisis';

type JourneyStage = 
  | "awareness_orientation"
  | "organize_plan" 
  | "explore_decide"
  | "coordinate_commit"
  | "undergo_treatment"
  | "early_recovery"
  | "surveillance_rehabilitation"
  | "long_term_living";

interface DrMayaAvatarProps {
  mode?: AvatarMode;
  stage?: JourneyStage;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  message?: string;
  onAvatarClick?: () => void;
}

const sizeConfig = {
  sm: { avatar: '80px', status: '20px', text: 'var(--text-lg)' },
  md: { avatar: '120px', status: '24px', text: 'var(--text-xl)' },
  lg: { avatar: '160px', status: '32px', text: 'var(--text-2xl)' },
  xl: { avatar: '240px', status: '40px', text: 'var(--text-4xl)' }
};

const modeConfig: Record<AvatarMode, { 
  statusColor: string; 
  borderColor: string; 
  greeting: string;
  expression: string;
}> = {
  welcoming: {
    statusColor: 'bg-green-500',
    borderColor: 'border-green-200',
    greeting: 'Hello, how can I assist you today?',
    expression: 'Warm, professional smile with attentive eyes'
  },
  listening: {
    statusColor: 'bg-blue-500 animate-pulse',
    borderColor: 'border-blue-200',
    greeting: 'I\'m listening...',
    expression: 'Active listening pose with focused attention'
  },
  speaking: {
    statusColor: 'bg-teal-500 animate-pulse',
    borderColor: 'border-teal-200', 
    greeting: 'Let me help you with that...',
    expression: 'Engaged speaking expression with gentle gestures'
  },
  concerned: {
    statusColor: 'bg-gray-500',
    borderColor: 'border-gray-200',
    greeting: 'I understand this is concerning...',
    expression: 'Empathetic concern with supportive presence'
  },
  encouraging: {
    statusColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    greeting: 'You\'re doing great!',
    expression: 'Encouraging smile with confident posture'
  },
  celebrating: {
    statusColor: 'bg-purple-500',
    borderColor: 'border-purple-200',
    greeting: 'Wonderful progress!',
    expression: 'Joyful celebration with bright smile'
  },
  crisis: {
    statusColor: 'bg-red-500',
    borderColor: 'border-red-200',
    greeting: 'I\'m here with you. You\'re not alone.',
    expression: 'Deep concern and immediate availability'
  }
};

const stageContexts: Record<JourneyStage, {
  description: string;
  specialization: string;
}> = {
  awareness_orientation: {
    description: 'Symptom Interpretation Specialist',
    specialization: 'Helping you understand what your body is telling you'
  },
  organize_plan: {
    description: 'Healthcare Navigator',
    specialization: 'Organizing your medical journey and information'
  },
  explore_decide: {
    description: 'Decision Support Advisor',
    specialization: 'Guiding you through treatment options and choices'
  },
  coordinate_commit: {
    description: 'Care Coordinator',
    specialization: 'Managing logistics and treatment planning'
  },
  undergo_treatment: {
    description: 'Treatment Companion',
    specialization: 'Supporting you through active treatment'
  },
  early_recovery: {
    description: 'Recovery Coach',
    specialization: 'Guiding your healing and adjustment process'
  },
  surveillance_rehabilitation: {
    description: 'Wellness Monitor',
    specialization: 'Long-term health surveillance and optimization'
  },
  long_term_living: {
    description: 'Mentorship Guide',
    specialization: 'Supporting your thriving and helping others'
  }
};

export const DrMayaAvatar: React.FC<DrMayaAvatarProps> = ({
  mode = 'welcoming',
  stage = 'awareness_orientation',
  size = 'lg',
  showStatus = true,
  message,
  onAvatarClick
}) => {
  const [currentMessage, setCurrentMessage] = useState(message || modeConfig[mode].greeting);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = sizeConfig[size];
  const modeSettings = modeConfig[mode];
  const stageContext = stageContexts[stage];

  // Update message when mode or custom message changes
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
    } else {
      setCurrentMessage(modeSettings.greeting);
    }
  }, [mode, message, modeSettings.greeting]);

  // Animation trigger for mode changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [mode]);

  return (
    <div 
      className="flex flex-col items-center" 
      style={{ gap: 'var(--space-8)' }}
    >
      {/* Clean Avatar Container */}
      <div 
        style={{
          position: 'relative',
          width: sizeClasses.avatar,
          height: sizeClasses.avatar,
          cursor: onAvatarClick ? 'pointer' : 'default',
          transition: 'all var(--transition-base)',
          transform: isAnimating ? 'scale(1.05)' : 'scale(1)'
        }}
        onClick={onAvatarClick}
        onMouseEnter={(e) => {
          if (onAvatarClick) {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (onAvatarClick && !isAnimating) {
            e.currentTarget.style.transform = 'scale(1)';
          }
        }}
      >
        {/* Main Avatar - Clean styling */}
        <div 
          style={{
            width: sizeClasses.avatar,
            height: sizeClasses.avatar,
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#FFFFFF',
            border: '4px solid var(--color-medical)',
            boxShadow: 'var(--shadow-2xl)',
            overflow: 'hidden'
          }}
        >
          {/* Real Dr. Maya professional photo */}
          <img 
            src="/dr-maya-professional.jpg" 
            alt="Dr. Maya - Healthcare AI Assistant"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              // Fallback to clean icon if image doesn't load
              e.currentTarget.style.display = 'none';
              const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextElement) {
                nextElement.style.display = 'flex';
              }
            }}
          />
          <div 
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#FFFFFF',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div 
                style={{
                  fontSize: size === 'xl' ? '80px' : size === 'lg' ? '60px' : '40px',
                  marginBottom: 'var(--space-2)'
                }}
              >
                👩‍⚕️
              </div>
              <div 
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--color-neutral-700)'
                }}
              >
                Dr. Maya
              </div>
            </div>
          </div>
        </div>

        {/* Clean Status Indicator */}
        {showStatus && (
          <div 
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: sizeClasses.status,
              height: sizeClasses.status,
              borderRadius: 'var(--radius-full)',
              border: '3px solid white',
              boxShadow: 'var(--shadow-md)',
              backgroundColor: mode === 'listening' ? 'var(--color-primary)' :
                              mode === 'speaking' ? 'var(--color-medical)' :
                              mode === 'crisis' ? 'var(--color-error)' :
                              'var(--color-success)'
            }}
          />
        )}

        {/* Simple Interaction Pulse */}
        {(mode === 'listening' || mode === 'speaking') && (
          <div 
            style={{
              position: 'absolute',
              inset: '0',
              width: sizeClasses.avatar,
              height: sizeClasses.avatar,
              borderRadius: 'var(--radius-full)',
              border: '3px solid',
              borderColor: mode === 'listening' ? 'var(--color-primary)' : 'var(--color-medical)',
              animation: 'ping 2s infinite',
              opacity: 0.75
            }}
          />
        )}
      </div>

      {/* Clean Dr. Maya Information */}
      <div 
        className="text-center" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--space-3)', 
          maxWidth: '400px' 
        }}
      >
        <h3 
          style={{
            fontSize: sizeClasses.text,
            fontWeight: 'var(--font-bold)',
            color: 'var(--color-neutral-900)',
            margin: 0
          }}
        >
          Dr. Maya
        </h3>
        <p 
          style={{
            fontSize: 'var(--text-xl)',
            color: 'var(--color-medical-dark)',
            fontWeight: 'var(--font-semibold)',
            margin: 0
          }}
        >
          {stageContext.description}
        </p>
        <p 
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-neutral-600)',
            margin: 0,
            lineHeight: 1.5
          }}
        >
          {stageContext.specialization}
        </p>
      </div>

      {/* Clean Message Bubble */}
      {currentMessage && (
        <div 
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-3xl)',
            padding: 'var(--space-8)',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--color-neutral-200)',
            maxWidth: '500px'
          }}
        >
          <p 
            style={{
              color: 'var(--color-neutral-800)',
              textAlign: 'center',
              lineHeight: 1.6,
              fontSize: 'var(--text-lg)',
              margin: 0,
              fontWeight: 'var(--font-medium)'
            }}
          >
            {currentMessage}
          </p>
        </div>
      )}

      {/* Clean Voice Activation Hint */}
      {mode === 'welcoming' && (
        <div 
          className="flex flex-col items-center" 
          style={{ gap: 'var(--space-4)' }}
        >
          <button
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'var(--color-medical)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '40px',
              boxShadow: 'var(--shadow-xl)',
              border: '3px solid var(--color-medical-dark)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-medical-dark)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-medical)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🎤
          </button>
          <p 
            style={{
              color: 'var(--color-neutral-600)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-medium)',
              margin: 0
            }}
          >
            Tap to speak
          </p>
        </div>
      )}

      {/* Crisis Mode Actions */}
      {mode === 'crisis' && (
        <div className="flex" style={{ gap: 'var(--space-4)' }}>
          <button 
            style={{
              backgroundColor: 'var(--color-error)',
              color: 'white',
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-2xl)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: 'var(--shadow-lg)',
              minHeight: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC2626';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-error)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Crisis Support: 988
          </button>
          <button 
            style={{
              backgroundColor: '#FFFFFF',
              color: 'var(--color-error)',
              border: '2px solid var(--color-error)',
              padding: 'var(--space-4) var(--space-8)',
              borderRadius: 'var(--radius-2xl)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: 'var(--shadow-lg)',
              minHeight: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-error)';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = 'var(--color-error)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Chat Now
          </button>
        </div>
      )}
    </div>
  );
};

export default DrMayaAvatar;
