import React, { useState, useEffect } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { 
  Activity, Stethoscope, Search, Calendar, Users, 
  Shield, Pill, Scissors, Heart, TrendingUp, 
  Eye, Sparkles, ChevronRight, Play
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  stage: number;
  priority: 'high' | 'medium' | 'low';
}

interface JourneyStage {
  id: number;
  name: string;
  theme: string;
  icon: React.ComponentType;
  color: string;
  gradient: string;
  tools: Tool[];
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 1,
    name: "First Hints & Initial Visit",
    theme: "Fear to Understanding",
    icon: Activity,
    color: "#10B981",
    gradient: "from-emerald-400 to-emerald-600",
    tools: [
      { id: "symptom-tracker", name: "Symptom Tracker", description: "Track symptoms with AI analysis", category: "tracking", icon: "📊", stage: 1, priority: "high" },
      { id: "appointment-prep", name: "Appointment Prep", description: "Optimize doctor visits", category: "planning", icon: "📋", stage: 1, priority: "high" },
      { id: "ai-symptom-sage", name: "AI Symptom Sage", description: "Real-time symptom interpretation", category: "ai", icon: "🧠", stage: 1, priority: "high" }
    ]
  },
  {
    id: 2,
    name: "Specialist Work-up & Diagnosis",
    theme: "Shock to Clarity", 
    icon: Stethoscope,
    color: "#3B82F6",
    gradient: "from-blue-400 to-blue-600",
    tools: [
      { id: "medical-translator", name: "Medical Translator", description: "Convert reports to plain language", category: "translation", icon: "🔤", stage: 2, priority: "high" },
      { id: "question-generator", name: "Question Generator", description: "AI consultation checklists", category: "preparation", icon: "❓", stage: 2, priority: "high" },
      { id: "peer-connection", name: "Peer Connection", description: "Connect with similar cases", category: "community", icon: "👥", stage: 2, priority: "medium" }
    ]
  },
  {
    id: 3,
    name: "Research & Compare-Care",
    theme: "Confusion to Clarity",
    icon: Search,
    color: "#8B5CF6", 
    gradient: "from-purple-400 to-purple-600",
    tools: [
      { id: "compare-care", name: "Compare-My-Care™", description: "Rank hospitals by outcomes", category: "comparison", icon: "⚖️", stage: 3, priority: "high" },
      { id: "insurance-analyzer", name: "Insurance Analyzer", description: "Coverage navigation", category: "financial", icon: "🛡️", stage: 3, priority: "high" },
      { id: "travel-planner", name: "Travel Planner", description: "Logistics coordination", category: "logistics", icon: "✈️", stage: 3, priority: "medium" }
    ]
  },
  {
    id: 4,
    name: "Staging & Testing",
    theme: "Uncertainty to Planning",
    icon: Calendar,
    color: "#F59E0B",
    gradient: "from-amber-400 to-amber-600", 
    tools: [
      { id: "treatment-calendar", name: "Treatment Calendar", description: "Schedule and track appointments", category: "scheduling", icon: "🗓️", stage: 4, priority: "high" },
      { id: "test-coordinator", name: "Test Coordinator", description: "Coordinate multiple tests", category: "scheduling", icon: "🔬", stage: 4, priority: "high" },
      { id: "results-repository", name: "Results Repository", description: "Organize test results", category: "organization", icon: "📁", stage: 4, priority: "medium" }
    ]
  }
];

interface ElegantToolPanelProps {
  onToolClick?: (tool: { id: string; name: string; description: string; stage: number }) => void;
}

export const ElegantToolPanel: React.FC<ElegantToolPanelProps> = ({ onToolClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // CopilotKit action to trigger tool demonstrations with visual display
  useCopilotAction({
    name: "showToolVisually",
    description: "Display a tool component visually in the chat area and provide autonomous demonstration",
    parameters: [
      { name: "toolId", type: "string", description: "The unique identifier of the tool" },
      { name: "toolName", type: "string", description: "The name of the tool" },
      { name: "toolDescription", type: "string", description: "Description of the tool" },
      { name: "stage", type: "number", description: "Journey stage number" }
    ],
    handler: async ({ toolId, toolName, toolDescription, stage }) => {
      console.log(`[ElegantToolPanel] Showing tool visually: ${toolName}`);
      setIsExecuting(true);
      setSelectedTool({ id: toolId, name: toolName, description: toolDescription, category: 'demo', icon: '🛠️', stage, priority: 'high' });
      
      // Create a detailed response that includes visual tool activation
      const response = `I'm bringing up the ${toolName} tool right now! 

🛠️ **${toolName} - Visual Tool Activated**

${toolDescription}

Let me walk you through this tool step by step. You'll see the interface appear below, and I'll guide you through each feature autonomously.

**What you'll see:**
- Interactive tool interface
- Real-time data entry
- Automated form completion
- Step-by-step guidance

Watch as the tool loads and I demonstrate its capabilities!`;
      
      setTimeout(() => {
        setIsExecuting(false);
      }, 2000);
      
      return {
        success: true,
        message: response,
        toolActivated: toolId,
        visualDisplay: true,
        stage: stage
      };
    }
  });

  const handleToolClick = async (tool: Tool) => {
    setSelectedTool(tool);
    setIsExecuting(true);
    console.log(`[ElegantToolPanel] Tool clicked: ${tool.name}`);
    
    // Call the parent callback if provided
    if (onToolClick) {
      try {
        await onToolClick({
          id: tool.id,
          name: tool.name,
          description: tool.description,
          stage: tool.stage
        });
        console.log(`[ElegantToolPanel] Tool callback executed for: ${tool.name}`);
      } catch (error) {
        console.error(`[ElegantToolPanel] Error in tool callback:`, error);
      }
    }
    
    setTimeout(() => {
      setIsExecuting(false);
    }, 2000);
  };

  const allTools = JOURNEY_STAGES.flatMap(stage => stage.tools);
  const filteredTools = selectedCategory === 'all' 
    ? allTools 
    : allTools.filter(tool => tool.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(allTools.map(tool => tool.category)))];

  return (
    <div style={{
      width: '320px',
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
    }}>
      {/* Elegant Header */}
      <div style={{
        padding: '24px 24px',
        borderBottom: '1px solid #F3F4F6'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles style={{ width: '16px', height: '16px', color: 'white' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#111827',
              margin: 0
            }}>RadiantCompass</h2>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              margin: 0
            }}>Journey Tools</p>
          </div>
        </div>
        
        {/* Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          borderRadius: '8px',
          transition: 'all 0.3s ease',
          backgroundColor: isExecuting ? '#ECFDF5' : '#F9FAFB',
          border: isExecuting ? '1px solid #BBF7D0' : '1px solid #E5E7EB'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: isExecuting ? '#10B981' : '#9CA3AF',
            animation: isExecuting ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
          }} />
          <span style={{
            fontSize: '14px',
            color: '#374151',
            fontWeight: 500
          }}>
            {isExecuting ? 'Activating tool...' : 'Ready to demonstrate'}
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #F3F4F6'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedCategory === category ? '#DBEAFE' : '#F3F4F6',
                color: selectedCategory === category ? '#1D4ED8' : '#6B7280'
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = '#E5E7EB';
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                }
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {JOURNEY_STAGES.map((stage) => {
            const stageTools = stage.tools.filter(tool => 
              selectedCategory === 'all' || tool.category === selectedCategory
            );
            
            if (stageTools.length === 0) return null;
            
            const StageIcon = stage.icon;
            
            return (
              <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Stage Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: stage.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <StageIcon style={{ width: '12px', height: '12px', color: 'white' }} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#111827'
                    }}>Stage {stage.id}</div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6B7280'
                    }}>{stage.theme}</div>
                  </div>
                </div>

                {/* Stage Tools */}
                <div style={{
                  marginLeft: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {stageTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool)}
                      style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '12px',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        border: selectedTool?.id === tool.id 
                          ? '2px solid #3B82F6' 
                          : '1px solid #E5E7EB',
                        backgroundColor: selectedTool?.id === tool.id 
                          ? 'linear-gradient(135deg, #EBF8FF 0%, #F3E8FF 100%)' 
                          : '#FFFFFF',
                        cursor: 'pointer',
                        boxShadow: selectedTool?.id === tool.id 
                          ? '0 4px 12px rgba(59, 130, 246, 0.15)' 
                          : '0 1px 3px rgba(0, 0, 0, 0.1)'
                      }}
                      onMouseOver={(e) => {
                        if (selectedTool?.id !== tool.id) {
                          e.currentTarget.style.borderColor = '#D1D5DB';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedTool?.id !== tool.id) {
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}>
                        <div style={{ 
                          fontSize: '20px',
                          flexShrink: 0
                        }}>{tool.icon}</div>
                        <div style={{
                          flex: 1,
                          minWidth: 0
                        }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: selectedTool?.id === tool.id ? '#1D4ED8' : '#111827',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {tool.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#6B7280',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {tool.description}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flexShrink: 0
                        }}>
                          {tool.priority === 'high' && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: '#10B981'
                            }}></div>
                          )}
                          <ChevronRight style={{ 
                            width: '16px', 
                            height: '16px', 
                            color: selectedTool?.id === tool.id ? '#3B82F6' : '#9CA3AF'
                          }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        borderTop: '1px solid #F3F4F6',
        backgroundColor: '#F9FAFB'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '12px',
            color: '#6B7280',
            marginBottom: '4px'
          }}>Select any tool above</div>
          <div style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#2563EB'
          }}>Dr. Maya will demonstrate it visually</div>
        </div>
      </div>
    </div>
  );
};