import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Make sure this points correctly to your axios instance
import '../styles/FileUpload.css'; // Importing your styles

// // Now generateRandomInsight accepts courseTitle and files
// async function generateRandomInsight(courseTitle, files) {
//   const fileNames = files.map(file => file.filename).join(', ');

//   const randomPrompt = `
//     You are helping students in a classroom called "${courseTitle}".
//     They have uploaded the following files: ${fileNames}.
//     Based on this, generate a short, motivational, and inspiring insight that is connected to their learning.
//   `;

//   try {
//     const response = await api.post('/api/gemini/generate', { prompt: randomPrompt });
//     const generatedText = response.data.candidates[0].content.parts[0].text;
//     return generatedText;
//   } catch (error) {
//     console.error("Error generating content:", error);
//     return "Failed to generate insight.";
//   }
// }

function FileUpload() {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState([]); // State to store the fetched classes
  const [loading, setLoading] = useState(true); // To track loading state

  // Fetch classes from the backend when the component mounts
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/api/classes/all'); // Fetching all classes
        setClasses(response.data); // Storing classes in state
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchClasses(); // Fetch classes on mount
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle class selection change
  const handleClassChange = (e) => {
    setClassName(e.target.value); // Update className based on selected option
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !className || !category) {
      alert("Please select a file, a category, and choose a class.");
      return;
    }
  
    try {
      // Find the classId matching the selected className
      const selectedClass = classes.find(cls => cls.title === className);
      if (!selectedClass) {
        alert("Selected class not found!");
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      formData.append('classId', selectedClass._id); // ✅ Correctly sending classId
  
      const response = await api.post('/api/classes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      if (response.status === 200) {
        alert('File uploaded successfully!');
        setFile(null);
        setCategory('');
        setClassName('');
      } else {
        alert('Failed to upload file.');
      }
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      alert('Failed to upload file.');
    }
  };
  

  if (loading) {
    return <div>Loading classes...</div>;
  }

  return (
    <div className="file-upload-form">
      {/* Form to upload a file */}
      <form onSubmit={handleUpload}>
        <label htmlFor="file-upload" className="custom-file-upload">
          {file ? file.name : "Choose File"}
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
        />
        {/* Dropdown to select a class */}
        <select
          value={className}
          onChange={handleClassChange}
          className="category-select"
        >
          <option value="" disabled>Select a Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls.title}>
              {cls.title} {/* Displaying class title */}
            </option>
          ))}
        </select>

        {/* Dropdown for selecting category */}
        <select value={category} onChange={e => setCategory(e.target.value)} className="category-select">
          <option value="" disabled>Select a Category</option>
          <option value="homework">Homework</option>
          <option value="quiz">Quiz</option>
          <option value="test">Test</option>
        </select>

        {/* Upload button */}
        <button type="submit" className="upload-button">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;
