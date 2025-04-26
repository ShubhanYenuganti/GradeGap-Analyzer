import React, { useEffect, useState } from 'react';
import api from '../api/api'; // Make sure this points correctly to your axios instance

async function generateRandomInsight() {
    const randomPrompt = "Give me a short random inspirational insight for a classroom setting.";
    try {
        const response = await api.post('/api/gemini/generate', { prompt: randomPrompt });
        const generatedText = response.data.candidates[0].content.parts[0].text;
        return generatedText;
    } catch (error) {
        console.error("Error generating content:", error);
        return "Failed to generate insight.";
    }
}

function InsightsViewer() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [insight, setInsight] = useState('');

  useEffect(() => {
    const fetchClassesAndGenerateInsights = async () => {
      try {
        const response = await api.get('/api/classes/all');
        const fetchedClasses = response.data;

        const updatedClasses = await Promise.all(fetchedClasses.map(async (classItem) => {
          const randomInsight = await generateRandomInsight(classItem.title, classItem.files || []);
          return { ...classItem, insights: randomInsight };
        }));

        setClasses(updatedClasses);
      } catch (error) {
        console.error('Error fetching classes or generating insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClassesAndGenerateInsights();
  }, []);

  // Handle class selection from the dropdown
  const handleClassChange = (e) => {
    const selectedTitle = e.target.value;
    setSelectedClass(selectedTitle);
    
    // Find the selected class by title
    const selectedClassItem = classes.find((classItem) => classItem.title === selectedTitle);
    setInsight(selectedClassItem ? selectedClassItem.insights : '');
  };

  if (loading) {
    return <div className="loading">Loading insights...</div>;
  }

  return (
    <div className="insights-viewer">
      <div className="insights-box">
        {/* Dropdown to select a class */}
        <select
          value={selectedClass}
          onChange={handleClassChange}
          className="category-select"
        >
          <option value="" disabled>Select a Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem.title}>
              {classItem.title} {/* Displaying class title */}
            </option>
          ))}
        </select>

        {/* Display insights for the selected class */}
        {insight && (
          <div className="class-insight-card">
            <h2>{selectedClass}</h2>
            <pre>{insight}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default InsightsViewer;
