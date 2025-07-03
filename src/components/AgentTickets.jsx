import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const AgentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');
  const [statuses, setStatuses] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTickets();
    fetchStatuses();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/ticket/assigned', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTickets(res.data);
    } catch (err) {
      alert('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get('/status/getstatus', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Fetched statuses:', res.data);
      setStatuses(res.data);
    } catch (err) {
      console.error('Error fetching statuses:', err);
      console.error('Status error details:', err.response?.data);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const res = await axios.get(`/ticket/ticket/${ticketId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedTicket(res.data);
    } catch (err) {
      alert('Failed to load ticket details.');
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message.');
      return;
    }

    try {
      const payload = {
        message: replyMessage,
        author: JSON.parse(localStorage.getItem('user'))._id,
        isInternal: false
      };

      await axios.post(`/ticket/addreply/${ticketId}/reply`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReplyMessage('');
      fetchTicketDetails(ticketId);
      fetchTickets();
    } catch (err) {
      alert('Failed to add reply.');
    }
  };

  const closeTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to close this ticket?')) return;

    try {
      console.log('Available statuses:', statuses);
  
      const closedStatus = statuses.find(s => s.title === 'Closed');
      console.log('Found closed status:', closedStatus);
      
      if (!closedStatus) {
        console.log('No Closed status found, adding closure note only');
        const payload = {
          message: 'Ticket has been closed by the agent.',
          author: JSON.parse(localStorage.getItem('user'))._id,
          isInternal: false
        };

        await axios.post(`/ticket/addreply/${ticketId}/reply`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('Ticket marked as closed (status update requires admin to create "Closed" status)');
        fetchTickets();
        setSelectedTicket(null);
        return;
      }

      console.log('Updating ticket status to:', closedStatus._id);

     
      const updateResponse = await axios.put(`/ticket/updateticket/${ticketId}`, 
        { status: closedStatus._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Status update response:', updateResponse.data);

      
      const payload = {
        message: 'Ticket has been closed by the agent.',
        author: JSON.parse(localStorage.getItem('user'))._id,
        isInternal: false
      };

      const replyResponse = await axios.post(`/ticket/addreply/${ticketId}/reply`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Reply response:', replyResponse.data);

      alert('Ticket closed successfully!');
      fetchTickets();
      setSelectedTicket(null);
    } catch (err) {
      console.error('Close ticket error:', err);
      console.error('Error details:', err.response?.data);
      alert('Failed to close ticket. Please try again. Check console for details.');
    }
  };

  const escalateTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to escalate this ticket?')) return;

    try {
     
      const escalatedStatus = statuses.find(s => s.title.toLowerCase() === 'escalated');
      if (!escalatedStatus) {
        alert('Escalated status not found. Please contact admin to create an "Escalated" status.');
        return;
      }

      
      await axios.put(`/ticket/updateticket/${ticketId}`,
        { status: escalatedStatus._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      
      const payload = {
        message: 'Ticket has been escalated by the agent.',
        author: JSON.parse(localStorage.getItem('user'))._id,
        isInternal: false
      };

      await axios.post(`/ticket/addreply/${ticketId}/reply`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Ticket escalated successfully!');
      fetchTickets();
      setSelectedTicket(null);
    } catch (err) {
      alert('Failed to escalate ticket. Please try again.');
    }
  };

  if (selectedTicket) {
    return (
      <div className="dashboard-bg">
        <div className="dashboard-card">
          <button 
            onClick={() => setSelectedTicket(null)}
            style={{ 
              background: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              marginBottom: '16px'
            }}
          >
            ← Back to Tickets
          </button>
          
          <h2>{selectedTicket.title}</h2>
          <p style={{ color: '#6b7280', fontWeight: '600' }}>Ticket #{selectedTicket._id}</p>
          
          <div style={{ margin: '16px 0' }}>
            <span style={{ 
              background: selectedTicket.priority === 'High' ? '#ef4444' : '#10b981', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px', 
              marginRight: '8px'
            }}>
              {selectedTicket.priority}
            </span>
            <span style={{ 
              background: '#3b82f6', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px' 
            }}>
              {selectedTicket.status?.title}
            </span>
          </div>

          <p style={{ margin: '16px 0' }}>{selectedTicket.description}</p>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Created by: {selectedTicket.createdBy?.name}
          </p>

          <div style={{ margin: '20px 0' }}>
            <h3>Replies</h3>
            {selectedTicket.replies?.map((reply, index) => (
              <div key={index} style={{ 
                background: '#f3f4f6', 
                padding: '12px', 
                borderRadius: '6px', 
                marginBottom: '8px' 
              }}>
                <strong>{reply.user?.name}</strong>
                <p style={{ margin: '4px 0 0 0' }}>{reply.message}</p>
              </div>
            ))}
          </div>

          <div>
            <h3>Add Reply</h3>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              style={{ 
                width: '100%', 
                minHeight: '80px', 
                padding: '10px', 
                borderRadius: '4px', 
                border: '1px solid #d1d5db',
                marginBottom: '10px'
              }}
            />
            <button 
              onClick={() => handleReply(selectedTicket._id)}
              style={{ 
                background: '#3b82f6', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Send Reply
            </button>
            <button 
              onClick={() => closeTicket(selectedTicket._id)}
              style={{ 
                background: '#ef4444', 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Close Ticket
            </button>
            <button
              onClick={() => escalateTicket(selectedTicket._id)}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Escalate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <h2>My Assigned Tickets</h2>
        {loading ? (
          <p>Loading tickets...</p>
        ) : (
          <div className="dashboard-tickets">
            {tickets.length === 0 ? (
              <p>No tickets assigned to you.</p>
            ) : (
              tickets.map(ticket => (
                <div key={ticket._id} className="dashboard-ticket-card" 
                     style={{ cursor: 'pointer' }} 
                     onClick={() => fetchTicketDetails(ticket._id)}>
                  <h3>{ticket.title}</h3>
                  <p style={{ color: '#6b7280', fontWeight: '600' }}>
                    Ticket #{ticket._id}
                  </p>
                  <p>{ticket.description.substring(0, 100)}...</p>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ 
                      background: ticket.priority === 'High' ? '#ef4444' : '#10b981', 
                      color: 'white', 
                      padding: '3px 6px', 
                      borderRadius: '4px', 
                      marginRight: '8px',
                      fontSize: '12px'
                    }}>
                      {ticket.priority}
                    </span>
                    <span style={{ 
                      background: '#3b82f6', 
                      color: 'white', 
                      padding: '3px 6px', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {ticket.status?.title}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 