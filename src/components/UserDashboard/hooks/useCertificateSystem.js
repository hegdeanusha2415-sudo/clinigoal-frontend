import { useState, useEffect } from 'react';

// Certificate color schemes
export const certificateColors = {
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

export const useCertificateSystem = () => {
  const [certificates, setCertificates] = useState([]);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [certificateColor, setCertificateColor] = useState('blue');
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

  // Load certificates from localStorage on component mount
  useEffect(() => {
    const savedCertificates = JSON.parse(localStorage.getItem('userCertificates') || '[]');
    setCertificates(savedCertificates);
  }, []);

  // Generate Certificate Function
  const generateCertificate = async (course) => {
    setIsGeneratingCertificate(true);
    
    try {
      const certificate = {
        _id: `cert_${Date.now()}`,
        courseId: course._id,
        courseTitle: course.title,
        studentName: localStorage.getItem('userName') || 'Student',
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

  return {
    certificates,
    showCertificateModal,
    certificateData,
    certificateColor,
    isGeneratingCertificate,
    setCertificateColor,
    setShowCertificateModal,
    generateCertificate,
    downloadCertificateAsPDF,
    certificateColors
  };
};