import React from 'react';

interface RadiantLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const RadiantLogo: React.FC<RadiantLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: { icon: 'w-8 h-8', text: 'text-lg' },
    md: { icon: 'w-10 h-10', text: 'text-xl' },
    lg: { icon: 'w-16 h-16', text: 'text-3xl' },
    xl: { icon: 'w-24 h-24', text: 'text-5xl' }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Radiant Compass Icon */}
      <div className={`${currentSize.icon} relative flex items-center justify-center`}>
        {/* Outer sun rays */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Sun rays */}
            {Array.from({ length: 16 }, (_, i) => {
              const angle = (i * 360) / 16;
              const isLongRay = i % 2 === 0;
              const rayLength = isLongRay ? 15 : 10;
              const rayWidth = isLongRay ? 3 : 2;
              
              return (
                <g key={i} transform={`rotate(${angle} 50 50)`}>
                  <rect
                    x={48.5}
                    y={8}
                    width={rayWidth}
                    height={rayLength}
                    rx={rayWidth / 2}
                    fill="url(#sunGradient)"
                  />
                </g>
              );
            })}
            
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FBD38D" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FB923C" />
              </linearGradient>
              <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="70%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Center compass */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-3/4 h-3/4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer ring */}
            <circle
              cx="50"
              cy="50"
              r="35"
              fill="url(#centerGradient)"
              stroke="#D97706"
              strokeWidth="2"
            />
            
            {/* Inner compass points */}
            <g stroke="#FFFFFF" strokeWidth="2" fill="#FFFFFF">
              {/* North point */}
              <path d="M50 20 L45 35 L50 30 L55 35 Z" />
              {/* South point */}
              <path d="M50 80 L45 65 L50 70 L55 65 Z" />
              {/* East point */}
              <path d="M80 50 L65 45 L70 50 L65 55 Z" />
              {/* West point */}
              <path d="M20 50 L35 45 L30 50 L35 55 Z" />
            </g>
            
            {/* Center dot */}
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Subtle glow effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)',
            filter: 'blur(8px)',
            zIndex: -1
          }}
        />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span 
            className={`font-bold tracking-tight ${currentSize.text}`}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            RADIANT
          </span>
          <span 
            className={`font-medium tracking-wide text-gray-600`}
            style={{ fontSize: `${parseInt(currentSize.text.split('text-')[1]) * 0.6}rem` }}
          >
            COMPASS
          </span>
        </div>
      )}
    </div>
  );
};

export default RadiantLogo;