// Data persistence helpers
export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    throw error;
  }
};

export const loadFromLocalStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Formatting helpers
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Payment status helper
export const renderPaymentStatus = (status) => {
  const statusConfig = {
    completed: { class: 'status-completed', text: 'Completed', icon: '✅' },
    pending: { class: 'status-pending', text: 'Pending', icon: '⏳' },
    failed: { class: 'status-failed', text: 'Failed', icon: '❌' },
    refunded: { class: 'status-refunded', text: 'Refunded', icon: '↩️' }
  };
  
  const config = statusConfig[status] || { class: 'status-pending', text: status, icon: '❓' };
  
  return (
    <span className={`status-badge ${config.class}`}>
      {config.icon} {config.text}
    </span>
  );
};

// Search and filter helpers
export const filterContent = (items, searchTerm, filterCourse, fields = ['title', 'description']) => {
  return items.filter(item => {
    const matchesSearch = fields.some(field => 
      item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesCourse = !filterCourse || item.course === filterCourse;
    return matchesSearch && matchesCourse;
  });
};

// Selection helpers
export const handleSelectItem = (selectedItems, setSelectedItems, itemId, type) => {
  setSelectedItems(prev => {
    const itemKey = `${type}_${itemId}`;
    if (prev.includes(itemKey)) {
      return prev.filter(id => id !== itemKey);
    } else {
      return [...prev, itemKey];
    }
  });
};

export const handleSelectAll = (selectedItems, setSelectedItems, type, items) => {
  const allItemKeys = items.map(item => `${type}_${item._id}`);
  if (selectedItems.length === allItemKeys.length) {
    setSelectedItems([]);
  } else {
    setSelectedItems(allItemKeys);
  }
};

// File validation helpers
export const validateFileType = (file, allowedTypes, allowedExtensions = []) => {
  if (!allowedTypes.includes(file.type)) {
    return false;
  }
  
  if (allowedExtensions.length > 0) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return false;
    }
  }
  
  return true;
};

export const validateFileSize = (file, maxSizeMB) => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

// Analytics calculation helpers
export const calculateRevenue = (payments) => {
  return payments.reduce((sum, payment) => {
    const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, '')) || 0;
    return sum + amount;
  }, 0);
};

export const calculateMonthlyRevenue = (payments, months = 1) => {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - months);
  
  return payments
    .filter(p => new Date(p.timestamp) >= cutoffDate)
    .reduce((sum, payment) => {
      const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0);
};

export const generateRevenueTrend = (payments, months = 6) => {
  return Array.from({ length: months }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (months - 1 - i));
    const monthKey = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    
    const monthRevenue = payments
      .filter(p => {
        const paymentDate = new Date(p.timestamp);
        return paymentDate.getMonth() === date.getMonth() && 
               paymentDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, payment) => {
        const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, '')) || 0;
        return sum + amount;
      }, 0);

    return {
      month: monthKey,
      revenue: monthRevenue
    };
  });
};