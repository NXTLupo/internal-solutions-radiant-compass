import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface CoordinateCommitProps {
  onBackToDashboard?: () => void;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  type: string;
  location: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  prepTasks: string[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  lastContact: string;
  status: 'active' | 'pending' | 'inactive';
}

const upcomingAppointments: Appointment[] = [
  {
    id: '1',
    date: '2024-02-15',
    time: '10:00 AM',
    provider: 'Dr. Sarah Chen',
    type: 'Initial Consultation',
    location: 'University Medical Center',
    status: 'confirmed',
    prepTasks: [
      'Bring all medical records',
      'List current symptoms',
      'Prepare questions about treatment options',
      'Complete intake forms'
    ]
  },
  {
    id: '2',
    date: '2024-02-22',
    time: '2:30 PM',
    provider: 'Dr. Michael Rodriguez',
    type: 'Genetic Counseling',
    location: 'Regional Genetics Center',
    status: 'pending',
    prepTasks: [
      'Complete family history questionnaire',
      'Gather family medical records',
      'Prepare questions about inheritance patterns'
    ]
  }
];

const careTeam: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    role: 'Rheumatologist',
    contact: '(555) 123-4567',
    lastContact: '2 days ago',
    status: 'active'
  },
  {
    id: '2',
    name: 'Maria Johnson',
    role: 'Care Coordinator',
    contact: '(555) 234-5678',
    lastContact: '1 week ago',
    status: 'active'
  },
  {
    id: '3',
    name: 'David Kim',
    role: 'Physical Therapist',
    contact: '(555) 345-6789',
    lastContact: '3 days ago',
    status: 'pending'
  }
];

export const CoordinateCommit: React.FC<CoordinateCommitProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'prep' | 'team'>('calendar');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
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
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-lime-100 to-green-100 border border-green-300">
                <span className="text-sm font-medium text-green-800">🤝 Stage 4: Coordinate & Commit</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Coordinate Care & Commit to Treatment
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Organize your care team, schedule appointments, and prepare for treatment with comprehensive coordination tools.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-orange-200">
            {[
              { id: 'calendar', label: 'Calendar & Scheduling', icon: '📅' },
              { id: 'prep', label: 'Appointment Prep', icon: '📋' },
              { id: 'team', label: 'Care Team Chat', icon: '💬' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-lime-400 to-green-500 text-white shadow-md'
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
          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Appointments</h2>
                  <p className="text-gray-600">
                    Manage your healthcare appointments and stay organized with your treatment schedule.
                  </p>
                </div>

                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-6 hover:border-green-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{appointment.type}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getStatusColor(appointment.status)}`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>👨‍⚕️ {appointment.provider}</p>
                            <p>📅 {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p>🕐 {appointment.time}</p>
                            <p>📍 {appointment.location}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-lime-400 to-green-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-lime-500 hover:to-green-600 transition-all duration-200">
                          View Details
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                          Reschedule
                        </button>
                        <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200">
                          Add to Calendar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button className="w-full bg-gradient-to-r from-lime-400 to-green-500 text-white py-3 px-6 rounded-lg font-medium hover:from-lime-500 hover:to-green-600 transition-all duration-200 shadow-md">
                    + Schedule New Appointment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Prep Tab */}
          {activeTab === 'prep' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Preparation</h2>
                  <p className="text-gray-600">
                    Get ready for your appointments with personalized preparation checklists and tools.
                  </p>
                </div>

                <div className="space-y-6">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{appointment.type}</h3>
                        <p className="text-sm text-gray-600">with {appointment.provider} on {new Date(appointment.date).toLocaleDateString()}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Preparation Checklist:</h4>
                        <div className="space-y-2">
                          {appointment.prepTasks.map((task, index) => (
                            <label key={index} className="flex items-center space-x-3">
                              <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                              <span className="text-sm text-gray-700">{task}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-lime-400 to-green-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-lime-500 hover:to-green-600 transition-all duration-200">
                          Generate Questions
                        </button>
                        <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200">
                          Download Prep Guide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Team Chat Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Care Team Communication</h2>
                  <p className="text-gray-600">
                    Stay connected with your healthcare team and coordinate care efficiently.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {careTeam.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          member.status === 'active' ? 'bg-green-500' : 
                          member.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p>📞 {member.contact}</p>
                        <p>💬 Last contact: {member.lastContact}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-gradient-to-r from-lime-400 to-green-500 text-white py-2 px-3 rounded-md text-sm font-medium hover:from-lime-500 hover:to-green-600 transition-all duration-200">
                          Message
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                          Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Team Communication Hub</h3>
                  <p className="text-gray-600 mb-4">
                    Secure messaging platform for coordinating care with your entire healthcare team.
                  </p>
                  <button className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-200">
                    Open Team Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-lime-100 to-green-100 rounded-xl border border-green-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Begin Treatment?</h3>
              <p className="text-gray-600 text-sm">
                Once your care team is coordinated and appointments are scheduled, 
                you can move on to Stage 5: Undergo Treatment.
              </p>
            </div>
            <button className="bg-gradient-to-r from-lime-400 to-green-500 text-white px-6 py-3 rounded-lg font-medium hover:from-lime-500 hover:to-green-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Continue to Stage 5 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinateCommit;