import React from 'react';
import { formatDate, renderPaymentStatus } from '../../utils/helpers';

const PaymentsSection = ({ payments, fetchPayments, addNotification }) => {
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
    <div className="payments-section">
      <div className="section-header">
        <h2>Payment Management</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchPayments}>
            Refresh Payments
          </button>
          <button className="btn-primary" onClick={handleAddDemoData}>
            Add Demo Data
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
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
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
                  <td className="payment-method">
                    <span className={`method ${payment.paymentMethod}`}>
                      {payment.paymentMethod === 'razorpay' ? '💳 Razorpay' : payment.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💳</div>
          <h3>No Payment Records</h3>
          <p>When students enroll in courses, their payment information will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentsSection;