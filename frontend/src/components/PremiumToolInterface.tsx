import React, { useState, useEffect } from 'react';
import { DrMayaAvatar } from './DrMayaAvatar';

/**
 * Premium Tool Interface Component
 * Implements the universal three-zone paradigm for all 200+ RadiantCompass tools
 * Maintains Dr. Maya's central presence while tools materialize around her
 * Preserves generous white space and premium medical aesthetic
 */

type AvatarMode = 
  | 'welcoming'
  | 'listening' 
  | 'speaking'
  | 'concerned'
  | 'encouraging'
  | 'celebrating'
  | 'crisis';

export type ToolCategory = 
  | 'assessment' 
  | 'planning'
  | 'care'
  | 'treatment'
  | 'recovery'
  | 'community'
  | 'learning'
  | 'support';

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  stage: string[];
  icon: string;
  description: string;
  mayaIntroduction: string;
  interfaceType: 'form' | 'interactive' | 'comparison' | 'tracker' | 'guide';
}

interface PremiumToolInterfaceProps {
  tool: Tool;
  onToolComplete?: (toolId: string, results: any) => void;
  onClose?: () => void;
  currentStage?: string;
}

const categoryConfig: Record<ToolCategory, {
  color: string;
  bgColor: string;
  icon: string;
  mayaMode: AvatarMode;
}> = {
  assessment: {
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'from-blue-50 to-indigo-50',
    icon: '🧠',
    mayaMode: 'concerned'
  },
  planning: {
    color: 'from-amber-400 to-yellow-500', 
    bgColor: 'from-amber-50 to-yellow-50',
    icon: '📋',
    mayaMode: 'encouraging'
  },
  care: {
    color: 'from-green-400 to-emerald-500',
    bgColor: 'from-green-50 to-emerald-50',
    icon: '🏥',
    mayaMode: 'welcoming'
  },
  treatment: {
    color: 'from-red-400 to-pink-500',
    bgColor: 'from-red-50 to-pink-50',
    icon: '💊',
    mayaMode: 'encouraging'
  },
  recovery: {
    color: 'from-emerald-400 to-green-500',
    bgColor: 'from-emerald-50 to-green-50',
    icon: '🌱',
    mayaMode: 'celebrating'
  },
  community: {
    color: 'from-purple-400 to-violet-500',
    bgColor: 'from-purple-50 to-violet-50',
    icon: '👥',
    mayaMode: 'welcoming'
  },
  learning: {
    color: 'from-orange-400 to-amber-500',
    bgColor: 'from-orange-50 to-amber-50',
    icon: '📚',
    mayaMode: 'encouraging'
  },
  support: {
    color: 'from-red-500 to-pink-600',
    bgColor: 'from-red-50 to-pink-50',
    icon: '🚨',
    mayaMode: 'crisis'
  }
};

// Sample tools data
const sampleTools: Tool[] = [
  {
    id: 'symptom-tracker',
    name: 'Symptom Tracking Tool',
    category: 'assessment',
    stage: ['awareness_orientation', 'undergo_treatment'],
    icon: '📊',
    description: 'Track and analyze your symptoms with AI-powered pattern recognition',
    mayaIntroduction: "Let's track your symptoms together. I'll help you identify patterns and understand what your body is telling you.",
    interfaceType: 'tracker'
  },
  {
    id: 'compare-care',
    name: 'Compare-My-Care™ Tool',
    category: 'care',
    stage: ['explore_decide'],
    icon: '🏥',
    description: 'Objective comparison of treatment centers based on your specific needs',
    mayaIntroduction: "I'll help you find the perfect care team by comparing hospitals that specialize in your condition.",
    interfaceType: 'comparison'
  },
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

export const PremiumToolInterface: React.FC<PremiumToolInterfaceProps> = ({
  tool,
  onToolComplete,
  onClose,
  currentStage = 'awareness_orientation'
}) => {
  const [toolStep, setToolStep] = useState(1);
  const [toolData, setToolData] = useState({});
  const [isActive, setIsActive] = useState(false);

  const categorySettings = categoryConfig[tool.category];

  useEffect(() => {
    // Tool activation animation
    setIsActive(true);
  }, []);

  const renderToolInterface = () => {
    switch (tool.interfaceType) {
      case 'tracker':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-orange-100 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Symptoms</h3>
              <div className="space-y-4">
                {['Fatigue', 'Joint Pain', 'Sleep Issues', 'Mood Changes'].map((symptom, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{symptom}</span>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          className={`w-8 h-8 rounded-full text-xs font-medium transition-all duration-200 ${
                            level <= 3 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-gray-200 text-gray-500 hover:bg-orange-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['University Medical Center', 'Regional Specialty Hospital'].map((hospital, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-orange-100 shadow-sm">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white">
                      🏥
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{hospital}</h3>
                      <p className="text-sm text-gray-500">2.3 miles away</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Case Volume</span>
                      <span className="text-sm font-medium">200+ annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Insurance</span>
                      <span className="text-sm font-medium text-green-600">✓ In Network</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rating</span>
                      <span className="text-sm font-medium">⭐ 4.8/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'guide':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Immediate Support Available</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-red-100">
                  <h4 className="font-medium text-gray-900 mb-2">Crisis Text Line</h4>
                  <p className="text-sm text-gray-600 mb-3">Text HOME to 741741</p>
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                    Text Now
                  </button>
                </div>
                <div className="bg-white rounded-lg p-4 border border-red-100">
                  <h4 className="font-medium text-gray-900 mb-2">National Suicide Prevention Lifeline</h4>
                  <p className="text-sm text-gray-600 mb-3">Call 988 - Available 24/7</p>
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-xl p-6 border border-orange-100 shadow-sm">
            <p className="text-gray-600">Tool interface loading...</p>
          </div>
        );
    }
  };

  return (
    <div className={`h-screen bg-gradient-to-br ${categorySettings.bgColor} flex transition-all duration-500 ${
      isActive ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* LEFT ZONE: Tool Navigation */}
      <div className="w-20 bg-white/80 backdrop-blur-sm border-r border-orange-200 flex flex-col items-center py-6 space-y-4">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl text-gray-400 hover:text-orange-600 hover:bg-orange-50 flex items-center justify-center text-lg transition-all duration-200"
        >
          ←
        </button>

        {/* Tool Category Icon */}
        <div className={`w-12 h-12 bg-gradient-to-r ${categorySettings.color} rounded-xl flex items-center justify-center text-white text-lg`}>
          {categorySettings.icon}
        </div>

        {/* Tool Progress */}
        <div className="flex flex-col space-y-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                toolStep >= step 
                  ? `bg-gradient-to-r ${categorySettings.color}` 
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* CENTER ZONE: Maya + Tool Interface */}
      <div className="flex-1 flex flex-col p-8">
        {/* Maya Avatar */}
        <div className="flex justify-center mb-8">
          <DrMayaAvatar
            mode={categorySettings.mayaMode}
            stage={currentStage as any}
            size="md"
            showStatus={true}
            message={tool.mayaIntroduction}
          />
        </div>

        {/* Tool Interface */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{tool.name}</h2>
            <p className="text-gray-600">{tool.description}</p>
          </div>

          {renderToolInterface()}

          {/* Tool Actions */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setToolStep(Math.max(1, toolStep - 1))}
              disabled={toolStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Step {toolStep} of 3</span>
            <button
              onClick={() => {
                if (toolStep === 3) {
                  onToolComplete?.(tool.id, toolData);
                } else {
                  setToolStep(toolStep + 1);
                }
              }}
              className={`px-6 py-2 bg-gradient-to-r ${categorySettings.color} text-white rounded-lg hover:shadow-lg transition-all duration-200`}
            >
              {toolStep === 3 ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT ZONE: Tool Context & Results */}
      <div className="w-80 bg-white/60 backdrop-blur-sm border-l border-orange-200 p-6 overflow-y-auto">
        {/* Tool Category */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-3 py-2 rounded-full bg-gradient-to-r ${categorySettings.color} text-white text-sm font-medium mb-2`}>
            <span className="mr-2">{categorySettings.icon}</span>
            {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tool
          </div>
          <p className="text-gray-600 text-sm">Specialized for your current journey stage</p>
        </div>

        {/* Tool Progress */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Progress</h3>
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Completion</span>
              <span className="text-sm text-gray-500">{Math.round((toolStep / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r ${categorySettings.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${(toolStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Related Tools */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Related Tools</h3>
          <div className="space-y-2">
            {sampleTools.filter(t => t.id !== tool.id && t.category === tool.category).slice(0, 2).map((relatedTool) => (
              <button
                key={relatedTool.id}
                className="w-full text-left p-3 bg-white rounded-lg border border-orange-100 hover:border-orange-200 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{relatedTool.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{relatedTool.name}</p>
                    <p className="text-xs text-gray-500">{relatedTool.description.substring(0, 50)}...</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Maya's Insights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Dr. Maya's Insights</h3>
          <div className="bg-white rounded-xl p-4 border border-orange-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              Based on your progress in this tool, I notice you're being very thoughtful about tracking your health. 
              This information will be valuable for your care team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumToolInterface;
