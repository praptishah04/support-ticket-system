import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("/auth/signup", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Signup successful!");
    window.location.href = "/dashboard";
  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};

  return (
    <div className="home-bg">
      <div className="home-card" style={{maxWidth: 400}}>
        <div className="home-header">
          <h2 className="home-title" style={{fontSize: '2rem'}}>Sign Up</h2>
          <p className="home-subtitle">Create your account</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="login-input"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="login-input"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="login-input"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="home-btn user-btn" style={{marginTop: '1rem'}}>Sign Up</button>
        </form>
        <div className="login-signup-link">
          <span>Already have an account?</span>
          <Link to="/login" className="home-track-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 