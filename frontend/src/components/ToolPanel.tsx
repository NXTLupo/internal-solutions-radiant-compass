import React, { useState, useEffect } from 'react';
import { useCopilotAction } from '@copilotkit/react-core';
import { 
  Activity, Stethoscope, Search, Calendar, Users, 
  Shield, Pill, Scissors, Heart, TrendingUp, 
  Eye, Sparkles, ChevronDown, ChevronUp, Play
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
    theme: "From Fear to Understanding",
    icon: Activity,
    color: "#10B981",
    gradient: "from-emerald-500 to-teal-600",
    tools: [
      { id: "symptom-tracker", name: "Symptom Tracker", description: "Document progression and patterns", category: "tracking", icon: "📊", stage: 1, priority: "high" },
      { id: "appointment-prep", name: "Appointment Prep", description: "Optimize initial doctor visits", category: "planning", icon: "📋", stage: 1, priority: "high" },
      { id: "ai-symptom-sage", name: "AI Symptom Sage", description: "Real-time symptom interpretation", category: "ai", icon: "🧠", stage: 1, priority: "high" }
    ]
  },
  {
    id: 2,
    name: "Specialist Work-up & Diagnosis",
    theme: "From Shock to Clarity", 
    icon: Stethoscope,
    color: "#3B82F6",
    gradient: "from-blue-500 to-indigo-600",
    tools: [
      { id: "medical-translator", name: "Medical Translator", description: "Convert complex reports to plain language", category: "translation", icon: "🔤", stage: 2, priority: "high" },
      { id: "question-generator", name: "Question Generator", description: "AI-generated consultation checklists", category: "preparation", icon: "❓", stage: 2, priority: "high" },
      { id: "peer-connection", name: "Peer Connection", description: "Connect with similar diagnosis", category: "community", icon: "👥", stage: 2, priority: "medium" }
    ]
  },
  {
    id: 3,
    name: "Research & Compare-Care",
    theme: "From Confusion to Clarity",
    icon: Search,
    color: "#8B5CF6", 
    gradient: "from-purple-500 to-violet-600",
    tools: [
      { id: "compare-care", name: "Compare-My-Care™", description: "Rank hospitals by outcomes & culture", category: "comparison", icon: "⚖️", stage: 3, priority: "high" },
      { id: "insurance-analyzer", name: "Insurance Analyzer", description: "Coverage and network navigation", category: "financial", icon: "🛡️", stage: 3, priority: "high" },
      { id: "travel-planner", name: "Travel Planner", description: "Accommodation and logistics", category: "logistics", icon: "✈️", stage: 3, priority: "medium" }
    ]
  },
  {
    id: 4,
    name: "Staging & Baseline Testing",
    theme: "From Uncertainty to Planning",
    icon: Calendar,
    color: "#F59E0B",
    gradient: "from-amber-500 to-orange-600", 
    tools: [
      { id: "staging-translator", name: "Staging Translator", description: "Plain-language staging explanations", category: "education", icon: "📖", stage: 4, priority: "high" },
      { id: "test-coordinator", name: "Test Coordinator", description: "Cross-department scheduling", category: "scheduling", icon: "🗓️", stage: 4, priority: "high" },
      { id: "results-repository", name: "Results Repository", description: "Organized storage of test results", category: "organization", icon: "📁", stage: 4, priority: "medium" }
    ]
  },
  {
    id: 5,
    name: "Treatment Planning",
    theme: "From Options to Decision",
    icon: Users,
    color: "#EF4444",
    gradient: "from-red-500 to-rose-600",
    tools: [
      { id: "tumor-board", name: "Virtual Tumor Board", description: "Patient representation in planning", category: "planning", icon: "🎯", stage: 5, priority: "high" },
      { id: "treatment-visualizer", name: "Treatment Visualizer", description: "Compare approaches with visual aids", category: "visualization", icon: "📊", stage: 5, priority: "high" },
      { id: "trial-matcher", name: "Trial Matcher", description: "Clinical trial eligibility screening", category: "research", icon: "🔬", stage: 5, priority: "medium" }
    ]
  },
  {
    id: 6,
    name: "Insurance & Travel Setup", 
    theme: "From Bureaucracy to Preparation",
    icon: Shield,
    color: "#06B6D4",
    gradient: "from-cyan-500 to-sky-600",
    tools: [
      { id: "appeals-assistant", name: "Appeals Assistant", description: "Automated insurance appeals", category: "advocacy", icon: "⚔️", stage: 6, priority: "high" },
      { id: "cost-calculator", name: "Cost Calculator", description: "Transparent pricing & planning", category: "financial", icon: "💰", stage: 6, priority: "high" },
      { id: "accommodation-concierge", name: "Accommodation Concierge", description: "Curated options near centers", category: "logistics", icon: "🏨", stage: 6, priority: "medium" }
    ]
  },
  {
    id: 7,
    name: "Neoadjuvant Therapy",
    theme: "From Endurance to Empowerment", 
    icon: Pill,
    color: "#84CC16",
    gradient: "from-lime-500 to-green-600",
    tools: [
      { id: "side-effect-tracker", name: "Side Effect Tracker", description: "AI-powered monitoring with alerts", category: "monitoring", icon: "⚠️", stage: 7, priority: "high" },
      { id: "treatment-calendar", name: "Treatment Calendar", description: "Integrated scheduling with reminders", category: "scheduling", icon: "📅", stage: 7, priority: "high" },
      { id: "nutrition-support", name: "Nutrition Support", description: "Personalized dietary guidance", category: "wellness", icon: "🥗", stage: 7, priority: "medium" }
    ]
  },
  {
    id: 8,
    name: "Surgery & Local Treatment",
    theme: "From Fear to Recovery",
    icon: Scissors,
    color: "#F97316",
    gradient: "from-orange-500 to-red-600",
    tools: [
      { id: "surgical-prep", name: "Surgical Prep Suite", description: "Complete preparation checklist", category: "preparation", icon: "🏥", stage: 8, priority: "high" },
      { id: "virtual-tour", name: "Virtual Hospital Tour", description: "Immersive procedure explanation", category: "education", icon: "🏛️", stage: 8, priority: "medium" },
      { id: "recovery-tracker", name: "Recovery Tracker", description: "Progress monitoring with expectations", category: "monitoring", icon: "📈", stage: 8, priority: "high" }
    ]
  },
  {
    id: 9,
    name: "Maintenance Therapy",
    theme: "From Survival to Thriving",
    icon: Heart,
    color: "#EC4899",
    gradient: "from-pink-500 to-rose-600", 
    tools: [
      { id: "recovery-planner", name: "Recovery Planner", description: "Balance treatment and recovery", category: "planning", icon: "📋", stage: 9, priority: "high" },
      { id: "complementary-guide", name: "Complementary Guide", description: "Evidence-based alternative approaches", category: "wellness", icon: "🌿", stage: 9, priority: "medium" },
      { id: "completion-countdown", name: "Completion Countdown", description: "Milestone celebration system", category: "motivation", icon: "🎉", stage: 9, priority: "medium" }
    ]
  },
  {
    id: 10,
    name: "Early Recovery",
    theme: "From Treatment to Healing",
    icon: TrendingUp,
    color: "#10B981", 
    gradient: "from-emerald-500 to-green-600",
    tools: [
      { id: "milestone-tracker", name: "Milestone Tracker", description: "Realistic expectation management", category: "tracking", icon: "🎯", stage: 10, priority: "high" },
      { id: "rehab-program", name: "Rehab Program", description: "Physical therapy optimization", category: "rehabilitation", icon: "💪", stage: 10, priority: "high" },
      { id: "scan-anxiety", name: "Scan Anxiety Tools", description: "Preparation and coping strategies", category: "mental-health", icon: "🧘", stage: 10, priority: "medium" }
    ]
  },
  {
    id: 11,
    name: "Surveillance & Rehabilitation",
    theme: "From Monitoring to Living",
    icon: Eye,
    color: "#6366F1",
    gradient: "from-indigo-500 to-blue-600",
    tools: [
      { id: "surveillance-manager", name: "Surveillance Manager", description: "Automated reminders & coordination", category: "scheduling", icon: "👁️", stage: 11, priority: "high" },
      { id: "survivorship-planner", name: "Survivorship Planner", description: "Comprehensive long-term planning", category: "planning", icon: "🗺️", stage: 11, priority: "high" },
      { id: "lifestyle-optimizer", name: "Lifestyle Optimizer", description: "Survivor-specific health recommendations", category: "wellness", icon: "⚡", stage: 11, priority: "medium" }
    ]
  },
  {
    id: 12,
    name: "Long-term Living",
    theme: "From Management to Mastery",
    icon: Sparkles,
    color: "#8B5CF6",
    gradient: "from-violet-500 to-purple-600", 
    tools: [
      { id: "survivorship-care", name: "Survivorship Care", description: "Lifelong health management", category: "planning", icon: "🌟", stage: 12, priority: "high" },
      { id: "mentorship-program", name: "Mentorship Program", description: "Connect with newly diagnosed", category: "community", icon: "🤝", stage: 12, priority: "medium" },
      { id: "legacy-docs", name: "Legacy Documentation", description: "Comprehensive medical history", category: "documentation", icon: "📜", stage: 12, priority: "medium" }
    ]
  }
];

