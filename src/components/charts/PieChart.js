import React, { useState } from 'react';
import './charts.css';

const PieChart = ({ 
  data, 
  labels, 
  colors, 
  height = 200,
  showLegend = true,
  donut = false,
  title = '',
  className = ''
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = data.reduce((sum, value) => sum + value, 0);
  
  // Default colors
  const defaultColors = [
    '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
    '#1abc9c', '#34495e', '#e67e22', '#27ae60', '#8e44ad'
  ];
  
  const chartColors = colors || defaultColors;
  let cumulativePercent = 0;

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div className={`pie-chart ${className}`}>
      {title && <h4 className="chart-subtitle">{title}</h4>}
      <div className="pie-container" style={{ height: `${height}px` }}>
        <svg 
          viewBox="0 0 100 100" 
          className="pie-svg"
          onMouseLeave={handleMouseLeave}
        >
          {donut && (
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="white"
            />
          )}
          
          {data.map((value, index) => {
            if (value === 0) return null;
            
            const percent = (value / total) * 100;
            const startPercent = cumulativePercent;
            cumulativePercent += percent;

            const x1 = 50 + 50 * Math.cos(2 * Math.PI * startPercent / 100);
            const y1 = 50 + 50 * Math.sin(2 * Math.PI * startPercent / 100);
            const x2 = 50 + 50 * Math.cos(2 * Math.PI * cumulativePercent / 100);
            const y2 = 50 + 50 * Math.sin(2 * Math.PI * cumulativePercent / 100);

            const largeArcFlag = percent > 50 ? 1 : 0;

            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`
            ].join(' ');

            return (
              <path
                key={index}
                d={pathData}
                fill={chartColors[index % chartColors.length]}
                className={`pie-slice ${hoveredIndex === index ? 'hovered' : ''}`}
                onMouseEnter={() => handleMouseEnter(index)}
                style={{
                  opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.7
                }}
              />
            );
          })}
          
          {/* Center text for donut chart */}
          {donut && (
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dy="0.35em"
              className="donut-center-text"
            >
              {total}
            </text>
          )}
        </svg>
        
        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div 
            className="pie-tooltip"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="tooltip-content">
              <strong>{labels?.[hoveredIndex] || `Item ${hoveredIndex + 1}`}</strong>
              <div>{data[hoveredIndex]} ({((data[hoveredIndex] / total) * 100).toFixed(1)}%)</div>
            </div>
          </div>
        )}
      </div>

      {showLegend && (
        <div className="pie-legend">
          {labels?.map((label, index) => (
            <div 
              key={index} 
              className={`legend-item ${hoveredIndex === index ? 'highlighted' : ''}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <span 
                className="legend-color" 
                style={{ 
                  backgroundColor: chartColors[index % chartColors.length],
                  opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.7
                }}
              ></span>
              <span className="legend-label">{label}</span>
              <span className="legend-value">
                {data[index]} ({(data[index] / total * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;