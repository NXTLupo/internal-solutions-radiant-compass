import React, { useState } from 'react';
import { RadiantLogo } from './RadiantLogo';
import { LearnCondition } from './patient/LearnCondition';
import { QuickCheckin } from './patient/QuickCheckin';
import { UltraFastVoiceChat } from './UltraFastVoiceChat';

interface PatientDashboardProps {}

export const PatientDashboard: React.FC<PatientDashboardProps> = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'learn' | 'checkin' | 'maya'>('maya');

  // Show specific patient views
  if (currentView === 'maya') {
    return <UltraFastVoiceChat onNavigateHome={() => setCurrentView('dashboard')} />;
  }
  
  if (currentView === 'learn') {
    return <LearnCondition onBack={() => setCurrentView('dashboard')} />;
  }
  
  if (currentView === 'checkin') {
    return <QuickCheckin onBack={() => setCurrentView('dashboard')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Simple Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <RadiantLogo size="md" />
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900">Hi Sarah 👋</p>
              <p className="text-sm text-gray-600">You're doing great!</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Health Journey ☀️
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're here to guide you step by step. You don't have to figure this out alone.
          </p>
        </div>

        {/* Simple Progress */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
              <span className="text-2xl">🌱</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-4 rounded-full transition-all duration-700" style={{ width: '25%' }}></div>
            </div>
            <p className="text-gray-600">You're in the early stages - that's completely normal. Take it one day at a time.</p>
          </div>
        </div>

        {/* Today's Focus */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What should I focus on today?</h2>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Understanding Your Condition
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  It's normal to feel overwhelmed. Let's start with the basics about your condition in simple terms.
                </p>
                <button 
                  onClick={() => setCurrentView('learn')}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Learn About My Condition
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Simple things you can do right now</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-4">🗣️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Talk to Someone</h3>
              <p className="text-gray-600 mb-4">Connect with others who understand what you're going through.</p>
              <button className="text-orange-600 font-medium hover:text-orange-700">
                Find Support →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track How You Feel</h3>
              <p className="text-gray-600 mb-4">A simple daily check-in to help you and your doctor.</p>
              <button 
                onClick={() => setCurrentView('checkin')}
                className="text-orange-600 font-medium hover:text-orange-700"
              >
                Quick Check-in →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-4">👩‍⚕️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Talk to Dr. Maya</h3>
              <p className="text-gray-600 mb-4">Voice chat with your AI healthcare companion for personalized guidance.</p>
              <button 
                onClick={() => setCurrentView('maya')}
                className="text-orange-600 font-medium hover:text-orange-700"
              >
                Start Voice Chat →
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prepare for Appointments</h3>
              <p className="text-gray-600 mb-4">Simple tools to help you get the most out of doctor visits.</p>
              <button className="text-orange-600 font-medium hover:text-orange-700">
                Prepare Now →
              </button>
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
            <div className="text-5xl mb-4">💪</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You're Stronger Than You Know</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              This journey isn't easy, but you don't have to walk it alone. We're here to support you every step of the way.
            </p>
          </div>
        </div>

        {/* Emergency Support */}
        <div className="mt-12 bg-red-50 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">🆘</span>
            <h3 className="text-lg font-semibold text-red-800">Need Help Right Now?</h3>
          </div>
          <p className="text-red-700 mb-4">If you're feeling overwhelmed or need immediate support:</p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition-all duration-200">
              Crisis Support: 988
            </button>
            <button className="bg-white text-red-600 border border-red-600 px-6 py-2 rounded-full font-medium hover:bg-red-50 transition-all duration-200">
              Talk to Someone Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;