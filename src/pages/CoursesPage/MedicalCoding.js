import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './MedicalCoding.css';

const MedicalCodingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  const courseData = {
    title: "Medical Coding Specialist Program",
    subtitle: "Comprehensive training in medical billing, coding systems, and healthcare compliance",
    description: "Master the essential skills required for medical coding and billing in healthcare settings. Learn to accurately translate medical procedures and diagnoses into standardized codes for insurance claims and medical records.",
    duration: "4 months",
    level: "Beginner",
    price: "₹32,999",
    originalPrice: "₹42,999",
    discount: "23% off",
    rating: 4.5,
    students: "1800+",
    language: "English",
    certificate: "Yes",
    
    instructor: {
      name: "Dr. Sanjay Patel",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      bio: "12+ years in healthcare administration and medical coding. Trained 2000+ professionals in medical coding standards.",
      title: "Healthcare Administration Expert | Certified Professional Coder"
    },

    features: [
      { icon: "📋", title: "CPT & ICD-10 Systems", description: "Master industry-standard coding systems" },
      { icon: "💼", title: "Medical Billing", description: "Learn complete billing procedures" },
      { icon: "🛡️", title: "Healthcare Compliance", description: "HIPAA and regulatory compliance training" },
      { icon: "🎯", title: "Certification Prep", description: "Prepare for CPC certification exam" }
    ],

    stats: [
      { number: "96%", label: "Placement Rate" },
      { number: "50+", label: "Hiring Partners" },
      { number: "₹5L", label: "Average CTC" },
      { number: "1800+", label: "Alumni Network" }
    ],

    curriculum: [
      "Introduction to Medical Coding & Terminology",
      "ICD-10-CM Coding System Mastery", 
      "CPT and HCPCS Coding Procedures",
      "Medical Billing & Revenue Cycle Management",
      "Healthcare Compliance & HIPAA Regulations",
      "Certification Preparation & Career Guidance"
    ],

    tools: [
      "ICD-10-CM", "CPT Manual", "HCPCS Level II", "Medical Dictionary", 
      "Encoder Software", "Practice Management", "EHR Systems", "Excel for Healthcare"
    ],
    
    careerOutcomes: [
      { role: "Medical Coder", salary: "₹3-6 LPA", description: "Assign accurate codes to medical diagnoses and procedures" },
      { role: "Medical Biller", salary: "₹3-5 LPA", description: "Process insurance claims and manage patient billing" },
      { role: "Coding Auditor", salary: "₹5-8 LPA", description: "Review and validate coding accuracy and compliance" },
      { role: "Health Information Technician", salary: "₹4-7 LPA", description: "Manage patient records and health information systems" }
    ],

    companies: ["Apollo", "Fortis", "Max Healthcare", "Columbia Asia", "Narayana Health", "Manipal Hospitals"]
  };

  const handleEnroll = () => navigate('/userlogin');
  const handleDownloadSyllabus = () => alert("Syllabus Downloaded!");

  return (
    <div className={`medical-coding-page ${isVisible ? "visible" : ""}`}>
      
      {/* === HERO SECTION === */}
      <section className="medical-hero">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="hero-badge">🏥 Healthcare Program</div>
          <h1 className="hero-main-title">
            Become a Certified <span className="gradient-text">Medical Coding</span> Specialist
          </h1>
          <p className="hero-subtitle">{courseData.subtitle}</p>

          <div className="hero-stats">
            <div className="stat-pill">
              <span className="stat-icon">⭐</span>
              <span>{courseData.rating}/5 Rating</span>
            </div>
            <div className="stat-pill">
              <span className="stat-icon">👥</span>
              <span>{courseData.students} Students</span>
            </div>
            <div className="stat-pill">
              <span className="stat-icon">📅</span>
              <span>{courseData.duration}</span>
            </div>
          </div>

          <div className="pricing-section">
            <div className="price-tag">
              <span className="current-price">{courseData.price}</span>
              <span className="original-price">{courseData.originalPrice}</span>
              <span className="discount-badge">{courseData.discount}</span>
            </div>
            <p className="price-note">No-cost EMI available • Money-back guarantee</p>
          </div>

          <div className="hero-actions">
            <button className="cta-button primary" onClick={handleEnroll}>
              <span className="btn-icon">🚀</span>
              Enroll Now & Start Learning
            </button>
            <button className="cta-button secondary" onClick={handleDownloadSyllabus}>
              <span className="btn-icon">📋</span>
              Download Syllabus
            </button>
          </div>
        </div>
      </section>

      {/* === FEATURES GRID === */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Medical Coding?</h2>
          <p>High-demand skills for the growing healthcare industry</p>
        </div>
        <div className="features-grid">
          {courseData.features.map((feature, index) => (
            <div key={index} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === STATS BANNER === */}
      <section className="stats-banner">
        <div className="stats-container">
          {courseData.stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* === TABS SECTION === */}
      <div className="tabs-container">
        <div className="tabs">
          {['overview', 'curriculum', 'tools', 'careers'].map(tab => (
            <button
              key={tab}
              className={activeTab === tab ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* === TAB CONTENT === */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="tab-panel">
              <h2>About This Program</h2>
              <p>{courseData.description}</p>
              <p>
                This comprehensive program prepares you for a successful career in medical coding, 
                one of the fastest-growing fields in healthcare. You'll learn to accurately assign codes 
                to medical procedures and diagnoses, ensuring proper billing and compliance with healthcare regulations.
              </p>
              
              <div className="feature-list">
                {courseData.features.map((f, i) => (
                  <span key={i} className="feature">{f.title}</span>
                ))}
              </div>

              <div className="prerequisites">
                <h3>Prerequisites</h3>
                <div className="prerequisites-list">
                  <div className="prerequisite">✓ Basic understanding of biology (helpful but not required)</div>
                  <div className="prerequisite">✓ Good attention to detail and analytical skills</div>
                  <div className="prerequisite">✓ Basic computer literacy</div>
                  <div className="prerequisite">✓ High school diploma or equivalent</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="tab-panel">
              <h2>Curriculum Overview</h2>
              <div className="curriculum-list">
                {courseData.curriculum.map((item, index) => (
                  <div key={index} className="curriculum-item">
                    <div className="item-number">0{index + 1}</div>
                    <div className="item-content">
                      <h3>{item}</h3>
                      <div className="progress-line"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div className="tab-panel">
              <h2>Coding Systems & Tools</h2>
              <p>You'll gain expertise in industry-standard medical coding systems and software:</p>
              <div className="tools-grid">
                {courseData.tools.map((tool, i) => (
                  <span key={i} className="tool">{tool}</span>
                ))}
              </div>
              
              <div className="tools-info">
                <h4>About Medical Coding Systems</h4>
                <p>
                  ICD-10-CM, CPT, and HCPCS are the standard coding systems used in healthcare. 
                  These systems provide specific codes for medical procedures, diagnoses, and services, 
                  enabling accurate medical record-keeping, insurance billing, and healthcare analytics.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'careers' && (
            <div className="tab-panel">
              <h2>Career Outcomes</h2>
              <div className="career-grid">
                {courseData.careerOutcomes.map((career, i) => (
                  <div key={i} className="career-card">
                    <h4>{career.role}</h4>
                    <span className="salary">{career.salary}</span>
                    <p>{career.description}</p>
                  </div>
                ))}
              </div>

              <div className="industry-outlook">
                <h3>Industry Outlook</h3>
                <p>
                  The demand for skilled medical coders is rapidly increasing due to healthcare expansion 
                  and regulatory requirements. Medical coding offers stable career opportunities in hospitals, 
                  clinics, insurance companies, and remote work settings with competitive salaries and growth potential.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === INSTRUCTOR SECTION === */}
      <section className="instructor-section">
        <div className="instructor-container">
          <div className="instructor-image">
            <img src={courseData.instructor.image} alt={courseData.instructor.name} />
            <div className="experience-badge">
              <span>12+ Years</span>
            </div>
          </div>
          <div className="instructor-details">
            <h2>Meet Your Instructor</h2>
            <h3>{courseData.instructor.name}</h3>
            <p className="instructor-title">{courseData.instructor.title}</p>
            <p className="instructor-bio">{courseData.instructor.bio}</p>
            <div className="instructor-highlights">
              <div className="highlight">📊 2000+ Professionals Trained</div>
              <div className="highlight">🏥 Healthcare Industry Expert</div>
              <div className="highlight">🎓 Certified Professional Coder</div>
            </div>
          </div>
        </div>
      </section>

      {/* === HIRING COMPANIES === */}
      <section className="companies-section">
        <h3>Our Alumni Work At</h3>
        <div className="companies-grid">
          {courseData.companies.map((company, index) => (
            <div key={index} className="company-logo">
              {company}
            </div>
          ))}
        </div>
      </section>

      {/* === FINAL CTA === */}
      <section className="final-cta">
        <div className="cta-container">
          <h2>Start Your Medical Coding Career Today</h2>
          <p>Join 1800+ successful professionals in the healthcare industry</p>
          <div className="cta-features">
            <div className="feature">✅ 4-Month Intensive Program</div>
            <div className="feature">✅ CPC Certification Preparation</div>
            <div className="feature">✅ Placement Assistance</div>
            <div className="feature">✅ Lifetime Access</div>
          </div>
          <button className="cta-button large" onClick={handleEnroll}>
            <span className="btn-icon">🎓</span>
            Enroll Now at {courseData.price}
            <span className="original-price">{courseData.originalPrice}</span>
          </button>
          <p className="cta-note">Limited seats available • Next batch starting soon</p>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="medical-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>💙 Clinigoal Academy</h3>
            <p>
              Transforming healthcare education through innovative learning programs
            </p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Programs</h4>
              <Link to="/clinical-research">Clinical Research</Link>
              <Link to="/bioinformatics">Bioinformatics</Link>
              <Link to="/medical-coding">Medical Coding</Link>
              <Link to="/pharmacovigilance">Pharmacovigilance</Link>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
            </div>
            <div className="link-group">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Clinigoal Academy. Empowering future healthcare leaders.</p>
        </div>
      </footer>
    </div>
  );
};

export default MedicalCodingPage;