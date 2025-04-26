import React, { useEffect, useState } from 'react';
import api from '../api/api'; // Make sure this points correctly to your axios instance
import { GoogleGenerativeAI } from "@google/generative-ai"; // Still imported, but no longer directly used

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

  useEffect(() => {
    const fetchClassesAndGenerateInsights = async () => {
      try {
        const response = await api.get('/api/classes/all');
        const fetchedClasses = response.data;

        const updatedClasses = await Promise.all(fetchedClasses.map(async (classItem) => {
          const randomInsight = await generateRandomInsight();
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
