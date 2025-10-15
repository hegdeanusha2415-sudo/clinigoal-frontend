import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import io from 'socket.io-client';

// Chart components for analytics
const ChartContainer = ({ title, children, className = '' }) => (
  <div className={`chart-container ${className}`}>
    <h3>{title}</h3>
    <div className="chart-content">
      {children}
    </div>
  </div>
);

const BarChart = ({ data, labels, colors, height = 200 }) => {
  const maxValue = Math.max(...data, 1);
  
  return (
    <div className="bar-chart" style={{ height: `${height}px` }}>
      {data.map((value, index) => (
        <div key={index} className="bar-container">
          <div 
            className="bar" 
            style={{ 
              height: `${(value / maxValue) * 100}%`,
              backgroundColor: colors?.[index] || '#3498db'
            }}
          >
            <span className="bar-value">{value}</span>
          </div>
          <span className="bar-label">{labels?.[index] || `Item ${index + 1}`}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data, labels, color = '#3498db', height = 200 }) => {
  const maxValue = Math.max(...data, 1);
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: 100 - (value / maxValue) * 100
  }));

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="line-chart" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d={pathData} 
          stroke={color}
          strokeWidth="2"
          fill="none"
          className="line-path"
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2"
            fill={color}
            className="data-point"
          />
        ))}
      </svg>
      <div className="line-labels">
        {labels?.map((label, index) => (
          <span key={index} className="line-label">{label}</span>
        ))}
      </div>
    </div>
  );
};

