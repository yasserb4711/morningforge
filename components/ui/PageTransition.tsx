import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  const { settings } = useSettings();
  
  // If reduced motion is ON, just return children without animation wrapper
  if (settings.reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`animate-page-enter ${className}`}>
      {children}
    </div>
  );
};