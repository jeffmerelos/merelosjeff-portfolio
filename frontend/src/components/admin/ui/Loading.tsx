import React from 'react';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
    xl: 'w-24 h-24 border-4',
  };
  
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`
          cyber-spinner
          ${sizeStyles[size]}
          border-transparent
          border-t-cyber-cyan
          border-r-cyber-magenta
          rounded-full
          animate-spin
        `}
      />
      {text && (
        <p className="text-cyber-text-secondary font-tech text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-cyber-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }
  
  return content;
};

export default Loading;
