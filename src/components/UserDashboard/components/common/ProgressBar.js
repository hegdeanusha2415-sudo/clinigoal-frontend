import React from 'react';

const ProgressBar = ({ progress }) => (
  <div className="progress-container">
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <span className="progress-text">{progress}%</span>
  </div>
);

export default ProgressBar;