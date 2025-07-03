import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const CreateTicket = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [departments, setDepartments] = useState([]);
  const [status, setStatus] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/department/getdepartment', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Failed to fetch departments:", err));
    axios.get('http://localhost:5000/user/getalluser', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const onSubmit = (data) => {
    const token = localStorage.getItem('token');
    
    if (data.tags) {
      data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    axios.post('/ticket/createticket', data, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert('Ticket created!');
        navigate("/dashboard")
        reset();
      })
      .catch(() => alert('Failed to create ticket.'));
  };

  return (
    <>
      <div className="ticket-bg"></div>
      <div className="ticket-bg-wrapper">
        <div className="ticket-card">
          <h2 className="ticket-title-main">Submit a Support Ticket</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="ticket-form">
            <div className="ticket-field">
              <label className="ticket-label">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className={`ticket-input${errors.title ? " ticket-input-error" : ""}`}
              />
              {errors.title && <p className="ticket-error">{errors.title.message}</p>}
            </div>
            <div className="ticket-field">
              <label className="ticket-label">Description</label>
              <textarea
                {...register("description", { required: "Description is required" })}
                className={`ticket-input ticket-textarea${errors.description ? " ticket-input-error" : ""}`}
                rows="4"
              />
              {errors.description && <p className="ticket-error">{errors.description.message}</p>}
            </div>
            <div className="ticket-field">
              <label className="ticket-label">Department</label>
              <select
                {...register("department", { required: "Please select a department" })}
                className={`ticket-input${errors.department ? " ticket-input-error" : ""}`}
              >
                <option value="">-- Select Department --</option>
                {Array.isArray(departments) && departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              {errors.department && <p className="ticket-error">{errors.department.message}</p>}
            </div>
            <div className="ticket-field">
              <label className="ticket-label">Priority</label>
              <select
                {...register("priority", { required: true })}
                defaultValue="Low"
                className="ticket-input"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            
            <div className="ticket-field">
              <label className="ticket-label">Tags (comma-separated)</label>
              <input
                type="text"
                className={`ticket-input${errors.tags ? ' ticket-input-error' : ''}`}
                placeholder="Enter tags"
                {...register("tags", {
                  required: "Tags are required",
                  pattern: {
                    value: /^[a-zA-Z0-9, ]+$/,
                    message: "Tags must be letters, numbers, or commas"
                  }
                })}
              />
              {errors.tags && <p className="ticket-error">{errors.tags.message}</p>}
            </div>
            <button type="submit" className="ticket-btn">Submit Ticket</button>
          </form>
        </div>
      </div>
    </>
  );
};
