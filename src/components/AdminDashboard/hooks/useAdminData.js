import { useState, useEffect } from 'react';
import { 
  fetchVideosAPI, 
  fetchNotesAPI, 
  fetchQuizzesAPI, 
  fetchCoursesAPI, 
  fetchPaymentsAPI,
  addVideoAPI,
  updateVideoAPI,
  deleteVideoAPI,
  addNoteAPI,
  updateNoteAPI,
  deleteNoteAPI,
  addQuizAPI,
  updateQuizAPI,
  deleteQuizAPI,
  addCourseAPI,
  updateCourseAPI,
  deleteCourseAPI
} from '../utils/api';
import { validateVideoForm, validateNoteForm, validateQuizForm } from '../utils/validation';

export const useAdminData = ({ addNotification }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: '₹0',
    totalStudents: 0,
    totalCourses: 0,
    totalInstructors: 0,
    paymentSuccessRate: 0,
    monthlyRevenue: '₹0',
    activeUsers: 0,
    coursePerformance: [],
    revenueTrend: [],
    studentGrowth: []
  });
  
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  
  const [operationLoading, setOperationLoading] = useState({
    video: false,
    note: false,
    quiz: false
  });

  // Data fetching functions
  const fetchVideos = async () => {
    try {
      const videosData = await fetchVideosAPI();
      setVideos(videosData);
    } catch (error) {
      console.error('Error fetching videos:', error);
      addNotification('Failed to load videos', 'error');
    }
  };

  const fetchNotes = async () => {
    try {
      const notesData = await fetchNotesAPI();
      setNotes(notesData);
    } catch (error) {
      console.error('Error fetching notes:', error);
      addNotification('Failed to load notes', 'error');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const quizzesData = await fetchQuizzesAPI();
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      addNotification('Failed to load quizzes', 'error');
    }
  };

  const fetchCourses = async () => {
    try {
      const coursesData = await fetchCoursesAPI();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error fetching courses:', error);
      addNotification('Failed to load courses', 'error');
    }
  };

  const fetchPayments = async () => {
    try {
      const paymentsData = await fetchPaymentsAPI();
      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      addNotification('Failed to load payments', 'error');
    }
  };

  const fetchStudents = async () => {
    // Implementation for fetching students
    setStudents([]);
  };

  // Video operations
  const handleAddVideo = async (formData, videoFile, thumbnailFile) => {
    if (!validateVideoForm(formData, videoFile, null, addNotification)) return false;
    
    setOperationLoading(prev => ({...prev, video: true}));
    
    try {
      const newVideo = await addVideoAPI(formData, videoFile, thumbnailFile);
      setVideos(prev => [newVideo, ...prev]);
      addNotification('Video uploaded successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error adding video:', error);
      addNotification('Failed to upload video', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({...prev, video: false}));
    }
  };

  const handleEditVideo = (video, setVideoForm) => {
    setVideoForm({
      title: video.title,
      description: video.description,
      duration: video.duration.toString(),
      course: video.course,
      module: video.module || '',
      order: video.order || 0
    });
  };

  const handleUpdateVideo = async (videoId, formData, videoFile, thumbnailFile) => {
    if (!validateVideoForm(formData, videoFile, videoId, addNotification)) return false;
    
    setOperationLoading(prev => ({...prev, video: true}));
    
    try {
      const updatedVideo = await updateVideoAPI(videoId, formData, videoFile, thumbnailFile);
      setVideos(prev => prev.map(v => v._id === videoId ? updatedVideo : v));
      addNotification('Video updated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error updating video:', error);
      addNotification('Failed to update video', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({...prev, video: false}));
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      await deleteVideoAPI(videoId);
      setVideos(prev => prev.filter(v => v._id !== videoId));
      addNotification('Video deleted successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      addNotification('Failed to delete video', 'error');
      return false;
    }
  };

  // Note operations (similar pattern)
  const handleAddNote = async (formData, noteFile) => {
    if (!validateNoteForm(formData, noteFile, null, addNotification)) return false;
    
    setOperationLoading(prev => ({...prev, note: true}));
    
    try {
      const newNote = await addNoteAPI(formData, noteFile);
      setNotes(prev => [newNote, ...prev]);
      addNotification('Document uploaded successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error adding note:', error);
      addNotification('Failed to upload document', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({...prev, note: false}));
    }
  };

  const handleEditNote = (note, setNoteForm) => {
    setNoteForm({
      title: note.title,
      description: note.description,
      fileType: note.fileType,
      pages: note.pages?.toString() || '',
      course: note.course
    });
  };

  const handleUpdateNote = async (noteId, formData, noteFile) => {
    if (!validateNoteForm(formData, noteFile, noteId, addNotification)) return false;
    
    setOperationLoading(prev => ({...prev, note: true}));
    
    try {
      const updatedNote = await updateNoteAPI(noteId, formData, noteFile);
      setNotes(prev => prev.map(n => n._id === noteId ? updatedNote : n));
      addNotification('Document updated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error updating note:', error);
      addNotification('Failed to update document', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({...prev, note: false}));
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNoteAPI(noteId);
      setNotes(prev => prev.filter(n => n._id !== noteId));
      addNotification('Note deleted successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      addNotification('Failed to delete note', 'error');
      return false;
    }
  };

  // Quiz operations (similar pattern)
  const handleAddQuiz = async (formData) => {
    if (!validateQuizForm(formData, addNotification)) return false;
    
    setOperationLoading(prev => ({...prev, quiz: true}));
    
    try {
      const newQuiz = await addQuizAPI(formData);
      setQuizzes(prev => [newQuiz, ...prev]);
      addNotification('Quiz added successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error adding quiz:', error);
      addNotification('Failed to add quiz', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({...prev, quiz: false}));
    }
  };

  const handleEditQuiz = (quiz, setQuizForm) => {
    setQuizForm({
      title: quiz.title,
      description: quiz.description,
      course: quiz.course,
      timeLimit: quiz.timeLimit,
      passingScore: quiz.passingScore,
      questions: quiz.questions || [{
        questionText: '',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ]
      }]
    });
  };

  const handleUpdateQuiz = async (quizId, formData) => {
    if (!validateQuizForm(formData, addNotification)) return false;
    
    setOperationLoading(prev => ({...prev, quiz: true}));
    
    try {
      const updatedQuiz = await updateQuizAPI(quizId, formData);
      setQuizzes(prev => prev.map(q => q._id === quizId ? updatedQuiz : q));
      addNotification('Quiz updated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error updating quiz:', error);
      addNotification('Failed to update quiz', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({...prev, quiz: false}));
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteQuizAPI(quizId);
      setQuizzes(prev => prev.filter(q => q._id !== quizId));
      addNotification('Quiz deleted successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      addNotification('Failed to delete quiz', 'error');
      return false;
    }
  };

  // Course operations
  const handleAddCourse = async (formData) => {
    try {
      const newCourse = await addCourseAPI(formData);
      setCourses(prev => [newCourse, ...prev]);
      addNotification('Course added successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error adding course:', error);
      addNotification('Failed to add course', 'error');
      return false;
    }
  };

  const handleEditCourse = (course, setCourseForm) => {
    setCourseForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      level: course.level,
      price: course.price,
      image: course.image,
      features: [...course.features, '']
    });
  };

  const handleUpdateCourse = async (courseId, formData) => {
    try {
      const updatedCourse = await updateCourseAPI(courseId, formData);
      setCourses(prev => prev.map(c => c._id === courseId ? updatedCourse : c));
      addNotification('Course updated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error updating course:', error);
      addNotification('Failed to update course', 'error');
      return false;
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourseAPI(courseId);
      setCourses(prev => prev.filter(c => c._id !== courseId));
      
      // Also remove associated content
      setVideos(prev => prev.filter(v => v.course !== courseId));
      setNotes(prev => prev.filter(n => n.course !== courseId));
      setQuizzes(prev => prev.filter(q => q.course !== courseId));
      
      addNotification('Course deleted successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      addNotification('Failed to delete course', 'error');
      return false;
    }
  };

  // Form reset functions
  const resetVideoForm = (setVideoForm) => {
    setVideoForm({
      title: '',
      description: '',
      duration: '',
      course: '',
      module: '',
      order: 0
    });
  };

  const resetNoteForm = (setNoteForm) => {
    setNoteForm({
      title: '',
      description: '',
      fileType: 'pdf',
      pages: '',
      course: ''
    });
  };

  const resetQuizForm = (setQuizForm) => {
    setQuizForm({
      title: '',
      description: '',
      course: '',
      timeLimit: 30,
      passingScore: 70,
      questions: [{
        questionText: '',
        options: [
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false },
          { optionText: '', isCorrect: false }
        ]
      }]
    });
  };

  const resetCourseForm = (setCourseForm) => {
    setCourseForm({
      title: '',
      description: '',
      instructor: '',
      duration: '',
      level: 'Beginner',
      price: '',
      image: '',
      features: ['']
    });
  };

  // Stats calculation
  const calculateStats = () => {
    // Implementation for calculating stats
    const totalRevenue = payments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0);

    setStats(prev => ({
      ...prev,
      totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
      totalStudents: students.length,
      totalCourses: courses.length,
      paymentSuccessRate: payments.length > 0 ? 
        Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0
    }));
  };

  useEffect(() => {
    calculateStats();
  }, [payments, students, courses]);

  return {
    loading,
    stats,
    payments,
    courses,
    students,
    videos,
    notes,
    quizzes,
    operationLoading,
    fetchVideos,
    fetchNotes,
    fetchQuizzes,
    fetchCourses,
    fetchPayments,
    fetchStudents,
    calculateStats,
    handleAddVideo,
    handleEditVideo,
    handleUpdateVideo,
    handleDeleteVideo,
    handleAddNote,
    handleEditNote,
    handleUpdateNote,
    handleDeleteNote,
    handleAddQuiz,
    handleEditQuiz,
    handleUpdateQuiz,
    handleDeleteQuiz,
    handleAddCourse,
    handleEditCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    resetVideoForm,
    resetNoteForm,
    resetQuizForm,
    resetCourseForm
  };
};