import React, { useEffect, useState } from 'react';
import api from '../api/api';

// Now generateRandomInsight accepts courseTitle and files
async function generateRandomInsight(courseTitle, files) {
    // Extract filenames
    const fileNames = files.map(file => file.filename).join(', ');

    const randomPrompt = `
        You are helping students in a classroom called "${courseTitle}".
        They have uploaded the following files: ${fileNames}.
        Based on this, generate a short, motivational, and inspiring insight that is connected to their learning.
    `;

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

  if (loading) {
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
