import React from 'react';
import { EnhancedVoiceExperience } from './EnhancedVoiceExperience';

interface DrMayaVoiceExperienceProps {
  onExit: () => void;
}

/**
 * Dr. Maya Voice Experience - Enhanced Tool Demonstration Platform
 * 
 * This component provides a comprehensive voice chat experience with
 * an integrated tool panel for demonstrating all RadiantCompass tools.
 * 
 * Features:
 * - Full-screen enhanced experience with tool panel
 * - Premium Apple/Netflix-quality design
 * - Voice functionality with autonomous tool demonstrations
 * - 36+ tools across 12 patient journey stages
 * - Dr. Maya guides users through each tool autonomously
 * - Remote control-inspired tool panel interface
 */
export const DrMayaVoiceExperience: React.FC<DrMayaVoiceExperienceProps> = ({ onExit }) => {
  return (
    <EnhancedVoiceExperience onNavigateHome={onExit} />
  );
};
