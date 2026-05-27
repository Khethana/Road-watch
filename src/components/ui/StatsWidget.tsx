import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface StatsWidgetProps {
  title: string;
  value: string | number;
  icon: any;
  iconColor?: string;
  change?: { value: number; period: string };
  isLoading?: boolean;
}

export const StatsWidget = React.memo(({ title, value, icon: Icon, iconColor = 'text-primary', change, isLoading }: StatsWidgetProps) => {
  if (isLoading) {
    // Only one single stat skeleton
    return (
      <div className="bg-surface border border-border p-6 rounded-xl animate-pulse flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-elevated"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-elevated rounded w-1/2"></div>
          <div className="h-6 bg-elevated rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const isPositive = change?.value && change.value > 0;
  const changeColor = isPositive ? 'text-success' : 'text-danger';

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <h4 className="text-2xl font-bold text-text-primary">{value}</h4>
        </div>
        <div className={`p-3 rounded-full bg-elevated ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center text-sm">
          <span className={`font-medium ${changeColor}`}>
            {isPositive ? '+' : ''}{change.value}%
          </span>
          <span className="text-text-muted ml-2">vs {change.period}</span>
        </div>
      )}
    </div>
  );
});

StatsWidget.displayName = 'StatsWidget';
export default StatsWidget;
