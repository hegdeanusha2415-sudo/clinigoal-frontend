import React, { useState } from 'react';
import './NoteForm.css';

const NoteForm = ({
  editingItem,
  noteForm,
  setNoteForm,
  onSubmit,
  onClose,
  courses,
  operationLoading,
  addNotification
}) => {
  const [noteFile, setNoteFile] = useState(null);

  const handleNoteFileUpload = (file) => {
    if (!file) return;
    
    setNoteFile(file);
    
    // Set file URL after "upload"
    const fileExtension = file.name.split('.').pop();
    setNoteForm(prev => ({
      ...prev,
      fileUrl: URL.createObjectURL(file),
      fileType: fileExtension || 'pdf'
    }));
    addNotification('Document uploaded successfully', 'success');
  };

  const handleInputChange = (field, value) => {
    setNoteForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setNoteForm({
      title: '',
      description: '',
      fileType: 'pdf',
      pages: '',
      course: '',
      fileUrl: ''
    });
    setNoteFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    if (!editingItem) {
      resetForm();
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'doc': case 'docx': return '📝';
      case 'txt': return '📃';
      case 'ppt': case 'pptx': return '📊';
      default: return '📎';
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal active medium">
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Document' : 'Upload Document'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="note-form">
            <div className="form-section">
              <h4>Document Information</h4>
              
              <div className="form-group">
                <label className="form-label">Document Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={noteForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter document title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={noteForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter document description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Course *</label>
                  <select
                    className="form-select"
                    value={noteForm.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Pages</label>
                  <input
                    type="number"
                    className="form-input"
                    value={noteForm.pages}
                    onChange={(e) => handleInputChange('pages', e.target.value)}
                    placeholder="Number of pages"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Document Type</label>
                <div className="file-type-selector">
                  {['pdf', 'docx', 'txt', 'ppt'].map(type => (
                    <label key={type} className="file-type-option">
                      <input
                        type="radio"
                        name="fileType"
                        value={type}
                        checked={noteForm.fileType === type}
                        onChange={(e) => handleInputChange('fileType', e.target.value)}
                      />
                      <span className="file-type-icon">{getFileIcon(type)}</span>
                      <span className="file-type-label">{type.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Document File</h4>
              
              <div className="form-group">
                <label className="form-label">Upload Document *</label>
                <div className="file-upload-section">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                    onChange={(e) => handleNoteFileUpload(e.target.files[0])}
                    className="file-input"
                    id="noteFileUpload"
                  />
                  <label htmlFor="noteFileUpload" className="file-upload-btn large">
                    <span className="upload-icon">📤</span>
                    <div className="upload-text">
                      <div className="upload-title">Choose Document File</div>
                      <div className="upload-subtitle">PDF, DOC, DOCX, TXT, PPT</div>
                    </div>
                  </label>
                  
                  {noteFile && (
                    <div className="file-preview detailed">
                      <div className="file-icon">{getFileIcon(noteForm.fileType)}</div>
                      <div className="file-info">
                        <div className="file-name">{noteFile.name}</div>
                        <div className="file-details">
                          <span className="file-size">
                            {(noteFile.size / 1024).toFixed(2)} KB
                          </span>
                          <span className="file-type">
                            {noteForm.fileType.toUpperCase()}
                          </span>
                          {noteForm.pages && (
                            <span className="file-pages">
                              {noteForm.pages} pages
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => {
                          setNoteFile(null);
                          handleInputChange('fileUrl', '');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-help">
                  Maximum file size: 50MB. Supported formats: PDF, DOC, DOCX, TXT, PPT, PPTX
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Document Preview</h4>
              <div className="document-preview">
                {noteForm.title || noteForm.description ? (
                  <div className="preview-card">
                    <div className="preview-icon">{getFileIcon(noteForm.fileType)}</div>
                    <div className="preview-content">
                      <h5>{noteForm.title || 'Untitled Document'}</h5>
                      <p>{noteForm.description || 'No description provided'}</p>
                      <div className="preview-meta">
                        <span className="file-type-badge">{noteForm.fileType.toUpperCase()}</span>
                        {noteForm.pages && <span>{noteForm.pages} pages</span>}
                        <span>{courses.find(c => c._id === noteForm.course)?.title || 'No course'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="preview-placeholder">
                    <div className="placeholder-icon">📄</div>
                    <p>Document preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                disabled={operationLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={operationLoading || !noteForm.title || !noteForm.course}
              >
                {operationLoading ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    {editingItem ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  editingItem ? 'Update Document' : 'Upload Document'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NoteForm;