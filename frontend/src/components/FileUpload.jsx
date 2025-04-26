import React, { useState } from 'react';
import api from '../api/api';
import '../styles/FileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [classId, setClassId] = useState('');
  const [className, setClassName] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFetchClassId = async (e) => {
    e.preventDefault();
    if (!className) {
      alert("Please enter a class name first.");
      return;
    }
    try {
      const res = await api.get(`/api/classes/getClassId/${encodeURIComponent(className)}`);
      setClassId(res.data.classId);
      alert("Class found! You can now upload a file.");
    } catch (error) {
      console.error('Error fetching class ID:', error);
      alert('Class not found. Please check the class name.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !classId || !category) {
      alert("Please select a file, a category, and fetch a valid class ID first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('classId', classId);

      await api.post('/api/classes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('File uploaded successfully!');
      setFile(null);
      setCategory('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <div className="file-upload-form">
      <form onSubmit={handleFetchClassId} className="class-id-form">
        <input
          type="text"
          placeholder="Enter Class Name"
          value={className}
          onChange={e => setClassName(e.target.value)}
        />
        <button type="submit" className="fetch-class-id-button">Find Class</button>
      </form>

      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />

        <select value={category} onChange={e => setCategory(e.target.value)} className="category-select">
          <option value="" disabled>Select a Category</option>
          <option value="homework">Homework</option>
          <option value="quiz">Quiz</option>
          <option value="test">Test</option>
        </select>

        <button type="submit" className="upload-button">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;
