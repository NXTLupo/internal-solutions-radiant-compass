import { Action, Parameter } from "@copilotkit/shared";

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
        
        let workflow;
        
        // Special handling for SymptomTracker - use dynamic workflow creation
        if (selectedTool.component === 'SymptomTracker') {
          console.log(`[Orchestrator] Creating dynamic SymptomTracker workflow from conversation: "${conversation}"`);
          const { createSymptomTrackerWorkflow } = workflowModule;
          workflow = createSymptomTrackerWorkflow(conversation);
          console.log(`[Orchestrator] Extracted symptom data:`, workflow.extractedData);
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
