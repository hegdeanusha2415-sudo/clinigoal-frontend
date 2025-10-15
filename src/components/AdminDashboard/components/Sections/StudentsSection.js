import React from 'react';
import { formatDate } from '../../utils/helpers';

const StudentsSection = ({ students }) => {
  return (
    <div className="students-section">
      <div className="section-header">
        <h2>Student Management</h2>
        <div className="header-actions">
          <button className="btn-primary">
            + Add Student
          </button>
        </div>
      </div>

      {students.length > 0 ? (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Enrolled Courses</th>
                <th>Join Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>
                    <div className="student-info-table">
                      <div className="student-avatar small">
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <strong>{student.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>
                    <div className="enrolled-courses-list">
                      {student.enrolledCourses?.slice(0, 2).map(course => (
                        <span key={course.id} className="course-tag">{course.title}</span>
                      ))}
                      {student.enrolledCourses?.length > 2 && (
                        <span className="more-courses">+{student.enrolledCourses.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td>{formatDate(student.joinDate)}</td>
                  <td>
                    <span className="status-badge status-completed">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No Students Found</h3>
          <p>Student information will appear here when they enroll in courses.</p>
        </div>
      )}
    </div>
  );
};

export default StudentsSection;