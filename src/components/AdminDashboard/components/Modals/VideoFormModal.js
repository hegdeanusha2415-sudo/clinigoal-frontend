import React from 'react';
import { validateVideoForm } from '../../utils/validation';

const VideoFormModal = ({
  editingItem,
  videoForm,
  setVideoForm,
  videoFile,
  setVideoFile,
  thumbnailFile,
  setThumbnailFile,
  courses,
  operationLoading,
  handleAddVideo,
  handleUpdateVideo,
  onClose,
  addNotification
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateVideoForm(videoForm, videoFile, editingItem, addNotification)) return;
    
    const success = editingItem 
      ? await handleUpdateVideo(editingItem._id, videoForm, videoFile, thumbnailFile)
      : await handleAddVideo(videoForm, videoFile, thumbnailFile);
    
    if (success) {
      onClose();
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validVideoTypes = ['video/mp4', 'video/mkv', 'video/avi', 'video/mov', 'video/wmv'];
      if (!validVideoTypes.includes(file.type)) {
        addNotification('Please select a valid video file (MP4, MKV, AVI, MOV, WMV)', 'error');
        return;
      }
      
      if (file.size > 500 * 1024 * 1024) {
        addNotification('Video file size should be less than 500MB', 'error');
        return;
      }
      
      setVideoFile(file);
      addNotification(`Video file selected: ${file.name}`, 'success');
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        addNotification('Please select a valid image file (JPEG, PNG, GIF, WebP)', 'error');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        addNotification('Thumbnail image size should be less than 5MB', 'error');
        return;
      }
      
      setThumbnailFile(file);
      addNotification(`Thumbnail selected: ${file.name}`, 'success');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Video' : 'Upload New Video'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Video Title *</label>
            <input
              type="text"
              value={videoForm.title}
              onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
              required
              className="form-input"
              placeholder="Enter video title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={videoForm.description}
              onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
              className="form-textarea"
              placeholder="Enter video description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes) *</label>
              <input
                type="number"
                value={videoForm.duration}
                onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                required
                className="form-input"
                placeholder="e.g., 120"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Order *</label>
              <input
                type="number"
                value={videoForm.order}
                onChange={(e) => setVideoForm({...videoForm, order: e.target.value})}
                required
                className="form-input"
                placeholder="Display order"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Course *</label>
            <select
              value={videoForm.course}
              onChange={(e) => setVideoForm({...videoForm, course: e.target.value})}
              required
              className="form-select"
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
            <label>Module</label>
            <input
              type="text"
              value={videoForm.module}
              onChange={(e) => setVideoForm({...videoForm, module: e.target.value})}
              className="form-input"
              placeholder="e.g., Module 1: Introduction"
            />
          </div>

          {/* Video File Upload */}
          <div className="form-group">
            <label>Video File * {!editingItem && '(MP4, MKV, AVI, MOV, WMV - Max 500MB)'}</label>
            <input
              type="file"
              onChange={handleVideoFileChange}
              accept="video/mp4,video/mkv,video/avi,video/mov,video/wmv"
              className="form-input"
              required={!editingItem}
            />
            {videoFile && (
              <div className="file-info">
                Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
            {editingItem && !videoFile && (
              <div className="current-file">
                <strong>Current File:</strong> {editingItem.fileName} ({editingItem.fileSize} MB)
              </div>
            )}
          </div>

          {/* Thumbnail File Upload */}
          <div className="form-group">
            <label>Thumbnail Image {!editingItem && '(JPEG, PNG, GIF, WebP - Max 5MB)'}</label>
            <input
              type="file"
              onChange={handleThumbnailFileChange}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="form-input"
            />
            {thumbnailFile && (
              <div className="file-info">
                Selected: {thumbnailFile.name} ({(thumbnailFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={operationLoading.video}>
              {operationLoading.video ? 'Uploading...' : (editingItem ? 'Update Video' : 'Upload Video')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoFormModal;