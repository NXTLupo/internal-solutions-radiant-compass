# Gemini Code Assistant Context

This document provides a comprehensive overview of the "NXT HUMANS AI CX WORKBENCH" project, designed to serve as a foundational context for the Gemini Code Assistant.

## Project Overview

The project is a production-ready template for building AI-powered applications. It features a microservices architecture with a FastAPI backend, a React frontend, and a dedicated "CoAgent Runtime" for handling AI agent logic. The entire system is containerized using Docker and managed with Docker Compose.

The application is designed to be an AI assistant, with a focus on "human-in-the-loop" interactions, real-time updates, and a modular, extensible architecture. The AI capabilities are powered by Anthropic's Claude 3.7 Sonnet model, integrated via the CopilotKit framework.

### Core Technologies

-   **Backend**: FastAPI, Python, SQLModel, Alembic, PostgreSQL
-   **Frontend**: React, TypeScript, Vite, Tailwind CSS
-   **AI Agent Runtime**: Express.js, CopilotKit, LangGraph, Anthropic Claude 3.7
-   **Containerization**: Docker, Docker Compose

## Building and Running the Project

The project can be run using either local development servers for each service or by using Docker Compose to run the entire stack in containers.

### Local Development

**1. Backend (FastAPI)**

```bash
cd backend
poetry install
poetry run alembic upgrade head
poetry run fastapi dev app/main.py
```

**2. Frontend (React)**

```bash
cd frontend
npm install
npm run dev
```

**3. CoAgent Runtime (Express.js)**

```bash
cd coagent-runtime
npm install
npm run dev
```

### Docker Compose (Recommended)

To build and run the entire application stack:

```bash
docker compose up --build
```

This will start all the services defined in the `compose.yml` file, including the PostgreSQL database.

### Accessing the Application

-   **Frontend**: [http://localhost:9502](http://localhost:9502)
-   **Backend API**: [http://localhost:9500](http://localhost:9500)
-   **Backend API Docs**: [http://localhost:9500/docs](http://localhost:9500/docs)
-   **CoAgent Runtime**: [http://localhost:9501](http://localhost:9501)
-   **Documentation**: [http://localhost:9003](http://localhost:9003)

## Development Conventions

-   **Modular Architecture**: The backend and AI agent runtime are structured with a focus on modularity. The FastAPI backend uses routers to separate concerns, and the CoAgent runtime uses a `toolOrchestrator` to manage AI agent capabilities.
-   **Database Migrations**: Alembic is used for managing database schema migrations. Developers should create new migration scripts when making changes to the database models.
-   **Environment Variables**: The project uses `.env` files for managing environment variables. A `.env.example` file is provided as a template.
-   **Human-in-the-Loop**: The frontend components `PremiumPatientJourney` and `JourneyAwareCoAgent` suggest a design pattern where AI agents and human users interact to complete tasks.
-   **AI Agent Tools**: The `coagent-runtime` is designed to be extensible with tools that the AI agents can use to perform actions.

---

# RadiantCompass Tool Implementation Status Report

## Current Implementation State (January 2025)

### ❌ CRITICAL ISSUES IDENTIFIED

The RadiantCompass tool system has **fundamental architectural problems** that make it appear like "fake implementation" rather than real AI-powered tool usage.

---

## 🚨 MAJOR PROBLEMS

### 1. **Inadequate Tool Coverage**
- **Claimed**: 36+ tools across 12 journey stages
- **Actually Implemented**: Only 6 working components
- **Available Components**:
  - ✅ `SymptomTracker` - Functional
  - ✅ `ConditionExplainer` - Basic placeholder
  - ✅ `TreatmentCalendar` - Well-implemented 
  - ✅ `AppointmentPrepGuide` - Recently enhanced
  - ✅ `SymptomSage` - Basic functionality
  - ✅ `SecondOpinionGuide` - Basic functionality
- **Missing**: 30+ tools that users can click but don't exist

### 2. **Broken Tool Mapping System**
**Current Fallback Logic is Flawed**:
```typescript
// ALL unmapped tools fall back to ConditionExplainer!
case 'insurance-analyzer': return 'ConditionExplainer'; // Wrong!
case 'cost-calculator': return 'TreatmentCalendar'; // Wrong!
case 'compare-care': return 'SecondOpinionGuide'; // Wrong!
// 30+ more wrong mappings
```

**User Experience Issue**: 
- User clicks "Insurance Analyzer" → Sees generic "ConditionExplainer" placeholder
- User clicks "Test Coordinator" → Sees TreatmentCalendar (wrong tool)
- User clicks "Cost Calculator" → Sees TreatmentCalendar (wrong tool)

### 3. **Poor Component Quality**
- **ConditionExplainer**: Just shows "This is where the AI-powered condition explanation will be displayed"
- **SymptomSage**: Minimal functionality
- **SecondOpinionGuide**: Placeholder implementation
- **No specialized tools**: No real insurance tools, cost calculators, test coordinators, etc.

### 4. **Inconsistent Tool Activation**
- **Manual clicks** work (left panel) 
- **AI-driven activation** partially works (conversation-based)
- **Mixed results**: Sometimes shows wrong tools
- **No persistence**: Tools disappear after conversation

---

## 🔧 TECHNICAL ARCHITECTURE

### Current File Structure
```
frontend/src/components/
├── EnhancedVoiceExperience.tsx    # Main orchestrator
├── ElegantToolPanel.tsx           # Left sidebar (36 tools listed)
├── journeystages/
│   ├── SymptomTracker.tsx        ✅ Well-implemented
│   ├── ConditionExplainer.tsx    ❌ Placeholder only
│   ├── AppointmentPrepGuide.tsx  ✅ Recently enhanced 
│   ├── SymptomSage.tsx           ⚠️ Basic functionality
│   └── SecondOpinionGuide.tsx    ⚠️ Basic functionality
├── tools/
│   └── TreatmentCalendar.tsx     ✅ Well-implemented
└── [30+ missing components]
```

### Key Integration Points

#### 1. **Tool Detection System** (`EnhancedVoiceExperience.tsx:789`)
```typescript
const detectToolUsageFromResponse = (response: string, userInput: string) => {
  // Analyzes conversation for tool keywords
  // LIMITED to 4 basic patterns
  // MISSING: 32+ tool detection patterns
}
```

#### 2. **Component Mapping** (`EnhancedVoiceExperience.tsx:532`)
```typescript
const getToolComponentName = (toolId: string): string => {
  // Maps tool IDs to component names
  // PROBLEM: Falls back to wrong components for missing tools
  // NEEDS: Individual component for each tool
}
```

#### 3. **Contextual Data Generation** (`EnhancedVoiceExperience.tsx:833`)
```typescript
const getContextualToolData = (toolId: string, userInput: string, aiResponse: string) => {
  // Creates contextual data for tools
  // WORKS for: 4 basic tools
  // MISSING: Data patterns for 32+ tools
}
```

---

## 📊 DETAILED TOOL STATUS

### Stage 1: First Hints & Initial Visit (3/3 tools)
- ✅ `symptom-tracker` → SymptomTracker (working)
- ✅ `appointment-prep` → AppointmentPrepGuide (enhanced)
- ✅ `ai-symptom-sage` → SymptomSage (basic)

### Stage 2: Specialist Work-up & Diagnosis (1/3 tools)
- ✅ `medical-translator` → ConditionExplainer (placeholder)
- ❌ `question-generator` → Falls back to AppointmentPrepGuide  
- ❌ `peer-connection` → Falls back to ConditionExplainer

### Stage 3: Research & Compare-Care (1/3 tools)
- ❌ `compare-care` → Falls back to SecondOpinionGuide
- ❌ `insurance-analyzer` → Falls back to ConditionExplainer
- ❌ `travel-planner` → Falls back to TreatmentCalendar

### Stage 4: Staging & Testing (1/3 tools)
- ✅ `treatment-calendar` → TreatmentCalendar (well-implemented)
- ❌ `test-coordinator` → Falls back to TreatmentCalendar
- ❌ `results-repository` → Falls back to ConditionExplainer

### Stages 5-12: Treatment → Survivorship (0/27 tools)
**ALL 27 REMAINING TOOLS ARE UNMAPPED**
- Appeals Assistant, Cost Calculator, Surgical Prep, Recovery Tracker
- Milestone Tracker, Surveillance Manager, Survivorship Care
- **Every single one falls back to generic placeholders**

---

## 🐛 SPECIFIC BUGS OBSERVED

### 1. **Wrong Tool Display**
```
User Action: Click "Test Coordinator"
Expected: Test coordination interface
Actual: Treatment Calendar appears
Reason: No TestCoordinator component exists, fallback mapping is wrong
```

### 2. **Generic Placeholder Spam**
```
User Action: Click "Insurance Analyzer" 
Expected: Insurance coverage analysis
Actual: "This is where the AI-powered condition explanation will be displayed"
Reason: Falls back to ConditionExplainer placeholder
```

### 3. **Conversation Mismatch**
```
Dr. Maya Says: "I'm bringing up the Test Coordinator tool right now!"
User Sees: Treatment Calendar
Problem: Dr. Maya announces one tool, system shows different tool
```

---

## 💡 WHAT WORKS WELL

### Successful Implementations
1. **TreatmentCalendar** - Excellent implementation with:
   - Real appointment data
   - Contextual conversation integration
   - Professional healthcare UI
   - Autonomous mode indicators

2. **AppointmentPrepGuide** - Recently enhanced with:
   - Contextual concern detection
   - Auto-generated questions
   - AI activity indicators
   - Real-time data population

3. **Tool Detection System** - Works for basic cases:
   - Detects appointment-related queries
   - Detects question preparation needs
   - Detects symptom/nutrition tracking
   - Automatically activates appropriate tools

### Strong Foundation Elements
- **ElegantToolPanel**: Clean, Apple-inspired design
- **Autonomous Detection**: AI conversation analysis
- **Contextual Data**: Real-time data generation
- **Visual Indicators**: Shows when AI is actively working
- **Docker Architecture**: All services healthy and running

---

## 🎯 PRIORITY FIXES NEEDED

### Critical (Must Fix)
1. **Build Missing Tool Components** (30+ components needed)
   - InsuranceAnalyzer, CostCalculator, TestCoordinator
   - SurgicalPrepGuide, RecoveryTracker, MilestoneTracker
   - SurvivorshipPlanner, AppealsAssistant, etc.

2. **Fix Tool Mapping Logic**
   - Remove wrong fallbacks
   - Create accurate 1:1 mapping
   - Add proper error handling for missing tools

3. **Enhance Placeholder Components**
   - Replace "This is where..." with functional interfaces
   - Add contextual data integration
   - Implement autonomous mode for all tools

### High Priority
4. **Expand Detection Patterns**
   - Add keyword detection for all 36 tools
   - Improve conversation analysis
   - Handle edge cases and synonyms

5. **Create Specialized Tool Data**
   - Insurance information structures
   - Cost calculation templates
   - Test coordination workflows
   - Recovery milestone tracking

### Medium Priority
6. **Improve Tool Persistence**
   - Keep tools active during conversation
   - Allow switching between tools
   - Save tool state across interactions

---

## 📋 IMPLEMENTATION ROADMAP FOR NEXT DEVELOPER

### Phase 1: Foundation (Week 1-2)
1. **Audit and Document** all 36 required tools
2. **Create component stubs** for missing tools (30+ files)
3. **Fix tool mapping system** - remove wrong fallbacks
4. **Test each tool activation** from left panel

### Phase 2: Core Implementation (Week 3-6)
5. **Implement high-priority tools**:
   - InsuranceAnalyzer (Stage 3)
   - TestCoordinator (Stage 4)
   - CostCalculator (Stage 6)
   - RecoveryTracker (Stage 8)
   - MilestoneTracker (Stage 10)

6. **Enhanced detection patterns** for new tools
7. **Contextual data systems** for each tool type

### Phase 3: Polish (Week 7-8)
8. **Visual consistency** across all tools
9. **Autonomous mode** for all components
10. **Error handling** and edge cases
11. **Performance optimization**

### Phase 4: Advanced Features (Week 9-12)
12. **Tool persistence** and state management
13. **Cross-tool integration** (calendar ↔ coordinator)
14. **Advanced AI interactions**
15. **User customization** and preferences

---

## 🛠️ DEVELOPMENT GUIDELINES

### Component Creation Pattern
```typescript
// Template for new tool components
interface ToolProps {
  isActive?: boolean;
  autoFillData?: any;
  onDataUpdate?: (data: any) => void;
}

export const NewTool: React.FC<ToolProps> = ({ isActive, autoFillData, onDataUpdate }) => {
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  
  useEffect(() => {
    if (autoFillData?.demonstrationMode) {
      setIsAutonomousMode(true);
      // Use contextual data from conversation
    }
  }, [autoFillData]);

  return (
    <div style={{ /* Autonomous mode styling */ }}>
      {isAutonomousMode && (
        <div>🤖 Dr. Maya is actively using this tool...</div>
      )}
      {/* Tool-specific interface */}
    </div>
  );
};
```

### Tool Detection Pattern
```typescript
// Add to detectToolUsageFromResponse()
if (lowerResponse.includes('insurance') || lowerInput.includes('coverage')) {
  return { toolId: 'insurance-analyzer', toolName: 'Insurance Analyzer' };
}
```

### Mapping Pattern  
```typescript
// Add to getToolComponentName()
case 'insurance-analyzer': return 'InsuranceAnalyzer';
case 'cost-calculator': return 'CostCalculator';
// etc.
```

---

## ⚠️ CURRENT DEPLOYMENT STATUS

### Working Environment
- **Frontend**: http://localhost:9502 ✅
- **Backend**: http://localhost:9500 ✅ 
- **CoAgent**: http://localhost:9501 ✅
- **Database**: PostgreSQL ready ✅

### File Locations
- **Main orchestrator**: `frontend/src/components/EnhancedVoiceExperience.tsx`
- **Tool panel**: `frontend/src/components/ElegantToolPanel.tsx`
- **Existing tools**: `frontend/src/components/journeystages/` and `frontend/src/components/tools/`
- **Build command**: `npm run build` in frontend directory
- **Docker restart**: `make down && make up` in project root

---

## 🎯 SUCCESS CRITERIA

The implementation will be complete when:
1. **All 36 tools** have dedicated functional components
2. **Every tool click** shows the correct, specialized interface
3. **Dr. Maya's announcements** match what appears on screen
4. **Autonomous mode** works for all tools with contextual data
5. **No generic placeholders** - every tool has meaningful functionality
6. **Conversation-driven activation** works for all major tool categories

---

## 📞 HANDOFF NOTES

### What the Previous Developer Got Right:
- Strong foundation with TreatmentCalendar and AppointmentPrepGuide
- Good autonomous detection system architecture
- Clean, Apple-inspired UI design
- Solid Docker and build infrastructure
- Working conversation analysis for basic tools

### What Needs Immediate Attention:
- **30+ missing tool components** creating user frustration
- **Wrong tool mappings** showing incorrect interfaces  
- **Poor placeholder quality** making system look fake
- **Incomplete detection patterns** missing most tool categories

### Key Files to Start With:
1. `ElegantToolPanel.tsx` - See all 36 tools that need components
2. `EnhancedVoiceExperience.tsx` - Tool mapping and detection logic
3. `journeystages/` directory - Add missing tool components here
4. `tools/` directory - Add specialized tool components here

The foundation is solid, but the system needs significant component development to deliver the promised 36-tool autonomous experience.
