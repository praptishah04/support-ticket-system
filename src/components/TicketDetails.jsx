import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const TicketDetails = () => {
  const { id } = useParams(); 
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    axios.get('/ticket/gettickets')
      .then((res) => {
        const found = res.data.find(t => t._id === id);
        setTicket(found || null);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching ticket:", err);
        setLoading(false);
      });
  }, [id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
  `/ticket/addreply/${id}/reply`,
  {
    message: replyMessage,
    author: user._id
  },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
      setTicket(response.data);
      setReplyMessage('');
    } catch (err) {
      console.error("Error adding reply:", err);
    }
  };

  if (loading) return <p className="ticketdetails-loading">Loading ticket...</p>;
  if (!ticket) return <p className="ticketdetails-error">Ticket not found</p>;

  return (
    <>
      <div className="ticketdetails-bg"></div>
      <div className="ticketdetails-scroll-container">
        <div className="ticketdetails-card">
          <div className="ticketdetails-left">
            <h2 className="ticketdetails-title">{ticket.title}</h2>
            <div className="ticketdetails-meta">
              <span className={`ticketdetails-badge badge-status`}>{ticket.status?.title || '—'}</span>
              <span className={`ticketdetails-badge badge-priority priority-${(ticket.priority || '').toLowerCase()}`}>{ticket.priority}</span>
              <span className="ticketdetails-badge badge-dept">{ticket.department?.name || '—'}</span>
            </div>
            {ticket.tags?.length > 0 && (
              <div className="ticketdetails-tags">
                <span className="ticketdetails-tags-label">Tags:</span>
                <ul className="ticketdetails-tags-list">
                  {ticket.tags.map((tag, index) => <li key={index} className="ticketdetails-tag">{tag}</li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="ticketdetails-right">
            <p className="ticketdetails-desc">{ticket.description}</p>
            {/* Replies */}
            <div className="ticketdetails-replies">
              <h3 className="ticketdetails-replies-title">Replies</h3>
              {ticket.replies?.length === 0 ? (
                <p className="ticketdetails-replies-empty">No replies yet.</p>
              ) : (
                <ul className="ticketdetails-replies-list">
                  {ticket.replies.map((reply, index) => (
                    <li key={index} className="ticketdetails-reply">
                      <p className="ticketdetails-reply-msg">{reply.message}</p>
                      <p className="ticketdetails-reply-meta">
                        By {reply.user?.name || 'Unknown'} on {new Date(reply.createdAt).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Add Reply Form */}
            <form onSubmit={handleReplySubmit} className="ticketdetails-reply-form">
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="ticketdetails-reply-input"
                placeholder="Write a reply..."
                rows="3"
              />
              <button type="submit" className="ticketdetails-btn add-btn">Add Reply</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
