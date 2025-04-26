import React, { useState, useEffect } from 'react';
import api from '../api/api';
import '../styles/FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('homework');
  const [classId, setClassId] = useState('');

  useEffect(() => {
    const storedClassId = localStorage.getItem('createdClassId'); // 🆕 Retrieve classId
    if (storedClassId) {
      setClassId(storedClassId);
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('classId', classId); // 🆕 Use retrieved classId

      await api.post('/api/classes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('File uploaded successfully!');
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <form onSubmit={handleUpload} className="file-upload-form">
      <input type="file" onChange={handleFileChange} />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="homework">Homework</option>
        <option value="quiz">Quiz</option>
        <option value="test">Test</option>
      </select>
      <button type="submit" className="upload-button">Upload</button>
    </form>
  );
}

export default FileUpload;