export const ToolPanel: React.FC = () => {
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set([1, 2, 3]));
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // CopilotKit action to trigger tool demonstrations
  useCopilotAction({
    name: "demonstrateTool",
    description: "Trigger Dr. Maya to demonstrate a specific RadiantCompass tool autonomously.",
    parameters: [
      { name: "toolId", type: "string", description: "The unique identifier of the tool to demonstrate" },
      { name: "toolName", type: "string", description: "The name of the tool for context" },
      { name: "toolDescription", type: "string", description: "The tool description for guidance" },
      { name: "stage", type: "number", description: "The journey stage number" }
    ],
    handler: async ({ toolId, toolName, toolDescription, stage }) => {
      console.log(`[ToolPanel] Triggering demonstration for ${toolName} (${toolId}) in stage ${stage}`);
      setIsExecuting(true);
      
      // Create contextual message for Dr. Maya
      const demonstrationMessage = `Dr. Maya, the user has selected the "${toolName}" tool from Stage ${stage}. This tool is designed to ${toolDescription.toLowerCase()}. Please acknowledge their selection and begin demonstrating this tool by walking them through its capabilities step-by-step. Show them how this tool works autonomously and guide them through a complete demonstration of its features.`;
      
      // Simulate execution delay
      setTimeout(() => {
        setIsExecuting(false);
      }, 2000);
      
      return {
        success: true,
        message: demonstrationMessage,
        toolContext: {
          id: toolId,
          name: toolName,
          description: toolDescription,
          stage: stage,
          demonstrationMode: true
        }
      };
    }
  });

  const toggleStage = (stageId: number) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  const handleToolSelect = async (tool: Tool) => {
    setSelectedTool(tool);
    
    // Trigger the CopilotKit action
    // This would normally be handled by the useCopilotAction, but we'll call it manually for demo
    const demonstrationMessage = `Dr. Maya, the user has selected the "${tool.name}" tool from Stage ${tool.stage}. This tool is designed to ${tool.description.toLowerCase()}. Please acknowledge their selection and begin demonstrating this tool by walking them through its capabilities step-by-step. Show them how this tool works autonomously and guide them through a complete demonstration of its features.`;
    
    console.log('[ToolPanel] Tool selected:', tool.name, demonstrationMessage);
  };

  return (
    <div className="w-80 h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Tool Panel</h2>
            <p className="text-xs text-slate-400">RadiantCompass Journey Tools</p>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          isExecuting 
            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30' 
            : 'bg-slate-800/50 border border-slate-700/50'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isExecuting ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
          }`} />
          <span className="text-xs text-slate-300">
            {isExecuting ? 'Dr. Maya demonstrating...' : 'Ready for demonstrations'}
          </span>
        </div>
      </div>

      {/* Tool Stages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {JOURNEY_STAGES.map((stage) => {
          const isExpanded = expandedStages.has(stage.id);
          const StageIcon = stage.icon;
          
          return (
            <div key={stage.id} className="bg-slate-800/30 rounded-xl border border-slate-700/30 overflow-hidden backdrop-blur-sm">
              {/* Stage Header */}
              <button
                onClick={() => toggleStage(stage.id)}
                className="w-full p-4 flex items-center gap-3 hover:bg-slate-700/30 transition-colors duration-200"
              >
                <div 
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stage.gradient} flex items-center justify-center flex-shrink-0`}
                >
                  <StageIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-white">
                    Stage {stage.id}
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-1">
                    {stage.name}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Stage Tools */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {stage.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool)}
                      className={`w-full p-3 rounded-lg border text-left transition-all duration-200 group hover:scale-[1.02] ${
                        selectedTool?.id === tool.id
                          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50'
                          : 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-700/40 hover:border-slate-600/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{tool.icon}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                            {tool.name}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1">
                            {tool.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {tool.priority === 'high' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          )}
                          <Play className="w-3 h-3 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-500 text-center">
          Select any tool above to trigger<br />
          <span className="text-blue-400 font-medium">Dr. Maya's autonomous demonstration</span>
        </div>
      </div>
    </div>
  );
};