import React from 'react';
import './charts.css';

const DonutChart = ({ 
  value, 
  max = 100, 
  label, 
  color = '#3498db', 
  size = 120,
  strokeWidth = 8,
  showValue = true,
  animation = true,
  className = ''
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const progressOffset = circumference - (progress * circumference);
  
  // Calculate percentage
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`donut-chart ${className}`}>
      <div 
        className="donut-container" 
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 120 120"
          className="donut-svg"
        >
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#ecf0f1"
            strokeWidth={strokeWidth}
            className="donut-background"
          />
          
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            className={`donut-progress ${animation ? 'animated' : ''}`}
          />
          
          {/* Center text */}
          {showValue && (
            <text 
              x="60" 
              y="60" 
              textAnchor="middle" 
              dy="0.3em" 
              className="donut-value"
            >
              {percentage}%
            </text>
          )}
          
          {label && (
            <text 
              x="60" 
              y="80" 
              textAnchor="middle" 
              className="donut-label"
            >
              {label}
            </text>
          )}
        </svg>
        
        {/* Additional info */}
        <div className="donut-info">
          {!showValue && (
            <div className="donut-main-value">{value}</div>
          )}
          {label && !showValue && (
            <div className="donut-main-label">{label}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;