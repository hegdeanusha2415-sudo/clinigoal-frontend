const API_BASE_URL = 'http://localhost:5000/api';

// Generic fetch function with error handling
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Video APIs
export const fetchVideosAPI = () => fetchAPI('/admin/videos');
export const addVideoAPI = async (formData, videoFile, thumbnailFile) => {
  const data = new FormData();
  data.append('file', videoFile);
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('duration', formData.duration);
  data.append('course', formData.course);
  data.append('module', formData.module);
  data.append('order', formData.order);

  if (thumbnailFile) {
    data.append('thumbnail', thumbnailFile);
  }

  const response = await fetch(`${API_BASE_URL}/admin/videos`, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Upload failed');
  }

  return await response.json();
};
export const updateVideoAPI = async (videoId, formData, videoFile, thumbnailFile) => {
  const data = new FormData();
  if (videoFile) data.append('file', videoFile);
  if (thumbnailFile) data.append('thumbnail', thumbnailFile);
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('duration', formData.duration);
  data.append('course', formData.course);
  data.append('module', formData.module);
  data.append('order', formData.order);

  const response = await fetch(`${API_BASE_URL}/admin/videos/${videoId}`, {
    method: 'PUT',
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Update failed');
  }

  return await response.json();
};
export const deleteVideoAPI = (videoId) => fetchAPI(`/admin/videos/${videoId}`, { method: 'DELETE' });

// Note APIs (similar pattern)
export const fetchNotesAPI = () => fetchAPI('/admin/notes');
export const addNoteAPI = async (formData, noteFile) => {
  const data = new FormData();
  data.append('file', noteFile);
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('pages', formData.pages);
  data.append('fileType', formData.fileType);
  data.append('course', formData.course);

  const response = await fetch(`${API_BASE_URL}/admin/notes`, {
    method: 'POST',
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Upload failed');
  }

  return await response.json();
};
export const updateNoteAPI = async (noteId, formData, noteFile) => {
  const data = new FormData();
  if (noteFile) data.append('file', noteFile);
  data.append('title', formData.title);
  data.append('description', formData.description);
  data.append('pages', formData.pages);
  data.append('fileType', formData.fileType);
  data.append('course', formData.course);

  const response = await fetch(`${API_BASE_URL}/admin/notes/${noteId}`, {
    method: 'PUT',
    body: data,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Update failed');
  }

  return await response.json();
};
export const deleteNoteAPI = (noteId) => fetchAPI(`/admin/notes/${noteId}`, { method: 'DELETE' });

// Quiz APIs
export const fetchQuizzesAPI = () => fetchAPI('/admin/quizzes');
export const addQuizAPI = (quizData) => fetchAPI('/admin/quizzes', {
  method: 'POST',
  body: JSON.stringify(quizData),
});
export const updateQuizAPI = (quizId, quizData) => fetchAPI(`/admin/quizzes/${quizId}`, {
  method: 'PUT',
  body: JSON.stringify(quizData),
});
export const deleteQuizAPI = (quizId) => fetchAPI(`/admin/quizzes/${quizId}`, { method: 'DELETE' });

// Course APIs
export const fetchCoursesAPI = () => fetchAPI('/courses');
export const addCourseAPI = (courseData) => fetchAPI('/courses', {
  method: 'POST',
  body: JSON.stringify(courseData),
});
export const updateCourseAPI = (courseId, courseData) => fetchAPI(`/courses/${courseId}`, {
  method: 'PUT',
  body: JSON.stringify(courseData),
});
export const deleteCourseAPI = (courseId) => fetchAPI(`/courses/${courseId}`, { method: 'DELETE' });

// Payment APIs
export const fetchPaymentsAPI = () => fetchAPI('/admin/payments');