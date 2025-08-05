import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCopilotAction } from "@copilotkit/react-core";
import { RadiantLogo } from './RadiantLogo';
import { DrMayaVoiceExperience } from './DrMayaVoiceExperience';
import { JourneyTool } from './journeystages/JourneyTool';

// === TYPES ===
interface Tool {
  name: string;
  component: string;
  description: string;
  icon: string;
  category: 'essential' | 'supportive' | 'advanced';
  metadata: any;
}

interface JourneyStage {
  id: number;
  name: string;
  title: string;
  subtitle: string;
  theme: string;
  color: string;
  icon: string;
  description: string;
  duration?: string;
  status: 'completed' | 'current' | 'upcoming';
}

// === COMPLETE 12-STAGE PATIENT JOURNEY ===
const COMPLETE_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 1,
    name: 'awareness',
    title: 'First Hints & Awareness',
    subtitle: 'Something feels different',
    theme: 'From Fear to Understanding',
    color: '#FF6B35',
    icon: '🌅',
    description: 'Initial symptoms, first doctor visits, and building awareness of your condition',
    duration: '2-4 weeks',
    status: 'current'
  },
  {
    id: 2,
    name: 'diagnosis',
    title: 'Specialist Work-up & Diagnosis',
    subtitle: 'Getting answers',
    theme: 'From Uncertainty to Clarity',
    color: '#4A90E2',
    icon: '🔍',
    description: 'Working with specialists to understand your diagnosis and what it means',
    duration: '4-8 weeks',
    status: 'upcoming'
  },
  {
    id: 3,
    name: 'research',
    title: 'Research & Compare Care',
    subtitle: 'Understanding your options',
    theme: 'From Confusion to Knowledge',
    color: '#7ED321',
    icon: '📚',
    description: 'Researching treatment options, comparing different approaches and providers',
    duration: '2-3 weeks',
    status: 'upcoming'
  },
  {
    id: 4,
    name: 'staging',
    title: 'Full Staging & Baseline Testing',
    subtitle: 'Complete picture',
    theme: 'From Unknown to Mapped',
    color: '#9013FE',
    icon: '🗺️',
    description: 'Comprehensive testing to fully understand your condition and create baseline metrics',
    duration: '1-2 weeks',
    status: 'upcoming'
  },
  {
    id: 5,
    name: 'planning',
    title: 'Multidisciplinary Treatment Planning',
    subtitle: 'Your care team assembles',
    theme: 'From Options to Strategy',
    color: '#FF9800',
    icon: '🎯',
    description: 'Working with your full care team to create a comprehensive treatment plan',
    duration: '1-2 weeks',
    status: 'upcoming'
  },
  {
    id: 6,
    name: 'preparation',
    title: 'Insurance & Treatment Preparation',
    subtitle: 'Getting everything ready',
    theme: 'From Planning to Readiness',
    color: '#E91E63',
    icon: '📋',
    description: 'Insurance approvals, scheduling, and preparing for your treatment journey',
    duration: '2-3 weeks',
    status: 'upcoming'
  },
  {
    id: 7,
    name: 'treatment',
    title: 'Active Treatment Phase',
    subtitle: 'Taking action',
    theme: 'From Preparation to Action',
    color: '#F44336',
    icon: '⚕️',
    description: 'Beginning your treatment plan with your medical team',
    duration: '3-12 months',
    status: 'upcoming'
  },
  {
    id: 8,
    name: 'monitoring',
    title: 'Treatment Response Monitoring',
    subtitle: 'Tracking progress',
    theme: 'From Action to Assessment',
    color: '#2196F3',
    icon: '📊',
    description: 'Regular check-ins and adjustments to optimize your treatment',
    duration: 'Ongoing',
    status: 'upcoming'
  },
  {
    id: 9,
    name: 'recovery',
    title: 'Early Recovery & Response',
    subtitle: 'Seeing results',
    theme: 'From Treatment to Recovery',
    color: '#4CAF50',
    icon: '🌱',
    description: 'Initial recovery phase and assessing treatment effectiveness',
    duration: '1-6 months',
    status: 'upcoming'
  },
  {
    id: 10,
    name: 'transition',
    title: 'Recovery & Transition Planning',
    subtitle: 'Moving forward',
    theme: 'From Recovery to Renewal',
    color: '#00BCD4',
    icon: '🚀',
    description: 'Planning your transition back to normal life and ongoing care',
    duration: '2-4 months',
    status: 'upcoming'
  },
  {
    id: 11,
    name: 'living',
    title: 'Long-term Living & Wellness',
    subtitle: 'Thriving daily',
    theme: 'From Recovery to Thriving',
    color: '#8BC34A',
    icon: '🌟',
    description: 'Establishing sustainable routines for long-term health and wellness',
    duration: '6+ months',
    status: 'upcoming'
  },
  {
    id: 12,
    name: 'survivorship',
    title: 'Ongoing Survivorship & Giving Back',
    subtitle: 'Inspiring others',
    theme: 'From Surviving to Inspiring',
    color: '#FFC107',
    icon: '👑',
    description: 'Long-term survivorship, giving back, and helping others on their journey',
    duration: 'Lifelong',
    status: 'upcoming'
  }
];

