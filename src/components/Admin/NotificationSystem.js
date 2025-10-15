import React from 'react';
import './NotificationSystem.css';

const NotificationSystem = ({ notifications, setNotifications }) => {
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => removeNotification(notification.id)}
            >
              ×
            </button>
          </div>
          <div className="notification-progress"></div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;