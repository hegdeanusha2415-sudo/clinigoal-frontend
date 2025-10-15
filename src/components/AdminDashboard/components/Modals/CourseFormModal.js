import React from 'react';
import { validateCourseForm } from '../../utils/validation';

const CourseFormModal = ({
  editingCourse,
  courseForm,
  setCourseForm,
  handleAddCourse,
  handleUpdateCourse,
  onClose,
  addNotification
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCourseForm(courseForm, addNotification)) return;
    
    const success = editingCourse 
      ? await handleUpdateCourse(editingCourse._id, courseForm)
      : await handleAddCourse(courseForm);
    
    if (success) {
      onClose();
    }
  };

  const handleCourseFeatureChange = (index, value) => {
    const updatedFeatures = [...courseForm.features];
    updatedFeatures[index] = value;
    setCourseForm(prev => ({ ...prev, features: updatedFeatures }));
  };

  const addCourseFeature = () => {
    setCourseForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeCourseFeature = (index) => {
    if (courseForm.features.length > 1) {
      const updatedFeatures = courseForm.features.filter((_, i) => i !== index);
      setCourseForm(prev => ({ ...prev, features: updatedFeatures }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal large">
        <div className="modal-header">
          <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              value={courseForm.title}
              onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
              required
              className="form-input"
              placeholder="Enter course title"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={courseForm.description}
              onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
              required
              className="form-textarea"
              placeholder="Enter course description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Instructor *</label>
              <input
                type="text"
                value={courseForm.instructor}
                onChange={(e) => setCourseForm({...courseForm, instructor: e.target.value})}
                required
                className="form-input"
                placeholder="Enter instructor name"
              />
            </div>

            <div className="form-group">
              <label>Duration *</label>
              <input
                type="text"
                value={courseForm.duration}
                onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                required
                className="form-input"
                placeholder="e.g., 12 weeks"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Level *</label>
              <select
                value={courseForm.level}
                onChange={(e) => setCourseForm({...courseForm, level: e.target.value})}
                required
                className="form-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price *</label>
              <input
                type="text"
                value={courseForm.price}
                onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                required
                className="form-input"
                placeholder="e.g., ₹79,999"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Course Image URL</label>
            <input
              type="url"
              value={courseForm.image}
              onChange={(e) => setCourseForm({...courseForm, image: e.target.value})}
              className="form-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Course Features</label>
            {courseForm.features.map((feature, index) => (
              <div key={index} className="feature-input-group">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleCourseFeatureChange(index, e.target.value)}
                  className="form-input"
                  placeholder={`Feature ${index + 1}`}
                />
                {courseForm.features.length > 1 && (
                  <button
                    type="button"
                    className="btn-danger small"
                    onClick={() => removeCourseFeature(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="btn-secondary"
              onClick={addCourseFeature}
            >
              + Add Feature
            </button>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingCourse ? 'Update Course' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;