import React from 'react';
import ChartContainer from '../components/charts/ChartContainer';
import BarChart from '../components/charts/BarChart';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import DonutChart from '../components/charts/DonutChart';

const AnalyticsSection = ({
  stats,
  reviews,
  payments,
  analyticsData,
  generateAnalyticsData,
  formatPaymentTime
}) => {
  return (
    <div className="analytics-section">
      <div className="section-header">
        <h2>Platform Analytics & Insights</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={generateAnalyticsData}>
            Refresh Analytics
          </button>
          <button className="btn-primary" onClick={() => window.print()}>
            Export Report
          </button>
        </div>
      </div>

      <div className="analytics-overview">
        <div className="metric-card primary">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>{stats.totalRevenue}</h3>
            <p>Total Revenue</p>
            <span className="metric-trend positive">+12% this month</span>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
            <span className="metric-trend positive">+8% growth</span>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <h3>{stats.totalCourses}</h3>
            <p>Active Courses</p>
            <span className="metric-trend positive">+2 new</span>
          </div>
        </div>
        
        <div className="metric-card info">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</h3>
            <p>Avg Rating</p>
            <span className="metric-trend positive">Excellent</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <ChartContainer title="Revenue Trend (Last 6 Months)" className="large">
          <LineChart 
            data={analyticsData.revenueTrend.map(item => item.revenue)}
            labels={analyticsData.revenueTrend.map(item => item.month)}
            color="#3498db"
            height={250}
          />
        </ChartContainer>

        <ChartContainer title="Student Growth">
          <BarChart 
            data={analyticsData.studentGrowth.map(item => item.students)}
            labels={analyticsData.studentGrowth.map(item => item.month)}
            colors={['#2ecc71', '#27ae60', '#229954', '#1e8449', '#196f3d', '#145a32']}
            height={200}
          />
        </ChartContainer>

        <ChartContainer title="Course Performance">
          <BarChart 
            data={analyticsData.coursePerformance.map(item => item.students)}
            labels={analyticsData.coursePerformance.map(item => 
              item.name.split(' ').map(word => word[0]).join('').toUpperCase()
            )}
            colors={['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#1abc9c']}
            height={200}
          />
        </ChartContainer>

        <ChartContainer title="Enrollment by Category">
          <PieChart 
            data={analyticsData.enrollmentStats.map(item => item.count)}
            labels={analyticsData.enrollmentStats.map(item => item.category)}
            colors={analyticsData.enrollmentStats.map(item => item.color)}
            height={200}
          />
        </ChartContainer>

        <ChartContainer title="Platform Performance" className="full-width">
          <div className="metrics-grid">
            <DonutChart 
              value={analyticsData.platformMetrics.completionRate || 75}
              max={100}
              label="Completion"
              color="#3498db"
            />
            <DonutChart 
              value={analyticsData.platformMetrics.engagementScore || 85}
              max={100}
              label="Engagement"
              color="#2ecc71"
            />
            <DonutChart 
              value={analyticsData.platformMetrics.satisfactionRate || 90}
              max={100}
              label="Satisfaction"
              color="#f39c12"
            />
            <DonutChart 
              value={analyticsData.platformMetrics.retentionRate || 80}
              max={100}
              label="Retention"
              color="#9b59b6"
            />
          </div>
        </ChartContainer>

        <ChartContainer title="Recent Platform Activity" className="full-width">
          <div className="activity-list">
            {payments.slice(0, 5).map(payment => (
              <div key={payment._id} className="activity-item">
                <div className="activity-icon">💰</div>
                <div className="activity-content">
                  <p><strong>{payment.studentName}</strong> enrolled in <strong>{payment.courseTitle}</strong></p>
                  <span className="activity-time">
                    {formatPaymentTime(payment.timestamp)} • {payment.amount}
                  </span>
                </div>
              </div>
            ))}
            {reviews.slice(0, 3).map(review => (
              <div key={review._id} className="activity-item">
                <div className="activity-icon">⭐</div>
                <div className="activity-content">
                  <p><strong>{review.userName}</strong> rated <strong>{review.courseTitle}</strong> {review.rating}/5</p>
                  <span className="activity-time">
                    {formatPaymentTime(review.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>
    </div>
  );
};

export default AnalyticsSection;