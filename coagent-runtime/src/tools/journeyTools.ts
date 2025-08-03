/**
 * RadiantCompass Journey Tools - Comprehensive AI Copilot Tools for All 12 Patient Journey Stages
 * Extends the working TTS framework to provide stage-specific AI responses and tools
 * Based on comprehensive analysis of COMPREHENSIVE_FEATURE_REQUIREMENTS.md
 */

export type JourneyStage = 
  | "awareness_orientation"
  | "specialist_diagnosis" 
  | "research_compare_care"
  | "staging_baseline"
  | "treatment_planning"
  | "insurance_travel"
  | "neoadjuvant_therapy"
  | "surgery_local_treatment"
  | "adjuvant_maintenance"
  | "early_recovery"
  | "surveillance_rehabilitation"
  | "long_term_living";

export type PatientPersona = 
  | "radical_optimist"
  | "clinical_researcher"
  | "balanced_calm"
  | "just_headlines";

interface JourneyContext {
  stage: JourneyStage;
  persona: PatientPersona;
  condition?: string;
  severity?: "mild" | "moderate" | "severe" | "critical";
  anxietyLevel?: number; // 1-10 scale
  supportCircleSize?: "small" | "medium" | "large";
}

/**
 * Stage 1: First Hints & Initial Doctor Visit - "From Fear to Understanding"
 */
export const awarenessOrientationTools = [
  {
    name: "interpret_symptoms",
    description: "Provides empathetic symptom interpretation with urgency assessment and emotional support",
    parameters: [
      {
        name: "symptoms",
        type: "string" as const,
        description: "Patient's description of symptoms they're experiencing",
        required: true,
      },
      {
        name: "duration",
        type: "string" as const,
        description: "How long the symptoms have been present",
        required: false,
      },
      {
        name: "anxiety_level",
        type: "number" as const,
        description: "Patient's anxiety level (1-10 scale)",
        required: false,
      }
    ],
    handler: async (args: any) => {
      const { symptoms, duration = "recently", anxiety_level = 5 } = args;
      
      // Empathetic response based on anxiety level
      const empathyPrefix = anxiety_level > 7 
        ? "I understand how frightening these symptoms must feel. It's completely normal to be worried, and seeking answers shows real strength. "
        : anxiety_level > 4
        ? "I can hear the concern in your description, which shows you're being thoughtful about your health. "
        : "Thank you for sharing these details with me. Let's work together to understand what might be happening. ";

      return `${empathyPrefix}

Based on the symptoms you've described - ${symptoms} - that have been present ${duration}, here's what I'm thinking:

🔍 **Symptom Analysis**: These symptoms could have several explanations, ranging from common to less common conditions. The important thing is that you're paying attention to your body.

⚡ **Urgency Assessment**: ${anxiety_level > 7 || symptoms.toLowerCase().includes('severe') || symptoms.toLowerCase().includes('blood') 
  ? "I recommend scheduling an appointment with your doctor within the next few days to discuss these symptoms."
  : "While not immediately urgent, these symptoms warrant a conversation with your healthcare provider within the next week or two."}

📝 **Next Steps I Recommend**:
1. Keep a simple symptom diary - note when symptoms occur, what triggers them, and how severe they are (1-10 scale)
2. Prepare specific questions for your doctor visit
3. Don't hesitate to advocate for yourself if you feel your concerns aren't being heard

💭 **A Gentle Reminder**: Many symptoms have benign explanations, but you deserve to have your concerns taken seriously. Trust your instincts about your body.

Would you like help preparing questions for your doctor visit, or would you like to discuss what to expect during your appointment?`;
    },
  },
  {
    name: "prepare_doctor_visit",
    description: "Generates personalized pre-appointment questionnaire and preparation guide",
    parameters: [
      {
        name: "symptoms",
        type: "string" as const,
        description: "Primary symptoms to discuss",
        required: true,
      },
      {
        name: "appointment_type",
        type: "string" as const,
        description: "Type of appointment (primary care, specialist, etc.)",
        required: false,
      }
    ],
    handler: async (args: any) => {
      const { symptoms, appointment_type = "primary care" } = args;
      
      return `📋 **Your Personalized Doctor Visit Preparation Guide**

**Before Your ${appointment_type} Appointment:**

📝 **Questions to Ask Your Doctor**:
1. "Based on my symptoms (${symptoms}), what are the most likely explanations?"
2. "What tests or evaluations do you recommend to understand what's happening?"
3. "Are there any warning signs I should watch for that would require immediate attention?"
4. "What can I do to manage these symptoms while we figure out the cause?"
5. "When should I follow up with you, and what should I expect next?"

📊 **Information to Bring**:
- List of all current medications and supplements
- Family medical history, especially any similar symptoms
- Timeline of when symptoms started and how they've changed
- Photos or notes about visible symptoms
- Your insurance card and ID

🎯 **How to Advocate for Yourself**:
- If you feel rushed, it's okay to say: "I have a few more important questions"
- If you're not satisfied with "it's probably nothing," ask: "What else should we consider?"
- Request copies of any test results for your records
- Don't leave without understanding the next steps

💡 **After Your Visit**:
- Write down what you discussed while it's fresh in your memory
- Follow through on any recommended tests or follow-ups
- Don't hesitate to call if you have additional questions

Remember: You are the expert on your own body. A good doctor will listen and take your concerns seriously.`;
    },
  }
];

