import React, { useEffect, useState } from 'react';
import api from '../api/api'; // Your axios instance
import '../styles/InsightsViewer.css'; // <-- You can create this for extra animations (optional)

function InsightsViewer() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [insight, setInsight] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/api/classes/all');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    const selectedId = e.target.value;
    setSelectedClassId(selectedId);

    try {
      const response = await api.get(`/api/classes/insights/${selectedId}`);
      setInsight(response.data.insights || '<div>No insights available.</div>');
    } catch (error) {
      console.error('Error fetching insights:', error);
      setInsight('<div>Failed to fetch insights.</div>');
    }
  };

  if (loading) {
    return <div className="loading">Loading classes...</div>;
  }

  return (
    <div className="insights-viewer">
      <div className="insights-box">
        {/* Class select dropdown */}
        <select
          value={selectedClassId}
          onChange={handleClassChange}
          className="category-select"
        >
          <option value="" disabled>Select a Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem._id}>
              {classItem.title}
            </option>
          ))}
        </select>

        {/* Show insight if available */}
        {insight && (
          <div className="class-insight-card fade-in">
            <div
              className="insight-content prose max-w-none"
              dangerouslySetInnerHTML={{ __html: insight }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightsViewer;
