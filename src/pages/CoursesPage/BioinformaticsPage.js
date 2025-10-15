import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './BioinformaticsPage.css';

const BioinformaticsPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  const courseData = {
    title: "Bioinformatics & Genomics",
    subtitle: "Advanced computational biology and genomic data interpretation",
    description: "Master computational methods for modern biological research. Analyze genomic sequences, interpret large-scale data, and solve biological problems.",
    duration: "8 months",
    level: "Intermediate",
    price: "₹52,999",
    originalPrice: "₹69,999",
    discount: "24% off",
    rating: 4.7,
    students: "890+",
    language: "English",
    certificate: "Yes",
    
    instructor: {
      name: "Prof. Rajesh Kumar",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "15+ years in computational biology and genomic research. Published 50+ research papers in reputed journals.",
      title: "Senior Bioinformatics Researcher | Ex-IIT Delhi"
    },

    features: [
      { icon: "🐍", title: "Python Programming", description: "Master Python for biological data analysis" },
      { icon: "🧬", title: "Genomic Tools", description: "Hands-on with industry-standard tools" },
      { icon: "📊", title: "Data Analysis", description: "Large-scale genomic data interpretation" },
      { icon: "👨‍🏫", title: "Expert Mentorship", description: "1-on-1 guidance from industry experts" }
    ],

    stats: [
      { number: "94%", label: "Placement Rate" },
      { number: "40+", label: "Hiring Partners" },
      { number: "₹9L", label: "Average CTC" },
      { number: "890+", label: "Alumni Network" }
    ],

    curriculum: [
      "Python Programming for Biological Data",
      "Genomic Databases & Tools Mastery", 
      "Sequence Alignment Algorithms",
      "Structural Bioinformatics & PyMOL",
      "Machine Learning in Genomics",
      "Capstone Research Project"
    ],

    tools: ["Python", "Biopython", "BLAST", "SAM/BAM", "UCSC Genome", "ENSEMBL", "PyMOL", "Jupyter"],
    
    careerOutcomes: [
      { role: "Bioinformatician", salary: "₹8-15 LPA", description: "Analyze biological data using computational tools" },
      { role: "Genomic Data Analyst", salary: "₹6-12 LPA", description: "Process and interpret large-scale genomic datasets" },
      { role: "Computational Biologist", salary: "₹10-18 LPA", description: "Develop algorithms and models for research" },
      { role: "Research Scientist", salary: "₹7-14 LPA", description: "Conduct research in academic or industrial settings" }
    ],

    companies: ["TCG", "Strand", "MedGenome", "SciGenom", "Aganitha", "BioMart"]
  };

  // Updated to navigate to login page
  const handleEnroll = () => navigate('/userlogin');
  const handleDownloadSyllabus = () => alert("Syllabus Downloaded!");

  return (
    <div className={`bioinformatics-page ${isVisible ? "visible" : ""}`}>
      
      {/* === HERO SECTION === */}
      <section className="bio-hero">
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <div className="hero-badge">🔥 Trending Program</div>
          <h1 className="hero-main-title">
            Master <span className="gradient-text">Bioinformatics</span> & Genomics
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
          <h2>Why Choose Bioinformatics?</h2>
          <p>Cutting-edge skills for the future of healthcare and research</p>
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
              <div className="feature-list">
                {courseData.features.map((f, i) => (
                  <span key={i} className="feature">{f.title}</span>
                ))}
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
              <h2>Tools & Technologies</h2>
              <div className="tools-grid">
                {courseData.tools.map((tool, i) => (
                  <span key={i} className="tool">{tool}</span>
                ))}
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
              <div className="highlight">📈 50+ Research Papers</div>
              <div className="highlight">👨‍🎓 1000+ Professionals Trained</div>
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
          <h2>Start Your Bioinformatics Journey Today</h2>
          <p>Join 890+ successful professionals in the biotech industry</p>
          <div className="cta-features">
            <div className="feature">✅ 8-Month Comprehensive Program</div>
            <div className="feature">✅ Hands-on Projects</div>
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
      <footer className="bio-footer">
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

export default BioinformaticsPage;