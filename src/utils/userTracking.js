// Get user login logs from localStorage
export const getUserLoginLogs = () => {
  try {
    const logs = localStorage.getItem('userLoginLogs');
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error('Error getting user login logs:', error);
    return [];
  }
};

// Get unique users count
export const getUniqueUsersCount = () => {
  try {
    const uniqueUsers = localStorage.getItem('uniqueUsers');
    return uniqueUsers ? JSON.parse(uniqueUsers).length : 0;
  } catch (error) {
    console.error('Error getting unique users count:', error);
    return 0;
  }
};

// Get user statistics
export const getUserStatistics = () => {
  try {
    const logs = getUserLoginLogs();
    const uniqueUsers = JSON.parse(localStorage.getItem('uniqueUsers') || '[]');
    
    const today = new Date().toDateString();
    const todayLogins = logs.filter(log => {
      const logDate = new Date(log.timestamp).toDateString();
      return logDate === today;
    }).length;

    return {
      uniqueUsers: uniqueUsers.length,
      todayLogins: todayLogins,
      totalLogins: logs.length
    };
  } catch (error) {
    console.error('Error getting user statistics:', error);
    return {
      uniqueUsers: 0,
      todayLogins: 0,
      totalLogins: 0
    };
  }
};

// Get time ago string
export const getTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return time.toLocaleDateString();
  }
};