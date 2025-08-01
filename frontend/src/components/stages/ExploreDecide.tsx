import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface ExploreDecideProps {
  onBackToDashboard?: () => void;
}

interface CareTeamMember {
  id: string;
  name: string;
  specialty: string;
  credentials: string;
  location: string;
  rating: number;
  reviewCount: number;
  availability: string;
  acceptsInsurance: boolean;
  languages: string[];
  experience: string;
  specializations: string[];
}

interface InsurancePlan {
  id: string;
  planName: string;
  provider: string;
  monthlyPremium: number;
  deductible: number;
  maxOutOfPocket: number;
  coverageLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  rareDiseaseCoverage: string;
  specialistCoverage: string;
  prescriptionCoverage: string;
  pros: string[];
  cons: string[];
}

interface TreatmentOption {
  id: string;
  name: string;
  type: 'medication' | 'therapy' | 'procedure' | 'lifestyle';
  description: string;
  effectiveness: number;
  sideEffects: string[];
  cost: string;
  timeCommitment: string;
  availability: string;
  evidenceLevel: 'High' | 'Moderate' | 'Limited';
}

const careTeamMembers: CareTeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'Rheumatology',
    credentials: 'MD, PhD',
    location: 'University Medical Center - 2.3 miles',
    rating: 4.9,
    reviewCount: 127,
    availability: 'Next available: 2 weeks',
    acceptsInsurance: true,
    languages: ['English', 'Mandarin'],
    experience: '15 years specializing in rare autoimmune conditions',
    specializations: ['Rare Autoimmune Disorders', 'Systemic Lupus', 'Vasculitis']
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    specialty: 'Medical Genetics',
    credentials: 'MD, MS',
    location: 'Regional Genetics Center - 5.7 miles',
    rating: 4.8,
    reviewCount: 89,
    availability: 'Next available: 3 weeks',
    acceptsInsurance: true,
    languages: ['English', 'Spanish'],
    experience: '12 years in genetic disorders and rare disease diagnosis',
    specializations: ['Genetic Testing', 'Rare Metabolic Disorders', 'Family Counseling']
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    specialty: 'Pain Management',
    credentials: 'MD, FIPP',
    location: 'Comprehensive Pain Center - 4.1 miles',
    rating: 4.7,
    reviewCount: 203,
    availability: 'Next available: 1 week',
    acceptsInsurance: true,
    languages: ['English'],
    experience: '18 years in chronic pain management for rare conditions',
    specializations: ['Chronic Pain', 'Nerve Blocks', 'Multimodal Pain Management']
  }
];

const insurancePlans: InsurancePlan[] = [
  {
    id: '1',
    planName: 'Comprehensive Care Plus',
    provider: 'HealthFirst',
    monthlyPremium: 450,
    deductible: 2500,
    maxOutOfPocket: 8000,
    coverageLevel: 'Gold',
    rareDiseaseCoverage: 'Excellent - covers 90% of rare disease treatments',
    specialistCoverage: '$30 copay after deductible',
    prescriptionCoverage: 'Tier 1-4 covered, specialty drugs 80% coverage',
    pros: [
      'Excellent rare disease coverage',
      'Large network of specialists',
      'Low specialist copays',
      'Covers experimental treatments'
    ],
    cons: [
      'Higher monthly premium',
      'Moderate deductible',
      'Prior authorization required for some treatments'
    ]
  },
  {
    id: '2',
    planName: 'Essential Health',
    provider: 'SecureHealth',
    monthlyPremium: 320,
    deductible: 4000,
    maxOutOfPocket: 12000,
    coverageLevel: 'Silver',
    rareDiseaseCoverage: 'Good - covers 70% of rare disease treatments',
    specialistCoverage: '$50 copay after deductible',
    prescriptionCoverage: 'Basic coverage, specialty drugs 60% coverage',
    pros: [
      'Lower monthly premium',
      'Good basic coverage',
      'Includes telehealth',
      'Mental health coverage included'
    ],
    cons: [
      'Higher deductible',
      'Limited specialist network',
      'Lower coverage for specialty drugs',
      'More prior authorizations required'
    ]
  }
];

const treatmentOptions: TreatmentOption[] = [
  {
    id: '1',
    name: 'Immunosuppressive Therapy',
    type: 'medication',
    description: 'Targeted medication to reduce immune system overactivity and inflammation',
    effectiveness: 85,
    sideEffects: ['Increased infection risk', 'Fatigue', 'Nausea', 'Liver monitoring required'],
    cost: '$2,000-4,000/month',
    timeCommitment: 'Daily medication, monthly monitoring visits',
    availability: 'Widely available',
    evidenceLevel: 'High'
  },
  {
    id: '2',
    name: 'Physical Therapy Program',
    type: 'therapy',
    description: 'Specialized physical therapy focused on maintaining mobility and reducing pain',
    effectiveness: 70,
    sideEffects: ['Temporary muscle soreness', 'Initial fatigue'],
    cost: '$150-200/session',
    timeCommitment: '2-3 sessions per week, 6-12 weeks',
    availability: 'Readily available',
    evidenceLevel: 'High'
  },
  {
    id: '3',
    name: 'Anti-inflammatory Diet',
    type: 'lifestyle',
    description: 'Structured nutrition plan to reduce inflammation and support overall health',
    effectiveness: 60,
    sideEffects: ['Adjustment period', 'Social eating challenges'],
    cost: '$200-300/month additional grocery cost',
    timeCommitment: 'Daily meal planning and preparation',
    availability: 'Self-directed with nutritionist support',
    evidenceLevel: 'Moderate'
  },
  {
    id: '4',
    name: 'Experimental Gene Therapy',
    type: 'procedure',
    description: 'Cutting-edge treatment targeting genetic causes of the condition',
    effectiveness: 75,
    sideEffects: ['Unknown long-term effects', 'Immune reactions', 'Injection site reactions'],
    cost: '$50,000-100,000 (may be covered by clinical trial)',
    timeCommitment: 'Initial consultation, treatment sessions, long-term monitoring',
    availability: 'Limited - clinical trial sites only',
    evidenceLevel: 'Limited'
  }
];

