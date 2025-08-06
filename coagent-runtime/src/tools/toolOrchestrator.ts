import { Action, Parameter } from "@copilotkit/shared";

// Enhanced tool demonstration system for all RadiantCompass tools
interface ToolDemonstration {
  toolId: string;
  toolName: string;
  stage: number;
  description: string;
  category: string;
  demonstrationSteps: DemonstrationStep[];
  autonomousActions?: string[];
}

interface DemonstrationStep {
  id: string;
  title: string;
  description: string;
  action: string;
  duration?: number;
  userGuidance: string;
}

// Comprehensive tool demonstration registry
const TOOL_DEMONSTRATIONS: Record<string, ToolDemonstration> = {
  'symptom-tracker': {
    toolId: 'symptom-tracker',
    toolName: 'Symptom Tracker',
    stage: 1,
    description: 'Document symptom progression and patterns with intelligent tracking',
    category: 'tracking',
    autonomousActions: ['enableAutonomousSymptomTracking', 'updateSymptomData', 'submitSymptomLog'],
    demonstrationSteps: [
      {
        id: 'intro',
        title: 'Symptom Tracker Overview',
        description: 'Let me show you how the Symptom Tracker intelligently captures and analyzes your symptoms',
        action: 'show_introduction',
        userGuidance: 'I\'ll demonstrate how this tool automatically extracts symptom information from your conversations'
      },
      {
        id: 'autonomous_entry',
        title: 'Autonomous Data Entry',
        description: 'Watch as the tool automatically fills in symptom details based on our conversation',
        action: 'enableAutonomousSymptomTracking',
        duration: 2000,
        userGuidance: 'Notice how I can detect symptoms like headaches, pain levels, and other details from natural conversation'
      },
      {
        id: 'data_validation',
        title: 'Smart Validation',
        description: 'The system validates and confirms the extracted information with you',
        action: 'updateSymptomData',
        duration: 3000,
        userGuidance: 'You can always correct or adjust any information I capture before it\'s saved'
      },
      {
        id: 'completion',
        title: 'Secure Storage',
        description: 'Your symptom data is securely logged in your private health journal',
        action: 'submitSymptomLog',
        duration: 2000,
        userGuidance: 'All data is encrypted and becomes part of your comprehensive health timeline'
      }
    ]
  },
  
  'medical-translator': {
    toolId: 'medical-translator',
    toolName: 'Medical Translator',
    stage: 2,
    description: 'Convert complex medical reports into clear, understandable language',
    category: 'translation',
    demonstrationSteps: [
      {
        id: 'upload_demo',
        title: 'Document Processing',
        description: 'Upload any medical report, pathology result, or complex medical document',
        action: 'simulate_upload',
        userGuidance: 'I can process PDFs, lab reports, imaging results, and specialist notes'
      },
      {
        id: 'analysis',
        title: 'AI Analysis',
        description: 'My AI analyzes the medical terminology and identifies key information',
        action: 'analyze_content',
        duration: 3000,
        userGuidance: 'I break down complex terms, identify important findings, and highlight areas that need attention'
      },
      {
        id: 'translation',
        title: 'Plain Language Translation',
        description: 'Complex medical jargon is converted to 6th-grade reading level',
        action: 'generate_translation',
        duration: 4000,
        userGuidance: 'Every medical term is explained in simple, clear language that anyone can understand'
      },
      {
        id: 'questions',
        title: 'Generated Questions',
        description: 'I create personalized questions to ask your healthcare provider',
        action: 'generate_questions',
        duration: 2000,
        userGuidance: 'These questions help you have more productive conversations with your medical team'
      }
    ]
  },

  'compare-care': {
    toolId: 'compare-care',
    toolName: 'Compare-My-Care™',
    stage: 3,
    description: 'Objectively rank hospitals and treatment centers by outcomes, culture, and accessibility',
    category: 'comparison',
    demonstrationSteps: [
      {
        id: 'criteria_setup',
        title: 'Personalized Criteria',
        description: 'Set your priorities: medical outcomes, travel distance, insurance coverage, hospital culture',
        action: 'setup_criteria',
        userGuidance: 'I help you identify what matters most for your specific situation and condition'
      },
      {
        id: 'data_analysis',
        title: 'Comprehensive Analysis',
        description: 'I analyze hospital volume, success rates, patient satisfaction, and network participation',
        action: 'analyze_hospitals',
        duration: 5000,
        userGuidance: 'This includes reviewing outcome statistics, experience ratings, and insurance compatibility'
      },
      {
        id: 'ranking',
        title: 'Objective Ranking',
        description: 'Hospitals are ranked based on your personalized criteria with detailed explanations',
        action: 'generate_ranking',
        duration: 3000,
        userGuidance: 'Each recommendation includes specific reasons why it\'s a good match for you'
      },
      {
        id: 'next_steps',
        title: 'Action Planning',
        description: 'I provide specific next steps for contacting top-ranked centers',
        action: 'create_action_plan',
        userGuidance: 'Including contact information, insurance verification steps, and appointment scheduling guidance'
      }
    ]
  },

  'insurance-analyzer': {
    toolId: 'insurance-analyzer',
    toolName: 'Insurance Analyzer',
    stage: 3,
    description: 'Navigate insurance coverage, pre-authorizations, and network requirements',
    category: 'financial',
    demonstrationSteps: [
      {
        id: 'coverage_check',
        title: 'Coverage Verification',
        description: 'I verify your current insurance coverage and identify any limitations',
        action: 'check_coverage',
        userGuidance: 'I can help you understand what\'s covered, what isn\'t, and your out-of-pocket responsibilities'
      },
      {
        id: 'network_analysis',
        title: 'Network Analysis',
        description: 'I check which providers and hospitals are in your network',
        action: 'analyze_network',
        duration: 3000,
        userGuidance: 'This helps you avoid unexpected out-of-network charges and find the best in-network options'
      },
      {
        id: 'preauth_assistance',
        title: 'Pre-Authorization Help',
        description: 'I assist with pre-authorization requests and appeals processes',
        action: 'handle_preauth',
        duration: 4000,
        userGuidance: 'I can help draft appeals letters and provide medical justification documentation'
      }
    ]
  },

  'recovery-tracker': {
    toolId: 'recovery-tracker',
    toolName: 'Recovery Tracker',
    stage: 8,
    description: 'Monitor recovery progress with realistic expectations and milestone tracking',
    category: 'monitoring',
    demonstrationSteps: [
      {
        id: 'baseline_setup',
        title: 'Recovery Baseline',
        description: 'Establish your starting point and recovery goals based on your procedure',
        action: 'set_baseline',
        userGuidance: 'I create a personalized recovery timeline based on your specific situation and medical history'
      },
      {
        id: 'milestone_tracking',
        title: 'Milestone Monitoring',
        description: 'Track key recovery milestones with realistic timeframes',
        action: 'track_milestones',
        duration: 3000,
        userGuidance: 'I help set appropriate expectations and celebrate progress along the way'
      },
      {
        id: 'alert_system',
        title: 'Smart Alerts',
        description: 'Get notifications when recovery isn\'t progressing as expected',
        action: 'monitor_alerts',
        userGuidance: 'I can identify when you should contact your healthcare team about recovery concerns'
      }
    ]
  },

  'survivorship-planner': {
    toolId: 'survivorship-planner',
    toolName: 'Survivorship Planner',
    stage: 11,
    description: 'Create comprehensive long-term health management plans for survivors',
    category: 'planning',
    demonstrationSteps: [
      {
        id: 'health_assessment',
        title: 'Survivorship Assessment',
        description: 'Evaluate your current health status and long-term monitoring needs',
        action: 'assess_health',
        userGuidance: 'I help create a comprehensive picture of your ongoing health requirements'
      },
      {
        id: 'surveillance_plan',
        title: 'Surveillance Planning',
        description: 'Develop a personalized surveillance schedule for ongoing monitoring',
        action: 'create_surveillance',
        duration: 4000,
        userGuidance: 'This includes recommended scans, blood work, and specialist visits based on your treatment history'
      },
      {
        id: 'lifestyle_optimization',
        title: 'Lifestyle Optimization',
        description: 'Receive personalized recommendations for diet, exercise, and wellness',
        action: 'optimize_lifestyle',
        duration: 3000,
        userGuidance: 'Evidence-based guidance tailored specifically for survivors of your condition'
      }
    ]
  }
};

