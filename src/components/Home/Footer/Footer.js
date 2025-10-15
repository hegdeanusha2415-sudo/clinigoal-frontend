import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Company": [
      { name: "About Us", url: "/about" },
      { name: "Careers", url: "/careers" },
      { name: "Contact", url: "/contact" },
      { name: "Blog", url: "/blog" }
    ],
    "Programs": [
      { name: "Clinical Research", url: "/clinical-research" },
      { name: "Bioinformatics", url: "/bioinformatics" },
      { name: "Medical Coding", url: "/medical-coding" },
      { name: "Pharmacovigilance", url: "/pharmacovigilance" }
    ],
    "Support": [
      { name: "Help Center", url: "/help" },
      { name: "FAQs", url: "/faqs" },
      { name: "Contact Support", url: "/support" }
    ],
    "Legal": [
      { name: "Privacy Policy", url: "/privacy" },
      { name: "Terms of Service", url: "/terms" },
      { name: "Cookie Policy", url: "/cookies" }
    ]
  };

  const socialLinks = [
    { name: "LinkedIn", icon: "💼", url: "https://linkedin.com/company/clinigoal" },
    { name: "Twitter", icon: "🐦", url: "https://twitter.com/clinigoal" },
    { name: "Facebook", icon: "📘", url: "https://facebook.com/clinigoal" },
    { name: "Instagram", icon: "📷", url: "https://instagram.com/clinigoal" }
  ];

  return (
    <footer className="footer-pattern fade-in">
      <div className="footer-main">
        {/* Company Info */}
        <div className="footer-section">
          <div className="footer-logo">
            <span className="logo-icon">💙</span>
            <span className="logo-text">Clinigoal</span>
          </div>
          <p className="footer-description">
            Empowering healthcare professionals with industry-leading education 
            and career advancement opportunities.
          </p>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="social-link"
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="social-icon">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        {Object.entries(footerLinks).map(([category, links]) => (
          <div key={category} className="footer-section">
            <h4 className="footer-heading">{category}</h4>
            <ul className="footer-links">
              {links.map((link, index) => (
                <li key={index}>
                  <a href={link.url} className="footer-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className="footer-section">
          <h4 className="footer-heading">Stay Updated</h4>
          <p className="newsletter-text">
            Get the latest course updates and career tips.
          </p>
          <div className="footer-newsletter">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="footer-input"
            />
            <button className="footer-btn">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-content-pattern">
          <div className="copyright">
            © {currentYear} Clinigoal. All Rights Reserved.
          </div>
          <div className="footer-links-pattern">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;