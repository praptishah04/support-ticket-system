import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Statuses = () => {
  const [statuses, setStatuses] = useState([]);
  const [title, setTitle] = useState('');

  const fetchStatuses = async () => {
    try {
      const res = await axios.get('/status/getstatus');
      setStatuses(res.data);
    } catch (err) {
      console.error('Error fetching statuses:', err);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await axios.post('/status/addstatus', { title });
      setTitle('');
      fetchStatuses();
    } catch (err) {
      console.error('Error adding status:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/status/deletestatus/${id}`);
      fetchStatuses();
    } catch (err) {
      console.error('Error deleting status:', err);
    }
  };

  return (
    <div className="statuses-wrapper">
      {/* Add Status */}
      <form onSubmit={handleAdd} className="statuses-add-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Status Title"
          className="statuses-input"
        />
        <button type="submit" className="statuses-btn add-btn">Add</button>
      </form>
      {/* Status List */}
      <ul className="statuses-list">
        {statuses.map((status) => {
          const statusClass =
            status.title && status.title.toLowerCase() === 'open'
              ? 'open'
              : status.title && status.title.toLowerCase() === 'closed'
              ? 'closed'
              : '';
          return (
            <li key={status._id} className={`statuses-list-item ${statusClass}`}>
              <span>{status.title}</span>
              <button
                onClick={() => handleDelete(status._id)}
                className="statuses-btn delete-btn"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
