import React, { useState } from 'react';
import { RadiantLogo } from './RadiantLogo';
import { UltraFastVoiceChat } from './UltraFastVoiceChat';
import { AwarenessOrientation } from './stages/AwarenessOrientation';
import { OrganizePlan } from './stages/OrganizePlan';
import { ExploreDecide } from './stages/ExploreDecide';
import { CoordinateCommit } from './stages/CoordinateCommit';
import { UndergoTreatment } from './stages/UndergoTreatment';
import { EarlyRecovery } from './stages/EarlyRecovery';
import { LongTermLiving } from './stages/LongTermLiving';

interface JourneyStage {
  id: string;
  name: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  icon: string;
  color: string;
}

const journeyStages: JourneyStage[] = [
  {
    id: 'awareness',
    name: 'Awareness & Orientation',
    description: 'Understanding your condition and building emotional resilience',
    status: 'completed',
    progress: 100,
    icon: '🌅',
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'organize',
    name: 'Organize & Plan',
    description: 'Creating your personalized journey roadmap',
    status: 'in_progress',
    progress: 75,
    icon: '🗺️',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'explore',
    name: 'Explore & Decide',
    description: 'Finding the right care team and treatment options',
    status: 'in_progress',
    progress: 30,
    icon: '🔍',
    color: 'from-yellow-400 to-amber-600'
  },
  {
    id: 'coordinate',
    name: 'Coordinate & Commit',
    description: 'Building your support network and preparing for treatment',
    status: 'not_started',
    progress: 0,
    icon: '🤝',
    color: 'from-lime-400 to-green-500'
  },
  {
    id: 'treatment',
    name: 'Undergo Treatment',
    description: 'Active treatment with comprehensive support',
    status: 'not_started',
    progress: 0,
    icon: '💊',
    color: 'from-green-400 to-emerald-500'
  },
  {
    id: 'recovery',
    name: 'Early Recovery',
    description: 'Healing, reflection, and planning for the future',
    status: 'not_started',
    progress: 0,
    icon: '🌱',
    color: 'from-emerald-400 to-teal-500'
  },
  {
    id: 'longterm',
    name: 'Long-Term Living',
    description: 'Thriving in your new normal with ongoing support',
    status: 'not_started',
    progress: 0,
    icon: '🌟',
    color: 'from-teal-400 to-blue-500'
  }
];

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  action: string;
  urgent?: boolean;
}

const quickActions: QuickAction[] = [
  {
    title: 'Log Symptoms',
    description: 'Track your daily symptoms and side effects',
    icon: '📝',
    action: 'log-symptoms'
  },
  {
    title: 'Schedule Appointment',
    description: 'Book your next medical appointment',
    icon: '📅',
    action: 'schedule-appointment',
    urgent: true
  },
  {
    title: 'Connect with Peers',
    description: 'Join our supportive community',
    icon: '👥',
    action: 'connect-peers'
  },
  {
    title: 'Talk with Dr. Maya',
    description: 'Voice chat with your AI healthcare companion',
    icon: '🎤',
    action: 'ai-assistant'
  }
];

