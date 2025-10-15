import React, { useState } from 'react';
import './VideoForm.css';

const VideoForm = ({
  editingItem,
  videoForm,
  setVideoForm,
  onSubmit,
  onClose,
  courses,
  operationLoading,
  addNotification
}) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleVideoFileUpload = (file) => {
    if (!file) return;
    
    setVideoFile(file);
    
    // Set video URL after "upload"
    setVideoForm(prev => ({
      ...prev,
      videoUrl: URL.createObjectURL(file)
    }));
    addNotification('Video file uploaded successfully', 'success');
  };

  const handleThumbnailUpload = (file) => {
    if (!file) return;
    
    setThumbnailFile(file);
    
    // Set thumbnail URL
    setVideoForm(prev => ({
      ...prev,
      thumbnail: URL.createObjectURL(file)
    }));
    addNotification('Thumbnail uploaded successfully', 'success');
  };

  const handleInputChange = (field, value) => {
    setVideoForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setVideoForm({
      title: '',
      description: '',
      duration: '',
      course: '',
      module: '',
      order: 0,
      videoUrl: '',
      thumbnail: ''
    });
    setVideoFile(null);
    setThumbnailFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
    if (!editingItem) {
      resetForm();
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal active large">
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Video' : 'Upload Video Lecture'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <form onSubmit={handleSubmit} className="video-form">
            <div className="form-section">
              <h4>Basic Information</h4>
              <div className="form-group">
                <label className="form-label">Video Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={videoForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={videoForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter video description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    value={videoForm.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="e.g., 45:30"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Course *</label>
                  <select
                    className="form-select"
                    value={videoForm.course}
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Module</label>
                  <input
                    type="text"
                    className="form-input"
                    value={videoForm.module}
                    onChange={(e) => handleInputChange('module', e.target.value)}
                    placeholder="e.g., Module 1: Fundamentals"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={videoForm.order}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Media Files</h4>
              
              <div className="form-group">
                <label className="form-label">Video File *</label>
                <div className="file-upload-section">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleVideoFileUpload(e.target.files[0])}
                    className="file-input"
                    id="videoFileUpload"
                  />
                  <label htmlFor="videoFileUpload" className="file-upload-btn">
                    <span className="upload-icon">📹</span>
                    Choose Video File
                  </label>
                  {videoFile && (
                    <div className="file-preview">
                      <div className="file-info">
                        <span className="file-name">{videoFile.name}</span>
                        <span className="file-size">
                          ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => {
                          setVideoFile(null);
                          handleInputChange('videoUrl', '');
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <div className="form-help">
                  Supported formats: MP4, WebM, MOV. Max size: 500MB
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Thumbnail Image</label>
                <div className="file-upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleThumbnailUpload(e.target.files[0])}
                    className="file-input"
                    id="thumbnailUpload"
                  />
                  <label htmlFor="thumbnailUpload" className="file-upload-btn">
                    <span className="upload-icon">🖼️</span>
                    Choose Thumbnail
                  </label>
                  {thumbnailFile && (
                    <div className="file-preview">
                      <img 
                        src={URL.createObjectURL(thumbnailFile)} 
                        alt="Thumbnail preview" 
                        className="image-preview" 
                      />
                      <div className="file-info">
                        <span className="file-name">{thumbnailFile.name}</span>
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => {
                            setThumbnailFile(null);
                            handleInputChange('thumbnail', '');
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="form-help">
                  Recommended size: 1280x720 pixels. Formats: JPG, PNG, WebP
                </div>
              </div>

              {videoForm.thumbnail && !thumbnailFile && (
                <div className="current-thumbnail">
                  <label className="form-label">Current Thumbnail</label>
                  <img 
                    src={videoForm.thumbnail} 
                    alt="Current thumbnail" 
                    className="image-preview" 
                  />
                </div>
              )}
            </div>

            <div className="form-section">
              <h4>Preview</h4>
              <div className="video-preview">
                {videoForm.thumbnail ? (
                  <div className="preview-card">
                    <img src={videoForm.thumbnail} alt="Video preview" className="preview-thumbnail" />
                    <div className="preview-info">
                      <h5>{videoForm.title || 'Untitled Video'}</h5>
                      <p>{videoForm.description || 'No description'}</p>
                      <div className="preview-meta">
                        <span>{videoForm.duration || '00:00'}</span>
                        <span>•</span>
                        <span>{courses.find(c => c._id === videoForm.course)?.title || 'No course selected'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="preview-placeholder">
                    <div className="placeholder-icon">🎬</div>
                    <p>Video preview will appear here</p>
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
                disabled={operationLoading || !videoForm.title || !videoForm.course}
              >
                {operationLoading ? (
                  <>
                    <span className="loading-spinner-small"></span>
                    {editingItem ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  editingItem ? 'Update Video' : 'Upload Video'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VideoForm;