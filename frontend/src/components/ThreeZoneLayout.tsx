import React, { useState, useEffect } from 'react';
import { UltraFastVoiceChat } from './UltraFastVoiceChat';
import { DrMayaAvatar } from './DrMayaAvatar';
import { ToolOrchestrator } from './ToolOrchestrator';

/**
 * Premium Medical Interface - E-Health Consilium Inspired Design
 * Apple-like clean aesthetics with professional medical styling
 * Ultra-clean white backgrounds, sophisticated shadows, premium typography
 * CRITICAL: Preserves working TTS system in UltraFastVoiceChat component
 */

type AvatarMode = 
  | 'welcoming'
  | 'listening' 
  | 'speaking'
  | 'concerned'
  | 'encouraging'
  | 'celebrating'
  | 'crisis';

export type JourneyStage = 
  | "awareness_orientation"
  | "organize_plan"
  | "explore_decide"
  | "coordinate_commit"
  | "undergo_treatment"
  | "early_recovery"
  | "surveillance_rehabilitation"
  | "long_term_living";

export type PatientPersona = 
  | "radical_optimist"
  | "clinical_researcher"
  | "balanced_calm"
  | "just_headlines";

interface ThreeZoneLayoutProps {
  currentStage?: JourneyStage;
  persona?: PatientPersona;
  onStageChange?: (stage: JourneyStage) => void;
  onPersonaChange?: (persona: PatientPersona) => void;
}

interface StageConfig {
  icon: string;
  label: string;
  color: string;
  description: string;
}

const stageConfigs: Record<JourneyStage, StageConfig> = {
  awareness_orientation: {
    icon: '🌅',
    label: 'Awareness',
    color: 'text-neutral-600',
    description: 'Understanding symptoms and preparing for care'
  },
  organize_plan: {
    icon: '🗺️',
    label: 'Organize',
    color: 'text-neutral-600',
    description: 'Building knowledge and planning your journey'
  },
  explore_decide: {
    icon: '🔍',
    label: 'Explore',
    color: 'text-neutral-600',
    description: 'Comparing options and making decisions'
  },
  coordinate_commit: {
    icon: '📋',
    label: 'Coordinate',
    color: 'text-neutral-600',
    description: 'Organizing logistics and committing to care'
  },
  undergo_treatment: {
    icon: '🏥',
    label: 'Treatment',
    color: 'text-neutral-600',
    description: 'Active treatment and monitoring'
  },
  early_recovery: {
    icon: '🌱',
    label: 'Recovery',
    color: 'text-neutral-600',
    description: 'Initial healing and adjustment'
  },
  surveillance_rehabilitation: {
    icon: '📈',
    label: 'Monitor',
    color: 'text-neutral-600',
    description: 'Ongoing surveillance and rehabilitation'
  },
  long_term_living: {
    icon: '🌟',
    label: 'Thrive',
    color: 'text-neutral-600',
    description: 'Long-term wellness and mentorship'
  }
};

const personaConfigs: Record<PatientPersona, { label: string; description: string; icon: string }> = {
  radical_optimist: {
    label: 'Optimist',
    description: 'Enthusiastic, hope-focused guidance',
    icon: '🌟'
  },
  clinical_researcher: {
    label: 'Clinical',
    description: 'Detailed, evidence-based information',
    icon: '📊'
  },
  balanced_calm: {
    label: 'Balanced',
    description: 'Measured, reassuring approach',
    icon: '🤝'
  },
  just_headlines: {
    label: 'Headlines',
    description: 'Concise, essential information',
    icon: '📋'
  }
};

