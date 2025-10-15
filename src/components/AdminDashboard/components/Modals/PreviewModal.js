import React from 'react';

const PreviewModal = ({ previewItem, courses, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>Preview {previewItem.type}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="preview-content">
          {previewItem.type === 'video' && (
            <>
              <div className="preview-thumbnail">
                <img 
                  src={previewItem.data.thumbnail || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                  alt={previewItem.data.title}
                />
              </div>
              <h4>{previewItem.data.title}</h4>
              <p>{previewItem.data.description}</p>
              <div className="preview-meta">
                <span><strong>Duration:</strong> {Math.floor(previewItem.data.duration / 60)}:{(previewItem.data.duration % 60).toString().padStart(2, '0')}</span>
                <span><strong>Course:</strong> {courses.find(c => c._id === previewItem.data.course)?.title || previewItem.data.course}</span>
                <span><strong>Module:</strong> {previewItem.data.module}</span>
                <span><strong>File:</strong> {previewItem.data.fileName} ({previewItem.data.fileSize} MB)</span>
              </div>
            </>
          )}
          
          {previewItem.type === 'note' && (
            <>
              <div className="preview-icon large">
                {previewItem.data.fileType === 'pdf' ? '📄' : '📝'}
              </div>
              <h4>{previewItem.data.title}</h4>
              <p>{previewItem.data.description}</p>
              <div className="preview-meta">
                <span><strong>File Type:</strong> {previewItem.data.fileType?.toUpperCase()}</span>
                <span><strong>Pages:</strong> {previewItem.data.pages || 'N/A'}</span>
                <span><strong>Course:</strong> {courses.find(c => c._id === previewItem.data.course)?.title || previewItem.data.course}</span>
                <span><strong>File:</strong> {previewItem.data.fileName} ({previewItem.data.fileSize} KB)</span>
              </div>
            </>
          )}
          
          {previewItem.type === 'quiz' && (
            <>
              <div className="preview-icon large">
                ❓
              </div>
              <h4>{previewItem.data.title}</h4>
              <p>{previewItem.data.description}</p>
              <div className="preview-meta">
                <span><strong>Questions:</strong> {previewItem.data.questions?.length || 0}</span>
                <span><strong>Time Limit:</strong> {previewItem.data.timeLimit} minutes</span>
                <span><strong>Passing Score:</strong> {previewItem.data.passingScore}%</span>
                <span><strong>Course:</strong> {courses.find(c => c._id === previewItem.data.course)?.title || previewItem.data.course}</span>
              </div>
              
              <div className="preview-questions">
                <h5>Questions Preview:</h5>
                {previewItem.data.questions?.slice(0, 3).map((question, index) => (
                  <div key={index} className="preview-question">
                    <p><strong>Q{index + 1}:</strong> {question.questionText}</p>
                    <div className="preview-options">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={`preview-option ${option.isCorrect ? 'correct' : ''}`}>
                          {option.optionText} {option.isCorrect && '✓'}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {previewItem.data.questions?.length > 3 && (
                  <p>... and {previewItem.data.questions.length - 3} more questions</p>
                )}
              </div>
            </>
          )}
        </div>
        <div className="preview-actions">
          <button className="btn-primary" onClick={onClose}>
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;