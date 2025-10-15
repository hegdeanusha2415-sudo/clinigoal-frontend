import React from 'react';
import './charts.css';

const ChartContainer = ({ 
  title, 
  children, 
  className = '', 
  actions,
  loading = false 
}) => {
  return (
    <div className={`chart-container ${className}`}>
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {actions && (
          <div className="chart-actions">
            {actions}
          </div>
        )}
      </div>
      
      <div className="chart-content">
        {loading ? (
          <div className="chart-loading">
            <div className="chart-spinner"></div>
            <p>Loading chart data...</p>
          </div>
        ) : (
          children
        )}
      </div>
      
      {!loading && (
        <div className="chart-footer">
          <span className="chart-info">Hover over elements for details</span>
        </div>
      )}
    </div>
  );
};

export default ChartContainer;