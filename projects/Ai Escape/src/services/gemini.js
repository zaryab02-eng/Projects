// IQ Puzzle Bank - 50 Questions per Difficulty Level
// Format matches original structure for seamless integration

// Easy Level Questions (50 questions)
const easyQuestions = [
  {
    question:
      "I speak without a mouth and hear without ears. I have nobody, but I come alive with wind. What am I?",
    answer: ["echo"],
    hint: "You hear it back",
  },
  {
    question: "What comes next in the sequence: 2, 4, 6, 8, __?",
    answer: ["10", "ten"],
    hint: "Count by twos",
  },
  {
    question:
      "A farmer has 3 apples and gives you 2. How many apples does the farmer have left?",
    answer: ["1", "one"],
    hint: "Simple subtraction",
  },
  {
    question: "Which is heavier: a kilogram of iron or a kilogram of feathers?",
    answer: ["they weigh the same", "same", "equal"],
    hint: "Both are 1 kg",
  },
  {
    question: "What has to be broken before you can use it?",
    answer: ["egg", "an egg"],
    hint: "Breakfast item",
  },
  {
    question: "If two's company and three's a crowd, what are four and five?",
    answer: ["nine", "9"],
    hint: "Simple addition",
  },
  {
    question: "What number is missing: 1, 1, 2, 3, 5, __?",
    answer: ["8", "eight"],
    hint: "Fibonacci sequence",
  },
  {
    question:
      "You see me once in June, twice in November, and not at all in May. What am I?",
    answer: ["letter e", "e"],
    hint: "Letter riddle",
  },
  {
    question: "Which word becomes shorter when you add two letters to it?",
    answer: ["short"],
    hint: "Add 'er'",
  },
  {
    question: "If a clock shows 3:00 now, what will it show in 9 hours?",
    answer: ["12:00", "12", "noon", "midnight"],
    hint: "Add 9 hours",
  },
  {
    question: "What gets wetter the more it dries?",
    answer: ["towel"],
    hint: "Bath accessory",
  },
  {
    question: "What goes up but never comes down?",
    answer: ["age", "your age"],
    hint: "Everyone has one",
  },
  {
    question:
      "If you have a single match and enter a dark room with only a candle, a lamp, and a stove, which do you light first?",
    answer: ["match"],
    hint: "You need a flame first",
  },
  {
    question: "Which month has 28 days?",
    answer: ["all", "all months"],
    hint: "Trick question",
  },
  {
    question: "What number is the same upside down and backwards?",
    answer: ["8"],
    hint: "Single digit symmetrical",
  },
  {
    question:
      "A box without hinges, key, or lid, yet golden treasure inside is hid. What is it?",
    answer: ["egg"],
    hint: "Riddle from a well-known poem",
  },
  {
    question: "What begins with T, ends with T, and has T in it?",
    answer: ["teapot"],
    hint: "Container for a drink",
  },
  {
    question:
      "What three positive numbers give the same result when multiplied and added?",
    answer: ["1, 2, 3", "1 2 3"],
    hint: "1+2+3 = 1×2×3",
  },
  {
    question: "If you take 2 apples from 3 apples, how many do you have?",
    answer: ["2", "two"],
    hint: "You took them",
  },
  {
    question: "Which letter is silent in the word 'knight'?",
    answer: ["k"],
    hint: "Starts silent",
  },
  {
    question:
      "If a father is twice his son's age and father is 30, how old is son?",
    answer: ["15", "fifteen"],
    hint: "Divide by two",
  },
  {
    question: "Find the next: 5, 10, 20, 40, __",
    answer: ["80", "eighty"],
    hint: "Each doubles",
  },
  {
    question: "What number is 3 less than half of 20?",
    answer: ["7", "seven"],
    hint: "Half of 20 is 10",
  },
  {
    question: "What comes next: 10, 7, 4, 1, __?",
    answer: ["-2", "minus 2", "negative 2"],
    hint: "Subtract 3 each time",
  },
  {
    question:
      "A word I know — six letters it contains — remove one letter and 12 remains. What is it?",
    answer: ["dozens"],
    hint: "12 = dozen(s)",
  },
  {
    question: "Which weighs more: a pound of iron or a pound of cotton?",
    answer: ["they weigh the same", "same"],
    hint: "Both one pound",
  },
  {
    question: "What tool do you use to cut paper?",
    answer: ["scissors"],
    hint: "Two blades",
  },
  {
    question: "What English word has 3 consecutive double letters?",
    answer: ["bookkeeper", "bookkeeping"],
    hint: "Occupation record keeper",
  },
  {
    question: "If a train travels 60 km in 1 hour, how far in 30 minutes?",
    answer: ["30 km", "30"],
    hint: "Half the time",
  },
  {
    question:
      "What is the digital root of 987 (sum digits repeatedly until one digit)?",
    answer: ["6"],
    hint: "9+8+7=24 -> 2+4=6",
  },
  {
    question: "If you divide 30 by 1/2 and add 10, what do you get?",
    answer: ["70"],
    hint: "30 ÷ 0.5 = 60",
  },
  {
    question: "I have keys but no locks, space but no room — what am I?",
    answer: ["keyboard"],
    hint: "Computer input",
  },
  {
    question: "What can travel around the world while staying in a corner?",
    answer: ["stamp"],
    hint: "Postage",
  },
  {
    question: "Which word is spelled the same forward and backward?",
    answer: ["level", "racecar", "madam"],
    hint: "Palindrome",
  },
  {
    question: "What is next: 1, 2, 4, 7, 11, __?",
    answer: ["16", "sixteen"],
    hint: "Add 1,2,3,4,5...",
  },
  {
    question: "What has a brain but no heart?",
    answer: ["computer", "pc", "laptop"],
    hint: "It processes information",
  },
  {
    question: "What has keys but can't open locks?",
    answer: ["keyboard", "piano"],
    hint: "Input device or instrument",
  },
  {
    question: "What is 5 + 5?",
    answer: ["10", "ten"],
    hint: "Basic addition",
  },
  {
    question: "What is 2 × 3?",
    answer: ["6", "six"],
    hint: "Simple multiplication",
  },
  {
    question: "What comes after Monday?",
    answer: ["tuesday"],
    hint: "Second day of the work week",
  },
  {
    question: "What is the first letter of 'Technology'?",
    answer: ["t"],
    hint: "First character",
  },
  {
    question: "What is 10 - 7?",
    answer: ["3", "three"],
    hint: "Subtraction",
  },
  {
    question: "What number comes before 10?",
    answer: ["9", "nine"],
    hint: "One less than ten",
  },
  {
    question: "What letter comes after A in the alphabet?",
    answer: ["b"],
    hint: "Second letter",
  },
  {
    question: "What is 8 ÷ 2?",
    answer: ["4", "four"],
    hint: "Division",
  },
  {
    question: "What number comes between 4 and 6?",
    answer: ["5", "five"],
    hint: "Middle number",
  },
  {
    question: "What is 3 + 7?",
    answer: ["10", "ten"],
    hint: "Addition to ten",
  },
  {
    question: "What is the first month of the year?",
    answer: ["january", "jan"],
    hint: "New Year's month",
  },
  {
    question: "What is 12 ÷ 4?",
    answer: ["3", "three"],
    hint: "Division",
  },
  {
    question: "What is 6 × 2?",
    answer: ["12", "twelve"],
    hint: "Multiplication",
  },
];

// Medium Level Questions (50 questions)
const mediumQuestions = [
  {
    question: "What 5-letter word becomes shorter when you add two letters?",
    answer: ["short"],
    hint: "Add 'er' to make it",
  },
  {
    question: "What comes next: 2, 4, 8, 16, __?",
    answer: ["32", "thirty two"],
    hint: "Powers of 2",
  },
  {
    question: "What is the binary representation of 2?",
    answer: ["10"],
    hint: "Two in binary",
  },
  {
    question: "What comes next: 1, 1, 2, 3, 5, __?",
    answer: ["8", "eight"],
    hint: "Fibonacci sequence",
  },
  {
    question: "What is the output of: 10 + 5 × 2?",
    answer: ["20", "twenty"],
    hint: "Order of operations",
  },
  {
    question: "What is 15% of 100?",
    answer: ["15", "fifteen"],
    hint: "Percentage calculation",
  },
  {
    question: "What is the square of 6?",
    answer: ["36", "thirty six"],
    hint: "6 × 6",
  },
  {
    question: "What comes next: A, C, E, G, __?",
    answer: ["i"],
    hint: "Skip one letter",
  },
  {
    question: "If today is Friday, what day is it after 10 days?",
    answer: ["monday"],
    hint: "Count forward",
  },
  {
    question: "What is the binary of 5?",
    answer: ["101"],
    hint: "4 + 1 in binary",
  },
  {
    question: "What is 3² + 4²?",
    answer: ["25", "twenty five"],
    hint: "9 + 16",
  },
  {
    question: "What number is missing: 3, 6, 9, __, 15?",
    answer: ["12", "twelve"],
    hint: "Multiples of 3",
  },
  {
    question: "What comes next: 100, 90, 80, __?",
    answer: ["70", "seventy"],
    hint: "Decrease by 10",
  },
  {
    question: "How many bits in a byte?",
    answer: ["8", "eight"],
    hint: "Standard byte size",
  },
  {
    question: "What is the output of: 12 ÷ 4 × 2?",
    answer: ["6", "six"],
    hint: "Left to right",
  },
  {
    question: "What is the next prime after 7?",
    answer: ["11", "eleven"],
    hint: "Prime number",
  },
  {
    question: "What comes next: 1, 4, 9, 16, __?",
    answer: ["25", "twenty five"],
    hint: "Perfect squares",
  },
  {
    question: "How many sides does a hexagon have?",
    answer: ["6", "six"],
    hint: "Hex means six",
  },
  {
    question: "If 'console.log(2 + \"2\")' in JavaScript, output is?",
    answer: ["22"],
    hint: "String concatenation",
  },
  {
    question: "What is the value of: 2⁴?",
    answer: ["16", "sixteen"],
    hint: "2 to the power of 4",
  },
  {
    question: "What comes next: Sun, Mon, Tue, __?",
    answer: ["wed", "wednesday"],
    hint: "Days of week",
  },
  {
    question: "What is the binary of 10?",
    answer: ["1010"],
    hint: "8 + 2 in binary",
  },
  {
    question: "What is 7! (factorial)?",
    answer: ["5040"],
    hint: "7 × 6 × 5 × 4 × 3 × 2 × 1",
  },
  {
    question: "What number is missing: 8, 16, __, 64?",
    answer: ["32", "thirty two"],
    hint: "Doubling",
  },
  {
    question: "What is the hex code for white?",
    answer: ["#ffffff", "ffffff", "#fff", "fff"],
    hint: "All F's",
  },
  {
    question: "What comes next: 2, 3, 5, 7, 11, __?",
    answer: ["13", "thirteen"],
    hint: "Prime numbers",
  },
  {
    question: "If A=1, B=2, what is Z?",
    answer: ["26", "twenty six"],
    hint: "26th letter",
  },
  {
    question: "What is the square root of 144?",
    answer: ["12", "twelve"],
    hint: "Perfect square",
  },
  {
    question: "What is 8 + 7 - 5?",
    answer: ["10", "ten"],
    hint: "Simple arithmetic",
  },
  {
    question: "What comes first alphabetically: 'array' or 'apple'?",
    answer: ["apple"],
    hint: "Second letter comparison",
  },
  {
    question: "What is the Boolean value of empty string in JavaScript?",
    answer: ["false"],
    hint: "Falsy value",
  },
  {
    question: "What is 25% of 80?",
    answer: ["20", "twenty"],
    hint: "Quarter of 80",
  },
  {
    question: "What is the binary of 7?",
    answer: ["111"],
    hint: "4 + 2 + 1",
  },
  {
    question: "What is 10² - 5²?",
    answer: ["75", "seventy five"],
    hint: "100 - 25",
  },
  {
    question: "What comes next: Jan, Mar, May, __?",
    answer: ["jul", "july"],
    hint: "Odd months",
  },
  {
    question: "What is the only even prime number?",
    answer: ["2", "two"],
    hint: "Smallest prime",
  },
  {
    question: "What is 3 × 3 × 3?",
    answer: ["27", "twenty seven"],
    hint: "3 cubed",
  },
  {
    question: "If 'typeof null' in JavaScript, what is returned?",
    answer: ["object"],
    hint: "JavaScript quirk",
  },
  {
    question: "What is the hex code for black?",
    answer: ["#000000", "000000", "#000", "000"],
    hint: "All zeros",
  },
  {
    question: "What comes next: 5, 10, 20, 40, __?",
    answer: ["80", "eighty"],
    hint: "Doubling",
  },
  {
    question: "What is 50 ÷ 2 + 5?",
    answer: ["30", "thirty"],
    hint: "Division first",
  },
  {
    question: "What is the binary of 15?",
    answer: ["1111"],
    hint: "8 + 4 + 2 + 1",
  },
  {
    question: "What is 12 × 12?",
    answer: ["144", "one hundred forty four"],
    hint: "Dozen squared",
  },
  {
    question: "What comes next: A, B, D, E, G, H, __?",
    answer: ["j"],
    hint: "Skip C, F, I",
  },
  {
    question: "What is 2 + 3 × 4?",
    answer: ["14", "fourteen"],
    hint: "Multiplication first",
  },
  {
    question: "If A=1, B=2, what is 'CAB' in numbers?",
    answer: ["312"],
    hint: "C=3, A=1, B=2",
  },
  {
    question: "What is the square root of 81?",
    answer: ["9", "nine"],
    hint: "Perfect square",
  },
  {
    question: "What is 20% of 50?",
    answer: ["10", "ten"],
    hint: "Fifth of 50",
  },
  {
    question:
      "If A=1, B=2, ..., Z=26. What is the sum of the letters in 'CAB'?",
    answer: ["6", "six"],
    hint: "C=3, A=1, B=2",
  },
  {
    question: "Find the next number: 4, 9, 16, 25, __",
    answer: ["36", "thirty six"],
    hint: "Perfect squares",
  },
];

