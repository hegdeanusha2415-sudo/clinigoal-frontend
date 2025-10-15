import React from 'react';

const BulkActions = ({ type, selectedCount, onBulkDelete, onClearSelection }) => {
  if (selectedCount === 0) return null;
  
  return (
    <div className="bulk-actions-bar">
      <div className="bulk-actions-info">
        <span>{selectedCount} {type}(s) selected</span>
      </div>
      <div className="bulk-actions-buttons">
        <button 
          className="btn-danger"
          onClick={onBulkDelete}
        >
          🗑️ Delete Selected
        </button>
        <button 
          className="btn-secondary"
          onClick={onClearSelection}
        >
          ✕ Clear Selection
        </button>
      </div>
    </div>
  );
};

export default BulkActions;