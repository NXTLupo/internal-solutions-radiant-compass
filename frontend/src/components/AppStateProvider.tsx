import { useCopilotReadable } from "@copilotkit/react-core";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

interface AppData {
  currentProject: string;
  userPreferences: {
    theme: "light" | "dark";
    notifications: boolean;
  };
  recentSearches: string[];
  sessionInfo: {
    startTime: string;
    requestCount: number;
  };
}

interface AppStateProviderProps {
  children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const [appData, setAppData] = useState<AppData>({
    currentProject: "AI Assistant Template",
    userPreferences: { 
      theme: "light", 
      notifications: true 
    },
    recentSearches: [],
    sessionInfo: {
      startTime: new Date().toISOString(),
      requestCount: 0
    }
  });

  // Update request count when user interacts
  const incrementRequestCount = () => {
    setAppData(prev => ({
      ...prev,
      sessionInfo: {
        ...prev.sessionInfo,
        requestCount: prev.sessionInfo.requestCount + 1
      }
    }));
  };

  // Add search to recent searches
  const addRecentSearch = (search: string) => {
    setAppData(prev => ({
      ...prev,
      recentSearches: [search, ...prev.recentSearches.slice(0, 4)] // Keep last 5
    }));
  };

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setAppData(prev => ({
        ...prev,
        userPreferences: {
          ...prev.userPreferences,
          theme: e.matches ? "dark" : "light"
        }
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Set initial theme
    setAppData(prev => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        theme: mediaQuery.matches ? "dark" : "light"
      }
    }));

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Make app state readable by the agent
  useCopilotReadable({
    description: "Current application state and user context for the AI assistant",
    value: {
      ...appData,
      capabilities: [
        "Web search using Tavily API",
        "Mathematical calculations", 
        "Text analysis with GPT-4",
        "Real-time streaming responses"
      ],
      availableActions: [
        "Search the web for information",
        "Perform calculations",
        "Analyze text content",
        "Provide recommendations"
      ]
    },
  });

  // Provide context functions to children if needed
  const contextValue = {
    appData,
    incrementRequestCount,
    addRecentSearch,
    updateUserPreferences: (preferences: Partial<AppData['userPreferences']>) => {
      setAppData(prev => ({
        ...prev,
        userPreferences: { ...prev.userPreferences, ...preferences }
      }));
    }
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}

// Create context for components that need it
import { createContext, useContext } from "react";

const AppStateContext = createContext<{
  appData: AppData;
  incrementRequestCount: () => void;
  addRecentSearch: (search: string) => void;
  updateUserPreferences: (preferences: Partial<AppData['userPreferences']>) => void;
} | null>(null);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
};