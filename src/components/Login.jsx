import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSuccess = async (credentialResponse) => {
    try {
      const googleToken = credentialResponse.credential;
      const res = await axios.post('http://localhost:5000/auth/googlelogin', {
        token: googleToken
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'agent') {
        navigate('/agenttickets');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    }
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/auth/login", {
      email,
      password
    });

    // Save token and user to localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // Redirect based on role
    const role = res.data.user.role;
    if (role === "admin") {
      window.location.href = "/admin";
    } else if (role === "agent") {
      window.location.href = "/agenttickets";
    } else {
      window.location.href = "/dashboard";
    }
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="home-bg">
      <div className="home-card" style={{maxWidth: 400}}>
        <div className="home-header">
          <h2 className="home-title" style={{fontSize: '2rem'}}>Sign In</h2>
          <p className="home-subtitle">Login with your email or Google account</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            className="login-input"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
           <input
            type="password"
            className="login-input"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <button type="submit" className="home-btn user-btn" style={{marginTop: '1rem'}}>Login with Email</button>
        </form>
        <div style={{textAlign: 'center', margin: '1.2rem 0 0.5rem 0', color: '#111'}}>or</div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <GoogleLogin onSuccess={handleSuccess} onError={() => alert('Login Failed!')} />
        </div>
        <div className="login-signup-link">
          <span>Not signed in? </span>
          <Link to="/signup" className="home-track-link">Sign up</Link>
        </div>
      </div>
    </div>
  );
};
