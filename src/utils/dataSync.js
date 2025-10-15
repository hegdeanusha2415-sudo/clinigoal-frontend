import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';

// Data synchronization utilities for UserDashboard integration
export const syncAllUserDashboardPayments = () => {
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
      const data = loadFromLocalStorage(key, []);
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
    const paidCourses = loadFromLocalStorage('paidCourses', []);
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

export const syncPaidEnrollments = (currentApprovals = []) => {
  try {
    const { payments, approvals } = syncAllUserDashboardPayments();
    const currentApprovalsCopy = [...currentApprovals];
    
    let newEnrollmentsCount = 0;
    
    payments.forEach(paidEnrollment => {
      const exists = currentApprovalsCopy.some(approval => 
        approval.userEmail === paidEnrollment.userEmail && 
        approval.courseId === paidEnrollment.courseId
      );
      
      if (!exists && paidEnrollment.courseId && paidEnrollment.studentName) {
        const newApproval = {
          _id: paidEnrollment._id || `approval_${Date.now()}_${Math.random()}`,
          userId: paidEnrollment.studentEmail || `user_${paidEnrollment.studentName}`,
          userName: paidEnrollment.studentName,
          userEmail: paidEnrollment.studentEmail || `${paidEnrollment.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          courseId: paidEnrollment.courseId,
          courseTitle: paidEnrollment.courseTitle || 'Unknown Course',
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
        
        currentApprovalsCopy.push(newApproval);
        newEnrollmentsCount++;
      }
    });
    
    approvals.forEach(approval => {
      const exists = currentApprovalsCopy.some(a => a._id === approval._id);
      if (!exists) {
        currentApprovalsCopy.push({
          ...approval,
          source: approval.source || 'direct_approval_sync'
        });
        newEnrollmentsCount++;
      }
    });
    
    console.log(`🔄 Synced ${newEnrollmentsCount} new enrollments`);
    return {
      updatedApprovals: currentApprovalsCopy,
      newCount: newEnrollmentsCount
    };
  } catch (error) {
    console.error('Error syncing paid enrollments:', error);
    return {
      updatedApprovals: currentApprovals,
      newCount: 0,
      error: error.message
    };
  }
};

export const syncReviewsFromUserDashboard = (currentReviews = []) => {
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
    
    const existingReviews = [...currentReviews];
    const allReviews = [...formattedReviews, ...existingReviews];
    
    const finalReviews = allReviews.filter((review, index, self) =>
      index === self.findIndex(r => r._id === review._id)
    );
    
    console.log(`🔄 Synced ${formattedReviews.length} new reviews from UserDashboard`);
    return {
      reviews: finalReviews,
      newCount: formattedReviews.length
    };
  }
  
  return {
    reviews: currentReviews,
    newCount: 0
  };
};

export const syncCourseData = (currentCourses = [], defaultCourses = []) => {
  const userDashboardCourses = loadFromLocalStorage('userDashboardCourses', []);
  const paidCourses = loadFromLocalStorage('paidCourses', []);
  
  if (userDashboardCourses.length > 0) {
    const mergedCourses = [...currentCourses, ...userDashboardCourses];
    const uniqueCourses = mergedCourses.filter((course, index, self) =>
      index === self.findIndex(c => c._id === course._id)
    );
    
    return {
      courses: uniqueCourses,
      newCount: userDashboardCourses.length
    };
  }
  
  if (currentCourses.length === 0 && defaultCourses.length > 0) {
    return {
      courses: defaultCourses,
      newCount: defaultCourses.length
    };
  }
  
  return {
    courses: currentCourses,
    newCount: 0
  };
};

export const syncStudentData = (currentStudents = [], payments = []) => {
  const userDashboardStudents = loadFromLocalStorage('userDashboardStudents', []);
  
  if (userDashboardStudents.length > 0) {
    const mergedStudents = [...currentStudents, ...userDashboardStudents];
    const uniqueStudents = mergedStudents.filter((student, index, self) =>
      index === self.findIndex(s => s._id === student._id || s.email === student.email)
    );
    
    return {
      students: uniqueStudents,
      newCount: userDashboardStudents.length
    };
  }
  
  // Extract students from payments if no direct student data
  if (currentStudents.length === 0 && payments.length > 0) {
    const studentEmails = new Set();
    const studentsFromPayments = payments
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
    
    return {
      students: studentsFromPayments,
      newCount: studentsFromPayments.length
    };
  }
  
  return {
    students: currentStudents,
    newCount: 0
  };
};

export const backupAdminData = () => {
  const backupData = {
    payments: loadFromLocalStorage('adminPayments', []),
    courses: loadFromLocalStorage('adminCourses', []),
    students: loadFromLocalStorage('adminStudents', []),
    reviews: loadFromLocalStorage('adminReviews', []),
    videos: loadFromLocalStorage('adminVideos', []),
    notes: loadFromLocalStorage('adminNotes', []),
    quizzes: loadFromLocalStorage('adminQuizzes', []),
    approvals: loadFromLocalStorage('courseApprovals', []),
    settings: loadFromLocalStorage('adminSettings', {}),
    timestamp: new Date().toISOString()
  };
  
  const backupKey = `admin_backup_${Date.now()}`;
  saveToLocalStorage(backupKey, backupData);
  
  console.log(`💾 Created backup: ${backupKey}`);
  return backupKey;
};

export const restoreAdminData = (backupKey) => {
  const backupData = loadFromLocalStorage(backupKey, null);
  
  if (!backupData) {
    throw new Error('Backup not found');
  }
  
  Object.keys(backupData).forEach(key => {
    if (key !== 'timestamp') {
      saveToLocalStorage(`admin${key.charAt(0).toUpperCase() + key.slice(1)}`, backupData[key]);
    }
  });
  
  console.log(`🔄 Restored data from backup: ${backupKey}`);
  return backupData;
};

export const getSyncStatus = () => {
  const syncKeys = [
    'adminPayments',
    'adminCourses', 
    'adminStudents',
    'adminReviews',
    'adminVideos',
    'adminNotes',
    'adminQuizzes',
    'courseApprovals'
  ];
  
  const status = {};
  let totalItems = 0;
  
  syncKeys.forEach(key => {
    const data = loadFromLocalStorage(key, []);
    status[key] = data.length;
    totalItems += data.length;
  });
  
  return {
    ...status,
    totalItems,
    lastSync: loadFromLocalStorage('lastSyncTimestamp', 'Never')
  };
};