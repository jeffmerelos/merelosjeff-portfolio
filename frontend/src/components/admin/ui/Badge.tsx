import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    success: 'cyber-badge-success text-cyber-green border-cyber-green bg-cyber-green/10 shadow-cyber-green',
    danger: 'cyber-badge-danger text-cyber-red border-cyber-red bg-cyber-red/10 shadow-cyber-red',
    warning: 'cyber-badge-warning text-cyber-yellow border-cyber-yellow bg-cyber-yellow/10',
    info: 'cyber-badge-info text-cyber-cyan border-cyber-cyan bg-cyber-cyan/10 shadow-cyber-cyan',
    default: 'text-cyber-text-secondary border-cyber-border bg-cyber-border/20',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };
  
  return (
    <span
      className={`
        inline-flex items-center justify-center
        font-semibold uppercase tracking-wide
        rounded border
        transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