const PieChart = ({ data, labels, colors, height = 200 }) => {
  const total = data.reduce((sum, value) => sum + value, 0);
  let cumulativePercent = 0;

  return (
    <div className="pie-chart" style={{ height: `${height}px` }}>
      <svg viewBox="0 0 100 100">
        {data.map((value, index) => {
          const percent = (value / total) * 100;
          const startPercent = cumulativePercent;
          cumulativePercent += percent;

          const x1 = 50 + 50 * Math.cos(2 * Math.PI * startPercent / 100);
          const y1 = 50 + 50 * Math.sin(2 * Math.PI * startPercent / 100);
          const x2 = 50 + 50 * Math.cos(2 * Math.PI * cumulativePercent / 100);
          const y2 = 50 + 50 * Math.sin(2 * Math.PI * cumulativePercent / 100);

          const largeArcFlag = percent > 50 ? 1 : 0;

          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');

          return (
            <path
              key={index}
              d={pathData}
              fill={colors?.[index] || `hsl(${index * 360 / data.length}, 70%, 50%)`}
              className="pie-slice"
            />
          );
        })}
      </svg>
      <div className="pie-legend">
        {labels?.map((label, index) => (
          <div key={index} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: colors?.[index] || `hsl(${index * 360 / data.length}, 70%, 50%)` }}
            ></span>
            <span className="legend-label">{label} ({data[index]})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DonutChart = ({ value, max, label, color = '#3498db', size = 120 }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  
  return (
    <div className="donut-chart" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#ecf0f1"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 60 60)"
          className="donut-progress"
        />
        <text x="60" y="60" textAnchor="middle" dy="7" className="donut-value">
          {value}%
        </text>
        <text x="60" y="80" textAnchor="middle" className="donut-label">
          {label}
        </text>
      </svg>
    </div>
  );
};

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [activeCourseSection, setActiveCourseSection] = useState('videos');
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Content Management States
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  
  // Form States
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Enhanced States
  const [operationLoading, setOperationLoading] = useState({
    video: false,
    note: false,
    quiz: false,
    course: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [previewItem, setPreviewItem] = useState(null);

  // File Upload States
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [noteFile, setNoteFile] = useState(null);
  const [courseImageFile, setCourseImageFile] = useState(null);

  // Form Data States - UPDATED WITH INITIAL VALUES
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

  // Course Management States
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
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

  // Reviews Management States
  const [reviewFilter, setReviewFilter] = useState('all');
  const [searchReviewTerm, setSearchReviewTerm] = useState('');

  // Settings States
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

  // Course Approvals States
  const [courseApprovals, setCourseApprovals] = useState([]);
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [searchApprovalTerm, setSearchApprovalTerm] = useState('');

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
    studentGrowth: [],
    enrollmentTrend: [],
    platformEngagement: {
      avgCompletionRate: 0,
      avgTimeSpent: 0,
      satisfactionScore: 0
    }
  });

  // Default courses - UPDATED WITH 5 NEW COURSES
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
      ],
      students: 45,
      rating: 4.8,
      createdAt: new Date('2024-01-15').toISOString()
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
      ],
      students: 32,
      rating: 4.6,
      createdAt: new Date('2024-02-10').toISOString()
    },
    // NEW COURSE 1
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
      ],
      students: 28,
      rating: 4.7,
      createdAt: new Date('2024-03-01').toISOString()
    },
    // NEW COURSE 2
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
      ],
      students: 22,
      rating: 4.9,
      createdAt: new Date('2024-03-15').toISOString()
    },
    // NEW COURSE 3
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
      ],
      students: 35,
      rating: 4.5,
      createdAt: new Date('2024-04-01').toISOString()
    },
    // NEW COURSE 4
    {
      _id: '6',
      title: "Clinical Data Management",
      description: "Master clinical data collection, cleaning, and analysis using industry-standard tools and methodologies.",
      instructor: "Dr. Arjun Reddy",
      duration: "16 weeks",
      level: "Intermediate",
      price: "₹1,09,999",
      image: "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg",
      features: [
        "CDISC Standards",
        "EDC Systems",
        "Data Validation",
        "Statistical Programming"
      ],
      students: 41,
      rating: 4.6,
      createdAt: new Date('2024-04-20').toISOString()
    },
    // NEW COURSE 5
    {
      _id: '7',
      title: "Clinical Trial Design & Biostatistics",
      description: "Learn advanced clinical trial design, statistical analysis, and interpretation of clinical data.",
      instructor: "Prof. Meera Iyer",
      duration: "20 weeks",
      level: "Advanced",
      price: "₹1,39,999",
      image: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg",
      features: [
        "Trial Design Methodology",
        "Statistical Analysis Plans",
        "Sample Size Calculation",
        "Interim Analysis"
      ],
      students: 19,
      rating: 4.8,
      createdAt: new Date('2024-05-10').toISOString()
    }
  ];

  // DUMMY VIDEOS DATA
  const dummyVideos = [
    // Videos for Course 1: Clinical Research Associate
    {
      _id: 'video_1_1',
      title: "Introduction to Clinical Research",
      description: "Overview of clinical research process and regulatory framework",
      duration: "45:30",
      course: '1',
      module: "Module 1: Fundamentals",
      order: 1,
      videoUrl: "https://example.com/videos/intro-clinical-research.mp4",
      thumbnail: "https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg",
      views: 156,
      likes: 23,
      createdAt: new Date('2024-01-20').toISOString()
    },
    {
      _id: 'video_1_2',
      title: "ICH-GCP Guidelines",
      description: "Detailed understanding of International Conference on Harmonisation - Good Clinical Practice",
      duration: "52:15",
      course: '1',
      module: "Module 2: Regulations",
      order: 2,
      videoUrl: "https://example.com/videos/ich-gcp-guidelines.mp4",
      thumbnail: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
      views: 142,
      likes: 18,
      createdAt: new Date('2024-01-25').toISOString()
    },
    {
      _id: 'video_1_3',
      title: "Clinical Trial Monitoring",
      description: "Practical aspects of site monitoring and data verification",
      duration: "38:45",
      course: '1',
      module: "Module 3: Monitoring",
      order: 3,
      videoUrl: "https://example.com/videos/trial-monitoring.mp4",
      thumbnail: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg",
      views: 128,
      likes: 15,
      createdAt: new Date('2024-02-05').toISOString()
    },

    // Videos for Course 2: Bioinformatics & Genomics
    {
      _id: 'video_2_1',
      title: "Python for Genomic Analysis",
      description: "Introduction to Python programming for bioinformatics applications",
      duration: "55:20",
      course: '2',
      module: "Module 1: Programming Basics",
      order: 1,
      videoUrl: "https://example.com/videos/python-genomics.mp4",
      thumbnail: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg",
      views: 89,
      likes: 12,
      createdAt: new Date('2024-02-15').toISOString()
    },
    {
      _id: 'video_2_2',
      title: "NGS Data Processing",
      description: "Processing and analyzing Next Generation Sequencing data",
      duration: "48:30",
      course: '2',
      module: "Module 2: NGS Analysis",
      order: 2,
      videoUrl: "https://example.com/videos/ngs-processing.mp4",
      thumbnail: "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg",
      views: 76,
      likes: 9,
      createdAt: new Date('2024-02-25').toISOString()
    },

    // Videos for Course 3: Medical Writing
    {
      _id: 'video_3_1',
      title: "Protocol Writing Fundamentals",
      description: "Learn to write comprehensive clinical trial protocols",
      duration: "42:15",
      course: '3',
      module: "Module 1: Protocol Development",
      order: 1,
      videoUrl: "https://example.com/videos/protocol-writing.mp4",
      thumbnail: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg",
      views: 67,
      likes: 8,
      createdAt: new Date('2024-03-10').toISOString()
    },

    // Videos for Course 4: Regulatory Affairs
    {
      _id: 'video_4_1',
      title: "FDA Regulatory Submissions",
      description: "Understanding FDA submission requirements and processes",
      duration: "50:10",
      course: '4',
      module: "Module 1: FDA Regulations",
      order: 1,
      videoUrl: "https://example.com/videos/fda-submissions.mp4",
      thumbnail: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg",
      views: 58,
      likes: 7,
      createdAt: new Date('2024-03-20').toISOString()
    },
    {
      _id: 'video_4_2',
      title: "Clinical Trial Applications",
      description: "Preparing and submitting clinical trial applications globally",
      duration: "44:25",
      course: '4',
      module: "Module 2: Trial Applications",
      order: 2,
      videoUrl: "https://example.com/videos/trial-applications.mp4",
      thumbnail: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
      views: 52,
      likes: 6,
      createdAt: new Date('2024-03-28').toISOString()
    },

    // Videos for Course 5: Pharmacovigilance
    {
      _id: 'video_5_1',
      title: "Adverse Event Reporting",
      description: "Comprehensive guide to adverse event detection and reporting",
      duration: "47:35",
      course: '5',
      module: "Module 1: Safety Monitoring",
      order: 1,
      videoUrl: "https://example.com/videos/ae-reporting.mp4",
      thumbnail: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
      views: 71,
      likes: 10,
      createdAt: new Date('2024-04-10').toISOString()
    },

    // Videos for Course 6: Clinical Data Management
    {
      _id: 'video_6_1',
      title: "CDISC Standards Implementation",
      description: "Implementing CDISC standards in clinical data management",
      duration: "53:40",
      course: '6',
      module: "Module 1: Data Standards",
      order: 1,
      videoUrl: "https://example.com/videos/cdisc-standards.mp4",
      thumbnail: "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg",
      views: 63,
      likes: 8,
      createdAt: new Date('2024-04-25').toISOString()
    },
    {
      _id: 'video_6_2',
      title: "EDC Systems Overview",
      description: "Understanding Electronic Data Capture systems and workflows",
      duration: "39:55",
      course: '6',
      module: "Module 2: EDC Systems",
      order: 2,
      videoUrl: "https://example.com/videos/edc-systems.mp4",
      thumbnail: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg",
      views: 59,
      likes: 7,
      createdAt: new Date('2024-05-05').toISOString()
    },

    // Videos for Course 7: Clinical Trial Design
    {
      _id: 'video_7_1',
      title: "Randomized Controlled Trials",
      description: "Design and implementation of randomized controlled trials",
      duration: "51:20",
      course: '7',
      module: "Module 1: Trial Design",
      order: 1,
      videoUrl: "https://example.com/videos/rct-design.mp4",
      thumbnail: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg",
      views: 45,
      likes: 6,
      createdAt: new Date('2024-05-15').toISOString()
    }
  ];

  // DUMMY NOTES DATA
  const dummyNotes = [
    // Notes for Course 1
    {
      _id: 'note_1_1',
      title: "ICH-GCP Guidelines Handbook",
      description: "Complete reference guide for ICH-GCP guidelines and implementation",
      fileType: "pdf",
      pages: "156",
      course: '1',
      fileUrl: "https://example.com/notes/ich-gcp-handbook.pdf",
      downloads: 89,
      createdAt: new Date('2024-01-22').toISOString()
    },
    {
      _id: 'note_1_2',
      title: "Clinical Monitoring Checklist",
      description: "Comprehensive checklist for clinical trial site monitoring",
      fileType: "pdf",
      pages: "24",
      course: '1',
      fileUrl: "https://example.com/notes/monitoring-checklist.pdf",
      downloads: 67,
      createdAt: new Date('2024-01-30').toISOString()
    },

    // Notes for Course 2
    {
      _id: 'note_2_1',
      title: "Python Bioinformatics Cookbook",
      description: "Collection of Python scripts for genomic data analysis",
      fileType: "pdf",
      pages: "98",
      course: '2',
      fileUrl: "https://example.com/notes/python-bioinformatics.pdf",
      downloads: 54,
      createdAt: new Date('2024-02-20').toISOString()
    },
    {
      _id: 'note_2_2',
      title: "NGS Data Formats Guide",
      description: "Understanding FASTQ, BAM, and VCF file formats",
      fileType: "pdf",
      pages: "42",
      course: '2',
      fileUrl: "https://example.com/notes/ngs-formats.pdf",
      downloads: 48,
      createdAt: new Date('2024-03-01').toISOString()
    },

    // Notes for Course 3
    {
      _id: 'note_3_1',
      title: "Medical Writing Templates",
      description: "Templates for clinical protocols, reports, and manuscripts",
      fileType: "docx",
      pages: "35",
      course: '3',
      fileUrl: "https://example.com/notes/writing-templates.docx",
      downloads: 42,
      createdAt: new Date('2024-03-12').toISOString()
    },

    // Notes for Course 4
    {
      _id: 'note_4_1',
      title: "Regulatory Submission Guidelines",
      description: "Step-by-step guide for regulatory submissions to FDA and EMA",
      fileType: "pdf",
      pages: "128",
      course: '4',
      fileUrl: "https://example.com/notes/regulatory-guide.pdf",
      downloads: 38,
      createdAt: new Date('2024-03-25').toISOString()
    },

    // Notes for Course 5
    {
      _id: 'note_5_1',
      title: "Pharmacovigilance SOPs",
      description: "Standard Operating Procedures for drug safety monitoring",
      fileType: "pdf",
      pages: "76",
      course: '5',
      fileUrl: "https://example.com/notes/pv-sops.pdf",
      downloads: 51,
      createdAt: new Date('2024-04-12').toISOString()
    },

    // Notes for Course 6
    {
      _id: 'note_6_1',
      title: "CDISC Implementation Guide",
      description: "Practical guide to implementing CDISC standards in clinical trials",
      fileType: "pdf",
      pages: "112",
      course: '6',
      fileUrl: "https://example.com/notes/cdisc-implementation.pdf",
      downloads: 46,
      createdAt: new Date('2024-04-28').toISOString()
    },

    // Notes for Course 7
    {
      _id: 'note_7_1',
      title: "Statistical Analysis Plans",
      description: "Templates and examples for statistical analysis plans in clinical trials",
      fileType: "pdf",
      pages: "64",
      course: '7',
      fileUrl: "https://example.com/notes/statistical-plans.pdf",
      downloads: 33,
      createdAt: new Date('2024-05-18').toISOString()
    }
  ];

  // DUMMY QUIZZES DATA
  const dummyQuizzes = [
    // Quiz for Course 1
    {
      _id: 'quiz_1',
      title: "ICH-GCP Fundamentals Assessment",
      description: "Test your understanding of ICH-GCP guidelines and principles",
      course: '1',
      timeLimit: 45,
      passingScore: 75,
      attempts: 34,
      averageScore: 78,
      questions: [
        {
          questionText: "What is the primary purpose of ICH-GCP guidelines?",
          options: [
            { optionText: "To ensure ethical and scientific quality of clinical trials", isCorrect: true },
            { optionText: "To reduce the cost of clinical trials", isCorrect: false },
            { optionText: "To speed up drug approval process", isCorrect: false },
            { optionText: "To standardize clinical trial payments", isCorrect: false }
          ]
        },
        {
          questionText: "Which principle emphasizes that benefits should justify risks?",
          options: [
            { optionText: "Risk-benefit assessment", isCorrect: true },
            { optionText: "Informed consent", isCorrect: false },
            { optionText: "Protocol compliance", isCorrect: false },
            { optionText: "Data quality assurance", isCorrect: false }
          ]
        }
      ],
      createdAt: new Date('2024-02-01').toISOString()
    },

    // Quiz for Course 2
    {
      _id: 'quiz_2',
      title: "Bioinformatics Basics Quiz",
      description: "Assessment of fundamental bioinformatics concepts and tools",
      course: '2',
      timeLimit: 30,
      passingScore: 70,
      attempts: 28,
      averageScore: 72,
      questions: [
        {
          questionText: "What does BAM file format primarily contain?",
          options: [
            { optionText: "Aligned sequencing reads", isCorrect: true },
            { optionText: "Raw sequencing data", isCorrect: false },
            { optionText: "Gene expression data", isCorrect: false },
            { optionText: "Protein sequences", isCorrect: false }
          ]
        }
      ],
      createdAt: new Date('2024-03-05').toISOString()
    },

    // Quiz for Course 3
    {
      _id: 'quiz_3',
      title: "Medical Writing Standards Test",
      description: "Evaluate your knowledge of medical writing standards and guidelines",
      course: '3',
      timeLimit: 35,
      passingScore: 70,
      attempts: 22,
      averageScore: 75,
      questions: [
        {
          questionText: "What is the key element of a clinical study protocol?",
          options: [
            { optionText: "Clear and detailed methodology", isCorrect: true },
            { optionText: "Lengthy introduction section", isCorrect: false },
            { optionText: "Complex statistical methods", isCorrect: false },
            { optionText: "Multiple appendices", isCorrect: false }
          ]
        }
      ],
      createdAt: new Date('2024-03-20').toISOString()
    },

    // Quiz for Course 4
    {
      _id: 'quiz_4',
      title: "Regulatory Affairs Knowledge Check",
      description: "Test your understanding of regulatory submission processes",
      course: '4',
      timeLimit: 40,
      passingScore: 75,
      attempts: 18,
      averageScore: 71,
      questions: [
        {
          questionText: "What does IND stand for in regulatory context?",
          options: [
            { optionText: "Investigational New Drug", isCorrect: true },
            { optionText: "International New Drug", isCorrect: false },
            { optionText: "Investigational National Drug", isCorrect: false },
            { optionText: "International National Drug", isCorrect: false }
          ]
        }
      ],
      createdAt: new Date('2024-04-05').toISOString()
    },

    // Quiz for Course 5
    {
      _id: 'quiz_5',
      title: "Pharmacovigilance Principles Assessment",
      description: "Evaluate your knowledge of drug safety monitoring principles",
      course: '5',
      timeLimit: 35,
      passingScore: 70,
      attempts: 25,
      averageScore: 76,
      questions: [
        {
          questionText: "What is the timeframe for reporting serious adverse events?",
          options: [
            { optionText: "15 calendar days", isCorrect: true },
            { optionText: "30 calendar days", isCorrect: false },
            { optionText: "7 working days", isCorrect: false },
            { optionText: "Immediately", isCorrect: false }
          ]
        }
      ],
      createdAt: new Date('2024-04-20').toISOString()
    },

    // Quiz for Course 6
    {
      _id: 'quiz_6',
      title: "Clinical Data Management Quiz",
      description: "Test your knowledge of data management standards and practices",
      course: '6',
      timeLimit: 30,
      passingScore: 70,
      attempts: 29,
      averageScore: 74,
      questions: [
        {
          questionText: "What does CDISC stand for?",
          options: [
            { optionText: "Clinical Data Interchange Standards Consortium", isCorrect: true },
            { optionText: "Clinical Data International Standards Committee", isCorrect: false },
            { optionText: "Clinical Documentation and Interchange Standards", isCorrect: false },
            { optionText: "Clinical Data Integration Standards Council", isCorrect: false }
          ]
        }
      ],
      createdAt: new Date('2024-05-10').toISOString()
    },

    // Quiz for Course 7
    {
      _id: 'quiz_7',
      title: "Clinical Trial Design Evaluation",
      description: "Assessment of clinical trial design principles and methodologies",
      course: '7',
      timeLimit: 45,
      passingScore: 75,
      attempts: 16,
      averageScore: 69,
      questions: [
        {
          questionText: "What is the primary advantage of randomized controlled trials?",
          options: [
            { optionText: "Minimizes selection bias", isCorrect: true },
            { optionText: "Reduces costs significantly", isCorrect: false },
            { optionText: "Shortens trial duration", isCorrect: false },
            { optionText: "Simplifies data analysis", isCorrect: false }
          ]
        }
      ],
      createdAt: new Date('2024-05-25').toISOString()
    }
  ];

  // Chart Data States
  const [chartData, setChartData] = useState({
    revenueData: [],
    studentGrowthData: [],
    coursePerformanceData: [],
    enrollmentData: [],
    engagementData: []
  });

  const [analyticsData, setAnalyticsData] = useState({
    revenueTrend: [],
    studentGrowth: [],
    coursePerformance: [],
    enrollmentStats: [],
    platformMetrics: {}
  });

  // ============================
  // NOTIFICATION SYSTEM
  // ============================

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 4000);
  };

  // ============================
  // DATA PERSISTENCE FUNCTIONS
  // ============================

  const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
      addNotification('Error saving data', 'error');
    }
  };

  const loadFromLocalStorage = (key, defaultValue = []) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error loading from localStorage (${key}):`, error);
      return defaultValue;
    }
  };

  // ============================
  // ENHANCED CRUD OPERATIONS FOR ALL CONTENT TYPES
  // ============================

  // VIDEO CRUD OPERATIONS
  const handleVideoFormSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(prev => ({ ...prev, video: true }));

    try {
      if (editingItem && editingItem.type === 'video') {
        // UPDATE EXISTING VIDEO
        const updatedVideos = videos.map(video => 
          video._id === editingItem.id 
            ? { 
                ...videoForm,
                _id: editingItem.id,
                updatedAt: new Date().toISOString()
              }
            : video
        );
        setVideos(updatedVideos);
        saveToLocalStorage('adminVideos', updatedVideos);
        addNotification('Video updated successfully!', 'success');
      } else {
        // CREATE NEW VIDEO
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
      }

      setShowVideoForm(false);
      resetVideoForm();
    } catch (error) {
      console.error('Error saving video:', error);
      addNotification('Failed to save video', 'error');
    } finally {
      setOperationLoading(prev => ({ ...prev, video: false }));
    }
  };

  const editVideo = (video) => {
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
    setEditingItem({ type: 'video', id: video._id });
    setShowVideoForm(true);
  };

  const deleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      const updatedVideos = videos.filter(video => video._id !== videoId);
      setVideos(updatedVideos);
      saveToLocalStorage('adminVideos', updatedVideos);
      addNotification('Video deleted successfully!', 'success');
    }
  };

  const resetVideoForm = () => {
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
    setVideoFile(null);
    setThumbnailFile(null);
    setEditingItem(null);
  };

  // NOTES CRUD OPERATIONS
  const handleNoteFormSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(prev => ({ ...prev, note: true }));

    try {
      if (editingItem && editingItem.type === 'note') {
        // UPDATE EXISTING NOTE
        const updatedNotes = notes.map(note => 
          note._id === editingItem.id 
            ? { 
                ...noteForm,
                _id: editingItem.id,
                updatedAt: new Date().toISOString()
              }
            : note
        );
        setNotes(updatedNotes);
        saveToLocalStorage('adminNotes', updatedNotes);
        addNotification('Document updated successfully!', 'success');
      } else {
        // CREATE NEW NOTE
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
      }

      setShowNoteForm(false);
      resetNoteForm();
    } catch (error) {
      console.error('Error saving document:', error);
      addNotification('Failed to save document', 'error');
    } finally {
      setOperationLoading(prev => ({ ...prev, note: false }));
    }
  };

  const editNote = (note) => {
    setNoteForm({
      title: note.title || '',
      description: note.description || '',
      fileType: note.fileType || 'pdf',
      pages: note.pages || '',
      course: note.course || '',
      fileUrl: note.fileUrl || ''
    });
    setEditingItem({ type: 'note', id: note._id });
    setShowNoteForm(true);
  };

  const deleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      const updatedNotes = notes.filter(note => note._id !== noteId);
      setNotes(updatedNotes);
      saveToLocalStorage('adminNotes', updatedNotes);
      addNotification('Document deleted successfully!', 'success');
    }
  };

  const resetNoteForm = () => {
    setNoteForm({
      title: '',
      description: '',
      fileType: 'pdf',
      pages: '',
      course: '',
      fileUrl: ''
    });
    setNoteFile(null);
    setEditingItem(null);
  };

  // QUIZ CRUD OPERATIONS
  const handleQuizFormSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(prev => ({ ...prev, quiz: true }));

    try {
      if (editingItem && editingItem.type === 'quiz') {
        // UPDATE EXISTING QUIZ
        const updatedQuizzes = quizzes.map(quiz => 
          quiz._id === editingItem.id 
            ? { 
                ...quizForm,
                _id: editingItem.id,
                updatedAt: new Date().toISOString()
              }
            : quiz
        );
        setQuizzes(updatedQuizzes);
        saveToLocalStorage('adminQuizzes', updatedQuizzes);
        addNotification('Quiz updated successfully!', 'success');
      } else {
        // CREATE NEW QUIZ
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
      }

      setShowQuizForm(false);
      resetQuizForm();
    } catch (error) {
      console.error('Error saving quiz:', error);
      addNotification('Failed to save quiz', 'error');
    } finally {
      setOperationLoading(prev => ({ ...prev, quiz: false }));
    }
  };

  const editQuiz = (quiz) => {
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
    setEditingItem({ type: 'quiz', id: quiz._id });
    setShowQuizForm(true);
  };

  const deleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      const updatedQuizzes = quizzes.filter(quiz => quiz._id !== quizId);
      setQuizzes(updatedQuizzes);
      saveToLocalStorage('adminQuizzes', updatedQuizzes);
      addNotification('Quiz deleted successfully!', 'success');
    }
  };

  const resetQuizForm = () => {
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
    setEditingItem(null);
  };

  // COURSE CRUD OPERATIONS
  const handleCourseFormSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(prev => ({ ...prev, course: true }));

    try {
      if (editingCourse) {
        // UPDATE EXISTING COURSE
        const updatedCourses = courses.map(course => 
          course._id === editingCourse._id 
            ? { 
                ...courseForm,
                _id: editingCourse._id,
                students: editingCourse.students || 0,
                rating: editingCourse.rating || 4.5,
                createdAt: editingCourse.createdAt,
                updatedAt: new Date().toISOString()
              }
            : course
        );
        setCourses(updatedCourses);
        saveToLocalStorage('adminCourses', updatedCourses);
        addNotification('Course updated successfully!', 'success');
      } else {
        // CREATE NEW COURSE
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
      }

      setShowCourseForm(false);
      resetCourseForm();
    } catch (error) {
      console.error('Error saving course:', error);
      addNotification('Failed to save course', 'error');
    } finally {
      setOperationLoading(prev => ({ ...prev, course: false }));
    }
  };

  const editCourse = (course) => {
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
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const deleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      const updatedCourses = courses.filter(course => course._id !== courseId);
      setCourses(updatedCourses);
      saveToLocalStorage('adminCourses', updatedCourses);
      addNotification('Course deleted successfully!', 'success');
    }
  };

  const resetCourseForm = () => {
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
    setCourseImageFile(null);
    setEditingCourse(null);
  };

  // ============================
  // QUIZ QUESTION HANDLERS
  // ============================

  const addQuestion = () => {
    setQuizForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: '',
          options: [
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false },
            { optionText: '', isCorrect: false }
          ]
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? { ...question, [field]: value }
          : question
      )
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    setQuizForm(prev => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: question.options.map((option, oIndex) =>
                oIndex === optionIndex
                  ? { ...option, [field]: value }
                  : option
              )
            }
          : question
      )
    }));
  };

  // ============================
  // COURSE CONTENT MANAGEMENT FUNCTIONS
  // ============================

  const handleCourseFormChange = (field, value) => {
    setCourseForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...courseForm.features];
    updatedFeatures[index] = value;
    setCourseForm(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const addFeature = () => {
    setCourseForm(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    const updatedFeatures = courseForm.features.filter((_, i) => i !== index);
    setCourseForm(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  // ============================
  // FILE UPLOAD HANDLERS
  // ============================

  const handleCourseImageUpload = async (file) => {
    if (!file) return;
    
    try {
      setOperationLoading(prev => ({ ...prev, course: true }));
      
      // For demo, create object URL
      const imageUrl = URL.createObjectURL(file);
      
      setCourseForm(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      setCourseImageFile(file);
      addNotification('Course image uploaded successfully', 'success');
      
    } catch (error) {
      console.error('Error uploading course image:', error);
      addNotification('Failed to upload course image', 'error');
    } finally {
      setOperationLoading(prev => ({ ...prev, course: false }));
    }
  };

  const handleVideoFileUpload = async (file) => {
    if (!file) return;
    
    setVideoFile(file);
    
    // Set video URL after "upload"
    setVideoForm(prev => ({
      ...prev,
      videoUrl: URL.createObjectURL(file)
    }));
    addNotification('Video file uploaded successfully', 'success');
  };

  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    
    setThumbnailFile(file);
    
    // Set thumbnail URL
    setVideoForm(prev => ({
      ...prev,
      thumbnail: URL.createObjectURL(file)
    }));
    addNotification('Thumbnail uploaded successfully', 'success');
  };

  const handleNoteFileUpload = async (file) => {
    if (!file) return;
    
    setNoteFile(file);
    
    // Set file URL after "upload"
    const fileExtension = file.name.split('.').pop();
    setNoteForm(prev => ({
      ...prev,
      fileUrl: URL.createObjectURL(file),
      fileType: fileExtension || 'pdf'
    }));
    addNotification('Document uploaded successfully', 'success');
  };

  // ============================
  // PAYMENT SYNC FUNCTIONS
  // ============================

  const syncAllUserDashboardPayments = () => {
    console.log('🔄 Syncing payments from UserDashboard...');
    
    const possiblePaymentKeys = [
      'userPayments',
      'adminPayments', 
      'clinigoalPayments',
      'userDashboardPayments',
      'pendingApprovals',
      'paidCourses'
    ];
    
    let allPayments = [];
    let allApprovals = [];
    
    // Check all possible localStorage keys
    possiblePaymentKeys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        if (data && data.length > 0) {
          console.log(`📁 Found ${data.length} items in ${key}`);
          
          if (key === 'pendingApprovals') {
            allApprovals = [...allApprovals, ...data];
          } else {
            allPayments = [...allPayments, ...data];
          }
        }
      } catch (error) {
        console.log(`❌ Error reading ${key}:`, error);
      }
    });
    
    // Also check for paid courses directly
    try {
      const paidCourses = JSON.parse(localStorage.getItem('paidCourses') || '[]');
      if (paidCourses.length > 0) {
        console.log(`🎯 Found ${paidCourses.length} paid courses`);
        paidCourses.forEach(courseId => {
          allPayments.push({
            _id: `paid_course_${courseId}`,
            courseId: courseId,
            status: 'completed',
            source: 'paidCourses_storage'
          });
        });
      }
    } catch (error) {
      console.log('Error reading paidCourses:', error);
    }
    
    console.log('📊 Total payments found:', allPayments.length);
    console.log('📋 Total approvals found:', allApprovals.length);
    
    return { payments: allPayments, approvals: allApprovals };
  };

  const fetchCourseApprovals = async () => {
    try {
      console.log('🔄 Starting course approvals fetch...');
      
      // Use the enhanced sync function
      const { payments, approvals } = syncAllUserDashboardPayments();
      
      let courseApprovalsData = [];
      
      // Process payments into approval format
      payments.forEach(payment => {
        if (payment.courseId && payment.studentName) {
          const course = courses.find(c => c._id === payment.courseId) || defaultCourses.find(c => c._id === payment.courseId);
          
          const approval = {
            _id: payment._id || `approval_${Date.now()}_${Math.random()}`,
            userId: payment.studentEmail || `user_${payment.studentName}`,
            userName: payment.studentName,
            userEmail: payment.studentEmail || `${payment.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            courseId: payment.courseId,
            courseTitle: course?.title || payment.courseTitle || 'Unknown Course',
            enrollmentDate: payment.timestamp || new Date().toISOString(),
            status: payment.status === 'completed' ? 'approved' : 'pending',
            progress: 0,
            lastAccessed: new Date().toISOString(),
            completed: false,
            paymentStatus: payment.status || 'pending',
            amount: payment.amount || '₹0',
            transactionId: payment.transactionId || `TXN_${Date.now()}`,
            paymentMethod: payment.paymentMethod || 'unknown',
            isPaid: true,
            source: 'user_dashboard_sync'
          };
          
          courseApprovalsData.push(approval);
        }
      });
      
      // Also add any direct approvals
      approvals.forEach(approval => {
        if (!courseApprovalsData.some(a => a._id === approval._id)) {
          courseApprovalsData.push({
            ...approval,
            source: approval.source || 'direct_approval'
          });
        }
      });
      
      // Add sample data if no real data found (for demo)
      if (courseApprovalsData.length === 0) {
        console.log('📝 Adding sample approval data for demonstration');
        courseApprovalsData = [
          {
            _id: 'approval_demo_1',
            userId: 'user_demo_1',
            userName: 'Demo Student',
            userEmail: 'demo.student@example.com',
            courseId: '1',
            courseTitle: 'Clinical Research Associate',
            enrollmentDate: new Date().toISOString(),
            status: 'pending',
            progress: 0,
            lastAccessed: new Date().toISOString(),
            completed: false,
            paymentStatus: 'completed',
            amount: '₹1,29,999',
            transactionId: 'TXN_DEMO_001',
            paymentMethod: 'razorpay',
            isPaid: true,
            source: 'demo_data'
          }
        ];
      }
      
      console.log('✅ Final course approvals:', courseApprovalsData.length);
      setCourseApprovals(courseApprovalsData);
      saveToLocalStorage('courseApprovals', courseApprovalsData);
      
      // Force refresh of the approvals list if we're on that section
      if (activeSection === 'approvals') {
        addNotification(`Loaded ${courseApprovalsData.length} course enrollments for approval`, 'success');
      }
      
    } catch (error) {
      console.error('❌ Error fetching course approvals:', error);
      addNotification('Failed to load course approvals from UserDashboard', 'error');
    }
  };

  const syncPaidEnrollments = () => {
    try {
      const { payments, approvals } = syncAllUserDashboardPayments();
      const currentApprovals = [...courseApprovals];
      
      let newEnrollmentsCount = 0;
      
      payments.forEach(paidEnrollment => {
        const exists = currentApprovals.some(approval => 
          approval.userEmail === paidEnrollment.userEmail && 
          approval.courseId === paidEnrollment.courseId
        );
        
        if (!exists && paidEnrollment.courseId && paidEnrollment.studentName) {
          const course = courses.find(c => c._id === paidEnrollment.courseId) || defaultCourses.find(c => c._id === paidEnrollment.courseId);
          
          const newApproval = {
            _id: paidEnrollment._id || `approval_${Date.now()}_${Math.random()}`,
            userId: paidEnrollment.studentEmail || `user_${paidEnrollment.studentName}`,
            userName: paidEnrollment.studentName,
            userEmail: paidEnrollment.studentEmail || `${paidEnrollment.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
            courseId: paidEnrollment.courseId,
            courseTitle: course?.title || paidEnrollment.courseTitle || 'Unknown Course',
            enrollmentDate: paidEnrollment.timestamp || new Date().toISOString(),
            status: 'pending',
            progress: 0,
            lastAccessed: new Date().toISOString(),
            completed: false,
            paymentStatus: paidEnrollment.status || 'pending_approval',
            amount: paidEnrollment.amount || '₹0',
            transactionId: paidEnrollment.transactionId || `TXN_${Date.now()}`,
            paymentMethod: paidEnrollment.paymentMethod || 'unknown',
            isPaid: true,
            source: 'paid_enrollment_sync'
          };
          
          currentApprovals.push(newApproval);
          newEnrollmentsCount++;
        }
      });
      
      if (newEnrollmentsCount > 0) {
        setCourseApprovals(currentApprovals);
        saveToLocalStorage('courseApprovals', currentApprovals);
        addNotification(`Synced ${newEnrollmentsCount} new paid enrollments from UserDashboard`, 'success');
      } else {
        addNotification('No new paid enrollments found in UserDashboard', 'info');
      }
      
      return newEnrollmentsCount;
    } catch (error) {
      console.error('Error syncing paid enrollments:', error);
      addNotification('Failed to sync paid enrollments', 'error');
      return 0;
    }
  };

  const updateApprovalStatus = async (approvalId, status, reason = '') => {
    try {
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
      
      const approval = courseApprovals.find(a => a._id === approvalId);
      
      // Emit status update back to UserDashboard via socket
      if (socket) {
        socket.emit('approvalUpdated', {
          courseId: approval.courseId,
          courseTitle: approval.courseTitle,
          userEmail: approval.userEmail,
          status: status,
          updatedAt: new Date().toISOString(),
          ...(reason && { rejectionReason: reason })
        });
      }
      
      // Also update localStorage for UserDashboard to detect
      try {
        if (status === 'approved') {
          // Add to approved courses in UserDashboard storage
          const approvedCourses = JSON.parse(localStorage.getItem('approvedCourses') || '[]');
          if (!approvedCourses.includes(approval.courseId)) {
            approvedCourses.push(approval.courseId);
            localStorage.setItem('approvedCourses', JSON.stringify(approvedCourses));
          }
          
          // Remove from pending approvals in UserDashboard storage
          const pendingApprovals = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
          const updatedPending = pendingApprovals.filter(pa => 
            !(pa.courseId === approval.courseId && pa.studentEmail === approval.userEmail)
          );
          localStorage.setItem('pendingApprovals', JSON.stringify(updatedPending));
        }
      } catch (storageError) {
        console.log('Storage update failed:', storageError);
      }
      
      addNotification(`Course enrollment ${status} for ${approval?.userName}`, 'success');
      
    } catch (error) {
      console.error('Error updating approval status:', error);
      addNotification('Failed to update approval status', 'error');
    }
  };

  const bulkUpdateApprovals = (status, approvalIds) => {
    const confirmAction = window.confirm(`Are you sure you want to ${status} ${approvalIds.length} enrollment(s)?`);
    if (!confirmAction) return;

    approvalIds.forEach(approvalId => {
      updateApprovalStatus(approvalId, status);
    });
  };

  const getApprovalStats = () => {
    const total = courseApprovals.length;
    const pending = courseApprovals.filter(a => a.status === 'pending').length;
    const approved = courseApprovals.filter(a => a.status === 'approved').length;
    const rejected = courseApprovals.filter(a => a.status === 'rejected').length;
    const completed = courseApprovals.filter(a => a.completed).length;
    const paid = courseApprovals.filter(a => a.isPaid).length;

    return { total, pending, approved, rejected, completed, paid };
  };

  const filteredApprovals = courseApprovals.filter(approval => {
    const matchesSearch = 
      approval.userName?.toLowerCase().includes(searchApprovalTerm.toLowerCase()) ||
      approval.courseTitle?.toLowerCase().includes(searchApprovalTerm.toLowerCase()) ||
      approval.userEmail?.toLowerCase().includes(searchApprovalTerm.toLowerCase());
    
    const matchesFilter = 
      approvalFilter === 'all' || 
      approval.status === approvalFilter;
    
    return matchesSearch && matchesFilter;
  });

  // ============================
  // REVIEWS MANAGEMENT
  // ============================

  const syncReviewsFromUserDashboard = () => {
    const possibleKeys = [
      'clinigoalReviews',
      'studentReviews',
      'userDashboardReviews',
      'userReviews'
    ];
    
    let userDashboardReviews = [];
    
    for (const key of possibleKeys) {
      const reviewsFromKey = loadFromLocalStorage(key, []);
      if (reviewsFromKey.length > 0) {
        userDashboardReviews = [...userDashboardReviews, ...reviewsFromKey];
      }
    }
    
    const uniqueReviews = userDashboardReviews.filter((review, index, self) =>
      index === self.findIndex(r => 
        r._id === review._id || 
        (r.courseId === review.courseId && r.userName === review.userName && r.reviewText === review.reviewText)
      )
    );
    
    if (uniqueReviews.length > 0) {
      const formattedReviews = uniqueReviews.map(review => ({
        ...review,
        status: review.status || 'pending',
        createdAt: review.createdAt || new Date().toISOString(),
        studentEmail: review.studentEmail || `${review.userName?.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        verified: review.verified || false
      }));
      
      const existingReviews = loadFromLocalStorage('adminReviews', []);
      const allReviews = [...formattedReviews, ...existingReviews];
      
      const finalReviews = allReviews.filter((review, index, self) =>
        index === self.findIndex(r => r._id === review._id)
      );
      
      setReviews(finalReviews);
      saveToLocalStorage('adminReviews', finalReviews);
      
      return finalReviews.length;
    }
    
    return 0;
  };

  const fetchReviews = async () => {
    try {
      let allReviews = [];
      
      try {
        const response = await fetch('http://localhost:5000/api/reviews');
        if (response.ok) {
          const apiReviews = await response.json();
          allReviews = apiReviews;
        } else {
          throw new Error('API response not OK');
        }
      } catch (error) {
        console.log('Reviews API not available, checking localStorage and UserDashboard');
        
        const syncedCount = syncReviewsFromUserDashboard();
        
        if (syncedCount === 0) {
          const localReviews = loadFromLocalStorage('adminReviews', []);
          if (localReviews.length > 0) {
            allReviews = localReviews;
          } else {
            allReviews = [
              {
                _id: 'rev1',
                courseId: '1',
                courseTitle: "Clinical Research Associate",
                userName: "Dr. Priya Sharma",
                rating: 5,
                reviewText: "Excellent course! The content is comprehensive and perfectly structured for clinical research professionals. The instructor's expertise shines through every module.",
                createdAt: new Date('2024-01-20').toISOString(),
                status: 'pending',
                studentEmail: 'priya.sharma@example.com',
                helpful: 12,
                verified: false
              },
              {
                _id: 'rev2',
                courseId: '2',
                courseTitle: "Bioinformatics & Genomics",
                userName: "Rahul Verma",
                rating: 4,
                reviewText: "Great introduction to bioinformatics. The practical examples and coding exercises were very helpful. Would appreciate more advanced NGS analysis content.",
                createdAt: new Date('2024-02-15').toISOString(),
                status: 'approved',
                studentEmail: 'rahul.verma@example.com',
                helpful: 8,
                verified: true
              }
            ];
          }
        }
      }

      setReviews(allReviews);
      saveToLocalStorage('adminReviews', allReviews);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      addNotification('Failed to load reviews', 'error');
    }
  };

  const forceSyncReviews = () => {
    const syncedCount = syncReviewsFromUserDashboard();
    if (syncedCount > 0) {
      addNotification(`Synced ${syncedCount} new reviews from UserDashboard (manual approval required)`, 'success');
    } else {
      addNotification('No new reviews found in UserDashboard', 'info');
    }
  };

  const approveReview = async (reviewId) => {
    try {
      const updatedReviews = reviews.map(review => 
        review._id === reviewId 
          ? { ...review, status: 'approved', verified: true }
          : review
      );
      
      setReviews(updatedReviews);
      saveToLocalStorage('adminReviews', updatedReviews);
      
      try {
        await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'approved' })
        });
      } catch (error) {
        console.log('API update failed, using localStorage only');
      }
      
      addNotification('Review approved successfully!', 'success');
    } catch (error) {
      console.error('Error approving review:', error);
      addNotification('Failed to approve review', 'error');
    }
  };

  const rejectReview = async (reviewId) => {
    const reason = prompt('Please provide reason for rejection:');
    if (!reason) return;

    try {
      const updatedReviews = reviews.map(review => 
        review._id === reviewId 
          ? { ...review, status: 'rejected', rejectionReason: reason }
          : review
      );
      
      setReviews(updatedReviews);
      saveToLocalStorage('adminReviews', updatedReviews);
      
      try {
        await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
        });
      } catch (error) {
        console.log('API update failed, using localStorage only');
      }
      
      addNotification('Review rejected successfully!', 'success');
    } catch (error) {
      console.error('Error rejecting review:', error);
      addNotification('Failed to reject review', 'error');
    }
  };

  const deleteReview = async (reviewId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this review?');
    if (!confirmDelete) return;

    try {
      const updatedReviews = reviews.filter(review => review._id !== reviewId);
      setReviews(updatedReviews);
      saveToLocalStorage('adminReviews', updatedReviews);
      
      try {
        await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.log('API delete failed, using localStorage only');
      }
      
      addNotification('Review deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting review:', error);
      addNotification('Failed to delete review', 'error');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.userName?.toLowerCase().includes(searchReviewTerm.toLowerCase()) ||
      review.courseTitle?.toLowerCase().includes(searchReviewTerm.toLowerCase()) ||
      review.reviewText?.toLowerCase().includes(searchReviewTerm.toLowerCase());
    
    const matchesFilter = 
      reviewFilter === 'all' || 
      review.status === reviewFilter;
    
    return matchesSearch && matchesFilter;
  });

  const reviewStats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    averageRating: reviews.length > 0 
      ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
      : 0
  };

  // ============================
  // ANALYTICS FUNCTIONS
  // ============================

  const generateAnalyticsData = () => {
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
  };

  const generateChartData = () => {
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
        target: monthRevenue * 1.2
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

    setChartData({
      revenueData: revenueTrend,
      studentGrowthData: studentGrowth,
      coursePerformanceData: [],
      enrollmentData: [],
      engagementData: []
    });
  };

  // ============================
  // SETTINGS FUNCTIONS
  // ============================

  const handleSettingsChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    try {
      saveToLocalStorage('adminSettings', settings);
      addNotification('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      addNotification('Failed to save settings', 'error');
    }
  };

  const resetSettings = () => {
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
  };

  // ============================
  // DATA FETCHING FUNCTIONS
  // ============================

  const fetchPayments = async () => {
    try {
      let allPayments = [];
      try {
        const response = await fetch('http://localhost:5000/api/payments');
        if (response.ok) {
          const apiPayments = await response.json();
          allPayments = [...apiPayments];
        }
      } catch (error) {
        console.log('Payments API not available, checking localStorage');
      }

      if (allPayments.length === 0) {
        const adminPayments = JSON.parse(localStorage.getItem('adminPayments') || '[]');
        const userPayments = JSON.parse(localStorage.getItem('userPayments') || '[]');
        const combinedPayments = [...adminPayments, ...userPayments];
        const uniquePayments = combinedPayments.filter((payment, index, self) =>
          index === self.findIndex(p => p._id === payment._id)
        );
        allPayments = uniquePayments;
      }

      allPayments = allPayments.map(payment => ({
        ...payment,
        timestamp: payment.timestamp || new Date().toISOString()
      }));

      allPayments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPayments(allPayments);
      return allPayments;
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
      return [];
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      if (response.ok) {
        const apiCourses = await response.json();
        setCourses(apiCourses);
        saveToLocalStorage('adminCourses', apiCourses);
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      console.log('Using localStorage for courses');
      const savedCourses = loadFromLocalStorage('adminCourses', []);
      setCourses(savedCourses.length > 0 ? savedCourses : defaultCourses);
    }
  };

  const fetchStudents = async () => {
    try {
      try {
        const response = await fetch('http://localhost:5000/api/students');
        if (response.ok) {
          const apiStudents = await response.json();
          setStudents(apiStudents);
          return;
        }
      } catch (error) {
        console.log('Students API not available');
      }

      const studentEmails = new Set();
      const uniqueStudents = payments
        .filter(payment => {
          if (studentEmails.has(payment.studentEmail)) return false;
          studentEmails.add(payment.studentEmail);
          return true;
        })
        .map(payment => ({
          _id: payment.studentEmail,
          name: payment.studentName,
          email: payment.studentEmail,
          enrolledCourses: payments.filter(p => p.studentEmail === payment.studentEmail)
            .map(p => ({ title: p.courseTitle, id: p.courseId })),
          joinDate: payment.timestamp,
          status: 'active'
        }));

      setStudents(uniqueStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      try {
        const response = await fetch('http://localhost:5000/api/instructors');
        if (response.ok) {
          const apiInstructors = await response.json();
          setInstructors(apiInstructors);
          return;
        }
      } catch (error) {
        console.log('Instructors API not available');
      }

      const instructorNames = new Set();
      const uniqueInstructors = courses
        .filter(course => {
          if (instructorNames.has(course.instructor)) return false;
          instructorNames.add(course.instructor);
          return true;
        })
        .map(course => ({
          _id: `instr_${course.instructor.replace(/\s+/g, '_').toLowerCase()}`,
          name: course.instructor,
          courses: courses.filter(c => c.instructor === course.instructor)
            .map(c => c.title),
          students: courses.filter(c => c.instructor === course.instructor)
            .reduce((sum, c) => sum + (c.students || 0), 0),
          rating: course.rating
        }));

      setInstructors(uniqueInstructors);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/videos');
      if (response.ok) {
        const videosData = await response.json();
        setVideos(videosData);
        saveToLocalStorage('adminVideos', videosData);
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      console.log('Using localStorage for videos');
      const localVideos = loadFromLocalStorage('adminVideos', []);
      setVideos(localVideos.length > 0 ? localVideos : dummyVideos);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/notes');
      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
        saveToLocalStorage('adminNotes', notesData);
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      console.log('Using localStorage for notes');
      const localNotes = loadFromLocalStorage('adminNotes', []);
      setNotes(localNotes.length > 0 ? localNotes : dummyNotes);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/quizzes');
      if (response.ok) {
        const quizzesData = await response.json();
        setQuizzes(quizzesData);
        saveToLocalStorage('adminQuizzes', quizzesData);
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      console.log('Using localStorage for quizzes');
      const localQuizzes = loadFromLocalStorage('adminQuizzes', []);
      setQuizzes(localQuizzes.length > 0 ? localQuizzes : dummyQuizzes);
    }
  };

  // ============================
  // PAYMENT TIME UTILITY FUNCTIONS
  // ============================

  const formatPaymentTime = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    const paymentDate = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - paymentDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return paymentDate.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  const getDetailedTimeInfo = (timestamp) => {
    if (!timestamp) return 'No timestamp available';
    
    const paymentDate = new Date(timestamp);
    return paymentDate.toLocaleString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  };

  const getPaymentDayInfo = (timestamp) => {
    if (!timestamp) return '';
    
    const paymentDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (paymentDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (paymentDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return paymentDate.toLocaleDateString('en-IN', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  // ============================
  // RENDER FUNCTIONS
  // ============================

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="overview-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your clinical education platform</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{stats.totalRevenue}</h3>
            <p>Total Revenue</p>
            <span className="stat-trend">+12% this month</span>
          </div>
        </div>

        <div className="stat-card students">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
            <span className="stat-trend">+5 new this week</span>
          </div>
        </div>

        <div className="stat-card courses">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
            <span className="stat-trend">Active programs</span>
          </div>
        </div>

        <div className="stat-card success-rate">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.paymentSuccessRate}%</h3>
            <p>Payment Success Rate</p>
            <span className="stat-trend">98% average</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-btn primary" onClick={() => setActiveSection('courses')}>
            <span className="action-icon">📚</span>
            <span>Manage Courses</span>
          </button>
          <button className="action-btn secondary" onClick={() => setActiveSection('students')}>
            <span className="action-icon">👥</span>
            <span>View Students</span>
          </button>
          <button className="action-btn success" onClick={() => setActiveSection('payments')}>
            <span className="action-icon">💳</span>
            <span>Payment History</span>
          </button>
          <button className="action-btn warning" onClick={() => setActiveSection('course')}>
            <span className="action-icon">🎬</span>
            <span>Course Content</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="payments-section">
      <div className="section-header">
        <h2>Payment Management</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchPayments}>
            Refresh Payments
          </button>
          <div className="payment-stats">
            <span className="stat-badge">Total: {payments.length}</span>
            <span className="stat-badge success">
              Completed: {payments.filter(p => p.status === 'completed').length}
            </span>
            <span className="stat-badge warning">
              Pending: {payments.filter(p => p.status !== 'completed').length}
            </span>
          </div>
        </div>
      </div>

      {payments.length > 0 ? (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Payment Time</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {payments.slice(0, 20).map(payment => (
                <tr key={payment._id}>
                  <td className="transaction-id">
                    {payment.transactionId || payment._id}
                  </td>
                  <td>
                    <div className="student-info">
                      <strong>{payment.studentName}</strong>
                      <span>{payment.studentEmail}</span>
                    </div>
                  </td>
                  <td>
                    <div className="course-info">
                      <strong>{payment.courseTitle}</strong>
                      <span className="course-duration">
                        {courses.find(c => c._id === payment.courseId)?.duration || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="amount">
                    <strong>{payment.amount}</strong>
                    <span className="payment-method">
                      {payment.paymentMethod ? `via ${payment.paymentMethod}` : 'Online Payment'}
                    </span>
                  </td>
                  <td className="payment-time">
                    <div className="time-display" title={getDetailedTimeInfo(payment.timestamp)}>
                      <div className="time-relative">
                        {formatPaymentTime(payment.timestamp)}
                      </div>
                      <div className="time-full">
                        {getPaymentDayInfo(payment.timestamp)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${payment.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                      {payment.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <div className="payment-actions">
                      <button 
                        className="btn-action info"
                        title={getDetailedTimeInfo(payment.timestamp)}
                      >
                        Time Details
                      </button>
                      <button 
                        className="btn-action secondary"
                        onClick={() => {
                          console.log('Payment details:', payment);
                          addNotification(`Viewing details for ${payment.transactionId}`, 'info');
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="payment-summary">
            <div className="summary-card">
              <h4>Recent Activity</h4>
              <div className="activity-list">
                {payments.slice(0, 5).map(payment => (
                  <div key={payment._id} className="activity-item">
                    <div className="activity-icon">
                      {payment.status === 'completed' ? '✅' : '⏳'}
                    </div>
                    <div className="activity-content">
                      <p>
                        <strong>{payment.studentName}</strong> paid <strong>{payment.amount}</strong>
                      </p>
                      <span className="activity-time">
                        {formatPaymentTime(payment.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="summary-card">
              <h4>Payment Statistics</h4>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Last Payment:</span>
                  <span className="stat-value">
                    {payments.length > 0 ? formatPaymentTime(payments[0].timestamp) : 'N/A'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Today's Revenue:</span>
                  <span className="stat-value">
                    ₹{payments
                      .filter(p => {
                        const paymentDate = new Date(p.timestamp);
                        const today = new Date();
                        return paymentDate.toDateString() === today.toDateString();
                      })
                      .reduce((sum, p) => sum + (parseFloat(p.amount.replace(/[^0-9.-]+/g, '')) || 0), 0)
                      .toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">This Week:</span>
                  <span className="stat-value">
                    {payments.filter(p => {
                      const paymentDate = new Date(p.timestamp);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return paymentDate >= weekAgo;
                    }).length} payments
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💳</div>
          <h3>No Payment Records</h3>
          <p>When students enroll in courses, their payment information will appear here.</p>
          <div className="empty-state-actions">
            <button className="btn-primary" onClick={fetchPayments}>
              Check for Payments
            </button>
            <button className="btn-secondary" onClick={() => {
              const samplePayment = {
                _id: `pay_${Date.now()}`,
                transactionId: `TXN${Date.now()}`,
                studentName: 'Demo Student',
                studentEmail: 'demo@example.com',
                courseTitle: 'Clinical Research Associate',
                courseId: '1',
                amount: '₹1,29,999',
                status: 'completed',
                timestamp: new Date().toISOString(),
                paymentMethod: 'Credit Card'
              };
              setPayments([samplePayment]);
              addNotification('Sample payment added for demonstration', 'info');
            }}>
              Add Sample Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudents = () => (
    <div className="students-section">
      <div className="section-header">
        <h2>Student Management</h2>
      </div>

      {students.length > 0 ? (
        <div className="students-table-container">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Enrolled Courses</th>
                <th>Join Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>
                    <div className="student-info-table">
                      <div className="student-avatar small">
                        {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <strong>{student.name}</strong>
                      </div>
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>
                    <div className="enrolled-courses-list">
                      {student.enrolledCourses?.slice(0, 2).map(course => (
                        <span key={course.id} className="course-tag">{course.title}</span>
                      ))}
                      {student.enrolledCourses?.length > 2 && (
                        <span className="more-courses">+{student.enrolledCourses.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td>{new Date(student.joinDate).toLocaleDateString()}</td>
                  <td>
                    <span className="status-badge status-completed">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No Students Found</h3>
          <p>Student information will appear here when they enroll in courses.</p>
        </div>
      )}
    </div>
  );

  const renderCourses = () => (
    <div className="courses-section">
      <div className="section-header">
        <h2>Course Management</h2>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingCourse(null);
              setShowCourseForm(true);
            }}
          >
            Add Course
          </button>
        </div>
      </div>

      {courses.length > 0 ? (
        <div className="courses-grid admin">
          {courses.map(course => (
            <div key={course._id} className="course-card admin">
              <div className="course-image">
                <img src={course.image} alt={course.title} />
                <div className="course-overlay">
                  <span className="course-level">{course.level}</span>
                  <span className="course-price">{course.price}</span>
                </div>
              </div>
              <div className="course-content">
                <h3>{course.title}</h3>
                <p className="instructor">By {course.instructor}</p>
                <p className="description">{course.description}</p>
                
                <div className="course-stats">
                  <div className="stat">
                    <span className="stat-icon">👥</span>
                    <span>{course.students || 0} students</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">⭐</span>
                    <span>{course.rating || '4.5'}/5</span>
                  </div>
                </div>
                
                <div className="course-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => editCourse(course)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      setActiveSection('course');
                      setFilterCourse(course._id);
                    }}
                  >
                    Manage Content
                  </button>
                  <button 
                    className="btn-danger"
                    onClick={() => deleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No Courses Available</h3>
          <p>Add courses to start your clinical education program.</p>
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingCourse(null);
              setShowCourseForm(true);
            }}
          >
            Add Your First Course
          </button>
        </div>
      )}
    </div>
  );

  const renderCourse = () => (
    <div className="course-content-section">
      <div className="section-header">
        <h2>Course Content Management</h2>
        <div className="content-type-buttons">
          <button 
            className={`content-type-btn ${activeCourseSection === 'videos' ? 'active' : ''}`}
            onClick={() => setActiveCourseSection('videos')}
          >
            Videos ({videos.length})
          </button>
          <button 
            className={`content-type-btn ${activeCourseSection === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveCourseSection('notes')}
          >
            Notes ({notes.length})
          </button>
          <button 
            className={`content-type-btn ${activeCourseSection === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveCourseSection('quizzes')}
          >
            Quizzes ({quizzes.length})
          </button>
        </div>
      </div>

      {activeCourseSection === 'videos' && (
        <div className="content-section">
          <div className="content-header">
            <h3>Video Management ({videos.length})</h3>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingItem(null);
                setShowVideoForm(true);
              }}
            >
              Upload Video
            </button>
          </div>

          {videos.length > 0 ? (
            <div className="content-grid">
              {videos.map(video => (
                <div key={video._id} className="content-card">
                  <div className="content-thumbnail">
                    <img src={video.thumbnail} alt={video.title} />
                  </div>
                  <div className="content-info">
                    <h4>{video.title}</h4>
                    <p>{video.description}</p>
                    <div className="content-meta">
                      <span>Duration: {video.duration}</span>
                      <span>Course: {courses.find(c => c._id === video.course)?.title || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button className="btn-action secondary" onClick={() => editVideo(video)}>
                      Edit
                    </button>
                    <button className="btn-action danger" onClick={() => deleteVideo(video._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎬</div>
              <h3>No Videos Found</h3>
              <p>Start by uploading video lectures to your courses.</p>
            </div>
          )}
        </div>
      )}

      {activeCourseSection === 'notes' && (
        <div className="content-section">
          <div className="content-header">
            <h3>Notes Management ({notes.length})</h3>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingItem(null);
                setShowNoteForm(true);
              }}
            >
              Upload Note
            </button>
          </div>

          {notes.length > 0 ? (
            <div className="content-grid">
              {notes.map(note => (
                <div key={note._id} className="content-card">
                  <div className="content-icon">
                    {note.fileType === 'pdf' ? '📄' : '📝'}
                  </div>
                  <div className="content-info">
                    <h4>{note.title}</h4>
                    <p>{note.description}</p>
                    <div className="content-meta">
                      <span>Type: {note.fileType.toUpperCase()}</span>
                      <span>Course: {courses.find(c => c._id === note.course)?.title || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button className="btn-action secondary" onClick={() => editNote(note)}>
                      Edit
                    </button>
                    <button className="btn-action danger" onClick={() => deleteNote(note._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No Notes Found</h3>
              <p>Start by uploading study notes to your courses.</p>
            </div>
          )}
        </div>
      )}

      {activeCourseSection === 'quizzes' && (
        <div className="content-section">
          <div className="content-header">
            <h3>Quiz Management ({quizzes.length})</h3>
            <button 
              className="btn-primary"
              onClick={() => {
                setEditingItem(null);
                setShowQuizForm(true);
              }}
            >
              Create Quiz
            </button>
          </div>

          {quizzes.length > 0 ? (
            <div className="content-grid">
              {quizzes.map(quiz => (
                <div key={quiz._id} className="content-card">
                  <div className="content-icon">❓</div>
                  <div className="content-info">
                    <h4>{quiz.title}</h4>
                    <p>{quiz.description}</p>
                    <div className="content-meta">
                      <span>Questions: {quiz.questions?.length || 0}</span>
                      <span>Time: {quiz.timeLimit} min</span>
                      <span>Course: {courses.find(c => c._id === quiz.course)?.title || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="content-actions">
                    <button className="btn-action secondary" onClick={() => editQuiz(quiz)}>
                      Edit
                    </button>
                    <button className="btn-action danger" onClick={() => deleteQuiz(quiz._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">❓</div>
              <h3>No Quizzes Found</h3>
              <p>Start by creating quizzes for your courses.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="reviews-section">
      <div className="section-header">
        <h2>Student Reviews Management</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={fetchReviews}>
            Refresh Reviews
          </button>
          <button className="btn-primary" onClick={forceSyncReviews}>
            Sync from UserDashboard
          </button>
        </div>
      </div>

      <div className="review-stats-grid">
        <div className="review-stat-card total">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{reviewStats.total}</h3>
            <p>Total Reviews</p>
          </div>
        </div>
        <div className="review-stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{reviewStats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="review-stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{reviewStats.approved}</h3>
            <p>Approved</p>
          </div>
        </div>
        <div className="review-stat-card rating">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{reviewStats.averageRating}</h3>
            <p>Avg Rating</p>
          </div>
        </div>
      </div>

      <div className="reviews-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search reviews by student, course, or content..."
            value={searchReviewTerm}
            onChange={(e) => setSearchReviewTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <select
          value={reviewFilter}
          onChange={(e) => setReviewFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {filteredReviews.length > 0 ? (
        <div className="reviews-table-container">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map(review => (
                <tr key={review._id}>
                  <td>
                    <div className="student-info">
                      <strong>{review.userName}</strong>
                      <span>{review.studentEmail}</span>
                      {review.verified && <span className="verified-badge">Verified</span>}
                    </div>
                  </td>
                  <td>
                    <div className="course-info">
                      <strong>{review.courseTitle}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="rating-display">
                      <div className="stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <span className="rating-number">{review.rating}/5</span>
                    </div>
                  </td>
                  <td>
                    <div className="review-text">
                      <p>{review.reviewText}</p>
                      {review.helpful > 0 && (
                        <span className="helpful-count">Found helpful by {review.helpful} users</span>
                      )}
                    </div>
                  </td>
                  <td className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-badge status-${review.status}`}>
                      {review.status === 'pending' && 'Pending'}
                      {review.status === 'approved' && 'Approved'}
                      {review.status === 'rejected' && 'Rejected'}
                    </span>
                  </td>
                  <td>
                    <div className="review-actions">
                      {review.status === 'pending' && (
                        <>
                          <button 
                            className="btn-action success"
                            onClick={() => approveReview(review._id)}
                            title="Approve this review"
                          >
                            Approve
                          </button>
                          <button 
                            className="btn-action danger"
                            onClick={() => rejectReview(review._id)}
                            title="Reject this review"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        className="btn-action danger"
                        onClick={() => deleteReview(review._id)}
                        title="Delete this review"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>No Reviews Found</h3>
          <p>No student reviews match your search criteria.</p>
          <div className="empty-state-actions">
            <button className="btn-primary" onClick={forceSyncReviews}>
              Sync from UserDashboard
            </button>
            <button className="btn-secondary" onClick={() => {setSearchReviewTerm(''); setReviewFilter('all');}}>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      <div className="sync-info">
        <p>
          Manual Approval Required: All reviews from UserDashboard require manual approval. 
          Use the approve/reject actions to manage reviews.
        </p>
      </div>
    </div>
  );

  const renderCourseApprovals = () => {
    const approvalStats = getApprovalStats();
    
    return (
      <div className="course-approvals-section">
        <div className="section-header">
          <h2>Course Enrollment Approvals</h2>
          <div className="header-actions">
            <button className="btn-secondary" onClick={fetchCourseApprovals}>
              Refresh Approvals
            </button>
            <button className="btn-primary" onClick={syncPaidEnrollments}>
              Sync Paid Enrollments
            </button>
            <button className="btn-success" onClick={() => {
              const { payments, approvals } = syncAllUserDashboardPayments();
              addNotification(`Found ${payments.length} payments and ${approvals.length} approvals`, 'info');
              fetchCourseApprovals();
            }}>
              Force Full Sync
            </button>
            <div className="approval-stats">
              <span className="stat-badge">Total: {approvalStats.total}</span>
              <span className="stat-badge warning">Pending: {approvalStats.pending}</span>
              <span className="stat-badge success">Approved: {approvalStats.approved}</span>
              <span className="stat-badge danger">Rejected: {approvalStats.rejected}</span>
              <span className="stat-badge info">Paid: {approvalStats.paid}</span>
            </div>
          </div>
        </div>

        <div className="approval-stats-grid">
          <div className="approval-stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{approvalStats.total}</h3>
              <p>Total Enrollments</p>
            </div>
          </div>
          <div className="approval-stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{approvalStats.pending}</h3>
              <p>Pending Approval</p>
            </div>
          </div>
          <div className="approval-stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{approvalStats.approved}</h3>
              <p>Approved</p>
            </div>
          </div>
          <div className="approval-stat-card completed">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <h3>{approvalStats.completed}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        <div className="approvals-filter-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by student name, course, or email..."
              value={searchApprovalTerm}
              onChange={(e) => setSearchApprovalTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Enrollments</option>
            <option value="pending">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="sync-info">
          <p>
            Manual Approval Required: All enrollments require manual approval, including paid enrollments. 
            Use the approve/reject actions to manage enrollments.
          </p>
        </div>

        {filteredApprovals.length > 0 ? (
          <div className="approvals-table-container">
            <table className="approvals-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Enrollment Date</th>
                  <th>Progress</th>
                  <th>Payment Status</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApprovals.map(approval => (
                  <tr key={approval._id} className={approval.isPaid ? 'paid-enrollment' : ''}>
                    <td>
                      <div className="student-info">
                        <strong>{approval.userName}</strong>
                        <span>{approval.userEmail}</span>
                        {approval.isPaid && (
                          <span className="paid-badge">Paid</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="course-info">
                        <strong>{approval.courseTitle}</strong>
                        <span className="course-duration">
                          {courses.find(c => c._id === approval.courseId)?.duration || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="date">
                      {new Date(approval.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="progress-display">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${approval.progress}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{approval.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="payment-info">
                        <span className={`payment-status ${approval.paymentStatus}`}>
                          {approval.paymentStatus === 'completed' ? 'Completed' : 'Failed'}
                        </span>
                        {approval.transactionId && (
                          <small>ID: {approval.transactionId}</small>
                        )}
                      </div>
                    </td>
                    <td className="amount">
                      <strong>{approval.amount}</strong>
                      {approval.paymentMethod && (
                        <small>via {approval.paymentMethod}</small>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge status-${approval.status}`}>
                        {approval.status === 'pending' && 'Pending'}
                        {approval.status === 'approved' && 'Approved'}
                        {approval.status === 'rejected' && 'Rejected'}
                      </span>
                    </td>
                    <td>
                      <div className="approval-actions">
                        {approval.status === 'pending' && (
                          <>
                            <button 
                              className="btn-action success"
                              onClick={() => updateApprovalStatus(approval._id, 'approved')}
                              title="Approve this enrollment"
                            >
                              Approve
                            </button>
                            <button 
                              className="btn-action danger"
                              onClick={() => {
                                const reason = prompt('Please provide reason for rejection:');
                                if (reason) {
                                  updateApprovalStatus(approval._id, 'rejected', reason);
                                }
                              }}
                              title="Reject this enrollment"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {approval.status === 'approved' && !approval.completed && (
                          <button 
                            className="btn-action warning"
                            onClick={() => updateApprovalStatus(approval._id, 'pending')}
                            title="Move back to pending"
                          >
                            Revoke
                          </button>
                        )}
                        {approval.status === 'rejected' && (
                          <button 
                            className="btn-action info"
                            onClick={() => updateApprovalStatus(approval._id, 'pending')}
                            title="Move back to pending"
                          >
                            Restore
                          </button>
                        )}
                        <button 
                          className="btn-action secondary"
                          onClick={() => {
                            console.log('Student details:', approval);
                            addNotification(`Viewing details for ${approval.userName}`, 'info');
                          }}
                          title="View detailed information"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Course Enrollments Found</h3>
            <p>No student enrollments match your search criteria.</p>
            <div className="empty-state-actions">
              <button className="btn-primary" onClick={fetchCourseApprovals}>
                Refresh Data
              </button>
              <button className="btn-secondary" onClick={() => {setSearchApprovalTerm(''); setApprovalFilter('all');}}>
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {filteredApprovals.length > 0 && (
          <div className="bulk-actions">
            <h4>Bulk Actions</h4>
            <div className="bulk-buttons">
              <button 
                className="btn-success"
                onClick={() => {
                  const pendingIds = filteredApprovals
                    .filter(a => a.status === 'pending')
                    .map(a => a._id);
                  if (pendingIds.length > 0) {
                    bulkUpdateApprovals('approved', pendingIds);
                  } else {
                    addNotification('No pending enrollments to approve', 'warning');
                  }
                }}
              >
                Approve All Pending
              </button>
              <button 
                className="btn-danger"
                onClick={() => {
                  const pendingIds = filteredApprovals
                    .filter(a => a.status === 'pending')
                    .map(a => a._id);
                  if (pendingIds.length > 0) {
                    bulkUpdateApprovals('rejected', pendingIds);
                  } else {
                    addNotification('No pending enrollments to reject', 'warning');
                  }
                }}
              >
                Reject All Pending
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h2>Platform Analytics & Insights</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={generateAnalyticsData}>
            Refresh Analytics
          </button>
          <button className="btn-primary" onClick={() => window.print()}>
            Export Report
          </button>
        </div>
      </div>

      <div className="analytics-overview">
        <div className="metric-card primary">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>{stats.totalRevenue}</h3>
            <p>Total Revenue</p>
            <span className="metric-trend positive">+12% this month</span>
          </div>
        </div>
        
        <div className="metric-card success">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>{stats.totalStudents}</h3>
            <p>Total Students</p>
            <span className="metric-trend positive">+8% growth</span>
          </div>
        </div>
        
        <div className="metric-card warning">
          <div className="metric-icon">📚</div>
          <div className="metric-content">
            <h3>{stats.totalCourses}</h3>
            <p>Active Courses</p>
            <span className="metric-trend positive">+2 new</span>
          </div>
        </div>
        
        <div className="metric-card info">
          <div className="metric-icon">⭐</div>
          <div className="metric-content">
            <h3>{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</h3>
            <p>Avg Rating</p>
            <span className="metric-trend positive">Excellent</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <ChartContainer title="Revenue Trend (Last 6 Months)" className="large">
          <LineChart 
            data={analyticsData.revenueTrend.map(item => item.revenue)}
            labels={analyticsData.revenueTrend.map(item => item.month)}
            color="#3498db"
            height={250}
          />
        </ChartContainer>

        <ChartContainer title="Student Growth">
          <BarChart 
            data={analyticsData.studentGrowth.map(item => item.students)}
            labels={analyticsData.studentGrowth.map(item => item.month)}
            colors={['#2ecc71', '#27ae60', '#229954', '#1e8449', '#196f3d', '#145a32']}
            height={200}
          />
        </ChartContainer>

        <ChartContainer title="Course Performance">
          <BarChart 
            data={analyticsData.coursePerformance.map(item => item.students)}
            labels={analyticsData.coursePerformance.map(item => 
              item.name.split(' ').map(word => word[0]).join('').toUpperCase()
            )}
            colors={['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#1abc9c']}
            height={200}
          />
        </ChartContainer>

        <ChartContainer title="Enrollment by Category">
          <PieChart 
            data={analyticsData.enrollmentStats.map(item => item.count)}
            labels={analyticsData.enrollmentStats.map(item => item.category)}
            colors={analyticsData.enrollmentStats.map(item => item.color)}
            height={200}
          />
        </ChartContainer>

        <ChartContainer title="Platform Performance" className="full-width">
          <div className="metrics-grid">
            <DonutChart 
              value={analyticsData.platformMetrics.completionRate || 75}
              max={100}
              label="Completion"
              color="#3498db"
            />
            <DonutChart 
              value={analyticsData.platformMetrics.engagementScore || 85}
              max={100}
              label="Engagement"
              color="#2ecc71"
            />
            <DonutChart 
              value={analyticsData.platformMetrics.satisfactionRate || 90}
              max={100}
              label="Satisfaction"
              color="#f39c12"
            />
            <DonutChart 
              value={analyticsData.platformMetrics.retentionRate || 80}
              max={100}
              label="Retention"
              color="#9b59b6"
            />
          </div>
        </ChartContainer>

        <ChartContainer title="Recent Platform Activity" className="full-width">
          <div className="activity-list">
            {payments.slice(0, 5).map(payment => (
              <div key={payment._id} className="activity-item">
                <div className="activity-icon">💰</div>
                <div className="activity-content">
                  <p><strong>{payment.studentName}</strong> enrolled in <strong>{payment.courseTitle}</strong></p>
                  <span className="activity-time">
                    {formatPaymentTime(payment.timestamp)} • {payment.amount}
                  </span>
                </div>
              </div>
            ))}
            {reviews.slice(0, 3).map(review => (
              <div key={review._id} className="activity-item">
                <div className="activity-icon">⭐</div>
                <div className="activity-content">
                  <p><strong>{review.userName}</strong> rated <strong>{review.courseTitle}</strong> {review.rating}/5</p>
                  <span className="activity-time">
                    {formatPaymentTime(review.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-section">
      <div className="section-header">
        <h2>Platform Settings</h2>
        <div className="header-actions">
          <button className="btn-secondary" onClick={resetSettings}>
            Reset Defaults
          </button>
          <button className="btn-primary" onClick={saveSettings}>
            Save Settings
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <div className="settings-group">
          <h3>General Settings</h3>
          <div className="settings-form">
            <div className="form-group">
              <label>Platform Name</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => handleSettingsChange('platformName', e.target.value)}
                placeholder="Enter platform name"
              />
            </div>

            <div className="form-group">
              <label>Platform Email</label>
              <input
                type="email"
                value={settings.platformEmail}
                onChange={(e) => handleSettingsChange('platformEmail', e.target.value)}
                placeholder="admin@platform.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingsChange('currency', e.target.value)}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingsChange('timezone', e.target.value)}
                >
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="America/New_York">New York (EST)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3>Review Management</h3>
          <div className="settings-form">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.autoApproveReviews}
                  onChange={(e) => handleSettingsChange('autoApproveReviews', e.target.checked)}
                />
                <span className="checkmark"></span>
                Auto-approve new reviews
              </label>
              <p className="setting-description">
                Automatically approve all new student reviews (Currently disabled)
              </p>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3>Notifications</h3>
          <div className="settings-form">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.notificationEmails}
                  onChange={(e) => handleSettingsChange('notificationEmails', e.target.checked)}
                />
                <span className="checkmark"></span>
                Enable email notifications
              </label>
              <p className="setting-description">
                Receive email alerts for new enrollments, payments, and reviews
              </p>
            </div>
          </div>
        </div>

        <div className="settings-group">
          <h3>System Configuration</h3>
          <div className="settings-form">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                />
                <span className="checkmark"></span>
                Maintenance Mode
              </label>
              <p className="setting-description">
                Temporarily disable platform access for maintenance
              </p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Max File Size (MB)</label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleSettingsChange('maxFileSize', parseInt(e.target.value))}
                  min="1"
                  max="500"
                />
              </div>

              <div className="form-group">
                <label>Session Timeout (min)</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))}
                  min="15"
                  max="480"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingsChange('theme', e.target.value)}
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-group danger-zone">
          <h3>Danger Zone</h3>
          <div className="danger-actions">
            <button className="btn-danger">
              Delete All Data
            </button>
            <button className="btn-warning">
              Clear Cache
            </button>
            <button className="btn-secondary">
              Export All Data
            </button>
          </div>
          <p className="danger-warning">
            These actions are irreversible. Please proceed with caution.
          </p>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
          <button 
            className="notification-close"
            onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );

  // ============================
  // FORM RENDER FUNCTIONS
  // ============================

  const renderVideoForm = () => (
    <div className="modal-overlay active">
      <div className="modal active">
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Video' : 'Upload Video Lecture'}</h3>
          <button className="close-btn" onClick={() => {
            setShowVideoForm(false);
            resetVideoForm();
          }}>×</button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleVideoFormSubmit} className="form">
            <div className="form-group">
              <label>Video Title</label>
              <input
                type="text"
                value={videoForm.title}
                onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter video title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={videoForm.description}
                onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter video description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={videoForm.duration}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 45 min"
                />
              </div>

              <div className="form-group">
                <label>Course</label>
                <select
                  value={videoForm.course}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, course: e.target.value }))}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Video File</label>
              <div className="file-upload-section">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleVideoFileUpload(e.target.files[0])}
                  className="file-input"
                  id="videoFileUpload"
                />
                <label htmlFor="videoFileUpload" className="file-upload-btn">
                  Choose Video File
                </label>
                {videoFile && (
                  <div className="file-preview">
                    <span className="file-name">{videoFile.name}</span>
                    <span className="file-size">({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Thumbnail Image</label>
              <div className="file-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleThumbnailUpload(e.target.files[0])}
                  className="file-input"
                  id="thumbnailUpload"
                />
                <label htmlFor="thumbnailUpload" className="file-upload-btn">
                  Choose Thumbnail
                </label>
                {thumbnailFile && (
                  <div className="file-preview">
                    <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail preview" className="image-preview-small" />
                    <span className="file-name">{thumbnailFile.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowVideoForm(false);
                  resetVideoForm();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={operationLoading.video}
              >
                {operationLoading.video ? 'Saving...' : (editingItem ? 'Update Video' : 'Upload Video')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderNoteForm = () => (
    <div className="modal-overlay active">
      <div className="modal active">
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Document' : 'Upload Document'}</h3>
          <button className="close-btn" onClick={() => {
            setShowNoteForm(false);
            resetNoteForm();
          }}>×</button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleNoteFormSubmit} className="form">
            <div className="form-group">
              <label>Document Title</label>
              <input
                type="text"
                value={noteForm.title}
                onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter document title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={noteForm.description}
                onChange={(e) => setNoteForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter document description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Course</label>
                <select
                  value={noteForm.course}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, course: e.target.value }))}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Document File</label>
              <div className="file-upload-section">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={(e) => handleNoteFileUpload(e.target.files[0])}
                  className="file-input"
                  id="noteFileUpload"
                />
                <label htmlFor="noteFileUpload" className="file-upload-btn">
                  Choose Document
                </label>
                {noteFile && (
                  <div className="file-preview">
                    <span className="file-name">{noteFile.name}</span>
                    <span className="file-size">({(noteFile.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowNoteForm(false);
                  resetNoteForm();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={operationLoading.note}
              >
                {operationLoading.note ? 'Saving...' : (editingItem ? 'Update Document' : 'Upload Document')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderQuizForm = () => (
    <div className="modal-overlay active">
      <div className="modal active large">
        <div className="modal-header">
          <h3>{editingItem ? 'Edit Quiz' : 'Create Quiz'}</h3>
          <button className="close-btn" onClick={() => {
            setShowQuizForm(false);
            resetQuizForm();
          }}>×</button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleQuizFormSubmit} className="form">
            <div className="form-group">
              <label>Quiz Title</label>
              <input
                type="text"
                value={quizForm.title}
                onChange={(e) => setQuizForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={quizForm.description}
                onChange={(e) => setQuizForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter quiz description"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Course</label>
                <select
                  value={quizForm.course}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, course: e.target.value }))}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Time Limit (minutes)</label>
                <input
                  type="number"
                  value={quizForm.timeLimit}
                  onChange={(e) => setQuizForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
                  min="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Quiz Questions</label>
              {quizForm.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-section">
                  <div className="question-header">
                    <h4>Question {qIndex + 1}</h4>
                    {quizForm.questions.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeQuestion(qIndex)}
                      >
                        Remove Question
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                    placeholder="Enter question text"
                    className="question-input"
                  />

                  <div className="options-section">
                    <label>Options:</label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="option-row">
                        <input
                          type="text"
                          value={option.optionText}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, 'optionText', e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          className="option-input"
                        />
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)}
                          />
                          Correct
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="btn-secondary small"
                onClick={addQuestion}
              >
                Add Question
              </button>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowQuizForm(false);
                  resetQuizForm();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={operationLoading.quiz}
              >
                {operationLoading.quiz ? 'Saving...' : (editingItem ? 'Update Quiz' : 'Create Quiz')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderCourseForm = () => (
    <div className="modal-overlay active">
      <div className="modal active large">
        <div className="modal-header">
          <h3>{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
          <button className="close-btn" onClick={() => {
            setShowCourseForm(false);
            resetCourseForm();
          }}>×</button>
        </div>
        <div className="modal-content">
          <form onSubmit={handleCourseFormSubmit} className="form">
            <div className="form-group">
              <label>Course Title</label>
              <input
                type="text"
                value={courseForm.title}
                onChange={(e) => handleCourseFormChange('title', e.target.value)}
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={courseForm.description}
                onChange={(e) => handleCourseFormChange('description', e.target.value)}
                placeholder="Enter course description"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Instructor</label>
                <input
                  type="text"
                  value={courseForm.instructor}
                  onChange={(e) => handleCourseFormChange('instructor', e.target.value)}
                  placeholder="Instructor name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={courseForm.duration}
                  onChange={(e) => handleCourseFormChange('duration', e.target.value)}
                  placeholder="e.g., 16 weeks"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Level</label>
                <select
                  value={courseForm.level}
                  onChange={(e) => handleCourseFormChange('level', e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  type="text"
                  value={courseForm.price}
                  onChange={(e) => handleCourseFormChange('price', e.target.value)}
                  placeholder="e.g., ₹1,29,999"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Course Image</label>
              <div className="file-upload-section">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCourseImageUpload(e.target.files[0])}
                  className="file-input"
                  id="courseImageUpload"
                />
                <label htmlFor="courseImageUpload" className="file-upload-btn">
                  Choose Image
                </label>
                {courseForm.image && (
                  <div className="file-preview">
                    <img src={courseForm.image} alt="Course preview" className="image-preview" />
                    <span className="file-name">Image selected</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Course Features</label>
              {courseForm.features.map((feature, index) => (
                <div key={index} className="feature-input-group">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                  />
                  {courseForm.features.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeFeature(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary small"
                onClick={addFeature}
              >
                Add Feature
              </button>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowCourseForm(false);
                  resetCourseForm();
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderPreviewModal = () => (
    <div className="modal-overlay active">
      <div className="modal active">
        <div className="modal-header">
          <h3>Preview</h3>
          <button className="close-btn" onClick={() => setPreviewItem(null)}>×</button>
        </div>
        <div className="modal-content">
          <p>Preview content will be displayed here.</p>
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          
        </div>
        <div className="admin-info">
          <div className="admin-avatar">A</div>
          <div className="admin-details">
            <strong>Admin Panel</strong>
            
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          Dashboard
        </button>
        <button 
          className={`nav-item ${activeSection === 'payments' ? 'active' : ''}`}
          onClick={() => setActiveSection('payments')}
        >
          Payments
        </button>
        <button 
          className={`nav-item ${activeSection === 'students' ? 'active' : ''}`}
          onClick={() => setActiveSection('students')}
        >
          Students
        </button>
        <button 
          className={`nav-item ${activeSection === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveSection('courses')}
        >
          Courses
        </button>
        <button 
          className={`nav-item ${activeSection === 'course' ? 'active' : ''}`}
          onClick={() => setActiveSection('course')}
        >
          Course Content
        </button>
        <button 
          className={`nav-item ${activeSection === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveSection('approvals')}
        >
          Approvals ({getApprovalStats().pending})
        </button>
        <button 
          className={`nav-item ${activeSection === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveSection('reviews')}
        >
          Reviews ({reviewStats.pending})
        </button>
        <button 
          className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveSection('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          Settings
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-indicator online"></div>
          <span>System Online</span>
        </div>
        <button className="nav-item logout">
          Logout
        </button>
      </div>
    </div>
  );

  const calculateStats = () => {
    const totalRevenue = payments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, '')) || 0;
      return sum + amount;
    }, 0);

    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalInstructors = instructors.length;
    
    const successfulPayments = payments.filter(p => p.status === 'completed').length;
    const paymentSuccessRate = payments.length > 0 ? (successfulPayments / payments.length) * 100 : 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyRevenue = payments
      .filter(p => new Date(p.timestamp) >= thirtyDaysAgo)
      .reduce((sum, payment) => {
        const amount = parseFloat(payment.amount.replace(/[^0-9.-]+/g, '')) || 0;
        return sum + amount;
      }, 0);

    setStats({
      totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
      totalStudents,
      totalCourses,
      totalInstructors,
      paymentSuccessRate: Math.round(paymentSuccessRate),
      monthlyRevenue: `₹${monthlyRevenue.toLocaleString('en-IN')}`,
      activeUsers: Math.round(totalStudents * 0.7),
      coursePerformance: [],
      revenueTrend: [],
      studentGrowth: [],
      enrollmentTrend: [],
      platformEngagement: {
        avgCompletionRate: 0,
        avgTimeSpent: 0,
        satisfactionScore: reviewStats.averageRating || 4.6
      }
    });

    generateChartData();
  };

  // Initialize course form when editing
  useEffect(() => {
    if (editingCourse && showCourseForm) {
      setCourseForm({
        title: editingCourse.title || '',
        description: editingCourse.description || '',
        instructor: editingCourse.instructor || '',
        duration: editingCourse.duration || '',
        level: editingCourse.level || 'Beginner',
        price: editingCourse.price || '',
        image: editingCourse.image || '',
        features: editingCourse.features || [''],
        videos: editingCourse.videos || [],
        notes: editingCourse.notes || [],
        quizzes: editingCourse.quizzes || []
      });
    }
  }, [editingCourse, showCourseForm]);

  // Enhanced useEffect for data fetching and real-time communication
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchPayments(),
          fetchCourses(),
          fetchStudents(),
          fetchInstructors(),
          fetchReviews(),
          fetchVideos(),
          fetchNotes(),
          fetchQuizzes(),
          fetchCourseApprovals()
        ]);
        addNotification('Dashboard data loaded successfully', 'success');
      } catch (error) {
        console.error('Error fetching admin data:', error);
        addNotification('Error loading dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ AdminDashboard connected to server');
    });

    // Enhanced socket listeners for real-time UserDashboard communication
    newSocket.on('newPayment', (paymentData) => {
      console.log('💰 New payment received in AdminDashboard:', paymentData);
      setPayments(prev => [paymentData, ...prev]);
      
      // Auto-create approval entry for new payments
      const newApproval = {
        _id: `approval_${paymentData._id}`,
        userId: `user_${paymentData.studentEmail}`,
        userName: paymentData.studentName,
        userEmail: paymentData.studentEmail,
        courseId: paymentData.courseId,
        courseTitle: paymentData.courseTitle,
        enrollmentDate: paymentData.timestamp,
        status: 'pending',
        progress: 0,
        lastAccessed: new Date().toISOString(),
        completed: false,
        paymentStatus: paymentData.status,
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        paymentMethod: paymentData.paymentMethod,
        isPaid: true,
        source: 'realtime_socket'
      };
      
      setCourseApprovals(prev => {
        const updated = [newApproval, ...prev.filter(a => a._id !== newApproval._id)];
        saveToLocalStorage('courseApprovals', updated);
        return updated;
      });
      
      addNotification(`New payment received from ${paymentData.studentName} for ${paymentData.courseTitle}`, 'success');
    });

    // Listen for new approval requests
    newSocket.on('newApprovalRequest', (approvalData) => {
      console.log('📋 New approval request received:', approvalData);
      setCourseApprovals(prev => {
        const updated = [approvalData, ...prev.filter(a => a.courseId !== approvalData.courseId || a.userEmail !== approvalData.userEmail)];
        saveToLocalStorage('courseApprovals', updated);
        return updated;
      });
    });

    // Listen for UserDashboard payment status updates
    newSocket.on('paymentStatusUpdate', (updatedPayment) => {
      console.log('🔄 Payment status updated from UserDashboard:', updatedPayment);
      setPayments(prev => 
        prev.map(p => p._id === updatedPayment._id ? updatedPayment : p)
      );
    });

    const savedSettings = loadFromLocalStorage('adminSettings');
    if (savedSettings && Object.keys(savedSettings).length > 0) {
      setSettings(savedSettings);
    }

    fetchData();

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  useEffect(() => {
    calculateStats();
    generateAnalyticsData();
  }, [payments, students, courses, instructors, reviews, courseApprovals]);

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {renderSidebar()}

      <div className="admin-main">
        {activeSection === 'overview' ? renderOverview() :
         activeSection === 'payments' ? renderPayments() :
         activeSection === 'students' ? renderStudents() :
         activeSection === 'courses' ? renderCourses() :
         activeSection === 'course' ? renderCourse() :
         activeSection === 'approvals' ? renderCourseApprovals() :
         activeSection === 'reviews' ? renderReviews() :
         activeSection === 'analytics' ? renderAnalytics() :
         activeSection === 'settings' ? renderSettings() :
         renderOverview()}
      </div>

      {renderNotifications()}

      {showVideoForm && renderVideoForm()}
      {showNoteForm && renderNoteForm()}
      {showQuizForm && renderQuizForm()}
      {showCourseForm && renderCourseForm()}

      {previewItem && renderPreviewModal()}
    </div>
  );
}