export const ExploreDecide: React.FC<ExploreDecideProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'care-team' | 'insurance' | 'treatments'>('care-team');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const getCoverageLevelColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 80) return 'bg-green-500';
    if (effectiveness >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return '💊';
      case 'therapy': return '🏥';
      case 'procedure': return '⚕️';
      case 'lifestyle': return '🍃';
      default: return '💊';
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
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 border border-amber-300">
                <span className="text-sm font-medium text-amber-800">🔍 Stage 3: Explore & Decide</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Options & Make Decisions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Research treatment options, find the right care team, and make informed decisions about your healthcare coverage.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-orange-200">
            {[
              { id: 'care-team', label: 'Find Care Team', icon: '👨‍⚕️' },
              { id: 'insurance', label: 'Insurance Planning', icon: '🛡️' },
              { id: 'treatments', label: 'Treatment Options', icon: '💊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md'
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
          {/* Care Team Tab */}
          {activeTab === 'care-team' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Your Care Team</h2>
                  <p className="text-gray-600">
                    Find specialists, primary care providers, and other healthcare professionals experienced with your condition.
                  </p>
                </div>

                <div className="space-y-6">
                  {careTeamMembers.map((member) => (
                    <div key={member.id} className="border border-gray-200 rounded-lg p-6 hover:border-amber-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              {member.specialty}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>{member.credentials}</span>
                            <div className="flex items-center space-x-1">
                              <span>⭐</span>
                              <span>{member.rating}</span>
                              <span>({member.reviewCount} reviews)</span>
                            </div>
                            {member.acceptsInsurance && (
                              <span className="text-green-600">✓ Insurance Accepted</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">📍 {member.location}</p>
                          <p className="text-sm text-gray-600 mb-3">🗓️ {member.availability}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Experience & Specializations:</h4>
                        <p className="text-sm text-gray-600 mb-2">{member.experience}</p>
                        <div className="flex flex-wrap gap-2">
                          {member.specializations.map((spec, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Languages: {member.languages.join(', ')}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                            View Profile
                          </button>
                          <button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-yellow-500 hover:to-amber-600 transition-all duration-200">
                            Book Consultation
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Provider CTA */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Can't Find the Right Provider?</h3>
                  <p className="text-gray-600 mb-4">
                    Our care team coordinators can help you find specialists experienced with your specific condition.
                  </p>
                  <button className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-200">
                    Get Help Finding Providers
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Insurance Planning Tab */}
          {activeTab === 'insurance' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Insurance & Financial Planning</h2>
                  <p className="text-gray-600">
                    Compare insurance plans and understand coverage options for rare disease treatments.
                  </p>
                </div>

                <div className="space-y-6">
                  {insurancePlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-6 hover:border-amber-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{plan.planName}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getCoverageLevelColor(plan.coverageLevel)}`}>
                              {plan.coverageLevel}
                            </span>
                          </div>
                          <p className="text-gray-600">{plan.provider}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${plan.monthlyPremium}/mo</div>
                          <div className="text-sm text-gray-600">Monthly Premium</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-semibold text-gray-900">${plan.deductible.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Deductible</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-semibold text-gray-900">${plan.maxOutOfPocket.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Max Out-of-Pocket</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-semibold text-gray-900">{plan.coverageLevel}</div>
                          <div className="text-sm text-gray-600">Coverage Level</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Rare Disease Coverage</h4>
                          <p className="text-sm text-gray-600">{plan.rareDiseaseCoverage}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Specialist Coverage</h4>
                          <p className="text-sm text-gray-600">{plan.specialistCoverage}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Prescription Coverage</h4>
                          <p className="text-sm text-gray-600">{plan.prescriptionCoverage}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-green-600">✓ Pros</h4>
                          <ul className="space-y-1">
                            {plan.pros.map((pro, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 text-red-600">✗ Cons</h4>
                          <ul className="space-y-1">
                            {plan.cons.map((con, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-yellow-500 hover:to-amber-600 transition-all duration-200">
                          Get Quote
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                          Compare Benefits
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Assistance CTA */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Need Financial Assistance?</h3>
                  <p className="text-gray-600 mb-4">
                    Explore patient assistance programs, grants, and financial support options for rare disease treatments.
                  </p>
                  <button className="bg-gradient-to-r from-green-400 to-emerald-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-green-500 hover:to-emerald-600 transition-all duration-200">
                    Find Financial Resources
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Treatment Options Tab */}
          {activeTab === 'treatments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Treatment Options</h2>
                  <p className="text-gray-600">
                    Explore available treatments, their effectiveness, and what to expect from each option.
                  </p>
                </div>

                <div className="space-y-6">
                  {treatmentOptions.map((treatment) => (
                    <div key={treatment.id} className="border border-gray-200 rounded-lg p-6 hover:border-amber-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start space-x-4 mb-4">
                        <span className="text-3xl">{getTypeIcon(treatment.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{treatment.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getEvidenceLevelColor(treatment.evidenceLevel)}`}>
                              {treatment.evidenceLevel} Evidence
                            </span>
                          </div>
                          <p className="text-gray-600 mb-4">{treatment.description}</p>
                        </div>
                      </div>

                      {/* Effectiveness Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Effectiveness</span>
                          <span className="text-sm text-gray-600">{treatment.effectiveness}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getEffectivenessColor(treatment.effectiveness)}`}
                            style={{ width: `${treatment.effectiveness}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Cost</h4>
                          <p className="text-sm text-gray-600">{treatment.cost}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Time Commitment</h4>
                          <p className="text-sm text-gray-600">{treatment.timeCommitment}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Availability</h4>
                          <p className="text-sm text-gray-600">{treatment.availability}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Type</h4>
                          <p className="text-sm text-gray-600 capitalize">{treatment.type}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Potential Side Effects</h4>
                        <div className="flex flex-wrap gap-2">
                          {treatment.sideEffects.map((effect, index) => (
                            <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full border border-red-200">
                              {effect}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-yellow-500 hover:to-amber-600 transition-all duration-200">
                          Learn More
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-all duration-200">
                          Discuss with Doctor
                        </button>
                        <button className="bg-blue-100 text-blue-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-200 transition-all duration-200">
                          Compare Options
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clinical Trials CTA */}
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 p-6 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Interested in Clinical Trials?</h3>
                  <p className="text-gray-600 mb-4">
                    Explore cutting-edge treatments and contribute to rare disease research through clinical trials.
                  </p>
                  <button className="bg-gradient-to-r from-purple-400 to-violet-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-purple-500 hover:to-violet-600 transition-all duration-200">
                    Find Clinical Trials
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl border border-amber-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Move Forward?</h3>
              <p className="text-gray-600 text-sm">
                Once you've explored your options and made key decisions about your care team and treatment, 
                you can move on to Stage 4: Coordinate & Commit.
              </p>
            </div>
            <button className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-500 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Continue to Stage 4 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreDecide;