// coagent-runtime/src/workflows/AppointmentPrepGuide.ts

// Workflow specification for Appointment Preparation Guide tool activation
const appointmentPrepGuideWorkflow = {
  name: "Appointment Preparation Guide Autonomous Guidance",
  description: "Guides the user through preparing for a doctor's appointment.",
  actions: [
    {
      type: "show_tool_with_guidance",
      data: {
        toolName: "AppointmentPrepGuide",
        guidance: "Preparing for your doctor's visit is a great way to make sure you get the most out of it. I'll help you organize your thoughts.",
      },
    },
    {
      type: "update_guidance_for_tool",
      data: { guidance: "First, let's summarize your main concern. I'll type it out for you." },
      delay: 2000,
    },
    {
      type: "setPrimaryConcern",
      data: { concern: "Persistent fatigue and occasional dizziness over the last 3 weeks." },
      delay: 2000,
    },
    {
      type: "update_guidance_for_tool",
      data: { guidance: "Excellent. Now, let's think of some questions to ask. I'll add a few to get us started." },
      delay: 2000,
    },
    {
      type: "addQuestionToList",
      data: { question: "What are the possible causes of these symptoms?" },
      delay: 1500,
    },
    {
      type: "addQuestionToList",
      data: { question: "What tests do you recommend to diagnose the issue?" },
      delay: 1500,
    },
    {
      type: "addQuestionToList",
      data: { question: "Are there any lifestyle changes I should make in the meantime?" },
      delay: 1500,
    },
    {
      type: "update_guidance_for_tool",
      data: { guidance: "I've added some key questions. You can add more yourself, or we can discuss other topics. This guide is now saved for you to bring to your appointment." },
      delay: 2000,
    },
  ]
};

export default appointmentPrepGuideWorkflow;
