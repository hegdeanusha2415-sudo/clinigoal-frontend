import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './PharmacovigilancePage.css';

const PharmacovigilancePage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  const courseData = {
    title: "Pharmacovigilance Science Program",
    subtitle: "Drug safety monitoring, adverse event reporting, and regulatory compliance training",
    description: "Master the science and activities relating to the detection, assessment, understanding and prevention of adverse effects or any other medicine/vaccine related problem. Learn essential pharmacovigilance processes and regulatory requirements.",
    duration: "7 months",
    level: "Advanced",
    price: "₹48,999",
    originalPrice: "₹62,999",
    discount: "22% off",
    rating: 4.9,
    students: "950+",
    language: "English",
    certificate: "Yes",
    
    instructor: {
      name: "Dr. Meera Krishnan",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      bio: "15+ years in drug safety and regulatory affairs. Led safety teams for 50+ clinical trials and post-marketing surveillance programs.",
      title: "Drug Safety Expert | Ex-Director PV Operations"
    },

    features: [
      { icon: "🩺", title: "Adverse Event Reporting", description: "Master comprehensive AE reporting and management" },
      { icon: "📊", title: "MedDRA Coding", description: "Expertise in medical terminology and coding systems" },
      { icon: "🛡️", title: "Regulatory Compliance", description: "Global pharmacovigilance regulations and guidelines" },
      { icon: "🔍", title: "Signal Detection", description: "Advanced signal detection and risk management" }
    ],

    stats: [
      { number: "97%", label: "Placement Rate" },
      { number: "45+", label: "Hiring Partners" },
      { number: "₹8L", label: "Average CTC" },
      { number: "950+", label: "Alumni Network" }
    ],

    curriculum: [
      "Introduction to Pharmacovigilance & Regulatory Framework",
      "Adverse Event Reporting & Case Processing", 
      "MedDRA Coding & Medical Terminology",
      "Signal Detection & Risk Management Strategies",
      "Regulatory Compliance & Global Guidelines",
      "Capstone Project & Real-world Case Studies"
    ],

    tools: [
      "MedDRA", "WHO Drug Dictionary", "Argus Safety", "ArisG", 
      "Vigibase", "E2B Reporting", "CIOMS Forms", "RMP Templates"
    ],
    
    careerOutcomes: [
      { role: "Drug Safety Associate", salary: "₹4-7 LPA", description: "Monitor and report adverse drug reactions and ensure compliance with safety regulations" },
      { role: "Pharmacovigilance Scientist", salary: "₹6-10 LPA", description: "Analyze safety data and contribute to risk management strategies" },
      { role: "PV Quality Assurance", salary: "₹5-9 LPA", description: "Ensure compliance with pharmacovigilance processes and regulations" },
      { role: "Risk Management Specialist", salary: "₹7-12 LPA", description: "Develop and implement risk management plans for pharmaceutical products" }
    ],

    companies: ["Pfizer", "Novartis", "GSK", "Merck", "Roche", "AstraZeneca", "Johnson & Johnson"]
  };

  const handleEnroll = () => navigate('/userlogin');
  const handleDownloadSyllabus = () => alert("Syllabus Downloaded!");

  return (
    <div className={`pharmacovigilance-page ${isVisible ? "visible" : ""}`}>
      
      {/* === HERO SECTION === */}
      <section className="pv-hero">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="hero-badge">💊 Advanced Program</div>
          <h1 className="hero-main-title">
            Master <span className="gradient-text">Pharmacovigilance</span> & Drug Safety
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
          <h2>Why Choose Pharmacovigilance?</h2>
          <p>Critical skills for ensuring drug safety and patient well-being</p>
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
                This advanced program covers all aspects of drug safety monitoring and regulatory compliance. 
                You'll gain expertise in adverse event reporting, signal detection, and global pharmacovigilance 
                regulations essential for ensuring patient safety in pharmaceutical development and post-marketing surveillance.
              </p>
              
              <div className="feature-list">
                {courseData.features.map((f, i) => (
                  <span key={i} className="feature">{f.title}</span>
                ))}
              </div>

              <div className="prerequisites">
                <h3>Prerequisites</h3>
                <div className="prerequisites-list">
                  <div className="prerequisite">✓ Degree in Pharmacy, Life Sciences, or related field</div>
                  <div className="prerequisite">✓ Understanding of medical terminology and drug classification</div>
                  <div className="prerequisite">✓ Basic knowledge of clinical research processes</div>
                  <div className="prerequisite">✓ Strong analytical and attention to detail skills</div>
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
              <h2>Pharmacovigilance Tools & Systems</h2>
              <p>You'll gain practical experience with industry-standard pharmacovigilance tools and systems:</p>
              <div className="tools-grid">
                {courseData.tools.map((tool, i) => (
                  <span key={i} className="tool">{tool}</span>
                ))}
              </div>
              
              <div className="tools-info">
                <h4>About MedDRA</h4>
                <p>
                  MedDRA (Medical Dictionary for Regulatory Activities) is the international medical terminology 
                  used by regulatory authorities and the regulated biopharmaceutical industry. It is crucial for 
                  coding adverse event reports and ensuring standardized data exchange across global regulatory systems.
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
                  The pharmacovigilance field is experiencing rapid growth due to increasing regulatory requirements 
                  and the global expansion of pharmaceutical markets. Professionals with drug safety expertise are in 
                  high demand across pharmaceutical companies, CROs, and regulatory agencies worldwide, offering 
                  excellent career stability and advancement opportunities.
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
              <span>15+ Years</span>
            </div>
          </div>
          <div className="instructor-details">
            <h2>Meet Your Instructor</h2>
            <h3>{courseData.instructor.name}</h3>
            <p className="instructor-title">{courseData.instructor.title}</p>
            <p className="instructor-bio">{courseData.instructor.bio}</p>
            <div className="instructor-highlights">
              <div className="highlight">💊 50+ Clinical Trials</div>
              <div className="highlight">🌍 Global PV Experience</div>
              <div className="highlight">🏆 Industry Recognition</div>
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
          <h2>Start Your Drug Safety Career Today</h2>
          <p>Join 950+ successful professionals in the pharmaceutical industry</p>
          <div className="cta-features">
            <div className="feature">✅ 7-Month Comprehensive Program</div>
            <div className="feature">✅ Industry Certification Preparation</div>
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
      <footer className="pv-footer">
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

export default PharmacovigilancePage;