export const ThreeZoneLayout: React.FC<ThreeZoneLayoutProps> = ({
  currentStage = "awareness_orientation",
  persona = "balanced_calm",
  onStageChange,
  onPersonaChange
}) => {
  const [contextualInfo, setContextualInfo] = useState({
    todaysFocus: "Understanding your symptoms and preparing for your first specialist appointment",
    progressPercentage: 15,
    nextMilestone: "Complete symptom documentation",
    recentActivity: "Started condition research"
  });

  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [mayaMode, setMayaMode] = useState<AvatarMode>('welcoming');

  // Update contextual information based on current stage
  useEffect(() => {
    const stageContexts = {
      awareness_orientation: {
        todaysFocus: "Understanding your symptoms and preparing for your first specialist appointment",
        progressPercentage: 15,
        nextMilestone: "Complete symptom documentation",
        recentActivity: "Started condition research"
      },
      organize_plan: {
        todaysFocus: "Organizing medical records and researching your condition",
        progressPercentage: 30,
        nextMilestone: "Build your support network",
        recentActivity: "Created medical timeline"
      },
      explore_decide: {
        todaysFocus: "Comparing treatment centers and building your care team",
        progressPercentage: 45,
        nextMilestone: "Select primary care center",
        recentActivity: "Reviewed specialist options"
      },
      coordinate_commit: {
        todaysFocus: "Coordinating appointments and finalizing treatment plan",
        progressPercentage: 60,
        nextMilestone: "Complete insurance pre-authorization",
        recentActivity: "Scheduled consultation"
      },
      undergo_treatment: {
        todaysFocus: "Managing treatment and tracking your response",
        progressPercentage: 75,
        nextMilestone: "Mid-treatment assessment",
        recentActivity: "Completed week 2 of treatment"
      },
      early_recovery: {
        todaysFocus: "Monitoring recovery and managing expectations",
        progressPercentage: 85,
        nextMilestone: "First follow-up scan",
        recentActivity: "Started recovery exercises"
      },
      surveillance_rehabilitation: {
        todaysFocus: "Ongoing monitoring and lifestyle optimization",
        progressPercentage: 92,
        nextMilestone: "6-month surveillance check",
        recentActivity: "Completed rehabilitation program"
      },
      long_term_living: {
        todaysFocus: "Long-term wellness and supporting others",
        progressPercentage: 100,
        nextMilestone: "Mentor program participation",
        recentActivity: "Shared story with community"
      }
    };

    setContextualInfo(stageContexts[currentStage]);
  }, [currentStage]);

  return (
    <div className="h-screen flex" style={{ 
      backgroundColor: '#FFFFFF', 
      fontFamily: 'var(--font-family-primary)' 
    }}>
      {/* LEFT ZONE: Ultra-Clean White Concierge Sidebar - Premium Patient Experience */}
      <div className="w-80 flex flex-col" style={{ 
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid var(--color-neutral-200)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Premium Header with RadiantCompass Branding */}
        <div style={{ 
          padding: 'var(--space-8)', 
          borderBottom: '1px solid var(--color-neutral-200)',
          backgroundColor: '#FFFFFF'
        }}>
          <div className="flex items-center mb-6" style={{ gap: 'var(--space-4)' }}>
            <div className="relative">
              <img 
                src="/radiantcompass-logo.png" 
                alt="RadiantCompass Logo"
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius-2xl)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '2px solid var(--color-medical-light)',
                  backgroundColor: 'var(--color-background)'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'flex';
                  }
                }}
              />
              <div 
                className="flex items-center justify-center text-white font-bold"
                style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, var(--color-medical) 0%, var(--color-medical-dark) 100%)',
                  borderRadius: 'var(--radius-2xl)',
                  fontSize: 'var(--text-2xl)',
                  display: 'none',
                  boxShadow: 'var(--shadow-lg)',
                  border: '2px solid var(--color-medical-light)'
                }}
              >
                🧭
              </div>
              {/* Premium glow effect */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  background: 'linear-gradient(135deg, var(--color-medical), var(--color-primary))',
                  borderRadius: 'var(--radius-2xl)',
                  zIndex: -1,
                  opacity: 0.1
                }}
              />
            </div>
            <div>
              <h1 style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'var(--font-bold)', 
                color: 'var(--color-neutral-900)',
                margin: 0,
                lineHeight: 1.2,
                background: 'linear-gradient(135deg, var(--color-medical-dark) 0%, var(--color-primary-dark) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                RadiantCompass
              </h1>
              <p style={{ 
                fontSize: 'var(--text-lg)', 
                color: 'var(--color-neutral-600)',
                margin: 0,
                fontWeight: 'var(--font-medium)'
              }}>
                Your Healthcare Partner
              </p>
            </div>
          </div>
          
          <button 
            className="w-full"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-2xl)',
              padding: 'var(--space-5) var(--space-6)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              fontFamily: 'var(--font-family-primary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.24)',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 122, 255, 0.32)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 122, 255, 0.24)';
            }}
          >
            📞 Schedule Appointment
          </button>
        </div>

        {/* Ultra-Clean Navigation - Large & Senior-Friendly */}
        <div className="flex-1" style={{ padding: 'var(--space-8)' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <a 
              href="#" 
              className="flex items-center rounded-3xl transition-all duration-300"
              style={{ 
                gap: 'var(--space-8)',
                padding: 'var(--space-8) var(--space-10)',
                color: 'var(--color-neutral-800)',
                textDecoration: 'none',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                minHeight: '80px',
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--color-neutral-200)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                e.currentTarget.style.color = 'var(--color-primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.color = 'var(--color-neutral-800)';
              }}
            >
              <span style={{ fontSize: '40px', color: 'var(--color-primary)' }}>🏠</span>
              <span>My Dashboard</span>
            </a>
            <a 
              href="#" 
              className="flex items-center rounded-3xl transition-all duration-300"
              style={{ 
                gap: 'var(--space-8)',
                padding: 'var(--space-8) var(--space-10)',
                color: 'var(--color-neutral-800)',
                textDecoration: 'none',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                minHeight: '80px',
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--color-neutral-200)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                e.currentTarget.style.color = 'var(--color-primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.color = 'var(--color-neutral-800)';
              }}
            >
              <span style={{ fontSize: '40px', color: 'var(--color-primary)' }}>📅</span>
              <span>My Calendar</span>
            </a>
            <a 
              href="#" 
              className="flex items-center rounded-3xl transition-all duration-300"
              style={{ 
                gap: 'var(--space-8)',
                padding: 'var(--space-8) var(--space-10)',
                color: 'var(--color-neutral-800)',
                textDecoration: 'none',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                minHeight: '80px',
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--color-neutral-200)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                e.currentTarget.style.color = 'var(--color-primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.color = 'var(--color-neutral-800)';
              }}
            >
              <span style={{ fontSize: '40px', color: 'var(--color-primary)' }}>👩‍⚕️</span>
              <span>My Care Team</span>
            </a>
            <a 
              href="#" 
              className="flex items-center rounded-3xl transition-all duration-300"
              style={{ 
                gap: 'var(--space-8)',
                padding: 'var(--space-8) var(--space-10)',
                color: 'var(--color-neutral-800)',
                textDecoration: 'none',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                minHeight: '80px',
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--color-neutral-200)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                e.currentTarget.style.color = 'var(--color-primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.color = 'var(--color-neutral-800)';
              }}
            >
              <span style={{ fontSize: '40px', color: 'var(--color-primary)' }}>💊</span>
              <span>My Medications</span>
            </a>
            <a 
              href="#" 
              className="flex items-center rounded-3xl transition-all duration-300"
              style={{ 
                gap: 'var(--space-8)',
                padding: 'var(--space-8) var(--space-10)',
                color: 'var(--color-neutral-800)',
                textDecoration: 'none',
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-semibold)',
                minHeight: '80px',
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--color-neutral-200)',
                boxShadow: 'var(--shadow-lg)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                e.currentTarget.style.color = 'var(--color-primary-dark)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.color = 'var(--color-neutral-800)';
              }}
            >
              <span style={{ fontSize: '40px', color: 'var(--color-primary)' }}>📋</span>
              <span>My Health Records</span>
            </a>
          </nav>

          {/* Premium Journey Stages - Apple-like Elevation */}
          <div style={{ marginTop: 'var(--space-8)' }}>
            <h3 style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: 'var(--font-bold)', 
              color: 'var(--color-neutral-700)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-8)'
            }}>
              Journey Stages
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {Object.entries(stageConfigs).map(([stage, config]) => (
                <button
                  key={stage}
                  onClick={() => onStageChange?.(stage as JourneyStage)}
                  className="premium-card w-full flex items-center text-left transition-all duration-300"
                  style={{
                    gap: 'var(--space-6)',
                    padding: 'var(--space-6)',
                    border: currentStage === stage 
                      ? '3px solid var(--color-medical)' 
                      : '2px solid var(--color-neutral-200)',
                    borderRadius: 'var(--radius-3xl)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: currentStage === stage 
                      ? 'var(--shadow-2xl)' 
                      : 'var(--shadow-lg)',
                    cursor: 'pointer',
                    minHeight: '100px'
                  }}
                  onMouseEnter={(e) => {
                    if (currentStage !== stage) {
                      e.currentTarget.style.borderColor = 'var(--color-neutral-300)';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentStage !== stage) {
                      e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-2xl)',
                    backgroundColor: currentStage === stage 
                      ? 'var(--color-medical-light)' 
                      : '#FFFFFF',
                    border: currentStage === stage 
                      ? '2px solid var(--color-medical)' 
                      : '2px solid var(--color-neutral-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <span style={{ fontSize: '32px' }}>{config.icon}</span>
                  </div>
                  <div className="flex-1">
                    <span style={{ 
                      fontSize: 'var(--text-xl)', 
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-neutral-900)',
                      lineHeight: 1.2
                    }}>
                      {config.label}
                    </span>
                    <p style={{ 
                      fontSize: 'var(--text-base)', 
                      color: 'var(--color-neutral-600)', 
                      marginTop: 'var(--space-2)',
                      margin: 0,
                      lineHeight: 1.4
                    }}>
                      {config.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Premium Tools Section */}
          <div style={{ marginTop: 'var(--space-8)' }}>
            <button 
              onClick={() => setShowTools(!showTools)}
              className="w-full flex items-center rounded-lg transition-all"
              style={{
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: showTools ? 'var(--color-primary-light)' : 'transparent',
                color: showTools ? 'var(--color-primary-dark)' : 'var(--color-neutral-600)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)'
              }}
              onMouseEnter={(e) => {
                if (!showTools) {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }
              }}
              onMouseLeave={(e) => {
                if (!showTools) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ color: 'var(--color-neutral-400)' }}>🛠️</span>
              <span>Healthcare Tools</span>
            </button>
            <button 
              className="w-full flex items-center rounded-lg transition-all mt-1"
              style={{
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                backgroundColor: 'transparent',
                color: 'var(--color-neutral-600)',
                border: 'none',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ color: 'var(--color-error)' }}>🆘</span>
              <span>Crisis Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* CENTER ZONE: Premium Video Call Interface - E-Health Consilium Style */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
        {showTools ? (
          /* Tool Orchestrator */
          <div className="w-full h-full">
            <ToolOrchestrator 
              currentStage={currentStage}
              onToolSelect={(tool) => console.log('Tool selected:', tool)}
              onToolComplete={(toolId, results) => {
                console.log('Tool completed:', toolId, results);
                setShowTools(false);
              }}
            />
          </div>
        ) : showVoiceChat ? (
          /* CRITICAL: UltraFastVoiceChat component remains completely unchanged */
          <div className="w-full h-full">
            <UltraFastVoiceChat onNavigateHome={() => setShowVoiceChat(false)} />
          </div>
        ) : (
          /* Premium Video Call Interface - E-Health Consilium Inspired */
          <div className="flex flex-col h-full" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Premium Header */}
            <div style={{ 
              padding: 'var(--space-8)', 
              borderBottom: '1px solid var(--color-neutral-100)',
              backgroundColor: '#FFFFFF'
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-display" style={{ 
                    fontSize: 'var(--text-2xl)', 
                    fontWeight: 'var(--font-semibold)', 
                    color: 'var(--color-neutral-900)',
                    marginBottom: 'var(--space-1)'
                  }}>
                    Dr. Maya Session
                  </h1>
                  <div className="flex items-center text-caption" style={{ 
                    gap: 'var(--space-6)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-neutral-500)'
                  }}>
                    <span>11:00-11:40</span>
                    <span 
                      className="inline-flex items-center rounded-full"
                      style={{
                        padding: 'var(--space-1) var(--space-2)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 'var(--font-medium)',
                        backgroundColor: 'var(--color-success)',
                        color: 'white',
                        gap: 'var(--space-1)'
                      }}
                    >
                      🟢 LIVE SESSION
                    </span>
                    <span>Stage: {stageConfigs[currentStage].label}</span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setMayaMode('listening');
                    setShowVoiceChat(true);
                  }}
                  style={{
                    backgroundColor: 'var(--color-error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-3) var(--space-6)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#DC2626';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-error)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  Start Consultation
                </button>
              </div>
            </div>

            {/* Premium Video Call Area - E-Health Consilium Style */}
            <div style={{ flex: 1, padding: 'var(--space-8)' }}>
              <div 
                className="h-full premium-card overflow-hidden"
                style={{
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-neutral-200)',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                {/* Premium Video Header */}
                <div 
                  className="flex items-center justify-between"
                  style={{
                    padding: 'var(--space-6)',
                    borderBottom: '1px solid var(--color-neutral-100)',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
                    <div 
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-success)'
                      }}
                    />
                    <span style={{ 
                      fontSize: 'var(--text-sm)', 
                      fontWeight: 'var(--font-medium)', 
                      color: 'var(--color-neutral-700)' 
                    }}>
                      E-consultation
                    </span>
                    <span style={{ 
                      fontSize: 'var(--text-sm)', 
                      color: 'var(--color-neutral-500)' 
                    }}>
                      Control Visit
                    </span>
                  </div>
                  <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                    <span 
                      className="inline-flex items-center rounded-full"
                      style={{
                        padding: 'var(--space-1-5) var(--space-3)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                        backgroundColor: 'var(--color-neutral-200)',
                        color: 'var(--color-neutral-700)',
                        gap: 'var(--space-1)'
                      }}
                    >
                      👥 2 participants
                    </span>
                  </div>
                </div>

                {/* Premium Main Video Area with Dr. Maya */}
                <div 
                  className="relative flex-1 h-full flex items-center justify-center"
                  style={{
                    minHeight: '500px',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <DrMayaAvatar
                    mode={mayaMode}
                    stage={currentStage}
                    size="xl"
                    showStatus={true}
                    onAvatarClick={() => {
                      setMayaMode('listening');
                      setShowVoiceChat(true);
                    }}
                  />
                  
                  {/* Premium Overlay */}
                  <div className="absolute" style={{ top: 'var(--space-4)', left: 'var(--space-4)' }}>
                    <span 
                      className="inline-flex items-center rounded-full"
                      style={{
                        padding: 'var(--space-1-5) var(--space-3)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-medium)',
                        backgroundColor: 'var(--color-warning)',
                        color: 'var(--color-neutral-900)'
                      }}
                    >
                      LEFT 2:25
                    </span>
                  </div>
                  
                  {/* Premium Chat Area - Medical Teal */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 medical-accent"
                    style={{ padding: 'var(--space-6)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
                        <div 
                          className="flex items-center justify-center"
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          💬
                        </div>
                        <span style={{ fontSize: 'var(--text-sm)' }}>No chat messages</span>
                      </div>
                      <div className="flex items-center" style={{ gap: 'var(--space-4)' }}>
                        <button 
                          onClick={() => {
                            setMayaMode('listening');
                            setShowVoiceChat(true);
                          }}
                          className="flex items-center justify-center transition-all"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          🎤
                        </button>
                        <button 
                          className="flex items-center justify-center transition-all"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          📷
                        </button>
                        <button 
                          className="flex items-center justify-center transition-all"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          🔊
                        </button>
                      </div>
                    </div>
                    <div className="text-center" style={{ marginTop: 'var(--space-4)' }}>
                      <span 
                        style={{ 
                          fontSize: 'var(--text-2xl)', 
                          fontFamily: 'var(--font-family-mono)',
                          fontWeight: 'var(--font-medium)'
                        }}
                      >
                        37:35
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT ZONE: Premium Info Panel - Apple-like Elegance */}
      <div 
        className="w-80 flex flex-col"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderLeft: '1px solid var(--color-neutral-100)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div className="flex-1 overflow-y-auto" style={{ padding: 'var(--space-6)' }}>
          {/* Premium Today's Focus */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3 className="text-headline" style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: 'var(--font-semibold)', 
              color: 'var(--color-neutral-900)',
              marginBottom: 'var(--space-4)'
            }}>
              Today's Focus
            </h3>
            <div 
              className="premium-card"
              style={{
                backgroundColor: 'var(--color-primary-light)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-neutral-800)'
              }}
            >
              <p className="text-body" style={{ 
                fontSize: 'var(--text-sm)', 
                lineHeight: 1.6,
                margin: 0
              }}>
                {contextualInfo.todaysFocus}
              </p>
            </div>
          </div>

          {/* Premium Progress Overview */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3 className="text-headline" style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: 'var(--font-semibold)', 
              color: 'var(--color-neutral-900)',
              marginBottom: 'var(--space-4)'
            }}>
              Progress Overview
            </h3>
            <div 
              className="premium-card"
              style={{
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)'
              }}
            >
              <div>
                <div className="flex justify-between items-center" style={{ marginBottom: 'var(--space-2)' }}>
                  <span style={{ 
                    fontSize: 'var(--text-sm)', 
                    fontWeight: 'var(--font-medium)', 
                    color: 'var(--color-neutral-700)' 
                  }}>
                    Journey Progress
                  </span>
                  <span style={{ 
                    fontSize: 'var(--text-sm)', 
                    fontWeight: 'var(--font-semibold)', 
                    color: 'var(--color-primary)' 
                  }}>
                    {contextualInfo.progressPercentage}%
                  </span>
                </div>
                <div 
                  className="w-full rounded-full"
                  style={{
                    height: '8px',
                    backgroundColor: 'var(--color-neutral-200)'
                  }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${contextualInfo.progressPercentage}%`,
                      backgroundColor: 'var(--color-primary)'
                    }}
                  />
                </div>
              </div>

              <div style={{ 
                paddingTop: 'var(--space-3)', 
                borderTop: '1px solid var(--color-neutral-100)' 
              }}>
                <p className="text-caption" style={{ 
                  fontSize: 'var(--text-xs)', 
                  fontWeight: 'var(--font-semibold)', 
                  color: 'var(--color-neutral-500)', 
                  marginBottom: 'var(--space-1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Next Milestone
                </p>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  fontWeight: 'var(--font-medium)', 
                  color: 'var(--color-neutral-800)',
                  margin: 0
                }}>
                  {contextualInfo.nextMilestone}
                </p>
              </div>

              <div style={{ 
                paddingTop: 'var(--space-3)', 
                borderTop: '1px solid var(--color-neutral-100)' 
              }}>
                <p className="text-caption" style={{ 
                  fontSize: 'var(--text-xs)', 
                  fontWeight: 'var(--font-semibold)', 
                  color: 'var(--color-neutral-500)', 
                  marginBottom: 'var(--space-1)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Recent Activity
                </p>
                <p style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--color-neutral-700)',
                  margin: 0
                }}>
                  {contextualInfo.recentActivity}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Communication Style */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <h3 style={{ 
              fontSize: 'var(--text-xs)', 
              fontWeight: 'var(--font-bold)', 
              color: 'var(--color-neutral-500)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-6)'
            }}>
              Communication Style
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {Object.entries(personaConfigs).map(([personaKey, config]) => (
                <button
                  key={personaKey}
                  onClick={() => onPersonaChange?.(personaKey as PatientPersona)}
                  className="premium-card w-full flex items-center text-left transition-all duration-300"
                  style={{
                    gap: 'var(--space-6)',
                    padding: 'var(--space-6)',
                    border: persona === personaKey 
                      ? '3px solid var(--color-primary)' 
                      : '2px solid var(--color-neutral-200)',
                    borderRadius: 'var(--radius-3xl)',
                    backgroundColor: '#FFFFFF',
                    boxShadow: persona === personaKey 
                      ? 'var(--shadow-2xl)' 
                      : 'var(--shadow-lg)',
                    cursor: 'pointer',
                    minHeight: '90px'
                  }}
                  onMouseEnter={(e) => {
                    if (persona !== personaKey) {
                      e.currentTarget.style.borderColor = 'var(--color-neutral-300)';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (persona !== personaKey) {
                      e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-2xl)',
                    backgroundColor: persona === personaKey 
                      ? 'var(--color-primary-light)' 
                      : '#FFFFFF',
                    border: persona === personaKey 
                      ? '2px solid var(--color-primary)' 
                      : '2px solid var(--color-neutral-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <span style={{ fontSize: '32px' }}>{config.icon}</span>
                  </div>
                  <div className="flex-1">
                    <span style={{ 
                      fontSize: 'var(--text-xl)', 
                      fontWeight: 'var(--font-bold)',
                      color: 'var(--color-neutral-900)',
                      lineHeight: 1.2
                    }}>
                      {config.label}
                    </span>
                    <p style={{ 
                      fontSize: 'var(--text-base)', 
                      color: 'var(--color-neutral-600)', 
                      marginTop: 'var(--space-2)',
                      margin: 0,
                      lineHeight: 1.4
                    }}>
                      {config.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Premium Quick Actions */}
          <div>
            <h3 style={{ 
              fontSize: 'var(--text-lg)', 
              fontWeight: 'var(--font-bold)', 
              color: 'var(--color-neutral-700)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: 'var(--space-8)'
            }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <button 
                onClick={() => setShowTools(true)}
                className="w-full flex items-center text-left transition-all duration-300"
                style={{
                  gap: 'var(--space-6)',
                  padding: 'var(--space-8)',
                  borderRadius: 'var(--radius-3xl)',
                  cursor: 'pointer',
                  minHeight: '90px',
                  border: '2px solid var(--color-neutral-200)',
                  boxShadow: 'var(--shadow-lg)',
                  backgroundColor: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid var(--color-neutral-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '32px' }}>🛠️</span>
                </div>
                <div className="flex-1">
                  <span style={{ 
                    fontSize: 'var(--text-xl)', 
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-neutral-900)'
                  }}>
                    Browse All Tools
                  </span>
                  <p style={{ 
                    fontSize: 'var(--text-base)', 
                    color: 'var(--color-neutral-500)', 
                    marginTop: 'var(--space-1)',
                    margin: 0
                  }}>
                    Access healthcare toolkit
                  </p>
                </div>
              </button>

              <button 
                onClick={() => {
                  setMayaMode('listening');
                  setShowVoiceChat(true);
                }}
                className="w-full flex items-center text-left transition-all duration-300"
                style={{
                  gap: 'var(--space-6)',
                  padding: 'var(--space-8)',
                  border: '2px solid var(--color-primary)',
                  borderRadius: 'var(--radius-3xl)',
                  backgroundColor: '#FFFFFF',
                  boxShadow: 'var(--shadow-lg)',
                  cursor: 'pointer',
                  minHeight: '90px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                  e.currentTarget.style.borderColor = 'var(--color-primary-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: 'var(--color-primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '32px' }}>🎤</span>
                </div>
                <div className="flex-1">
                  <span style={{ 
                    fontSize: 'var(--text-xl)', 
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-primary-dark)'
                  }}>
                    Start Voice Chat
                  </span>
                  <p style={{ 
                    fontSize: 'var(--text-base)', 
                    color: 'var(--color-primary)', 
                    marginTop: 'var(--space-1)',
                    margin: 0
                  }}>
                    Talk with Dr. Maya
                  </p>
                </div>
              </button>

              <button 
                className="w-full flex items-center text-left transition-all duration-300"
                style={{
                  gap: 'var(--space-6)',
                  padding: 'var(--space-8)',
                  borderRadius: 'var(--radius-3xl)',
                  cursor: 'pointer',
                  minHeight: '90px',
                  border: '2px solid var(--color-neutral-200)',
                  boxShadow: 'var(--shadow-lg)',
                  backgroundColor: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-xl)',
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid var(--color-neutral-200)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '32px' }}>📊</span>
                </div>
                <div className="flex-1">
                  <span style={{ 
                    fontSize: 'var(--text-xl)', 
                    fontWeight: 'var(--font-semibold)',
                    color: 'var(--color-neutral-900)'
                  }}>
                    Track Symptoms
                  </span>
                  <p style={{ 
                    fontSize: 'var(--text-base)', 
                    color: 'var(--color-neutral-500)', 
                    marginTop: 'var(--space-1)',
                    margin: 0
                  }}>
                    Monitor your health
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
