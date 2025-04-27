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
- Common mistakes the student made
- Topics that need additional review
- Student's strengths and weaknesses
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
  const overallInsights = await synthesizeInsights(courseInsights, aiInsights);
  let synthesizedJSX = overallInsights.match(/```jsx\s*([\s\S]*?)```/)?.[1]?.trim() || '';
  if (!synthesizedJSX) {
    console.warn('⚠️ Warning: No JSX block found. Returning basic fallback.');
    return '<div>No insights generated. Please try again later.</div>';
  }
  // Remove outer <>...</> fragment if present
  if (synthesizedJSX.startsWith('<>') && synthesizedJSX.endsWith('</>')) {
    synthesizedJSX = synthesizedJSX.slice(2, -3).trim();
  }
  
  console.log('✅ JSX insights extracted');
  
  return synthesizedJSX;
}

// 🛠️ synthesizeInsights should be outside the first function
async function synthesizeInsights(courseInsights, aiInsights) {
  console.log('🔵 Synthesizing insights together...');

  const prompt = `
You are generating a personalized student performance report.

You have two sources of input:
- "Course Insights": General trends observed across the entire course cohort (common struggles, common strengths).
- "AI Insights": Analysis based on a **newly uploaded assignment, exam, or homework submission** for this specific student.

Your job:
- **Synthesize** the overall Course Insights and the AI Insights from the new submission together.
- Identify what the student is doing particularly well **relative to course trends**.
- Identify where the student **still needs improvement**.
- Provide actionable next steps.

Output Format:
Return the report as **plain JSX inside a Markdown code block** (triple backticks).

Example output:

\`\`\`jsx
<>
  <h3>🏆 Progress Made</h3>
  <ul>
    <li>First strength</li>
    <li>Second strength</li>
  </ul>

  <h3>🔍 Areas of Improvement</h3>
  <ul>
    <li>First area</li>
    <li>Second area</li>
  </ul>

  <h3>🚀 Next Steps</h3>
  <ol>
    <li>First next step</li>
    <li>Second next step</li>
  </ol>
</>
\`\`\`

✅ Only output valid JSX inside the code block.  
✅ No extra commentary, no explanation outside the code block.  
✅ Use <ul> and <li> for unordered points; use <ol> and <li> for next steps.  
✅ Group points meaningfully: Synthesize inputs, do not simply copy-paste.

---

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

// Export both functions properly
module.exports = { generateInsights };