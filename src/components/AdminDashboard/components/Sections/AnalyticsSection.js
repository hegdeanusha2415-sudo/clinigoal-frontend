import React from 'react';

const AnalyticsSection = ({ stats, calculateStats }) => {
  return (
    <div className="analytics-section">
      <div className="section-header">
        <h2>Platform Analytics</h2>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => calculateStats()}>
            Refresh Analytics
          </button>
          <button className="btn-secondary">
            Export Report
          </button>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="analytics-card full-width">
          <h3>Key Performance Indicators</h3>
          <div className="kpi-grid">
            <div className="kpi-item">
              <div className="kpi-value">{stats.totalRevenue}</div>
              <div className="kpi-label">Total Revenue</div>
              <div className="kpi-trend positive">+12%</div>
            </div>
            <div className="kpi-item">
              <div className="kpi-value">{stats.totalStudents}</div>
              <div className="kpi-label">Total Students</div>
              <div className="kpi-trend positive">+8%</div>
            </div>
            <div className="kpi-item">
              <div className="kpi-value">{stats.totalCourses}</div>
              <div className="kpi-label">Active Courses</div>
              <div className="kpi-trend positive">+3%</div>
            </div>
            <div className="kpi-item">
              <div className="kpi-value">{stats.paymentSuccessRate}%</div>
              <div className="kpi-label">Success Rate</div>
              <div className="kpi-trend positive">+2%</div>
            </div>
          </div>
        </div>

        {/* Course Performance */}
        <div className="analytics-card full-width">
          <h3>Course Performance</h3>
          <div className="performance-table">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Enrollment</th>
                  <th>Revenue</th>
                  <th>Completion Rate</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stats.coursePerformance.map(course => (
                  <tr key={course.id}>
                    <td className="course-name">{course.title}</td>
                    <td>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${(course.enrollment / Math.max(stats.totalStudents, 1)) * 100}%` }}
                        ></div>
                        <span>{course.enrollment}</span>
                      </div>
                    </td>
                    <td className="revenue">₹{course.revenue.toLocaleString('en-IN')}</td>
                    <td>
                      <div className="completion-rate">
                        {course.completionRate}%
                      </div>
                    </td>
                    <td>
                      <div className="rating">
                        ⭐ {course.rating}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="analytics-card">
          <h3>Revenue Trend (6 Months)</h3>
          <div className="revenue-chart">
            {stats.revenueTrend.map((month, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar-fill"
                  style={{ height: `${(month.revenue / Math.max(...stats.revenueTrend.map(m => m.revenue), 1)) * 100}%` }}
                ></div>
                <div className="bar-label">
                  <div className="month">{month.month}</div>
                  <div className="amount">₹{month.revenue.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Growth */}
        <div className="analytics-card">
          <h3>Student Growth</h3>
          <div className="growth-chart">
            {stats.studentGrowth.map((month, index) => (
              <div key={index} className="growth-item">
                <div className="growth-bar">
                  <div 
                    className="growth-fill"
                    style={{ height: `${(month.students / Math.max(...stats.studentGrowth.map(m => m.students), 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="growth-label">
                  <div>{month.month}</div>
                  <div>{month.students}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;