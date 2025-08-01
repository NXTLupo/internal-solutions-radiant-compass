import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface LongTermLivingProps {
  onBackToDashboard?: () => void;
}

interface WellnessPlan {
  category: string;
  icon: string;
  status: 'excellent' | 'good' | 'needs-attention';
  score: number;
  strategies: string[];
  goals: string[];
}

interface AdvocacyOpportunity {
  id: string;
  title: string;
  type: 'research' | 'awareness' | 'support' | 'policy';
  description: string;
  timeCommitment: string;
  impact: 'high' | 'medium' | 'low';
  participants: number;
}

interface LifestylePlan {
  area: string;
  currentStatus: string;
  improvements: string[];
  resources: string[];
  progress: number;
}

const wellnessPlans: WellnessPlan[] = [
  {
    category: 'Physical Wellness',
    icon: '💪',
    status: 'good',
    score: 8,
    strategies: [
      'Regular gentle exercise routine',
      'Balanced nutrition plan',
      'Adequate sleep schedule',
      'Stress management techniques'
    ],
    goals: [
      'Maintain current fitness level',
      'Improve flexibility and mobility',
      'Optimize nutrition for condition management'
    ]
  },
  {
    category: 'Mental Health',
    icon: '🧠',
    status: 'excellent',
    score: 9,
    strategies: [
      'Regular therapy sessions',
      'Mindfulness and meditation',
      'Positive social connections',
      'Meaningful activities and hobbies'
    ],
    goals: [
      'Continue therapy as needed',
      'Build resilience skills',
      'Maintain work-life balance'
    ]
  },
  {
    category: 'Social Connections',
    icon: '👥',
    status: 'good',
    score: 7,
    strategies: [
      'Active in support groups',
      'Regular family time',
      'Professional network maintenance',
      'Community involvement'
    ],
    goals: [
      'Expand social circle',
      'Mentor newly diagnosed patients',
      'Build deeper relationships'
    ]
  },
  {
    category: 'Career & Purpose',
    icon: '🎯',
    status: 'needs-attention',
    score: 6,
    strategies: [
      'Workplace accommodations',
      'Flexible work arrangements',
      'Professional development',
      'Advocacy involvement'
    ],
    goals: [
      'Explore new career opportunities',
      'Find meaningful work projects',
      'Balance ambition with health needs'
    ]
  }
];

const advocacyOpportunities: AdvocacyOpportunity[] = [
  {
    id: '1',
    title: 'Rare Disease Research Participation',
    type: 'research',
    description: 'Participate in a longitudinal study tracking quality of life outcomes for patients with rare autoimmune conditions.',
    timeCommitment: '2 hours quarterly',
    impact: 'high',
    participants: 247
  },
  {
    id: '2',
    title: 'Patient Story Campaign',
    type: 'awareness',
    description: 'Share your journey to help raise awareness about rare diseases and reduce stigma in the community.',
    timeCommitment: '3-5 hours monthly',
    impact: 'high',
    participants: 89
  },
  {
    id: '3',
    title: 'New Patient Mentorship',
    type: 'support',
    description: 'Mentor newly diagnosed patients through their early journey stages, providing guidance and emotional support.',
    timeCommitment: '1-2 hours weekly',
    impact: 'high',
    participants: 156
  },
  {
    id: '4',
    title: 'Healthcare Policy Advisory Board',
    type: 'policy',
    description: 'Advise healthcare organizations on policy improvements for rare disease patient care and access.',
    timeCommitment: '4 hours monthly',
    impact: 'medium',
    participants: 23
  }
];

const lifestylePlans: LifestylePlan[] = [
  {
    area: 'Work-Life Balance',
    currentStatus: 'Good balance with flexible arrangements',
    improvements: [
      'Set clearer boundaries between work and rest',
      'Plan regular vacation time for recovery',
      'Communicate needs more effectively with colleagues'
    ],
    resources: [
      'Workplace accommodation guidelines',
      'Time management apps',
      'Professional counseling services'
    ],
    progress: 75
  },
  {
    area: 'Relationship Management',
    currentStatus: 'Strong support network with room for growth',
    improvements: [
      'Deepen existing friendships',
      'Communicate health needs more openly',
      'Build relationships outside of health context'
    ],
    resources: [
      'Communication workshops',
      'Social clubs and activities',
      'Relationship counseling resources'
    ],
    progress: 80
  },
  {
    area: 'Future Planning',
    currentStatus: 'Basic plans in place, needs refinement',
    improvements: [
      'Create comprehensive financial plan',
      'Develop career advancement strategy',
      'Plan for potential health changes'
    ],
    resources: [
      'Financial planning services',
      'Career counseling',
      'Legal planning resources'
    ],
    progress: 60
  }
];

