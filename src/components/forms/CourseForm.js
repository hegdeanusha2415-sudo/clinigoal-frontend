import React, { useState } from 'react';
import './CourseForm.css';

const CourseForm = ({
  editingCourse,
  courseForm,
  setCourseForm,
  onSubmit,
  onClose,
  operationLoading,
  addNotification
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [imagePreview, setImagePreview] = useState(courseForm.image || '');

  // Handle basic form input changes
  const handleInputChange = (field, value) => {
    setCourseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle feature changes
  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...courseForm.features];
    updatedFeatures[index] = value;
    setCourseForm(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // Add new feature
  const addFeature = () => {
    if (courseForm.features.length < 10) {
      setCourseForm(prev => ({
        ...prev,
        features: [...prev.features, '']
      }));
    } else {
      addNotification('Maximum 10 features allowed', 'warning');
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    if (courseForm.features.length > 1) {
      const updatedFeatures = courseForm.features.filter((_, i) => i !== index);
      setCourseForm(prev => ({
        ...prev,
        features: updatedFeatures
      }));
    } else {
      addNotification('Course must have at least one feature', 'warning');
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        addNotification('Please select a valid image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addNotification('Image size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setCourseForm(prev => ({
          ...prev,
          image: imageUrl
        }));
      };
      reader.readAsDataURL(file);
      addNotification('Course image uploaded successfully', 'success');
    }
  };

  // Remove image
  const removeImage = () => {
    setImagePreview('');
    setCourseForm(prev => ({
      ...prev,
      image: ''
    }));
    addNotification('Course image removed', 'info');
  };

  // Validate form
  const validateForm = () => {
    if (!courseForm.title.trim()) {
      addNotification('Course title is required', 'error');
      setActiveTab('basic');
      return false;
    }

    if (!courseForm.description.trim()) {
      addNotification('Course description is required', 'error');
      setActiveTab('basic');
      return false;
    }

    if (!courseForm.instructor.trim()) {
      addNotification('Instructor name is required', 'error');
      setActiveTab('basic');
      return false;
    }

    if (!courseForm.duration.trim()) {
      addNotification('Course duration is required', 'error');
      setActiveTab('basic');
      return false;
    }

    if (!courseForm.price.trim()) {
      addNotification('Course price is required', 'error');
      setActiveTab('basic');
      return false;
    }

    // Validate features
    const validFeatures = courseForm.features.filter(feature => feature.trim());
    if (validFeatures.length === 0) {
      addNotification('At least one course feature is required', 'error');
      setActiveTab('features');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(e);
  };

  // Calculate course level based on duration
  const getCourseLevel = (duration) => {
    const weeks = parseInt(duration) || 0;
    if (weeks >= 16) return 'Advanced';
    if (weeks >= 12) return 'Intermediate';
    return 'Beginner';
  };

  // Auto-set level when duration changes
  const handleDurationChange = (duration) => {
    handleInputChange('duration', duration);
    
    // Auto-set level based on duration
    const autoLevel = getCourseLevel(duration);
    if (courseForm.level === 'Beginner' || courseForm.level === autoLevel) {
      handleInputChange('level', autoLevel);
    }
  };

  // Format price input
  const handlePriceChange = (price) => {
    // Allow only numbers and commas
    const formattedPrice = price.replace(/[^\d,]/g, '');
    handleInputChange('price', formattedPrice ? `₹${formattedPrice}` : '');
  };

  return (
    <div className="course-form">
      <div className="form-header">
        <h2>{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
        <p>Design your clinical education course with comprehensive details</p>
      </div>

      {/* Navigation Tabs */}
      <div className="form-tabs">
        <button
          type="button"
          className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <span className="tab-icon">📝</span>
          Basic Info
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <span className="tab-icon">🎯</span>
          Course Details
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          <span className="tab-icon">⭐</span>
          Features
        </button>
        <button
          type="button"
          className={`tab-button ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          <span className="tab-icon">🖼️</span>
          Media
        </button>
      </div>

      <form onSubmit={handleSubmit} className="course-form-content">
        {/* Basic Information Tab */}
        {activeTab === 'basic' && (
          <div className="tab-content active">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label>Course Title *</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Clinical Research Associate Certification"
                  className="form-input-large"
                  required
                />
              </div>

              <div className="form-group">
                <label>Course Description *</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the course objectives, target audience, and key learning outcomes..."
                  rows="5"
                  className="form-textarea-large"
                  required
                />
                <div className="char-count">
                  {courseForm.description.length}/500 characters
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Instructor Name *</label>
                  <input
                    type="text"
                    value={courseForm.instructor}
                    onChange={(e) => handleInputChange('instructor', e.target.value)}
                    placeholder="e.g., Dr. Ananya Sharma"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Course Duration *</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => handleDurationChange(e.target.value)}
                    placeholder="e.g., 16 weeks"
                    required
                  />
                  <div className="input-hint">
                    Suggested: 8-12 weeks (Beginner), 12-16 weeks (Intermediate), 16+ weeks (Advanced)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Details Tab */}
        {activeTab === 'details' && (
          <div className="tab-content active">
            <div className="form-section">
              <h3>Course Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Course Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <div className="input-hint">
                    Auto-detected: {getCourseLevel(courseForm.duration)}
                  </div>
                </div>

                <div className="form-group">
                  <label>Course Price *</label>
                  <input
                    type="text"
                    value={courseForm.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    placeholder="e.g., ₹1,29,999"
                    required
                  />
                </div>
              </div>

              <div className="course-preview">
                <h4>Course Preview</h4>
                <div className="preview-card">
                  <div className="preview-header">
                    <h5>{courseForm.title || 'Course Title'}</h5>
                    <span className="preview-level">{courseForm.level}</span>
                  </div>
                  <p className="preview-description">
                    {courseForm.description || 'Course description will appear here...'}
                  </p>
                  <div className="preview-details">
                    <span className="preview-instructor">
                      By {courseForm.instructor || 'Instructor Name'}
                    </span>
                    <span className="preview-duration">
                      {courseForm.duration || 'Duration'}
                    </span>
                    <span className="preview-price">
                      {courseForm.price || 'Price'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="tab-content active">
            <div className="form-section">
              <h3>Course Features</h3>
              <p className="section-description">
                Highlight the key features and benefits of your course. These will be displayed as bullet points.
              </p>

              <div className="features-list">
                {courseForm.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-input-group">
                      <span className="feature-number">{index + 1}</span>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Course feature ${index + 1}...`}
                        className="feature-input"
                      />
                    </div>
                    {courseForm.features.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-feature"
                        onClick={() => removeFeature(index)}
                        title="Remove feature"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={addFeature}
                disabled={courseForm.features.length >= 10}
              >
                + Add Feature
              </button>

              <div className="features-preview">
                <h4>Features Preview</h4>
                <ul className="preview-features-list">
                  {courseForm.features.filter(f => f.trim()).map((feature, index) => (
                    <li key={index} className="preview-feature-item">
                      {feature || `Feature ${index + 1}`}
                    </li>
                  ))}
                  {courseForm.features.filter(f => f.trim()).length === 0 && (
                    <li className="preview-feature-item empty">
                      No features added yet
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="tab-content active">
            <div className="form-section">
              <h3>Course Media</h3>
              
              <div className="image-upload-section">
                <label>Course Cover Image</label>
                <p className="upload-description">
                  Recommended: 1280x720px, JPEG or PNG, Max 5MB
                </p>

                {imagePreview ? (
                  <div className="image-preview-container">
                    <img 
                      src={imagePreview} 
                      alt="Course preview" 
                      className="course-image-preview"
                    />
                    <div className="image-actions">
                      <button
                        type="button"
                        className="btn-secondary btn-small"
                        onClick={removeImage}
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-small"
                        onClick={removeImage}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                      id="courseImageUpload"
                    />
                    <label htmlFor="courseImageUpload" className="image-upload-label">
                      <div className="upload-icon">📷</div>
                      <div className="upload-text">
                        <strong>Click to upload course image</strong>
                        <span>or drag and drop</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              <div className="media-preview">
                <h4>Course Card Preview</h4>
                <div className="course-card-preview">
                  <div className="preview-image">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Course preview" />
                    ) : (
                      <div className="no-image-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="preview-overlay">
                      <span className="preview-level-badge">{courseForm.level}</span>
                      <span className="preview-price-badge">{courseForm.price || '₹0'}</span>
                    </div>
                  </div>
                  <div className="preview-content">
                    <h5>{courseForm.title || 'Course Title'}</h5>
                    <p className="preview-instructor">By {courseForm.instructor || 'Instructor'}</p>
                    <p className="preview-description">
                      {courseForm.description ? 
                        (courseForm.description.length > 100 
                          ? courseForm.description.substring(0, 100) + '...' 
                          : courseForm.description
                        ) 
                        : 'Course description will appear here...'
                      }
                    </p>
                    <div className="preview-features">
                      {courseForm.features.slice(0, 2).map((feature, index) => (
                        feature && (
                          <span key={index} className="preview-feature-tag">
                            {feature}
                          </span>
                        )
                      ))}
                      {courseForm.features.filter(f => f.trim()).length > 2 && (
                        <span className="preview-more-features">
                          +{courseForm.features.filter(f => f.trim()).length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Navigation */}
        <div className="form-navigation">
          <div className="nav-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                if (activeTab === 'basic') {
                  onClose();
                } else {
                  setActiveTab(activeTab === 'details' ? 'basic' : 
                              activeTab === 'features' ? 'details' : 'features');
                }
              }}
            >
              {activeTab === 'basic' ? 'Cancel' : 'Back'}
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                if (activeTab === 'media') {
                  // Submit form if we're on the last tab
                  handleSubmit(new Event('submit'));
                } else {
                  setActiveTab(activeTab === 'basic' ? 'details' : 
                              activeTab === 'details' ? 'features' : 'media');
                }
              }}
              disabled={operationLoading}
            >
              {operationLoading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  {editingCourse ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                activeTab === 'media' ? 
                  (editingCourse ? 'Update Course' : 'Create Course') : 
                  'Continue'
              )}
            </button>
          </div>

          <div className="progress-indicator">
            <div className="progress-steps">
              {['basic', 'details', 'features', 'media'].map((tab, index) => (
                <div
                  key={tab}
                  className={`progress-step ${activeTab === tab ? 'active' : ''} ${
                    ['basic', 'details', 'features', 'media'].indexOf(activeTab) > index ? 'completed' : ''
                  }`}
                >
                  <span className="step-number">{index + 1}</span>
                  <span className="step-label">
                    {tab === 'basic' && 'Basic'}
                    {tab === 'details' && 'Details'}
                    {tab === 'features' && 'Features'}
                    {tab === 'media' && 'Media'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;