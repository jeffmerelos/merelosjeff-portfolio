import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  neonBorder?: boolean;
  glowColor?: 'cyan' | 'magenta' | 'green' | 'red';
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  neonBorder = false,
  glowColor = 'cyan',
  onClick,
}) => {
  const glowStyles = {
    cyan: 'hover:border-cyber-cyan hover:shadow-cyber-cyan',
    magenta: 'hover:border-cyber-magenta hover:shadow-cyber-magenta',
    green: 'hover:border-cyber-green hover:shadow-cyber-green',
    red: 'hover:border-cyber-red hover:shadow-cyber-red',
  };
  
  const neonBorderClasses = neonBorder ? `neon-border-${glowColor}` : '';
  
  return (
    <div
      className={`
        cyber-card
        bg-gradient-to-br from-cyber-card-bg to-cyber-deep-black
        border border-cyber-border
        rounded-lg p-6
        transition-all duration-300
        ${glowStyles[glowColor]}
        ${neonBorderClasses}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-cyber font-bold text-white mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-cyber-text-muted">{subtitle}</p>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default Card;
