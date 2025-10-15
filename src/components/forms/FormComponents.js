import React from 'react';
import './FormComponents.css';

// Text Input Component
export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  size = 'medium',
  icon = null,
  ...props
}) => {
  return (
    <div className={`form-field ${size} ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`form-input ${icon ? 'with-icon' : ''}`}
          {...props}
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
};

// TextArea Component
export const TextArea = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  rows = 4,
  showCharCount = false,
  maxLength,
  ...props
}) => {
  const charCount = value?.length || 0;
  
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className="form-textarea"
        {...props}
      />
      
      {(showCharCount || helperText || error) && (
        <div className="textarea-footer">
          {showCharCount && maxLength && (
            <div className="char-count">
              {charCount}/{maxLength}
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
          {helperText && !error && <div className="helper-text">{helperText}</div>}
        </div>
      )}
    </div>
  );
};

// Select Component
export const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  ...props
}) => {
  return (
    <div className={`form-field ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="form-select"
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
};

// Checkbox Component
export const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  error = '',
  helperText = '',
  ...props
}) => {
  return (
    <div className={`form-field checkbox-field ${error ? 'has-error' : ''}`}>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="checkbox-input"
          {...props}
        />
        <span className="checkbox-custom"></span>
        <span className="checkbox-text">{label}</span>
      </label>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
};

// Radio Group Component
export const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  layout = 'vertical', // 'vertical' or 'horizontal'
  ...props
}) => {
  return (
    <div className={`form-field radio-group ${layout} ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="radio-options">
        {options.map(option => (
          <label key={option.value} className="radio-label">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              className="radio-input"
              {...props}
            />
            <span className="radio-custom"></span>
            <span className="radio-text">{option.label}</span>
          </label>
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
};

// File Upload Component
export const FileUpload = ({
  label,
  onChange,
  accept,
  multiple = false,
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  maxSize, // in bytes
  ...props
}) => {
  const handleFileChange = (e) => {
    const files = e.target.files;
    
    if (files.length > 0 && maxSize) {
      for (let file of files) {
        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB.`);
          e.target.value = '';
          return;
        }
      }
    }
    
    onChange(e);
  };

  return (
    <div className={`form-field file-upload-field ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="file-upload-wrapper">
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          className="file-input"
          {...props}
        />
        <div className="file-upload-area">
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            <strong>Click to upload</strong>
            <span>or drag and drop</span>
            {maxSize && (
              <small>Max size: {maxSize / 1024 / 1024}MB</small>
            )}
          </div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
};

// Form Group Component
export const FormGroup = ({
  children,
  label,
  required = false,
  error = '',
  helperText = '',
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className} ${error ? 'has-error' : ''}`} {...props}>
      {label && (
        <label className="form-group-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      
      <div className="form-group-content">
        {children}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
};

// Button Component
export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success', 'warning'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  icon = null,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn btn-${variant} btn-${size} ${loading ? 'loading' : ''}`}
      {...props}
    >
      {loading && <div className="btn-spinner"></div>}
      {icon && !loading && <span className="btn-icon">{icon}</span>}
      <span className="btn-text">{children}</span>
    </button>
  );
};

// Form Actions Component
export const FormActions = ({
  children,
  align = 'end', // 'start', 'center', 'end', 'space-between'
  className = '',
  ...props
}) => {
  return (
    <div className={`form-actions align-${align} ${className}`} {...props}>
      {children}
    </div>
  );
};