import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('/ticket/userticket', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
.then(res => {
  console.log("🎯 Tickets response:", res.data); 
  setTickets(res.data);
  setFilteredTickets(res.data);
  setLoading(false);
})
    .catch(err => {
      setError('Failed to load tickets. Please check your connection or login status.');
      setLoading(false);
    });
  }, []);


  useEffect(() => {
    let filtered = tickets;
    if (priorityFilter) {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }
   if (statusFilter) {
  filtered = filtered.filter(t => t.status?.title?.toLowerCase().trim() === statusFilter.toLowerCase().trim());
  }
  setFilteredTickets(filtered);
  }, [priorityFilter, statusFilter, tickets]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="dashboard-title">My Tickets</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/createticket')}
              className="dashboard-btn create-btn"
            >
              + Create Ticket
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        {/* Filters */}
        <div className="dashboard-filters">
          <select
            className="dashboard-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">Filter by Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <select
            className="dashboard-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Escalated">Escalated</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        {/* Error Message */}
        {error && <div className="dashboard-empty" style={{color: '#b91c1c', fontWeight: 600}}>{error}</div>}
        {/* Loading State */}
        {loading ? (
          <div className="dashboard-empty">Loading tickets...</div>
        ) : (
          <div className="dashboard-tickets">
            {filteredTickets.length === 0 && !error ? (
              <p className="dashboard-empty">No tickets found.</p>
            ) : (
              filteredTickets.map(ticket => {
                const safePriority = ticket.priority || 'Unknown';
                const safeStatus = ticket.status?.title || 'Unknown';

                return (
                  <div key={ticket._id} className="dashboard-ticket-card">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <p className="ticket-number"><strong>Ticket #:</strong> {ticket._id}</p>
                    <p className="ticket-desc">{ticket.description}</p>
                    <div className="ticket-meta-row">
                      <span className={`priority-badge priority-${safePriority.toLowerCase()}`}>Priority: {safePriority}</span>
                      <span className={`status-badge status-${safeStatus.replace(/\s/g, '').toLowerCase()}`}>Status: {safeStatus}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/ticket/${ticket._id}`)}
                      className="dashboard-btn details-btn"
                    >
                      View Details
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