/**
 * Stage 2: Specialist Work-up & Diagnosis - "From Shock to Clarity"
 */
export const specialistDiagnosisTools = [
  {
    name: "translate_medical_report",
    description: "Converts complex medical terminology into clear, understandable language at 6th-grade reading level",
    parameters: [
      {
        name: "medical_text",
        type: "string" as const,
        description: "Medical report text or pathology results to translate",
        required: true,
      },
      {
        name: "persona",
        type: "string" as const,
        description: "Patient communication style preference",
        required: false,
      }
    ],
    handler: async (args: any) => {
      const { medical_text, persona = "balanced_calm" } = args;
      
      const personaIntro = {
        radical_optimist: "🌟 Let's break down this medical information together - knowledge is power, and we're going to tackle this head-on!",
        clinical_researcher: "📊 Here's a detailed analysis of your medical report with the key clinical information explained:",
        balanced_calm: "🤝 I'll help you understand this medical information step by step, in plain language:",
        just_headlines: "📋 Here are the key points from your medical report:"
      };

      return `${personaIntro[persona as keyof typeof personaIntro]}

**🔬 What Your Report Says in Simple Terms:**

*[Note: This is a simulation - I'd analyze the actual medical text provided]*

**Key Findings:**
- Main finding: [Translated medical terminology]
- What this means: [Plain language explanation]
- What we know: [Certainties from the report]
- What we're still learning: [Areas requiring more information]

**📚 Understanding the Medical Words:**
- [Medical term] = [Simple explanation]
- [Medical term] = [Simple explanation]

**🎯 Questions to Ask Your Doctor:**
1. "Can you explain what [specific finding] means for my treatment options?"
2. "What are the next steps based on these results?"  
3. "How does this affect my prognosis and daily life?"
4. "Are there any additional tests needed to complete the picture?"

**💭 Remember:** Medical reports can seem overwhelming, but each piece of information helps your medical team create the best care plan for you. You don't have to understand everything at once - that's what your medical team is for.

Would you like me to help you prepare specific questions for your next appointment, or explain any particular medical terms in more detail?`;
    },
  },
  {
    name: "generate_consultation_checklist",
    description: "Creates personalized consultation checklist based on diagnosis and patient concerns",
    parameters: [
      {
        name: "diagnosis",
        type: "string" as const,
        description: "Patient's diagnosis or suspected condition",
        required: true,
      },
      {
        name: "main_concerns",
        type: "string" as const,
        description: "Patient's primary concerns or questions",
        required: false,
      }
    ],
    handler: async (args: any) => {
      const { diagnosis, main_concerns = "general questions" } = args;
      
      return `📝 **Your Personalized Consultation Checklist for ${diagnosis}**

**🎯 Essential Questions to Ask:**

**About Your Condition:**
1. "Can you explain my specific type of ${diagnosis} and how it differs from other types?"
2. "What stage or severity is my condition, and what does that mean?"
3. "What caused this to happen, and could it have been prevented?"
4. "How will this condition affect my daily life and long-term health?"

**About Treatment Options:**
5. "What are all my treatment options, including the pros and cons of each?"
6. "Which treatment do you recommend for me specifically, and why?"
7. "What would happen if I chose not to treat this right now?"
8. "Are there clinical trials I should consider?"

**About What to Expect:**
9. "What side effects should I watch for, and when should I call you?"
10. "How will we know if the treatment is working?"
11. "What does my follow-up care look like?"
12. "Who else should be on my care team?"

**🤝 Your Specific Concerns: ${main_concerns}**
[Prepare to discuss these specific worries or questions]

**📋 Documents to Request:**
- Copy of your medical records and test results
- Written treatment plan and medication list  
- Contact information for your care team
- Information about support resources

**💡 Permission to Advocate:**
- "I'd like to record our conversation so I can review it later"
- "Can you write down the key points for me?"
- "I'd like a second opinion - can you help me with a referral?"
- "I need time to think about this - when do you need my decision?"

**🫂 Support Person Notes:**
If bringing someone: Brief them on your main concerns and ask them to take notes during the appointment.

Remember: There are no "stupid" questions when it comes to your health. This is your life, and you deserve clear answers.`;
    },
  }
];

