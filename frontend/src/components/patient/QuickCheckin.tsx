import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface QuickCheckinProps {
  onBack?: () => void;
}

export const QuickCheckin: React.FC<QuickCheckinProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({
    overallFeeling: 5,
    painLevel: 5,
    energyLevel: 5,
    mood: 5,
    symptoms: [] as string[],
    notes: ''
  });

  const handleSymptomToggle = (symptom: string) => {
    setResponses(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const getEmojiForLevel = (level: number) => {
    if (level <= 2) return '😊';
    if (level <= 4) return '😐';
    if (level <= 6) return '😕';
    if (level <= 8) return '😟';
    return '😞';
  };

  const getColorForLevel = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Simple Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  ← Back
                </button>
              )}
              <RadiantLogo size="md" />
            </div>
            <div className="text-right">
              <p className="text-lg font-medium text-gray-900">Daily Check-in</p>
              <p className="text-sm text-gray-600">Step {step} of 4</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Overall Feeling */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{getEmojiForLevel(responses.overallFeeling)}</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">How are you feeling today overall?</h1>
              <p className="text-gray-600">Don't overthink it - just go with your gut feeling.</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-500">Great</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={responses.overallFeeling}
                  onChange={(e) => setResponses(prev => ({ ...prev, overallFeeling: parseInt(e.target.value) }))}
                  className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-500">Terrible</span>
              </div>
              <div className="text-center">
                <span className={`text-3xl font-bold ${getColorForLevel(responses.overallFeeling)}`}>
                  {responses.overallFeeling}/10
                </span>
              </div>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setStep(2)}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Pain Level */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🤕</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Any pain or discomfort today?</h1>
              <p className="text-gray-600">This helps us track patterns and see if treatments are working.</p>
            </div>

            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm text-gray-500">No pain</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={responses.painLevel}
                  onChange={(e) => setResponses(prev => ({ ...prev, painLevel: parseInt(e.target.value) }))}
                  className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-500">Severe pain</span>
              </div>
              <div className="text-center">
                <span className={`text-3xl font-bold ${getColorForLevel(responses.painLevel)}`}>
                  {responses.painLevel}/10
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                ← Back
              </button>
              <button 
                onClick={() => setStep(3)}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Energy & Mood */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">⚡</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">How's your energy and mood?</h1>
              <p className="text-gray-600">These often go hand in hand with your condition.</p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Energy Level</label>
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-sm text-gray-500">Exhausted</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={responses.energyLevel}
                    onChange={(e) => setResponses(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">Energetic</span>
                </div>
                <div className="text-center">
                  <span className={`text-xl font-bold ${getColorForLevel(responses.energyLevel)}`}>
                    {responses.energyLevel}/10
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Mood</label>
                <div className="flex items-center space-x-4 mb-2">
                  <span className="text-sm text-gray-500">Down</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={responses.mood}
                    onChange={(e) => setResponses(prev => ({ ...prev, mood: parseInt(e.target.value) }))}
                    className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">Happy</span>
                </div>
                <div className="text-center">
                  <span className={`text-xl font-bold ${getColorForLevel(responses.mood)}`}>
                    {responses.mood}/10
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setStep(2)}
                className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                ← Back
              </button>
              <button 
                onClick={() => setStep(4)}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Symptoms & Notes */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📝</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Any specific symptoms today?</h1>
              <p className="text-gray-600">Tap any that you're experiencing (optional)</p>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {[
                  'Joint stiffness', 'Headache', 'Nausea', 'Fever', 'Rash', 'Fatigue',
                  'Brain fog', 'Muscle aches', 'Sleep issues', 'Anxiety', 'Loss of appetite', 'Other'
                ].map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      responses.symptoms.includes(symptom)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Anything else you want to note? (Optional)
              </label>
              <textarea
                value={responses.notes}
                onChange={(e) => setResponses(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="How did you sleep? What helped you feel better? Any concerns?"
                rows={3}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="flex justify-between">
              <button 
                onClick={() => setStep(3)}
                className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                ← Back
              </button>
              <button 
                onClick={() => {
                  // Here you would save the check-in data
                  alert('Check-in saved! Thank you for taking care of yourself. 💙');
                  onBack?.();
                }}
                className="bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Save Check-in ✓
              </button>
            </div>
          </div>
        )}

        {/* Encouragement */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            🌟 Every check-in helps us understand your patterns and support you better
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickCheckin;