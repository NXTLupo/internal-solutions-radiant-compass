import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface EarlyRecoveryProps {
  onBackToDashboard?: () => void;
}

interface ScanResult {
  id: string;
  date: string;
  type: string;
  status: 'improved' | 'stable' | 'concerning';
  summary: string;
  keyFindings: string[];
  nextSteps: string[];
}

interface QualityOfLifePlan {
  category: string;
  currentScore: number;
  targetScore: number;
  strategies: string[];
  progress: number;
}

interface ReflectionEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: number;
  insights: string[];
}

const recentScans: ScanResult[] = [
  {
    id: '1',
    date: '2024-02-10',
    type: 'Blood Work Panel',
    status: 'improved',
    summary: 'Significant improvement in inflammatory markers and overall blood chemistry.',
    keyFindings: [
      'C-reactive protein decreased by 60%',
      'ESR levels normalized',
      'Liver function stable',
      'No concerning changes in CBC'
    ],
    nextSteps: [
      'Continue current medication regimen',
      'Repeat labs in 3 months',
      'Monitor for any new symptoms'
    ]
  },
  {
    id: '2',
    date: '2024-01-28',
    type: 'MRI Follow-up',
    status: 'stable',
    summary: 'Disease activity remains stable with no new lesions or progression.',
    keyFindings: [
      'No new inflammatory lesions',
      'Previous lesions showing signs of healing',
      'No structural damage progression',
      'Overall stable appearance'
    ],
    nextSteps: [
      'Continue monitoring',
      'Next MRI in 6 months',
      'Report any new neurological symptoms'
    ]
  }
];

const qualityOfLifePlans: QualityOfLifePlan[] = [
  {
    category: 'Physical Function',
    currentScore: 7,
    targetScore: 9,
    strategies: [
      'Daily gentle exercise routine',
      'Physical therapy sessions',
      'Pain management techniques',
      'Energy conservation strategies'
    ],
    progress: 70
  },
  {
    category: 'Social Connections',
    currentScore: 6,
    targetScore: 8,
    strategies: [
      'Regular social activities',
      'Support group participation',
      'Family relationship building',
      'New hobby groups'
    ],
    progress: 60
  },
  {
    category: 'Work/Career',
    currentScore: 5,
    targetScore: 8,
    strategies: [
      'Workplace accommodations',
      'Flexible schedule arrangements',
      'Career counseling',
      'Skill development programs'
    ],
    progress: 45
  },
  {
    category: 'Mental Wellbeing',
    currentScore: 8,
    targetScore: 9,
    strategies: [
      'Regular therapy sessions',
      'Mindfulness practice',
      'Stress reduction techniques',
      'Positive coping strategies'
    ],
    progress: 85
  }
];

export const EarlyRecovery: React.FC<EarlyRecoveryProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'scans' | 'planning' | 'reflection'>('scans');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'improved': return 'bg-green-100 text-green-800 border-green-200';
      case 'stable': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'concerning': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'improved': return '📈';
      case 'stable': return '➡️';
      case 'concerning': return '⚠️';
      default: return '📊';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  <span>←</span>
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
              )}
              <RadiantLogo size="md" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 border border-teal-300">
                <span className="text-sm font-medium text-teal-800">🌱 Stage 6: Early Recovery</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Early Recovery & Planning
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrate your progress, interpret scan results, and plan for your improved quality of life ahead.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-orange-200">
            {[
              { id: 'scans', label: 'Scan Interpretation', icon: '🔬' },
              { id: 'planning', label: 'Quality of Life Planning', icon: '🎯' },
              { id: 'reflection', label: 'Reflection & Growth', icon: '💭' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Scan Interpretation Tab */}
          {activeTab === 'scans' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Scan Results</h2>
                  <p className="text-gray-600">
                    AI-powered interpretation of your latest medical scans and test results.
                  </p>
                </div>

                <div className="space-y-6">
                  {recentScans.map((scan) => (
                    <div key={scan.id} className="border border-gray-200 rounded-lg p-6 hover:border-teal-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{scan.type}</h3>
                            <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full font-medium border ${getStatusColor(scan.status)}`}>
                              <span className="mr-1">{getStatusIcon(scan.status)}</span>
                              {scan.status.charAt(0).toUpperCase() + scan.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{new Date(scan.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          <p className="text-gray-700 mb-4">{scan.summary}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Key Findings:</h4>
                          <ul className="space-y-2">
                            {scan.keyFindings.map((finding, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                                <span className="text-teal-500 mt-1">•</span>
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Next Steps:</h4>
                          <ul className="space-y-2">
                            {scan.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                        <button className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-emerald-500 hover:to-teal-600 transition-all duration-200">
                          View Full Report
                        </button>
                        <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200">
                          Share with Doctor
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                          Ask Questions
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Insights */}
                <div className="mt-8 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <span className="mr-2">🤖</span>
                    AI Health Insights
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Based on your recent test results, your treatment appears to be working well. The significant decrease in inflammatory markers suggests your condition is responding positively to therapy.
                  </p>
                  <div className="flex space-x-3">
                    <button className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-teal-500 hover:to-cyan-600 transition-all duration-200">
                      Get Detailed Analysis
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                      Schedule Follow-up
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quality of Life Planning Tab */}
          {activeTab === 'planning' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Quality of Life Planning</h2>
                  <p className="text-gray-600">
                    Set goals and strategies to maximize your quality of life as you continue your recovery journey.
                  </p>
                </div>

                <div className="space-y-6">
                  {qualityOfLifePlans.map((plan, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-teal-200 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{plan.category}</h3>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className={`text-xl font-bold ${getScoreColor(plan.currentScore)}`}>
                              {plan.currentScore}/10
                            </div>
                            <div className="text-xs text-gray-500">Current</div>
                          </div>
                          <span className="text-gray-400">→</span>
                          <div className="text-center">
                            <div className="text-xl font-bold text-green-600">
                              {plan.targetScore}/10
                            </div>
                            <div className="text-xs text-gray-500">Target</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Progress</span>
                          <span className="text-sm text-gray-600">{plan.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${plan.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Current Strategies:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {plan.strategies.map((strategy, strategyIndex) => (
                            <div key={strategyIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                              <span className="text-sm text-gray-700">{strategy}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-emerald-500 hover:to-teal-600 transition-all duration-200">
                          Update Plan
                        </button>
                        <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200">
                          Add Strategy
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                          View Resources
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Goal Setting Assistant */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 Goal Setting Assistant</h3>
                  <p className="text-gray-600 mb-4">
                    Let our AI help you set realistic and achievable quality of life goals based on your current progress.
                  </p>
                  <button className="bg-gradient-to-r from-purple-400 to-pink-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-purple-500 hover:to-pink-600 transition-all duration-200">
                    Create Personalized Goals
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reflection Tab */}
          {activeTab === 'reflection' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Reflection & Personal Growth</h2>
                  <p className="text-gray-600">
                    Take time to reflect on your journey, celebrate your progress, and plan for the future.
                  </p>
                </div>

                {/* Reflection Prompts */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Reflection</h3>
                  <div className="space-y-4">
                    {[
                      "What am I most grateful for in my recovery journey?",
                      "What challenges have I overcome that I'm proud of?",
                      "How has this experience changed my perspective on life?",
                      "What support has been most valuable to me?",
                      "What do I want to focus on moving forward?"
                    ].map((prompt, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">{prompt}</label>
                        <textarea
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Share your thoughts..."
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-500 hover:to-teal-600 transition-all duration-200 shadow-md">
                      Save Reflection Entry
                    </button>
                  </div>
                </div>

                {/* Progress Celebration */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Celebrate Your Progress</h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                    <div className="text-center mb-6">
                      <div className="text-6xl mb-4">🎉</div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">You've Come So Far!</h4>
                      <p className="text-gray-600">
                        Take a moment to acknowledge the strength, resilience, and progress you've shown throughout your journey.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">6</div>
                        <div className="text-sm text-gray-600">Months in Journey</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">78%</div>
                        <div className="text-sm text-gray-600">Treatment Effectiveness</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600 mb-1">15</div>
                        <div className="text-sm text-gray-600">Support Connections</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-green-500 hover:to-emerald-600 transition-all duration-200">
                        Share Your Success Story
                      </button>
                    </div>
                  </div>
                </div>

                {/* Future Planning */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">🔮 Planning for the Future</h3>
                  <p className="text-gray-600 mb-4">
                    As you continue to improve, start thinking about your long-term goals and the life you want to build.
                  </p>
                  <div className="flex space-x-3">
                    <button className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-200">
                      Create Future Vision
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                      Set Long-term Goals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl border border-teal-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Long-Term Living?</h3>
              <p className="text-gray-600 text-sm">
                As you establish your new normal and focus on thriving with your condition, 
                you can move on to Stage 7: Long-Term Living.
              </p>
            </div>
            <button className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-500 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Continue to Stage 7 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarlyRecovery;