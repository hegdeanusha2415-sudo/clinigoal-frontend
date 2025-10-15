// Payment time formatting utilities
export const formatPaymentTime = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  const paymentDate = new Date(timestamp);
  const now = new Date();
  const diffInMs = now - paymentDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return paymentDate.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
};

export const getDetailedTimeInfo = (timestamp) => {
  if (!timestamp) return 'No timestamp available';
  
  const paymentDate = new Date(timestamp);
  return paymentDate.toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
};

export const getPaymentDayInfo = (timestamp) => {
  if (!timestamp) return '';
  
  const paymentDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (paymentDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (paymentDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return paymentDate.toLocaleDateString('en-IN', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

export const isRecentPayment = (timestamp, hours = 24) => {
  if (!timestamp) return false;
  
  const paymentDate = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now - paymentDate) / (1000 * 60 * 60);
  
  return diffInHours <= hours;
};

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  
  return past.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};