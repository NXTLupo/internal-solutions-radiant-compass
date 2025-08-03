import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { AppStateProvider } from "./components/AppStateProvider";
import { PatientDashboard } from "./components/PatientDashboard";
import { JourneyAwareCoAgent } from "./components/JourneyAwareCoAgent";
import "@copilotkit/react-ui/styles.css";
import "./App.css";

function App() {
  // CoAgent runtime URL - now with comprehensive journey tools
  const runtimeUrl = "http://localhost:9501/copilotkit";

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <AppStateProvider>
        <CopilotSidebar
          labels={{
            title: "Dr. Maya - Your Journey Companion",
            initial: "Hi! I'm Dr. Maya, your AI healthcare companion. I understand all 12 stages of the rare disease journey and I'm here to provide personalized guidance based on where you are right now. I can help with symptom interpretation, medical translation, treatment center comparison, and emotional support. What's on your mind today?",
          }}
          defaultOpen={false}
          className="h-screen"
          clickOutsideToClose={true}
          instructions="You are Dr. Maya, an expert in rare disease patient journey navigation. You have access to comprehensive tools for all 12 stages of the patient journey. Always adapt your communication style to the user's preferred persona (radical optimist, clinical researcher, balanced calm, or just headlines). Maintain empathy while providing actionable guidance. When using voice chat, speak naturally as the TTS framework has been optimized with playback rate compensation to prevent chipmunk voice issues."
        >
          <div className="flex h-screen">
            <div className="flex-1">
              <PatientDashboard />
            </div>
            <div className="w-80 p-4 bg-gray-50 border-l border-gray-200 overflow-y-auto">
              <JourneyAwareCoAgent />
            </div>
          </div>
        </CopilotSidebar>
      </AppStateProvider>
    </CopilotKit>
  );
}

export default App;