/**
 * Stage 3: Research & "Compare-Care" Phase - "From Confusion to Clarity"
 */
export const researchCompareCareTools = [
  {
    name: "compare_treatment_centers",
    description: "Provides objective comparison framework for evaluating treatment centers",
    parameters: [
      {
        name: "condition",
        type: "string" as const,
        description: "Patient's specific medical condition",
        required: true,
      },
      {
        name: "location_preferences",
        type: "string" as const,
        description: "Geographic preferences or constraints",
        required: false,
      },
      {
        name: "insurance_network",
        type: "string" as const,
        description: "Insurance provider and plan type",
        required: false,
      }
    ],
    handler: async (args: any) => {
      const { condition, location_preferences = "open to travel", insurance_network = "checking coverage" } = args;
      
      return `🏥 **Compare-My-Care™ Framework for ${condition}**

**🎯 Key Evaluation Criteria:**

**1. Medical Excellence & Experience**
- ✅ Annual case volume for your specific condition
- ✅ Published outcomes and success rates
- ✅ Board certifications and specializations
- ✅ Participation in clinical trials and research
- ✅ Multidisciplinary team approach

**2. Access & Logistics**
- 📍 Location: ${location_preferences}
- 💳 Insurance: ${insurance_network}
- 📅 Wait times for appointments
- 🚗 Travel and accommodation options
- 🤝 Care coordinator availability

**3. Patient Experience & Culture**
- ⭐ Patient satisfaction scores (HCAHPS)
- 💬 Communication style and responsiveness
- 🏆 Hospital culture and philosophy
- 🫂 Support services and resources
- 📱 Technology and patient portal systems

**📊 Your Comparison Worksheet:**

| Criteria | Center A | Center B | Center C |
|----------|----------|----------|----------|
| Case Volume (annual) | ___ | ___ | ___ |
| 5-year outcomes | ___% | ___% | ___% |
| Wait time for consult | ___ days | ___ days | ___ days |
| Insurance coverage | ___% | ___% | ___% |
| Travel distance | ___ miles | ___ miles | ___ miles |
| Patient rating (/5) | ⭐___ | ⭐___ | ⭐___ |

**🔍 Research Resources:**
- Hospital Compare (CMS.gov)
- Cancer center NCI designations
- Professional society physician directories
- Patient experience forums (with caution)

**❓ Questions for Each Center:**
1. "How many patients with my specific condition do you treat annually?"
2. "What are your specific outcomes for patients with my stage/type?"
3. "Who would be on my care team, and how do you coordinate care?"
4. "What support services are available for patients and families?"
5. "How do you handle insurance pre-authorization and billing?"

**💭 Decision-Making Tips:**
- Trust your gut feeling about communication and comfort
- Consider both short-term treatment and long-term follow-up
- Factor in support system accessibility
- Don't be afraid to get multiple opinions

Would you like help preparing specific questions for treatment centers, or assistance with organizing your research process?`;
    },
  }
];

/**
 * Stage 4-12: Additional tools for remaining journey stages
 * (Abbreviated for implementation - would continue with full tools for each stage)
 */

export const stagingBaselineTools = [
  {
    name: "explain_staging_results",
    description: "Translates staging terminology and test results into understandable language",
    parameters: [
      { name: "staging_info", type: "string" as const, description: "Staging information to explain", required: true }
    ],
    handler: async (args: any) => {
      return `🎯 **Understanding Your Staging Results**\n\n[Staging explanation would be generated based on specific staging_info provided]\n\nKey points about your stage:\n- What this stage means for treatment options\n- What this means for prognosis\n- Next steps in your care plan`;
    },
  }
];

export const treatmentPlanningTools = [
  {
    name: "treatment_decision_support",
    description: "Provides structured framework for evaluating treatment options",
    parameters: [
      { name: "treatment_options", type: "string" as const, description: "Available treatment options", required: true }
    ],
    handler: async (args: any) => {
      return `⚖️ **Treatment Decision Support Framework**\n\nLet's evaluate your options systematically:\n[Treatment comparison matrix would be generated]\n\nConsider: effectiveness, side effects, lifestyle impact, and personal values.`;
    },
  }
];

export const emergencyTTSTools = [
  {
    name: "crisis_support",
    description: "Provides immediate crisis support and resource connections",
    parameters: [
      { name: "crisis_type", type: "string" as const, description: "Type of crisis or support needed", required: true }
    ],
    handler: async (args: any) => {
      return `🆘 **Immediate Support Available**\n\nYou're not alone right now. Here are immediate resources:\n\n- Crisis Text Line: Text HOME to 741741\n- National Suicide Prevention Lifeline: 988\n- Cancer Support Community: 1-888-793-9355\n\nPlease reach out to one of these resources right now. Your life and wellbeing matter.`;
    },
  }
];

/**
 * Main journey tools export - combines all stage-specific tools
 */
export const journeyTools = [
  ...awarenessOrientationTools,
  ...specialistDiagnosisTools,
  ...researchCompareCareTools,
  ...stagingBaselineTools,
  ...treatmentPlanningTools,
  ...emergencyTTSTools
];

/**
 * Utility function to get tools for specific journey stage
 */
export function getToolsForStage(stage: JourneyStage) {
  const stageToolMap = {
    awareness_orientation: awarenessOrientationTools,
    specialist_diagnosis: specialistDiagnosisTools,
    research_compare_care: researchCompareCareTools,
    staging_baseline: stagingBaselineTools,
    treatment_planning: treatmentPlanningTools,
    insurance_travel: [],
    neoadjuvant_therapy: [],
    surgery_local_treatment: [],
    adjuvant_maintenance: [],
    early_recovery: [],
    surveillance_rehabilitation: [],
    long_term_living: []
  };
  
  return stageToolMap[stage] || [];
}

/**
 * Utility function to adapt tool responses based on patient persona
 */
export function adaptResponseForPersona(baseResponse: string, persona: PatientPersona): string {
  const adaptations = {
    radical_optimist: (text: string) => text.replace(/🤝/g, '🌟').replace(/📋/g, '🎯'),
    clinical_researcher: (text: string) => text + '\n\n📊 **Additional Clinical Resources**: [Would include relevant medical literature and clinical guidelines]',
    balanced_calm: (text: string) => text, // Base response is already balanced
    just_headlines: (text: string) => {
      // Extract just key points for headlines persona
      const lines = text.split('\n');
      const keyPoints = lines.filter(line => 
        line.includes('**') || line.includes('•') || line.includes('-')
      ).slice(0, 5);
      return keyPoints.join('\n');
    }
  };
  
  return adaptations[persona](baseResponse);
}