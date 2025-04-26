const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_2_0_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function generateInsightsFromText(text) {
  const response = await axios.post(
    `${GEMINI_2_0_ENDPOINT}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { text: text },
            { text: "Please summarize the key topics, major mistakes, and provide an overall analysis of this academic document." }
          ]
        }
      ]
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const insights = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return insights;
}

module.exports = { generateInsightsFromText };
