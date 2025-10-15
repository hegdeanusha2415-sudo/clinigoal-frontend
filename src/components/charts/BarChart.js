import React from 'react';
import './charts.css';

const BarChart = ({ 
  data, 
  labels, 
  colors, 
  height = 200,
  showValues = true,
  horizontal = false,
  title = '',
  className = ''
}) => {
  const maxValue = Math.max(...data, 1);
  
  // Default colors if not provided
  const defaultColors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#27ae60', '#8e44ad'
  ];

  const chartColors = colors || defaultColors;

  if (horizontal) {
    return (
      <div className={`bar-chart horizontal ${className}`} style={{ height: `${height}px` }}>
        {title && <h4 className="chart-subtitle">{title}</h4>}
        <div className="bars-container">
          {data.map((value, index) => (
            <div key={index} className="bar-row">
              <div className="bar-label-container">
                <span className="bar-label">{labels?.[index] || `Item ${index + 1}`}</span>
                {showValues && <span className="bar-value">{value}</span>}
              </div>
              <div className="bar-track">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${(value / maxValue) * 100}%`,
                    backgroundColor: chartColors[index % chartColors.length]
                  }}
                >
                  {showValues && (
                    <span className="bar-value-inside">{value}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bar-chart vertical ${className}`} style={{ height: `${height}px` }}>
      {title && <h4 className="chart-subtitle">{title}</h4>}
      <div className="bars-container">
        {data.map((value, index) => (
          <div key={index} className="bar-column">
            <div 
              className="bar"
              style={{ 
                height: `${(value / maxValue) * 100}%`,
                backgroundColor: chartColors[index % chartColors.length]
              }}
              title={`${labels?.[index] || `Item ${index + 1}`}: ${value}`}
            >
              {showValues && (
                <span className="bar-value">{value}</span>
              )}
            </div>
            <span className="bar-label">
              {labels?.[index] || `Item ${index + 1}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;