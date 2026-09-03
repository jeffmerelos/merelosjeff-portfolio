import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: { container: 'w-10 h-5', toggle: 'w-4 h-4', translate: 'translate-x-5' },
    md: { container: 'w-12 h-6', toggle: 'w-5 h-5', translate: 'translate-x-6' },
    lg: { container: 'w-14 h-7', toggle: 'w-6 h-6', translate: 'translate-x-7' },
  };
  
  const styles = sizeStyles[size];
  
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`
          relative ${styles.container}
          rounded-full
          border border-cyber-border
          transition-all duration-300
          ${checked 
            ? 'bg-cyber-cyan/20 border-cyber-cyan shadow-cyber-cyan' 
            : 'bg-cyber-dark-gray'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <div
          className={`
            absolute top-0.5 left-0.5
            ${styles.toggle}
            rounded-full
            transition-all duration-300
            ${checked 
              ? `${styles.translate} bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]` 
              : 'translate-x-0 bg-cyber-text-muted'
            }
          `}
        />
      </div>
      
      {label && (
        <span className="text-sm text-cyber-text-secondary">
          {label}
        </span>
      )}
    </label>
  );
};

export default Toggle;
