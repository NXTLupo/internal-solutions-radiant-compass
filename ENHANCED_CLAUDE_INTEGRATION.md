# RadiantCompass: Enhanced Claude Integration with Existing Components

## 🎯 CRITICAL TTS FRAMEWORK PRESERVATION
**Working TTS System**: `UltraFastVoiceChat.tsx` with 22050Hz→44100Hz playback rate compensation
**File Location**: `frontend/src/components/UltraFastVoiceChat.tsx`  
**Key Fix**: `source.playbackRate.value = playbackRate * 0.95` (lines 247-250)

⚠️ **DO NOT MODIFY** the audio processing logic in UltraFastVoiceChat.tsx

---

## 🧩 EXISTING COMPONENT INTEGRATION MATRIX

### STAGE 1: AWARENESS & ORIENTATION

**Existing Components:**
- `frontend/src/components/stages/AwarenessOrientation.tsx` (comprehensive 3-tab interface)
- `frontend/src/components/patient/LearnCondition.tsx` (4-section learning module)

**Claude Voice Integration Points:**
```typescript
// In coagent-runtime/src/tools/journeyTools.ts
export const awarenessOrientationTools = [
  {
    name: "interpret_symptoms",
    // Connects to: AwarenessOrientation.tsx → AI-Powered Insights section
    // Voice introduces: "Let me help interpret those symptoms you're experiencing"
  },
  {
    name: "prepare_doctor_visit", 
    // Connects to: AwarenessOrientation.tsx → Quick-Start Guide → Week 1 tasks
    // Voice introduces: "I'll create a personalized preparation guide for your appointment"
  }
];
```

**Sidebar Interactive Tools (Already Built):**
```typescript
// AwarenessOrientation.tsx provides:
- Personal Goal Setting (4 categories with completion tracking)
- Condition Information Display (symptoms, treatments, prognosis)
- Quick-Start Guide (3-week structured plan)
- AI-Powered Personalized Insights panel

// LearnCondition.tsx provides:
- 4-Section Learning Module (basics, symptoms, treatment, questions)
- Progress tracking through sections
- Interactive learning progression
```

### STAGE 2: ORGANIZE & PLAN

**Existing Components:**
- `frontend/src/components/stages/OrganizePlan.tsx` (comprehensive journey management)

**Claude Voice Integration:**
```typescript
// Voice Chat introduces these tools while referencing existing UI:
- "translate_medical_report" → Links to Disease Library resources
- "research_guidance" → Connects to Journey Map current step
- "peer_connection" → Links to Peer Stories tab
```

**Sidebar Tools (Already Built):**
```typescript
// OrganizePlan.tsx provides:
- Personal Journey Map (4-step progress tracker with tasks/resources)
- Disease Library (categorized resources with ratings and filtering)
- Peer Stories Platform (real patient experiences with helpful voting)
- Progress tracking with visual indicators
- Category-based resource filtering system
```

### STAGE 3: EXPLORE & DECIDE

**Existing Components:**
- `frontend/src/components/stages/ExploreDecide.tsx` (care team & treatment selection)

**Claude Voice Integration:**
```typescript
// Voice tools connect to existing comparison interfaces:
- "compare_treatment_centers" → Hospital comparison matrix
- "care_team_matching" → Specialist profile matching
- "insurance_navigation" → Insurance plan comparator
```

**Sidebar Tools (Already Built):**
```typescript
// ExploreDecide.tsx provides:
- Care Team Member Profiles (ratings, availability, specializations)
- Insurance Plan Comparator (coverage analysis with pros/cons)
- Treatment Options Matrix (effectiveness, side effects, evidence levels)
- Specialist search and filtering system
```

### STAGES 4-12: COORDINATE → LONG-TERM LIVING

**Existing Components:**
- `CoordinateCommit.tsx` - Logistics and appointment coordination
- `UndergoTreatment.tsx` - Treatment tracking and support
- `EarlyRecovery.tsx` - Recovery milestone management  
- `LongTermLiving.tsx` - Survivorship and mentorship

---

## 🔧 ENHANCED CLAUDE SYSTEM PROMPT INTEGRATION

### Core Integration Strategy:
```typescript
// In coagent-runtime/src/index.ts - Enhanced system prompt:
const stageAwareSystemPrompt = `
You are Dr. Maya, RadiantCompass's AI healthcare companion. You have access to:

EXISTING UI COMPONENTS:
- Stage-specific interfaces for all 12 journey phases
- Interactive goal setting and progress tracking
- Comprehensive disease library with peer stories
- Care team builder and treatment comparison tools
- Quick check-in system with mood/symptom tracking

VOICE CHAT INTEGRATION:
- Introduce tools conversationally: "I can help you..." 
- Reference sidebar tools: "You'll see this information organized in your dashboard"
- Guide users to interactive elements: "Click on the [tool name] in your sidebar"

TTS OPTIMIZATION:
- Speak naturally - audio framework handles playback rate compensation
- Use conversational pauses with commas and periods
- Avoid complex punctuation that might cause audio issues
`;
```

### Enhanced Tool Integration:
```typescript
// Integration with existing Quick Check-in component
useCopilotAction({
  name: "daily_checkin_support",
  description: "Guides patient through daily mood/symptom check-in process",
  handler: async ({ checkin_data }) => {
    // References QuickCheckin.tsx 4-step process
    return `I see you're doing your daily check-in. This 4-step process helps track:
    
    Step 1: Overall feeling (1-10 scale)
    Step 2: Physical symptoms from our tracking list  
    Step 3: Energy and mood levels
    Step 4: Any additional notes
    
    The information you enter gets saved to help you and your care team spot patterns. 
    Would you like help interpreting any of these measurements?`;
  }
});
```

---

## 🎙️ VOICE CHAT SCRIPT EXAMPLES WITH UI REFERENCES

### Stage 1 Voice Integration:
```
CLAUDE: "I can help you understand those symptoms you're experiencing. As we talk, 
you'll see a personalized insights panel appear in your dashboard that organizes 
everything we discuss. Let me ask you about what you've been noticing..."

[User describes symptoms]

CLAUDE: "Based on what you've shared, I'm updating your condition learning module 
with specific information relevant to your symptoms. You can explore this more 
deeply in the 'Understanding My Condition' section of your dashboard."
```

### Stage 2 Voice Integration:
```
CLAUDE: "I see you're ready to organize and plan your journey. Your personal 
journey map shows you're currently on step 2 of 4 - researching your condition. 
I can help translate any medical reports you've received. Just describe what 
you're trying to understand, and I'll break it down into plain language."

[User shares medical report]

CLAUDE: "I'm adding this translated information to your disease library under 
your personalized resources. You'll also see I've updated your journey map 
with specific next steps based on what we've discussed."
```

### Stage 3 Voice Integration:
```
CLAUDE: "Now we're in the explore and decide phase. I can see your care team 
builder in the sidebar - it currently has 3 potential specialists. Let me help 
you evaluate them based on your specific needs and preferences. What's most 
important to you - proximity, experience with your condition, or communication style?"

[User expresses preferences]

CLAUDE: "Perfect. I'm updating your specialist comparison matrix with weighted 
scores based on your priorities. Dr. Chen scores highest for you because of 
her communication style and experience with your specific condition."
```

---

## 📱 SIDEBAR TOOL ACTIVATION PATTERNS

### Dynamic Tool Presentation:
```typescript
// Based on conversation context, activate different sidebar components:

if (stage === "awareness_orientation" && discussing_symptoms) {
  // Highlight: Symptom tracking in QuickCheckin.tsx
  // Activate: AwarenessOrientation.tsx → AI Insights panel
}

if (stage === "organize_plan" && discussing_research) {
  // Highlight: OrganizePlan.tsx → Disease Library tab  
  // Filter: Resources related to user's condition
}

if (stage === "explore_decide" && comparing_doctors) {
  // Highlight: ExploreDecide.tsx → Care Team section
  // Sort: Specialists by user's weighted preferences
}
```

### Interactive Tool Synchronization:
```typescript
// Voice chat responses trigger sidebar updates:
onToolResponse: (toolName, response) => {
  switch(toolName) {
    case "interpret_symptoms":
      // Update AwarenessOrientation symptom tracking
      // Highlight relevant Quick Check-in categories
      break;
    case "translate_medical_report":
      // Add to Disease Library personal resources
      // Update Journey Map progress
      break;
    case "compare_treatment_centers":
      // Populate ExploreDecide comparison matrix
      // Update care team recommendations
      break;
  }
}
```

---

## 🚨 CRISIS SUPPORT INTEGRATION

### Enhanced Crisis Detection:
```typescript
// Monitor for crisis indicators across all interactions
const crisisKeywords = [
  "overwhelmed", "can't handle", "want to give up", 
  "hopeless", "what's the point", "too much"
];

// Immediate escalation with existing UI support:
if (detectCrisisLanguage(userInput)) {
  // Activate crisis_support tool
  // Display emergency resources in sidebar
  // Maintain conversation until user connects with help
}
```

---

## 🔄 STAGE PROGRESSION LOGIC

### Automatic Stage Detection:
```typescript
// Claude monitors conversation for stage progression indicators:
- Completed initial learning → Move from Stage 1 to Stage 2
- Selected care team → Move from Stage 3 to Stage 4  
- Started treatment → Move to Stage 5
- Treatment complete → Move to recovery stages

// UI automatically updates to show appropriate stage component
// Journey progress tracking persists across all interactions
```

---

## 📊 DATA PERSISTENCE & CONTINUITY

### Cross-Session Memory:
```typescript
// All voice chat interactions persist to enhance sidebar tools:
- Symptom patterns → Enhance Quick Check-in suggestions
- Care preferences → Weight ExploreDecide recommendations  
- Journey progress → Update all stage component progress indicators
- Crisis episodes → Flag for extra attention and support
```

This enhanced integration ensures that Claude's voice interactions seamlessly connect with the comprehensive existing UI components while maintaining the critical TTS framework that enables natural voice conversations.