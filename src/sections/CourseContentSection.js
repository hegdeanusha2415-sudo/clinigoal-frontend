import React from 'react';

const CourseContentSection = ({
  activeCourseSection,
  setActiveCourseSection,
  videos,
  notes,
  quizzes,
  courses,
  setEditingItem,
  setShowVideoForm,
  setShowNoteForm,
  setShowQuizForm,
  editVideo,
  deleteVideo,
  editNote,
  deleteNote,
  editQuiz,
  deleteQuiz
}) => {
  return (
    <div className="course-content-section">
      <div className="section-header">
        <h2>Course Content Management</h2>
        <div className="content-type-buttons">
          <button 
            className={`content-type-btn ${activeCourseSection === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveCourseSection('videos')}
          >
            Videos ({videos.length})
          </button>
          <button 
            className={`content-type-btn ${activeCourseSection === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveCourseSection('notes')}
          >
            Notes ({notes.length})
          </button>
          <button 
            className={`content-type-btn ${activeCourseSection === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveCourseSection('quizzes')}
          >
            Quizzes ({quizzes.length})
          </button>
        </div>
      </div>

      {activeCourseSection === 'videos' && (
        <div className="content-section">
          <div className="content-header">
            <h3>Video Management ({videos.length})</h3>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingItem(null);
                setShowVideoForm(true);
              }}
            >
              Upload Video
            </button>
          </div>

          {videos.length > 0 ? (
            <div className="content-grid">
              {videos.map(video => (
                <div key={video._id} className="content-card">
                  <div className="content-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                  </div>
                  <div className="content-info">
                    <h4>{video.title}</h4>
                    <p>{video.description}</p>
                    <div className="content-meta">
                      <span>Duration: {video.duration}</span>
                      <span>Course: {courses.find(c => c._id === video.course)?.title || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button className="btn-action secondary" onClick={() => editVideo(video)}>
                      Edit
                    </button>
                    <button className="btn-action danger" onClick={() => deleteVideo(video._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <h3>No Videos Found</h3>
              <p>Start by uploading video lectures to your courses.</p>
            </div>
          )}
        </div>
      )}

      {activeCourseSection === 'notes' && (
        <div className="content-section">
          <div className="content-header">
            <h3>Notes Management ({notes.length})</h3>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingItem(null);
                setShowNoteForm(true);
              }}
            >
              Upload Note
            </button>
          </div>

          {notes.length > 0 ? (
            <div className="content-grid">
              {notes.map(note => (
                <div key={note._id} className="content-card">
                  <div className="content-icon">
                    {note.fileType === 'pdf' ? '📄' : '📝'}
                  </div>
                  <div className="content-info">
                    <h4>{note.title}</h4>
                    <p>{note.description}</p>
                    <div className="content-meta">
                      <span>Type: {note.fileType.toUpperCase()}</span>
                      <span>Course: {courses.find(c => c._id === note.course)?.title || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button className="btn-action secondary" onClick={() => editNote(note)}>
                      Edit
                    </button>
                    <button className="btn-action danger" onClick={() => deleteNote(note._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No Notes Found</h3>
              <p>Start by uploading study notes to your courses.</p>
            </div>
          )}
        </div>
      )}

      {activeCourseSection === 'quizzes' && (
        <div className="content-section">
          <div className="content-header">
            <h3>Quiz Management ({quizzes.length})</h3>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingItem(null);
                setShowQuizForm(true);
              }}
            >
              Create Quiz
            </button>
          </div>

          {quizzes.length > 0 ? (
            <div className="content-grid">
              {quizzes.map(quiz => (
                <div key={quiz._id} className="content-card">
                  <div className="content-icon">❓</div>
                  <div className="content-info">
                    <h4>{quiz.title}</h4>
                    <p>{quiz.description}</p>
                    <div className="content-meta">
                      <span>Questions: {quiz.questions?.length || 0}</span>
                      <span>Time: {quiz.timeLimit} min</span>
                      <span>Course: {courses.find(c => c._id === quiz.course)?.title || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button className="btn-action secondary" onClick={() => editQuiz(quiz)}>
                      Edit
                    </button>
                    <button className="btn-action danger" onClick={() => deleteQuiz(quiz._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">❓</div>
              <h3>No Quizzes Found</h3>
              <p>Start by creating quizzes for your courses.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseContentSection;