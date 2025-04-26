import React, { useState } from 'react';
import api from '../api/api';
import '../styles/FileUpload.css'; // CSS import is good ✅

function FileUpload({ classId }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('homework');

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
      formData.append('classId', classId);  // ✅ Fix field name to classId (backend expects this)

      await api.post('/api/classes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('File uploaded successfully!');
      setFile(null); // ✅ Reset file input after upload
    } catch (error) {
      console.error('File upload error:', error);
      alert('Failed to upload file. See console for details.');
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <form onSubmit={handleUpload} className="file-upload-form">
      <div className="file-input-wrapper">
        <input type="file" onChange={handleFileChange} />
      </div>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="category-select"
      >
        <option value="homework">Homework</option>
        <option value="quiz">Quiz</option>
        <option value="test">Test</option>
      </select>
      <button type="submit" className="upload-button">Upload</button>
    </form>
  );
}

export default FileUpload;
