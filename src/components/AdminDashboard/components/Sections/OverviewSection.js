import React from 'react';
import StatsGrid from '../Common/StatsGrid';
import { formatDate, renderPaymentStatus } from '../../utils/helpers';

const OverviewSection = ({ stats, payments, fetchPayments, setActiveSection, addNotification }) => {
  const handleAddDemoData = () => {
    const demoPayments = [{
      _id: 'pay_demo_1',
      courseId: '1',
      courseTitle: 'Clinical Research Associate',
      studentName: 'Demo Student',
      studentEmail: 'demo@example.com',
      amount: '₹1,29,999',
      paymentMethod: 'razorpay',
      status: 'completed',
      timestamp: new Date().toISOString(),
      transactionId: 'TXN_DEMO_001'
    }];
    localStorage.setItem('adminPayments', JSON.stringify(demoPayments));
    addNotification('Demo payment data added', 'success');
  };

  return (
    <div className="admin-overview">
      <div className="overview-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your clinical education platform</p>
      </div>

      <StatsGrid stats={stats} />

      {/* Quick Actions */}
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
          <button className="action-btn warning" onClick={() => setActiveSection('content')}>
            <span className="action-icon">🎬</span>
            <span>Manage Content</span>
          </button>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="recent-payments">
        <div className="section-header">
          <h2>Recent Payments</h2>
          <div className="header-actions">
            <button className="btn-secondary" onClick={fetchPayments}>
              Refresh
            </button>
            <button className="btn-primary" onClick={() => setActiveSection('payments')}>
              View All
            </button>
          </div>
        </div>

        {payments.length > 0 ? (
          <div className="payments-table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 5).map(payment => (
                  <tr key={payment._id}>
                    <td className="transaction-id">
                      {payment.transactionId || payment._id}
                    </td>
                    <td>
                      <div className="student-info">
                        <strong>{payment.studentName}</strong>
                        <span>{payment.studentEmail}</span>
                      </div>
                    </td>
                    <td>
                      <div className="course-info">
                        <strong>{payment.courseTitle}</strong>
                        <span>ID: {payment.courseId}</span>
                      </div>
                    </td>
                    <td className="amount">
                      <strong>{payment.amount}</strong>
                    </td>
                    <td className="date">
                      {formatDate(payment.timestamp)}
                    </td>
                    <td>
                      {renderPaymentStatus(payment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h3>No Payments Yet</h3>
            <p>Payment records will appear here when students enroll in courses.</p>
            <div className="empty-actions">
              <button className="btn-primary" onClick={handleAddDemoData}>
                Add Demo Data
              </button>
              <button className="btn-secondary" onClick={fetchPayments}>
                Check Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewSection;