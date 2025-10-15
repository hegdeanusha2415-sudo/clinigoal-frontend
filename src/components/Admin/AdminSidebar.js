import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ activeSection, setActiveSection, courseApprovals, reviews }) => {
  const getApprovalStats = () => {
    const pending = courseApprovals.filter(a => a.status === 'pending').length;
    return pending;
  };

  const getReviewStats = () => {
    const pending = reviews.filter(r => r.status === 'pending').length;
    return pending;
  };

  const approvalPending = getApprovalStats();
  const reviewPending = getReviewStats();

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <h2>Clinigoal</h2>
        </div>
        <div className="admin-info">
          <div className="admin-avatar">A</div>
          <div className="admin-details">
            <strong>Admin Panel</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-text">Dashboard</span>
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveSection('payments')}
        >
          <span className="nav-icon">💳</span>
          <span className="nav-text">Payments</span>
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'students' ? 'active' : ''}`}
          onClick={() => setActiveSection('students')}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-text">Students</span>
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveSection('courses')}
        >
          <span className="nav-icon">📚</span>
          <span className="nav-text">Courses</span>
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'course' ? 'active' : ''}`}
          onClick={() => setActiveSection('course')}
        >
          <span className="nav-icon">🎬</span>
          <span className="nav-text">Course Content</span>
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveSection('approvals')}
        >
          <span className="nav-icon">✅</span>
          <span className="nav-text">Approvals</span>
          {approvalPending > 0 && (
            <span className="nav-badge">{approvalPending}</span>
          )}
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveSection('reviews')}
        >
          <span className="nav-icon">⭐</span>
          <span className="nav-text">Reviews</span>
          {reviewPending > 0 && (
            <span className="nav-badge">{reviewPending}</span>
          )}
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveSection('analytics')}
        >
          <span className="nav-icon">📈</span>
          <span className="nav-text">Analytics</span>
        </button>
        
        <button 
          className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-text">Settings</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>System Online</span>
        </div>
        <button className="nav-item logout">
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;