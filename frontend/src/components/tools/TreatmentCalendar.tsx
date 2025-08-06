import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle } from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  title: string;
  provider: string;
  location: string;
  type: 'treatment' | 'consultation' | 'test' | 'followup';
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

interface TreatmentCalendarProps {
  isActive?: boolean;
  autoFillData?: any;
  onDataUpdate?: (data: any) => void;
}

export const TreatmentCalendar: React.FC<TreatmentCalendarProps> = ({ 
  isActive = false, 
  autoFillData,
  onDataUpdate 
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2025-01-08',
      time: '10:00 AM',
      title: 'Chemotherapy Session #3',
      provider: 'Dr. Sarah Johnson',
      location: 'Cancer Center - Room 204',
      type: 'treatment',
      status: 'upcoming',
      notes: 'Pre-medications at 9:30 AM'
    },
    {
      id: '2', 
      date: '2025-01-10',
      time: '2:00 PM',
      title: 'Blood Work & Labs',
      provider: 'Lab Services',
      location: 'Main Hospital - Lab Wing',
      type: 'test',
      status: 'upcoming'
    },
    {
      id: '3',
      date: '2025-01-15',
      time: '11:00 AM', 
      title: 'Oncology Follow-up',
      provider: 'Dr. Michael Chen',
      location: 'Oncology Clinic - Suite 301',
      type: 'followup',
      status: 'upcoming',
      notes: 'Review treatment response and side effects'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<string>('2025-01-08');
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);

  useEffect(() => {
    if (autoFillData?.demonstrationMode) {
      setIsAutonomousMode(true);
      
      // Use contextual data if available, otherwise use demo data
      if (autoFillData?.appointments && autoFillData.appointments.length > 0) {
        console.log('[TreatmentCalendar] Using contextual appointment data from conversation');
        setAppointments(prev => [...autoFillData.appointments, ...prev]);
      } else {
        // Fallback demonstration appointment
        const demoAppointment: Appointment = {
          id: 'demo',
          date: '2025-01-12',
          time: '9:00 AM',
          title: 'Demonstration Appointment',
          provider: 'Dr. Maya AI',
          location: 'RadiantCompass Virtual Clinic',
          type: 'consultation',
          status: 'upcoming',
          notes: 'This is a demonstration of how the Treatment Calendar works'
        };
        
        setAppointments(prev => [demoAppointment, ...prev]);
      }
    }
  }, [autoFillData]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'treatment': return 'bg-red-100 text-red-800 border-red-200';
      case 'consultation': return 'bg-blue-100 text-blue-800 border-blue-200';  
      case 'test': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'followup': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600';
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Treatment Calendar</h2>
              <p className="text-sm text-gray-600">Manage your appointments and treatment schedule</p>
            </div>
          </div>
          
          {isAutonomousMode && (
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
              🤖 AI Demonstration Mode
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isAutonomousMode && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Dr. Maya's Demonstration</h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                  This is your Treatment Calendar! Here you can see all your upcoming appointments, 
                  track your treatment sessions, and get reminders for important dates. I've added 
                  a demonstration appointment to show you how it works. You can view details, 
                  get directions, and even prepare questions for each appointment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">{upcomingAppointments.length}</div>
                <div className="text-sm text-blue-700">Upcoming</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">Next: Jan 8</div>
                <div className="text-sm text-green-700">This Week</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900">3</div>
                <div className="text-sm text-purple-700">Locations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          
          {appointments.map((appointment) => (
            <div 
              key={appointment.id}
              className={`p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                appointment.id === 'demo' 
                  ? 'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-400 ring-opacity-50' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{appointment.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(appointment.type)}`}>
                      {appointment.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{appointment.provider}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{appointment.location}</span>
                      </div>
                      <div className={`flex items-center gap-2 font-medium ${getStatusColor(appointment.status)}`}>
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                        <span className="capitalize">{appointment.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Add Appointment
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Export Calendar
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Set Reminders
          </button>
        </div>
      </div>
    </div>
  );
};