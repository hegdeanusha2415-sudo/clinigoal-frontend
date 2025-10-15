import React from 'react';

const CertificatesSection = ({ 
  certificates, 
  downloadCertificateAsPDF, 
  setActiveSection 
}) => {
  return (
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
};

export default CertificatesSection;