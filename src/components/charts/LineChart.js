import React from 'react';
import './charts.css';

const LineChart = ({ 
  data, 
  labels, 
  color = '#3498db', 
  height = 200,
  strokeWidth = 2,
  showPoints = true,
  showArea = false,
  title = '',
  className = ''
}) => {
  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const valueRange = maxValue - minValue;
  
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: 100 - ((value - minValue) / valueRange) * 100
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Create area path for filled charts
  const areaData = points.length > 0 
    ? `${pathData} L 100 100 L 0 100 Z`
    : '';

  return (
    <div className={`line-chart ${className}`} style={{ height: `${height}px` }}>
      {title && <h4 className="chart-subtitle">{title}</h4>}
      <div className="line-chart-container">
        <svg 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          className="line-chart-svg"
        >
          {/* Grid lines */}
          <g className="grid-lines">
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="#ecf0f1"
                strokeWidth="0.5"
              />
            ))}
          </g>
          
          {/* Area fill */}
          {showArea && (
            <path 
              d={areaData} 
              fill={`${color}20`}
              className="area-fill"
            />
          )}
          
          {/* Line path */}
          <path 
            d={pathData} 
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            className="line-path"
          />
          
          {/* Data points */}
          {showPoints && points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill={color}
              stroke="#fff"
              strokeWidth="1"
              className="data-point"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="line-labels">
          {labels?.map((label, index) => (
            <span 
              key={index} 
              className="line-label"
              style={{ left: `${(index / (labels.length - 1)) * 100}%` }}
            >
              {label}
            </span>
          ))}
        </div>
        
        {/* Y-axis values */}
        <div className="y-axis-values">
          {[maxValue, (maxValue + minValue) / 2, minValue].map((value, index) => (
            <span 
              key={index}
              className="y-axis-value"
              style={{ bottom: `${(index / 2) * 100}%` }}
            >
              {Math.round(value)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;