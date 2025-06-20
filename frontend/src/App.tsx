import { CopilotKit } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { AgentStatusDisplay } from "./components/AgentStatusDisplay";
import { AppStateProvider } from "./components/AppStateProvider";
import "@copilotkit/react-ui/styles.css";
import "./App.css";

function App() {
  const runtimeUrl = import.meta.env.VITE_COPILOT_RUNTIME_URL || "http://localhost:4000/copilotkit";

  return (
    <CopilotKit runtimeUrl={runtimeUrl}>
      <AppStateProvider>
        <CopilotSidebar
          labels={{
            title: "AI Research Assistant",
            initial: "Hi! I can help you research any topic using web search and analysis. Try asking me to search for something, perform calculations, or analyze text.",
          }}
          defaultOpen={true}
          className="h-screen"
          clickOutsideToClose={false}
        >
          <main className="flex-1 p-6 h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  AI Assistant Template
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  A production-ready template with FastAPI, React, and CopilotKit CoAgents
                </p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <div className="space-y-6">
                  <AgentStatusDisplay />
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      🚀 Quick Start
                    </h2>
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Frontend: React + Vite + TypeScript</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>Backend: FastAPI + SQLModel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        <span>AI: CopilotKit + LangGraph</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      🤖 Agent Capabilities
                    </h2>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                      <div>• Web search with Tavily API</div>
                      <div>• Mathematical calculations</div>
                      <div>• Text analysis with GPT-4</div>
                      <div>• Human-in-the-loop workflows</div>
                      <div>• Real-time streaming responses</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    💡 Try These Examples
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="font-medium text-gray-900 dark:text-white mb-2">
                        🔍 Web Search
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        "Search for the latest developments in AI"
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="font-medium text-gray-900 dark:text-white mb-2">
                        🧮 Calculations
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        "Calculate 15% tip on $87.50"
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="font-medium text-gray-900 dark:text-white mb-2">
                        🧠 Analysis
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        "Analyze the pros and cons of remote work"
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>
                  Built with ❤️ using{" "}
                  <span className="font-medium">FastAPI</span>,{" "}
                  <span className="font-medium">React</span>,{" "}
                  <span className="font-medium">CopilotKit</span>, and{" "}
                  <span className="font-medium">LangGraph</span>
                </p>
              </footer>
            </div>
          </main>
        </CopilotSidebar>
      </AppStateProvider>
    </CopilotKit>
  );
}

export default App;