import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[12px] shadow-sm ${className} ${onClick ? 'active:scale-95 transition-transform cursor-pointer' : ''}`}
    >
      {children}
    </div>
  );
};
