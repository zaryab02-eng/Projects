import { GoogleGenerativeAI } from "@google/generative-ai";

// 🔑 ADD GEMINI API KEY HERE - Get from: https://makersuite.google.com/app/apikey
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// 🔧 CHANGE DIFFICULTY PROMPTS HERE
const difficultyPrompts = {
  Easy: `Generate a simple escape room riddle suitable for beginners. 
         The riddle should be straightforward with clear clues.
         Format: Return ONLY a JSON object with this structure:
         {
           "question": "The riddle text here",
           "answer": "single word or short phrase answer",
           "hint": "a helpful hint if stuck"
         }`,

  Medium: `Generate a medium difficulty escape room puzzle that requires logical thinking.
          Include patterns, wordplay, or basic code-breaking.
          Format: Return ONLY a JSON object with this structure:
          {
            "question": "The puzzle text here",
            "answer": "single word or short phrase answer",
            "hint": "a helpful hint if stuck"
          }`,

  Hard: `Generate a challenging escape room puzzle requiring multi-step reasoning.
         Include complex patterns, ciphers, or intricate logic problems.
         Format: Return ONLY a JSON object with this structure:
         {
           "question": "The complex puzzle text here",
           "answer": "single word or short phrase answer",
           "hint": "a helpful hint if stuck"
         }`,
};

/**
 * Generate a question using Gemini AI based on difficulty level
 * @param {string} difficulty - Easy, Medium, or Hard
 * @param {number} levelNumber - Current level number for context
 * @returns {Promise<Object>} Question object with question, answer, and hint
 */
export async function generateQuestion(difficulty, levelNumber) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `${difficultyPrompts[difficulty]}
    
    This is for Level ${levelNumber} of an escape room game.
    Make it thematic and engaging. Ensure the answer is clear and unambiguous.
    Remember: Return ONLY valid JSON, no markdown, no extra text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/```\n?/g, "");
    }

    const questionData = JSON.parse(cleanText);

    return {
      question: questionData.question,
      answer: questionData.answer.toLowerCase().trim(),
      hint: questionData.hint,
      levelNumber,
    };
  } catch (error) {
    console.error("Error generating question:", error);

    // Fallback questions in case API fails
    const fallbackQuestions = {
      Easy: {
        question:
          "I have keys but no locks. I have space but no room. You can enter but can't go outside. What am I?",
        answer: "keyboard",
        hint: "Think about what you're using right now",
      },
      Medium: {
        question:
          "If you have me, you want to share me. If you share me, you don't have me. What am I?",
        answer: "secret",
        hint: "Think about confidential information",
      },
      Hard: {
        question:
          "The more you take, the more you leave behind. What are they?",
        answer: "footsteps",
        hint: "Think about walking",
      },
    };

    return {
      ...fallbackQuestions[difficulty],
      levelNumber,
    };
  }
}

/**
 * Pre-generate all questions for a game session
 * @param {string} difficulty - Game difficulty
 * @param {number} totalLevels - Total number of levels
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateAllQuestions(difficulty, totalLevels) {
  const questions = [];

  for (let i = 1; i <= totalLevels; i++) {
    const question = await generateQuestion(difficulty, i);
    questions.push(question);
  }

  return questions;
}
