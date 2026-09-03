import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'magenta' | 'green' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'cyan',
      size = 'md',
      fullWidth = false,
      loading = false,
      icon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'cyber-button relative font-cyber font-semibold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      cyan: 'border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan-glow hover:shadow-cyber-cyan',
      magenta: 'border-cyber-magenta text-cyber-magenta hover:bg-cyber-magenta-glow hover:shadow-cyber-magenta',
      green: 'border-cyber-green text-cyber-green hover:bg-cyber-green-glow hover:shadow-cyber-green',
      red: 'border-cyber-red text-cyber-red hover:bg-cyber-red-glow hover:shadow-cyber-red',
      yellow: 'border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow-glow hover:shadow-cyber-yellow',
    };
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    };
    
    const widthStyle = fullWidth ? 'w-full' : '';
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="cyber-spinner w-4 h-4 border-2" />
            <span>Processing...</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {icon && <span>{icon}</span>}
            <span>{children}</span>
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
