import React from 'react';
import ProgressBar from '../common/ProgressBar';

const CourseContentSection = ({
  selectedCourse,
  courseContent,
  watchedVideos,
  completedNotes,
  completedQuizzes,
  calculateCourseCompletion,
  isCourseCompleted,
  handleWatchVideo,
  handleCompleteNote,
  startQuiz,
  generateCertificate,
  isGeneratingCertificate,
  certificateColor,
  setCertificateColor,
  setActiveSection,
  fetchCourseContent,
  isCoursePaid
}) => {
  const completionPercentage = calculateCourseCompletion(selectedCourse?._id);
  const isCompleted = isCourseCompleted(selectedCourse?._id);

  return (
    <div className="course-content-page">
      <div className="content-header">
        <button 
          className="back-btn"
          onClick={() => setActiveSection('my-courses')}
        >
          ← Back to My Courses
        </button>
        <div className="course-info">
          <h1>{selectedCourse?.courseTitle || selectedCourse?.title}</h1>
          <div className="completion-status">
            <span className={`status-badge ${isCompleted ? 'completed' : 'in-progress'}`}>
              {isCompleted ? '🎉 Completed' : `📚 ${completionPercentage}% Complete`}
            </span>
          </div>
        </div>
        <div className="progress-section">
          <ProgressBar progress={completionPercentage} />
          <span className="progress-label">{completionPercentage}% Complete</span>
        </div>
      </div>

      {/* Certificate Section - Only show if course is completed */}
      {isCompleted && (
        <div className="certificate-section">
          <div className="certificate-card premium">
            <div className="certificate-icon">🏆</div>
            <div className="certificate-info">
              <h3>Course Completed!</h3>
              <p>Congratulations! You've successfully completed all requirements for this course.</p>
              <p>Generate your certificate to showcase your achievement.</p>
            </div>
            <div className="certificate-color-picker">
              <label>Choose Certificate Color:</label>
              <div className="color-options">
                {Object.keys(certificateColors).map(color => (
                  <button
                    key={color}
                    className={`color-option ${certificateColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: certificateColors[color].primary }}
                    onClick={() => setCertificateColor(color)}
                    title={color.charAt(0).toUpperCase() + color.slice(1)}
                  />
                ))}
              </div>
            </div>
            <button 
              onClick={() => generateCertificate(selectedCourse)}
              disabled={isGeneratingCertificate}
              className="btn-primary certificate-btn"
            >
              {isGeneratingCertificate ? (
                <>
                  <div className="spinner-small"></div>
                  Generating...
                </>
              ) : (
                '🎓 Generate Certificate'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Rest of course content (videos, notes, quizzes) */}
      {/* ... */}
    </div>
  );
};

// Certificate colors for the component
const certificateColors = {
  blue: { primary: '#3498db' },
  green: { primary: '#27ae60' },
  purple: { primary: '#9b59b6' },
  gold: { primary: '#f39c12' },
  red: { primary: '#e74c3c' }
};

export default CourseContentSection;