export const LongTermLiving: React.FC<LongTermLivingProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'wellness' | 'advocacy' | 'lifestyle'>('wellness');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'needs-attention': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 border-green-200';
      case 'good': return 'bg-blue-100 border-blue-200';
      case 'needs-attention': return 'bg-yellow-100 border-yellow-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return '🔬';
      case 'awareness': return '📢';
      case 'support': return '🤝';
      case 'policy': return '🏛️';
      default: return '📋';
    }
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
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-teal-100 to-blue-100 border border-blue-300">
                <span className="text-sm font-medium text-blue-800">🌟 Stage 7: Long-Term Living</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thriving in Your New Normal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build a fulfilling long-term life, give back to the community, and continue growing while managing your condition.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-orange-200">
            {[
              { id: 'wellness', label: 'Wellness Planning', icon: '🌿' },
              { id: 'advocacy', label: 'Advocacy Platform', icon: '📢' },
              { id: 'lifestyle', label: 'Lifestyle Optimization', icon: '✨' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow-md'
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
          {/* Wellness Planning Tab */}
          {activeTab === 'wellness' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Comprehensive Wellness Plan</h2>
                  <p className="text-gray-600">
                    Maintain and improve your overall wellbeing across all areas of life while managing your condition.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wellnessPlans.map((plan, index) => (
                    <div key={index} className={`border rounded-lg p-6 ${getStatusBg(plan.status)} hover:shadow-md transition-all duration-200`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{plan.icon}</span>
                          <h3 className="text-lg font-semibold text-gray-900">{plan.category}</h3>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getStatusColor(plan.status)}`}>
                            {plan.score}/10
                          </div>
                          <div className="text-xs text-gray-500 capitalize">{plan.status.replace('-', ' ')}</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Current Strategies:</h4>
                        <div className="space-y-1">
                          {plan.strategies.map((strategy, strategyIndex) => (
                            <div key={strategyIndex} className="flex items-center space-x-2">
                              <span className="text-green-500 text-sm">✓</span>
                              <span className="text-sm text-gray-700">{strategy}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Goals:</h4>
                        <div className="space-y-1">
                          {plan.goals.map((goal, goalIndex) => (
                            <div key={goalIndex} className="flex items-center space-x-2">
                              <span className="text-blue-500 text-sm">🎯</span>
                              <span className="text-sm text-gray-700">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-teal-500 hover:to-blue-600 transition-all duration-200">
                        Update Plan
                      </button>
                    </div>
                  ))}
                </div>

                {/* Wellness Summary */}
                <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">🌟 Overall Wellness Score</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-4xl font-bold text-green-600">7.5/10</div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">Excellent Progress!</div>
                      <div className="text-sm text-gray-600">You're thriving in most areas with room for growth in career development.</div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-green-500 hover:to-emerald-600 transition-all duration-200">
                    Get Personalized Recommendations
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Advocacy Platform Tab */}
          {activeTab === 'advocacy' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Make a Difference</h2>
                  <p className="text-gray-600">
                    Use your experience to help others and advance rare disease research and awareness.
                  </p>
                </div>

                <div className="space-y-6">
                  {advocacyOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="text-2xl">{getTypeIcon(opportunity.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getImpactColor(opportunity.impact)}`}>
                                {opportunity.impact.charAt(0).toUpperCase() + opportunity.impact.slice(1)} Impact
                              </span>
                            </div>
                            <p className="text-gray-600 mb-3">{opportunity.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>⏱️ {opportunity.timeCommitment}</span>
                              <span>👥 {opportunity.participants} participants</span>
                              <span className="capitalize">📋 {opportunity.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-teal-500 hover:to-blue-600 transition-all duration-200">
                          Get Involved
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                          Learn More
                        </button>
                        <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200">
                          Share with Friends
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Your Impact */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">🏆 Your Impact So Far</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                      <div className="text-sm text-gray-600">Patients Mentored</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
                      <div className="text-sm text-gray-600">Research Studies</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600 mb-1">48</div>
                      <div className="text-sm text-gray-600">Hours Contributed</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your advocacy efforts have made a real difference in the rare disease community. Thank you for giving back!
                  </p>
                  <button className="bg-gradient-to-r from-purple-400 to-pink-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-purple-500 hover:to-pink-600 transition-all duration-200">
                    View Full Impact Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lifestyle Optimization Tab */}
          {activeTab === 'lifestyle' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Lifestyle Optimization</h2>
                  <p className="text-gray-600">
                    Fine-tune your lifestyle to maximize wellbeing, productivity, and happiness in your long-term living.
                  </p>
                </div>

                <div className="space-y-6">
                  {lifestylePlans.map((plan, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-200 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{plan.area}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{plan.progress}%</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full"
                              style={{ width: `${plan.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Current Status:</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{plan.currentStatus}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Planned Improvements:</h4>
                          <ul className="space-y-1">
                            {plan.improvements.map((improvement, improvementIndex) => (
                              <li key={improvementIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Available Resources:</h4>
                          <ul className="space-y-1">
                            {plan.resources.map((resource, resourceIndex) => (
                              <li key={resourceIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{resource}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-teal-500 hover:to-blue-600 transition-all duration-200">
                          Update Plan
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                          Get Coaching
                        </button>
                        <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200">
                          Find Resources
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Life Vision */}
                <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-orange-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">🔮 Your Life Vision</h3>
                  <p className="text-gray-600 mb-4">
                    What does your ideal life look like? Create a vision for your future that encompasses all aspects of wellbeing.
                  </p>
                  <div className="mb-4">
                    <textarea
                      rows={4}
                      placeholder="Describe your vision for a fulfilling life with your condition..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-yellow-500 hover:to-orange-600 transition-all duration-200">
                      Save Vision
                    </button>
                    <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                      Get Vision Coaching
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Completion Celebration */}
        <div className="mt-8 bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl border border-blue-300 p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">You've Completed Your Journey!</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Congratulations on navigating all seven stages of your healthcare journey! You've shown incredible strength, 
              resilience, and growth. You're now thriving in your new normal and making a positive impact on others.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-teal-500 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg">
                Share Your Success Story
              </button>
              <button className="bg-white text-gray-700 px-8 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongTermLiving;