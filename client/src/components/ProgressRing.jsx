import React from 'react';
import clsx from 'clsx';

const ProgressRing = ({ 
  percentage = 0, 
  size = 120, 
  strokeWidth = 8,
  completed = 0,
  total = 0,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={clsx('relative flex items-center justify-center', className)}>
      {/* SVG Progress Ring */}
      <svg
        width={size}
        height={size}
        className="progress-ring"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(203, 213, 225, 0.3)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="zen-transition"
          style={{
            transitionProperty: 'stroke-dashoffset',
            transitionDuration: '1s',
            transitionTimingFunction: 'ease-out'
          }}
        />
        
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-zen-800 text-shadow">
          {percentage}%
        </div>
        <div className="text-sm text-zen-600 mt-1">
          {completed}/{total}
        </div>
        <div className="text-xs text-zen-500 mt-1">
          Today
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;