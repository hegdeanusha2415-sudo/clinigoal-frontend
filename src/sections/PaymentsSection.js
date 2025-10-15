import React from 'react';

const PaymentsSection = ({ 
  payments, 
  courses, 
  fetchPayments, 
  formatPaymentTime, 
  getDetailedTimeInfo, 
  getPaymentDayInfo,
  setPayments,
  addNotification 
}) => {
  return (
    <div className="payments-section">
      <div className="section-header">
        <h2>Payment Management</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchPayments}>
            Refresh Payments
          </button>
          <div className="payment-stats">
            <span className="stat-badge">Total: {payments.length}</span>
            <span className="stat-badge success">
              Completed: {payments.filter(p => p.status === 'completed').length}
            </span>
            <span className="stat-badge warning">
              Pending: {payments.filter(p => p.status !== 'completed').length}
            </span>
          </div>
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
                <th>Payment Time</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 20).map(payment => (
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
                      <span className="course-duration">
                        {courses.find(c => c._id === payment.courseId)?.duration || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="amount">
                    <strong>{payment.amount}</strong>
                    <span className="payment-method">
                      {payment.paymentMethod ? `via ${payment.paymentMethod}` : 'Online Payment'}
                    </span>
                  </td>
                  <td className="payment-time">
                    <div className="time-display" title={getDetailedTimeInfo(payment.timestamp)}>
                      <div className="time-relative">
                        {formatPaymentTime(payment.timestamp)}
                      </div>
                      <div className="time-full">
                        {getPaymentDayInfo(payment.timestamp)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${payment.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                      {payment.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="payment-actions">
                      <button 
                        className="btn-action info"
                        title={getDetailedTimeInfo(payment.timestamp)}
                      >
                        Time Details
                      </button>
                      <button 
                        className="btn-action secondary"
                        onClick={() => {
                          console.log('Payment details:', payment);
                          addNotification(`Viewing details for ${payment.transactionId}`, 'info');
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="payment-summary">
            <div className="summary-card">
              <h4>Recent Activity</h4>
              <div className="activity-list">
                {payments.slice(0, 5).map(payment => (
                  <div key={payment._id} className="activity-item">
                    <div className="activity-icon">
                      {payment.status === 'completed' ? '✅' : '⏳'}
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{payment.studentName}</strong> paid <strong>{payment.amount}</strong>
                      </p>
                      <span className="activity-time">
                        {formatPaymentTime(payment.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="summary-card">
              <h4>Payment Statistics</h4>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Last Payment:</span>
                  <span className="stat-value">
                    {payments.length > 0 ? formatPaymentTime(payments[0].timestamp) : 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Today's Revenue:</span>
                  <span className="stat-value">
                    ₹{payments
                      .filter(p => {
                        const paymentDate = new Date(p.timestamp);
                        const today = new Date();
                        return paymentDate.toDateString() === today.toDateString();
                      })
                      .reduce((sum, p) => sum + (parseFloat(p.amount.replace(/[^0-9.-]+/g, '')) || 0), 0)
                      .toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">This Week:</span>
                  <span className="stat-value">
                    {payments.filter(p => {
                      const paymentDate = new Date(p.timestamp);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return paymentDate >= weekAgo;
                    }).length} payments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💳</div>
          <h3>No Payment Records</h3>
          <p>When students enroll in courses, their payment information will appear here.</p>
          <div className="empty-state-actions">
            <button className="btn-primary" onClick={fetchPayments}>
              Check for Payments
            </button>
            <button className="btn-secondary" onClick={() => {
              const samplePayment = {
                _id: `pay_${Date.now()}`,
                transactionId: `TXN${Date.now()}`,
                studentName: 'Demo Student',
                studentEmail: 'demo@example.com',
                courseTitle: 'Clinical Research Associate',
                courseId: '1',
                amount: '₹1,29,999',
                status: 'completed',
                timestamp: new Date().toISOString(),
                paymentMethod: 'Credit Card'
              };
              setPayments([samplePayment]);
              addNotification('Sample payment added for demonstration', 'info');
            }}>
              Add Sample Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsSection;