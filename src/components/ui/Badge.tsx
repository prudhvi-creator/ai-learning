import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'slate' | 'red';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  className = ''
}) => {
  const variantStyles = {
    purple: 'bg-accent-purple/20 text-accent-purple-light border-accent-purple/30',
    blue: 'bg-accent-blue/20 text-accent-blue-light border-accent-blue/30',
    green: 'bg-accent-green/20 text-accent-green-light border-accent-green/30',
    orange: 'bg-accent-orange/20 text-accent-orange-light border-accent-orange/30',
    pink: 'bg-accent-pink/20 text-accent-pink-light border-accent-pink/30',
    slate: 'bg-dark-surface2 text-slate-400 border-dark-border',
    red: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
