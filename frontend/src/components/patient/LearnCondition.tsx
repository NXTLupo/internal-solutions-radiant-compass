import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface LearnConditionProps {
  onBack?: () => void;
}

export const LearnCondition: React.FC<LearnConditionProps> = ({ onBack }) => {
  const [currentSection, setCurrentSection] = useState<'basics' | 'symptoms' | 'treatment' | 'questions'>('basics');

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
              <p className="text-lg font-medium text-gray-900">Learning About Your Condition</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${currentSection === 'basics' ? 'bg-orange-500' : 'bg-orange-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentSection === 'symptoms' ? 'bg-orange-500' : 'bg-orange-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentSection === 'treatment' ? 'bg-orange-500' : 'bg-orange-200'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentSection === 'questions' ? 'bg-orange-500' : 'bg-orange-200'}`}></div>
          </div>
        </div>

        {/* Content */}
        {currentSection === 'basics' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Let's Start with the Basics</h1>
              <p className="text-lg text-gray-600">Understanding your condition doesn't have to be overwhelming.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🫀</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Condition in Simple Terms</h2>
              </div>

              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  You have a <strong>rare autoimmune condition</strong>. This means your body's immune system - 
                  which normally protects you from germs - is a bit confused and sometimes attacks your own healthy tissues.
                </p>
                
                <p>
                  Think of it like having an overly protective security guard who sometimes mistakes friends for enemies. 
                  It's not your fault, and it's not something you did wrong.
                </p>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">The Good News:</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>• You're not alone - thousands of people have this condition</li>
                    <li>• There are treatments that can help you feel better</li>
                    <li>• Many people with this condition live full, happy lives</li>
                    <li>• We're here to support you every step of the way</li>
                  </ul>
                </div>
              </div>

              <div className="text-center mt-8">
                <button 
                  onClick={() => setCurrentSection('symptoms')}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Tell Me About Symptoms →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentSection === 'symptoms' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Understanding Your Symptoms</h1>
              <p className="text-lg text-gray-600">What you might be experiencing and why.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { icon: '😴', title: 'Fatigue', description: 'Feeling tired even after rest - this is very common and not just "being lazy"' },
                    { icon: '🦴', title: 'Joint Pain', description: 'Your joints might ache or feel stiff, especially in the morning' },
                    { icon: '🧠', title: 'Brain Fog', description: 'Trouble concentrating or remembering things - this is real and not imagined' },
                    { icon: '🌡️', title: 'Fever', description: 'Your body temperature might go up as your immune system is active' }
                  ].map((symptom, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <div className="text-3xl mb-3">{symptom.icon}</div>
                      <h3 className="font-semibold text-gray-900 mb-2">{symptom.title}</h3>
                      <p className="text-gray-600">{symptom.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">Remember:</h3>
                  <p className="text-green-800">
                    Everyone's experience is different. You might have some, all, or different symptoms. 
                    What matters is how YOU feel, and we're here to help you manage whatever you're experiencing.
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentSection('basics')}
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  ← Back to Basics
                </button>
                <button 
                  onClick={() => setCurrentSection('treatment')}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  What About Treatment? →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentSection === 'treatment' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Treatment Options</h1>
              <p className="text-lg text-gray-600">There are ways to help you feel better.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
              <div className="space-y-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">🎯</div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">The Goal of Treatment</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    We want to help you feel better, reduce your symptoms, and get back to doing the things you love. 
                    Treatment isn't just about medicine - it's about supporting your whole life.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-3xl mb-3">💊</div>
                    <h3 className="font-semibold text-blue-900 mb-2">Medicine</h3>
                    <p className="text-blue-800 text-sm">Medications to calm your immune system and reduce inflammation</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-3xl mb-3">🏃‍♀️</div>
                    <h3 className="font-semibold text-green-900 mb-2">Lifestyle</h3>
                    <p className="text-green-800 text-sm">Exercise, nutrition, and stress management to help you feel stronger</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-3xl mb-3">🤝</div>
                    <h3 className="font-semibold text-purple-900 mb-2">Support</h3>
                    <p className="text-purple-800 text-sm">Emotional support, counseling, and connecting with others</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <h3 className="font-semibold text-yellow-900 mb-2">What to Expect:</h3>
                  <ul className="space-y-2 text-yellow-800">
                    <li>• Treatment takes time - be patient with yourself</li>
                    <li>• We'll work together to find what works best for you</li>
                    <li>• It's normal to have good days and challenging days</li>
                    <li>• You're in control - you can always ask questions or change your mind</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentSection('symptoms')}
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  ← Back to Symptoms
                </button>
                <button 
                  onClick={() => setCurrentSection('questions')}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  I Have Questions →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentSection === 'questions' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Questions Matter</h1>
              <p className="text-lg text-gray-600">It's normal to have lots of questions. Let's address some common ones.</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100">
              <div className="space-y-6">
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
                  <div key={index} className="border-l-4 border-orange-400 pl-6 py-2">
                    <h3 className="font-semibold text-gray-900 mb-2">"{faq.question}"</h3>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-orange-200">
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-3">Still Have Questions?</h3>
                  <p className="text-gray-600 mb-4">Ask your AI health assistant anything - no question is too small or silly.</p>
                  <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-8 py-3 rounded-full font-medium hover:from-amber-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg">
                    Ask Your Assistant
                  </button>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button 
                  onClick={() => setCurrentSection('treatment')}
                  className="text-gray-600 hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  ← Back to Treatment
                </button>
                <button 
                  onClick={onBack}
                  className="bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 transition-all duration-200 shadow-md hover:shadow-lg"
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

export default LearnCondition;