export const RadiantDashboard: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string>('organize');
  const [showStageDetail, setShowStageDetail] = useState<string | null>(null);
  const [showDrMayaChat, setShowDrMayaChat] = useState<boolean>(false);

  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'ai-assistant':
        setShowDrMayaChat(true);
        break;
      case 'log-symptoms':
        // Handle symptom logging
        console.log('Opening symptom tracker...');
        break;
      case 'schedule-appointment':
        // Handle appointment scheduling
        console.log('Opening appointment scheduler...');
        break;
      case 'connect-peers':
        // Handle peer connection
        console.log('Opening peer community...');
        break;
      default:
        console.log('Unhandled action:', actionType);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Not Started';
    }
  };

  // Show Dr. Maya ultra-fast voice chat if selected
  if (showDrMayaChat) {
    return <UltraFastVoiceChat onNavigateHome={() => setShowDrMayaChat(false)} />;
  }

  // Show stage detail view if selected
  if (showStageDetail === 'awareness') {
    return <AwarenessOrientation onBackToDashboard={() => setShowStageDetail(null)} />;
  }
  if (showStageDetail === 'organize') {
    return <OrganizePlan onBackToDashboard={() => setShowStageDetail(null)} />;
  }
  if (showStageDetail === 'explore') {
    return <ExploreDecide onBackToDashboard={() => setShowStageDetail(null)} />;
  }
  if (showStageDetail === 'coordinate') {
    return <CoordinateCommit onBackToDashboard={() => setShowStageDetail(null)} />;
  }
  if (showStageDetail === 'treatment') {
    return <UndergoTreatment onBackToDashboard={() => setShowStageDetail(null)} />;
  }
  if (showStageDetail === 'recovery') {
    return <EarlyRecovery onBackToDashboard={() => setShowStageDetail(null)} />;
  }
  if (showStageDetail === 'longterm') {
    return <LongTermLiving onBackToDashboard={() => setShowStageDetail(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <RadiantLogo size="md" />
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                SJ
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good morning, Sarah! ☀️
          </h1>
          <p className="text-lg text-gray-600">
            You're making great progress on your journey. Here's what's happening today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                  action.urgent 
                    ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-orange-300 ring-2 ring-orange-200' 
                    : 'bg-white border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{action.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {action.title}
                      {action.urgent && <span className="ml-1 text-orange-600">•</span>}
                    </h3>
                    <p className="text-gray-600 text-xs mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Journey Progress</h2>
            <div className="text-sm text-gray-600">
              Stage 2 of 7 • <span className="font-medium text-amber-600">In Progress</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {journeyStages.map((stage, index) => (
              <div
                key={stage.id}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeStage === stage.id
                    ? 'ring-2 ring-orange-400 border-orange-300 shadow-lg transform scale-105'
                    : 'border-gray-200 hover:border-orange-200 hover:shadow-md'
                } ${stage.status === 'completed' ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 
                   stage.status === 'in_progress' ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 
                   'bg-white'}`}
                onClick={() => {
                  setActiveStage(stage.id);
                  setShowStageDetail(stage.id);
                }}
              >
                {/* Progress indicator */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                  <div 
                    className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-500`}
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{stage.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {stage.name}
                        </h3>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(stage.status)} mt-1`}>
                          {getStatusText(stage.status)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{stage.progress}%</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{stage.description}</p>
                  
                  {stage.status === 'in_progress' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStageDetail(stage.id);
                      }}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200"
                    >
                      Continue
                    </button>
                  )}
                  
                  {stage.status === 'not_started' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStageDetail(stage.id);
                      }}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                    >
                      Start Stage
                    </button>
                  )}
                  
                  {stage.status === 'completed' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStageDetail(stage.id);
                      }}
                      className="w-full flex items-center justify-center text-green-600 text-sm font-medium hover:text-green-700 transition-all duration-200"
                    >
                      <span className="mr-1">✓</span>
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { time: '2 hours ago', action: 'Completed symptom check-in', type: 'success' },
                { time: '1 day ago', action: 'Scheduled appointment with Dr. Smith', type: 'info' },
                { time: '2 days ago', action: 'Connected with peer support group', type: 'social' },
                { time: '3 days ago', action: 'Updated treatment goals', type: 'progress' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                    activity.type === 'social' ? 'bg-purple-500' :
                    'bg-amber-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming</h3>
            <div className="space-y-4">
              {[
                { date: 'Today, 3:00 PM', event: 'Telehealth consultation', urgent: true },
                { date: 'Tomorrow, 10:00 AM', event: 'Lab work appointment', urgent: false },
                { date: 'Friday, 2:00 PM', event: 'Peer support group meeting', urgent: false },
                { date: 'Next week', event: 'Treatment plan review', urgent: false }
              ].map((upcoming, index) => (
                <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                  upcoming.urgent ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    upcoming.urgent ? 'bg-amber-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{upcoming.event}</p>
                    <p className="text-xs text-gray-500">{upcoming.date}</p>
                  </div>
                  {upcoming.urgent && (
                    <span className="text-xs text-amber-600 font-medium">Urgent</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};