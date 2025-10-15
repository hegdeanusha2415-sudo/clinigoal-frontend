import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotForm from "./ForgotForm";
import "./AdminLogin.css";

function AdminLogin() {
  const [activeForm, setActiveForm] = useState("login"); // login | register
  const [showForgot, setShowForgot] = useState(false);

  return (
    <div className="admin-login-container">

      {/* Left Image Panel */}
      <div className="login-left-panel">
        <div className="overlay">
          <h1>Welcome Back!</h1>
          <p>Manage your system efficiently with our admin panel.</p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="login-right-panel">
        <div className={`card-container ${activeForm}`}>
          <div className="card">
            {/* Login Front */}
            <div className="card-front">
              <div className="admin-login-header">
                <div className="admin-logo">🛡</div>
                <h2>Admin Login</h2>
              </div>
              <LoginForm
                setActiveForm={setActiveForm}
                setShowForgot={setShowForgot}
              />
            </div>

            {/* Register Back */}
            <div className="card-back">
              <div className="admin-login-header">
                <div className="admin-logo">🛡</div>
                <h2>Create Account</h2>
              </div>
              <RegisterForm setActiveForm={setActiveForm} />
            </div>
          </div>
        </div>

        {/* Forgot Password Slide */}
        {showForgot && (
          <div className="forgot-slide">
            <div className="admin-login-header">
              <div className="admin-logo">🛡</div>
              <h2>Reset Password</h2>
            </div>
            <ForgotForm setShowForgot={setShowForgot} />
          </div>
        )}
      </div>

    </div>
  );
}

export default AdminLogin;
