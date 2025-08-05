import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCopilotAction } from "@copilotkit/react-core";
import { RadiantLogo } from './RadiantLogo';
import { DrMayaVoiceExperience } from './DrMayaVoiceExperience';
import { JourneyTool } from './journeystages/JourneyTool';

// --- Types ---
interface Tool {
  name: string;
  component: string;
  metadata: any;
}

// --- Design System & Styles ---
const styles: { [key: string]: React.CSSProperties } = {
  // --- Layout ---
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F7F7F7', // Softer background
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  sidebar: {
    width: '320px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E5E5E5',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '48px 64px',
    overflowY: 'auto',
  },
  // --- Sidebar Elements ---
  sidebarHeader: {
    marginBottom: '32px',
  },
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1D1D1F',
    marginBottom: '8px',
  },
  sidebarSubtitle: {
    fontSize: '14px',
    color: '#6E6E73',
  },
  toolCard: {
    backgroundColor: '#F7F7F7',
    border: '1px solid #E5E5E5',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  activeToolCard: {
    backgroundColor: '#FFF8E1',
    border: '1px solid #FFD600',
    boxShadow: '0 4px 12px rgba(255, 214, 0, 0.2)',
  },
  toolName: {
    fontWeight: 500,
    color: '#1D1D1F',
  },
  // --- Main Content Elements ---
  mainHeader: {
    marginBottom: '48px',
  },
  mainTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1D1D1F',
  },
  mainSubtitle: {
    fontSize: '18px',
    color: '#6E6E73',
    marginTop: '8px',
  },
  journeyGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  stageCard: {
    backgroundColor: '#FFFFFF',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #E5E5E5',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  activeStageCard: {
    border: '2px solid #007AFF',
    boxShadow: '0 8px 24px rgba(0, 122, 255, 0.15)',
    transform: 'translateY(-4px)',
  },
  stageNumber: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#007AFF',
  },
  stageTitle: {
    fontSize: '17px',
    fontWeight: 600,
    color: '#1D1D1F',
    marginTop: '8px',
  },
  // --- Floating Action Button ---
  fabContainer: {
    position: 'fixed',
    bottom: '40px',
    right: '40px',
    zIndex: 2147483647,
  },
  fab: {
    width: '72px',
    height: '72px',
    backgroundColor: '#007AFF',
    borderRadius: '50%',
    boxShadow: '0 10px 30px rgba(0, 122, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
};

// --- Journey Data ---
const journeyStages = [
    { id: 1, name: 'awareness', title: 'First Hints & Initial Doctor Visit', theme: 'From Fear to Understanding' },
    { id: 2, name: 'diagnosis', title: 'Specialist Work-up & Diagnosis', theme: 'From Shock to Clarity' },
    { id: 3, name: 'research', title: 'Research & "Compare-Care" Phase', theme: 'From Confusion to Clarity' },
    { id: 4, name: 'staging', title: 'Full Staging & Baseline Testing', theme: 'From Uncertainty to Planning' },
    { id: 5, name: 'planning', title: 'Multidisciplinary Treatment Planning', theme: 'From Options to Decision' },
    { id: 6, name: 'insurance', title: 'Insurance Confirmation & Travel Setup', theme: 'From Bureaucracy to Preparation' },
];

// --- Floating Action Button ---
const FloatingActionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const fabStyle = { ...styles.fab, transform: isHovered ? 'scale(1.05)' : 'scale(1)' };
  return createPortal(
    <div style={styles.fabContainer}>
      <button style={fabStyle} onClick={onClick} onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)} aria-label="Talk to Dr. Maya">
        <svg width="36" height="36" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" /><path d="M5.5 4.5a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8a.5.5 0 01-.5-.5zM10 18a5 5 0 005-5h-1a4 4 0 01-8 0H5a5 5 0 005 5z" /></svg>
      </button>
    </div>,
    document.body
  );
};

// --- Main Dashboard Component ---
export const PatientJourneyDashboard: React.FC = () => {
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('awareness'); // Default to first stage
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  useCopilotAction({
    name: "showTool",
    parameters: [{ name: "toolName", type: "string", description: "The name of the tool component to display." }],
    handler: ({ toolName }) => {
      console.log(`[Dashboard] AI command received: show tool '${toolName}'`);
      setActiveTool(toolName);
    },
  });

  useEffect(() => {
    const fetchTools = async () => {
      setIsLoadingTools(true);
      try {
        const response = await fetch(`http://localhost:9500/api/v1/journey/${selectedStage}`);
        const data = await response.json();
        setTools(data.tools || []);
        // Set a default active tool for the stage if none is active
        if (!activeTool && data.tools && data.tools.length > 0) {
          setActiveTool(data.tools[0].component);
        }
      } catch (error) {
        console.error("Failed to fetch tools:", error);
        setTools([]);
      }
      setIsLoadingTools(false);
    };
    fetchTools();
  }, [selectedStage]);

  if (showVoiceChat) {
    return <DrMayaVoiceExperience onExit={() => setShowVoiceChat(false)} />;
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <RadiantLogo size="md" />
        </div>
        <h2 style={styles.sidebarTitle}>Your Stage Tools</h2>
        <p style={styles.sidebarSubtitle}>Guidance for your current focus.</p>
        <div style={{ marginTop: '24px' }}>
          {isLoadingTools ? <p>Loading...</p> : tools.map(tool => (
            <div 
              key={tool.name} 
              style={{...styles.toolCard, ...(activeTool === tool.component ? styles.activeToolCard : {})}}
              onClick={() => setActiveTool(tool.component)}
            >
              <p style={styles.toolName}>{tool.name}</p>
            </div>
          ))}
        </div>
      </aside>

      <main style={styles.mainContent}>
        <header style={styles.mainHeader}>
          <h1 style={styles.mainTitle}>Your RadiantCompass Journey</h1>
          <p style={styles.mainSubtitle}>A clear path forward, with guidance at every step.</p>
        </header>

        <div style={styles.journeyGrid}>
          {journeyStages.map(stage => (
            <div 
              key={stage.id} 
              style={{...styles.stageCard, ...(selectedStage === stage.name ? styles.activeStageCard : {})}}
              onClick={() => setSelectedStage(stage.name)}
            >
              <p style={styles.stageNumber}>Stage {stage.id}</p>
              <h3 style={styles.stageTitle}>{stage.title}</h3>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: '48px' }}>
          {activeTool ? <JourneyTool componentName={activeTool} /> : <p>Select a tool from the sidebar.</p>}
        </div>
      </main>

      <FloatingActionButton onClick={() => setShowVoiceChat(true)} />
    </div>
  );
};