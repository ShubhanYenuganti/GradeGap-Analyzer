import React, { useState } from 'react';
import api from '../api/api';
import '../styles/FileUpload.css'; // Make sure it's imported

function FileUpload({ classId }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('homework');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('class_id', classId);

    await api.post('/upload_file', formData);
    alert('File uploaded and insights updated!');
    setFile(null); // Reset file input after upload
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <form onSubmit={handleUpload} className="file-upload-form">
      <div className="file-input-wrapper">
        <input type="file" onChange={handleFileChange} />
      </div>
      <select value={category} onChange={e => setCategory(e.target.value)} className="category-select">
        <option value="homework">Homework</option>
        <option value="quiz">Quiz</option>
        <option value="test">Test</option>
      </select>
      <button type="submit" className="upload-button">Upload</button>
    </form>
  );
}

export default FileUpload;
