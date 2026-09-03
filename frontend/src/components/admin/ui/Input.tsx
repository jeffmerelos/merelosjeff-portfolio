import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      fullWidth = true,
      className = '',
      ...props
    },
    ref
  ) => {
    const widthStyle = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${widthStyle}`}>
        {label && (
          <label className="block mb-2 text-sm font-medium text-cyber-text-secondary">
            {label}
            {props.required && <span className="text-cyber-red ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              cyber-input
              w-full px-4 py-3
              bg-cyber-dark-gray
              border border-cyber-border
              border-b-2 border-b-cyber-cyan
              text-white
              placeholder-cyber-text-dim
              focus:outline-none
              focus:border-b-cyber-cyan
              focus:shadow-cyber-input
              transition-all duration-300
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-b-cyber-red focus:border-b-cyber-red' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-cyber-red flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-cyber-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
