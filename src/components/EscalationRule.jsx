import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const EscalationRule = () => {
  const [rules, setRules] = useState([]);
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('High');
  const [actionStatus, setActionStatus] = useState('Escalated');
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchRules();
    fetchStatuses();
    window.scrollTo(0, 0);
  }, []);

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/escalation/getallescalation', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRules(res.data);
    } catch (err) {
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatuses = async () => {
    try {
      const res = await axios.get('/status/getstatus', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatuses(res.data.map(s => s.title));
    } catch (err) {
      setStatuses(['Escalated', 'Closed']);
    }
  };

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!name) return alert('Please enter a rule name.');
    try {
      const newRule = {
        name,
        active: true,
        logic: 'AND',
        conditions: [{ field: 'priority', value: priority }],
        actions: [{ type: 'changeStatus', value: actionStatus }]
      };
      await axios.post('/escalation/addescalation', newRule, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setPriority('High');
      setActionStatus('Escalated');
      fetchRules();
      alert('Rule added!');
    } catch (err) {
      alert('Failed to add rule.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this rule?')) return;
    try {
      await axios.delete(`/escalation/deleteescalation/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchRules();
    } catch (err) {
      alert('Failed to delete rule.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: '#fff',
      margin: 0,
      padding: 0,
      fontFamily: 'inherit',
      overflowX: 'hidden'
    }}>
      <div style={{
        width: '100vw',
        maxWidth: '100vw',
        minHeight: '100vh',
        background: '#fff',
        border: '2px solid #2563eb',
        borderRadius: 0,
        boxShadow: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}>
        <h2 style={{
          color: '#2563eb',
          fontWeight: 700,
          fontSize: 32,
          marginBottom: 32,
          textAlign: 'center',
          width: '100%',
          marginTop: 40
        }}>Escalation Rules</h2>

        <form onSubmit={handleAddRule} style={{
          marginBottom: 32,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          width: '100%',
          maxWidth: 700
        }}>
          <div>
            <label style={{ fontWeight: 500, marginBottom: 6, display: 'block', color: '#222' }}>Rule Name:</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 16,
                background: '#fff',
                color: '#222'
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: 500, marginBottom: 6, display: 'block', color: '#222' }}>Priority Condition:</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 16,
                background: '#fff',
                color: '#222'
              }}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label style={{ fontWeight: 500, marginBottom: 6, display: 'block', color: '#222' }}>Action (Change Status):</label>
            <select
              value={actionStatus}
              onChange={e => setActionStatus(e.target.value)}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 8,
                border: '1px solid #d1d5db',
                fontSize: 16,
                background: '#fff',
                color: '#222'
              }}
            >
              {statuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            padding: '14px 0',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 8,
            width: '50%',
            alignSelf: 'center',
            boxShadow: '0 2px 8px #e0e7ff'
          }}>Add Rule</button>
        </form>

        <h3 style={{
          fontWeight: 600,
          marginBottom: 20,
          fontSize: 22,
          color: '#2563eb',
          textAlign: 'center',
          width: '100%'
        }}>Current Rules</h3>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : (
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            width: '100%',
            maxWidth: 700
          }}>
            {rules.length === 0 ? (
              <li style={{ textAlign: 'center', color: '#666' }}>No rules yet.</li>
            ) : (
              rules.map(rule => (
                <li key={rule._id} style={{
                  background: '#f9fafb',
                  padding: 20,
                  borderRadius: 8,
                  border: '1.5px solid #2563eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ fontSize: 18, color: '#2563eb' }}>{rule.name}</strong><br />
                    <span style={{ color: '#374151' }}>
                      If <b>Priority</b> is <b>{rule?.conditions?.[0]?.value}</b>,
                      change status to <b>{rule?.actions?.[0]?.value}</b>.
                    </span>
                  </div>
                  <button onClick={() => handleDelete(rule._id)} style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px #fee2e2'
                  }}>Delete</button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};
