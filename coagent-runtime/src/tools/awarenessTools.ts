import { tool } from "@copilotkit/sdk";
import { z } from "zod";

// Schema definitions for awareness stage tools
const ConditionExplanationSchema = z.object({
  conditionName: z.string().describe("Name of the medical condition"),
  patientAge: z.number().optional().describe("Patient's age for age-appropriate explanations"),
  severity: z.string().optional().describe("Severity level of the condition"),
  specificQuestions: z.array(z.string()).optional().describe("Specific questions the patient has about their condition")
});

const GoalSettingSchema = z.object({
  patientId: z.number().describe("Patient ID"),
  conditionId: z.number().describe("Medical condition ID"),
  goalCategory: z.enum(["physical", "emotional", "social", "practical"]).describe("Category of goal to focus on"),
  timeframe: z.enum(["short", "medium", "long"]).describe("Timeframe for the goal")
});

const QuickStartGuideSchema = z.object({
  conditionName: z.string().describe("Name of the medical condition"),
  patientAge: z.number().optional().describe("Patient's age"),
  diagnosisDate: z.string().optional().describe("Date of diagnosis"),
  severity: z.string().optional().describe("Severity level"),
  urgentConcerns: z.array(z.string()).optional().describe("Any urgent concerns or questions")
});

const SymptomTrackingSchema = z.object({
  symptoms: z.array(z.string()).describe("List of symptoms to track"),
  trackingMethod: z.enum(["app", "journal", "digital_form"]).describe("Preferred tracking method")
});

export const conditionExplanationTool = tool({
  name: "explain_condition",
  description: "Generate a personalized, easy-to-understand explanation of a patient's medical condition, including symptoms, treatments, and prognosis in age-appropriate language.",
  parameters: ConditionExplanationSchema,
  execute: async ({ conditionName, patientAge, severity, specificQuestions }) => {
    try {
      // In a real implementation, this would call your backend API
      const response = await fetch(`${process.env.BACKEND_URL}/api/v1/awareness/explain-condition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          condition_name: conditionName,
          patient_age: patientAge,
          severity,
          specific_questions: specificQuestions
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        conditionName: data.condition_name,
        explanation: data.simplified_explanation,
        commonSymptoms: data.common_symptoms,
        treatmentApproaches: data.treatment_approaches,
        prognosis: data.prognosis_summary,
        prevalence: data.prevalence_info,
        personalizedInsights: data.personalized_insights,
        nextSteps: data.next_steps,
        success: true
      };
    } catch (error) {
      console.error('Error explaining condition:', error);
      return {
        error: "I encountered an issue generating the condition explanation. Please try again or contact your healthcare provider for detailed information about your condition.",
        success: false
      };
    }
  }
});

export const goalSettingTool = tool({
  name: "set_personal_goals",
  description: "Generate personalized goal recommendations for the awareness and orientation stage based on the patient's condition and profile.",
  parameters: GoalSettingSchema,
  execute: async ({ patientId, conditionId, goalCategory, timeframe }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/v1/awareness/recommend-goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          condition_id: conditionId,
          current_stage: "awareness"
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter goals by category and timeframe if specified
      let filteredGoals = data.recommended_goals;
      if (goalCategory) {
        filteredGoals = filteredGoals.filter((goal: any) => goal.category === goalCategory);
      }
      if (timeframe) {
        filteredGoals = filteredGoals.filter((goal: any) => goal.timeframe === timeframe);
      }
      
      return {
        goals: filteredGoals,
        personalizationNotes: data.personalization_notes,
        category: goalCategory,
        timeframe: timeframe,
        success: true
      };
    } catch (error) {
      console.error('Error setting goals:', error);
      return {
        error: "I had trouble generating personalized goals. Let me suggest some general goals for the awareness stage: understanding your condition, building a support network, and organizing your healthcare information.",
        success: false
      };
    }
  }
});

export const quickStartGuideTool = tool({
  name: "generate_quick_start_guide",
  description: "Create a personalized quick-start guide for the first weeks after diagnosis, with step-by-step actions organized by priority and timeframe.",
  parameters: QuickStartGuideSchema,
  execute: async ({ conditionName, patientAge, diagnosisDate, severity, urgentConcerns }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/v1/awareness/quick-start-guide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          condition_name: conditionName,
          patient_age: patientAge,
          diagnosis_date: diagnosisDate,
          severity
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        steps: data.steps,
        emergencyContacts: data.emergency_contacts,
        importantReminders: data.important_reminders,
        personalizedTips: data.personalized_tips,
        urgentConcerns: urgentConcerns,
        success: true
      };
    } catch (error) {
      console.error('Error generating quick start guide:', error);
      return {
        error: "I had trouble creating your personalized guide. Here are some immediate steps: 1) Schedule a follow-up with your doctor, 2) Start a symptom diary, 3) Connect with patient support groups, 4) Organize your medical records.",
        success: false
      };
    }
  }
});

export const symptomTrackingSetupTool = tool({
  name: "setup_symptom_tracking",
  description: "Help patients set up an effective symptom tracking system with personalized recommendations for tracking methods and key symptoms to monitor.",
  parameters: SymptomTrackingSchema,
  execute: async ({ symptoms, trackingMethod }) => {
    try {
      // Generate tracking recommendations based on the chosen method
      const trackingRecommendations = {
        app: {
          name: "Mobile App Tracking",
          description: "Use a smartphone app for convenient daily tracking with reminders and analytics.",
          recommended_apps: [
            "MyRA (for arthritis conditions)",
            "ArthritisPower",
            "PatientsLikeMe",
            "Symple Symptom Tracker"
          ],
          benefits: ["Automated reminders", "Data visualization", "Easy sharing with doctors", "Pattern recognition"],
          setup_steps: [
            "Download recommended app from app store",
            "Set up daily reminder notifications",
            "Input your specific symptoms and medications",
            "Start with 1-2 week baseline tracking",
            "Review patterns weekly"
          ]
        },
        journal: {
          name: "Physical Journal Tracking",
          description: "Use a dedicated notebook or journal for detailed symptom recording.",
          supplies_needed: ["Dedicated notebook", "Comfortable pen", "Ruler for rating scales"],
          benefits: ["No battery required", "Detailed notes possible", "Private and secure", "Customizable format"],
          setup_steps: [
            "Choose a small, portable notebook",
            "Create daily entry template",
            "Include date, time, symptoms, severity (1-10), triggers, medications",
            "Set consistent daily tracking time",
            "Review weekly patterns"
          ]
        },
        digital_form: {
          name: "Digital Form Tracking",
          description: "Use online forms or spreadsheets for structured symptom logging.",
          tools: ["Google Forms", "Microsoft Excel", "Google Sheets", "Typeform"],
          benefits: ["Structured data entry", "Easy to share", "Automatic backups", "Can add calculations"],
          setup_steps: [
            "Create symptom tracking template",
            "Include dropdown menus for consistency",
            "Set up automatic time stamps",
            "Create weekly summary views",
            "Share access with healthcare team"
          ]
        }
      };

      const selectedMethod = trackingRecommendations[trackingMethod];
      
      // Generate specific tracking template based on symptoms
      const trackingTemplate = {
        daily_entries: {
          required_fields: ["Date", "Time", "Overall feeling (1-10)"],
          symptom_fields: symptoms.map(symptom => ({
            name: symptom,
            severity_scale: "1-10",
            duration: "hours",
            triggers: "text field",
            relief_methods: "text field"
          })),
          additional_fields: ["Medications taken", "Sleep quality", "Activity level", "Mood", "Notes"]
        },
        weekly_review: {
          questions: [
            "Which symptoms were most frequent this week?",
            "What patterns do you notice?",
            "What helped relieve symptoms?",
            "What seemed to trigger symptoms?",
            "How did symptoms affect daily activities?"
          ]
        }
      };

      return {
        trackingMethod: selectedMethod,
        trackingTemplate,
        symptoms,
        personalizedTips: [
          `For ${symptoms.join(", ")}, consistency is key - track at the same time daily`,
          "Rate severity on a 1-10 scale where 1 is barely noticeable and 10 is severe",
          "Note potential triggers like weather, stress, food, or activities",
          "Include both physical and emotional symptoms",
          "Bring your tracking data to all medical appointments"
        ],
        success: true
      };
    } catch (error) {
      console.error('Error setting up symptom tracking:', error);
      return {
        error: "I had trouble setting up your symptom tracking system. Here's a simple approach: track your main symptoms daily on a 1-10 scale, note the time and any triggers, and review patterns weekly.",
        success: false
      };
    }
  }
});

export const emotionalSupportTool = tool({
  name: "find_emotional_support",
  description: "Help patients find appropriate emotional support resources including counseling, support groups, and coping strategies for dealing with a new diagnosis.",
  parameters: z.object({
    conditionName: z.string().describe("Name of the medical condition"),
    supportType: z.enum(["counseling", "support_groups", "coping_strategies", "family_support"]).describe("Type of emotional support needed"),
    location: z.string().optional().describe("Patient's location for local resources"),
    urgency: z.enum(["immediate", "within_week", "general_planning"]).describe("How urgently support is needed")
  }),
  execute: async ({ conditionName, supportType, location, urgency }) => {
    try {
      const supportResources = {
        counseling: {
          immediate: [
            "Crisis Text Line: Text HOME to 741741",
            "National Suicide Prevention Lifeline: 988",
            "Your local emergency room for immediate mental health crisis"
          ],
          general: [
            "Psychology Today therapist finder",
            "Your insurance provider's mental health directory",
            "Hospital social work departments",
            "Condition-specific counseling services"
          ],
          tips: [
            "Look for therapists experienced with chronic illness",
            "Consider telehealth options for convenience",
            "Ask about sliding scale fees if cost is a concern",
            "Many therapists offer brief consultations to see if it's a good fit"
          ]
        },
        support_groups: {
          online: [
            "PatientsLikeMe online communities",
            "Smart Patients condition-specific groups",
            "Facebook support groups (search for your condition)",
            "Reddit communities (r/ChronicIllness, condition-specific subreddits)"
          ],
          local: [
            "Hospital-based support groups",
            "Community center programs",
            "Local chapters of national organizations",
            "Meetup.com health-related groups"
          ],
          benefits: [
            "Connect with others who understand your experience",
            "Share practical tips and coping strategies",
            "Reduce feelings of isolation",
            "Learn from others further along in their journey"
          ]
        },
        coping_strategies: {
          immediate: [
            "Deep breathing exercises (4-7-8 technique)",
            "Progressive muscle relaxation",
            "Mindfulness meditation apps (Headspace, Calm)",
            "Grounding techniques (5-4-3-2-1 sensory method)"
          ],
          daily: [
            "Establish consistent sleep schedule",
            "Gentle physical activity as able",
            "Journaling thoughts and feelings",
            "Maintain social connections",
            "Practice gratitude daily"
          ],
          long_term: [
            "Develop acceptance and adjustment skills",
            "Build resilience through small challenges",
            "Create meaning and purpose activities",
            "Maintain hope through goal setting"
          ]
        },
        family_support: {
          communication: [
            "How to explain your condition to family members",
            "Setting boundaries around health discussions",
            "Asking for specific types of help",
            "Including family in medical appointments when appropriate"
          ],
          resources: [
            "Family therapy or couples counseling",
            "Educational materials for family members",
            "Caregiver support groups",
            "Family communication workshops"
          ]
        }
      };

      const selectedSupport = supportResources[supportType];
      
      // Customize response based on urgency
      let prioritizedResources;
      if (urgency === "immediate" && selectedSupport.immediate) {
        prioritizedResources = selectedSupport.immediate;
      } else {
        prioritizedResources = selectedSupport.general || selectedSupport.online || selectedSupport.communication;
      }

      return {
        supportType,
        urgency,
        conditionName,
        prioritizedResources,
        allResources: selectedSupport,
        personalizedTips: [
          `For ${conditionName}, emotional support is crucial during the early adjustment period`,
          "It's normal to experience a range of emotions after diagnosis",
          "Professional support can help you develop healthy coping strategies",
          "Peer support from others with similar conditions can be incredibly valuable",
          "Remember that seeking help is a sign of strength, not weakness"
        ],
        urgencyNote: urgency === "immediate" 
          ? "If you're experiencing thoughts of self-harm or severe emotional distress, please reach out to emergency services or the crisis resources listed above immediately."
          : "Take your time to explore these resources and find what feels right for you.",
        success: true
      };
    } catch (error) {
      console.error('Error finding emotional support:', error);
      return {
        error: "I had trouble finding specific support resources. Please consider reaching out to your healthcare provider, a counselor, or a trusted friend or family member for emotional support during this time.",
        success: false
      };
    }
  }
});

// Export all awareness stage tools
export const awarenessTools = [
  conditionExplanationTool,
  goalSettingTool,
  quickStartGuideTool,
  symptomTrackingSetupTool,
  emotionalSupportTool
];