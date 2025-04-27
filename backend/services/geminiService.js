const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_2_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function generateInsights(parsedText, courseDescription) {
  console.log('🎯 Generating insights with Gemini 2.0...');

  const response = await axios.post(
    `${GEMINI_2_ENDPOINT}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { text: `
You are an AI tutor. Given a student's exam extracted content and a course description, generate detailed study improvement insights.

Course Description:
${courseDescription}

Student Exam Content:
${parsedText}

Your Output:
- Common mistakes made
- Topics needing review
- Strengths of the student
- Motivational, specific advice
- Write in clear professional English
` }
          ]
        }
      ]
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const aiInsights = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return aiInsights;
}

module.exports = { generateInsights };
