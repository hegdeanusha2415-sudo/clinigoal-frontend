import React, { useState } from "react";

function RegisterForm({ setActiveForm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    alert(`Account created for ${name}`);
    setActiveForm("login");
  };

  return (
    <form className="admin-login-form" onSubmit={handleRegister}>
      {error && <div className="error-message">{error}</div>}

      <div className="input-with-icon">
        <input
          type="text"
          id="register-name"
          placeholder=" "
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="register-name">Full Name</label>
        <span className="input-icon">👤</span>
      </div>

      <div className="input-with-icon">
        <input
          type="email"
          id="register-email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="register-email">Email Address</label>
        <span className="input-icon">📧</span>
      </div>

      <div className="input-with-icon">
        <input
          type="password"
          id="register-password"
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="register-password">Password</label>
        <span className="input-icon">🔒</span>
      </div>

      <button type="submit">Register</button>

      <div className="admin-links">
        <button type="button" onClick={() => setActiveForm("login")}>
          Back to Login
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;
