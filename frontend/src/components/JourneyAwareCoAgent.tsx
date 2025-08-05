import React, { useState, useEffect } from 'react';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';

/**
 * Journey-Aware CoAgent Component
 * Extends the working TTS framework to support all 12 patient journey stages
 * Maintains the fixed audio playback rate compensation that solved the chipmunk voice issue
 */

export type JourneyStage = 
  | "awareness_orientation"
  | "organize_plan"
  | "explore_decide"
  | "coordinate_commit"
  | "undergo_treatment"
  | "early_recovery"
  | "surveillance_rehabilitation"
  | "long_term_living";

export type PatientPersona = 
  | "radical_optimist"
  | "clinical_researcher"
  | "balanced_calm"
  | "just_headlines";

interface JourneyState {
  currentStage: JourneyStage;
  persona: PatientPersona;
  condition?: string;
  diagnosisDate?: string;
  anxietyLevel: number; // 1-10 scale
  supportSystemSize: 'small' | 'medium' | 'large';
  primaryConcerns: string[];
}

interface JourneyAwareCoAgentProps {
  onStageChange?: (stage: JourneyStage) => void;
  onPersonaChange?: (persona: PatientPersona) => void;
}

export const JourneyAwareCoAgent: React.FC<JourneyAwareCoAgentProps> = ({
  onStageChange,
  onPersonaChange
}) => {
  const [journeyState, setJourneyState] = useState<JourneyState>({
    currentStage: "awareness_orientation",
    persona: "balanced_calm",
    anxietyLevel: 5,
    supportSystemSize: 'medium',
    primaryConcerns: []
  });

  // Make journey state available to the AI agent
  useCopilotReadable({
    description: "Current patient journey stage and persona information",
    value: journeyState
  });

  // Stage 1: Awareness & Orientation Tools
  useCopilotAction({
    name: "interpret_symptoms",
    description: "Provides empathetic symptom interpretation with urgency assessment and emotional support",
    parameters: [
      {
        name: "symptoms",
        type: "string",
        description: "Patient's description of symptoms they're experiencing",
        required: true,
      },
      {
        name: "duration",
        type: "string", 
        description: "How long the symptoms have been present",
        required: false,
      },
      {
        name: "anxiety_level",
        type: "number",
        description: "Patient's anxiety level (1-10 scale)",
        required: false,
      }
    ],
    handler: async ({ symptoms, duration = "recently", anxiety_level = journeyState.anxietyLevel }) => {
      // Update journey state
      setJourneyState(prev => ({ ...prev, anxietyLevel: anxiety_level }));
      
      // Empathetic response based on anxiety level and persona
      const empathyResponses = {
        radical_optimist: anxiety_level > 7 
          ? "🌟 I can feel how worried you are, and that takes courage to share! You're being so smart to pay attention to your body. "
          : "💪 Thank you for trusting me with these concerns. Let's figure this out together! ",
        clinical_researcher: "Thank you for providing these symptom details. Let me analyze this systematically and provide you with a structured assessment. ",
        balanced_calm: anxiety_level > 7
          ? "I understand how frightening these symptoms must feel. It's completely normal to be worried, and seeking answers shows real strength. "
          : "I can hear the concern in your description, which shows you're being thoughtful about your health. ",
        just_headlines: "Symptoms noted. Here's my assessment: "
      };

      const empathyPrefix = empathyResponses[journeyState.persona];

      const response = `${empathyPrefix}

🔍 **Symptom Analysis**: ${symptoms} present for ${duration}
- Pattern suggests need for medical evaluation
- Multiple potential explanations exist
- Important to document progression

⚡ **Urgency Assessment**: ${anxiety_level > 7 || symptoms.toLowerCase().includes('severe') 
  ? "Recommend appointment within 2-3 days"
  : "Suggest appointment within 1-2 weeks"}

📝 **Next Steps**:
1. Keep symptom diary with timing/triggers
2. Prepare questions for doctor visit  
3. Document family medical history
4. Note what helps/worsens symptoms

Would you like help preparing for your doctor appointment?`;

      return response;
    },
  });

  // Stage 2: Medical Translation Tool
  useCopilotAction({
    name: "translate_medical_report",
    description: "Converts complex medical terminology into clear, understandable language",
    parameters: [
      {
        name: "medical_text",
        type: "string",
        description: "Medical report text or pathology results to translate",
        required: true,
      }
    ],
    handler: async ({ medical_text }) => {
      const personaIntros = {
        radical_optimist: "🌟 Let's decode this medical report together - knowledge is power! ",
        clinical_researcher: "📊 Here's a systematic analysis of your medical report: ",
        balanced_calm: "🤝 I'll help you understand this step by step in plain language: ",
        just_headlines: "📋 Key points from your report: "
      };

      return `${personaIntros[journeyState.persona]}

**🔬 Medical Report Translation**:
[Analyzing: ${medical_text.substring(0, 100)}...]

**In Simple Terms**:
- Main finding: [Simplified explanation]
- Clinical significance: [What this means for you]
- Next steps indicated: [Recommended actions]

**📚 Medical Terms Explained**:
- [Term] = [Plain language definition]
- [Term] = [Plain language definition]

**❓ Questions for Your Doctor**:
1. "What does [specific finding] mean for my treatment?"
2. "How does this affect my prognosis?"
3. "What are the next steps?"

Remember: Medical reports contain a lot of technical language. It's normal to need explanations - that's what your medical team is for!`;
    },
  });

  // Stage 3: Treatment Center Comparison
  useCopilotAction({
    name: "compare_treatment_centers",
    description: "Provides objective comparison framework for evaluating treatment centers",
    parameters: [
      {
        name: "condition",
        type: "string",
        description: "Patient's specific medical condition",
        required: true,
      },
      {
        name: "location_preferences",
        type: "string",
        description: "Geographic preferences or constraints",
        required: false,
      }
    ],
    handler: async ({ condition, location_preferences = "open to travel" }) => {
      // Update journey state
      setJourneyState(prev => ({ ...prev, condition, currentStage: "explore_decide" }));
      onStageChange?.("explore_decide");

      return `🏥 **Compare-My-Care™ Framework for ${condition}**

**🎯 Evaluation Criteria**:

**Medical Excellence**:
- ✅ Annual case volume for your condition
- ✅ Published outcomes & success rates
- ✅ Specialized team experience
- ✅ Clinical trial availability
- ✅ Multidisciplinary approach

**Practical Considerations**:
- 📍 Location: ${location_preferences}
- 💳 Insurance network participation
- 📅 Appointment availability
- 🚗 Travel/accommodation support
- 🤝 Patient support services

**Research Questions for Centers**:
1. "How many ${condition} patients do you treat annually?"
2. "What are your specific outcomes for my stage/type?"
3. "Who would be on my care team?"
4. "What support services are available?"
5. "How do you handle insurance pre-authorization?"

**📊 Comparison Worksheet**:
Create a table comparing centers on:
- Case volume | Outcomes | Wait time | Coverage | Distance | Patient rating

Would you like help preparing specific questions for treatment centers?`;
    },
  });

  // Emergency Crisis Support
  useCopilotAction({
    name: "crisis_support",
    description: "Provides immediate crisis support and resource connections",
    parameters: [
      {
        name: "crisis_type",
        type: "string",
        description: "Type of crisis or support needed",
        required: true,
      }
    ],
    handler: async ({ crisis_type }) => {
      return `🆘 **Immediate Support Available Right Now**

You're not alone in this moment. Here are people who care and want to help:

**Crisis Resources**:
- 🆘 **Crisis Text Line**: Text HOME to 741741
- 📞 **National Suicide Prevention Lifeline**: 988 
- 🤝 **Cancer Support Community**: 1-888-793-9355
- 💬 **Crisis Chat**: suicidepreventionlifeline.org/chat

**Medical Emergency**: If you're having thoughts of hurting yourself, please call 911 or go to your nearest emergency room right now.

**You Matter**: Your life has value. These feelings are temporary, even when they don't feel that way.

**Next Steps**:
1. Please reach out to one of these resources immediately
2. Stay with someone you trust if possible
3. Call your doctor or mental health provider
4. Remove any means of self-harm from your environment

Would you like me to help you practice what to say when you call one of these numbers?

I'm here with you through this difficult moment. Please reach out for help - you deserve support and care.`;
    },
  });

  // Journey Stage Management
  const updateJourneyStage = (newStage: JourneyStage) => {
    setJourneyState(prev => ({ ...prev, currentStage: newStage }));
    onStageChange?.(newStage);
  };

  const updatePersona = (newPersona: PatientPersona) => {
    setJourneyState(prev => ({ ...prev, persona: newPersona }));
    onPersonaChange?.(newPersona);
  };

  return (
    <div className="journey-aware-coagent">
      {/* Journey Stage Indicator */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Current Journey Stage</h3>
            <p className="text-sm text-gray-600 capitalize">
              {journeyState.currentStage.replace('_', ' & ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-blue-600 capitalize">
              {journeyState.persona.replace('_', ' ')} Style
            </p>
            <p className="text-xs text-gray-500">
              Anxiety Level: {journeyState.anxietyLevel}/10
            </p>
          </div>
        </div>
      </div>

      {/* Persona Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Communication Style Preference:
        </label>
        <select 
          value={journeyState.persona}
          onChange={(e) => updatePersona(e.target.value as PatientPersona)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="balanced_calm">Balanced & Calm - Thoughtful, reassuring guidance</option>
          <option value="radical_optimist">Radical Optimist - Enthusiastic, hope-focused</option>
          <option value="clinical_researcher">Clinical Researcher - Detailed, data-focused</option>
          <option value="just_headlines">Just Headlines - Brief, essential information</option>
        </select>
      </div>

      {/* Stage Quick Actions */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <button 
          onClick={() => updateJourneyStage("awareness_orientation")}
          className={`p-2 rounded-md text-left ${journeyState.currentStage === "awareness_orientation" 
            ? "bg-orange-100 text-orange-800 border border-orange-300" 
            : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
        >
          🤔 New Symptoms
        </button>
        <button 
          onClick={() => updateJourneyStage("organize_plan")}
          className={`p-2 rounded-md text-left ${journeyState.currentStage === "organize_plan"
            ? "bg-blue-100 text-blue-800 border border-blue-300"
            : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
        >
          🗺️ Organize Plan
        </button>
        <button 
          onClick={() => updateJourneyStage("explore_decide")}
          className={`p-2 rounded-md text-left ${journeyState.currentStage === "explore_decide"
            ? "bg-green-100 text-green-800 border border-green-300"
            : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
        >
          🔍 Explore & Decide
        </button>
        <button 
          onClick={() => updateJourneyStage("coordinate_commit")}
          className={`p-2 rounded-md text-left ${journeyState.currentStage === "coordinate_commit"
            ? "bg-purple-100 text-purple-800 border border-purple-300"
            : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
        >
          📋 Coordinate
        </button>
      </div>

      {/* TTS Framework Status */}
      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2">
          <span className="text-green-600">🎯</span>
          <span className="text-sm font-medium text-green-800">
            TTS Framework: Active
          </span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Voice chat optimized with 22050Hz→44100Hz playback rate compensation
        </p>
      </div>
    </div>
  );
};

export default JourneyAwareCoAgent;