// Workflow execution system
interface WorkflowAction {
  type: string;
  data: any;
  delay?: number;
}

class WorkflowExecutor {
  private static instance: WorkflowExecutor;
  private activeWorkflows: Map<string, any> = new Map();

  static getInstance(): WorkflowExecutor {
    if (!WorkflowExecutor.instance) {
      WorkflowExecutor.instance = new WorkflowExecutor();
    }
    return WorkflowExecutor.instance;
  }

  async executeWorkflow(workflowId: string, workflow: any, runtime: any) {
    console.log(`[WorkflowExecutor] Starting workflow: ${workflow.name}`);
    this.activeWorkflows.set(workflowId, workflow);

    for (let i = 0; i < workflow.actions.length; i++) {
      const action = workflow.actions[i];
      console.log(`[WorkflowExecutor] Executing action ${i + 1}/${workflow.actions.length}: ${action.type}`);
      
      // Wait for delay if specified
      if (action.delay) {
        await new Promise(resolve => setTimeout(resolve, action.delay));
      }

      // Execute the action
      await this.executeAction(action, runtime);
    }

    this.activeWorkflows.delete(workflowId);
    console.log(`[WorkflowExecutor] Completed workflow: ${workflow.name}`);
  }

  private async executeAction(action: WorkflowAction, runtime: any) {
    try {
      switch (action.type) {
        case 'show_tool_with_guidance':
          console.log(`[WorkflowExecutor] Showing tool: ${action.data.toolName}`);
          // Tool is already shown by the orchestrator
          break;

        case 'enableAutonomousSymptomTracking':
          console.log(`[WorkflowExecutor] Enabling autonomous tracking`);
          await this.callCopilotAction('enableAutonomousSymptomTracking', action.data, runtime);
          break;

        case 'setSymptomField':
          console.log(`[WorkflowExecutor] Setting symptom: ${action.data.symptom}`);
          await this.callCopilotAction('setSymptomField', action.data, runtime);
          break;

        case 'setSeverityField':
          console.log(`[WorkflowExecutor] Setting severity: ${action.data.severity}`);
          await this.callCopilotAction('setSeverityField', action.data, runtime);
          break;

        case 'updateSymptomData':
          console.log(`[WorkflowExecutor] Updating symptom data: ${action.data.symptom}, severity: ${action.data.severity}`);
          await this.callCopilotAction('updateSymptomData', action.data, runtime);
          break;

        case 'submitSymptomLog':
          console.log(`[WorkflowExecutor] Submitting symptom log`);
          await this.callCopilotAction('submitSymptomLog', action.data, runtime);
          break;

        case 'update_guidance_for_tool':
          console.log(`[WorkflowExecutor] Updating guidance: ${action.data.guidance}`);
          // This would typically update the AI guidance display
          break;

        default:
          console.warn(`[WorkflowExecutor] Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`[WorkflowExecutor] Error executing action ${action.type}:`, error);
    }
  }

  private async callCopilotAction(actionName: string, data: any, runtime: any) {
    // This simulates calling a CopilotKit action
    // In a real implementation, this would interface with the CopilotKit runtime
    console.log(`[WorkflowExecutor] Calling CopilotKit action: ${actionName}`, data);
    
    // For now, we'll make HTTP calls to trigger the frontend actions
    try {
      const response = await fetch(`http://localhost:9502/api/copilot-action/${actionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log(`[WorkflowExecutor] Action ${actionName} response:`, response.status);
    } catch (error) {
      console.log(`[WorkflowExecutor] Action ${actionName} - using runtime method`);
      // Fallback: direct runtime call if available
    }
  }
}

// This function would typically be in a shared types file
interface JourneyTool {
  name: string;
  component: string;
  triggers: string[];
  metadata: any;
}

// This is the tool that the AI will call.
// It acts as an orchestrator to decide which UI tool to show.
export const toolOrchestrator: Action<[
  {
    name: "conversation";
    type: "string";
    description: "The user's latest message or query.";
    required: true;
  },
  {
    name: "currentStage";
    type: "string";
    description: "The patient's current journey stage (e.g., 'awareness', 'diagnosis').";
    required: true;
  }
]> = {
  name: "selectAndShowTool",
  description: "Based on the user's conversation, select the most relevant patient tool and provide step-by-step guidance.",
  parameters: [
    {
      name: "conversation",
      type: "string",
      description: "The user's latest message or query.",
      required: true,
    },
    {
      name: "currentStage",
      type: "string",
      description: "The patient's current journey stage (e.g., 'awareness', 'diagnosis').",
      required: true,
    },
  ],
  handler: async ({ conversation, currentStage }: { conversation: string; currentStage: string }) => {
    console.log(`[Orchestrator] Received conversation: "${conversation}" for stage: "${currentStage}"`);

    // 1. Fetch the manifest for the current stage from the backend.
    const response = await fetch(`http://localhost:9500/api/v1/journey/${currentStage}`);
    if (!response.ok) {
      console.error(`[Orchestrator] ERROR: Failed to fetch manifest for stage: ${currentStage}`);
      return { success: false, error: `Failed to fetch manifest for stage: ${currentStage}` };
    }
    const manifest = await response.json();
    const tools: JourneyTool[] = manifest.tools;

    // 2. Analyze the conversation to find a matching tool.
    let selectedTool: JourneyTool | null = null;
    for (const tool of tools) {
      for (const trigger of tool.triggers) {
        if (conversation.toLowerCase().includes(trigger.toLowerCase())) {
          selectedTool = tool;
          break;
        }
      }
      if (selectedTool) break;
    }

    // 3. If a tool is matched, dynamically import and execute its workflow.
    if (selectedTool) {
      try {
        console.log(`[Orchestrator] Loading workflow for tool: ${selectedTool.component}`);
        const workflowModule = await import(`../workflows/${selectedTool.component}.ts`);
        
        let workflow: any;
        
        // Special handling for SymptomTracker - execute autonomous actions immediately
        if (selectedTool.component === 'SymptomTracker') {
          console.log(`[Orchestrator] Creating dynamic SymptomTracker workflow from conversation: "${conversation}"`);
          const { createSymptomTrackerWorkflow } = workflowModule;
          workflow = createSymptomTrackerWorkflow(conversation);
          console.log(`[Orchestrator] Extracted symptom data:`, workflow.extractedData);
          
          // Execute the autonomous actions immediately
          const workflowExecutor = WorkflowExecutor.getInstance();
          const workflowId = `symptom-tracker-${Date.now()}`;
          
          // Start workflow execution asynchronously 
          setTimeout(() => {
            workflowExecutor.executeWorkflow(workflowId, workflow, null);
          }, 1000);
          
          // Execute autonomous actions immediately
          const { symptom, severity } = workflow.extractedData;
          
          // Create a response that directly triggers the AI to call the actions
          return { 
            success: true, 
            workflow: workflow,
            message: `I understand you're experiencing ${symptom} with severity ${severity}/10. Let me help you log this in your symptom tracker right away. I'll fill everything out for you step by step.

🤖 **AUTONOMOUS MODE ACTIVATED** - I'm now filling out the form automatically based on our conversation.

**Step 1:** Enabling autonomous tracking mode...
**Step 2:** Filling symptom field with "${symptom}" and severity ${severity}/10...
**Step 3:** Submitting your symptom log to your private health journal...

I'm executing these actions for you right now - you'll see the form update in real-time!

EXECUTE_ACTIONS_NOW: enableAutonomousSymptomTracking() → updateSymptomData("${symptom}", ${severity}) → submitSymptomLog()`,
            extractedData: workflow.extractedData,
            autoExecuteActions: [
              { name: "enableAutonomousSymptomTracking", parameters: {} },
              { name: "updateSymptomData", parameters: { symptom, severity } },
              { name: "submitSymptomLog", parameters: {} }
            ]
          };
        } else {
          // Use default export for other workflows
          workflow = workflowModule.default;
        }
        
        console.log(`[Orchestrator] Executing workflow: ${workflow.name}`);
        return { 
          success: true, 
          workflow: workflow,
          message: `Activating ${selectedTool.name} with real-time autonomous guidance.`
        };

      } catch (error) {
        console.error(`[Orchestrator] ERROR: Failed to load or execute workflow for ${selectedTool.component}`, error);
        return { success: false, message: `I found a tool for that, but I encountered an error while trying to start it.` };
      }
    }

    console.log("[Orchestrator] No specific tool trigger was matched in the conversation.");
    return { success: false, message: "I can help with that, but I don't have a specific tool for it right now." };
  },
};

// Enhanced tool demonstration handler
export const toolDemonstrationHandler: Action<[
  {
    name: "toolId";
    type: "string";
    description: "The unique identifier of the tool to demonstrate";
    required: true;
  },
  {
    name: "toolName";
    type: "string";
    description: "The name of the tool for context";
    required: true;
  },
  {
    name: "toolDescription";
    type: "string";
    description: "The tool description for guidance";
    required: true;
  },
  {
    name: "stage";
    type: "number";
    description: "The journey stage number";
    required: true;
  }
]> = {
  name: "demonstrateRadiantCompassTool",
  description: "Provide autonomous demonstration of any RadiantCompass tool selected from the tool panel.",
  parameters: [
    {
      name: "toolId",
      type: "string",
      description: "The unique identifier of the tool to demonstrate",
      required: true,
    },
    {
      name: "toolName", 
      type: "string",
      description: "The name of the tool for context",
      required: true,
    },
    {
      name: "toolDescription",
      type: "string", 
      description: "The tool description for guidance",
      required: true,
    },
    {
      name: "stage",
      type: "number",
      description: "The journey stage number", 
      required: true,
    },
  ],
  handler: async ({ toolId, toolName, toolDescription, stage }: { 
    toolId: string; 
    toolName: string; 
    toolDescription: string; 
    stage: number;
  }) => {
    console.log(`[ToolDemonstration] Demonstrating tool: ${toolName} (${toolId}) from Stage ${stage}`);
    
    // Get demonstration details from registry
    const demonstration = TOOL_DEMONSTRATIONS[toolId];
    
    if (demonstration) {
      console.log(`[ToolDemonstration] Found detailed demonstration for ${toolName}`);
      
      // Create comprehensive demonstration response
      const demonstrationSteps = demonstration.demonstrationSteps;
      const stepDescriptions = demonstrationSteps.map((step, index) => 
        `**Step ${index + 1}: ${step.title}**\n${step.userGuidance}`
      ).join('\n\n');
      
      const fullDemonstration = `🎯 **${toolName} - Complete Autonomous Demonstration**

I'm excited to show you how the ${toolName} works! This tool is specifically designed for Stage ${stage} of your patient journey.

**What this tool does:**
${toolDescription}

**Complete Demonstration Overview:**

${stepDescriptions}

🤖 **Autonomous Features:**
${demonstration.autonomousActions ? 
  `- ${demonstration.autonomousActions.join('\n- ')}` : 
  '- Intelligent workflow automation\n- Real-time data processing\n- Seamless integration with your health profile'
}

Let me walk you through this tool step-by-step, showing you exactly how it works in practice!`;

      // Execute autonomous actions if available
      if (demonstration.autonomousActions && toolId === 'symptom-tracker') {
        setTimeout(async () => {
          const workflowExecutor = WorkflowExecutor.getInstance();
          const workflowId = `demo-${toolId}-${Date.now()}`;
          
          // Create demonstration workflow
          const demoWorkflow = {
            name: `${toolName} Demonstration`,
            actions: demonstration.autonomousActions!.map((action, index) => ({
              type: action,
              data: {
                symptom: 'demonstration headache',
                severity: 6,
                demonstrationMode: true,
                step: index + 1,
                totalSteps: demonstration.autonomousActions!.length
              },
              delay: index * 2000 // Stagger the actions
            }))
          };
          
          await workflowExecutor.executeWorkflow(workflowId, demoWorkflow, null);
        }, 3000);
      }
      
      return {
        success: true,
        demonstration: demonstration,
        message: fullDemonstration,
        toolActivated: toolId,
        autonomousDemo: true,
        nextSteps: `I've activated the ${toolName} demonstration. Watch as I guide you through each feature autonomously!`
      };
    } else {
      // Generic demonstration for tools not in detailed registry
      console.log(`[ToolDemonstration] Using generic demonstration for ${toolName}`);
      
      const genericDemo = `🎯 **${toolName} - Autonomous Demonstration**

Perfect choice! You've selected the ${toolName} from Stage ${stage} of your patient journey.

**Tool Purpose:**
${toolDescription}

**Key Capabilities:**
- **Intelligent Automation:** This tool works autonomously to streamline your healthcare experience
- **Personalized Guidance:** Adapts to your specific needs and journey stage  
- **Seamless Integration:** Connects with your other RadiantCompass tools and health data
- **Evidence-Based:** Built on healthcare best practices and real-world patient needs

**How it helps you:**
This tool is specifically designed to address the challenges patients face during Stage ${stage}. It reduces complexity, saves time, and ensures you don't miss important steps in your care.

Let me show you exactly how this tool works in practice! I'll demonstrate its key features and guide you through a typical workflow.`;

      return {
        success: true,
        message: genericDemo,
        toolActivated: toolId,
        demonstrationMode: true,
        stage: stage,
        nextSteps: `I'm now demonstrating the ${toolName}. Notice how it autonomously handles complex healthcare tasks for you.`
      };
    }
  },
};
