import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface ConditionInfo {
  name: string;
  description: string;
  commonSymptoms: string[];
  treatmentApproaches: string[];
  prognosis: string;
  prevalence: string;
}

interface PersonalGoal {
  id: string;
  category: 'physical' | 'emotional' | 'social' | 'practical';
  title: string;
  description: string;
  timeframe: 'short' | 'medium' | 'long';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

const sampleCondition: ConditionInfo = {
  name: "Rare Genetic Disorder",
  description: "A complex genetic condition that affects multiple body systems. While rare, it's important to understand that you're not alone in this journey.",
  commonSymptoms: [
    "Fatigue and low energy",
    "Joint pain and stiffness",
    "Digestive issues",
    "Sleep disturbances",
    "Cognitive challenges"
  ],
  treatmentApproaches: [
    "Symptom management therapies",
    "Physical therapy and exercise",
    "Dietary modifications",
    "Mental health support",
    "Specialized medical care"
  ],
  prognosis: "With proper management and support, many people with this condition lead fulfilling lives. Early intervention and consistent care can significantly improve outcomes.",
  prevalence: "Affects approximately 1 in 10,000 people worldwide"
};

const goalCategories = {
  physical: { icon: '💪', color: 'from-green-400 to-emerald-500', name: 'Physical Health' },
  emotional: { icon: '❤️', color: 'from-pink-400 to-rose-500', name: 'Emotional Wellbeing' },
  social: { icon: '👥', color: 'from-blue-400 to-indigo-500', name: 'Social Connections' },
  practical: { icon: '🎯', color: 'from-purple-400 to-violet-500', name: 'Practical Needs' }
};

interface AwarenessOrientationProps {
  onBackToDashboard?: () => void;
}

export const AwarenessOrientation: React.FC<AwarenessOrientationProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'condition' | 'goals' | 'quickstart'>('condition');
  const [personalGoals, setPersonalGoals] = useState<PersonalGoal[]>([
    {
      id: '1',
      category: 'physical',
      title: 'Understand my symptoms better',
      description: 'Learn to identify and track my symptoms to communicate effectively with my care team',
      timeframe: 'short',
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      category: 'emotional',
      title: 'Build emotional resilience',
      description: 'Develop coping strategies and find mental health support for this journey',
      timeframe: 'medium',
      priority: 'high',
      completed: false
    },
    {
      id: '3',
      category: 'social',
      title: 'Connect with others',
      description: 'Find peer support groups and connect with others who understand my experience',
      timeframe: 'short',
      priority: 'medium',
      completed: false
    },
    {
      id: '4',
      category: 'practical',
      title: 'Organize my healthcare',
      description: 'Create a system to manage appointments, medications, and medical records',
      timeframe: 'short',
      priority: 'high',
      completed: false
    }
  ]);

  const toggleGoalCompletion = (goalId: string) => {
    setPersonalGoals(goals =>
      goals.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case 'short': return '1-3 months';
      case 'medium': return '3-6 months';
      default: return '6+ months';
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
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border border-orange-300">
                <span className="text-sm font-medium text-orange-800">🌅 Stage 1: Awareness & Orientation</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Journey of Understanding
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The first step in any healthcare journey is understanding your condition and setting meaningful goals. 
            Let's explore what this means for you and create a personalized path forward.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-orange-200">
            {[
              { id: 'condition', label: 'Understanding My Condition', icon: '🧠' },
              { id: 'goals', label: 'Setting My Goals', icon: '🎯' },
              { id: 'quickstart', label: 'Quick-Start Guide', icon: '🚀' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md'
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
          {/* Condition Information Tab */}
          {activeTab === 'condition' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🧠</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{sampleCondition.name}</h2>
                    <p className="text-gray-600 text-lg">{sampleCondition.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Common Symptoms */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="mr-2">📋</span>
                      Common Symptoms
                    </h3>
                    <div className="space-y-2">
                      {sampleCondition.commonSymptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          <span className="text-gray-700">{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Approaches */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="mr-2">🏥</span>
                      Treatment Approaches
                    </h3>
                    <div className="space-y-2">
                      {sampleCondition.treatmentApproaches.map((treatment, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-gray-700">{treatment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">🌟 Prognosis</h4>
                    <p className="text-green-700 text-sm">{sampleCondition.prognosis}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">📊 Prevalence</h4>
                    <p className="text-blue-700 text-sm">{sampleCondition.prevalence}</p>
                  </div>
                </div>
              </div>

              {/* AI-Powered Insights */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-orange-200 p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white">🤖</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Personalized Insights</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Based on your profile and condition, here are some personalized insights to help you better understand your journey:
                    </p>
                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-md border border-orange-100">
                        <p className="text-sm text-gray-700">💡 <strong>For you:</strong> Consider starting a symptom journal to help identify patterns and triggers</p>
                      </div>
                      <div className="p-3 bg-white rounded-md border border-orange-100">
                        <p className="text-sm text-gray-700">🎯 <strong>Next step:</strong> Schedule a consultation with a specialist familiar with your condition</p>
                      </div>
                      <div className="p-3 bg-white rounded-md border border-orange-100">
                        <p className="text-sm text-gray-700">🤝 <strong>Support:</strong> Connect with patient advocacy groups in your area</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Setting Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Setting Your Personal Goals</h2>
                  <p className="text-gray-600">
                    Goals give direction and purpose to your healthcare journey. These are personalized recommendations based on your condition and current stage.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {personalGoals.map((goal) => {
                    const category = goalCategories[goal.category];
                    return (
                      <div
                        key={goal.id}
                        className={`p-6 rounded-xl border transition-all duration-200 ${
                          goal.completed 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-orange-200 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                              <span className="text-white">{category.icon}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                              <span className="text-xs text-gray-500">{category.name}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleGoalCompletion(goal.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                              goal.completed
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            {goal.completed && <span className="text-xs">✓</span>}
                          </button>
                        </div>

                        <p className="text-gray-600 text-sm mb-4">{goal.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                              {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getTimeframeText(goal.timeframe)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Goal Progress Summary */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-orange-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(personalGoals.filter(g => g.completed).length / personalGoals.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {personalGoals.filter(g => g.completed).length} of {personalGoals.length} completed
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quick-Start Guide Tab */}
          {activeTab === 'quickstart' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Quick-Start Guide</h2>
                  <p className="text-gray-600">
                    A step-by-step action plan to help you navigate your first weeks after diagnosis.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      week: "Week 1",
                      title: "Immediate Actions",
                      color: "from-red-400 to-pink-500",
                      tasks: [
                        "Schedule follow-up appointment with your primary care physician",
                        "Request copies of all test results and medical records",
                        "Start a symptom diary to track patterns",
                        "Research your condition from reputable medical sources"
                      ]
                    },
                    {
                      week: "Week 2-3",
                      title: "Building Your Foundation",
                      color: "from-amber-400 to-orange-500",
                      tasks: [
                        "Connect with patient support groups or online communities",
                        "Create a healthcare binder for organizing documents",
                        "Identify potential specialists in your area",
                        "Inform close family and friends about your diagnosis"
                      ]
                    },
                    {
                      week: "Week 4+",
                      title: "Long-term Planning",
                      color: "from-green-400 to-emerald-500",
                      tasks: [
                        "Develop a treatment plan with your healthcare team",
                        "Set up regular check-ins and monitoring schedule",
                        "Explore lifestyle modifications that may help",
                        "Consider counseling or therapy for emotional support"
                      ]
                    }
                  ].map((period, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${period.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{period.title}</h3>
                            <span className="text-sm text-gray-500">{period.week}</span>
                          </div>
                          <div className="space-y-3">
                            {period.tasks.map((task, taskIndex) => (
                              <div key={taskIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-gray-700 text-sm">{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {index < 2 && (
                        <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 p-6">
                <h3 className="font-semibold text-red-800 mb-4 flex items-center">
                  <span className="mr-2">🚨</span>
                  Important: Know Your Emergency Contacts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-md border border-red-100">
                    <h4 className="font-medium text-gray-900 text-sm">Primary Care Physician</h4>
                    <p className="text-gray-600 text-xs">Keep their after-hours number handy</p>
                  </div>
                  <div className="p-3 bg-white rounded-md border border-red-100">
                    <h4 className="font-medium text-gray-900 text-sm">Specialist Contact</h4>
                    <p className="text-gray-600 text-xs">If you have an assigned specialist</p>
                  </div>
                  <div className="p-3 bg-white rounded-md border border-red-100">
                    <h4 className="font-medium text-gray-900 text-sm">Emergency Services</h4>
                    <p className="text-gray-600 text-xs">911 for immediate emergencies</p>
                  </div>
                  <div className="p-3 bg-white rounded-md border border-red-100">
                    <h4 className="font-medium text-gray-900 text-sm">Support Person</h4>
                    <p className="text-gray-600 text-xs">Trusted family member or friend</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-orange-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for the Next Stage?</h3>
              <p className="text-gray-600 text-sm">
                Once you feel comfortable with understanding your condition and have set your initial goals, 
                you can move on to Stage 2: Organize & Plan.
              </p>
            </div>
            <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Continue to Stage 2 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AwarenessOrientation;