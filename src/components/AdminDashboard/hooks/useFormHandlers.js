import { useState } from 'react';

export const useFormHandlers = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [noteFile, setNoteFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({
    video: 0,
    thumbnail: 0,
    note: 0
  });

  // File Upload Handlers
  const handleVideoFileChange = (e, addNotification) => {
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

  const handleThumbnailFileChange = (e, addNotification) => {
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

  const handleNoteFileChange = (e, addNotification, setNoteForm) => {
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

  // Simulate file upload with progress
  const simulateFileUpload = (file, type) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          const fileUrl = URL.createObjectURL(file);
          resolve(fileUrl);
        }
        setUploadProgress(prev => ({
          ...prev,
          [type]: progress
        }));
      }, 200);
    });
  };

  // Form Validation Functions
  const validateVideoForm = (videoForm, videoFile, editingItem, addNotification) => {
    if (!videoForm.title.trim()) {
      addNotification('Video title is required', 'error');
      return false;
    }
    if (!videoForm.duration || videoForm.duration <= 0) {
      addNotification('Please enter a valid duration', 'error');
      return false;
    }
    if (!videoForm.course) {
      addNotification('Please select a course', 'error');
      return false;
    }
    if (!videoFile && !editingItem) {
      addNotification('Please select a video file to upload', 'error');
      return false;
    }
    return true;
  };

  const validateNoteForm = (noteForm, noteFile, editingItem, addNotification) => {
    if (!noteForm.title.trim()) {
      addNotification('Note title is required', 'error');
      return false;
    }
    if (!noteForm.course) {
      addNotification('Please select a course', 'error');
      return false;
    }
    if (!noteFile && !editingItem) {
      addNotification('Please select a document file to upload', 'error');
      return false;
    }
    return true;
  };

  const validateQuizForm = (quizForm, addNotification) => {
    if (!quizForm.title.trim()) {
      addNotification('Quiz title is required', 'error');
      return false;
    }
    if (!quizForm.course) {
      addNotification('Please select a course', 'error');
      return false;
    }
    if (quizForm.questions.length === 0) {
      addNotification('Quiz must have at least one question', 'error');
      return false;
    }
    
    for (let i = 0; i < quizForm.questions.length; i++) {
      const question = quizForm.questions[i];
      if (!question.questionText.trim()) {
        addNotification(`Question ${i + 1} text is required`, 'error');
        return false;
      }
      
      const hasCorrectAnswer = question.options.some(opt => opt.isCorrect);
      if (!hasCorrectAnswer) {
        addNotification(`Question ${i + 1} must have a correct answer`, 'error');
        return false;
      }
      
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].optionText.trim()) {
          addNotification(`Question ${i + 1}, Option ${j + 1} text is required`, 'error');
          return false;
        }
      }
    }
    
    return true;
  };

  // Reset file uploads
  const resetFileUploads = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setNoteFile(null);
    setUploadProgress({ video: 0, thumbnail: 0, note: 0 });
  };

  return {
    videoFile,
    thumbnailFile,
    noteFile,
    uploadProgress,
    setVideoFile,
    setThumbnailFile,
    setNoteFile,
    setUploadProgress,
    handleVideoFileChange,
    handleThumbnailFileChange,
    handleNoteFileChange,
    simulateFileUpload,
    validateVideoForm,
    validateNoteForm,
    validateQuizForm,
    resetFileUploads
  };
};