import React from 'react';

interface SkeletonLoaderProps {
  variant: 'card' | 'table' | 'chart' | 'stat' | 'list';
}

export const SkeletonLoader = ({ variant }: SkeletonLoaderProps) => {
  if (variant === 'stat') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full" aria-busy="true" aria-label="Loading stats">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border p-6 rounded-xl animate-pulse flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-elevated"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-elevated rounded w-1/2"></div>
              <div className="h-6 bg-elevated rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="w-full bg-surface border border-border rounded-xl overflow-hidden" aria-busy="true" aria-label="Loading table data">
        <div className="h-12 bg-elevated/50 border-b border-border"></div>
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex p-4 space-x-4 animate-pulse">
              <div className="h-4 bg-elevated rounded w-1/4"></div>
              <div className="h-4 bg-elevated rounded w-1/4"></div>
              <div className="h-4 bg-elevated rounded w-1/4"></div>
              <div className="h-4 bg-elevated rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-busy="true" aria-label="Loading cards">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
            <div className="h-48 bg-elevated w-full"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-elevated rounded w-3/4"></div>
              <div className="h-4 bg-elevated rounded w-full"></div>
              <div className="h-4 bg-elevated rounded w-5/6"></div>
              <div className="pt-4 flex justify-between">
                <div className="h-6 bg-elevated rounded-full w-16"></div>
                <div className="h-6 bg-elevated rounded-full w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className="w-full h-80 bg-surface border border-border rounded-xl p-4 flex flex-col justify-end items-center animate-pulse" aria-busy="true" aria-label="Loading chart">
        <div className="w-full h-full bg-elevated/50 rounded flex items-end justify-between px-2 pb-2 space-x-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-full bg-elevated rounded-t" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
          ))}
        </div>
      </div>
    );
  }

  // default list
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading list items">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-surface border border-border p-4 rounded-xl flex space-x-4 animate-pulse">
          <div className="w-16 h-16 bg-elevated rounded-lg"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-elevated rounded w-3/4"></div>
            <div className="h-3 bg-elevated rounded w-1/2"></div>
            <div className="h-3 bg-elevated rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
