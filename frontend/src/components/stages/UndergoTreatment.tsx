import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface UndergoTreatmentProps {
  onBackToDashboard?: () => void;
}

interface SymptomEntry {
  id: string;
  date: string;
  symptoms: { name: string; severity: number; notes: string }[];
  mood: number;
  energy: number;
  sleepQuality: number;
}

interface MentalHealthCheck {
  id: string;
  date: string;
  anxietyLevel: number;
  depressionLevel: number;
  stressLevel: number;
  copingStrategies: string[];
  notes: string;
}

interface TreatmentProgress {
  medication: string;
  dosage: string;
  adherence: number;
  sideEffects: string[];
  effectiveness: number;
}

const recentSymptomEntries: SymptomEntry[] = [
  {
    id: '1',
    date: '2024-02-14',
    symptoms: [
      { name: 'Joint Pain', severity: 6, notes: 'Worse in morning, improved with movement' },
      { name: 'Fatigue', severity: 4, notes: 'Manageable today' }
    ],
    mood: 7,
    energy: 6,
    sleepQuality: 7
  },
  {
    id: '2',
    date: '2024-02-13',
    symptoms: [
      { name: 'Joint Pain', severity: 8, notes: 'Severe pain, took extra medication' },
      { name: 'Fatigue', severity: 7, notes: 'Very tired, napped twice' },
      { name: 'Brain Fog', severity: 5, notes: 'Difficulty concentrating at work' }
    ],
    mood: 5,
    energy: 4,
    sleepQuality: 4
  }
];

const treatmentProgress: TreatmentProgress = {
  medication: 'Immunosuppressive Therapy',
  dosage: '20mg daily',
  adherence: 95,
  sideEffects: ['Mild nausea', 'Occasional headaches', 'Fatigue'],
  effectiveness: 78
};

