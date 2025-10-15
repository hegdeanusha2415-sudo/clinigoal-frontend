import { useState } from 'react';
import io from 'socket.io-client';

export const usePaymentSystem = (
  enrollmentCourse,
  setEnrollmentCourse,
  showEnrollmentForm,
  setShowEnrollmentForm,
  userData,
  paidCourses,
  enrolledCourses,
  setEnrolledCourses
) => {
  const [enrollmentForm, setEnrollmentForm] = useState({
    courseId: '',
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    paymentMethod: 'razorpay',
    agreeToTerms: false
  });
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useState(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  // Handle enrollment form changes
  const handleEnrollmentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEnrollmentForm({
      ...enrollmentForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Record payment function
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
        status: 'completed',
        timestamp: new Date().toISOString(),
        transactionId: `TXN_${Date.now()}`,
        receiptNumber: `RCPT-${Date.now().toString().slice(-8)}`
      };

      // Save to localStorage
      const existingPayments = JSON.parse(localStorage.getItem('userPayments') || '[]');
      localStorage.setItem('userPayments', JSON.stringify([...existingPayments, paymentData]));
      
      const adminPayments = JSON.parse(localStorage.getItem('adminPayments') || '[]');
      localStorage.setItem('adminPayments', JSON.stringify([...adminPayments, paymentData]));
      
      // Emit real-time payment event
      if (socket) {
        socket.emit('newPayment', paymentData);
      }
      
      return paymentData;
    } catch (error) {
      console.error('❌ Error recording payment:', error);
      throw error;
    }
  };

  // Show payment receipt
  const showPaymentReceipt = (paymentData) => {
    setPaymentReceipt(paymentData);
    setShowReceiptModal(true);
  };

  // Download receipt as PDF
  const downloadReceiptAsPDF = (receipt) => {
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt - ${receipt.courseTitle}</title>
        <style>
          /* Receipt styles */
        </style>
      </head>
      <body>
        <!-- Receipt HTML content -->
      </body>
      </html>
    `);
    
    receiptWindow.document.close();
    
    setTimeout(() => {
      receiptWindow.print();
    }, 500);
  };

  // Handle enrollment click
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

  // Handle enrollment submission
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
    
    try {
      const payment = await recordPayment(
        enrollmentCourse, 
        enrollmentCourse.price, 
        'razorpay'
      );
      
      if (!payment) {
        throw new Error('Payment recording failed');
      }
      
      const updatedPaidCourses = new Set([...paidCourses, enrollmentCourse._id]);
      
      const enrollmentData = {
        id: enrollmentCourse._id,
        courseId: enrollmentCourse._id,
        courseTitle: enrollmentCourse.title,
        progress: 0,
        enrolledDate: new Date().toISOString()
      };
      
      const updatedEnrollments = [...enrolledCourses, enrollmentData];
      setEnrolledCourses(updatedEnrollments);
      localStorage.setItem('userEnrollments', JSON.stringify(updatedEnrollments));
      
      setEnrollmentSuccess(true);
      showPaymentReceipt(payment);
      
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      alert('Payment completed but enrollment failed. Please contact support.');
    }
  };

  return {
    enrollmentForm,
    enrollmentSuccess,
    handleEnrollmentChange,
    handleEnrollmentSubmit,
    showReceiptModal,
    paymentReceipt,
    setShowReceiptModal,
    downloadReceiptAsPDF,
    handleEnrollmentClick
  };
};