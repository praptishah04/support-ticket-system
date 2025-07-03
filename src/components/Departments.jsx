import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/department/getdepartment');
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post('/department/adddepartment', { name });
      setName('');
      fetchDepartments();
    } catch (err) {
      console.error('Error adding department:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/department/deletedepartment/${id}`);
      fetchDepartments();
    } catch (err) {
      console.error('Error deleting department:', err);
    }
  };

  return (
    <div className="departments-wrapper">
      {/* Add Department */}
      <form onSubmit={handleAdd} className="departments-add-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Department Name"
          className="departments-input"
        />
        <button type="submit" className="departments-btn add-btn">Add</button>
      </form>
      {/* Department List */}
      <ul className="departments-list">
        {departments.map((dept) => (
          <li key={dept._id} className="departments-list-item">
            <span>{dept.name}</span>
            <button
              onClick={() => handleDelete(dept._id)}
              className="departments-btn delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