// Hard Level Questions (50 questions)
const hardQuestions = [
  {
    question:
      "What comes once in a minute, twice in a moment, but never in a thousand years?",
    answer: ["m"],
    hint: "Letter appears in those words",
  },
  {
    question: "What comes next: 1, 4, 9, 16, 25, __?",
    answer: ["36", "thirty six"],
    hint: "6 squared",
  },
  {
    question: "If 2² + 3² = 13, what is 4² + 5²?",
    answer: ["41", "forty one"],
    hint: "16 + 25",
  },
  {
    question: "What is the binary of 255?",
    answer: ["11111111"],
    hint: "Eight 1's",
  },
  {
    question: "What comes next: 2, 3, 5, 7, 11, 13, __?",
    answer: ["17", "seventeen"],
    hint: "Next prime",
  },
  {
    question: "What is the square root of 256?",
    answer: ["16", "sixteen"],
    hint: "Perfect square",
  },
  {
    question: "What is 15! ÷ 14!?",
    answer: ["15", "fifteen"],
    hint: "Factorial division",
  },
  {
    question: "If f(x) = 2x + 3, what is f(5)?",
    answer: ["13", "thirteen"],
    hint: "2(5) + 3",
  },
  {
    question: "What is the binary of 128?",
    answer: ["10000000"],
    hint: "2^7",
  },
  {
    question: "What comes next: 1, 2, 4, 7, 11, __?",
    answer: ["16", "sixteen"],
    hint: "Add increasing numbers",
  },
  {
    question: "What is 0! (zero factorial)?",
    answer: ["1", "one"],
    hint: "Mathematical definition",
  },
  {
    question: "What is the hex value of decimal 255?",
    answer: ["ff", "#ff"],
    hint: "Maximum 8-bit value",
  },
  {
    question: "What is 2^10?",
    answer: ["1024"],
    hint: "1 kilobyte",
  },
  {
    question: "What is the octal value of decimal 8?",
    answer: ["10"],
    hint: "Base 8",
  },
  {
    question: "What comes next: 1, 8, 27, 64, __?",
    answer: ["125", "one hundred twenty five"],
    hint: "5 cubed",
  },
  {
    question: "What is the binary of 64?",
    answer: ["1000000"],
    hint: "2^6",
  },
  {
    question: "What is 3^4?",
    answer: ["81", "eighty one"],
    hint: "3 × 3 × 3 × 3",
  },
  {
    question: "What is the logarithm base 2 of 16?",
    answer: ["4", "four"],
    hint: "2^? = 16",
  },
  {
    question: "What is 100 in hexadecimal?",
    answer: ["64"],
    hint: "Decimal 100 to hex",
  },
  {
    question: "What comes next: 0, 1, 1, 2, 3, 5, 8, 13, __?",
    answer: ["21", "twenty one"],
    hint: "Fibonacci",
  },
  {
    question: "What is 5^3?",
    answer: ["125", "one hundred twenty five"],
    hint: "5 × 5 × 5",
  },
  {
    question: "What is the binary of 1024?",
    answer: ["10000000000"],
    hint: "2^10",
  },
  {
    question: "What is 2^16?",
    answer: ["65536"],
    hint: "16-bit max + 1",
  },
  {
    question: "What is the hex value of decimal 16?",
    answer: ["10"],
    hint: "Base 16",
  },
  {
    question: "What is log₁₀(1000)?",
    answer: ["3", "three"],
    hint: "10^? = 1000",
  },
  {
    question: "What is 4^4?",
    answer: ["256", "two hundred fifty six"],
    hint: "4 × 4 × 4 × 4",
  },
  {
    question: "What is the binary of 512?",
    answer: ["1000000000"],
    hint: "2^9",
  },
  {
    question: "What comes next: 1, 3, 6, 10, 15, __?",
    answer: ["21", "twenty one"],
    hint: "Triangular numbers",
  },
  {
    question: "What is 7^2?",
    answer: ["49", "forty nine"],
    hint: "Seven squared",
  },
  {
    question: "What is 2^8?",
    answer: ["256", "two hundred fifty six"],
    hint: "One byte max + 1",
  },
  {
    question: "What is the hex value of decimal 255?",
    answer: ["ff"],
    hint: "Maximum byte",
  },
  {
    question: "What is 12^2?",
    answer: ["144", "one hundred forty four"],
    hint: "Dozen squared",
  },
  {
    question: "What comes next: 2, 6, 12, 20, 30, __?",
    answer: ["42", "forty two"],
    hint: "n(n+1)",
  },
  {
    question: "What is 2^20?",
    answer: ["1048576"],
    hint: "1 megabyte",
  },
  {
    question: "What is the octal value of decimal 64?",
    answer: ["100"],
    hint: "Base 8",
  },
  {
    question: "What is 11^2?",
    answer: ["121", "one hundred twenty one"],
    hint: "Eleven squared",
  },
  {
    question: "What is the binary of 127?",
    answer: ["1111111"],
    hint: "2^7 - 1",
  },
  {
    question: "What is 13^2?",
    answer: ["169", "one hundred sixty nine"],
    hint: "Thirteen squared",
  },
  {
    question: "What comes next: 1, 2, 4, 8, 16, 32, __?",
    answer: ["64", "sixty four"],
    hint: "Powers of 2",
  },
  {
    question: "Given: A×B = 12 and A+B = 7. Find A and B (real numbers).",
    answer: ["3 and 4", "3,4", "4,3"],
    hint: "Solve quadratic",
  },
  {
    question: "What is the 10th Fibonacci number (starting 1,1,...)?",
    answer: ["55"],
    hint: "1,1,2,3,5,8,13,21,34,55",
  },
  {
    question: "How many 0's at end of 100! (factorial)?",
    answer: ["24"],
    hint: "Count factors of 5",
  },
  {
    question: "If a graph has 10 vertices and is complete, how many edges?",
    answer: ["45"],
    hint: "n(n-1)/2",
  },
  {
    question: "What's the largest prime factor of 13195?",
    answer: ["29"],
    hint: "Classic factorization",
  },
  {
    question: "In how many ways can you choose 3 people from 10?",
    answer: ["120"],
    hint: "C(10,3)=120",
  },
  {
    question: "What is the area of an equilateral triangle with side length 2?",
    answer: ["sqrt(3)", "√3", "1.732"],
    hint: "Formula: (√3/4)*side^2",
  },
  {
    question: "How many edges does a dodecahedron have?",
    answer: ["30"],
    hint: "Platonic solid property",
  },
  {
    question:
      "What is the smallest positive integer that leaves remainders 1,2,3,4,5 when divided by 2,3,4,5,6 respectively?",
    answer: ["59"],
    hint: "Chinese Remainder Theorem",
  },
  {
    question: "How many derangements (no fixed points) of 4 items?",
    answer: ["9"],
    hint: "!4 = 9",
  },
  {
    question: "What is 10! (factorial)?",
    answer: ["3628800"],
    hint: "10×9×8×7×6×5×4×3×2×1",
  },
];

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get question bank for a difficulty level
 */
