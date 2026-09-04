import React, { useState } from 'react';

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
      id,
      name,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const widthStyle = fullWidth ? 'w-full' : '';
    // Generate a unique ID if not provided
    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;
    
    // Determine appropriate autocomplete value based on input type
    const getAutocompleteValue = () => {
      if (props.autoComplete) return props.autoComplete;
      switch (type) {
        case 'email':
          return 'email';
        case 'password':
          return 'current-password';
        case 'tel':
          return 'tel';
        case 'url':
          return 'url';
        case 'text':
          if (name === 'username') return 'username';
          if (name === 'name') return 'name';
          return 'off';
        default:
          return 'off';
      }
    };
    
    return (
      <div className={`${widthStyle}`}>
        {label && (
          <label htmlFor={inputId} className="block mb-2 text-sm font-medium text-cyber-text-secondary">
            {label}
            {props.required && <span className="text-cyber-red ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            name={name}
            autoComplete={getAutocompleteValue()}
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
              ${isPasswordField ? 'pr-10' : ''}
              ${error ? 'border-b-cyber-red focus:border-b-cyber-red' : ''}
              ${className}
            `}
            {...props}
          />
          
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted pointer-events-none">
              {icon}
            </div>
          )}
          
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-text-muted hover:text-cyber-cyan transition-colors duration-200 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}
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
