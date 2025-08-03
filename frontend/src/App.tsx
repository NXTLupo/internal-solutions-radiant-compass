import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { AppStateProvider } from "./components/AppStateProvider";
import { PatientDashboard } from "./components/PatientDashboard";
import "@copilotkit/react-ui/styles.css";
import "./App.css";

function App() {
  // Use a dummy runtime URL since coagent-runtime has issues
  const runtimeUrl = "http://localhost:9501/copilotkit";

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