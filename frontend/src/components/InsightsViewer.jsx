import React, { useEffect, useState } from 'react';
import api from '../api/api';

function InsightsViewer() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchAllClasses = async () => {
      try {
        const response = await api.get('/api/classes/all'); 
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };
    fetchAllClasses();
  }, []);

  if (classes.length === 0) {
    return <div>Loading insights...</div>;
  }

  return (
    <div className="insights-viewer">
      {classes.map((classItem) => (
        <div key={classItem._id} className="class-insight-card">
          <h2>{classItem.title}</h2>
          <pre>{classItem.insights}</pre>
        </div>
      ))}
    </div>
  );
}

export default InsightsViewer;
