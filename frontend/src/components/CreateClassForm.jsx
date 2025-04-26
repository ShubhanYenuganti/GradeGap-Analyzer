import React, { useState } from 'react';
import api from '../api/api';
import FileUpload from './FileUpload'; // Import file upload component
import '../styles/CreateClassForm.css';

function CreateClassForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdClassId, setCreatedClassId] = useState(null); // 🆕 new state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/classes/create', { title, description });
      const newClassId = res.data._id;
      localStorage.setItem('createdClassId', newClassId); // 🆕 Save classId locally
      alert('Class created successfully! You can now upload a file from the upload page.');
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class.');
    }
  };
  
  return (
    <>
      <form className="create-class-form" onSubmit={handleSubmit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button type="submit">Add Class</button>
      </form>

      {/* 🆕 Show File Upload only after class is created */}
      {createdClassId && <FileUpload classId={createdClassId} />}
    </>
  );
}

export default CreateClassForm;
