import React, { useState, useEffect } from 'react';
import { Shield, DollarSign, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface InsuranceAnalyzerProps {
  isActive?: boolean;
  autoFillData?: any;
  onDataUpdate?: (data: any) => void;
}

export const InsuranceAnalyzer: React.FC<InsuranceAnalyzerProps> = ({ 
  isActive = false, 
  autoFillData,
  onDataUpdate 
}) => {
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const [coverageData, setCoverageData] = useState<any>(null);

  useEffect(() => {
    if (autoFillData?.demonstrationMode) {
      setIsAutonomousMode(true);
      
      if (autoFillData?.coverageAnalysis) {
        setCoverageData(autoFillData.coverageAnalysis);
        console.log('[InsuranceAnalyzer] Using contextual coverage data from conversation');
      }
      
      if (onDataUpdate) {
        onDataUpdate({
          coverageAnalyzed: true,
          activeFromConversation: autoFillData?.activeFromConversation || false
        });
      }
    }
  }, [autoFillData, onDataUpdate]);

  const defaultCoverageData = autoFillData?.coverageAnalysis || {
    deductible: '$2,500',
    outOfPocketMax: '$8,500',
    copaySpecialist: '$50',
    coinsurance: '20%'
  };

  const pendingClaims = autoFillData?.pendingClaims || [
    { service: 'MRI Scan', status: 'Under Review', amount: '$3,200' },
    { service: 'Specialist Consultation', status: 'Approved', amount: '$450' }
  ];

  const recommendedActions = autoFillData?.recommendedActions || [
    'Review coverage for upcoming treatments',
    'Check prior authorization requirements',
    'Verify provider network status'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Insurance Analyzer</h2>
              <p className="text-sm text-gray-600">Navigate your healthcare coverage with confidence</p>
            </div>
          </div>
          
          {isAutonomousMode && (
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
              🤖 AI Analysis Mode
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
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Dr. Maya's Expert Insurance Analysis</h3>
                <p className="text-sm text-blue-800 leading-relaxed mb-3">
                  {autoFillData?.expertDescription || 
                   "Your Insurance Analyzer breaks down complex insurance policies into understandable terms, identifies coverage gaps, and guides you through the appeals process when needed."}
                </p>
                {autoFillData?.keyBenefits && (
                  <div className="bg-white/60 rounded-lg p-3 mt-3">
                    <div className="text-xs font-medium text-blue-900 mb-2">🎯 Key Benefits:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                      {autoFillData.keyBenefits.map((benefit: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-3 text-xs text-blue-700 font-medium">
                  🤖 I'm analyzing your current plan and identifying opportunities for better coverage!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Coverage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">{defaultCoverageData.deductible}</div>
                <div className="text-sm text-blue-700">Annual Deductible</div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">{defaultCoverageData.outOfPocketMax}</div>
                <div className="text-sm text-green-700">Out-of-Pocket Max</div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-900">{defaultCoverageData.copaySpecialist}</div>
                <div className="text-sm text-purple-700">Specialist Copay</div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-900">{defaultCoverageData.coinsurance}</div>
                <div className="text-sm text-orange-700">Coinsurance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Claims
          </h3>
          <div className="space-y-3">
            {pendingClaims.map((claim: any, index: number) => (
              <div key={index} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{claim.service}</div>
                    <div className="text-sm text-gray-600">Amount: {claim.amount}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    claim.status === 'Approved' 
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : claim.status === 'Under Review'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {claim.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Recommended Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedActions.map((action: string, index: number) => (
              <div key={index} className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className="text-sm text-blue-800 font-medium">{action}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Request Coverage Review
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            File Appeal
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Download Summary
          </button>
        </div>
      </div>
    </div>
  );
};
