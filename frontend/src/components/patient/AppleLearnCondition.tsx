import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface AppleLearnConditionProps {
  onBack?: () => void;
}

export const AppleLearnCondition: React.FC<AppleLearnConditionProps> = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState<'basics' | 'symptoms' | 'treatment' | 'questions'>('basics');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Apple-style Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium"
                >
                  <span className="text-lg mr-1">←</span> Back
                </button>
              )}
              <RadiantLogo size="md" />
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">Learn About Your Condition</p>
              <p className="text-sm text-slate-500">Step by step guidance</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Apple-style Progress Indicators */}
        <div className="flex justify-center space-x-3 mb-12">
          {[
            { key: 'basics', label: 'Basics' },
            { key: 'symptoms', label: 'Symptoms' },
            { key: 'treatment', label: 'Treatment' },
            { key: 'questions', label: 'Questions' }
          ].map((step, index) => (
            <div key={step.key} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentSection === step.key 
                  ? 'bg-amber-500 text-white shadow-lg' 
                  : index < Object.keys({basics: 0, symptoms: 1, treatment: 2, questions: 3}).indexOf(currentSection as keyof typeof Object.keys)
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}>
                {index + 1}
              </div>
              <span className="text-xs text-slate-600 mt-2 font-medium">{step.label}</span>
            </div>
          ))}
        </div>

        {/* Basics Section */}
        {currentSection === 'basics' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-thin text-slate-900 mb-4 tracking-tight">Let's Start with the Basics</h1>
              <p className="text-xl text-slate-600 font-light">Understanding your condition doesn't have to be overwhelming.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 border border-slate-200/50 shadow-sm">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🫀</span>
                </div>
                <h2 className="text-3xl font-semibold text-slate-900 mb-6">Your Condition in Simple Terms</h2>
              </div>

              <div className="space-y-6 text-lg leading-relaxed text-slate-700 mb-8">
                <p>
                  You have a <strong>rare autoimmune condition</strong>. This means your body's immune system - 
                  which normally protects you from germs - is a bit confused and sometimes attacks your own healthy tissues.
                </p>
                
                <p>
                  Think of it like having an overly protective security guard who sometimes mistakes friends for enemies. 
                  It's not your fault, and it's not something you did wrong.
                </p>

                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200/50">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">The Good News:</h3>
                  <ul className="space-y-3 text-blue-800">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 text-lg">•</span>
                      You're not alone - thousands of people have this condition
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 text-lg">•</span>
                      There are treatments that can help you feel better
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 text-lg">•</span>
                      Many people with this condition live full, happy lives
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-3 text-lg">•</span>
                      We're here to support you every step of the way
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setCurrentSection('symptoms')}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Tell Me About Symptoms →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Symptoms Section */}
        {currentSection === 'symptoms' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-thin text-slate-900 mb-4 tracking-tight">Understanding Your Symptoms</h1>
              <p className="text-xl text-slate-600 font-light">What you might be experiencing and why.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 border border-slate-200/50 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {[
                  { icon: '😴', title: 'Fatigue', description: 'Feeling tired even after rest - this is very common and not just "being lazy"', color: 'from-purple-400 to-purple-500' },
                  { icon: '🦴', title: 'Joint Pain', description: 'Your joints might ache or feel stiff, especially in the morning', color: 'from-orange-400 to-orange-500' },
                  { icon: '🧠', title: 'Brain Fog', description: 'Trouble concentrating or remembering things - this is real and not imagined', color: 'from-blue-400 to-blue-500' },
                  { icon: '🌡️', title: 'Fever', description: 'Your body temperature might go up as your immune system is active', color: 'from-red-400 to-red-500' }
                ].map((symptom, index) => (
                  <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${symptom.color} flex items-center justify-center mb-4`}>
                      <span className="text-2xl">{symptom.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{symptom.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{symptom.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 rounded-2xl p-8 border border-green-200/50 mb-8">
                <h3 className="text-xl font-semibold text-green-900 mb-3">Remember:</h3>
                <p className="text-green-800 leading-relaxed">
                  Everyone's experience is different. You might have some, all, or different symptoms. 
                  What matters is how YOU feel, and we're here to help you manage whatever you're experiencing.
                </p>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setCurrentSection('basics')}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-lg transition-colors duration-200"
                >
                  ← Back to Basics
                </button>
                <button 
                  onClick={() => setCurrentSection('treatment')}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  What About Treatment? →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Section */}
        {currentSection === 'treatment' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-thin text-slate-900 mb-4 tracking-tight">Treatment Options</h1>
              <p className="text-xl text-slate-600 font-light">There are ways to help you feel better.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 border border-slate-200/50 shadow-sm">
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">The Goal of Treatment</h2>
                <p className="text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">
                  We want to help you feel better, reduce your symptoms, and get back to doing the things you love. 
                  Treatment isn't just about medicine - it's about supporting your whole life.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-8 bg-blue-50 rounded-2xl border border-blue-200/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Medicine</h3>
                  <p className="text-blue-800 leading-relaxed">Medications to calm your immune system and reduce inflammation</p>
                </div>
                
                <div className="text-center p-8 bg-green-50 rounded-2xl border border-green-200/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🏃‍♀️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-900 mb-3">Lifestyle</h3>
                  <p className="text-green-800 leading-relaxed">Exercise, nutrition, and stress management to help you feel stronger</p>
                </div>
                
                <div className="text-center p-8 bg-purple-50 rounded-2xl border border-purple-200/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-3">Support</h3>
                  <p className="text-purple-800 leading-relaxed">Emotional support, counseling, and connecting with others</p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200/50 mb-8">
                <h3 className="text-xl font-semibold text-yellow-900 mb-4">What to Expect:</h3>
                <ul className="space-y-3 text-yellow-800">
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 text-lg">•</span>
                    Treatment takes time - be patient with yourself
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 text-lg">•</span>
                    We'll work together to find what works best for you
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 text-lg">•</span>
                    It's normal to have good days and challenging days
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-600 mr-3 text-lg">•</span>
                    You're in control - you can always ask questions or change your mind
                  </li>
                </ul>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setCurrentSection('symptoms')}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-lg transition-colors duration-200"
                >
                  ← Back to Symptoms
                </button>
                <button 
                  onClick={() => setCurrentSection('questions')}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  I Have Questions →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Questions Section */}
        {currentSection === 'questions' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-thin text-slate-900 mb-4 tracking-tight">Your Questions Matter</h1>
              <p className="text-xl text-slate-600 font-light">It's normal to have lots of questions. Let's address some common ones.</p>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 border border-slate-200/50 shadow-sm">
              <div className="space-y-8 mb-10">
                {[
                  {
                    question: "Will I get better?",
                    answer: "Many people with your condition see significant improvement with treatment. While everyone's journey is different, there's every reason to be hopeful about your future."
                  },
                  {
                    question: "Is this my fault?",
                    answer: "Absolutely not. Autoimmune conditions are not caused by anything you did or didn't do. They're complex medical conditions that can affect anyone."
                  },
                  {
                    question: "Can I still live a normal life?",
                    answer: "Yes! While you may need to make some adjustments, many people with your condition work, travel, have families, and pursue their dreams. We'll help you adapt your life, not abandon it."
                  },
                  {
                    question: "What should I tell my family and friends?",
                    answer: "Share as much or as little as you're comfortable with. We can help you explain your condition to others in a way that helps them understand and support you."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-slate-50 rounded-2xl p-6 border-l-4 border-amber-500">
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">"{faq.question}"</h3>
                    <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-orange-200/50 mb-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Still Have Questions?</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">Remember, no question is too small or silly. Your care team is here to help.</p>
                  <button className="bg-amber-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Ask Your Care Team
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button 
                  onClick={() => setCurrentSection('treatment')}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-lg transition-colors duration-200"
                >
                  ← Back to Treatment
                </button>
                <button 
                  onClick={onBack}
                  className="bg-green-500 text-white px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  I Feel More Confident Now ✓
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppleLearnCondition;