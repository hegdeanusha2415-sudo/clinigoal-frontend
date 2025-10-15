import React from 'react';

const CourseApprovalsSection = ({
  courseApprovals,
  courses,
  fetchCourseApprovals,
  syncPaidEnrollments,
  syncAllUserDashboardPayments,
  addNotification,
  updateApprovalStatus,
  bulkUpdateApprovals,
  searchApprovalTerm,
  setSearchApprovalTerm,
  approvalFilter,
  setApprovalFilter
}) => {
  const getApprovalStats = () => {
    const total = courseApprovals.length;
    const pending = courseApprovals.filter(a => a.status === 'pending').length;
    const approved = courseApprovals.filter(a => a.status === 'approved').length;
    const rejected = courseApprovals.filter(a => a.status === 'rejected').length;
    const completed = courseApprovals.filter(a => a.completed).length;
    const paid = courseApprovals.filter(a => a.isPaid).length;

    return { total, pending, approved, rejected, completed, paid };
  };

  const filteredApprovals = courseApprovals.filter(approval => {
    const matchesSearch = 
      approval.userName?.toLowerCase().includes(searchApprovalTerm.toLowerCase()) ||
      approval.courseTitle?.toLowerCase().includes(searchApprovalTerm.toLowerCase()) ||
      approval.userEmail?.toLowerCase().includes(searchApprovalTerm.toLowerCase());
    
    const matchesFilter = 
      approvalFilter === 'all' || 
      approval.status === approvalFilter;
    
    return matchesSearch && matchesFilter;
  });

  const approvalStats = getApprovalStats();

  return (
    <div className="course-approvals-section">
      <div className="section-header">
        <h2>Course Enrollment Approvals</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchCourseApprovals}>
            Refresh Approvals
          </button>
          <button className="btn-primary" onClick={syncPaidEnrollments}>
            Sync Paid Enrollments
          </button>
          <button className="btn-success" onClick={() => {
            const { payments, approvals } = syncAllUserDashboardPayments();
            addNotification(`Found ${payments.length} payments and ${approvals.length} approvals`, 'info');
            fetchCourseApprovals();
          }}>
            Force Full Sync
          </button>
          <div className="approval-stats">
            <span className="stat-badge">Total: {approvalStats.total}</span>
            <span className="stat-badge warning">Pending: {approvalStats.pending}</span>
            <span className="stat-badge success">Approved: {approvalStats.approved}</span>
            <span className="stat-badge danger">Rejected: {approvalStats.rejected}</span>
            <span className="stat-badge info">Paid: {approvalStats.paid}</span>
          </div>
        </div>
      </div>

      <div className="approval-stats-grid">
        <div className="approval-stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{approvalStats.total}</h3>
            <p>Total Enrollments</p>
          </div>
        </div>
        <div className="approval-stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{approvalStats.pending}</h3>
            <p>Pending Approval</p>
          </div>
        </div>
        <div className="approval-stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{approvalStats.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="approval-stat-card completed">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{approvalStats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="approvals-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by student name, course, or email..."
            value={searchApprovalTerm}
            onChange={(e) => setSearchApprovalTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <select
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Enrollments</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="sync-info">
        <p>
          Manual Approval Required: All enrollments require manual approval, including paid enrollments. 
          Use the approve/reject actions to manage enrollments.
        </p>
      </div>

      {filteredApprovals.length > 0 ? (
        <div className="approvals-table-container">
          <table className="approvals-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Enrollment Date</th>
                <th>Progress</th>
                <th>Payment Status</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApprovals.map(approval => (
                <tr key={approval._id} className={approval.isPaid ? 'paid-enrollment' : ''}>
                  <td>
                    <div className="student-info">
                      <strong>{approval.userName}</strong>
                      <span>{approval.userEmail}</span>
                      {approval.isPaid && (
                        <span className="paid-badge">Paid</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="course-info">
                      <strong>{approval.courseTitle}</strong>
                      <span className="course-duration">
                        {courses.find(c => c._id === approval.courseId)?.duration || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="date">
                    {new Date(approval.enrollmentDate).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="progress-display">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${approval.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{approval.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="payment-info">
                      <span className={`payment-status ${approval.paymentStatus}`}>
                        {approval.paymentStatus === 'completed' ? 'Completed' : 'Failed'}
                      </span>
                      {approval.transactionId && (
                        <small>ID: {approval.transactionId}</small>
                      )}
                    </div>
                  </td>
                  <td className="amount">
                    <strong>{approval.amount}</strong>
                    {approval.paymentMethod && (
                      <small>via {approval.paymentMethod}</small>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge status-${approval.status}`}>
                      {approval.status === 'pending' && 'Pending'}
                      {approval.status === 'approved' && 'Approved'}
                      {approval.status === 'rejected' && 'Rejected'}
                    </span>
                  </td>
                  <td>
                    <div className="approval-actions">
                      {approval.status === 'pending' && (
                        <>
                          <button 
                            className="btn-action success"
                            onClick={() => updateApprovalStatus(approval._id, 'approved')}
                            title="Approve this enrollment"
                          >
                            Approve
                          </button>
                          <button 
                            className="btn-action danger"
                            onClick={() => {
                              const reason = prompt('Please provide reason for rejection:');
                              if (reason) {
                                updateApprovalStatus(approval._id, 'rejected', reason);
                              }
                            }}
                            title="Reject this enrollment"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {approval.status === 'approved' && !approval.completed && (
                        <button 
                          className="btn-action warning"
                          onClick={() => updateApprovalStatus(approval._id, 'pending')}
                          title="Move back to pending"
                        >
                          Revoke
                        </button>
                      )}
                      {approval.status === 'rejected' && (
                        <button 
                          className="btn-action info"
                          onClick={() => updateApprovalStatus(approval._id, 'pending')}
                          title="Move back to pending"
                        >
                          Restore
                        </button>
                      )}
                      <button 
                        className="btn-action secondary"
                        onClick={() => {
                          console.log('Student details:', approval);
                          addNotification(`Viewing details for ${approval.userName}`, 'info');
                        }}
                        title="View detailed information"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Course Enrollments Found</h3>
          <p>No student enrollments match your search criteria.</p>
          <div className="empty-state-actions">
            <button className="btn-primary" onClick={fetchCourseApprovals}>
              Refresh Data
            </button>
            <button className="btn-secondary" onClick={() => {setSearchApprovalTerm(''); setApprovalFilter('all');}}>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {filteredApprovals.length > 0 && (
        <div className="bulk-actions">
          <h4>Bulk Actions</h4>
          <div className="bulk-buttons">
            <button 
              className="btn-success"
              onClick={() => {
                const pendingIds = filteredApprovals
                  .filter(a => a.status === 'pending')
                  .map(a => a._id);
                if (pendingIds.length > 0) {
                  bulkUpdateApprovals('approved', pendingIds);
                } else {
                  addNotification('No pending enrollments to approve', 'warning');
                }
              }}
            >
              Approve All Pending
            </button>
            <button 
              className="btn-danger"
              onClick={() => {
                const pendingIds = filteredApprovals
                  .filter(a => a.status === 'pending')
                  .map(a => a._id);
                if (pendingIds.length > 0) {
                  bulkUpdateApprovals('rejected', pendingIds);
                } else {
                  addNotification('No pending enrollments to reject', 'warning');
                }
              }}
            >
              Reject All Pending
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseApprovalsSection;