import React, { useState, useEffect } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { 
  Activity, Stethoscope, Search, Calendar, Users, 
  Shield, Pill, Scissors, Heart, TrendingUp, 
  Eye, Sparkles, ChevronRight, Play
} from 'lucide-react';
import RadiantCompassLogo from '../assets/radiant-compass-logo.png'; 

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
    gradient: "linear-gradient(135deg, #34D399 0%, #10B981 100%)", 
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
    gradient: "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)", 
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
    gradient: "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)", 
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
    gradient: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)", 
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
      width: '360px', 
      height: '100%',
      backgroundColor: '#F8F9FA', 
      borderRight: '1px solid #E0E0E0',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
    }}>
      {/* Elegant Header */}
      <div style={{
        padding: '32px 28px', 
        borderBottom: '1px solid #EEEEEE',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px', 
          marginBottom: '20px' 
        }}>
          <img src={RadiantCompassLogo} alt="Radiant Compass Logo" style={{ width: '50px', height: '50px' }} /> 
          <div>
            <h2 style={{
              fontSize: '24px', 
              fontWeight: 700,
              color: '#212121',
              margin: 0
            }}>RadiantCompass</h2>
            <p style={{
              fontSize: '15px', 
              color: '#757575',
              margin: 0
            }}>Journey Tools</p>
          </div>
        </div>
        
        {/* Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px', 
          padding: '16px 20px', 
          borderRadius: '12px', 
          transition: 'all 0.3s ease',
          backgroundColor: isExecuting ? '#E8F5E9' : '#F5F5F5', 
          border: isExecuting ? '1px solid #81C784' : '1px solid #E0E0E0', 
          boxShadow: isExecuting ? '0 4px 12px rgba(76, 175, 80, 0.2)' : 'none'
        }}>
          <div style={{
            width: '10px', 
            height: '10px', 
            borderRadius: '50%',
            backgroundColor: isExecuting ? '#4CAF50' : '#BDBDBD', 
            animation: isExecuting ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
          }} />
          <span style={{
            fontSize: '16px', 
            color: isExecuting ? '#388E3C' : '#424242',
            fontWeight: 500
          }}>
            {isExecuting ? 'Activating tool...' : 'Ready to demonstrate'}
          </span>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{
        padding: '20px 28px', 
        borderBottom: '1px solid #EEEEEE',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px' 
        }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 18px', 
                borderRadius: '30px', 
                fontSize: '14px', 
                fontWeight: 500,
                transition: 'all 0.2s ease',
                border: '1px solid #E0E0E0',
                cursor: 'pointer',
                backgroundColor: selectedCategory === category ? '#E3F2FD' : '#F5F5F5', 
                color: selectedCategory === category ? '#1976D2' : '#616161', 
                boxShadow: selectedCategory === category ? '0 2px 6px rgba(25, 118, 210, 0.1)' : 'none'
              }}
              onMouseOver={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = '#E0E0E0';
                  e.currentTarget.style.borderColor = '#BDBDBD';
                }
              }}
              onMouseOut={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = '#F5F5F5';
                  e.currentTarget.style.borderColor = '#E0E0E0';
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
        padding: '28px', 
        backgroundColor: '#F8F9FA'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}> 
          {JOURNEY_STAGES.map((stage) => {
            const stageTools = stage.tools.filter(tool => 
              selectedCategory === 'all' || tool.category === selectedCategory
            );
            
            if (stageTools.length === 0) return null;
            
            const StageIcon = stage.icon;
            
            return (
              <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}> 
                {/* Stage Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px', 
                  marginBottom: '10px' 
                }}>
                  <div style={{
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '10px', 
                    background: stage.gradient, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <StageIcon style={{ width: '16px', height: '16px', color: 'white' }} /> 
                  </div>
                  <div>
                    <div style={{
                      fontSize: '17px', 
                      fontWeight: 600,
                      color: '#212121'
                    }}>Stage {stage.id}</div>
                    <div style={{
                      fontSize: '14px', 
                      color: '#757575'
                    }}>{stage.theme}</div>
                  </div>
                </div>

                {/* Stage Tools */}
                <div style={{
                  marginLeft: '44px', 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px' 
                }}>
                  {stageTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolClick(tool)}
                      style={{
                        width: '100%',
                        padding: '22px', 
                        borderRadius: '16px', 
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        border: selectedTool?.id === tool.id 
                          ? '2px solid #42A5F5' 
                          : '1px solid #E0E0E0',
                        backgroundColor: selectedTool?.id === tool.id 
                          ? 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' 
                          : '#FFFFFF',
                        cursor: 'pointer',
                        boxShadow: selectedTool?.id === tool.id 
                          ? '0 6px 18px rgba(66, 165, 245, 0.25)' 
                          : '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }}
                      onMouseOver={(e) => {
                        if (selectedTool?.id !== tool.id) {
                          e.currentTarget.style.borderColor = '#BDBDBD';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedTool?.id !== tool.id) {
                          e.currentTarget.style.borderColor = '#E0E0E0';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px' 
                      }}>
                        <div style={{ 
                          fontSize: '26px', 
                          flexShrink: 0
                        }}>{tool.icon}</div>
                        <div style={{
                          flex: 1,
                          minWidth: 0
                        }}>
                          <div style={{
                            fontSize: '17px', 
                            fontWeight: 600,
                            color: selectedTool?.id === tool.id ? '#1565C0' : '#212121', 
                            marginBottom: '6px', 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {tool.name}
                          </div>
                          <div style={{
                            fontSize: '14px', 
                            color: '#757575',
                            lineHeight: '1.6', 
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
                          gap: '8px', 
                          flexShrink: 0
                        }}>
                          {tool.priority === 'high' && (
                            <div style={{
                              width: '10px', 
                              height: '10px', 
                              borderRadius: '50%',
                              backgroundColor: '#4CAF50' 
                            }}></div>
                          )}
                          <ChevronRight style={{ 
                            width: '20px', 
                            height: '20px', 
                            color: selectedTool?.id === tool.id ? '#1976D2' : '#9E9E9E' 
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
        padding: '20px 28px', 
        borderTop: '1px solid #EEEEEE',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.03)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '14px', 
            color: '#757575',
            marginBottom: '6px' 
          }}>Select any tool above</div>
          <div style={{
            fontSize: '14px', 
            fontWeight: 600,
            color: '#1976D2'
          }}>Dr. Maya will demonstrate it visually</div>
        </div>
      </div>
    </div>
  );
};