import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, FileText, Activity } from 'lucide-react';

interface TestCoordinatorProps {
  isActive?: boolean;
  autoFillData?: any;
  onDataUpdate?: (data: any) => void;
}

export const TestCoordinator: React.FC<TestCoordinatorProps> = ({ 
  isActive = false, 
  autoFillData,
  onDataUpdate 
}) => {
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  useEffect(() => {
    if (autoFillData?.demonstrationMode) {
      setIsAutonomousMode(true);
      
      if (autoFillData?.scheduledTests && autoFillData.scheduledTests.length > 0) {
        console.log('[TestCoordinator] Using contextual test data from conversation');
      }
      
      if (onDataUpdate) {
        onDataUpdate({
          testsCoordinated: true,
          activeFromConversation: autoFillData?.activeFromConversation || false
        });
      }
    }
  }, [autoFillData, onDataUpdate]);

  const scheduledTests = autoFillData?.scheduledTests || [
    {
      testName: 'Complete Blood Count (CBC)',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '8:00 AM',
      preparation: 'No special preparation required',
      location: 'Hospital Lab - Building A',
      status: 'scheduled',
      provider: 'Lab Services',
      duration: '15 minutes',
      notes: 'Routine monitoring of blood levels'
    },
    {
      testName: 'Imaging Study (CT Scan)',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '2:30 PM',
      preparation: 'No food 4 hours before exam. Contrast material will be used.',
      location: 'Radiology Department',
      status: 'pending_schedule',
      provider: 'Dr. Radiology Team',
      duration: '45 minutes',
      notes: 'Follow-up imaging to assess treatment response'
    },
    {
      testName: 'Pulmonary Function Test',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '10:00 AM',
      preparation: 'Avoid bronchodilators 4 hours prior. Wear loose clothing.',
      location: 'Pulmonary Lab - 3rd Floor',
      status: 'scheduled',
      provider: 'Respiratory Therapy',
      duration: '30 minutes',
      notes: 'Baseline lung function assessment'
    }
  ];

  const coordinationFeatures = autoFillData?.coordinationFeatures || [
    'Automated scheduling optimization',
    'Preparation reminder system',
    'Results tracking and alerts',
    'Provider communication hub'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending_schedule': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Test Coordinator</h2>
              <p className="text-sm text-gray-600">Streamline your diagnostic journey</p>
            </div>
          </div>
          
          {isAutonomousMode && (
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
              🤖 AI Coordination Mode
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isAutonomousMode && (
          <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900 mb-2">Dr. Maya's Expert Test Coordination</h3>
                <p className="text-sm text-purple-800 leading-relaxed mb-3">
                  {autoFillData?.expertDescription || 
                   "Your Test Coordinator streamlines your diagnostic journey by organizing multiple tests, tracking results, ensuring proper preparation, and helping you understand what each test means for your care."}
                </p>
                {coordinationFeatures && (
                  <div className="bg-white/60 rounded-lg p-3 mt-3">
                    <div className="text-xs font-medium text-purple-900 mb-2">🎯 Coordination Features:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-purple-800">
                      {coordinationFeatures.map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 text-xs text-purple-700 font-medium">
                  🤖 I'm organizing your tests and ensuring you're fully prepared for each one!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">{scheduledTests.length}</div>
                <div className="text-sm text-blue-700">Total Tests</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {scheduledTests.filter(t => t.status === 'scheduled').length}
                </div>
                <div className="text-sm text-green-700">Scheduled</div>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-900">
                  {scheduledTests.filter(t => t.status === 'pending_schedule').length}
                </div>
                <div className="text-sm text-yellow-700">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tests List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Tests & Procedures</h3>
          
          {scheduledTests.map((test: any, index: number) => (
            <div 
              key={index}
              className={`p-5 rounded-xl border-2 transition-all cursor-pointer ${
                selectedTest?.testName === test.testName 
                  ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400 ring-opacity-50' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedTest(selectedTest?.testName === test.testName ? null : test)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{test.testName}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(test.status)}`}>
                      {test.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{test.date} at {test.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{test.location}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="w-4 h-4" />
                        <span>{test.provider}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Duration: {test.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedTest?.testName === test.testName && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  {test.preparation && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-amber-900 mb-1">Preparation Instructions</h5>
                          <p className="text-sm text-amber-800">{test.preparation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {test.notes && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-blue-900 mb-1">Clinical Notes</h5>
                          <p className="text-sm text-blue-800">{test.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm">
                      Reschedule
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                      Get Directions
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                      Add to Calendar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            Add New Test
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View Results
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Export Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
