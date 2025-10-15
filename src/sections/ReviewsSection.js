import React from 'react';

const ReviewsSection = ({
  reviews,
  fetchReviews,
  forceSyncReviews,
  addNotification,
  approveReview,
  rejectReview,
  deleteReview,
  searchReviewTerm,
  setSearchReviewTerm,
  reviewFilter,
  setReviewFilter
}) => {
  const reviewStats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
      : 0
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.userName?.toLowerCase().includes(searchReviewTerm.toLowerCase()) ||
      review.courseTitle?.toLowerCase().includes(searchReviewTerm.toLowerCase()) ||
      review.reviewText?.toLowerCase().includes(searchReviewTerm.toLowerCase());
    
    const matchesFilter = 
      reviewFilter === 'all' || 
      review.status === reviewFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="reviews-section">
      <div className="section-header">
        <h2>Student Reviews Management</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchReviews}>
            Refresh Reviews
          </button>
          <button className="btn-primary" onClick={forceSyncReviews}>
            Sync from UserDashboard
          </button>
        </div>
      </div>

      <div className="review-stats-grid">
        <div className="review-stat-card total">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{reviewStats.total}</h3>
            <p>Total Reviews</p>
          </div>
        </div>
        <div className="review-stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{reviewStats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="review-stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{reviewStats.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="review-stat-card rating">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{reviewStats.averageRating}</h3>
            <p>Avg Rating</p>
          </div>
        </div>
      </div>

      <div className="reviews-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search reviews by student, course, or content..."
            value={searchReviewTerm}
            onChange={(e) => setSearchReviewTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <select
          value={reviewFilter}
          onChange={(e) => setReviewFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredReviews.length > 0 ? (
        <div className="reviews-table-container">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map(review => (
                <tr key={review._id}>
                  <td>
                    <div className="student-info">
                      <strong>{review.userName}</strong>
                      <span>{review.studentEmail}</span>
                      {review.verified && <span className="verified-badge">Verified</span>}
                    </div>
                  </td>
                  <td>
                    <div className="course-info">
                      <strong>{review.courseTitle}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="rating-display">
                      <div className="stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <span className="rating-number">{review.rating}/5</span>
                    </div>
                  </td>
                  <td>
                    <div className="review-text">
                      <p>{review.reviewText}</p>
                      {review.helpful > 0 && (
                        <span className="helpful-count">Found helpful by {review.helpful} users</span>
                      )}
                    </div>
                  </td>
                  <td className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-badge status-${review.status}`}>
                      {review.status === 'pending' && 'Pending'}
                      {review.status === 'approved' && 'Approved'}
                      {review.status === 'rejected' && 'Rejected'}
                    </span>
                  </td>
                  <td>
                    <div className="review-actions">
                      {review.status === 'pending' && (
                        <>
                          <button 
                            className="btn-action success"
                            onClick={() => approveReview(review._id)}
                            title="Approve this review"
                          >
                            Approve
                          </button>
                          <button 
                            className="btn-action danger"
                            onClick={() => rejectReview(review._id)}
                            title="Reject this review"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        className="btn-action danger"
                        onClick={() => deleteReview(review._id)}
                        title="Delete this review"
                      >
                        Delete
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
          <div className="empty-icon">💬</div>
          <h3>No Reviews Found</h3>
          <p>No student reviews match your search criteria.</p>
          <div className="empty-state-actions">
            <button className="btn-primary" onClick={forceSyncReviews}>
              Sync from UserDashboard
            </button>
            <button className="btn-secondary" onClick={() => {setSearchReviewTerm(''); setReviewFilter('all');}}>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="sync-info">
        <p>
          Manual Approval Required: All reviews from UserDashboard require manual approval. 
          Use the approve/reject actions to manage reviews.
        </p>
      </div>
    </div>
  );
};

export default ReviewsSection;