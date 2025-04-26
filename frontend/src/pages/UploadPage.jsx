import React from 'react';
import FileUpload from '../components/FileUpload';
import Navbar from "../components/NavBar.jsx";

function UploadPage() {
  // Hardcode a sample classId for now or get it from URL params
  const classId = 'sample-class-id';

  return (
    <div>
      <Navbar />
      <div>
        <h1>Upload Assignments</h1>
        <FileUpload classId={classId} />
      </div>
    </div>
  );
}

export default UploadPage;
