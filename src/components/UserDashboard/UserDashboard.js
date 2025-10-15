import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserDashboard.css';
import io from 'socket.io-client';

export default function UserDashboard() {
  const [userData, setUserData] = useState({
    userName: 'User Name',
    userEmail: 'user@example.com',
    userId: ''
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseContent, setCourseContent] = useState({
    videos: [],
    notes: [],
    quizzes: []
  });
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [completedNotes, setCompletedNotes] = useState([]);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  
  // Profile photo states
  const [profilePhoto, setProfilePhoto] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Quiz timer and scoring states
  const [quizTimer, setQuizTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState({});
  const [questionTimes, setQuestionTimes] = useState({});
  
  // Student review form state
  const [reviewForm, setReviewForm] = useState({
    courseId: '',
    rating: 5,
    reviewText: '',
    anonymous: false
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);
  
  // Enrollment form state
  const [enrollmentForm, setEnrollmentForm] = useState({
    courseId: '',
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    paymentMethod: 'razorpay',
    agreeToTerms: false
  });
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [enrollmentCourse, setEnrollmentCourse] = useState(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [paidCourses, setPaidCourses] = useState(new Set());

  // Certificate generation state
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

  // Certificate color scheme state
  const [certificateColor, setCertificateColor] = useState('blue');

  // Payment receipt state
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  // Socket for real-time communication
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  // New state for pending approvals
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Certificate color schemes
  const certificateColors = {
    blue: {
      primary: '#3498db',
      secondary: '#2980b9',
      accent: '#1f618d',
      gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
      border: '#3498db'
    },
    green: {
      primary: '#27ae60',
      secondary: '#219653',
      accent: '#1e8449',
      gradient: 'linear-gradient(135deg, #27ae60 0%, #219653 100%)',
      border: '#27ae60'
    },
    purple: {
      primary: '#9b59b6',
      secondary: '#8e44ad',
      accent: '#7d3c98',
      gradient: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)',
      border: '#9b59b6'
    },
    gold: {
      primary: '#f39c12',
      secondary: '#e67e22',
      accent: '#d35400',
      gradient: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
      border: '#f39c12'
    },
    red: {
      primary: '#e74c3c',
      secondary: '#c0392b',
      accent: '#a93226',
      gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
      border: '#e74c3c'
    }
  };

  // ============================
  // FIXED COURSE FETCHING FUNCTIONS
  // ============================

  // Enhanced course fetching with better error handling and fallbacks
  const fetchCoursesFromAdminDashboard = async () => {
    try {
      console.log("🔄 Starting course fetch process...");
      setCoursesLoading(true);
      
      let courses = [];
      let fetchMethod = '';

      // Define default courses as fallback
      const defaultCourses = [
        {
          _id: '1',
          title: "Clinical Research Associate",
          description: "Become a certified Clinical Research Associate with comprehensive training in monitoring, compliance, and trial management.",
          instructor: "Dr. Ananya Sharma",
          duration: "16 weeks",
          level: "Advanced",
          price: "₹1,29,999",
          image: "https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg",
          features: [
            "Clinical Trial Monitoring",
            "Regulatory Compliance",
            "Site Management",
            "ICH-GCP Certification"
          ]
        },
        {
          _id: '2',
          title: "Bioinformatics & Genomics",
          description: "Master computational biology, genomic data analysis, and next-generation sequencing technologies.",
          instructor: "Prof. Rajiv Menon",
          duration: "20 weeks",
          level: "Intermediate",
          price: "₹1,49,999",
          image: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg",
          features: [
            "Genomic Data Analysis",
            "Python for Bioinformatics",
            "NGS Data Processing",
            "Drug Discovery Tools"
          ]
        },
        {
          _id: '3',
          title: "Medical Writing & Documentation",
          description: "Master the art of scientific writing for clinical research protocols, reports, and regulatory submissions.",
          instructor: "Dr. Priya Mehta",
          duration: "12 weeks",
          level: "Intermediate",
          price: "₹89,999",
          image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
          features: [
            "Protocol Writing",
            "Clinical Study Reports",
            "Regulatory Documentation",
            "Medical Communication"
          ]
        },
        {
          _id: '4',
          title: "Regulatory Affairs in Clinical Research",
          description: "Comprehensive training in regulatory submissions, compliance, and approval processes for clinical trials.",
          instructor: "Dr. Sameer Joshi",
          duration: "18 weeks",
          level: "Advanced",
          price: "₹1,19,999",
          image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg",
          features: [
            "FDA/EMA Regulations",
            "IND/NDA Submissions",
            "Clinical Trial Applications",
            "Compliance Monitoring"
          ]
        },
        {
          _id: '5',
          title: "Pharmacovigilance & Drug Safety",
          description: "Learn drug safety monitoring, adverse event reporting, and risk management in clinical development.",
          instructor: "Dr. Neha Kapoor",
          duration: "14 weeks",
          level: "Intermediate",
          price: "₹99,999",
          image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
          features: [
            "Adverse Event Reporting",
            "Risk Management Plans",
            "Safety Database Management",
            "Periodic Safety Reports"
          ]
        }
      ];

      // Method 1: Try AdminDashboard API with timeout
      try {
        console.log("📡 Attempting API fetch...");
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch('http://localhost:5000/api/admin/courses', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          courses = await response.json();
          fetchMethod = 'API';
          console.log("✅ Courses fetched from API:", courses.length);
          
          // Cache in localStorage for future use
          try {
            localStorage.setItem('adminCourses', JSON.stringify(courses));
            localStorage.setItem('adminCourses_timestamp', Date.now().toString());
          } catch (storageError) {
            console.warn("⚠ Could not cache courses in localStorage");
          }
        } else {
          throw new Error(`API returned ${response.status}`);
        }
      } catch (apiError) {
        console.log("❌ API fetch failed:", apiError.message);
        
        // Method 2: Try localStorage cache
        try {
          const cachedCourses = localStorage.getItem('adminCourses');
          const cacheTimestamp = localStorage.getItem('adminCourses_timestamp');
          
          // Use cache if it's less than 1 hour old
          if (cachedCourses && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 3600000) {
            courses = JSON.parse(cachedCourses);
            fetchMethod = 'localStorage Cache';
            console.log("✅ Courses loaded from cache:", courses.length);
          } else {
            throw new Error('No valid cache available');
          }
        } catch (cacheError) {
          console.log("❌ Cache load failed:", cacheError.message);
          
          // Method 3: Use default courses
          courses = defaultCourses;
          fetchMethod = 'Default Courses';
          console.log("✅ Using default courses:", courses.length);
          
          // Cache the default courses
          try {
            localStorage.setItem('adminCourses', JSON.stringify(courses));
            localStorage.setItem('adminCourses_timestamp', Date.now().toString());
          } catch (storageError) {
            console.warn("⚠ Could not cache default courses");
          }
        }
      }

      // Validate courses data
      if (!Array.isArray(courses) || courses.length === 0) {
        console.warn("⚠ Invalid courses data, using defaults");
        courses = defaultCourses;
        fetchMethod = 'Fallback Defaults';
      }

      console.log(`✅ Final courses loaded (${fetchMethod}):`, courses.length);
      setAvailableCourses(courses);
      return courses;

    } catch (error) {
      console.error('❌ Critical error in course fetching:', error);
      
      // Ultimate fallback
      const fallbackCourses = [
        {
          _id: '1',
          title: "Clinical Research Associate",
          description: "Become a certified Clinical Research Associate with comprehensive training.",
          instructor: "Dr. Ananya Sharma",
          duration: "16 weeks",
          level: "Advanced",
          price: "₹1,29,999",
          image: "https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg",
          features: ["Clinical Trial Monitoring", "Regulatory Compliance"]
        }
      ];
      
      setAvailableCourses(fallbackCourses);
      return fallbackCourses;
    } finally {
      setCoursesLoading(false);
      console.log("🏁 Course fetching completed");
    }
  };

  // Enhanced fetchCourseContent with better error handling
  const fetchCourseContent = async (courseId) => {
    if (!courseId) {
      console.error("❌ No courseId provided to fetchCourseContent");
      return;
    }

    console.log("🔄 Fetching course content for:", courseId);
    
    try {
      let videos = [];
      let notes = [];
      let quizzes = [];

      // Try to fetch from AdminDashboard APIs with timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const [videosResponse, notesResponse, quizzesResponse] = await Promise.allSettled([
          fetch(`http://localhost:5000/api/admin/videos/course/${courseId}`, { signal: controller.signal }),
          fetch(`http://localhost:5000/api/admin/notes/course/${courseId}`, { signal: controller.signal }),
          fetch(`http://localhost:5000/api/admin/quizzes/course/${courseId}`, { signal: controller.signal })
        ]);

        clearTimeout(timeoutId);

        if (videosResponse.status === 'fulfilled' && videosResponse.value.ok) {
          videos = await videosResponse.value.json();
        }
        if (notesResponse.status === 'fulfilled' && notesResponse.value.ok) {
          notes = await notesResponse.value.json();
        }
        if (quizzesResponse.status === 'fulfilled' && quizzesResponse.value.ok) {
          quizzes = await quizzesResponse.value.json();
        }

      } catch (apiError) {
        console.log("⚠ AdminDashboard APIs not available, checking localStorage...");
      }

      // If no content found, use fallback content
      if (videos.length === 0 && notes.length === 0 && quizzes.length === 0) {
        console.log("📋 Using fallback content for course:", courseId);
        
        videos = [
          {
            _id: `video_${courseId}_1`,
            title: "Introduction to Course",
            description: "Get started with the course overview and learning objectives",
            duration: "45:30",
            course: courseId,
            module: "Module 1: Fundamentals",
            order: 1,
            videoUrl: "https://example.com/videos/introduction.mp4",
            thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            views: 0,
            likes: 0,
            createdAt: new Date().toISOString()
          }
        ];

        notes = [
          {
            _id: `note_${courseId}_1`,
            title: "Course Study Guide",
            description: "Comprehensive study material for the entire course",
            fileType: "pdf",
            pages: "45",
            course: courseId,
            fileUrl: "https://example.com/notes/study-guide.pdf",
            downloads: 0,
            createdAt: new Date().toISOString()
          }
        ];

        quizzes = [
          {
            _id: `quiz_${courseId}_1`,
            title: "Module 1 Assessment",
            description: "Test your knowledge from the first module",
            course: courseId,
            timeLimit: 30,
            passingScore: 70,
            questions: [
              {
                questionText: "What is the primary goal of this course?",
                options: [
                  { optionText: "To provide comprehensive knowledge and skills", isCorrect: true },
                  { optionText: "To complete quickly", isCorrect: false },
                  { optionText: "To get a certificate only", isCorrect: false },
                  { optionText: "To learn basic concepts only", isCorrect: false }
                ]
              }
            ],
            attempts: 0,
            averageScore: 0,
            createdAt: new Date().toISOString()
          }
        ];
      }

      console.log("✅ Course content loaded:", {
        videos: videos.length,
        notes: notes.length,
        quizzes: quizzes.length
      });

      setCourseContent({ videos, notes, quizzes });

    } catch (error) {
      console.error('❌ Error fetching course content:', error);
      // Set minimal fallback content
      setCourseContent({
        videos: [],
        notes: [],
        quizzes: []
      });
    }
  };

  // Server availability check
  const checkServerAvailability = async () => {
    try {
      console.log('🔍 Checking server availability...');
      
      const response = await fetch('http://localhost:5000/socket.io/?EIO=4&transport=polling', {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        const data = await response.text();
        console.log('✅ Server is reachable');
        return true;
      } else {
        console.error('❌ Server responded with status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Server is not reachable:', error.message);
      console.log('🔄 Using localStorage fallback mode');
      return false;
    }
  };

  // Enhanced socket initialization with error handling
  const initializeSocket = async () => {
    try {
      console.log('🔄 Initializing Socket.IO connection...');
      
      const isServerAvailable = await checkServerAvailability();
      
      if (!isServerAvailable) {
        setConnectionStatus('error');
        console.log('🚫 Socket.IO server not available, using fallback mode');
        return null;
      }

      const newSocket = io('http://localhost:5000', {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionAttempts: 3,
        reconnectionDelay: 2000
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('✅ Successfully connected to Socket.IO server');
        setConnectionStatus('connected');
      });

      newSocket.on('connect_error', (err) => {
        console.error('❌ Socket.IO connection error:', {
          message: err.message,
          description: err.description
        });
        setConnectionStatus('error');
        
        // Handle specific error types
        if (err.message.includes('xhr poll error')) {
          console.log('🔧 Polling error - server might be unavailable');
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 Socket disconnected:', reason);
        setConnectionStatus('disconnected');
      });

      newSocket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}`);
        setConnectionStatus('connecting');
      });

      newSocket.on('reconnect_failed', () => {
        console.error('❌ All reconnection attempts failed');
        setConnectionStatus('error');
      });

      return newSocket;

    } catch (error) {
      console.error('❌ Failed to initialize socket:', error);
      setConnectionStatus('error');
      return null;
    }
  };

  // Handle approval updates from socket
  const handleApprovalUpdate = (approvalData) => {
    console.log('🔄 Approval status updated:', approvalData);
    
    if (approvalData.status === 'approved') {
      // Remove from pending approvals
      const updatedPendingApprovals = pendingApprovals.filter(
        approval => approval.courseId !== approvalData.courseId
      );
      setPendingApprovals(updatedPendingApprovals);
      localStorage.setItem('pendingApprovals', JSON.stringify(updatedPendingApprovals));
      
      // Add to approved courses
      const updatedApprovedCourses = new Set([...paidCourses, approvalData.courseId]);
      setPaidCourses(updatedApprovedCourses);
      localStorage.setItem('approvedCourses', JSON.stringify([...updatedApprovedCourses]));
      
      // Show success notification
      alert(`🎉 Your enrollment for "${approvalData.courseTitle}" has been approved! You can now access the course content.`);
    } else if (approvalData.status === 'rejected') {
      // Remove from pending approvals
      const updatedPendingApprovals = pendingApprovals.filter(
        approval => approval.courseId !== approvalData.courseId
      );
      setPendingApprovals(updatedPendingApprovals);
      localStorage.setItem('pendingApprovals', JSON.stringify(updatedPendingApprovals));
      
      // Show rejection notification
      alert(`❌ Your enrollment for "${approvalData.courseTitle}" has been rejected. Please contact support for more information.`);
    }
  };

  // Image compression helper function
  const compressImage = (src, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      
      img.onerror = (error) => reject(error);
    });
  };

  // Check if course is approved
  const isCourseApproved = (courseId) => {
    return paidCourses.has(courseId);
  };

  // Check approval status
  const getCourseApprovalStatus = (courseId) => {
    const pendingApproval = pendingApprovals.find(approval => approval.courseId === courseId);
    
    if (isCourseApproved(courseId)) {
      return 'approved';
    } else if (pendingApproval) {
      return 'pending';
    } else {
      return 'not_enrolled';
    }
  };

  // Enhanced Payment recording function with real-time emission and fallback
  const recordPayment = async (course, amount, paymentMethod) => {
    try {
      const paymentData = {
        _id: `pay_${Date.now()}`,
        courseId: course._id,
        courseTitle: course.title,
        studentName: userData.userName,
        studentEmail: userData.userEmail,
        amount: amount,
        paymentMethod: paymentMethod,
        status: 'pending_approval',
        timestamp: new Date().toISOString(),
        transactionId: `TXN_${Date.now()}`,
        receiptNumber: `RCPT-${Date.now().toString().slice(-8)}`
      };

      console.log('💰 Recording payment with pending approval:', paymentData);

      // Save to localStorage first (always available)
      const existingPayments = JSON.parse(localStorage.getItem('userPayments') || '[]');
      localStorage.setItem('userPayments', JSON.stringify([...existingPayments, paymentData]));
      
      // Also save to a separate admin payments storage for approval
      const adminPayments = JSON.parse(localStorage.getItem('adminPayments') || '[]');
      localStorage.setItem('adminPayments', JSON.stringify([...adminPayments, paymentData]));
      
      // Add to pending approvals
      const approvalData = {
        paymentId: paymentData._id,
        courseId: course._id,
        courseTitle: course.title,
        studentName: userData.userName,
        studentEmail: userData.userEmail,
        paymentDate: paymentData.timestamp,
        status: 'pending'
      };
      
      const updatedPendingApprovals = [...pendingApprovals, approvalData];
      setPendingApprovals(updatedPendingApprovals);
      localStorage.setItem('pendingApprovals', JSON.stringify(updatedPendingApprovals));
      
      // Emit real-time payment event to server only if socket is connected
      if (socket && socket.connected) {
        socket.emit('newPayment', paymentData);
        socket.emit('newApprovalRequest', approvalData);
        console.log('📡 Payment data emitted via socket');
      } else {
        console.log('⚠ Socket not connected, storing locally only');
      }
      
      // Try to send to backend if available
      try {
        const response = await fetch('http://localhost:5000/api/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentData)
        });
        
        if (response.ok) {
          console.log('✅ Payment recorded in database');
        }
      } catch (error) {
        console.log('⚠ Payment API not available, stored locally');
      }
      
      return paymentData;
    } catch (error) {
      console.error('❌ Error recording payment:', error);
      throw error;
    }
  };

  // Show payment receipt
  const showPaymentReceipt = (paymentData) => {
    setPaymentReceipt({
      ...paymentData,
      status: 'pending_approval',
      statusMessage: 'Waiting for admin approval'
    });
    setShowReceiptModal(true);
  };

  // Download receipt as PDF
  const downloadReceiptAsPDF = (receipt) => {
    const isPending = receipt.status === 'pending_approval';
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${receipt.courseTitle}</title>
        <style>
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 40px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .receipt-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 600px;
            width: 100%;
          }
          .receipt-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 20px;
          }
          .receipt-title {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
          }
          .receipt-subtitle {
            font-size: 16px;
            color: #666;
          }
          .receipt-logo {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
          }
          .receipt-body {
            margin: 30px 0;
          }
          .receipt-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .receipt-label {
            font-weight: bold;
            color: #333;
          }
          .receipt-value {
            color: #666;
          }
          .receipt-total {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-top: 20px;
          }
          .receipt-footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .status-pending {
            color: #856404;
            font-weight: bold;
            background: #fff3cd;
            padding: 4px 8px;
            border-radius: 4px;
          }
          .status-completed {
            color: #27ae60;
            font-weight: bold;
          }
          .thank-you {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #e8f5e8;
            border-radius: 5px;
            color: #27ae60;
          }
          .pending-notice {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: #fff3cd;
            border-radius: 5px;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="receipt-header">
            <div class="receipt-logo">CLINIGOAL</div>
            <div class="receipt-title">PAYMENT RECEIPT</div>
            <div class="receipt-subtitle">Official Payment Confirmation</div>
          </div>
          
          ${isPending ? `
          <div class="pending-notice">
            <h3>⏳ Payment Received - Pending Approval</h3>
            <p>Your enrollment is pending admin approval. You will be notified once approved.</p>
          </div>
          ` : `
          <div class="thank-you">
            <h3>Thank You for Your Payment!</h3>
            <p>Your enrollment has been confirmed successfully.</p>
          </div>
          `}
          
          <div class="receipt-body">
            <div class="receipt-row">
              <span class="receipt-label">Receipt Number:</span>
              <span class="receipt-value">${receipt.receiptNumber}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Transaction ID:</span>
              <span class="receipt-value">${receipt.transactionId}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Date & Time:</span>
              <span class="receipt-value">${new Date(receipt.timestamp).toLocaleString()}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Course:</span>
              <span class="receipt-value">${receipt.courseTitle}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Student Name:</span>
              <span class="receipt-value">${receipt.studentName}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Student Email:</span>
              <span class="receipt-value">${receipt.studentEmail}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Payment Method:</span>
              <span class="receipt-value">${receipt.paymentMethod}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Status:</span>
              <span class="receipt-value ${isPending ? 'status-pending' : 'status-completed'}">${isPending ? 'Pending Approval' : receipt.status}</span>
            </div>
            
            <div class="receipt-total">
              <div class="receipt-row">
                <span class="receipt-label">Total Amount Paid:</span>
                <span class="receipt-value" style="font-size: 18px; font-weight: bold; color: #667eea;">${receipt.amount}</span>
              </div>
            </div>
          </div>
          
          <div class="receipt-footer">
            <p>This is an computer-generated receipt. No signature is required.</p>
            <p>For any queries, contact support@clinigoal.com</p>
          </div>
        </div>
      </body>
      </html>
    `);
    
    receiptWindow.document.close();
    
    setTimeout(() => {
      receiptWindow.print();
    }, 500);
  };

  // Enhanced initialization with proper sequencing
  useEffect(() => {
    let isMounted = true;

    const initializeDashboard = async () => {
      try {
        console.log("🚀 Initializing User Dashboard...");
        
        // Step 1: Load basic user data (synchronous)
        const userName = localStorage.getItem('userName') || 'Student';
        const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
        const userId = localStorage.getItem('userId') || '';

        if (isMounted) {
          setUserData({ userName, userEmail, userId });
        }

        // Step 2: Load profile photo
        const savedProfilePhoto = sessionStorage.getItem('userProfilePhoto') || 
                                localStorage.getItem('userProfilePhoto');
        if (isMounted && savedProfilePhoto) {
          setProfilePhoto(savedProfilePhoto);
        }

        // Step 3: Load user progress data
        const savedWatchedVideos = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
        const savedCompletedNotes = JSON.parse(localStorage.getItem('completedNotes') || '[]');
        const savedCompletedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
        const savedPendingApprovals = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
        const savedApprovedCourses = JSON.parse(localStorage.getItem('approvedCourses') || '[]');

        if (isMounted) {
          setWatchedVideos(savedWatchedVideos);
          setCompletedNotes(savedCompletedNotes);
          setCompletedQuizzes(savedCompletedQuizzes);
          setPendingApprovals(savedPendingApprovals);
          setPaidCourses(new Set(savedApprovedCourses));
        }

        // Step 4: Load certificates
        const savedCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]');
        if (isMounted) {
          setCertificates(savedCertificates);
        }

        // Step 5: Start with no enrolled courses
        if (isMounted) {
          setEnrolledCourses([]);
        }
        localStorage.setItem('userEnrollments', JSON.stringify([]));

        // Step 6: Fetch courses (this is async but we handle it separately)
        await fetchCoursesFromAdminDashboard();

        // Step 7: Load reviews
        try {
          let loadedReviews = [];
          const reviewsResponse = await fetch('http://localhost:5000/api/reviews');
          if (reviewsResponse.ok) {
            loadedReviews = await reviewsResponse.json();
          } else {
            throw new Error('API not available');
          }
          
          if (isMounted) {
            setReviews(loadedReviews);
          }
        } catch (error) {
          const localReviews = JSON.parse(localStorage.getItem('clinigoalReviews') || '[]');
          if (isMounted) {
            setReviews(localReviews.length > 0 ? localReviews : []);
          }
        }

      } catch (error) {
        console.error('❌ Error in dashboard initialization:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log("✅ Dashboard initialization complete");
        }
      }
    };

    // Initialize socket connection separately to not block the main initialization
    const setupSocket = async () => {
      try {
        const newSocket = await initializeSocket();
        if (newSocket && isMounted) {
          setSocket(newSocket);

          // Add real-time listener for approval updates
          newSocket.on('approvalUpdated', handleApprovalUpdate);

          newSocket.on('paymentStatusUpdate', (updatedPayment) => {
            console.log('🔄 Payment status updated:', updatedPayment);
          });
        }
      } catch (socketError) {
        console.error('❌ Socket initialization failed:', socketError);
      }
    };

    initializeDashboard();
    setupSocket();

    return () => {
      isMounted = false;
      console.log("🧹 Cleaning up dashboard...");
      if (socket) {
        socket.off('approvalUpdated', handleApprovalUpdate);
        socket.close();
      }
    };
  }, []);

  // Add this new function to retry course loading
  const retryCourseLoading = async () => {
    console.log("🔄 Retrying course loading...");
    setCoursesLoading(true);
    await fetchCoursesFromAdminDashboard();
  };

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Profile photo functions with compression and error handling
  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size exceeds 2MB. Please choose a smaller image.');
        return;
      }
      
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      setIsUploading(true);
      
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const originalDataUrl = event.target.result;
            const compressedDataUrl = await compressImage(originalDataUrl, 200, 200, 0.7);
            
            const compressedSize = Math.round(compressedDataUrl.length * 3/4);
            if (compressedSize > 500 * 1024) {
              alert('Compressed image is still too large. Please choose a smaller image.');
              setIsUploading(false);
              return;
            }
            
            setProfilePhoto(compressedDataUrl);
            
            try {
              sessionStorage.setItem('userProfilePhoto', compressedDataUrl);
            } catch (sessionStorageError) {
              console.error('Session storage error:', sessionStorageError);
              try {
                localStorage.setItem('userProfilePhoto', compressedDataUrl);
              } catch (localStorageError) {
                console.error('Local storage error:', localStorageError);
                alert('Unable to save profile photo to browser storage. The photo will only be available during this session.');
              }
            }
          } catch (error) {
            console.error('Image processing error:', error);
            alert('Error processing image. Please try a different image.');
          } finally {
            setIsUploading(false);
          }
        };
        
        reader.onerror = () => {
          setIsUploading(false);
          alert('Error reading file. Please try again.');
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        setIsUploading(false);
        console.error('Upload error:', error);
        alert('Error uploading image. Please try again.');
      }
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto('');
    try {
      sessionStorage.removeItem('userProfilePhoto');
      localStorage.removeItem('userProfilePhoto');
    } catch (error) {
      console.error('Error removing photo from storage:', error);
    }
  };

  // Calculate course completion percentage
  const calculateCourseCompletion = (courseId) => {
    const courseVideos = courseContent.videos.length;
    const courseNotes = courseContent.notes.length;
    const courseQuizzes = courseContent.quizzes.length;
    
    const totalItems = courseVideos + courseNotes + courseQuizzes;
    if (totalItems === 0) return 0;
    
    const watchedVideosCount = watchedVideos.filter(videoId => 
      courseContent.videos.some(video => video._id === videoId)
    ).length;
    
    const completedNotesCount = completedNotes.filter(noteId => 
      courseContent.notes.some(note => note._id === noteId)
    ).length;
    
    const completedQuizzesCount = completedQuizzes.filter(quizId => 
      courseContent.quizzes.some(quiz => quiz._id === quizId)
    ).length;
    
    const completedItems = watchedVideosCount + completedNotesCount + completedQuizzesCount;
    
    return Math.round((completedItems / totalItems) * 100);
  };

  // Check if course is fully completed
  const isCourseCompleted = (courseId) => {
    return calculateCourseCompletion(courseId) === 100;
  };

  // Calculate progress statistics from real data
  const calculateStats = () => {
    const totalCourses = enrolledCourses.length + paidCourses.size;
    const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
    const averageProgress = totalCourses > 0 
      ? Math.round(enrolledCourses.reduce((acc, course) => acc + course.progress, 0) / totalCourses)
      : 0;
    
    const totalLearningTime = enrolledCourses.reduce((acc, course) => {
      return acc + (course.timeSpent || 0);
    }, 0);
    
    const hours = Math.floor(totalLearningTime / 60);
    const minutes = totalLearningTime % 60;
    const learningTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    return { totalCourses, completedCourses, averageProgress, learningTime };
  };

  const { totalCourses, completedCourses, averageProgress, learningTime } = calculateStats();

  const ProgressBar = ({ progress }) => (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="progress-text">{progress}%</span>
    </div>
  );

  // Format time for display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Generate Certificate Function
  const generateCertificate = async (course) => {
    if (!isCourseCompleted(course._id)) {
      alert('Please complete all course content (videos, notes, and quizzes) to generate your certificate.');
      return;
    }

    setIsGeneratingCertificate(true);
    
    try {
      const certificate = {
        _id: `cert_${Date.now()}`,
        courseId: course._id,
        courseTitle: course.title,
        studentName: userData.userName,
        issueDate: new Date().toISOString(),
        certificateId: `CLG-${course._id}-${Date.now().toString().slice(-6)}`,
        instructor: course.instructor,
        duration: course.duration
      };

      setCertificates(prev => [...prev, certificate]);
      setCertificateData(certificate);
      setShowCertificateModal(true);
      
      const savedCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]');
      localStorage.setItem('userCertificates', JSON.stringify([...savedCertificates, certificate]));
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate. Please try again.');
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  // Download Certificate as PDF with Color Options
  const downloadCertificateAsPDF = (certificate) => {
    const colors = certificateColors[certificateColor];
    const certificateWindow = window.open('', '_blank');
    certificateWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${certificate.courseTitle}</title>
        <style>
          body { 
            font-family: 'Times New Roman', serif; 
            margin: 0; 
            padding: 40px; 
            background: ${colors.gradient};
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .certificate-container {
            background: white;
            padding: 60px 40px;
            border: 20px solid ${colors.border};
            border-radius: 10px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 800px;
            position: relative;
          }
          .certificate-header {
            margin-bottom: 40px;
          }
          .certificate-title {
            font-size: 48px;
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 10px;
          }
          .certificate-subtitle {
            font-size: 24px;
            color: #7f8c8d;
            margin-bottom: 40px;
          }
          .certificate-body {
            margin: 40px 0;
          }
          .certificate-text {
            font-size: 20px;
            line-height: 1.6;
            margin: 20px 0;
          }
          .student-name {
            font-size: 36px;
            font-weight: bold;
            color: ${colors.accent};
            margin: 30px 0;
            border-bottom: 2px solid #bdc3c7;
            padding-bottom: 10px;
          }
          .course-title {
            font-size: 28px;
            color: ${colors.secondary};
            margin: 20px 0;
          }
          .certificate-footer {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .signature-section {
            text-align: center;
          }
          .signature-line {
            border-top: 1px solid ${colors.primary};
            width: 200px;
            margin: 10px 0;
          }
          .certificate-id {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
            color: #7f8c8d;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: ${colors.primary};
            margin-bottom: 20px;
          }
          .decoration {
            position: absolute;
            width: 100px;
            height: 100px;
            opacity: 0.1;
          }
          .decoration-top-left {
            top: 20px;
            left: 20px;
            border-top: 3px solid ${colors.primary};
            border-left: 3px solid ${colors.primary};
          }
          .decoration-top-right {
            top: 20px;
            right: 20px;
            border-top: 3px solid ${colors.primary};
            border-right: 3px solid ${colors.primary};
          }
          .decoration-bottom-left {
            bottom: 20px;
            left: 20px;
            border-bottom: 3px solid ${colors.primary};
            border-left: 3px solid ${colors.primary};
          }
          .decoration-bottom-right {
            bottom: 20px;
            right: 20px;
            border-bottom: 3px solid ${colors.primary};
            border-right: 3px solid ${colors.primary};
          }
        </style>
      </head>
      <body>
        <div class="certificate-container">
          <div class="decoration decoration-top-left"></div>
          <div class="decoration decoration-top-right"></div>
          <div class="decoration decoration-bottom-left"></div>
          <div class="decoration decoration-bottom-right"></div>
          
          <div class="certificate-header">
            <div class="logo">CLINIGOAL</div>
            <div class="certificate-title">CERTIFICATE OF COMPLETION</div>
            <div class="certificate-subtitle">This certifies that</div>
          </div>
          
          <div class="certificate-body">
            <div class="student-name">${certificate.studentName}</div>
            <div class="certificate-text">has successfully completed the course</div>
            <div class="course-title">${certificate.courseTitle}</div>
            <div class="certificate-text">
              with a duration of ${certificate.duration}<br/>
              under the instruction of ${certificate.instructor}
            </div>
          </div>
          
          <div class="certificate-footer">
            <div class="signature-section">
              <div class="signature-line"></div>
              <div>Date</div>
              <div>${new Date(certificate.issueDate).toLocaleDateString()}</div>
            </div>
            <div class="signature-section">
              <div class="signature-line"></div>
              <div>Clinigoal Director</div>
            </div>
          </div>
          
          <div class="certificate-id">
            Certificate ID: ${certificate.certificateId}
          </div>
        </div>
      </body>
      </html>
    `);
    
    certificateWindow.document.close();
    
    setTimeout(() => {
      certificateWindow.print();
    }, 500);
  };

  // Mark note as completed
  const handleCompleteNote = (noteId) => {
    if (!completedNotes.includes(noteId)) {
      setCompletedNotes(prev => [...prev, noteId]);
      
      const savedCompletedNotes = JSON.parse(localStorage.getItem('completedNotes') || '[]');
      localStorage.setItem('completedNotes', JSON.stringify([...savedCompletedNotes, noteId]));
    }
  };

  // Quiz Functions
  const startQuiz = async (quiz) => {
    try {
      console.log("🚀 Starting quiz:", quiz.title);
      
      if (!quiz.questions || quiz.questions.length === 0) {
        try {
          const response = await fetch(`http://localhost:5000/api/admin/quizzes/${quiz._id}`);
          if (response.ok) {
            const fullQuiz = await response.json();
            setActiveQuiz(fullQuiz);
            setQuizAnswers({});
            setQuizResults(null);
            
            setQuizTimer(0);
            setQuestionStartTime({});
            setQuestionTimes({});
            
            const interval = setInterval(() => {
              setQuizTimer(prev => prev + 1);
            }, 1000);
            setTimerInterval(interval);
            
            return;
          }
        } catch (error) {
          console.error("Error fetching full quiz:", error);
        }
      }
      
      const quizWithProperIds = {
        ...quiz,
        questions: quiz.questions?.map((question, qIndex) => ({
          ...question,
          _id: question._id || `q${qIndex}`,
          options: question.options?.map((option, oIndex) => ({
            ...option,
            id: option.id || `q${qIndex}_opt${oIndex}`
          }))
        })) || []
      };
      
      console.log("🎯 Quiz with proper IDs:", quizWithProperIds);
      
      setActiveQuiz(quizWithProperIds);
      setQuizAnswers({});
      setQuizResults(null);
      
      setQuizTimer(0);
      setQuestionStartTime({});
      setQuestionTimes({});
      
      const interval = setInterval(() => {
        setQuizTimer(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } catch (error) {
      console.error('Error starting quiz:', error);
      alert('Failed to start quiz. Please try again.');
    }
  };

  const handleAnswerSelect = (questionId, optionId) => {
    console.log("📝 Answer selected:", { questionId, optionId });
    
    if (questionStartTime[questionId]) {
      const timeSpent = Math.floor(Date.now() / 1000) - questionStartTime[questionId];
      setQuestionTimes(prev => ({
        ...prev,
        [questionId]: timeSpent
      }));
    }
    
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
    
    setQuestionStartTime(prev => ({
      ...prev,
      [questionId]: Math.floor(Date.now() / 1000)
    }));
    
    console.log("📝 Updated quiz answers:", { ...quizAnswers, [questionId]: optionId });
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;

    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    console.log("📤 Submitting quiz...");
    console.log("Quiz answers:", quizAnswers);
    console.log("Active quiz questions:", activeQuiz.questions);

    try {
      let correctAnswers = 0;
      let totalQuestions = activeQuiz.questions.length;

      const detailedResults = activeQuiz.questions.map((question, questionIndex) => {
        const questionId = question._id || `q${questionIndex}`;
        const selectedOptionId = quizAnswers[questionId];
        
        console.log(`Question ${questionIndex + 1}:`, {
          questionId,
          selectedOptionId,
          questionText: question.questionText,
          options: question.options
        });

        const selectedOption = question.options.find(opt => 
          opt.id === selectedOptionId || opt._id === selectedOptionId
        );
        
        const correctOption = question.options.find(opt => opt.isCorrect === true);
        const isCorrect = selectedOption && selectedOption.isCorrect === true;
        
        if (isCorrect) {
          correctAnswers++;
        }
        
        console.log(`Question ${questionIndex + 1} result:`, {
          selectedOption: selectedOption?.optionText || 'Not answered',
          correctOption: correctOption?.optionText || 'No correct answer specified',
          isCorrect
        });
        
        return {
          questionId,
          questionText: question.questionText,
          selectedOption: selectedOption ? selectedOption.optionText : 'Not answered',
          correctOption: correctOption ? correctOption.optionText : 'No correct answer specified',
          isCorrect,
          timeSpent: questionTimes[questionId] || 0
        };
      });

      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const passed = score >= (activeQuiz.passingScore || 70);

      const formattedTime = formatTime(quizTimer);

      const results = {
        score,
        passed,
        totalQuestions,
        correctAnswers,
        timeSpent: formattedTime,
        timeInSeconds: quizTimer,
        detailedResults
      };

      console.log("📊 Quiz results:", results);

      if (passed && activeQuiz._id && !completedQuizzes.includes(activeQuiz._id)) {
        setCompletedQuizzes(prev => [...prev, activeQuiz._id]);
        
        const savedCompletedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes') || '[]');
        localStorage.setItem('completedQuizzes', JSON.stringify([...savedCompletedQuizzes, activeQuiz._id]));
      }

      try {
        const response = await fetch(`/api/quizzes/${activeQuiz._id}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            answers: quizAnswers,
            timeSpent: quizTimer,
            questionTimes: questionTimes
          })
        });

        if (response.ok) {
          const serverResults = await response.json();
          console.log("✅ Quiz submitted to server successfully");
          setQuizResults(serverResults);
        } else {
          console.log("⚠ Server submission failed, using local results");
          setQuizResults(results);
        }
      } catch (error) {
        console.log("⚠ Could not submit to server, using local results:", error);
        setQuizResults(results);
      }

      if (results.passed && selectedCourse) {
        const updatedCourses = enrolledCourses.map(course => 
          course.id === selectedCourse.id 
            ? { ...course, progress: Math.min(100, course.progress + 10) }
            : course
        );
        setEnrolledCourses(updatedCourses);
        
        localStorage.setItem('userEnrollments', JSON.stringify(updatedCourses));
      }

    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  const resetQuiz = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setQuizTimer(0);
    setActiveQuiz(null);
    setQuizAnswers({});
    setQuizResults(null);
    setQuestionStartTime({});
    setQuestionTimes({});
  };

  // Content View Functions
  const openCourseContent = (course) => {
    const courseId = course.courseId || course.id || course._id;
    const approvalStatus = getCourseApprovalStatus(courseId);
    
    if (approvalStatus === 'not_enrolled') {
      alert('Please enroll in this course first to access the content.');
      handleEnrollmentClick(course);
      return;
    } else if (approvalStatus === 'pending') {
      alert('Your enrollment is pending admin approval. You will be able to access the course content once approved.');
      return;
    }
    
    console.log('🎓 Opening course content for approved course:', course.title);
    setSelectedCourse(course);
    setActiveSection('course-content');
    fetchCourseContent(courseId);
  };

  // Enrollment Form Functions
  const handleEnrollmentClick = (course) => {
    console.log('📝 Starting enrollment for:', course.title);
    setEnrollmentCourse(course);
    setEnrollmentForm({
      courseId: course._id,
      studentName: userData.userName,
      studentEmail: userData.userEmail,
      studentPhone: '',
      paymentMethod: 'razorpay',
      agreeToTerms: false
    });
    setShowEnrollmentForm(true);
    setEnrollmentSuccess(false);
  };

  const handleEnrollmentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollmentForm({
      ...enrollmentForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Razorpay Payment Function
  const handleRazorpayPayment = async () => {
    if (!enrollmentCourse) {
      alert('No course selected for enrollment');
      return;
    }

    try {
      console.log('💰 Processing payment for:', enrollmentCourse.title);
      
      const payment = await recordPayment(
        enrollmentCourse, 
        enrollmentCourse.price, 
        'razorpay'
      );
      
      if (!payment) {
        throw new Error('Payment recording failed');
      }
      
      setEnrollmentSuccess(true);
      
      // Show payment receipt with pending approval note
      showPaymentReceipt(payment);
      
      console.log('✅ Payment successful, waiting for admin approval:', enrollmentCourse._id);
      
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      alert('Payment completed but enrollment failed. Please contact support.');
    }
  };

  const handleEnrollmentSubmit = async (e) => {
    e.preventDefault();
    
    if (!enrollmentForm.agreeToTerms) {
      alert('Please agree to the terms and conditions to proceed with enrollment.');
      return;
    }
    
    if (!enrollmentForm.studentName || !enrollmentForm.studentEmail || !enrollmentForm.studentPhone) {
      alert('Please fill in all required student information.');
      return;
    }
    
    console.log('📝 Starting enrollment process for:', enrollmentCourse.title);
    
    await handleRazorpayPayment();
  };

  const handleWatchVideo = async (video) => {
    try {
      if (!watchedVideos.includes(video._id)) {
        setWatchedVideos(prev => [...prev, video._id]);
        
        const savedWatchedVideos = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
        localStorage.setItem('watchedVideos', JSON.stringify([...savedWatchedVideos, video._id]));
      }
      
      await fetch(`/api/courses/${selectedCourse.id}/videos/${video._id}/watch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(error => {
        console.log('Watch API not available, updating locally');
      });

      if (selectedCourse) {
        const updatedCourses = enrolledCourses.map(course => 
          course.id === selectedCourse.id 
            ? { ...course, progress: Math.min(100, course.progress + 5) }
            : course
        );
        setEnrolledCourses(updatedCourses);
        
        localStorage.setItem('userEnrollments', JSON.stringify(updatedCourses));
      }
    } catch (error) {
      console.error('Error marking video as watched:', error);
    }
  };

  const downloadCertificate = async (certificateId) => {
    try {
      const response = await fetch(`/api/certificates/${certificateId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificateId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  // Student Review Functions
  const handleReviewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleRatingClick = (rating) => {
    setReviewForm({...reviewForm, rating});
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  // Enhanced review submission with proper persistence
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const newReview = {
        _id: `review_${Date.now()}`,
        courseId: reviewForm.courseId,
        courseTitle: availableCourses.find(c => c._id === reviewForm.courseId)?.title || 'Unknown Course',
        userName: reviewForm.anonymous ? 'Anonymous' : userData.userName,
        rating: reviewForm.rating,
        reviewText: reviewForm.reviewText,
        createdAt: new Date().toISOString(),
        userId: userData.userId || 'unknown'
      };

      console.log('📝 Submitting review:', newReview);

      let savedReview = null;

      try {
        // Try to save to backend API first
        const response = await fetch('http://localhost:5000/api/reviews', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newReview)
        });

        if (response.ok) {
          savedReview = await response.json();
          console.log('✅ Review saved to API:', savedReview);
        } else {
          throw new Error('API response not OK');
        }
      } catch (apiError) {
        console.log('⚠ API not available, saving to localStorage');
        savedReview = newReview;
      }

      // Always update local state and localStorage as backup
      const updatedReviews = [savedReview, ...reviews];
      setReviews(updatedReviews);
      
      // Save to localStorage for persistence
      localStorage.setItem('clinigoalReviews', JSON.stringify(updatedReviews));
      console.log('💾 Reviews saved to localStorage:', updatedReviews.length);

      // Reset form and show success
      setReviewSubmitted(true);
      setReviewForm({
        courseId: '',
        rating: 5,
        reviewText: '',
        anonymous: false
      });
      
      setTimeout(() => setReviewSubmitted(false), 5000);
      
    } catch (error) {
      console.error('❌ Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Render course status badge
  const renderCourseStatusBadge = (courseId) => {
    const status = getCourseApprovalStatus(courseId);
    
    switch (status) {
      case 'approved':
        return <div className="status-badge approved">✅ Approved</div>;
      case 'pending':
        return <div className="status-badge pending">⏳ Pending Approval</div>;
      default:
        return null;
    }
  };

  // Connection Status Component
  const renderConnectionStatus = () => (
    <div className={`connection-status ${connectionStatus}`}>
      {connectionStatus === 'connected' && '🟢 Real-time updates active'}
      {connectionStatus === 'disconnected' && '🔴 Offline mode'}
      {connectionStatus === 'error' && '🟡 Connection issues - working locally'}
      {connectionStatus === 'connecting' && '🟡 Connecting...'}
    </div>
  );

  // Dashboard Section
  const renderDashboard = () => {
    const hasApprovedCourses = paidCourses.size > 0;
    const hasPendingApprovals = pendingApprovals.length > 0;
    
    return (
      <div className="dashboard-content">
        <div className="dashboard-header">
          {renderConnectionStatus()}
        </div>

        <div className="welcome-section">
          <div className="welcome-header">
            {profilePhoto ? (
              <img 
                src={profilePhoto} 
                alt="Profile" 
                className="welcome-profile-photo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="welcome-avatar" style={{ display: profilePhoto ? 'none' : 'flex' }}>
              {userData.userName ? userData.userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1>Welcome back, {userData.userName}! 👋</h1>
              <p>Continue your clinical education journey with Clinigoal</p>
              
              {hasPendingApprovals && (
                <div className="enrollment-status-banner">
                  <div className="status-banner warning">
                    <span className="banner-icon">⏳</span>
                    <div>
                      <h4>Pending Approvals</h4>
                      <p>You have {pendingApprovals.length} course(s) waiting for admin approval</p>
                    </div>
                  </div>
                </div>
              )}
              
              {hasApprovedCourses && (
                <div className="enrollment-status-banner">
                  <div className="status-banner success">
                    <span className="banner-icon">✅</span>
                    <div>
                      <h4>Active Enrollments!</h4>
                      <p>You have access to {paidCourses.size} approved course{paidCourses.size > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-info">
              <h3>{totalCourses}</h3>
              <p>Enrolled Courses</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>{averageProgress}%</h3>
              <p>Average Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{completedCourses}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <h3>{learningTime}</h3>
              <p>Learning Time</p>
            </div>
          </div>
        </div>

        {hasApprovedCourses ? (
          <div className="courses-section">
            <div className="section-header">
              <h2>Continue Learning</h2>
              <button className="view-all" onClick={() => setActiveSection('my-courses')}>
                View All
              </button>
            </div>
            <div className="courses-grid">
              {availableCourses.filter(course => isCourseApproved(course._id)).slice(0, 3).map(course => (
                <div key={course._id} className="course-card enrolled">
                  <div className="course-image">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="course-image-fallback">
                      {course.title.charAt(0)}
                    </div>
                    <div className="course-badge approved">✅ Approved</div>
                  </div>
                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <p className="instructor">By {course.instructor}</p>
                    <div className="progress-section">
                      <ProgressBar progress={0} />
                      <p className="last-accessed">
                        Start learning today
                      </p>
                    </div>
                    <div className="course-actions">
                      <button 
                        onClick={() => openCourseContent(course)}
                        className="btn-primary"
                      >
                        Continue Learning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hasPendingApprovals ? (
          <div className="pending-courses-section">
            <div className="section-header">
              <h2>⏳ Courses Waiting for Approval</h2>
              <p>Your enrollments are being reviewed by our admin team</p>
            </div>
            <div className="pending-courses-list">
              {pendingApprovals.slice(0, 3).map(approval => (
                <div key={approval.paymentId} className="course-card pending">
                  <div className="course-image">
                    <div className="course-image-fallback">
                      {approval.courseTitle.charAt(0)}
                    </div>
                    <div className="course-badge pending">⏳ Pending</div>
                  </div>
                  <div className="course-content">
                    <h3>{approval.courseTitle}</h3>
                    <p className="instructor">Status: Waiting for Admin Approval</p>
                    <div className="progress-section">
                      <div className="pending-message">
                        ⏳ Your enrollment is being reviewed. You will be notified once approved.
                      </div>
                    </div>
                    <div className="course-actions">
                      <button className="btn-secondary" disabled>
                        Waiting for Approval
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-courses-section">
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No Courses Enrolled Yet</h3>
              <p>Start your clinical education journey by enrolling in our specialized courses</p>
              <button 
                onClick={() => setActiveSection('available-courses')}
                className="btn-primary"
              >
                Browse Courses
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // My Courses Section - UPDATED with approval workflow
  const renderMyCourses = () => {
    const hasApprovedCourses = paidCourses.size > 0;
    const hasPendingApprovals = pendingApprovals.length > 0;
    
    return (
      <div className="my-courses-content">
        <div className="section-header">
          <h2>My Courses</h2>
          <p>Track your progress and continue your clinical education</p>
          
          {hasPendingApprovals && (
            <div className="enrollment-status-banner">
              <div className="status-banner warning">
                <span className="banner-icon">⏳</span>
                <div>
                  <h4>Pending Approvals</h4>
                  <p>You have {pendingApprovals.length} course(s) waiting for admin approval</p>
                </div>
              </div>
            </div>
          )}
          
          {hasApprovedCourses && (
            <div className="enrollment-status-banner">
              <div className="status-banner success">
                <span className="banner-icon">✅</span>
                <div>
                  <h4>Active Enrollments</h4>
                  <p>You have access to {paidCourses.size} approved course{paidCourses.size > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Pending Approvals Section */}
        {hasPendingApprovals && (
          <div className="pending-approvals-section">
            <h3>⏳ Waiting for Approval</h3>
            <div className="pending-courses-list">
              {pendingApprovals.map(approval => (
                <div key={approval.paymentId} className="course-item pending">
                  <div className="course-thumbnail">
                    <div className="course-thumbnail-fallback">
                      {approval.courseTitle.charAt(0)}
                    </div>
                  </div>
                  <div className="course-details">
                    <h3>{approval.courseTitle}</h3>
                    <p className="instructor">Status: Pending Admin Approval</p>
                    <p className="duration">Payment Date: {new Date(approval.paymentDate).toLocaleDateString()}</p>
                    <div className="progress-info">
                      <div className="pending-message">
                        ⏳ Your enrollment is being reviewed. You will be notified once approved.
                      </div>
                    </div>
                  </div>
                  <div className="course-actions">
                    <button className="btn-secondary" disabled>
                      Waiting for Approval
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Approved Courses Section */}
        {hasApprovedCourses ? (
          <div className="courses-list-container">
            <div className="courses-list">
              {availableCourses.filter(course => isCourseApproved(course._id)).map(course => (
                <div key={course._id} className="course-item approved">
                  <div className="course-thumbnail">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="course-thumbnail-fallback">
                      {course.title.charAt(0)}
                    </div>
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p className="instructor">By {course.instructor}</p>
                    <p className="duration">Status: <span className="status-approved">✅ Approved</span></p>
                    <div className="progress-info">
                      <ProgressBar progress={0} />
                      <span className="progress-label">0% completed</span>
                    </div>
                  </div>
                  <div className="course-actions">
                    <button 
                      onClick={() => openCourseContent(course)}
                      className="btn-primary"
                    >
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !hasPendingApprovals && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Courses Enrolled</h3>
            <p>You haven't enrolled in any courses yet. Explore our clinical education programs to get started.</p>
            <button 
              onClick={() => setActiveSection('available-courses')}
              className="btn-primary"
            >
              Browse All Courses
            </button>
          </div>
        )}
      </div>
    );
  };

  // Available Courses Section - FIXED with loading states and retry mechanism
  const renderAvailableCourses = () => {
    const hasApprovedCourses = paidCourses.size > 0;
    const hasPendingApprovals = pendingApprovals.length > 0;
    
    return (
      <div className="available-courses-content">
        <div className="section-header">
          <h2>Clinigoal Courses</h2>
          <p>Specialized programs for clinical education and career advancement</p>
          
          {/* Loading State */}
          {coursesLoading && (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p>Loading courses...</p>
            </div>
          )}
          
          {/* Error State with Retry */}
          {!coursesLoading && availableCourses.length === 0 && (
            <div className="error-section">
              <div className="error-icon">⚠️</div>
              <h3>Unable to load courses</h3>
              <p>There was a problem loading the course catalog.</p>
              <button 
                onClick={retryCourseLoading}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          )}

          {hasPendingApprovals && (
            <div className="enrollment-status-banner">
              <div className="status-banner warning">
                <span className="banner-icon">⏳</span>
                <div>
                  <h4>Pending Approvals</h4>
                  <p>You have {pendingApprovals.length} course(s) waiting for admin approval</p>
                </div>
              </div>
            </div>
          )}
          
          {hasApprovedCourses && (
            <div className="enrollment-status-banner">
              <div className="status-banner success">
                <span className="banner-icon">✅</span>
                <div>
                  <h4>Active Enrollments</h4>
                  <p>You have access to {paidCourses.size} approved course{paidCourses.size > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Success State */}
        {!coursesLoading && availableCourses.length > 0 ? (
          <div className="clinigoal-courses-grid">
            {availableCourses.map(course => {
              const approvalStatus = getCourseApprovalStatus(course._id);
              const canAccess = approvalStatus === 'approved';
              
              return (
                <div key={course._id} className="clinigoal-course-card">
                  <div className="course-image">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="course-image-fallback">
                      {course.title.charAt(0)}
                    </div>
                    <div className="course-level">{course.level}</div>
                    {renderCourseStatusBadge(course._id)}
                  </div>
                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <p className="instructor">By {course.instructor}</p>
                    <p className="course-description">{course.description}</p>
                    
                    {course.features && course.features.length > 0 && (
                      <div className="course-features">
                        {course.features.map((feature, index) => (
                          <span key={index} className="feature-tag">✓ {feature}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className="course-meta">
                      <span className="duration">⏱ {course.duration}</span>
                      <span className="price">💰 {course.price}</span>
                    </div>
                    
                    <div className="course-actions">
                      {canAccess ? (
                        <button 
                          onClick={() => openCourseContent(course)}
                          className="btn-primary"
                        >
                          🎯 Access Course
                        </button>
                      ) : approvalStatus === 'pending' ? (
                        <button className="btn-secondary" disabled>
                          ⏳ Pending Approval
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleEnrollmentClick(course)}
                          className="btn-primary enroll-btn"
                        >
                          📝 Enroll Now - {course.price}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : !coursesLoading && (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No Courses Available</h3>
            <p>There are currently no courses available for enrollment.</p>
            <button 
              onClick={retryCourseLoading}
              className="btn-primary"
            >
              Refresh Courses
            </button>
          </div>
        )}
        
        {/* Enrollment Form Modal */}
        {showEnrollmentForm && enrollmentCourse && (
          <div className="enrollment-modal-overlay">
            <div className="enrollment-modal">
              <div className="modal-header">
                <h2>Enroll in {enrollmentCourse.title}</h2>
                <button 
                  className="close-btn" 
                  onClick={() => setShowEnrollmentForm(false)}
                >
                  ×
                </button>
              </div>
              
              {enrollmentSuccess ? (
                <div className="enrollment-success">
                  <div className="success-icon">⏳</div>
                  <h3>Enrollment Submitted for Approval!</h3>
                  <p>You have successfully submitted your enrollment for <strong>{enrollmentCourse.title}</strong>.</p>
                  <p>Your enrollment is now pending admin approval. You will be notified once it's approved.</p>
                  <div className="success-actions">
                    <button 
                      onClick={() => {
                        setShowEnrollmentForm(false);
                        setActiveSection('my-courses');
                      }}
                      className="btn-primary"
                    >
                      View My Courses
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleEnrollmentSubmit} className="enrollment-form">
                  <div className="course-summary">
                    <h4>Course Summary</h4>
                    <div className="summary-details">
                      <p><strong>Course:</strong> {enrollmentCourse.title}</p>
                      <p><strong>Instructor:</strong> {enrollmentCourse.instructor}</p>
                      <p><strong>Duration:</strong> {enrollmentCourse.duration}</p>
                      <p><strong>Price:</strong> <span className="course-price">{enrollmentCourse.price}</span></p>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Student Information</h4>
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="studentName"
                        value={enrollmentForm.studentName}
                        onChange={handleEnrollmentChange}
                        required
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="studentEmail"
                        value={enrollmentForm.studentEmail}
                        onChange={handleEnrollmentChange}
                        required
                        className="form-input"
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="studentPhone"
                        value={enrollmentForm.studentPhone}
                        onChange={handleEnrollmentChange}
                        placeholder="Enter your phone number"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-section">
                    <h4>Payment Details</h4>
                    <div className="form-group">
                      <label>Payment Method *</label>
                      <div className="payment-methods">
                        <div className="payment-option selected">
                          <input
                            type="radio"
                            id="razorpay"
                            name="paymentMethod"
                            value="razorpay"
                            checked={enrollmentForm.paymentMethod === 'razorpay'}
                            onChange={handleEnrollmentChange}
                          />
                          <label htmlFor="razorpay">
                            <span className="payment-icon">💳</span>
                            <div className="payment-info">
                              <div className="payment-name">Razorpay</div>
                              <div className="payment-desc">Secure online payment</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="payment-summary">
                      <div className="payment-line">
                        <span>Course Fee:</span>
                        <span>{enrollmentCourse.price}</span>
                      </div>
                      <div className="payment-line total">
                        <span>Total Amount:</span>
                        <span>{enrollmentCourse.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group terms-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={enrollmentForm.agreeToTerms}
                        onChange={handleEnrollmentChange}
                        required
                        className="form-checkbox"
                      />
                      <span className="checkmark"></span>
                      <span>
                        I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and <a href="#" className="terms-link">Refund Policy</a> *
                      </span>
                    </label>
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setShowEnrollmentForm(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary razorpay-btn"
                      disabled={!enrollmentForm.agreeToTerms}
                    >
                      <span className="razorpay-text">Pay {enrollmentCourse.price} with Razorpay</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Certificates Section
  const renderCertificates = () => (
    <div className="certificates-content">
      <div className="section-header">
        <h2>My Certificates</h2>
        <p>Your clinical education achievements and completed courses</p>
      </div>
      
      {certificates.length > 0 ? (
        <div className="certificates-grid">
          {certificates.map(certificate => (
            <div key={certificate._id} className="certificate-card">
              <div className="certificate-header">
                <div className="certificate-icon">🏆</div>
                <div className="certificate-info">
                  <h3>{certificate.courseTitle}</h3>
                  <p>Completed on {new Date(certificate.issueDate).toLocaleDateString()}</p>
                  <span className="certificate-id">
                    {certificate.certificateId}
                  </span>
                </div>
              </div>
              <div className="certificate-actions">
                <button 
                  onClick={() => downloadCertificateAsPDF(certificate)}
                  className="btn-primary"
                >
                  Download PDF
                </button>
                <button className="btn-secondary">
                  Share Achievement
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📜</div>
          <h3>No Certificates Yet</h3>
          <p>Complete your enrolled courses to earn Clinigoal certificates</p>
          <button 
            onClick={() => setActiveSection('my-courses')}
            className="btn-primary"
          >
            Continue Learning
          </button>
        </div>
      )}
    </div>
  );

  // Progress Tracking Section
  const renderProgressTracking = () => (
    <div className="progress-tracking-content">
      <div className="section-header">
        <h2>Learning Progress</h2>
        <p>Track your clinical education journey</p>
      </div>

      <div className="progress-overview">
        <div className="overview-card">
          <h3>Overall Progress</h3>
          <div className="overall-progress">
            <ProgressBar progress={averageProgress} />
          </div>
          <div className="progress-stats">
            <div className="stat">
              <span className="number">{totalCourses}</span>
              <span className="label">Total Courses</span>
            </div>
            <div className="stat">
              <span className="number">{completedCourses}</span>
              <span className="label">Completed</span>
            </div>
            <div className="stat">
              <span className="number">{totalCourses - completedCourses}</span>
              <span className="label">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {(enrolledCourses.length > 0 || paidCourses.size > 0) && (
        <div className="detailed-progress">
          <h3>Course-wise Progress</h3>
          {availableCourses.filter(course => isCourseApproved(course._id)).map(course => (
            <div key={course._id} className="course-progress-item">
              <div className="course-info">
                <h4>{course.title}</h4>
                <p>Status: <span className="status-approved">✅ Approved</span></p>
              </div>
              <div className="progress-display">
                <ProgressBar progress={0} />
                <span className="status">
                  Not Started
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Student Review Section
  const renderStudentReview = () => (
    <div className="student-review-content">
      <div className="section-header">
        <h2>Student Reviews</h2>
        <p>Share your feedback about our courses and help us improve</p>
      </div>

      <div className="review-container">
        <div className="review-form-container">
          <div className="form-header">
            <h3>Submit Your Review</h3>
            <p>Your feedback helps us improve our courses</p>
          </div>
          
          {reviewSubmitted ? (
            <div className="review-success">
              <div className="success-icon">✓</div>
              <h3>Review Submitted Successfully!</h3>
              <p>Thank you for your feedback. Your review has been submitted and will be published after moderation.</p>
              <p><strong>Note:</strong> Your review is now saved and will persist even after page refresh.</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-group">
                <label>Select Course *</label>
                <div className="select-wrapper">
                  <select 
                    name="courseId" 
                    value={reviewForm.courseId} 
                    onChange={handleReviewChange}
                    required
                    className="custom-select"
                  >
                    <option value="">Select a course you've enrolled in</option>
                    {availableCourses.filter(course => isCourseApproved(course._id)).map(course => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
                {availableCourses.filter(course => isCourseApproved(course._id)).length === 0 && (
                  <p className="form-hint">You need to enroll in a course first to submit a review.</p>
                )}
              </div>

              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-container">
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`star ${star <= (hoverRating || reviewForm.rating) ? 'filled' : ''}`}
                        onClick={() => handleRatingClick(star)}
                        onMouseEnter={() => handleRatingHover(star)}
                        onMouseLeave={handleRatingLeave}
                        aria-label={`Rate ${star} stars`}
                      >
                        <span className="star-icon">★</span>
                      </button>
                    ))}
                  </div>
                  <div className="rating-value">
                    {reviewForm.rating} out of 5
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Your Review *</label>
                <div className="textarea-wrapper">
                  <textarea
                    name="reviewText"
                    value={reviewForm.reviewText}
                    onChange={handleReviewChange}
                    placeholder="Share your experience with this course. What did you like? What could be improved?"
                    rows={5}
                    required
                    maxLength={500}
                    className="custom-textarea"
                  ></textarea>
                  <div className="char-count">
                    {reviewForm.reviewText.length}/500 characters
                  </div>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="anonymous"
                    checked={reviewForm.anonymous}
                    onChange={handleReviewChange}
                    className="custom-checkbox"
                  />
                  <span className="checkmark"></span>
                  <span>Submit review anonymously</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="btn-primary submit-btn"
                disabled={!reviewForm.courseId || !reviewForm.reviewText.trim()}
              >
                Submit Review
              </button>
            </form>
          )}
        </div>

        <div className="reviews-list-container">
          <div className="reviews-header">
            <h3>Recent Reviews ({reviews.length})</h3>
            <div className="review-stats">
              <span className="average-rating">
                Average: {reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}/5
              </span>
            </div>
          </div>
          
          {reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {(review.userName || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4>{review.userName || 'Anonymous'}</h4>
                        <p>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                      </div>
                    </div>
                    <div className="review-rating">
                      <div className="stars">
                        {'★'.repeat(review.rating || 0)}{'☆'.repeat(5 - (review.rating || 0))}
                      </div>
                      <span className="rating-number">{review.rating || 0}/5</span>
                    </div>
                  </div>
                  <div className="review-course">
                    <span className="course-tag">{review.courseTitle || 'Unknown Course'}</span>
                  </div>
                  <div className="review-text">
                    <p>{review.reviewText || 'No review text available.'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-reviews">
              <div className="empty-icon">💬</div>
              <h3>No Reviews Yet</h3>
              <p>Be the first to share your experience with our courses!</p>
              <p>Your reviews will be saved and visible even after refreshing the page.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCourseContent = () => {
    const completionPercentage = calculateCourseCompletion(selectedCourse?._id);
    const isCompleted = isCourseCompleted(selectedCourse?._id);

    return (
      <div className="course-content-page">
        <div className="content-header">
          <button 
            className="back-btn"
            onClick={() => setActiveSection('my-courses')}
          >
            ← Back to My Courses
          </button>
          <div className="course-info">
            <h1>{selectedCourse?.courseTitle || selectedCourse?.title}</h1>
            <div className="completion-status">
              <span className={`status-badge ${isCompleted ? 'completed' : 'in-progress'}`}>
                {isCompleted ? '🎉 Completed' : `📚 ${completionPercentage}% Complete`}
              </span>
            </div>
          </div>
          <div className="progress-section">
            <ProgressBar progress={completionPercentage} />
            <span className="progress-label">{completionPercentage}% Complete</span>
          </div>
        </div>

        {/* Certificate Section - Only show if course is completed */}
        {isCompleted && (
          <div className="certificate-section">
            <div className="certificate-card premium">
              <div className="certificate-icon">🏆</div>
              <div className="certificate-info">
                <h3>Course Completed!</h3>
                <p>Congratulations! You've successfully completed all requirements for this course.</p>
                <p>Generate your certificate to showcase your achievement.</p>
              </div>
              <div className="certificate-color-picker">
                <label>Choose Certificate Color:</label>
                <div className="color-options">
                  {Object.keys(certificateColors).map(color => (
                    <button
                      key={color}
                      className={`color-option ${certificateColor === color ? 'active' : ''}`}
                      style={{ backgroundColor: certificateColors[color].primary }}
                      onClick={() => setCertificateColor(color)}
                      title={color.charAt(0).toUpperCase() + color.slice(1)}
                    />
                  ))}
                </div>
              </div>
              <button 
                onClick={() => generateCertificate(selectedCourse)}
                disabled={isGeneratingCertificate}
                className="btn-primary certificate-btn"
              >
                {isGeneratingCertificate ? (
                  <>
                    <div className="spinner-small"></div>
                    Generating...
                  </>
                ) : (
                  '🎓 Generate Certificate'
                )}
              </button>
            </div>
          </div>
        )}

        <div className="content-tabs">
          <div className="tab-nav">
            <button className="tab-btn active">Videos</button>
            <button className="tab-btn">Notes</button>
            <button className="tab-btn">Quizzes</button>
          </div>

          <div className="tab-content">
            {/* Videos Tab */}
            <div className="content-section">
              <h2>Video Lectures</h2>
              {courseContent.videos.length > 0 ? (
                <div className="videos-grid">
                  {courseContent.videos.map(video => {
                    const isWatched = watchedVideos.includes(video._id);
                    return (
                      <div key={video._id} className={`video-card ${isWatched ? 'completed' : ''}`}>
                        <div className="video-thumbnail">
                          <img 
                            src={video.thumbnail || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                            alt={video.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                            }}
                          />
                          <div className="play-overlay">
                            {isWatched ? (
                              <div className="completed-badge">✓ Watched</div>
                            ) : (
                              <button 
                                className="play-btn"
                                onClick={() => handleWatchVideo(video)}
                              >
                                ▶
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="video-info">
                          <h3>{video.title}</h3>
                          <p>{video.description}</p>
                          <div className="video-meta">
                            <span>Duration: {video.duration}</span>
                            {video.module && <span>Module: {video.module}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">🎬</div>
                  <h3>No Videos Available</h3>
                  <p>Video lectures will be added soon by the instructor.</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      console.log("🔄 Refreshing course content...");
                      fetchCourseContent(selectedCourse.courseId || selectedCourse.id || selectedCourse._id);
                    }}
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Notes Tab */}
            <div className="content-section">
              <h2>Notes & Study Materials</h2>
              {courseContent.notes.length > 0 ? (
                <div className="notes-grid">
                  {courseContent.notes.map(note => {
                    const isCompleted = completedNotes.includes(note._id);
                    return (
                      <div key={note._id} className={`note-card ${isCompleted ? 'completed' : ''}`}>
                        <div className="note-icon">
                          {note.fileType === 'pdf' ? '📄' : '📝'}
                          {isCompleted && <span className="completion-check">✓</span>}
                        </div>
                        <div className="note-info">
                          <h3>{note.title}</h3>
                          <p>{note.description || 'Study material for this course'}</p>
                          <div className="note-meta">
                            <span>{note.fileType?.toUpperCase() || 'PDF'} • {note.pages || 'N/A'} pages</span>
                          </div>
                        </div>
                        <div className="note-actions">
                          <a 
                            href={note.fileUrl || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-secondary"
                          >
                            Download
                          </a>
                          {!isCompleted && (
                            <button 
                              onClick={() => handleCompleteNote(note._id)}
                              className="btn-primary mark-complete-btn"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No Notes Available</h3>
                  <p>Notes and study materials will be added soon by the instructor.</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      console.log("🔄 Refreshing course content...");
                      fetchCourseContent(selectedCourse.courseId || selectedCourse.id || selectedCourse._id);
                    }}
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Quizzes Tab */}
            <div className="content-section">
              <h2>Assessments</h2>
              {courseContent.quizzes.length > 0 ? (
                <div className="quizzes-grid">
                  {courseContent.quizzes.map(quiz => {
                    const isCompleted = completedQuizzes.includes(quiz._id);
                    return (
                      <div key={quiz._id} className={`quiz-card ${isCompleted ? 'completed' : ''}`}>
                        <div className="quiz-icon">
                          ❓
                          {isCompleted && <span className="completion-check">✓</span>}
                        </div>
                        <div className="quiz-info">
                          <h3>{quiz.title}</h3>
                          <p>{quiz.description}</p>
                          <div className="quiz-meta">
                            <span>{quiz.questions?.length || 0} questions</span>
                            <span>Time: {quiz.timeLimit || 'N/A'} min</span>
                            <span>Passing: {quiz.passingScore || '70'}%</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => startQuiz(quiz)}
                          className="btn-primary"
                        >
                          {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">❓</div>
                  <h3>No Quizzes Available</h3>
                  <p>Quizzes will be added soon by the instructor.</p>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      console.log("🔄 Refreshing course content...");
                      fetchCourseContent(selectedCourse.courseId || selectedCourse.id || selectedCourse._id);
                    }}
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Quiz Results Display
  const renderQuizResults = () => {
    if (!quizResults) return null;

    const { score, passed, totalQuestions, correctAnswers, timeSpent, detailedResults } = quizResults;

    return (
      <div className="quiz-results">
        <div className="results-card">
          <div className="results-icon">
            {passed ? '🎉' : '📝'}
          </div>
          <h2>{passed ? 'Congratulations!' : 'Keep Learning!'}</h2>
          <div className="score-display">
            <div className={`score-circle ${passed ? 'passed' : 'failed'}`}>
              <span className="score-percent">{score}%</span>
            </div>
          </div>
          <div className="results-details">
            <p>You scored {correctAnswers} out of {totalQuestions} questions correctly.</p>
            <p>Time spent: {timeSpent}</p>
            {passed ? (
              <p className="success-text">You passed the quiz! Your progress has been updated.</p>
            ) : (
              <p className="warning-text">You need {activeQuiz.passingScore || 70}% to pass. Keep studying and try again!</p>
            )}
          </div>

          {/* Detailed Results Section */}
          <div className="detailed-results">
            <h3>Question Review</h3>
            <div className="questions-review">
              {detailedResults.map((result, index) => (
                <div key={result.questionId} className={`question-review-item ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="question-header">
                    <span className="question-number">Question {index + 1}</span>
                    <span className={`answer-status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className="question-time">
                      ⏱ {formatTime(result.timeSpent)}
                    </span>
                  </div>
                  <div className="question-text">
                    <p>{result.questionText}</p>
                  </div>
                  <div className="answers-comparison">
                    <div className="user-answer">
                      <span className="answer-label">Your Answer:</span>
                      <span className="answer-text">{result.selectedOption}</span>
                    </div>
                    {!result.isCorrect && (
                      <div className="correct-answer">
                        <span className="answer-label">Correct Answer:</span>
                        <span className="answer-text">{result.correctOption}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="results-actions">
            <button onClick={resetQuiz} className="btn-primary">
              {passed ? 'Back to Course' : 'Retry Quiz'}
            </button>
            <button onClick={() => setActiveSection('my-courses')} className="btn-secondary">
              My Courses
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (!activeQuiz) return null;

    if (quizResults) {
      return renderQuizResults();
    }

    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <button 
            className="back-btn"
            onClick={resetQuiz}
          >
            ← Back to Course
          </button>
          <div className="quiz-title-section">
            <h1>{activeQuiz.title}</h1>
            <p className="quiz-subtitle">{activeQuiz.description || 'Test your knowledge'}</p>
          </div>
          <div className="quiz-progress">
            <span>⏱ Time: <span id="quiz-timer">{formatTime(quizTimer)}</span></span>
            <span>❓ Question: <span id="question-counter">1 of {activeQuiz.questions?.length || 0}</span></span>
          </div>
        </div>

        <div className="quiz-content">
          <div className="quiz-instructions">
            <h3>Instructions</h3>
            <ul>
              <li>Read each question carefully before answering</li>
              <li>Select only one answer per question</li>
              <li>You can change your answer before submitting</li>
              <li>Passing score: {activeQuiz.passingScore || 70}%</li>
            </ul>
          </div>

          <div className="quiz-questions">
            {activeQuiz.questions?.map((question, questionIndex) => {
              const questionId = question._id || `q${questionIndex}`;
              const selectedAnswer = quizAnswers[questionId];
              
              return (
                <div key={questionId} className="quiz-question-card">
                  <div className="question-header">
                    <div className="question-number">
                      Question {questionIndex + 1} of {activeQuiz.questions.length}
                    </div>
                    <div className="question-required">
                      *
                    </div>
                  </div>
                  
                  <div className="question-content">
                    <div className="question-text">
                      <h4>{question.questionText}</h4>
                    </div>
                    
                    <div className="question-options">
                      {question.options?.map((option, optionIndex) => {
                        const optionId = option.id || `q${questionIndex}_opt${optionIndex}`;
                        const isSelected = selectedAnswer === optionId;
                        
                        return (
                          <div 
                            key={optionId}
                            className={`option-item ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleAnswerSelect(questionId, optionId)}
                          >
                            <div className="option-radio">
                              <div className={`radio-circle ${isSelected ? 'checked' : ''}`}></div>
                            </div>
                            <div className="option-text">
                              <span className="option-label">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              {option.optionText}
                            </div>
                            {isSelected && (
                              <div className="option-selected-indicator">
                                ✓
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="quiz-actions">
            <div className="quiz-summary">
              <p>
                Answered: {Object.keys(quizAnswers).length} of {activeQuiz.questions?.length || 0} questions
              </p>
              {Object.keys(quizAnswers).length < (activeQuiz.questions?.length || 0) && (
                <p className="warning-text">
                  Please answer all questions before submitting
                </p>
              )}
            </div>
            
            <div className="quiz-buttons">
              <button 
                onClick={resetQuiz}
                className="btn-secondary"
              >
                Cancel Quiz
              </button>
              <button 
                onClick={submitQuiz}
                className="btn-primary"
                disabled={Object.keys(quizAnswers).length !== (activeQuiz.questions?.length || 0)}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Certificate Modal
  const renderCertificateModal = () => {
    if (!showCertificateModal || !certificateData) return null;

    const colors = certificateColors[certificateColor];

    return (
      <div className="certificate-modal-overlay">
        <div className="certificate-modal">
          <div className="modal-header">
            <h2>🎓 Certificate Generated Successfully!</h2>
            <button 
              className="close-btn" 
              onClick={() => setShowCertificateModal(false)}
            >
              ×
            </button>
          </div>
          
          <div className="certificate-preview">
            <div className="certificate-design" style={{ borderColor: colors.border }}>
              <div className="certificate-border" style={{ borderColor: colors.border }}>
                <div className="certificate-content">
                  <div className="certificate-logo" style={{ color: colors.primary }}>CLINIGOAL</div>
                  <h1 style={{ color: colors.primary }}>CERTIFICATE OF COMPLETION</h1>
                  <p className="presented-to">This certificate is presented to</p>
                  <h2 className="student-name" style={{ color: colors.accent }}>{certificateData.studentName}</h2>
                  <p className="completion-text">for successfully completing the course</p>
                  <h3 className="course-title" style={{ color: colors.secondary }}>{certificateData.courseTitle}</h3>
                  <div className="certificate-details">
                    <p>Instructor: <strong>{certificateData.instructor}</strong></p>
                    <p>Duration: <strong>{certificateData.duration}</strong></p>
                    <p>Issue Date: <strong>{new Date(certificateData.issueDate).toLocaleDateString()}</strong></p>
                  </div>
                  <div className="certificate-id">
                    Certificate ID: {certificateData.certificateId}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="certificate-color-selector">
            <label>Choose Certificate Color:</label>
            <div className="color-options">
              {Object.keys(certificateColors).map(color => (
                <button
                  key={color}
                  className={`color-option ${certificateColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: certificateColors[color].primary }}
                  onClick={() => setCertificateColor(color)}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              onClick={() => downloadCertificateAsPDF(certificateData)}
              className="btn-primary"
            >
              📥 Download PDF
            </button>
            <button 
              onClick={() => setShowCertificateModal(false)}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Payment Receipt Modal - UPDATED with pending approval status
  const renderReceiptModal = () => {
    if (!showReceiptModal || !paymentReceipt) return null;

    const isPending = paymentReceipt.status === 'pending_approval';

    return (
      <div className="receipt-modal-overlay">
        <div className="receipt-modal">
          <div className="modal-header">
            <h2>{isPending ? '⏳ Payment Received - Pending Approval' : '🎉 Payment Successful!'}</h2>
            <button 
              className="close-btn" 
              onClick={() => setShowReceiptModal(false)}
            >
              ×
            </button>
          </div>
          
          <div className="receipt-content">
            <div className="receipt-success-icon">
              {isPending ? '⏳' : '✅'}
            </div>
            
            <div className="receipt-details">
              <div className="receipt-row">
                <span className="receipt-label">Receipt Number:</span>
                <span className="receipt-value">{paymentReceipt.receiptNumber}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Transaction ID:</span>
                <span className="receipt-value">{paymentReceipt.transactionId}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Date & Time:</span>
                <span className="receipt-value">{new Date(paymentReceipt.timestamp).toLocaleString()}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Course:</span>
                <span className="receipt-value">{paymentReceipt.courseTitle}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Student Name:</span>
                <span className="receipt-value">{paymentReceipt.studentName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Payment Method:</span>
                <span className="receipt-value">{paymentReceipt.paymentMethod}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Status:</span>
                <span className={`receipt-value status-${isPending ? 'pending' : 'completed'}`}>
                  {isPending ? 'Pending Approval' : 'Completed'}
                </span>
              </div>
              
              {isPending && (
                <div className="receipt-message pending">
                  <p>⏳ Your enrollment is pending admin approval. You will be notified once your course access is approved.</p>
                </div>
              )}
              
              <div className="receipt-total">
                <div className="receipt-row">
                  <span className="receipt-label">Total Amount Paid:</span>
                  <span className="receipt-value total-amount">{paymentReceipt.amount}</span>
                </div>
              </div>
            </div>
            
            <div className="receipt-message">
              <p>
                {isPending 
                  ? 'Thank you for your payment! Your enrollment request has been submitted for admin approval.' 
                  : 'Thank you for your payment! You can now access the course content in "My Courses" section.'}
              </p>
            </div>
          </div>
          
          <div className="modal-actions">
            <button 
              onClick={() => downloadReceiptAsPDF(paymentReceipt)}
              className="btn-primary"
            >
              📥 Download Receipt
            </button>
            <button 
              onClick={() => {
                setShowReceiptModal(false);
                setShowEnrollmentForm(false);
                setActiveSection('my-courses');
              }}
              className="btn-secondary"
            >
              {isPending ? 'View My Courses' : 'Go to My Courses'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="user-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="clinigoal-logo">
            <h2>Clinigoal</h2>
          </div>
          
          <div className="user-profile-section">
            <div className="user-avatar-container">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile" 
                  className="user-profile-photo"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="user-avatar" style={{ display: profilePhoto ? 'none' : 'flex' }}>
                {userData.userName ? userData.userName.charAt(0).toUpperCase() : 'U'}
              </div>
              
              <div className="avatar-edit-btn">
                <label htmlFor="profile-photo-upload">
                  <span className="edit-icon">✏</span>
                </label>
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            
            {profilePhoto && (
              <button 
                className="remove-photo-btn" 
                onClick={handleRemovePhoto}
              >
                Remove Photo
              </button>
            )}
            
            <div className="user-info">
              <h3>{userData.userName || 'User Name'}</h3>
              <p>{userData.userEmail || 'user@example.com'}</p>
              <span className="user-role">Student</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`nav-item ${activeSection === 'my-courses' ? 'active' : ''}`}
            onClick={() => setActiveSection('my-courses')}
          >
            📚 My Courses
          </button>
          <button 
            className={`nav-item ${activeSection === 'available-courses' ? 'active' : ''}`}
            onClick={() => setActiveSection('available-courses')}
          >
            🎯 Available Courses
          </button>
          <button 
            className={`nav-item ${activeSection === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveSection('certificates')}
          >
            🏆 Certificates
          </button>
          <button 
            className={`nav-item ${activeSection === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveSection('progress')}
          >
            📈 Progress Tracking
          </button>
          <button 
            className={`nav-item ${activeSection === 'student-review' ? 'active' : ''}`}
            onClick={() => setActiveSection('student-review')}
          >
            💬 Student Review
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item">⚙ Settings</button>
          <button className="nav-item logout">🚪 Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {activeQuiz ? renderQuiz() : 
         activeSection === 'course-content' ? renderCourseContent() :
         activeSection === 'dashboard' ? renderDashboard() :
         activeSection === 'my-courses' ? renderMyCourses() :
         activeSection === 'available-courses' ? renderAvailableCourses() :
         activeSection === 'certificates' ? renderCertificates() :
         activeSection === 'progress' ? renderProgressTracking() :
         activeSection === 'student-review' ? renderStudentReview() :
         renderDashboard()}
      </div>

      {/* Certificate Modal */}
      {renderCertificateModal()}

      {/* Payment Receipt Modal */}
      {renderReceiptModal()}
    </div>
  );
}