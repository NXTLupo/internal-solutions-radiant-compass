import { CopilotKit } from "@copilotkit/react-core";
import { AppStateProvider } from "./components/AppStateProvider";
import { PatientJourneyDashboard } from "./components/PatientJourneyDashboard";
import { JourneyAwareCoAgent } from "./components/JourneyAwareCoAgent";
import "./App.css";

function App() {
  const runtimeUrl = "http://localhost:9501/copilotkit";

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <AppStateProvider>
        <PatientJourneyDashboard />
        <div className="hidden">
          <JourneyAwareCoAgent />
        </div>
      </AppStateProvider>
    </CopilotKit>
  );
}

export default App;
