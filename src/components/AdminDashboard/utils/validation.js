export const validateVideoForm = (formData, videoFile, editingItem, addNotification) => {
  if (!formData.title.trim()) {
    addNotification('Video title is required', 'error');
    return false;
  }
  if (!formData.duration || formData.duration <= 0) {
    addNotification('Please enter a valid duration', 'error');
    return false;
  }
  if (!formData.course) {
    addNotification('Please select a course', 'error');
    return false;
  }
  if (!videoFile && !editingItem) {
    addNotification('Please select a video file to upload', 'error');
    return false;
  }
  return true;
};

export const validateNoteForm = (formData, noteFile, editingItem, addNotification) => {
  if (!formData.title.trim()) {
    addNotification('Document title is required', 'error');
    return false;
  }
  if (!formData.course) {
    addNotification('Please select a course', 'error');
    return false;
  }
  if (!noteFile && !editingItem) {
    addNotification('Please select a document file to upload', 'error');
    return false;
  }
  return true;
};

export const validateQuizForm = (formData, addNotification) => {
  if (!formData.title.trim()) {
    addNotification('Quiz title is required', 'error');
    return false;
  }
  if (!formData.course) {
    addNotification('Please select a course', 'error');
    return false;
  }
  if (formData.questions.length === 0) {
    addNotification('Quiz must have at least one question', 'error');
    return false;
  }
  
  for (let i = 0; i < formData.questions.length; i++) {
    const question = formData.questions[i];
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

export const validateCourseForm = (formData, addNotification) => {
  if (!formData.title.trim()) {
    addNotification('Course title is required', 'error');
    return false;
  }
  if (!formData.description.trim()) {
    addNotification('Course description is required', 'error');
    return false;
  }
  if (!formData.instructor.trim()) {
    addNotification('Instructor name is required', 'error');
    return false;
  }
  if (!formData.price.trim()) {
    addNotification('Course price is required', 'error');
    return false;
  }
  return true;
};