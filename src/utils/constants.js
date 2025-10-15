// Application constants and default data

// Default settings
export const DEFAULT_SETTINGS = {
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

// Course levels
export const COURSE_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Expert'
];

// File types
export const FILE_TYPES = {
  PDF: 'pdf',
  DOCX: 'docx',
  TXT: 'txt',
  VIDEO: 'video',
  IMAGE: 'image'
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Approval statuses
export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Review statuses
export const REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Course categories
export const COURSE_CATEGORIES = [
  'Clinical Research',
  'Bioinformatics',
  'Medical Writing',
  'Regulatory Affairs',
  'Pharmacovigilance',
  'Clinical Data Management',
  'Biostatistics',
  'Medical Coding'
];

// Time limits for quizzes
export const QUIZ_TIME_LIMITS = [15, 30, 45, 60, 90, 120];

// Passing scores for quizzes
export const PASSING_SCORES = [60, 70, 75, 80, 85, 90];

// Default course features
export const DEFAULT_COURSE_FEATURES = [
  'Certificate of Completion',
  'Lifetime Access',
  'Industry Expert Instructors',
  'Practical Exercises',
  'Career Support'
];

// Chart colors
export const CHART_COLORS = {
  primary: '#3498db',
  success: '#2ecc71',
  warning: '#f39c12',
  danger: '#e74c3c',
  info: '#9b59b6',
  secondary: '#95a5a6'
};

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Local storage keys
export const STORAGE_KEYS = {
  PAYMENTS: 'adminPayments',
  COURSES: 'adminCourses',
  STUDENTS: 'adminStudents',
  INSTRUCTORS: 'adminInstructors',
  REVIEWS: 'adminReviews',
  VIDEOS: 'adminVideos',
  NOTES: 'adminNotes',
  QUIZZES: 'adminQuizzes',
  APPROVALS: 'courseApprovals',
  SETTINGS: 'adminSettings'
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  PAYMENTS: '/api/payments',
  COURSES: '/api/courses',
  STUDENTS: '/api/students',
  REVIEWS: '/api/reviews',
  UPLOAD_VIDEO: '/api/admin/upload/video',
  UPLOAD_NOTE: '/api/admin/upload/note',
  ANALYTICS: '/api/analytics'
};

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_VIDEO_SIZE: 500 * 1024 * 1024, // 500MB
  MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_DOCUMENT_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mkv', 'video/avi'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
};

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100]
};

// Export all constants
export default {
  DEFAULT_SETTINGS,
  COURSE_LEVELS,
  FILE_TYPES,
  PAYMENT_STATUS,
  APPROVAL_STATUS,
  REVIEW_STATUS,
  COURSE_CATEGORIES,
  QUIZ_TIME_LIMITS,
  PASSING_SCORES,
  DEFAULT_COURSE_FEATURES,
  CHART_COLORS,
  NOTIFICATION_TYPES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  UPLOAD_CONSTRAINTS,
  PAGINATION
};