import { useState, useEffect } from 'react';

// Default courses data
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
  // ... include all other courses from the original file
];

export const useCourseManagement = (selectedCourse, setSelectedCourse, setActiveSection) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [paidCourses, setPaidCourses] = useState(new Set());
  const [courseContent, setCourseContent] = useState({
    videos: [],
    notes: [],
    quizzes: []
  });

  // Load data on component mount
  useEffect(() => {
    const loadInitialData = () => {
      // Load paid courses
      const savedPaidCourses = localStorage.getItem('paidCourses');
      if (savedPaidCourses) {
        setPaidCourses(new Set(JSON.parse(savedPaidCourses)));
      }

      // Load enrolled courses
      const savedEnrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
      setEnrolledCourses(savedEnrollments);

      // Set available courses
      setAvailableCourses(defaultCourses);
    };

    loadInitialData();
  }, []);

  // Check if course is paid
  const isCoursePaid = (courseId) => {
    return paidCourses.has(courseId);
  };

  // Fetch course content
  const fetchCourseContent = async (courseId) => {
    console.log("🔄 Fetching course content for courseId:", courseId);
    
    try {
      // Implementation of API calls to fetch videos, notes, quizzes
      // ... (same implementation as original)
      
    } catch (error) {
      console.error('❌ Error fetching course content:', error);
      // Fallback to demo content for paid courses
      if (isCoursePaid(courseId)) {
        setCourseContent({
          videos: [
            {
              _id: '1',
              title: 'Introduction to Course',
              description: 'Get started with the course overview and learning objectives',
              duration: 1200,
              thumbnail: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              module: 'Module 1'
            }
            // ... more demo videos
          ],
          notes: [
            // ... demo notes
          ],
          quizzes: [
            // ... demo quizzes
          ]
        });
      }
    }
  };

  // Open course content
  const openCourseContent = (course) => {
    const courseId = course.courseId || course.id || course._id;
    const hasPaid = isCoursePaid(courseId);
    
    if (!hasPaid) {
      alert('Please enroll in this course first to access the content.');
      return;
    }
    
    console.log('🎓 Opening course content for paid course:', course.title);
    setSelectedCourse(course);
    setActiveSection('course-content');
    fetchCourseContent(courseId);
  };

  // Calculate course completion percentage
  const calculateCourseCompletion = (courseId) => {
    // Implementation same as original
    return 0; // Placeholder
  };

  // Check if course is fully completed
  const isCourseCompleted = (courseId) => {
    return calculateCourseCompletion(courseId) === 100;
  };

  return {
    enrolledCourses,
    availableCourses,
    paidCourses,
    isCoursePaid,
    fetchCourseContent,
    courseContent,
    openCourseContent,
    calculateCourseCompletion,
    isCourseCompleted
  };
};