const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_1_5_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

async function extractTextFromFile(base64Data, mimeType) {
  const response = await axios.post(
    `${GEMINI_1_5_ENDPOINT}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { inlineData: { mimeType: mimeType, data: base64Data } },
            { text: "This document contains handwritten text, math, and written answers. Carefully extract all readable text, preserve math notation where possible. These documents are intended to represent, student quizzes, tests, and exams on various course content, so keep that in mind as well." }
          ]
        }
      ]
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  const extractedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('🔎 Gemini 1.5 extracted text:\n');
  console.log('-----------------------------------------');
  console.log(extractedText);
  console.log('-----------------------------------------\n');
  
  return extractedText;
}

module.exports = { extractTextFromFile };