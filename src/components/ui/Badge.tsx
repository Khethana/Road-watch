import React from 'react';

export interface BadgeProps {
  variant: 'critical' | 'moderate' | 'low' | 'pending' | 'in_progress' | 'resolved' | 'completed' | 'ongoing' | 'delayed';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  critical: 'bg-danger/10 text-danger border-danger/20',
  moderate: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-success/10 text-success border-success/20',
  pending: 'bg-danger/10 text-danger border-danger/20',
  in_progress: 'bg-warning/10 text-warning border-warning/20',
  resolved: 'bg-success/10 text-success border-success/20',
  completed: 'bg-success/10 text-success border-success/20',
  ongoing: 'bg-info/10 text-info border-info/20',
  delayed: 'bg-danger/10 text-danger border-danger/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export const Badge = ({ variant, size = 'sm', children, className = '' }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={`Status: ${variant.replace('_', ' ')}`}
    >
      {children}
    </span>
  );
};

export default Badge;
