import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const navigate = useNavigate();

  // Initialize registered users array if not exists
  useEffect(() => {
    if (!localStorage.getItem("registeredUsers")) {
      localStorage.setItem("registeredUsers", JSON.stringify([]));
    }
    
    // Update registered users count
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    setRegisteredUsersCount(users.length);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check registered users
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const user = registeredUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim() && 
             u.password === password
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      if (!user.isVerified) {
        throw new Error("Please verify your email first");
      }

      // Login successful
      const userData = {
        ...user,
        lastLogin: new Date().toISOString()
      };

      // Store user data in localStorage
      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userToken", "user-token-" + Date.now());
      localStorage.setItem("userType", "registered");

      console.log("Login successful:", userData);

      // Track login activity for admin
      trackUserLogin(userData);

      // Navigate to dashboard
      navigate(`/user-dashboard/${userData.id}`);

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      setIsLoading(false);
    }
  };

  const trackUserLogin = (userData) => {
    const loginActivity = {
      userId: userData.id,
      userName: userData.name,
      userEmail: userData.email,
      loginTime: new Date().toISOString(),
      type: 'login',
      userType: 'registered'
    };
    
    // Store activity in localStorage for admin
    const existingActivities = JSON.parse(localStorage.getItem("userActivities") || "[]");
    const updatedActivities = [loginActivity, ...existingActivities.slice(0, 99)];
    localStorage.setItem("userActivities", JSON.stringify(updatedActivities));
  };

  const handleRegisterRedirect = () => {
    // Fixed: Navigate to the correct registration route as defined in App.js
    navigate("/register/user");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1>Welcome Back!</h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        {/* Stats */}
        <div className="login-stats">
          <div className="stat-item">
            <span className="stat-number">{registeredUsersCount}+</span>
            <span className="stat-label">Registered Users</span>
          </div>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="current-password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <button 
              type="button" 
              onClick={handleRegisterRedirect}
              className="link-btn"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}