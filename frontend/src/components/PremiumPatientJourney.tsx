import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCopilotAction } from "@copilotkit/react-core";
import { RadiantLogo } from './RadiantLogo';
import { PremiumVoiceExperience } from './PremiumVoiceExperience';
import { JourneyTool } from './journeystages/JourneyTool';
import '../styles/premium-design-system.css';

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
    description: 'Handling insurance, logistics, and preparing for treatment to begin',
    duration: '2-4 weeks',
    status: 'upcoming'
  },
  {
    id: 7,
    name: 'treatment',
    title: 'Active Treatment Phase',
    subtitle: 'Taking action',
    theme: 'From Preparation to Healing',
    color: '#2196F3',
    icon: '⚡',
    description: 'Undergoing treatment with close monitoring and support from your care team',
    duration: 'Variable',
    status: 'upcoming'
  },
  {
    id: 8,
    name: 'monitoring',
    title: 'Treatment Monitoring & Adjustment',
    subtitle: 'Tracking progress',
    theme: 'From Treatment to Optimization',
    color: '#00BCD4',
    icon: '📊',
    description: 'Continuous monitoring of treatment response and making adjustments as needed',
    duration: 'Ongoing',
    status: 'upcoming'
  },
  {
    id: 9,
    name: 'recovery',
    title: 'Early Recovery & Assessment',
    subtitle: 'Seeing results',
    theme: 'From Treatment to Recovery',
    color: '#4CAF50',
    icon: '🌱',
    description: 'Initial recovery phase with careful assessment of treatment outcomes',
    duration: '4-12 weeks',
    status: 'upcoming'
  },
  {
    id: 10,
    name: 'transition',
    title: 'Transition Planning & Next Steps',
    subtitle: 'Looking ahead',
    theme: 'From Recovery to Future',
    color: '#8BC34A',
    icon: '🚀',
    description: 'Planning the transition to long-term care and defining next steps',
    duration: '2-4 weeks',
    status: 'upcoming'
  },
  {
    id: 11,
    name: 'living',
    title: 'Long-term Living & Wellness',
    subtitle: 'New normal',
    theme: 'From Recovery to Thriving',
    color: '#CDDC39',
    icon: '🌻',
    description: 'Adapting to long-term wellness routines and maintaining your health',
    duration: 'Ongoing',
    status: 'upcoming'
  },
  {
    id: 12,
    name: 'survivorship',
    title: 'Ongoing Survivorship & Advocacy',
    subtitle: 'Paying it forward',
    theme: 'From Surviving to Inspiring',
    color: '#FFC107',
    icon: '👑',
    description: 'Long-term survivorship, giving back, and helping others on their journey',
    duration: 'Lifelong',
    status: 'upcoming'
  }
];

