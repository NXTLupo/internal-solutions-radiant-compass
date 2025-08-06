// coagent-runtime/src/workflows/SymptomSage.ts

// Workflow specification for AI Symptom Sage tool activation
const symptomSageWorkflow = {
  name: "AI Symptom Sage Autonomous Guidance",
  description: "Guides the user through the AI Symptom Sage tool.",
  actions: [
    {
      type: "show_tool_with_guidance",
      data: {
        toolName: "SymptomSage",
        guidance: "I have brought up the AI Symptom Sage for you. Let me walk you through it.",
      },
    },
    {
      type: "update_guidance_for_tool",
      data: { guidance: "I am now analyzing the relevant information for this step..." },
      delay: 2000,
    },
    {
      type: "setFieldValue_SymptomSage",
      data: { value: "This is an autonomously generated summary for the AI Symptom Sage based on your patient journey." },
      delay: 2000,
    },
    {
      type: "update_guidance_for_tool",
      data: { guidance: "I have filled in the details. I will now mark this step as complete." },
      delay: 2000,
    },
    {
      type: "markToolComplete_SymptomSage",
      data: {},
      delay: 1500,
    },
  ]
};

export default symptomSageWorkflow;
