import React, { useState } from 'react';
import { Departments } from "../components/Departments";
import { Statuses } from '../components/Statuses';
import { AllTickets } from '../components/AllTickets';
import { useNavigate } from 'react-router-dom';

export const AdminPanel = () => {
  const [tab, setTab] = useState('departments');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="dashboard-title">Admin Panel</h2>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="dashboard-filters" style={{ marginBottom: 24 }}>
          <button
            onClick={() => setTab('departments')}
            className={`dashboard-btn${tab === 'departments' ? ' create-btn' : ''}`}
            style={{ minWidth: 120 }}
          >
            Departments
          </button>
          <button
            onClick={() => setTab('statuses')}
            className={`dashboard-btn${tab === 'statuses' ? ' create-btn' : ''}`}
            style={{ minWidth: 120 }}
          >
            Statuses
          </button>
          <button
            onClick={() => setTab('alltickets')}
            className={`dashboard-btn${tab === 'alltickets' ? ' create-btn' : ''}`}
            style={{ minWidth: 120 }}
          >
            All Tickets
          </button>
        </div>
        {/* Panels */}
        <div>
          {tab === 'departments' && <Departments />}
          {tab === 'statuses' && <Statuses />}
          {tab === 'alltickets' && <AllTickets />}
        </div>
      </div>
    </div>
  );
};
