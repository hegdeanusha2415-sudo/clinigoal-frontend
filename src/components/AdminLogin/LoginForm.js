import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ setActiveForm, setShowForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

    // ✅ Save token & role in localStorage for protected route
    localStorage.setItem("token", "dummy-admin-token");
    localStorage.setItem("userRole", "admin");

    // ✅ Navigate to admin dashboard (matches App.js)
    navigate("/admin"); // <-- This is the correct route
  };

  return (
    <form className="admin-login-form" onSubmit={handleLogin}>
      {error && <div className="error-message">{error}</div>}

      <div className="input-with-icon">
        <input
          type="email"
          id="login-email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="login-email">Email Address</label>
        <span className="input-icon">📧</span>
      </div>

      <div className="input-with-icon">
        <input
          type="password"
          id="login-password"
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="login-password">Password</label>
        <span className="input-icon">🔒</span>
      </div>

      <button type="submit">Login</button>

      <div className="admin-links">
        <button type="button" onClick={() => setActiveForm("register")}>
          Create Account
        </button>
        <button type="button" onClick={() => setShowForgot(true)}>
          Forgot Password?
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