// === PREMIUM FLOATING ACTION BUTTON ===
const PremiumFloatingVoiceButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        bottom: '48px',
        right: '48px',
        zIndex: 2147483646
      }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="voice-button-premium"
        style={{
          background: isHovered 
            ? 'linear-gradient(135deg, #FF8A65, #FF6B35)' 
            : 'linear-gradient(135deg, #FF6B35, #E64A19)',
          transform: isHovered ? 'scale(1.1)' : isPulsing ? 'scale(1.02)' : 'scale(1)',
          animation: isPulsing ? 'pulse 2s infinite' : 'none',
          color: 'white',
          fontSize: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Talk to Dr. Maya - Ultra-fast voice assistant"
      >
        {isHovered ? '🎤' : '👩‍⚕️'}
      </button>
      
      {/* Floating tooltip */}
      {isHovered && (
        <div 
          style={{
            position: 'absolute',
            bottom: '140px',
            right: '0',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          Talk to Dr. Maya
          <div 
            style={{
              position: 'absolute',
              top: '100%',
              right: '24px',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(0, 0, 0, 0.8)'
            }}
          />
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
  const [journeyStages, setJourneyStages] = useState(COMPLETE_JOURNEY_STAGES);

  // CopilotKit integration for AI tool orchestration
  useCopilotAction({
    name: "showTool",
    parameters: [
      { name: "toolName", type: "string", description: "The name of the tool component to display." },
      { name: "category", type: "string", description: "Tool category: essential, supportive, or advanced." }
    ],
    handler: ({ toolName, category }) => {
      console.log(`[Premium Dashboard] AI command: show ${category} tool '${toolName}'`);
      setActiveTool(toolName);
    },
  });

  useCopilotAction({
    name: "navigateToStage",
    parameters: [
      { name: "stageName", type: "string", description: "The journey stage to navigate to." },
      { name: "stageId", type: "number", description: "The numeric ID of the stage (1-12)." }
    ],
    handler: ({ stageName, stageId }) => {
      console.log(`[Premium Dashboard] AI navigation: stage ${stageId} - ${stageName}`);
      setSelectedStage(stageName);
      // Update stage status
      setJourneyStages(prev => prev.map(stage => ({
        ...stage,
        status: stage.id === stageId ? 'current' : 
               stage.id < stageId ? 'completed' : 'upcoming'
      })));
    },
  });

  // Fetch tools for selected stage
  useEffect(() => {
    const fetchTools = async () => {
      setIsLoadingTools(true);
      try {
        const response = await fetch(`http://localhost:9500/api/v1/journey/${selectedStage}`);
        const data = await response.json();
        
        // Enhanced tools with categories and descriptions
        const enhancedTools: Tool[] = (data.tools || []).map((tool: any) => ({
          ...tool,
          description: tool.description || `${tool.name} - helping you navigate this stage`,
          icon: tool.icon || '🛠️',
          category: tool.category || 'essential'
        }));
        
        setTools(enhancedTools);
        
        // Auto-select first essential tool
        if (!activeTool && enhancedTools.length > 0) {
          const essentialTool = enhancedTools.find(t => t.category === 'essential') || enhancedTools[0];
          setActiveTool(essentialTool.component);
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error);
        setTools([]);
      }
      setIsLoadingTools(false);
    };
    
    fetchTools();
  }, [selectedStage]);

  // Show premium voice experience
  if (showVoiceChat) {
    return <PremiumVoiceExperience onExit={() => setShowVoiceChat(false)} />;
  }

  const currentStage = journeyStages.find(s => s.name === selectedStage) || journeyStages[0];
  const essentialTools = tools.filter(t => t.category === 'essential');
  const supportiveTools = tools.filter(t => t.category === 'supportive');
  const advancedTools = tools.filter(t => t.category === 'advanced');

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 25%, #DEE2E6 50%, #CED4DA 75%, #ADB5BD 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* Premium Header */}
      <header 
        className="glass-card"
        style={{
          margin: 0,
          borderRadius: 0,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          padding: 'var(--space-medium) var(--space-large)',
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--blur-strong)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div className="premium-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-medium)' }}>
              <RadiantLogo size="lg" />
              <div>
                <h1 style={{ 
                  fontSize: 'var(--font-headline)', 
                  fontWeight: 700, 
                  color: 'var(--neutral-900)',
                  marginBottom: 'var(--space-micro)'
                }}>
                  Your RadiantCompass Journey
                </h1>
                <p style={{ 
                  fontSize: 'var(--font-body)', 
                  color: 'var(--neutral-600)',
                  fontWeight: 500
                }}>
                  Stage {currentStage.id} of 12: {currentStage.theme}
                </p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-small)' }}>
              <div style={{ 
                background: currentStage.color + '20',
                color: currentStage.color,
                padding: 'var(--space-micro) var(--space-small)',
                borderRadius: 'var(--radius-medium)',
                fontSize: 'var(--font-caption)',
                fontWeight: 600
              }}>
                {currentStage.duration}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="premium-container" style={{ padding: 'var(--space-hero) var(--space-large)' }}>
        {/* Current Stage Hero Section */}
        <section style={{ marginBottom: 'var(--space-hero)' }}>
          <div 
            className="glass-card"
            style={{
              padding: 'var(--space-hero)',
              background: `linear-gradient(135deg, ${currentStage.color}08, ${currentStage.color}04)`,
              border: `1px solid ${currentStage.color}20`,
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '72px', marginBottom: 'var(--space-medium)' }}>
              {currentStage.icon}
            </div>
            <h2 style={{ 
              fontSize: 'var(--font-hero)', 
              fontWeight: 800, 
              color: 'var(--neutral-900)',
              marginBottom: 'var(--space-small)',
              background: `linear-gradient(135deg, ${currentStage.color}, ${currentStage.color}CC)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {currentStage.title}
            </h2>
            <p style={{ 
              fontSize: 'var(--font-subtitle)', 
              color: 'var(--neutral-700)',
              marginBottom: 'var(--space-medium)',
              fontWeight: 500
            }}>
              {currentStage.subtitle}
            </p>
            <p style={{ 
              fontSize: 'var(--font-body)', 
              color: 'var(--neutral-600)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              {currentStage.description}
            </p>
          </div>
        </section>

        {/* Tools Section - Prominently Displayed */}
        <section style={{ marginBottom: 'var(--space-hero)' }}>
          <h3 style={{ 
            fontSize: 'var(--font-headline)', 
            fontWeight: 700, 
            color: 'var(--neutral-900)',
            marginBottom: 'var(--space-large)',
            textAlign: 'center'
          }}>
            Your Stage {currentStage.id} Tools & Support
          </h3>

          {isLoadingTools ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-hero)' }}>
              <div style={{ fontSize: '48px', marginBottom: 'var(--space-medium)' }}>⏳</div>
              <p style={{ fontSize: 'var(--font-subtitle)', color: 'var(--neutral-600)' }}>
                Loading your personalized tools...
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-large)' }}>
              {/* Essential Tools */}
              {essentialTools.length > 0 && (
                <div>
                  <h4 style={{ 
                    fontSize: 'var(--font-title)', 
                    fontWeight: 600, 
                    color: 'var(--primary-radiant)',
                    marginBottom: 'var(--space-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-small)'
                  }}>
                    ⭐ Essential Tools
                  </h4>
                  <div 
                    className="premium-grid"
                    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
                  >
                    {essentialTools.map(tool => (
                      <div
                        key={tool.name}
                        className={`tool-card-premium ${activeTool === tool.component ? 'active' : ''}`}
                        onClick={() => setActiveTool(tool.component)}
                        style={{
                          background: activeTool === tool.component 
                            ? `linear-gradient(135deg, ${currentStage.color}10, ${currentStage.color}05)`
                            : undefined
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-small)' }}>
                          <span style={{ fontSize: '32px' }}>{tool.icon}</span>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ 
                              fontSize: 'var(--font-subtitle)', 
                              fontWeight: 600, 
                              color: 'var(--neutral-900)',
                              marginBottom: 'var(--space-micro)'
                            }}>
                              {tool.name}
                            </h5>
                            <p style={{ 
                              fontSize: 'var(--font-body)', 
                              color: 'var(--neutral-600)',
                              lineHeight: 1.5
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
                    fontSize: 'var(--font-title)', 
                    fontWeight: 600, 
                    color: 'var(--primary-hope)',
                    marginBottom: 'var(--space-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-small)'
                  }}>
                    🤝 Supportive Tools
                  </h4>
                  <div 
                    className="premium-grid"
                    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
                  >
                    {supportiveTools.map(tool => (
                      <div
                        key={tool.name}
                        className={`tool-card-premium ${activeTool === tool.component ? 'active' : ''}`}
                        onClick={() => setActiveTool(tool.component)}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-small)' }}>
                          <span style={{ fontSize: '24px' }}>{tool.icon}</span>
                          <div>
                            <h5 style={{ 
                              fontSize: 'var(--font-body)', 
                              fontWeight: 600, 
                              color: 'var(--neutral-900)',
                              marginBottom: 'var(--space-micro)'
                            }}>
                              {tool.name}
                            </h5>
                            <p style={{ 
                              fontSize: 'var(--font-caption)', 
                              color: 'var(--neutral-600)'
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
                    fontSize: 'var(--font-title)', 
                    fontWeight: 600, 
                    color: 'var(--primary-wisdom)',
                    marginBottom: 'var(--space-medium)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-small)'
                  }}>
                    🚀 Advanced Tools
                  </h4>
                  <div 
                    className="premium-grid"
                    style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
                  >
                    {advancedTools.map(tool => (
                      <div
                        key={tool.name}
                        className={`tool-card-premium ${activeTool === tool.component ? 'active' : ''}`}
                        onClick={() => setActiveTool(tool.component)}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-small)' }}>
                          <span style={{ fontSize: '24px' }}>{tool.icon}</span>
                          <div>
                            <h5 style={{ 
                              fontSize: 'var(--font-body)', 
                              fontWeight: 600, 
                              color: 'var(--neutral-900)',
                              marginBottom: 'var(--space-micro)'
                            }}>
                              {tool.name}
                            </h5>
                            <p style={{ 
                              fontSize: 'var(--font-caption)', 
                              color: 'var(--neutral-600)'
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
          )}
        </section>

        {/* Active Tool Display */}
        {activeTool && (
          <section style={{ marginBottom: 'var(--space-hero)' }}>
            <div className="glass-card" style={{ padding: 'var(--space-large)' }}>
              <JourneyTool componentName={activeTool} />
            </div>
          </section>
        )}

        {/* Complete 12-Stage Journey Map */}
        <section>
          <h3 style={{ 
            fontSize: 'var(--font-headline)', 
            fontWeight: 700, 
            color: 'var(--neutral-900)',
            marginBottom: 'var(--space-large)',
            textAlign: 'center'
          }}>
            Your Complete 12-Stage Journey
          </h3>
          
          <div 
            className="premium-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-medium)' }}
          >
            {journeyStages.map(stage => (
              <div
                key={stage.id}
                className={`journey-stage-card ${selectedStage === stage.name ? 'active' : ''}`}
                onClick={() => setSelectedStage(stage.name)}
                style={{
                  opacity: stage.status === 'upcoming' ? 0.7 : 1,
                  background: stage.status === 'completed' 
                    ? `linear-gradient(135deg, ${stage.color}15, ${stage.color}08)`
                    : selectedStage === stage.name
                    ? `linear-gradient(135deg, ${stage.color}20, ${stage.color}10)`
                    : undefined
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-small)', marginBottom: 'var(--space-small)' }}>
                  <span style={{ fontSize: '32px' }}>{stage.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-small)', marginBottom: 'var(--space-micro)' }}>
                      <span style={{ 
                        fontSize: 'var(--font-caption)', 
                        fontWeight: 700, 
                        color: stage.color,
                        background: stage.color + '20',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-small)'
                      }}>
                        Stage {stage.id}
                      </span>
                      <span style={{ 
                        fontSize: 'var(--font-micro)', 
                        color: 'var(--neutral-500)',
                        fontWeight: 500
                      }}>
                        {stage.duration}
                      </span>
                    </div>
                    <h4 style={{ 
                      fontSize: 'var(--font-subtitle)', 
                      fontWeight: 600, 
                      color: 'var(--neutral-900)',
                      marginBottom: 'var(--space-micro)'
                    }}>
                      {stage.title}
                    </h4>
                    <p style={{ 
                      fontSize: 'var(--font-caption)', 
                      color: 'var(--neutral-600)',
                      fontStyle: 'italic',
                      marginBottom: 'var(--space-small)'
                    }}>
                      {stage.subtitle}
                    </p>
                  </div>
                  <div style={{ 
                    fontSize: '16px',
                    color: stage.status === 'completed' ? 'var(--success)' : 
                           stage.status === 'current' ? 'var(--primary-radiant)' : 'var(--neutral-400)'
                  }}>
                    {stage.status === 'completed' ? '✅' : 
                     stage.status === 'current' ? '🔄' : '⏳'}
                  </div>
                </div>
                <p style={{ 
                  fontSize: 'var(--font-caption)', 
                  color: 'var(--neutral-600)',
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