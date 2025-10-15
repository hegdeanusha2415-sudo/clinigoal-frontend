import React from 'react';

const OverviewSection = ({ stats, setActiveSection }) => {
  return (
    <div className="admin-overview">
      <div className="overview-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your clinical education platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{stats.totalRevenue}</h3>
            <p>Total Revenue</p>
            <span className="stat-trend">+12% this month</span>
          </div>
        </div>

        <div className="stat-card students">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
            <span className="stat-trend">+5 new this week</span>
          </div>
        </div>

        <div className="stat-card courses">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
            <span className="stat-trend">Active programs</span>
          </div>
        </div>

        <div className="stat-card success-rate">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.paymentSuccessRate}%</h3>
            <p>Payment Success Rate</p>
            <span className="stat-trend">98% average</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn primary" onClick={() => setActiveSection('courses')}>
            <span className="action-icon">📚</span>
            <span>Manage Courses</span>
          </button>
          <button className="action-btn secondary" onClick={() => setActiveSection('students')}>
            <span className="action-icon">👥</span>
            <span>View Students</span>
          </button>
          <button className="action-btn success" onClick={() => setActiveSection('payments')}>
            <span className="action-icon">💳</span>
            <span>Payment History</span>
          </button>
          <button className="action-btn warning" onClick={() => setActiveSection('course')}>
            <span className="action-icon">🎬</span>
            <span>Course Content</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewSection;