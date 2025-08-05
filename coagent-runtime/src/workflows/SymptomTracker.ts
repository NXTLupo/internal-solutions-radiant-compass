// coagent-runtime/src/workflows/SymptomTracker.ts

// Enhanced autonomous symptom extraction function
function extractSymptomData(conversation: string): { symptom: string; severity: number; confidence: number } {
  // Common symptom patterns and severity indicators
  const symptomPatterns = [
    /(?:i have|experiencing|feeling|suffering from|having)\s+(.+?)(?:\s+(?:pain|ache|issue|problem|symptom))?/i,
    /my\s+(.+?)\s+(?:is|are)\s+(?:hurting|aching|bothering|painful)/i,
    /(?:pain|ache|discomfort|issue)\s+(?:in|with|on)\s+my\s+(.+)/i,
    /(.+?)\s+(?:pain|ache|headache|nausea|fatigue|dizziness|fever)/i,
  ];

  // Severity indicators
  const severityKeywords = {
    'mild': 2, 'slight': 2, 'minor': 2, 'little': 2,
    'moderate': 4, 'medium': 4, 'some': 4,
    'bad': 6, 'strong': 6, 'significant': 6,
    'severe': 8, 'intense': 8, 'terrible': 8, 'awful': 8,
    'extreme': 9, 'excruciating': 9, 'unbearable': 10, 'worst': 10,
    'killing me': 10, 'can\'t stand': 9, 'overwhelming': 9
  };

  // Number patterns (1-10 scale)
  const numberPattern = /(?:rate|scale|level|severity).*?(\d+)(?:\s*(?:out of|\/)\s*10)?/i;
  const directNumber = /\b([1-9]|10)\s*(?:out of 10|\/10)?\b/g;

  let extractedSymptom = '';
  let extractedSeverity = 5; // default
  let confidence = 0;

  // Extract symptom
  for (const pattern of symptomPatterns) {
    const match = conversation.match(pattern);
    if (match && match[1]) {
      extractedSymptom = match[1].trim();
      confidence += 0.3;
      break;
    }
  }

  // If no pattern match, try to extract common symptoms directly
  const commonSymptoms = [
    'headache', 'nausea', 'fatigue', 'dizziness', 'fever', 'pain', 'ache', 
    'stomach pain', 'back pain', 'chest pain', 'shortness of breath',
    'cough', 'sore throat', 'muscle pain', 'joint pain', 'anxiety', 'depression'
  ];
  
  if (!extractedSymptom) {
    for (const symptom of commonSymptoms) {
      if (conversation.toLowerCase().includes(symptom)) {
        extractedSymptom = symptom;
        confidence += 0.2;
        break;
      }
    }
  }

  // Extract severity from keywords
  for (const [keyword, severity] of Object.entries(severityKeywords)) {
    if (conversation.toLowerCase().includes(keyword)) {
      extractedSeverity = severity;
      confidence += 0.3;
      break;
    }
  }

  // Extract numerical severity
  const numberMatch = conversation.match(numberPattern);
  if (numberMatch) {
    const num = parseInt(numberMatch[1]);
    if (num >= 1 && num <= 10) {
      extractedSeverity = num;
      confidence += 0.4;
    }
  }

  // Direct number extraction
  const directMatches = [...conversation.matchAll(directNumber)];
  if (directMatches.length > 0) {
    const num = parseInt(directMatches[directMatches.length - 1][1]);
    if (num >= 1 && num <= 10) {
      extractedSeverity = num;
      confidence += 0.4;
    }
  }

  return {
    symptom: extractedSymptom || 'unspecified symptom',
    severity: Math.max(1, Math.min(10, extractedSeverity)),
    confidence: Math.min(1, confidence)
  };
}

// Dynamic workflow generator based on conversation
export function createSymptomTrackerWorkflow(conversation: string) {
  const extractedData = extractSymptomData(conversation);
  const { symptom, severity, confidence } = extractedData;
  
  // Determine guidance based on confidence level
  const confidenceLevel = confidence > 0.7 ? 'high' : confidence > 0.4 ? 'medium' : 'low';
  
  let initialGuidance: string;
  let symptomGuidance: string;
  let severityGuidance: string;
  
  if (confidenceLevel === 'high') {
    initialGuidance = `I understand you're experiencing ${symptom}. Let me help you log this in your symptom tracker right away.`;
    symptomGuidance = `I'll record "${symptom}" as you described.`;
    severityGuidance = `Based on what you've told me, I'm rating this as a ${severity} out of 10.`;
  } else if (confidenceLevel === 'medium') {
    initialGuidance = `I can help you log what you're experiencing. Let me fill out the symptom tracker for you.`;
    symptomGuidance = `I'll enter "${symptom}" - let me know if you'd like me to adjust this.`;
    severityGuidance = `I'm estimating the severity as ${severity} out of 10 based on your description.`;
  } else {
    initialGuidance = `Let me help you log your symptoms. I'll fill out what I understood and you can correct anything if needed.`;
    symptomGuidance = `I'll start with "${symptom}" - please let me know if this needs to be more specific.`;
    severityGuidance = `I'm setting the severity to ${severity} out of 10 as a starting point.`;
  }

  return {
    name: "Real-time Autonomous Symptom Tracker",
    description: "Automatically extracts symptom information from conversation and fills the tracker in real-time.",
    extractedData,
    actions: [
      {
        type: "show_tool_with_guidance",
        data: {
          toolName: "SymptomTracker",
          guidance: initialGuidance,
        },
      },
      {
        type: "enableAutonomousSymptomTracking",
        data: {},
        delay: 500,
      },
      {
        type: "update_guidance_for_tool",
        data: { guidance: `${symptomGuidance} ${severityGuidance}` },
        delay: 1000,
      },
      {
        type: "updateSymptomData",
        data: { symptom: symptom, severity: severity },
        delay: 800,
      },
      {
        type: "update_guidance_for_tool",
        data: { 
          guidance: confidence > 0.6 
            ? "Perfect! I've logged this information. Let me save it to your health journal."
            : "I've filled in what I understood. Does this look accurate? I'll save it now."
        },
        delay: 1500,
      },
      {
        type: "submitSymptomLog",
        data: {},
        delay: 2000,
      },
      {
        type: "update_guidance_for_tool",
        data: { 
          guidance: "Done! Your symptom has been logged in your private health journal. I'm always here to help track how you're feeling."
        },
        delay: 1000,
      },
    ]
  };
}

// Legacy export for backwards compatibility
export const symptomTrackerWorkflow = createSymptomTrackerWorkflow("I have a headache");

export default symptomTrackerWorkflow;