function getQuestionBank(difficulty) {
  switch (difficulty) {
    case "Easy":
      return easyQuestions;
    case "Medium":
      return mediumQuestions;
    case "Hard":
      return hardQuestions;
    default:
      return easyQuestions;
  }
}

/**
 * Check if answer matches (handles arrays of acceptable answers)
 */
export function checkAnswer(userAnswer, correctAnswers) {
  const normalized = String(userAnswer ?? "")
    .toLowerCase()
    .trim();

  const answers = Array.isArray(correctAnswers)
    ? correctAnswers
    : [correctAnswers];

  return answers.some((ans) =>
    String(ans ?? "")
      .toLowerCase()
      .trim() === normalized,
  );
}

/**
 * Generate a single question for a level
 * @param {string} difficulty - Easy, Medium, or Hard
 * @param {number} levelNumber - Current level number (1-based)
 * @param {number} totalLevels - Total number of levels
 * @param {Array} existingQuestions - Already generated questions
 * @returns {Object} Question object
 */
export async function generateQuestion(
  difficulty,
  levelNumber,
  totalLevels = 5,
  existingQuestions = [],
) {
  const questionBank = getQuestionBank(difficulty);
  const shuffledBank = shuffleArray(questionBank);

  // Get questions that haven't been used yet
  const usedQuestions = existingQuestions.map((q) => q.question.toLowerCase());
  const availableQuestions = shuffledBank.filter(
    (q) => !usedQuestions.includes(q.question.toLowerCase()),
  );

  // If we've used all questions, start over with shuffled bank
  const questionsToUse =
    availableQuestions.length > 0 ? availableQuestions : shuffledBank;

  // Select a random question from available
  const randomIndex = Math.floor(Math.random() * questionsToUse.length);
  const selectedQuestion = questionsToUse[randomIndex];

  return {
    question: selectedQuestion.question,
    answer: selectedQuestion.answer,
    hint: selectedQuestion.hint,
    levelNumber,
  };
}

/**
 * Pre-generate all questions for a game session
 * @param {string} difficulty - Game difficulty
 * @param {number} totalLevels - Total number of levels
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateAllQuestions(difficulty, totalLevels) {
  const questions = [];
  const questionBank = getQuestionBank(difficulty);

  // Shuffle the entire question bank
  const shuffledBank = shuffleArray(questionBank);

  // Select unique questions for each level
  for (let i = 0; i < totalLevels; i++) {
    // Use modulo to cycle through if we need more questions than available
    const questionIndex = i % shuffledBank.length;
    const selectedQuestion = shuffledBank[questionIndex];

    questions.push({
      question: selectedQuestion.question,
      answer: selectedQuestion.answer,
      hint: selectedQuestion.hint,
      levelNumber: i + 1,
    });
  }

  // Shuffle the final questions array to randomize level order
  return shuffleArray(questions).map((q, idx) => ({
    ...q,
    levelNumber: idx + 1,
  }));
}
