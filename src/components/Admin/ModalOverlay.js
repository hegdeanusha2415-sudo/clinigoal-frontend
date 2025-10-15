import React from 'react';
import './ModalOverlay.css';

const ModalOverlay = ({ 
  children, 
  onClose, 
  title, 
  size = 'medium',
  showCloseButton = true 
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay active" onClick={handleOverlayClick}>
      <div className={`modal active ${size}`}>
        <div className="modal-header">
          {title && <h3>{title}</h3>}
          {showCloseButton && (
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          )}
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;