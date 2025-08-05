import React from 'react';

interface RadiantLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const RadiantLogo: React.FC<RadiantLogoProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16'
  };

  const heightClass = sizeClasses[size] || sizeClasses.md;

  return (
    <img 
      src="/radiant_compass_logo.png" 
      alt="Radiant Compass Logo"
      className={`${heightClass} w-auto ${className}`}
    />
  );
};

export default RadiantLogo;
