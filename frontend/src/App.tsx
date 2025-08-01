import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { AppStateProvider } from "./components/AppStateProvider";
import { PatientDashboard } from "./components/PatientDashboard";
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
            title: "Your Health Assistant",
            initial: "Hi! I'm here to help you understand your condition and guide you through your health journey. You can ask me anything - I'll explain things in simple terms. What would you like to know?",
          }}
          defaultOpen={false}
          className="h-screen"
          clickOutsideToClose={true}
        >
          <PatientDashboard />
        </CopilotSidebar>
      </AppStateProvider>
    </CopilotKit>
  );
}

export default App;