import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agents, setAgents] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [assignMsg, setAssignMsg] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('/ticket/gettickets', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setTickets(res.data);
      setFilteredTickets(res.data);
      setLoading(false);
    })
    .catch(err => {
      setError('Failed to load tickets. Please check your connection or login status.');
      setLoading(false);
    });
    // Fetch agents
    axios.get('/user/getalluser', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setAgents(res.data))
    .catch(() => setAgents([]));
  }, []);

  // Filtering
  useEffect(() => {
    let filtered = tickets;
    if (priorityFilter) {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(t => {
        if (typeof t.status === 'object' && t.status && t.status.title) {
          return t.status.title === statusFilter;
        }
        if (typeof t.status === 'string') {
          return t.status === statusFilter;
        }
        return false;
      });
    }
    setFilteredTickets(filtered);
  }, [priorityFilter, statusFilter, tickets]);

  const handleAssign = async (ticketId) => {
    if (!selectedAgent) return;
    try {
      await axios.post(`/ticket/assign/${ticketId}`, { assignedTo: selectedAgent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignMsg('Ticket assigned successfully!');
      setAssigningId(null);
      setSelectedAgent('');
      // Refresh tickets
      const res = await axios.get('/ticket/gettickets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data);
      setFilteredTickets(res.data);
      setTimeout(() => setAssignMsg(''), 2000);
    } catch (err) {
      setAssignMsg('Failed to assign ticket.');
      setTimeout(() => setAssignMsg(''), 2000);
    }
  };

  return (
    <div className="dashboard-card" style={{margin: 0}}>
      <div className="dashboard-header">
        <h2 className="dashboard-title">All Tickets</h2>
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
          <option value="In Progress">In Progress</option>
          <option value="Escalated">Escalated</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      {/* Error Message */}
      {error && <div className="dashboard-empty" style={{color: '#b91c1c', fontWeight: 600}}>{error}</div>}
      {assignMsg && <div className="dashboard-empty" style={{color: '#047857', fontWeight: 600}}>{assignMsg}</div>}
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
              const safeStatus = typeof ticket.status === 'object' && ticket.status?.title
  ? ticket.status.title
  : typeof ticket.status === 'string'
    ? ticket.status
    : 'Unknown';
              return (
                <div key={ticket._id} className="dashboard-ticket-card horizontal-card">
                  <div className="ticket-card-left">
                    <h3 className="ticket-title">{ticket.title}</h3>
                    <p className="ticket-number"><strong>Ticket #:</strong> {ticket._id}</p>
                  </div>
                  <div className="ticket-card-right">
                    <p className="ticket-desc">{ticket.description}</p>
                    <p className="ticket-meta">
                      <span><strong>Priority:</strong> {safePriority}</span>
                    </p>
                    <p className="ticket-meta">
                      <span><strong>Status:</strong> {safeStatus}</span>
                    </p>
                    {ticket.assignedTo && (
                      <p className="ticket-assigned">
                        <strong>Assigned to:</strong> {ticket.assignedTo.name} ({ticket.assignedTo.email})
                      </p>
                    )}
                    <div className="dashboard-btn-row">
                      <button
                        onClick={() => navigate(`/ticket/${ticket._id}`)}
                        className="dashboard-btn details-btn"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate(`/escalationrule?ticketId=${ticket._id}`)}
                        className="dashboard-btn escalate-btn"
                      >
                        Escalate
                      </button>
                      <button
                        className="dashboard-btn assign-btn"
                        onClick={() => setAssigningId(ticket._id)}
                      >
                        Assign
                      </button>
                    </div>
                    {assigningId === ticket._id && (
                      <div className="assign-dropdown">
                        <select
                          className="dashboard-select"
                          value={selectedAgent}
                          onChange={e => setSelectedAgent(e.target.value)}
                        >
                          <option value="">Select Agent</option>
                          {agents.map(agent => (
                            <option key={agent._id} value={agent._id}>{agent.name} ({agent.email})</option>
                          ))}
                        </select>
                        <button
                          className="dashboard-btn assign-btn"
                          style={{marginLeft: '0.5rem'}}
                          onClick={() => handleAssign(ticket._id)}
                          type="button"
                        >
                          Confirm
                        </button>
                        <button
                          className="dashboard-btn details-btn"
                          style={{marginLeft: '0.5rem', background: '#e0e7ff', color: '#2563eb'}}
                          onClick={() => { setAssigningId(null); setSelectedAgent(''); }}
                          type="button"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}; 