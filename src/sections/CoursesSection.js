import React from 'react';

const CoursesSection = ({ 
  courses, 
  setActiveSection, 
  setFilterCourse, 
  setEditingCourse, 
  setShowCourseForm,
  editCourse,
  deleteCourse 
}) => {
  return (
    <div className="courses-section">
      <div className="section-header">
        <h2>Course Management</h2>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingCourse(null);
              setShowCourseForm(true);
            }}
          >
            Add Course
          </button>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="courses-grid admin">
          {courses.map(course => (
            <div key={course._id} className="course-card admin">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="course-overlay">
                  <span className="course-level">{course.level}</span>
                  <span className="course-price">{course.price}</span>
                </div>
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="instructor">By {course.instructor}</p>
                <p className="description">{course.description}</p>
                
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-icon">👥</span>
                    <span>{course.students || 0} students</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">⭐</span>
                    <span>{course.rating || '4.5'}/5</span>
                  </div>
                </div>
                
                <div className="course-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => editCourse(course)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setActiveSection('course');
                      setFilterCourse(course._id);
                    }}
                  >
                    Manage Content
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => deleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Courses Available</h3>
          <p>Add courses to start your clinical education program.</p>
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingCourse(null);
              setShowCourseForm(true);
            }}
          >
            Add Your First Course
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursesSection;