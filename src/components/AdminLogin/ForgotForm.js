import React, { useState } from "react";

function ForgotForm({ setShowForgot }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email");
      return;
    }
    setMessage("Password reset link sent to your email!");
    setEmail("");
    setTimeout(() => setShowForgot(false), 2000); // auto-close after 2s
  };

  return (
    <form className="admin-login-form" onSubmit={handleReset}>
      {message && <div className="error-message">{message}</div>}
      <div className="input-with-icon">
        <input
          type="email"
          id="forgot-email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="forgot-email">Email Address</label>
        <span className="input-icon">📧</span>
      </div>

      <button type="submit">Send Reset Link</button>

      <div className="admin-links">
        <button type="button" onClick={() => setShowForgot(false)}>
          Back to Login
        </button>
      </div>
    </form>
  );
}

export default ForgotForm;
