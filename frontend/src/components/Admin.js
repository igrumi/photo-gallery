import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

const Admin = () => {
  const [memories, setMemories] = useState([]);
  const [editingMemory, setEditingMemory] = useState(null);
  const [newMemory, setNewMemory] = useState({ title: '', category: '', date: '', description: '', image: null });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/memories', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setMemories(response.data);
      } catch (error) {
        console.error('Error fetching memories:', error);
      }
    };

    fetchMemories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMemory({ ...newMemory, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewMemory({ ...newMemory, image: e.target.files[0] });
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newMemory).forEach((key) => formData.append(key, newMemory[key]));

    try {
      await axios.post('http://localhost:5000/api/memories', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setNewMemory({ title: '', category: '', date: '', description: '', image: null });
      setShowAddForm(false);
      const response = await axios.get('http://localhost:5000/api/memories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMemories(response.data);
    } catch (error) {
      console.error('Error adding memory:', error);
    }
  };

  const handleEditMemory = async (memory) => {
    setEditingMemory(memory);
  };

  const handleUpdateMemory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(editingMemory).forEach((key) => formData.append(key, editingMemory[key]));

    try {
      await axios.put(`http://localhost:5000/api/memories/${editingMemory._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditingMemory(null);
      const response = await axios.get('http://localhost:5000/api/memories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMemories(response.data);
    } catch (error) {
      console.error('Error updating memory:', error);
    }
  };

  const handleDeleteMemory = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/memories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const response = await axios.get('http://localhost:5000/api/memories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMemories(response.data);
    } catch (error) {
      console.error('Error deleting memory:', error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel</h2>
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Cancel' : 'Add New Memory'}
      </button>
      {showAddForm && (
        <div>
          <h3>Add New Memory</h3>
          <form className="admin-form" onSubmit={handleAddMemory}>
            <input type="text" name="title" placeholder="Title" value={newMemory.title} onChange={handleInputChange} required />
            <input type="text" name="category" placeholder="Category" value={newMemory.category} onChange={handleInputChange} required />
            <input type="date" name="date" placeholder="Date" value={newMemory.date} onChange={handleInputChange} required />
            <textarea name="description" placeholder="Description" value={newMemory.description} onChange={handleInputChange} required></textarea>
            <input type="file" name="image" onChange={handleFileChange} required />
            <button type="submit">Add Memory</button>
          </form>
        </div>
      )}

      {editingMemory && (
        <div>
          <h3>Edit Memory</h3>
          <form className="admin-form" onSubmit={handleUpdateMemory}>
            <input type="text" name="title" placeholder="Title" value={editingMemory.title} onChange={(e) => setEditingMemory({ ...editingMemory, title: e.target.value })} required />
            <input type="text" name="category" placeholder="Category" value={editingMemory.category} onChange={(e) => setEditingMemory({ ...editingMemory, category: e.target.value })} required />
            <input type="date" name="date" placeholder="Date" value={editingMemory.date} onChange={(e) => setEditingMemory({ ...editingMemory, date: e.target.value })} required />
            <textarea name="description" placeholder="Description" value={editingMemory.description} onChange={(e) => setEditingMemory({ ...editingMemory, description: e.target.value })} required></textarea>
            <input type="file" name="image" onChange={(e) => setEditingMemory({ ...editingMemory, image: e.target.files[0] })} />
            <button type="submit">Update Memory</button>
          </form>
        </div>
      )}

      <h3>Manage Memories</h3>
      <ul className="memory-list">
        {memories.map((memory) => (
          <li className="memory-item" key={memory._id}>
            {memory.title} - {memory.description}
            <div>
              <button onClick={() => handleEditMemory(memory)}>Edit</button>
              <button onClick={() => handleDeleteMemory(memory._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
