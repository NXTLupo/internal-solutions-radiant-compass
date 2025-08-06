import React, { useState } from "react";
import { useCopilotAction } from "@copilotkit/react-core";
import { AIGuidanceDisplay } from "../AIGuidanceDisplay";

export const SymptomSage: React.FC = () => {
  const [fieldValue, setFieldValue] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useCopilotAction({
    name: "setFieldValue_SymptomSage",
    description: "Set a field value for the AI Symptom Sage tool.",
    parameters: [{ name: "value", type: "string" }],
    handler: async ({ value }) => {
      setFieldValue(value);
    },
  });

  useCopilotAction({
    name: "markToolComplete_SymptomSage",
    description: "Mark the AI Symptom Sage tool as complete.",
    handler: async () => {
      setIsComplete(true);
    },
  });

  if (isComplete) {
    return (
      <div style={{ padding: "20px", border: "1px solid #4CAF50", borderRadius: "8px", background: "#F1F8E9", textAlign: "center" }}>
        <AIGuidanceDisplay />
        <h3 style={{ marginTop: 0, color: "#2E7D32" }}>AI Symptom Sage Complete!</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", border: "1px solid #E5E7EB", borderRadius: "8px", background: "#fff" }}>
      <AIGuidanceDisplay />
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#111827" }}>AI Symptom Sage</h3>
        <textarea
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          placeholder="Dr. Maya will guide you here..."
          style={{ width: "100%", minHeight: "120px", padding: "10px", borderRadius: "6px", border: "1px solid #D1D5DB" }}
        />
      </div>
    </div>
  );
};
