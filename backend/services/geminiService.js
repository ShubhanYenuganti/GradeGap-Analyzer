const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_2_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

async function generateInsights(parsedText, courseDescription, type, courseInsights) {
  console.log('🎯 Generating insights with Gemini 2.0...');

  const response = await axios.post(
    `${GEMINI_2_ENDPOINT}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            { text: `
You are analyzing student performance on an exam or homework submission.

Course Description:
${courseDescription}

Exam, Quiz, or Homework:
${type}

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

  // Step 2: Blend AI insights + course insights together
  const blendedInsights = await synthesizeInsights(courseInsights, aiInsights);

  return blendedInsights;
}

async function synthesizeInsights(courseInsights, aiInsights) {
    console.log('🔵 Synthesizing insights together...');
  
    const prompt = `
  You are an educational evaluator helping generate personalized feedback for students.
  
  You are given two types of insights:
  - "Course Insights" (general trends about the course)
  - "AI Insights" (personalized analysis of this student's performance)
  
  Blend these into a **single final student report** using this format:
  
  ---
  
  🏆 **Progress Made**  
  - (List specific skills/areas where the student has demonstrated improvement or strength.)
  
  🔍 **Areas of Improvement**  
  - (Identify topics or skills needing further work. For each, suggest a concrete method to improve, like "Review lecture notes on Topic X", "Solve 5 more problems of type Y".)
  
  🚀 **Next Steps**  
  - (Give 3 clear action points for the student to focus on over the next week.)
  
  ---
  
  Make it motivating but direct. Prefer bullet points where useful. Output should be structured and easy to parse into sections in a frontend application.
  
  Here are the inputs:
  
  Course Insights:
  ${courseInsights}
  
  AI Insights:
  ${aiInsights}
  `;
  
    const synthResponse = await axios.post(
      `${GEMINI_2_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  
    const synthesizedText = synthResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  
    return synthesizedText;
  }

module.exports = { generateInsights }