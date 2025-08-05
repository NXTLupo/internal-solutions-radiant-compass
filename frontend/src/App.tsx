import { CopilotKit } from "@copilotkit/react-core";
import { AppStateProvider } from "./components/AppStateProvider";
import { PremiumPatientJourney } from "./components/PremiumPatientJourney";
import { JourneyAwareCoAgent } from "./components/JourneyAwareCoAgent";
import "./App.css";
import "./styles/premium-design-system.css";

function App() {
  const runtimeUrl = "http://localhost:9501/copilotkit";

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <AppStateProvider>
        <PremiumPatientJourney />
        <div className="hidden">
          <JourneyAwareCoAgent />
        </div>
      </AppStateProvider>
    </CopilotKit>
  );
}

export default App;
