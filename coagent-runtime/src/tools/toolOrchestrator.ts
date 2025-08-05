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
  description: "Based on the user's conversation, select and show the most relevant patient tool.",
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
    console.log(`[Orchestrator] Successfully fetched manifest with ${tools.length} tools.`);

    // 2. Analyze the conversation to find a matching tool.
    let selectedTool: JourneyTool | null = null;
    for (const tool of tools) {
      for (const trigger of tool.triggers) {
        if (conversation.toLowerCase().includes(trigger.toLowerCase())) {
          selectedTool = tool;
          console.log(`[Orchestrator] MATCH FOUND: Trigger "${trigger}" matched for tool "${selectedTool.name}"`);
          break;
        }
      }
      if (selectedTool) break;
    }

    // 3. If a tool is matched, return a command to the frontend to show it.
    if (selectedTool) {
      console.log(`[Orchestrator] SUCCESS: Sending command to display tool: ${selectedTool.component}`);
      return {
        success: true,
        toolToDisplay: selectedTool.component,
        message: `I've brought up the ${selectedTool.name} for you.`,
      };
    }

    console.log("[Orchestrator] No tool trigger was matched in the conversation.");
    return { success: false, message: "No specific tool seems to match our current conversation." };
  },
};
