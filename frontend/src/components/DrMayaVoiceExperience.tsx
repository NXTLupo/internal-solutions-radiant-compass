import React from 'react';
import { InlineStyledVoiceChat } from './InlineStyledVoiceChat';

interface DrMayaVoiceExperienceProps {
  onExit: () => void;
}

/**
 * Dr. Maya Voice Experience - Premium Wall-to-Wall Experience
 * 
 * This component provides a full-screen, immersive voice chat experience
 * using inline styles (no Tailwind) for reliable rendering in Docker.
 * 
 * Features:
 * - Wall-to-wall full-screen experience 
 * - Premium Apple/Netflix-quality design
 * - Voice functionality preserved (Web Speech API + Groq + Cartesia)
 * - No external CSS dependencies
 */
export const DrMayaVoiceExperience: React.FC<DrMayaVoiceExperienceProps> = ({ onExit }) => {
  return (
    <InlineStyledVoiceChat onNavigateHome={onExit} />
  );
};
