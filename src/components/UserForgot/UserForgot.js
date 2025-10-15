import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './UserForgot.css';

export default function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Simple validation
    if (!formData.name || !formData.email || !formData.password) {
      setMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setMessage("Please accept the terms and conditions");
      setLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const userExists = existingUsers.some(user => 
        user.email.toLowerCase() === formData.email.toLowerCase().trim()
      );

      if (userExists) {
        setMessage("User with this email already exists");
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        isVerified: true,
        createdAt: new Date().toISOString(),
        enrolledCourses: [],
        progress: {},
        userType: 'registered'
      };

      // Save to localStorage
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

      setMessage("Registration successful! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login/user");
      }, 2000);

    } catch (error) {
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login/user");
  };

  const isFormValid = formData.name && 
                     formData.email && 
                     formData.password && 
                     formData.confirmPassword && 
                     formData.password === formData.confirmPassword && 
                     formData.acceptTerms;

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Your Account</h1>
          <p>Join our learning community today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name *</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address *</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label>Password *</label>
            <div className="password-input-group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-password"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>Confirm Password *</label>
            <div className="password-input-group">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="toggle-password"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="password-match">
                {formData.password === formData.confirmPassword ? 
                  '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>

          <div className="terms-group">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="acceptTerms">
              I agree to the Terms and Conditions and Privacy Policy *
            </label>
          </div>

          {message && (
            <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            className="register-btn"
            disabled={!isFormValid || loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="login-redirect">
          Already have an account?{" "}
          <span onClick={handleLoginRedirect} className="login-link">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}