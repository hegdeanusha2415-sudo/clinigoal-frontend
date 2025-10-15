import React from 'react';
import { validateNoteForm } from '../../utils/validation';

const NoteFormModal = ({
  editingItem,
  noteForm,
  setNoteForm,
  noteFile,
  setNoteFile,
  courses,
  operationLoading,
  handleAddNote,
  handleUpdateNote,
  onClose,
  addNotification
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateNoteForm(noteForm, noteFile, editingItem, addNotification)) return;
    
    const success = editingItem 
      ? await handleUpdateNote(editingItem._id, noteForm, noteFile)
      : await handleAddNote(noteForm, noteFile);
    
    if (success) {
      onClose();
    }
  };

  const handleNoteFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validDocumentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!validDocumentTypes.includes(file.type)) {
        addNotification('Please select a valid document file (PDF, DOC, DOCX, TXT)', 'error');
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) {
        addNotification('Document file size should be less than 50MB', 'error');
        return;
      }
      
      setNoteFile(file);
      
      if (file.type === 'application/pdf') {
        setNoteForm(prev => ({ ...prev, fileType: 'pdf' }));
      } else if (file.type.includes('word')) {
        setNoteForm(prev => ({
          ...prev,
          fileType: file.type.includes('openxml') ? 'docx' : 'doc'
        }));
      } else if (file.type === 'text/plain') {
        setNoteForm(prev => ({ ...prev, fileType: 'txt' }));
      }
      
      addNotification(`Document selected: ${file.name}`, 'success');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Document' : 'Upload New Document'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Document Title *</label>
            <input
              type="text"
              value={noteForm.title}
              onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
              required
              className="form-input"
              placeholder="Enter document title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={noteForm.description}
              onChange={(e) => setNoteForm({...noteForm, description: e.target.value})}
              className="form-textarea"
              placeholder="Enter document description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>File Type *</label>
              <select
                value={noteForm.fileType}
                onChange={(e) => setNoteForm({...noteForm, fileType: e.target.value})}
                required
                className="form-select"
              >
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="docx">DOCX</option>
                <option value="txt">TXT</option>
              </select>
            </div>

            <div className="form-group">
              <label>Pages</label>
              <input
                type="number"
                value={noteForm.pages}
                onChange={(e) => setNoteForm({...noteForm, pages: e.target.value})}
                className="form-input"
                placeholder="Number of pages"
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Course *</label>
            <select
              value={noteForm.course}
              onChange={(e) => setNoteForm({...noteForm, course: e.target.value})}
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

          {/* Document File Upload */}
          <div className="form-group">
            <label>Document File * {!editingItem && '(PDF, DOC, DOCX, TXT - Max 50MB)'}</label>
            <input
              type="file"
              onChange={handleNoteFileChange}
              accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="form-input"
              required={!editingItem}
            />
            {noteFile && (
              <div className="file-info">
                Selected: {noteFile.name} ({(noteFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
            {editingItem && !noteFile && (
              <div className="current-file">
                <strong>Current File:</strong> {editingItem.fileName} ({editingItem.fileSize} KB)
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={operationLoading.note}>
              {operationLoading.note ? 'Uploading...' : (editingItem ? 'Update Document' : 'Upload Document')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteFormModal;