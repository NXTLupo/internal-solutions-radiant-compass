import React, { useState, useEffect } from 'react';
import { PremiumToolInterface, type ToolCategory } from './PremiumToolInterface';
import { DrMayaAvatar } from './DrMayaAvatar';

/**
 * Tool Orchestrator Component
 * Manages all 200+ RadiantCompass tools across the 12-stage patient journey
 * Maintains three-zone paradigm while enabling dynamic tool activation
 * Preserves Dr. Maya's central presence as tools materialize around her
 */

interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  stage: string[];
  icon: string;
  description: string;
  mayaIntroduction: string;
  interfaceType: 'form' | 'interactive' | 'comparison' | 'tracker' | 'guide';
}

interface ToolOrchestratorProps {
  currentStage: string;
  onToolSelect?: (tool: Tool) => void;
  onToolComplete?: (toolId: string, results: any) => void;
}

// Comprehensive tool database following the requirements analysis
const comprehensiveTools: Tool[] = [
  // Stage 1: Awareness & Orientation Tools
  {
    id: 'symptom-tracker',
    name: 'Symptom Tracking Tool',
    category: 'assessment',
    stage: ['awareness_orientation'],
    icon: '📊',
    description: 'Document progression and patterns with temporal analysis',
    mayaIntroduction: "Let's track your symptoms together. I'll help you identify patterns and understand what your body is telling you.",
    interfaceType: 'tracker'
  },
  {
    id: 'pre-appointment-questionnaire',
    name: 'Pre-appointment Questionnaire',
    category: 'planning',
    stage: ['awareness_orientation'],
    icon: '📝',
    description: 'Help articulate concerns effectively for your doctor visit',
    mayaIntroduction: "I'll help you prepare the perfect questions for your appointment so your concerns are heard.",
    interfaceType: 'form'
  },
  {
    id: 'education-module',
    name: 'Education Module',
    category: 'learning',
    stage: ['awareness_orientation'],
    icon: '🎓',
    description: 'When to seek specialist care directly',
    mayaIntroduction: "Let me teach you about your condition in terms that make sense. We'll go at your pace.",
    interfaceType: 'guide'
  },
  {
    id: 'appointment-preparation-guide',
    name: 'Appointment Preparation Guide',
    category: 'planning',
    stage: ['awareness_orientation'],
    icon: '📋',
    description: 'Optimize initial doctor visits with comprehensive preparation',
    mayaIntroduction: "I'll create a personalized preparation guide that ensures you get the most out of your visit.",
    interfaceType: 'guide'
  },
  {
    id: 'ai-symptom-sage',
    name: 'AI Symptom Sage',
    category: 'assessment',
    stage: ['awareness_orientation'],
    icon: '🧠',
    description: 'Real-time symptom interpretation with emotional intelligence',
    mayaIntroduction: "Tell me about your symptoms, and I'll help you understand the urgency level and next steps.",
    interfaceType: 'interactive'
  },

  // Stage 2: Organize & Plan Tools
  {
    id: 'ai-translation-engine',
    name: 'AI Translation Engine',
    category: 'learning',
    stage: ['organize_plan'],
    icon: '🔄',
    description: 'Convert pathology reports into plain language (6th-grade level)',
    mayaIntroduction: "Those medical terms can be overwhelming. Let me translate this into language that makes sense.",
    interfaceType: 'interactive'
  },
  {
    id: 'guided-question-generator',
    name: 'Guided Question Generator',
    category: 'planning',
    stage: ['organize_plan'],
    icon: '❓',
    description: 'AI-generated consultation checklists',
    mayaIntroduction: "I'll create specific questions tailored to your diagnosis and concerns.",
    interfaceType: 'form'
  },
  {
    id: 'condition-education-library',
    name: 'Condition Education Library',
    category: 'learning',
    stage: ['organize_plan'],
    icon: '📚',
    description: 'Personalized condition explanations with storytelling AI',
    mayaIntroduction: "Let me tell you about your condition like I would explain it to a friend.",
    interfaceType: 'guide'
  },
  {
    id: 'peer-connection-platform',
    name: 'Peer Connection Platform',
    category: 'community',
    stage: ['organize_plan'],
    icon: '👥',
    description: 'Connect with others with similar diagnosis',
    mayaIntroduction: "I'd like you to meet others who understand your journey. Their stories might help.",
    interfaceType: 'interactive'
  },

  // Stage 3: Explore & Decide Tools
  {
    id: 'compare-my-care',
    name: 'Compare-My-Care™ Tool',
    category: 'care',
    stage: ['explore_decide'],
    icon: '🏥',
    description: 'Rank hospitals by volume, outcomes, insurance status, travel burden, and culture',
    mayaIntroduction: "I'll help you find the perfect care team by comparing hospitals that specialize in your condition.",
    interfaceType: 'comparison'
  },
  {
    id: 'medical-record-hub',
    name: 'Centralized Medical Record Hub',
    category: 'planning',
    stage: ['explore_decide'],
    icon: '📁',
    description: 'Aggregate and share records across providers',
    mayaIntroduction: "Let's organize all your medical information in one secure place that travels with you.",
    interfaceType: 'interactive'
  },
  {
    id: 'insurance-coverage-analyzer',
    name: 'Insurance Coverage Analyzer',
    category: 'planning',
    stage: ['explore_decide'],
    icon: '💳',
    description: 'Pre-authorization assistance and network navigation',
    mayaIntroduction: "Insurance can be confusing. I'll help you understand your coverage and options.",
    interfaceType: 'comparison'
  },
  {
    id: 'travel-planning-assistant',
    name: 'Travel Planning Assistant',
    category: 'planning',
    stage: ['explore_decide'],
    icon: '✈️',
    description: 'Accommodation and logistics coordination',
    mayaIntroduction: "If you need to travel for care, I'll help coordinate everything from hotels to transportation.",
    interfaceType: 'interactive'
  },

  // Treatment & Recovery Tools
  {
    id: 'side-effect-tracking-app',
    name: 'Side Effect Tracking App',
    category: 'treatment',
    stage: ['undergo_treatment'],
    icon: '📈',
    description: 'AI-powered symptom monitoring with provider alerts',
    mayaIntroduction: "Let's monitor how treatment is affecting you and ensure your team knows if anything needs attention.",
    interfaceType: 'tracker'
  },
  {
    id: 'recovery-milestone-tracker',
    name: 'Recovery Milestone Tracker',
    category: 'recovery',
    stage: ['early_recovery'],
    icon: '🌱',
    description: 'Progress monitoring with realistic expectations',
    mayaIntroduction: "Recovery isn't linear. Let me help you celebrate every small victory along the way.",
    interfaceType: 'tracker'
  },
  {
    id: 'scanxiety-management',
    name: 'Scan Anxiety Management Tools',
    category: 'support',
    stage: ['early_recovery', 'surveillance_rehabilitation'],
    icon: '🧘',
    description: 'Preparation and coping strategies for medical scans',
    mayaIntroduction: "Scan anxiety is completely normal. I have techniques that help most people feel more in control.",
    interfaceType: 'guide'
  },

  // Long-term & Community Tools
  {
    id: 'survivorship-care-plan',
    name: 'Survivorship Care Plan Creator',
    category: 'planning',
    stage: ['long_term_living'],
    icon: '📋',
    description: 'Comprehensive long-term health planning',
    mayaIntroduction: "Let's create a comprehensive plan for your long-term health and wellness.",
    interfaceType: 'form'
  },
  {
    id: 'mentor-matching',
    name: 'Survivor Mentorship Program',
    category: 'community',
    stage: ['long_term_living'],
    icon: '🌟',
    description: 'Connect with newly diagnosed patients',
    mayaIntroduction: "Your experience could help someone who's just starting this journey. Want to make a difference?",
    interfaceType: 'interactive'
  },

  // Crisis Support (Available across all stages)
  {
    id: 'crisis-support',
    name: 'Crisis Support',
    category: 'support',
    stage: ['*'],
    icon: '🆘',
    description: 'Immediate mental health resources and crisis intervention',
    mayaIntroduction: "I can hear you're struggling right now. I'm here with you, and we're going to get through this together.",
    interfaceType: 'guide'
  }
];

const categoryIcons: Record<ToolCategory, string> = {
  assessment: '🧠',
  planning: '📋',
  care: '🏥',
  treatment: '💊',
  recovery: '🌱',
  community: '👥',  
  learning: '📚',
  support: '🚨'
};

export const ToolOrchestrator: React.FC<ToolOrchestratorProps> = ({
  currentStage,
  onToolSelect,
  onToolComplete
}) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [toolsByCategory, setToolsByCategory] = useState<Record<ToolCategory, Tool[]>>({
    assessment: [],
    planning: [],
    care: [],
    treatment: [],
    recovery: [],
    community: [],
    learning: [],
    support: []
  });

  // Filter tools based on current stage
  useEffect(() => {
    const stageTools = comprehensiveTools.filter(tool => 
      tool.stage.includes(currentStage) || tool.stage.includes('*')
    );
    
    setAvailableTools(stageTools);

    // Group tools by category
    const grouped = stageTools.reduce((acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    }, {} as Record<ToolCategory, Tool[]>);

    setToolsByCategory(grouped);
  }, [currentStage]);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
    onToolSelect?.(tool);
  };

  const handleToolComplete = (toolId: string, results: any) => {
    onToolComplete?.(toolId, results);
    setSelectedTool(null);
  };

  const handleToolClose = () => {
    setSelectedTool(null);
  };

  // If a tool is selected, show the premium tool interface
  if (selectedTool) {
    return (
      <PremiumToolInterface
        tool={selectedTool}
        onToolComplete={handleToolComplete}
        onClose={handleToolClose}
        currentStage={currentStage}
      />
    );
  }

  // Main tool selection interface with three-zone paradigm
  return (
    <div className="h-screen flex" style={{ backgroundColor: '#FFFFFF' }}>
      {/* LEFT ZONE: Tool Categories */}
      <div 
        className="flex flex-col items-center" 
        style={{
          width: '120px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid var(--color-neutral-200)',
          padding: 'var(--space-8)',
          gap: 'var(--space-6)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* RadiantCompass Logo */}
        <div 
          style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--color-medical) 0%, var(--color-primary) 100%)',
            borderRadius: 'var(--radius-3xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-8)',
            boxShadow: 'var(--shadow-xl)',
            border: '2px solid var(--color-medical-light)'
          }}
        >
          <span 
            style={{
              color: 'white',
              fontWeight: 'var(--font-black)',
              fontSize: 'var(--text-3xl)'
            }}
          >
            🧭
          </span>
        </div>

        {/* Tool Categories */}
        {Object.entries(categoryIcons).map(([category, icon]) => {
          const toolCount = toolsByCategory[category as ToolCategory]?.length || 0;
          return (
            <div key={category} style={{ position: 'relative' }}>
              <button
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: 'var(--radius-3xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  transition: 'all var(--transition-fast)',
                  border: '2px solid',
                  cursor: toolCount > 0 ? 'pointer' : 'not-allowed',
                  backgroundColor: '#FFFFFF',
                  borderColor: toolCount > 0 ? 'var(--color-neutral-200)' : 'var(--color-neutral-100)',
                  color: toolCount > 0 ? 'var(--color-primary)' : 'var(--color-neutral-300)',
                  boxShadow: toolCount > 0 ? 'var(--shadow-lg)' : 'none'
                }}
                disabled={toolCount === 0}
                title={`${category.charAt(0).toUpperCase() + category.slice(1)} Tools (${toolCount})`}
                onMouseEnter={(e) => {
                  if (toolCount > 0) {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-light)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (toolCount > 0) {
                    e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }
                }}
              >
                {icon}
              </button>
              {toolCount > 0 && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    fontSize: 'var(--text-base)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'var(--font-bold)',
                    border: '2px solid white',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  {toolCount}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CENTER ZONE: Maya + Tool Selection */}
      <div className="flex-1 flex flex-col" style={{ padding: 'var(--space-12)' }}>
        {/* Maya Avatar */}
        <div className="flex justify-center" style={{ marginBottom: 'var(--space-12)' }}>
          <DrMayaAvatar
            mode="welcoming"
            stage={currentStage as any}
            size="lg"
            showStatus={true}
            message={`I have ${availableTools.length} specialized tools available for your current stage. Which would you like to explore?`}
          />
        </div>

        {/* Available Tools Grid */}
        <div className="flex-1 max-w-7xl mx-auto w-full">
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h2 
              style={{
                fontSize: 'var(--text-4xl)',
                fontWeight: 'var(--font-bold)',
                color: 'var(--color-neutral-900)',
                marginBottom: 'var(--space-3)'
              }}
            >
              Available Tools
            </h2>
            <p 
              style={{
                fontSize: 'var(--text-xl)',
                color: 'var(--color-neutral-600)',
                fontWeight: 'var(--font-medium)'
              }}
            >
              {availableTools.length} tools specialized for your current journey stage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--space-8)' }}>
            {availableTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool)}
                style={{
                  textAlign: 'left',
                  padding: 'var(--space-8)',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-3xl)',
                  border: '2px solid var(--color-neutral-200)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-lg)',
                  minHeight: '200px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-2xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-neutral-200)';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
              >
                <div className="flex items-start" style={{ gap: 'var(--space-6)' }}>
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, var(--color-medical) 0%, var(--color-primary) 100%)',
                      borderRadius: 'var(--radius-2xl)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '40px',
                      boxShadow: 'var(--shadow-lg)',
                      border: '2px solid var(--color-medical-light)',
                      transition: 'transform var(--transition-fast)'
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div className="flex-1">
                    <h3 
                      style={{
                        fontSize: 'var(--text-xl)',
                        fontWeight: 'var(--font-bold)',
                        color: 'var(--color-neutral-900)',
                        marginBottom: 'var(--space-3)',
                        transition: 'color var(--transition-fast)'
                      }}
                    >
                      {tool.name}
                    </h3>
                    <p 
                      style={{
                        fontSize: 'var(--text-base)',
                        color: 'var(--color-neutral-600)',
                        marginBottom: 'var(--space-4)',
                        lineHeight: 1.6
                      }}
                    >
                      {tool.description}
                    </p>
                    <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                      <span 
                        style={{
                          fontSize: 'var(--text-sm)',
                          backgroundColor: 'var(--color-primary-light)',
                          color: 'var(--color-primary-dark)',
                          padding: 'var(--space-2) var(--space-3)',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 'var(--font-semibold)'
                        }}
                      >
                        {categoryIcons[tool.category]} {tool.category}
                      </span>
                      <span 
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--color-neutral-500)',
                          fontWeight: 'var(--font-medium)'
                        }}
                      >
                        {tool.interfaceType}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT ZONE: Tool Context */}
      <div 
        className="overflow-y-auto" 
        style={{
          width: '400px',
          backgroundColor: '#FFFFFF',
          borderLeft: '1px solid var(--color-neutral-200)',
          padding: 'var(--space-8)',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        {/* Current Stage */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <h3 
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-neutral-900)',
              marginBottom: 'var(--space-6)'
            }}
          >
            Current Stage
          </h3>
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-3xl)',
              padding: 'var(--space-6)',
              border: '2px solid var(--color-primary)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <p 
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-neutral-800)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--space-3)',
                textTransform: 'capitalize'
              }}
            >
              {currentStage.replace('_', ' & ')}
            </p>
            <p 
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-neutral-600)',
                margin: 0
              }}
            >
              Tools are filtered to match your current journey phase
            </p>
          </div>
        </div>

        {/* Tool Categories */}
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <h3 
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-neutral-900)',
              marginBottom: 'var(--space-6)'
            }}
          >
            Tool Categories
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {Object.entries(toolsByCategory).map(([category, tools]) => {
              if (tools.length === 0) return null;
              return (
                <div 
                  key={category} 
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-2xl)',
                    padding: 'var(--space-4)',
                    border: '2px solid var(--color-neutral-200)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
                      <span style={{ fontSize: 'var(--text-lg)' }}>
                        {categoryIcons[category as ToolCategory]}
                      </span>
                      <span 
                        style={{
                          fontSize: 'var(--text-lg)',
                          fontWeight: 'var(--font-semibold)',
                          color: 'var(--color-neutral-700)',
                          textTransform: 'capitalize'
                        }}
                      >
                        {category}
                      </span>
                    </div>
                    <span 
                      style={{
                        fontSize: 'var(--text-base)',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary-dark)',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 'var(--font-bold)'
                      }}
                    >
                      {tools.length}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Maya's Recommendations */}
        <div>
          <h3 
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 'var(--font-bold)',
              color: 'var(--color-neutral-900)',
              marginBottom: 'var(--space-6)'
            }}
          >
            Dr. Maya Recommends
          </h3>
          <div 
            style={{
              backgroundColor: 'var(--color-medical-light)',
              borderRadius: 'var(--radius-3xl)',
              padding: 'var(--space-6)',
              border: '2px solid var(--color-medical)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <p 
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-medical-dark)',
                lineHeight: 1.6,
                margin: 0,
                fontWeight: 'var(--font-medium)'
              }}
            >
              Based on your current stage, I recommend starting with the Symptom Tracking Tool 
              to establish baseline patterns, then moving to the Education Module to better 
              understand your condition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolOrchestrator;
