import React from 'react';
import { UltraFastVoiceChat } from './UltraFastVoiceChat';

interface DrMayaVoiceExperienceProps {
  onExit: () => void;
}

// --- Inline Styles for Modal Overlay (Apple-like elegance) ---
const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2147483647, // Maximum z-index to ensure visibility
    padding: '20px',
  },
  modalContainer: {
    width: '100%',
    maxWidth: '512px',
    height: '80vh',
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
};

export const DrMayaVoiceExperience: React.FC<DrMayaVoiceExperienceProps> = ({ onExit }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContainer}>
        <UltraFastVoiceChat onNavigateHome={onExit} />
      </div>
    </div>
  );
};
