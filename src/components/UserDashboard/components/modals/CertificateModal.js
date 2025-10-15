import React from 'react';
import { certificateColors } from '../../hooks/useCertificateSystem';

const CertificateModal = ({
  showCertificateModal,
  certificateData,
  certificateColor,
  setCertificateColor,
  setShowCertificateModal,
  downloadCertificateAsPDF
}) => {
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

export default CertificateModal;