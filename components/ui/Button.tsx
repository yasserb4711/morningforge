import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const { settings } = useSettings();
  const color = settings.accentColor;

  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  // Dynamic color mapping for Tailwind classes
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
    teal: 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500',
    rose: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
    amber: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
  };

  const variants = {
    primary: `${colorMap[color]} text-white`,
    secondary: "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:hover:bg-slate-600",
    outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 focus:ring-indigo-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg"
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};