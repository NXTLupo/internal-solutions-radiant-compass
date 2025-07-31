import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { AgentStatusDisplay } from "./components/AgentStatusDisplay";
import { AppStateProvider } from "./components/AppStateProvider";
import { RadiantDashboard } from "./components/RadiantDashboard";
import "@copilotkit/react-ui/styles.css";
import "./styles/radiant-design-system.css";
import "./App.css";

function App() {
  const runtimeUrl = import.meta.env.VITE_COPILOT_RUNTIME_URL || "http://localhost:9001/copilotkit";

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <AppStateProvider>
        <CopilotSidebar
          labels={{
            title: "RadiantCompass AI Assistant",
            initial: "Hi! I'm your RadiantCompass AI assistant. I'm here to support you through every stage of your healthcare journey. I can help you understand your condition, connect with resources, track symptoms, and provide personalized guidance. What would you like to know?",
          }}
          defaultOpen={false}
          className="h-screen"
          clickOutsideToClose={true}
        >
          <RadiantDashboard />
        </CopilotSidebar>
      </AppStateProvider>
    </CopilotKit>
  );
}

export default App;