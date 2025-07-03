import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="home-bg">
      <div className="home-card">
        <div className="home-header">
          <h1 className="home-title">Welcome to the Support Center</h1>
          <p className="home-subtitle">
            Need help? Raise a ticket and we'll assist you.
          </p>
        </div>
        <div className="home-buttons">
          <Link to="/login" className="home-btn user-btn">Login</Link>
        </div>
      </div>
    </div>
  );
};