export const UndergoTreatment: React.FC<UndergoTreatmentProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'tracking' | 'mental-health' | 'progress'>('tracking');
  const [newSymptom, setNewSymptom] = useState({ name: '', severity: 5, notes: '' });

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return 'text-green-600';
    if (severity <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityBg = (severity: number) => {
    if (severity <= 3) return 'bg-green-500';
    if (severity <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'text-green-600';
    if (adherence >= 75) return 'text-yellow-600';
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
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-emerald-300">
                <span className="text-sm font-medium text-emerald-800">💊 Stage 5: Undergo Treatment</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Active Treatment & Monitoring
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your symptoms, monitor treatment progress, and maintain mental health during active treatment.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-orange-200">
            {[
              { id: 'tracking', label: 'Symptom Tracking', icon: '📊' },
              { id: 'mental-health', label: 'Mental Health', icon: '🧠' },
              { id: 'progress', label: 'Treatment Progress', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md'
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
          {/* Symptom Tracking Tab */}
          {activeTab === 'tracking' && (
            <div className="space-y-6">
              {/* Today's Entry */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Today's Symptom Entry</h2>
                  <p className="text-gray-600">
                    Track your daily symptoms to help your healthcare team monitor your progress.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Assessment</h3>
                    <div className="space-y-4">
                      {['Overall Pain', 'Energy Level', 'Sleep Quality', 'Mood'].map((metric) => (
                        <div key={metric}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">{metric}</label>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">1</span>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              defaultValue="5"
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm text-gray-500">10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Add Specific Symptoms</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Symptom name (e.g., Joint Pain, Headache)"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <textarea
                        placeholder="Notes about this symptom..."
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <button className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-500 hover:to-emerald-600 transition-all duration-200">
                        Add Symptom
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-500 hover:to-emerald-600 transition-all duration-200 shadow-md">
                    Save Today's Entry
                  </button>
                </div>
              </div>

              {/* Recent Entries */}
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Entries</h2>
                  <p className="text-gray-600">
                    Review your symptom patterns and trends over time.
                  </p>
                </div>

                <div className="space-y-4">
                  {recentSymptomEntries.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:border-emerald-200 transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{new Date(entry.date).toLocaleDateString()}</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>Mood: <span className={getSeverityColor(entry.mood)}>{entry.mood}/10</span></span>
                          <span>Energy: <span className={getSeverityColor(entry.energy)}>{entry.energy}/10</span></span>
                          <span>Sleep: <span className={getSeverityColor(entry.sleepQuality)}>{entry.sleepQuality}/10</span></span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {entry.symptoms.map((symptom, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{symptom.name}</span>
                              {symptom.notes && <p className="text-sm text-gray-600">{symptom.notes}</p>}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
                                {symptom.severity}/10
                              </span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${getSeverityBg(symptom.severity)}`}
                                  style={{ width: `${symptom.severity * 10}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mental Health Tab */}
          {activeTab === 'mental-health' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Mental Health Check-In</h2>
                  <p className="text-gray-600">
                    Monitor your emotional wellbeing and access mental health resources during treatment.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Today's Mood Assessment</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Anxiety Level', description: 'How anxious are you feeling today?' },
                        { label: 'Depression Symptoms', description: 'Rate feelings of sadness or hopelessness' },
                        { label: 'Stress Level', description: 'How overwhelmed do you feel?' },
                        { label: 'Overall Coping', description: 'How well are you managing today?' }
                      ].map((item) => (
                        <div key={item.label}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                          <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Low</span>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              defaultValue="5"
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm text-gray-500">High</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Coping Strategies</h3>
                    <div className="space-y-3">
                      {[
                        'Deep breathing exercises',
                        'Meditation or mindfulness',
                        'Physical activity/exercise',
                        'Talking to friends/family',
                        'Professional counseling',
                        'Creative activities',
                        'Nature/outdoor time'
                      ].map((strategy) => (
                        <label key={strategy} className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="text-sm text-gray-700">{strategy}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <textarea
                        placeholder="How are you feeling emotionally today? Any concerns or positive developments?"
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-500 hover:to-emerald-600 transition-all duration-200 shadow-md">
                    Save Mental Health Check-In
                  </button>
                </div>
              </div>

              {/* Mental Health Resources */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Mental Health Support</h3>
                <p className="text-gray-600 mb-4">
                  Access professional mental health resources and crisis support when you need it.
                </p>
                <div className="flex space-x-3">
                  <button className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-200">
                    Find Counselors
                  </button>
                  <button className="bg-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-red-600 transition-all duration-200">
                    Crisis Resources
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Treatment Progress Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Treatment Progress</h2>
                  <p className="text-gray-600">
                    Monitor your treatment effectiveness and track medication adherence.
                  </p>
                </div>

                {/* Current Treatment */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Treatment</h3>
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{treatmentProgress.medication}</h4>
                        <p className="text-gray-600">{treatmentProgress.dosage}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getAdherenceColor(treatmentProgress.adherence)}`}>
                          {treatmentProgress.adherence}%
                        </div>
                        <div className="text-sm text-gray-600">Adherence</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">Treatment Effectiveness</span>
                        <span className="text-sm text-gray-600">{treatmentProgress.effectiveness}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full"
                          style={{ width: `${treatmentProgress.effectiveness}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-medium text-gray-900 mb-2">Current Side Effects</h5>
                      <div className="flex flex-wrap gap-2">
                        {treatmentProgress.sideEffects.map((effect, index) => (
                          <span key={index} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-green-500 hover:to-emerald-600 transition-all duration-200">
                        Log Medication
                      </button>
                      <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                        Report Side Effect
                      </button>
                      <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200">
                        View Trends
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Charts Placeholder */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Charts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-6 text-center">
                      <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-gray-500">📊 Symptom Severity Trends</span>
                      </div>
                      <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
                        View Detailed Chart
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6 text-center">
                      <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-gray-500">📈 Treatment Response</span>
                      </div>
                      <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
                        View Detailed Chart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-emerald-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Treatment Going Well?</h3>
              <p className="text-gray-600 text-sm">
                As you progress through treatment and start feeling better, 
                you can move on to Stage 6: Early Recovery.
              </p>
            </div>
            <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-500 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Continue to Stage 6 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UndergoTreatment;