// === ULTRA-CLEAN FLOATING VOICE BUTTON ===
const PremiumFloatingVoiceButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 2147483646
      }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          border: 'none',
          background: isHovered ? '#2563EB' : '#3B82F6',
          color: 'white',
          fontSize: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isHovered 
            ? '0 8px 32px rgba(59, 130, 246, 0.4)' 
            : '0 4px 20px rgba(59, 130, 246, 0.3)',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          outline: 'none'
        }}
        aria-label="Talk to Dr. Maya - Voice Assistant"
      >
        {isHovered ? '🎤' : '👩‍⚕️'}
      </button>
      
      {/* Clean tooltip */}
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            bottom: '88px',
            right: '0',
            background: '#374151',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap' as const,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
        >
          Talk to Dr. Maya
        </div>
      )}
    </div>,
    document.body
  );
};

// === MAIN PREMIUM DASHBOARD COMPONENT ===
export const PremiumPatientJourney: React.FC = () => {
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('awareness');
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const [journeyStages] = useState<JourneyStage[]>(COMPLETE_JOURNEY_STAGES);

  // Copilot action for stage navigation
  useCopilotAction({
    name: "navigate_to_journey_stage",
    description: "Navigate to a specific stage in the patient journey",
    parameters: [
      {
        name: "stage_name",
        type: "string",
        description: "The name of the journey stage to navigate to",
        enum: journeyStages.map(s => s.name)
      }
    ],
    handler: async ({ stage_name }) => {
      setSelectedStage(stage_name);
      return `Navigated to ${stage_name} stage`;
    }
  });

  // Fetch tools for selected stage
  useEffect(() => {
    const fetchTools = async () => {
      setIsLoadingTools(true);
      try {
        const response = await fetch(`http://localhost:9500/api/v1/journey/${selectedStage}`);
        if (response.ok) {
          const data = await response.json();
          setTools(data.tools || []);
        }
      } catch (error) {
        console.error('Error fetching tools:', error);
        setTools([]);
      }
      setIsLoadingTools(false);
    };
    
    fetchTools();
  }, [selectedStage]);

  // Show premium voice experience
  if (showVoiceChat) {
    return <DrMayaVoiceExperience onExit={() => setShowVoiceChat(false)} />;
  }

  const currentStage = journeyStages.find(s => s.name === selectedStage) || journeyStages[0];
  const essentialTools = tools.filter(t => t.category === 'essential');
  const supportiveTools = tools.filter(t => t.category === 'supportive');
  const advancedTools = tools.filter(t => t.category === 'advanced');

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      {/* Ultra-Clean Header */}
      <header 
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          padding: '20px 0',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <RadiantLogo size="lg" />
              <div>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: 700, 
                  color: '#111827',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  Your RadiantCompass Journey
                </h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#6B7280',
                  fontWeight: 500,
                  margin: 0
                }}>
                  Stage {currentStage.id} of 12: {currentStage.theme}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                background: currentStage.color + '20',
                color: currentStage.color,
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {currentStage.duration}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Current Stage Hero Section */}
        <section style={{ marginBottom: '64px' }}>
          <div 
            style={{
              padding: '48px',
              background: `linear-gradient(135deg, ${currentStage.color}08, ${currentStage.color}04)`,
              border: `1px solid ${currentStage.color}20`,
              borderRadius: '16px',
              textAlign: 'center' as const,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div style={{ fontSize: '72px', marginBottom: '24px' }}>
              {currentStage.icon}
            </div>
            <h2 style={{ 
              fontSize: '36px', 
              fontWeight: 700, 
              color: '#111827',
              marginBottom: '12px'
            }}>
              {currentStage.title}
            </h2>
            <p style={{ 
              fontSize: '18px', 
              color: '#6B7280',
              marginBottom: '24px',
              maxWidth: '600px',
              margin: '0 auto 24px auto'
            }}>
              {currentStage.description}
            </p>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              color: '#374151'
            }}>
              <span>Expected Duration: {currentStage.duration}</span>
            </div>
          </div>
        </section>

        {/* Tools Section - Only show if tools exist */}
        {tools.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <h3 style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              color: '#111827',
              marginBottom: '32px',
              textAlign: 'center' as const
            }}>
              Tools & Resources for This Stage
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '32px' }}>
              {/* Essential Tools */}
              {essentialTools.length > 0 && (
                <div>
                  <h4 style={{ 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    color: '#111827',
                    marginBottom: '16px'
                  }}>
                    🎯 Essential Tools
                  </h4>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '16px'
                  }}>
                    {essentialTools.map(tool => (
                      <div
                        key={tool.name}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: activeTool === tool.component 
                            ? '0 4px 20px rgba(59, 130, 246, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={() => setActiveTool(tool.component)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = activeTool === tool.component 
                            ? '0 4px 20px rgba(59, 130, 246, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{tool.icon}</span>
                          <div>
                            <h5 style={{ 
                              fontSize: '16px', 
                              fontWeight: 600, 
                              color: '#111827',
                              marginBottom: '4px'
                            }}>
                              {tool.name}
                            </h5>
                            <p style={{ 
                              fontSize: '14px', 
                              color: '#6B7280',
                              margin: 0
                            }}>
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supportive Tools */}
              {supportiveTools.length > 0 && (
                <div>
                  <h4 style={{ 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    color: '#111827',
                    marginBottom: '16px'
                  }}>
                    🤝 Supportive Tools
                  </h4>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '16px'
                  }}>
                    {supportiveTools.map(tool => (
                      <div
                        key={tool.name}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: activeTool === tool.component 
                            ? '0 4px 20px rgba(59, 130, 246, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={() => setActiveTool(tool.component)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = activeTool === tool.component 
                            ? '0 4px 20px rgba(59, 130, 246, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{tool.icon}</span>
                          <div>
                            <h5 style={{ 
                              fontSize: '16px', 
                              fontWeight: 600, 
                              color: '#111827',
                              marginBottom: '4px'
                            }}>
                              {tool.name}
                            </h5>
                            <p style={{ 
                              fontSize: '14px', 
                              color: '#6B7280',
                              margin: 0
                            }}>
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advanced Tools */}
              {advancedTools.length > 0 && (
                <div>
                  <h4 style={{ 
                    fontSize: '20px', 
                    fontWeight: 600, 
                    color: '#111827',
                    marginBottom: '16px'
                  }}>
                    🚀 Advanced Tools
                  </h4>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '16px'
                  }}>
                    {advancedTools.map(tool => (
                      <div
                        key={tool.name}
                        style={{
                          background: '#FFFFFF',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          padding: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: activeTool === tool.component 
                            ? '0 4px 20px rgba(59, 130, 246, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.05)'
                        }}
                        onClick={() => setActiveTool(tool.component)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = activeTool === tool.component 
                            ? '0 4px 20px rgba(59, 130, 246, 0.15)'
                            : '0 2px 8px rgba(0, 0, 0, 0.05)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{tool.icon}</span>
                          <div>
                            <h5 style={{ 
                              fontSize: '16px', 
                              fontWeight: 600, 
                              color: '#111827',
                              marginBottom: '4px'
                            }}>
                              {tool.name}
                            </h5>
                            <p style={{ 
                              fontSize: '14px', 
                              color: '#6B7280',
                              margin: 0
                            }}>
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Active Tool Display */}
        {activeTool && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{ 
              background: '#FFFFFF', 
              border: '1px solid #E5E7EB',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <JourneyTool componentName={activeTool} />
            </div>
          </section>
        )}

        {/* Complete 12-Stage Journey Map */}
        <section>
          <h3 style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            color: '#111827',
            marginBottom: '32px',
            textAlign: 'center' as const
          }}>
            Your Complete 12-Stage Journey
          </h3>
          
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '16px' 
            }}
          >
            {journeyStages.map(stage => (
              <div
                key={stage.id}
                style={{
                  background: selectedStage === stage.name 
                    ? `linear-gradient(135deg, ${stage.color}20, ${stage.color}10)`
                    : '#FFFFFF',
                  border: selectedStage === stage.name 
                    ? `2px solid ${stage.color}`
                    : '1px solid #E5E7EB',
                  borderRadius: '16px',
                  padding: '24px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: stage.status === 'upcoming' ? 0.7 : 1,
                  boxShadow: selectedStage === stage.name 
                    ? `0 8px 32px ${stage.color}20`
                    : '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
                onClick={() => setSelectedStage(stage.name)}
                onMouseEnter={(e) => {
                  if (selectedStage !== stage.name) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStage !== stage.name) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '32px' }}>{stage.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ 
                        fontSize: '12px', 
                        fontWeight: 700, 
                        color: stage.color,
                        background: stage.color + '20',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        Stage {stage.id}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        color: '#6B7280',
                        fontWeight: 500
                      }}>
                        {stage.duration}
                      </span>
                    </div>
                    <h4 style={{ 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      color: '#111827',
                      marginBottom: '4px'
                    }}>
                      {stage.title}
                    </h4>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6B7280',
                      fontWeight: 500,
                      marginBottom: '8px'
                    }}>
                      {stage.subtitle}
                    </p>
                  </div>
                </div>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#374151',
                  margin: 0,
                  lineHeight: 1.4
                }}>
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Premium Floating Voice Button */}
      <PremiumFloatingVoiceButton onClick={() => setShowVoiceChat(true)} />
    </div>
  );
};