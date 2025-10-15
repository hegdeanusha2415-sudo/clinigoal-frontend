// src/utils/sharedData.js

// Shared data structure for user and admin dashboards
export const sharedData = {
  // User data
  users: [],
  userProgress: [],
  userCertificates: [],
  userEnrollments: [],
  paidCourses: new Set(),
  
  // Course completion data
  watchedVideos: [],
  completedNotes: [],
  completedQuizzes: [],
  
  // Student reviews
  studentReviews: [],
  
  // Initialize data
  init() {
    this.loadFromLocalStorage();
  },
  
  // Load data from localStorage
  loadFromLocalStorage() {
    try {
      // User data
      const storedUsers = localStorage.getItem('uniqueUsers');
      this.users = storedUsers ? JSON.parse(storedUsers).map(email => ({
        email,
        name: email.split('@')[0],
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginCount: 1
      })) : [];

      this.userProgress = JSON.parse(localStorage.getItem('userProgress') || '[]');
      this.userCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]');
      this.userEnrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
      
      // Paid courses
      const paidCoursesData = JSON.parse(localStorage.getItem('paidCourses') || '[]');
      this.paidCourses = new Set(paidCoursesData);
      
      // Completion data
      this.watchedVideos = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
      this.completedNotes = JSON.parse(localStorage.getItem('completedNotes') || '[]');
      this.completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
      
      // Reviews
      this.studentReviews = JSON.parse(localStorage.getItem('studentReviews') || '[]');

      // Migrate existing data from userLoginLogs
      const userLogs = JSON.parse(localStorage.getItem('userLoginLogs') || '[]');
      userLogs.forEach(log => {
        this.addUser({ email: log.email, name: log.name });
        this.updateUserLogin(log.email);
      });

    } catch (error) {
      console.error('Error loading shared data:', error);
      this.resetData();
    }
  },
  
  // Save data to localStorage
  saveToLocalStorage() {
    try {
      localStorage.setItem('uniqueUsers', JSON.stringify(this.users.map(user => user.email)));
      localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
      localStorage.setItem('userCertificates', JSON.stringify(this.userCertificates));
      localStorage.setItem('userEnrollments', JSON.stringify(this.userEnrollments));
      localStorage.setItem('paidCourses', JSON.stringify([...this.paidCourses]));
      localStorage.setItem('watchedVideos', JSON.stringify(this.watchedVideos));
      localStorage.setItem('completedNotes', JSON.stringify(this.completedNotes));
      localStorage.setItem('completedQuizzes', JSON.stringify(this.completedQuizzes));
      localStorage.setItem('studentReviews', JSON.stringify(this.studentReviews));
    } catch (error) {
      console.error('Error saving shared data:', error);
    }
  },
  
  // Reset data
  resetData() {
    this.users = [];
    this.userProgress = [];
    this.userCertificates = [];
    this.userEnrollments = [];
    this.paidCourses = new Set();
    this.watchedVideos = [];
    this.completedNotes = [];
    this.completedQuizzes = [];
    this.studentReviews = [];
    this.saveToLocalStorage();
  },
  
  // User management
  addUser(userData) {
    if (!this.users.find(user => user.email === userData.email)) {
      this.users.push({
        id: Date.now().toString(),
        ...userData,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginCount: 1
      });
      this.saveToLocalStorage();
    }
  },
  
  updateUserLogin(email) {
    const user = this.users.find(user => user.email === email);
    if (user) {
      user.lastLogin = new Date().toISOString();
      user.loginCount = (user.loginCount || 0) + 1;
      this.saveToLocalStorage();
    }
  },
  
  // Enrollment management
  enrollUserInCourse(userEmail, courseId, courseData) {
    const enrollment = {
      id: Date.now().toString(),
      userEmail,
      courseId,
      courseData,
      enrollmentDate: new Date().toISOString(),
      progress: 0,
      lastAccessed: new Date().toISOString()
    };
    
    this.userEnrollments.push(enrollment);
    this.saveToLocalStorage();
    return enrollment;
  },
  
  markCourseAsPaid(userEmail, courseId) {
    const key = `${userEmail}_${courseId}`;
    this.paidCourses.add(key);
    this.saveToLocalStorage();
  },
  
  isCoursePaid(userEmail, courseId) {
    const key = `${userEmail}_${courseId}`;
    return this.paidCourses.has(key);
  },
  
  // Progress tracking
  updateUserProgress(userEmail, courseId, progressData) {
    let progress = this.userProgress.find(
      p => p.userEmail === userEmail && p.courseId === courseId
    );
    
    if (!progress) {
      progress = {
        id: Date.now().toString(),
        userEmail,
        courseId,
        ...progressData,
        lastUpdated: new Date().toISOString()
      };
      this.userProgress.push(progress);
    } else {
      Object.assign(progress, progressData, {
        lastUpdated: new Date().toISOString()
      });
    }
    
    this.saveToLocalStorage();
    return progress;
  },
  
  // Certificate management
  generateCertificate(userEmail, courseId, certificateData) {
    const certificate = {
      id: Date.now().toString(),
      userEmail,
      courseId,
      ...certificateData,
      issueDate: new Date().toISOString(),
      certificateId: `CLG-${courseId}-${Date.now().toString().slice(-6)}`
    };
    
    this.userCertificates.push(certificate);
    this.saveToLocalStorage();
    return certificate;
  },
  
  // Review management
  addReview(reviewData) {
    const review = {
      _id: Date.now().toString(),
      ...reviewData,
      createdAt: new Date().toISOString(),
      status: 'approved'
    };
    
    this.studentReviews.push(review);
    this.saveToLocalStorage();
    return review;
  },
  
  deleteReview(reviewId) {
    this.studentReviews = this.studentReviews.filter(review => review._id !== reviewId);
    this.saveToLocalStorage();
  },
  
  updateReview(reviewId, updates) {
    const review = this.studentReviews.find(review => review._id === reviewId);
    if (review) {
      Object.assign(review, updates, {
        updatedAt: new Date().toISOString()
      });
      this.saveToLocalStorage();
    }
    return review;
  },
  
  // Analytics and statistics
  getStatistics() {
    const totalUsers = this.users.length;
    const totalEnrollments = this.userEnrollments.length;
    const totalCertificates = this.userCertificates.length;
    const totalReviews = this.studentReviews.length;
    
    // Calculate average rating
    const averageRating = this.studentReviews.length > 0 
      ? (this.studentReviews.reduce((sum, review) => sum + (review.rating || 0), 0) / this.studentReviews.length).toFixed(1)
      : 0;
    
    // Course popularity
    const courseEnrollments = {};
    this.userEnrollments.forEach(enrollment => {
      const courseName = enrollment.courseData?.title || enrollment.courseId;
      courseEnrollments[courseName] = (courseEnrollments[courseName] || 0) + 1;
    });
    
    // Recent activity
    const recentLogins = this.users
      .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
      .slice(0, 10);
    
    return {
      totalUsers,
      totalEnrollments,
      totalCertificates,
      totalReviews,
      averageRating,
      courseEnrollments,
      recentLogins,
      userProgress: this.userProgress,
      certificates: this.userCertificates,
      reviews: this.studentReviews
    };
  },
  
  // Get user-specific data
  getUserData(userEmail) {
    const user = this.users.find(user => user.email === userEmail);
    const enrollments = this.userEnrollments.filter(e => e.userEmail === userEmail);
    const certificates = this.userCertificates.filter(c => c.userEmail === userEmail);
    const progress = this.userProgress.filter(p => p.userEmail === userEmail);
    
    return {
      user,
      enrollments,
      certificates,
      progress
    };
  },
  
  // Get all data for admin
  getAdminData() {
    return {
      users: this.users,
      enrollments: this.userEnrollments,
      certificates: this.userCertificates,
      progress: this.userProgress,
      reviews: this.studentReviews,
      statistics: this.getStatistics()
    };
  },

  // Get user login logs for compatibility
  getUserLoginLogs() {
    return this.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      loginTime: new Date(user.lastLogin).toLocaleString(),
      timestamp: new Date(user.lastLogin).getTime()
    })).sort((a, b) => b.timestamp - a.timestamp);
  },

  // Get unique users count for compatibility
  getUniqueUsersCount() {
    return this.users.length;
  }
};

// Initialize shared data
sharedData.init();

export default sharedData;