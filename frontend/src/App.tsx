import { CopilotKit } from "@copilotkit/react-core";
import { AppStateProvider } from "./components/AppStateProvider";
import { DrMayaVoiceExperience } from "./components/DrMayaVoiceExperience";
import { JourneyAwareCoAgent } from "./components/JourneyAwareCoAgent";

function App() {
  const runtimeUrl = "http://localhost:9501/copilotkit";

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <AppStateProvider>
        <DrMayaVoiceExperience onExit={() => {}} />
        <div className="hidden">
          <JourneyAwareCoAgent />
        </div>
      </AppStateProvider>
    </CopilotKit>
  );
}

export default App;
