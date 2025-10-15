import { useState, useEffect, useCallback } from 'react';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage 
} from '../utils/localStorage';
import { 
  syncAllUserDashboardPayments, 
  syncPaidEnrollments,
  syncReviewsFromUserDashboard 
} from '../utils/dataSync';
import {
  formatPaymentTime,
  getDetailedTimeInfo,
  getPaymentDayInfo
} from '../utils/paymentTimeUtils';
import { defaultCourses } from '../data/dummyCourses';
import { dummyVideos } from '../data/dummyVideos';
import { dummyNotes } from '../data/dummyNotes';
import { dummyQuizzes } from '../data/dummyQuizzes';

export const useAdminData = (addNotification, socket) => {
  // Main state
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [courseApprovals, setCourseApprovals] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: '₹0',
    totalStudents: 0,
    totalCourses: 0,
    totalInstructors: 0,
    paymentSuccessRate: 0,
    monthlyRevenue: '₹0',
    activeUsers: 0
  });
  const [analyticsData, setAnalyticsData] = useState({
    revenueTrend: [],
    studentGrowth: [],
    coursePerformance: [],
    enrollmentStats: [],
    platformMetrics: {}
  });
  const [settings, setSettings] = useState({
    platformName: 'Clinigoal',
    platformEmail: 'admin@clinigoal.com',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    autoApproveReviews: false,
    notificationEmails: true,
    maintenanceMode: false,
    maxFileSize: 100,
    sessionTimeout: 60,
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState({
    video: false,
    note: false,
    quiz: false,
    course: false
  });

  // Form states
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    duration: '',
    course: '',
    module: '',
    order: 0,
    videoUrl: '',
    thumbnail: ''
  });

  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    fileType: 'pdf',
    pages: '',
    course: '',
    fileUrl: ''
  });

  const [quizForm, setQuizForm] = useState({
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

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    level: 'Beginner',
    price: '',
    image: '',
    features: [''],
    videos: [],
    notes: [],
    quizzes: []
  });

  // Data fetching functions
  const fetchPayments = useCallback(async () => {
    try {
      const localPayments = loadFromLocalStorage('adminPayments', []);
      setPayments(localPayments);
      return localPayments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      return [];
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const localCourses = loadFromLocalStorage('adminCourses', []);
      setCourses(localCourses.length > 0 ? localCourses : defaultCourses);
      return localCourses.length > 0 ? localCourses : defaultCourses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(defaultCourses);
      return defaultCourses;
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const localStudents = loadFromLocalStorage('adminStudents', []);
      setStudents(localStudents);
      return localStudents;
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      return [];
    }
  }, []);

  const fetchInstructors = useCallback(async () => {
    try {
      const localInstructors = loadFromLocalStorage('adminInstructors', []);
      setInstructors(localInstructors);
      return localInstructors;
    } catch (error) {
      console.error('Error fetching instructors:', error);
      setInstructors([]);
      return [];
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const { reviews: syncedReviews } = syncReviewsFromUserDashboard([]);
      const localReviews = loadFromLocalStorage('adminReviews', []);
      const allReviews = [...syncedReviews, ...localReviews];
      const uniqueReviews = allReviews.filter((review, index, self) =>
        index === self.findIndex(r => r._id === review._id)
      );
      setReviews(uniqueReviews);
      saveToLocalStorage('adminReviews', uniqueReviews);
      return uniqueReviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
      return [];
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const localVideos = loadFromLocalStorage('adminVideos', []);
      setVideos(localVideos.length > 0 ? localVideos : dummyVideos);
      return localVideos.length > 0 ? localVideos : dummyVideos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      setVideos(dummyVideos);
      return dummyVideos;
    }
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const localNotes = loadFromLocalStorage('adminNotes', []);
      setNotes(localNotes.length > 0 ? localNotes : dummyNotes);
      return localNotes.length > 0 ? localNotes : dummyNotes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes(dummyNotes);
      return dummyNotes;
    }
  }, []);

  const fetchQuizzes = useCallback(async () => {
    try {
      const localQuizzes = loadFromLocalStorage('adminQuizzes', []);
      setQuizzes(localQuizzes.length > 0 ? localQuizzes : dummyQuizzes);
      return localQuizzes.length > 0 ? localQuizzes : dummyQuizzes;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setQuizzes(dummyQuizzes);
      return dummyQuizzes;
    }
  }, []);

  const fetchCourseApprovals = useCallback(async () => {
    try {
      const { payments: syncedPayments, approvals: syncedApprovals } = syncAllUserDashboardPayments();
      const localApprovals = loadFromLocalStorage('courseApprovals', []);
      
      let allApprovals = [...localApprovals];
      
      // Process synced payments into approvals
      syncedPayments.forEach(payment => {
        if (payment.courseId && payment.studentName && !allApprovals.some(a => 
          a.userEmail === payment.studentEmail && a.courseId === payment.courseId
        )) {
          const course = courses.find(c => c._id === payment.courseId) || defaultCourses.find(c => c._id === payment.courseId);
          allApprovals.push({
            _id: payment._id || `approval_${Date.now()}`,
            userId: payment.studentEmail || `user_${payment.studentName}`,
            userName: payment.studentName,
            userEmail: payment.studentEmail || `${payment.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            courseId: payment.courseId,
            courseTitle: course?.title || payment.courseTitle || 'Unknown Course',
            enrollmentDate: payment.timestamp || new Date().toISOString(),
            status: 'pending',
            progress: 0,
            lastAccessed: new Date().toISOString(),
            completed: false,
            paymentStatus: payment.status || 'pending',
            amount: payment.amount || '₹0',
            transactionId: payment.transactionId || `TXN_${Date.now()}`,
            paymentMethod: payment.paymentMethod || 'unknown',
            isPaid: true,
            source: 'user_dashboard_sync'
          });
        }
      });

      // Add synced approvals
      syncedApprovals.forEach(approval => {
        if (!allApprovals.some(a => a._id === approval._id)) {
          allApprovals.push(approval);
        }
      });

      setCourseApprovals(allApprovals);
      saveToLocalStorage('courseApprovals', allApprovals);
      return allApprovals;
    } catch (error) {
      console.error('Error fetching course approvals:', error);
      setCourseApprovals([]);
      return [];
    }
  }, [courses]);

  // Form submission handlers
  const handleVideoFormSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setOperationLoading(prev => ({ ...prev, video: true }));

    try {
      if (videoForm.title && videoForm.course) {
        const newVideo = {
          _id: `video_${Date.now()}`,
          ...videoForm,
          createdAt: new Date().toISOString(),
          views: 0,
          likes: 0
        };
        const updatedVideos = [...videos, newVideo];
        setVideos(updatedVideos);
        saveToLocalStorage('adminVideos', updatedVideos);
        addNotification('Video uploaded successfully!', 'success');
        
        // Reset form
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
        return true;
      } else {
        addNotification('Please fill in all required fields', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error saving video:', error);
      addNotification('Failed to save video', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({ ...prev, video: false }));
    }
  }, [videoForm, videos, addNotification]);

  const handleNoteFormSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setOperationLoading(prev => ({ ...prev, note: true }));

    try {
      if (noteForm.title && noteForm.course) {
        const newNote = {
          _id: `note_${Date.now()}`,
          ...noteForm,
          createdAt: new Date().toISOString(),
          downloads: 0
        };
        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);
        saveToLocalStorage('adminNotes', updatedNotes);
        addNotification('Document uploaded successfully!', 'success');
        
        // Reset form
        setNoteForm({
          title: '',
          description: '',
          fileType: 'pdf',
          pages: '',
          course: '',
          fileUrl: ''
        });
        return true;
      } else {
        addNotification('Please fill in all required fields', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error saving document:', error);
      addNotification('Failed to save document', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({ ...prev, note: false }));
    }
  }, [noteForm, notes, addNotification]);

  const handleQuizFormSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setOperationLoading(prev => ({ ...prev, quiz: true }));

    try {
      if (quizForm.title && quizForm.course && quizForm.questions.length > 0) {
        const newQuiz = {
          _id: `quiz_${Date.now()}`,
          ...quizForm,
          createdAt: new Date().toISOString(),
          attempts: 0,
          averageScore: 0
        };
        const updatedQuizzes = [...quizzes, newQuiz];
        setQuizzes(updatedQuizzes);
        saveToLocalStorage('adminQuizzes', updatedQuizzes);
        addNotification('Quiz created successfully!', 'success');
        
        // Reset form
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
        return true;
      } else {
        addNotification('Please fill in all required fields and add at least one question', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
      addNotification('Failed to save quiz', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({ ...prev, quiz: false }));
    }
  }, [quizForm, quizzes, addNotification]);

  const handleCourseFormSubmit = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setOperationLoading(prev => ({ ...prev, course: true }));

    try {
      if (courseForm.title && courseForm.description && courseForm.instructor) {
        const newCourse = {
          _id: `course_${Date.now()}`,
          ...courseForm,
          createdAt: new Date().toISOString(),
          students: 0,
          rating: 4.5
        };
        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);
        saveToLocalStorage('adminCourses', updatedCourses);
        addNotification('Course created successfully!', 'success');
        
        // Reset form
        setCourseForm({
          title: '',
          description: '',
          instructor: '',
          duration: '',
          level: 'Beginner',
          price: '',
          image: '',
          features: [''],
          videos: [],
          notes: [],
          quizzes: []
        });
        return true;
      } else {
        addNotification('Please fill in all required fields', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error saving course:', error);
      addNotification('Failed to save course', 'error');
      return false;
    } finally {
      setOperationLoading(prev => ({ ...prev, course: false }));
    }
  }, [courseForm, courses, addNotification]);

  // Edit functions
  const editVideo = useCallback((video) => {
    setVideoForm({
      title: video.title || '',
      description: video.description || '',
      duration: video.duration || '',
      course: video.course || '',
      module: video.module || '',
      order: video.order || 0,
      videoUrl: video.videoUrl || '',
      thumbnail: video.thumbnail || ''
    });
  }, []);

  const editNote = useCallback((note) => {
    setNoteForm({
      title: note.title || '',
      description: note.description || '',
      fileType: note.fileType || 'pdf',
      pages: note.pages || '',
      course: note.course || '',
      fileUrl: note.fileUrl || ''
    });
  }, []);

  const editQuiz = useCallback((quiz) => {
    setQuizForm({
      title: quiz.title || '',
      description: quiz.description || '',
      course: quiz.course || '',
      timeLimit: quiz.timeLimit || 30,
      passingScore: quiz.passingScore || 70,
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
  }, []);

  const editCourse = useCallback((course) => {
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
      level: course.level || 'Beginner',
      price: course.price || '',
      image: course.image || '',
      features: course.features || [''],
      videos: course.videos || [],
      notes: course.notes || [],
      quizzes: course.quizzes || []
    });
  }, []);

  // Delete functions
  const deleteVideo = useCallback((videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const updatedVideos = videos.filter(video => video._id !== videoId);
      setVideos(updatedVideos);
      saveToLocalStorage('adminVideos', updatedVideos);
      addNotification('Video deleted successfully!', 'success');
    }
  }, [videos, addNotification]);

  const deleteNote = useCallback((noteId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const updatedNotes = notes.filter(note => note._id !== noteId);
      setNotes(updatedNotes);
      saveToLocalStorage('adminNotes', updatedNotes);
      addNotification('Document deleted successfully!', 'success');
    }
  }, [notes, addNotification]);

  const deleteQuiz = useCallback((quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const updatedQuizzes = quizzes.filter(quiz => quiz._id !== quizId);
      setQuizzes(updatedQuizzes);
      saveToLocalStorage('adminQuizzes', updatedQuizzes);
      addNotification('Quiz deleted successfully!', 'success');
    }
  }, [quizzes, addNotification]);

  const deleteCourse = useCallback((courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      const updatedCourses = courses.filter(course => course._id !== courseId);
      setCourses(updatedCourses);
      saveToLocalStorage('adminCourses', updatedCourses);
      addNotification('Course deleted successfully!', 'success');
    }
  }, [courses, addNotification]);

  // Approval functions
  const updateApprovalStatus = useCallback((approvalId, status, reason = '') => {
    const updatedApprovals = courseApprovals.map(approval => 
      approval._id === approvalId 
        ? { 
            ...approval, 
            status,
            updatedAt: new Date().toISOString(),
            reviewedBy: 'Admin',
            ...(reason && { rejectionReason: reason })
          }
        : approval
    );
    
    setCourseApprovals(updatedApprovals);
    saveToLocalStorage('courseApprovals', updatedApprovals);
    addNotification(`Course enrollment ${status}`, 'success');
  }, [courseApprovals, addNotification]);

  const bulkUpdateApprovals = useCallback((status, approvalIds) => {
    const confirmAction = window.confirm(`Are you sure you want to ${status} ${approvalIds.length} enrollment(s)?`);
    if (!confirmAction) return;

    approvalIds.forEach(approvalId => {
      updateApprovalStatus(approvalId, status);
    });
  }, [updateApprovalStatus]);

  // Review functions
  const approveReview = useCallback((reviewId) => {
    const updatedReviews = reviews.map(review => 
      review._id === reviewId 
        ? { ...review, status: 'approved', verified: true }
        : review
    );
    
    setReviews(updatedReviews);
    saveToLocalStorage('adminReviews', updatedReviews);
    addNotification('Review approved successfully!', 'success');
  }, [reviews, addNotification]);

  const rejectReview = useCallback((reviewId) => {
    const reason = prompt('Please provide reason for rejection:');
    if (!reason) return;

    const updatedReviews = reviews.map(review => 
      review._id === reviewId 
        ? { ...review, status: 'rejected', rejectionReason: reason }
        : review
    );
    
    setReviews(updatedReviews);
    saveToLocalStorage('adminReviews', updatedReviews);
    addNotification('Review rejected successfully!', 'success');
  }, [reviews, addNotification]);

  const deleteReview = useCallback((reviewId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (!confirmDelete) return;

    const updatedReviews = reviews.filter(review => review._id !== reviewId);
    setReviews(updatedReviews);
    saveToLocalStorage('adminReviews', updatedReviews);
    addNotification('Review deleted successfully!', 'success');
  }, [reviews, addNotification]);

  const forceSyncReviews = useCallback(() => {
    const { reviews: syncedReviews, newCount } = syncReviewsFromUserDashboard(reviews);
    if (newCount > 0) {
      setReviews(syncedReviews);
      saveToLocalStorage('adminReviews', syncedReviews);
      addNotification(`Synced ${newCount} new reviews from UserDashboard`, 'success');
    } else {
      addNotification('No new reviews found in UserDashboard', 'info');
    }
  }, [reviews, addNotification]);

  // Settings functions
  const handleSettingsChange = useCallback((key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const saveSettings = useCallback(async () => {
    try {
      saveToLocalStorage('adminSettings', settings);
      addNotification('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      addNotification('Failed to save settings', 'error');
    }
  }, [settings, addNotification]);

  const resetSettings = useCallback(() => {
    const confirmReset = window.confirm('Are you sure you want to reset all settings to default?');
    if (confirmReset) {
      const defaultSettings = {
        platformName: 'Clinigoal',
        platformEmail: 'admin@clinigoal.com',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        autoApproveReviews: false,
        notificationEmails: true,
        maintenanceMode: false,
        maxFileSize: 100,
        sessionTimeout: 60,
        theme: 'light'
      };
      setSettings(defaultSettings);
      addNotification('Settings reset to default', 'info');
    }
  }, [addNotification]);

  // Analytics functions
  const generateAnalyticsData = useCallback(() => {
    const revenueTrend = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthKey = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      
      const monthRevenue = payments
        .filter(p => {
          const paymentDate = new Date(p.timestamp);
          return paymentDate.getMonth() === date.getMonth() && 
                 paymentDate.getFullYear() === date.getFullYear();
        })
        .reduce((sum, payment) => {
          const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, '')) || 0;
          return sum + amount;
        }, 0);

      return {
        month: monthKey,
        revenue: monthRevenue,
        target: monthRevenue * (1 + Math.random() * 0.3)
      };
    });

    const studentGrowth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const monthKey = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
      
      const monthlyStudents = students.filter(s => {
        const joinDate = new Date(s.joinDate);
        return joinDate.getMonth() === date.getMonth() && 
               joinDate.getFullYear() === date.getFullYear();
      }).length;

      return {
        month: monthKey,
        students: monthlyStudents,
        growth: Math.round((monthlyStudents / Math.max(students.length, 1)) * 100)
      };
    });

    const coursePerformance = courses.map(course => ({
      name: course.title,
      students: course.students || 0,
      revenue: payments
        .filter(p => p.courseId === course._id)
        .reduce((sum, p) => sum + (parseFloat(p.amount.replace(/[^0-9.-]+/g, '')) || 0), 0),
      rating: course.rating || 4.5
    }));

    const enrollmentStats = [
      { category: 'Clinical Research', count: 45, color: '#3498db' },
      { category: 'Bioinformatics', count: 32, color: '#2ecc71' },
      { category: 'Medical Writing', count: 28, color: '#e74c3c' },
      { category: 'Regulatory Affairs', count: 19, color: '#f39c12' },
      { category: 'Pharmacovigilance', count: 15, color: '#9b59b6' }
    ];

    const platformMetrics = {
      completionRate: Math.round(Math.random() * 30 + 60),
      engagementScore: Math.round(Math.random() * 20 + 75),
      satisfactionRate: Math.round(Math.random() * 15 + 80),
      retentionRate: Math.round(Math.random() * 25 + 65)
    };

    setAnalyticsData({
      revenueTrend,
      studentGrowth,
      coursePerformance,
      enrollmentStats,
      platformMetrics
    });

    // Update stats
    const totalRevenue = payments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0);

    const successfulPayments = payments.filter(p => p.status === 'completed').length;
    const paymentSuccessRate = payments.length > 0 ? (successfulPayments / payments.length) * 100 : 0;

    setStats(prev => ({
      ...prev,
      totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
      totalStudents: students.length,
      totalCourses: courses.length,
      totalInstructors: instructors.length,
      paymentSuccessRate: Math.round(paymentSuccessRate)
    }));
  }, [payments, students, courses, instructors]);

  // Sync functions
  const enhancedSyncPaidEnrollments = useCallback(() => {
    const { updatedApprovals, newCount } = syncPaidEnrollments(courseApprovals);
    if (newCount > 0) {
      setCourseApprovals(updatedApprovals);
      saveToLocalStorage('courseApprovals', updatedApprovals);
      addNotification(`Synced ${newCount} new paid enrollments from UserDashboard`, 'success');
    } else {
      addNotification('No new paid enrollments found in UserDashboard', 'info');
    }
    return newCount;
  }, [courseApprovals, addNotification]);

  const enhancedSyncAllUserDashboardPayments = useCallback(() => {
    return syncAllUserDashboardPayments();
  }, []);

  // Initialize data on mount
  useEffect(() => {
    const savedSettings = loadFromLocalStorage('adminSettings');
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  return {
    // State
    payments, setPayments,
    courses, setCourses,
    students, setStudents,
    instructors, setInstructors,
    reviews, setReviews,
    videos, setVideos,
    notes, setNotes,
    quizzes, setQuizzes,
    courseApprovals, setCourseApprovals,
    stats, setStats,
    analyticsData, setAnalyticsData,
    settings, setSettings,
    loading, setLoading,
    operationLoading, setOperationLoading,
    
    // Form states
    videoForm, setVideoForm,
    noteForm, setNoteForm,
    quizForm, setQuizForm,
    courseForm, setCourseForm,
    
    // Actions
    fetchPayments, fetchCourses, fetchStudents, fetchInstructors,
    fetchReviews, fetchVideos, fetchNotes, fetchQuizzes, fetchCourseApprovals,
    syncPaidEnrollments: enhancedSyncPaidEnrollments,
    syncAllUserDashboardPayments: enhancedSyncAllUserDashboardPayments,
    handleVideoFormSubmit, handleNoteFormSubmit, handleQuizFormSubmit, handleCourseFormSubmit,
    editVideo, editNote, editQuiz, editCourse,
    deleteVideo, deleteNote, deleteQuiz, deleteCourse,
    updateApprovalStatus, bulkUpdateApprovals,
    approveReview, rejectReview, deleteReview, forceSyncReviews,
    handleSettingsChange, saveSettings, resetSettings,
    formatPaymentTime, getDetailedTimeInfo, getPaymentDayInfo,
    generateAnalyticsData
  };
};