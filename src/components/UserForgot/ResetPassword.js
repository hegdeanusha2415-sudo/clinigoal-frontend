import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: "Very Weak",
    class: "weak"
  });

  const API_URL = "http://localhost:5000/api/user";

  // Password strength checker
  useEffect(() => {
    const checkPasswordStrength = (password) => {
      let score = 0;
      const requirements = {
        hasLower: /[a-z]/.test(password),
        hasUpper: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        hasMinLength: password.length >= 8
      };

      Object.values(requirements).forEach(met => {
        if (met) score += 20;
      });

      let text = "Very Weak";
      let strengthClass = "weak";

      if (score >= 80) {
        text = "Strong";
        strengthClass = "strong";
      } else if (score >= 60) {
        text = "Medium";
        strengthClass = "medium";
      } else if (score >= 40) {
        text = "Weak";
        strengthClass = "weak";
      }

      return { score, text, class: strengthClass };
    };

    if (newPassword) {
      setPasswordStrength(checkPasswordStrength(newPassword));
    } else {
      setPasswordStrength({ score: 0, text: "Very Weak", class: "weak" });
    }
  }, [newPassword]);

  // Check if passwords match
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Enhanced validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (passwordStrength.score < 60) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/reset-password`, {
        email: email?.toLowerCase().trim(),
        newPassword,
      });
      setMessage(res.data.message || "Password reset successfully!");
      
      // Redirect to login after success
      setTimeout(() => navigate("/login/user"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check password requirements
  const getPasswordRequirements = () => {
    const requirements = [
      { text: "At least 8 characters", met: newPassword.length >= 8 },
      { text: "Contains lowercase letter", met: /[a-z]/.test(newPassword) },
      { text: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
      { text: "Contains number", met: /\d/.test(newPassword) },
      { text: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) }
    ];
    return requirements;
  };

  if (!email) {
    return (
      <div className="reset-container">
        <div className="reset-card">
          <div className="error" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
            <h3>Access Denied</h3>
            <p>Email not provided. Please start the password reset process from the beginning.</p>
            <button 
              className="reset-btn" 
              onClick={() => navigate("/forgot-password")}
              style={{ marginTop: '20px' }}
            >
              Go to Forgot Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-container">
      <div className="animated-bg"></div>
      <div className="reset-card">
        <div className="reset-header">
          <span className="reset-icon">🔑</span>
          <h1 className="reset-title">Create New Password</h1>
          <p className="reset-subtitle">
            Enter your new password below. Make sure it's strong and secure.
          </p>
          <div className="user-email">
            {email}
          </div>
        </div>

        <form onSubmit={handleReset} className="reset-form">
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-group">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                minLength="8"
              />
              <span 
                className="toggle-password" 
                onClick={() => setShowNewPassword(!showNewPassword)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? "🙈" : "👁️"}
              </span>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="password-strength">
                <div className="strength-meter">
                  <div className={`strength-fill ${passwordStrength.class}`}></div>
                </div>
                <div className="strength-text">
                  Password Strength: <strong>{passwordStrength.text}</strong>
                </div>
                
                <ul className="password-requirements">
                  {getPasswordRequirements().map((req, index) => (
                    <li key={index} className={req.met ? 'valid' : ''}>
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-group">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                autoComplete="new-password"
                minLength="8"
              />
              <span 
                className="toggle-password" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>
            {confirmPassword && (
              <div style={{ 
                fontSize: '0.85rem', 
                color: passwordsMatch ? '#38a169' : '#e53e3e',
                marginTop: '8px',
                fontWeight: '500'
              }}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </div>
            )}
          </div>

          {error && <div className="error" role="alert">{error}</div>}
          {message && <div className="success" role="status">{message}</div>}

          <button 
            type="submit" 
            className="reset-btn"
            disabled={loading || !passwordsMatch || passwordStrength.score < 60}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <p className="back-to-login">
          Remember your password?{" "}
          <span 
            onClick={() => !loading && navigate("/login/user")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && !loading && navigate("/login/user")}
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;