// AdminLogin.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ===== LOGIN =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (formData.email && formData.password) {
        // Store admin authentication data
        localStorage.setItem("token", "admin-token-" + Date.now());
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", formData.email);

        // ✅ Navigate to admin dashboard
        navigate("/admin");
      } else {
        setError("Please enter both email and password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== REGISTER =====
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (formData.fullName && formData.email && formData.password) {
        alert("Admin registration submitted! You can now login.");
        setShowRegister(false);
        setFormData(prev => ({ ...prev, fullName: "", password: "" }));
      } else {
        setError("Please fill all fields");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== FORGOT PASSWORD =====
  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (formData.email) {
        alert(`Password reset link sent to: ${formData.email}`);
        setShowForgot(false);
      } else {
        setError("Please enter your email address");
      }
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setFormData({ email: "", password: "", fullName: "" });
    setError("");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo">🛡</div>
          <h2>{showRegister ? "Admin Register" : showForgot ? "Reset Password" : "Admin Login"}</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* LOGIN FORM */}
        {!showRegister && !showForgot && (
          <>
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="admin-links">
              <button onClick={() => { resetForms(); setShowRegister(true); }} disabled={isLoading}>
                Create Account
              </button>
              <button onClick={() => { resetForms(); setShowForgot(true); }} disabled={isLoading}>
                Forgot Password?
              </button>
            </div>
          </>
        )}

        {/* REGISTER FORM */}
        {showRegister && (
          <>
            <form onSubmit={handleRegister} className="admin-login-form">
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </button>
            </form>
            <button onClick={() => { resetForms(); setShowRegister(false); }} disabled={isLoading}>
              ← Back to Login
            </button>
          </>
        )}

        {/* FORGOT PASSWORD FORM */}
        {showForgot && (
          <>
            <form onSubmit={handleForgot} className="admin-login-form">
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <button onClick={() => { resetForms(); setShowForgot(false); }} disabled={isLoading}>
              ← Back to Login
            </button>
          </>
        )}

        <div className="admin-login-footer">
          <Link to="/">🏠 Back to Home</Link>
        </div> 
      </div>
    </div>
  );
}

export default AdminLogin;
