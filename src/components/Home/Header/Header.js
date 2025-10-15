import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ 
  activeDropdown, 
  setActiveDropdown, 
  searchQuery, 
  setSearchQuery, 
  searchResults, 
  setSearchResults,
  programs 
}) => {
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const results = programs.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const handleAdminLogin = () => {
    setShowAdminDropdown(false);
    navigate("/admin-login");
  };

  const handleUserLogin = () => {
    setShowAdminDropdown(false);
    navigate("/login/user");
  };

  const handleSearchResultClick = (program) => {
    setSearchQuery("");
    setSearchResults([]);
    if (program.title.toLowerCase().includes("clinical")) navigate("/clinical-research");
    else if (program.title.toLowerCase().includes("bioinformatics")) navigate("/bioinformatics");
    else if (program.title.toLowerCase().includes("medical coding")) navigate("/medical-coding");
    else if (program.title.toLowerCase().includes("pharmacovigilance")) navigate("/pharmacovigilance");
  };

  return (
    <header className="clean-header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <span className="logo-icon">💙</span>
          <span className="logo-text">Clinigoal</span>
        </div>

        {/* Navigation */}
        <nav className="main-nav">
          <div className="nav-item">
            <a href="#" onClick={() => toggleDropdown("about")}>About Us</a>
            {activeDropdown === "about" && (
              <div className="dropdown">
                <a href="#">Our Team</a>
                <a href="#">Mission</a>
                <a href="#">History</a>
              </div>
            )}
          </div>

          <div className="nav-item">
            <a href="#" onClick={() => toggleDropdown("courses")}>Courses</a>
            {activeDropdown === "courses" && (
              <div className="dropdown">
                <Link to="/clinical-research" onClick={() => setActiveDropdown(null)}>Clinical Research</Link>
                <Link to="/bioinformatics" onClick={() => setActiveDropdown(null)}>Bioinformatics</Link>
                <Link to="/medical-coding" onClick={() => setActiveDropdown(null)}>Medical Coding</Link>
                <Link to="/pharmacovigilance" onClick={() => setActiveDropdown(null)}>Pharmacovigilance</Link>
              </div>
            )}
          </div>

          <div className="nav-item">
            <a href="#" onClick={() => toggleDropdown("enterprise")}>Enterprise</a>
            {activeDropdown === "enterprise" && (
              <div className="dropdown">
                <a href="#">Solutions</a>
                <a href="#">Pricing</a>
              </div>
            )}
          </div>

          <div className="nav-item">
            <a href="#" onClick={() => toggleDropdown("resources")}>Resources</a>
            {activeDropdown === "resources" && (
              <div className="dropdown">
                <a href="#">Blog</a>
                <a href="#">Help Center</a>
              </div>
            )}
          </div>
        </nav>

        {/* Search & Actions */}
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search programs..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            {searchQuery && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((program) => (
                  <div
                    key={program.id}
                    className="search-result"
                    onClick={() => handleSearchResultClick(program)}
                  >
                    {program.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="auth-buttons">
            <div className="login-dropdown">
              <button 
                className="login-btn" 
                onClick={() => setShowAdminDropdown(!showAdminDropdown)}
              >
                Sign In
              </button>
              {showAdminDropdown && (
                <div className="auth-dropdown">
                  <button onClick={handleAdminLogin}>Admin Login</button>
                  <button onClick={handleUserLogin}>User Login</button>
                </div>
              )}
            </div>
            <button 
              className="cta-btn"
              onClick={() => navigate("/courses")}
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;