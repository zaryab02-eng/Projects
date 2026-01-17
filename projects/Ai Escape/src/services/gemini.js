/**
 * Question Bank - Static questions for each difficulty level
 * Questions are shuffled each time to ensure variety
 */

// Easy Level Questions (50 questions)
const easyQuestions = [
  { question: "What has a brain but no heart?", answer: "computer", hint: "It processes information" },
  { question: "Type the opposite of \"OFF\".", answer: "on", hint: "Opposite of off" },
  { question: "What comes after 3 in the sequence 1, 2, 3, __?", answer: "4", hint: "Next number in sequence" },
  { question: "Unscramble: **IA**", answer: "ai", hint: "Artificial Intelligence" },
  { question: "What color do you get by mixing black and white?", answer: "gray", hint: "Mix of black and white" },
  { question: "What has keys but can't open locks?", answer: "keyboard", hint: "Computer input device" },
  { question: "Complete this word: C _ D E", answer: "code", hint: "Programming code" },
  { question: "What number comes before 10?", answer: "9", hint: "One less than ten" },
  { question: "What device do you use to click on a computer?", answer: "mouse", hint: "Computer pointing device" },
  { question: "What runs but never walks?", answer: "river", hint: "Flowing water" },
  { question: "Binary for number 1 is?", answer: "1", hint: "Binary representation" },
  { question: "What day comes after Monday?", answer: "tuesday", hint: "Second day of week" },
  { question: "What has a screen and a keyboard?", answer: "computer", hint: "Electronic device" },
  { question: "Unscramble: **RCOMPTUE**", answer: "computer", hint: "Rearrange the letters" },
  { question: "What is 5 + 5?", answer: "10", hint: "Simple addition" },
  { question: "What letter comes after A?", answer: "b", hint: "Next letter in alphabet" },
  { question: "What is the shape with 3 sides?", answer: "triangle", hint: "Three-sided polygon" },
  { question: "What is the color of the sky on a clear day?", answer: "blue", hint: "Sky color" },
  { question: "What does CPU stand for? (short form acceptable)", answer: "cpu", hint: "Central Processing Unit" },
  { question: "What comes first: Login or Logout?", answer: "login", hint: "Which happens first?" },
  { question: "How many eyes does a human normally have?", answer: "2", hint: "Standard human eyes" },
  { question: "What symbol is used in email?", answer: "@", hint: "Email symbol" },
  { question: "What is the first month of the year?", answer: "january", hint: "First month" },
  { question: "What has a face and two hands but no arms or legs?", answer: "clock", hint: "Time telling device" },
  { question: "What number is even: 3 or 4?", answer: "4", hint: "Divisible by 2" },
  { question: "What do you press to enter text on a new line?", answer: "enter", hint: "Keyboard key" },
  { question: "What is the opposite of \"OPEN\"?", answer: "close", hint: "Opposite action" },
  { question: "What animal says \"meow\"?", answer: "cat", hint: "Meowing animal" },
  { question: "What is the color of stop sign?", answer: "red", hint: "Stop sign color" },
  { question: "How many seconds are in one minute?", answer: "60", hint: "Time conversion" },
  { question: "What comes after Z in alphabets?", answer: "nothing", hint: "Last letter" },
  { question: "What device shows output of computer?", answer: "monitor", hint: "Display screen" },
  { question: "What is 2 × 3?", answer: "6", hint: "Multiplication" },
  { question: "What has wheels and moves on roads?", answer: "car", hint: "Vehicle" },
  { question: "What is the password if hint is \"same as answer\" and question is \"Type YES\"?", answer: "yes", hint: "Type the word" },
  { question: "What is the first letter of \"Escape\"?", answer: "e", hint: "First character" },
  { question: "Which is faster: snail or cheetah?", answer: "cheetah", hint: "Fastest animal" },
  { question: "What number comes between 4 and 6?", answer: "5", hint: "Middle number" },
  { question: "What do you call a place where files are stored on computer?", answer: "folder", hint: "File storage" },
  { question: "What is the color of grass?", answer: "green", hint: "Grass color" },
  { question: "What does WiFi give you?", answer: "internet", hint: "Wireless connection" },
  { question: "What comes after login success? (hint: dashboard/home)", answer: "dashboard", hint: "After login page" },
  { question: "What is 10 – 7?", answer: "3", hint: "Subtraction" },
  { question: "What device listens to your voice?", answer: "microphone", hint: "Voice input device" },
  { question: "What letter is missing: A B _ D", answer: "c", hint: "Alphabet sequence" },
  { question: "What is the opposite of DARK?", answer: "light", hint: "Opposite of dark" },
  { question: "What do you click to submit a form?", answer: "submit", hint: "Form button" },
  { question: "What does URL start with usually?", answer: "http", hint: "Web protocol" },
  { question: "What shape is a coin?", answer: "circle", hint: "Round shape" },
  { question: "Type the word: **ESCAPE**", answer: "escape", hint: "Type exactly as shown" },
];

// Medium Level Questions (50 questions)
const mediumQuestions = [
  { question: "I speak without a mouth and hear without ears. What am I?", answer: "echo", hint: "Sound reflection" },
  { question: "What 5-letter word becomes shorter when you add two letters?", answer: "short", hint: "Add 'er' to make shorter" },
  { question: "If you reverse \"ROOM\", what word do you get?", answer: "moor", hint: "Reverse spelling" },
  { question: "What comes next: 2, 4, 8, 16, __ ?", answer: "32", hint: "Each number doubles" },
  { question: "Unscramble: **ETPYCRNIO**", answer: "encryption", hint: "Data security" },
  { question: "What number has the same number of letters as its value?", answer: "four", hint: "4 letters = 4" },
  { question: "What can travel around the world while staying in one corner?", answer: "stamp", hint: "Postal item" },
  { question: "What is the output of: 10 + 5 × 2?", answer: "20", hint: "Order of operations" },
  { question: "If today is Friday, what day will it be after 3 days?", answer: "monday", hint: "Count forward" },
  { question: "What is the binary of number 2?", answer: "10", hint: "Binary representation" },
  { question: "Which word does not belong: keyboard, mouse, monitor, speaker?", answer: "speaker", hint: "Output vs input" },
  { question: "What comes next: A, C, E, G, __ ?", answer: "i", hint: "Skip one letter" },
  { question: "What has a lock but no key?", answer: "password", hint: "Digital security" },
  { question: "What is the full form of HTML?", answer: "html", hint: "HyperText Markup Language" },
  { question: "If a password is \"first letter of every word\": **Artificial Intelligence Escape Room** → ?", answer: "aier", hint: "First letters" },
  { question: "What comes next: 1, 1, 2, 3, 5, __ ?", answer: "8", hint: "Fibonacci sequence" },
  { question: "What disappears as soon as you say its name?", answer: "silence", hint: "Opposite of sound" },
  { question: "What is the square of 6?", answer: "36", hint: "6 × 6" },
  { question: "Unscramble: **LGOOEG**", answer: "google", hint: "Search engine" },
  { question: "What comes next: Sun → Moon → Sun → ?", answer: "moon", hint: "Alternating pattern" },
  { question: "What has hands but can't clap?", answer: "clock", hint: "Time device" },
  { question: "What is 15% of 100?", answer: "15", hint: "Percentage calculation" },
  { question: "If RED = STOP, GREEN = GO, YELLOW = ?", answer: "wait", hint: "Traffic light" },
  { question: "Which number is missing: 3, 6, 9, __ , 15", answer: "12", hint: "Multiples of 3" },
  { question: "What device stores data permanently?", answer: "harddrive", hint: "Storage device" },
  { question: "If you type `console.log(2 + \"2\")`, what is the output?", answer: "22", hint: "String concatenation" },
  { question: "What word is spelled incorrectly in every dictionary?", answer: "incorrectly", hint: "Self-referential" },
  { question: "What comes next: 100, 90, 80, __ ?", answer: "70", hint: "Decreasing by 10" },
  { question: "What has an eye but cannot see?", answer: "needle", hint: "Sewing tool" },
  { question: "What is the opposite of ENCRYPT?", answer: "decrypt", hint: "Reverse encryption" },
  { question: "Unscramble: **SAJAVTPIRC**", answer: "javascript", hint: "Programming language" },
  { question: "How many sides does a hexagon have?", answer: "6", hint: "Hex = six" },
  { question: "What comes first alphabetically: cat or car?", answer: "car", hint: "Alphabetical order" },
  { question: "If a clock shows 3:15, where is the minute hand?", answer: "3", hint: "Minute hand position" },
  { question: "What is the value of: 3² + 4²?", answer: "25", hint: "9 + 16" },
  { question: "What gets wetter the more it dries?", answer: "towel", hint: "Drying tool" },
  { question: "Which is heavier: 1kg iron or 1kg cotton?", answer: "same", hint: "Same weight" },
  { question: "What comes next: Jan, Mar, May, __ ?", answer: "jul", hint: "Odd months" },
  { question: "What does RAM stand for?", answer: "ram", hint: "Random Access Memory" },
  { question: "What is the missing letter: H _ C K E R", answer: "a", hint: "Hacker" },
  { question: "If 1 = A, 2 = B, what is 3?", answer: "c", hint: "Number to letter" },
  { question: "What is the next prime number after 7?", answer: "11", hint: "Prime numbers" },
  { question: "What has a neck but no head?", answer: "bottle", hint: "Container" },
  { question: "What is the output of: 12 ÷ 4 × 2?", answer: "6", hint: "Left to right" },
  { question: "What comes next: Left, Right, Left, Right, __ ?", answer: "left", hint: "Alternating pattern" },
  { question: "Unscramble: **TACEREST**", answer: "secret", hint: "Hidden information" },
  { question: "What key is used to refresh a browser?", answer: "f5", hint: "Function key" },
  { question: "What number is odd: 14 or 15?", answer: "15", hint: "Not divisible by 2" },
  { question: "What comes after \"sudo\"? (hint: Linux command)", answer: "sudo", hint: "Superuser do" },
  { question: "Type the word: **FIREWALL**", answer: "firewall", hint: "Network security" },
];

// Hard Level Questions (50 questions)
const hardQuestions = [
  { question: "I have cities but no houses, rivers but no water. What am I?", answer: "map", hint: "Geographic representation" },
  { question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "m", hint: "Letter frequency" },
  { question: "If you break me, I don't stop working. What am I?", answer: "code", hint: "Programming" },
  { question: "What can fill a room but takes up no space?", answer: "light", hint: "Illumination" },
  { question: "Forward I am heavy, backward I am not. What am I?", answer: "ton", hint: "Weight unit" },
  { question: "I have keys but no locks, space but no room. What am I?", answer: "keyboard", hint: "Computer input" },
  { question: "What runs but never walks, has a mouth but never talks?", answer: "river", hint: "Flowing water" },
  { question: "The more you take, the more you leave behind. What are they?", answer: "footsteps", hint: "Walking" },
  { question: "What has an eye but cannot see, yet watches everything?", answer: "camera", hint: "Recording device" },
  { question: "I shave every day, but my beard stays the same. Who am I?", answer: "barber", hint: "Hair cutting profession" },
  { question: "What comes next: 1, 4, 9, 16, __ ?", answer: "25", hint: "Square numbers" },
  { question: "If 2² + 3² = 13, what is 4² + 5²?", answer: "41", hint: "16 + 25" },
  { question: "What number is missing: 8, 16, __ , 64", answer: "32", hint: "Doubling sequence" },
  { question: "If a clock shows 6:30, what angle is between hour and minute hand?", answer: "15", hint: "Clock angle" },
  { question: "What is the only even prime number?", answer: "2", hint: "Prime numbers" },
  { question: "What comes next: 2, 3, 5, 7, __ ?", answer: "11", hint: "Prime sequence" },
  { question: "What is the square root of 144?", answer: "12", hint: "12 × 12 = 144" },
  { question: "If 5 machines take 5 minutes to make 5 items, how long for 100 machines to make 100 items?", answer: "5", hint: "Same time" },
  { question: "What is the next number: 21, 18, 15, __ ?", answer: "12", hint: "Decreasing by 3" },
  { question: "If X = 10 and V = 5, what is XV?", answer: "15", hint: "Roman numerals" },
  { question: "What does HTTP stand for?", answer: "http", hint: "HyperText Transfer Protocol" },
  { question: "Which port number is used for HTTPS?", answer: "443", hint: "Secure web port" },
  { question: "What is the output of: `Boolean(\"false\")` in JavaScript?", answer: "true", hint: "Non-empty string" },
  { question: "Which data structure uses FIFO?", answer: "queue", hint: "First In First Out" },
  { question: "What command is used to list files in Linux?", answer: "ls", hint: "List command" },
  { question: "What does SQL injection target?", answer: "database", hint: "Database attack" },
  { question: "What is the default branch name in Git now?", answer: "main", hint: "Git branch" },
  { question: "What does DNS do?", answer: "dns", hint: "Domain Name System" },
  { question: "What does `===` check that `==` does not?", answer: "type", hint: "Strict equality" },
  { question: "What is the purpose of a firewall?", answer: "security", hint: "Network protection" },
  { question: "If A=1, B=2, C=3… what is CAB?", answer: "312", hint: "Letter to number" },
  { question: "Decode: 3-1-20", answer: "cat", hint: "A=1, B=2, C=3..." },
  { question: "If the password is the reverse of \"SECURE\", what is it?", answer: "eruces", hint: "Reverse spelling" },
  { question: "What word appears the same upside down (in digital style)?", answer: "swims", hint: "Upside down word" },
  { question: "If \"LOCK\" becomes \"MPDL\", what is the pattern?", answer: "next", hint: "Each letter +1" },
  { question: "Crack the code: 2, 4, 6 → A, B, C → ?", answer: "d", hint: "Pattern continuation" },
  { question: "If today is Sunday, what day will it be after 23 days?", answer: "tuesday", hint: "23 mod 7 = 2" },
  { question: "What 4-letter word can be written forward, backward, or upside down?", answer: "noon", hint: "Palindrome" },
  { question: "Which number looks the same when rotated 180°?", answer: "6", hint: "Or 9" },
  { question: "What is the binary of number 5?", answer: "101", hint: "Binary conversion" },
  { question: "I am always in front of you but can't be seen. What am I?", answer: "future", hint: "Time concept" },
  { question: "What has no beginning, end, or middle?", answer: "circle", hint: "Geometric shape" },
  { question: "What disappears the moment you stand up?", answer: "lap", hint: "Body part" },
  { question: "What word contains all vowels once?", answer: "eunoia", hint: "All vowels" },
  { question: "What breaks but never falls, and falls but never breaks?", answer: "day", hint: "Time concept" },
  { question: "If RED = 3, BLUE = 4, what is GREEN?", answer: "5", hint: "Letter count" },
  { question: "What letter is 3rd from the end of alphabet?", answer: "x", hint: "Alphabet position" },
  { question: "Which month has 28 days?", answer: "all", hint: "All months" },
  { question: "What is the next word: LOCK → KEY → DOOR → ?", answer: "room", hint: "Sequence" },
  { question: "Type this exactly (case-sensitive): **Ai_Escape#42**", answer: "Ai_Escape#42", hint: "Exact match required" },
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
 * Generate a single question for a level
 * @param {string} difficulty - Easy, Medium, or Hard
 * @param {number} levelNumber - Current level number (1-based)
 * @param {number} totalLevels - Total number of levels
 * @param {Array} existingQuestions - Already generated questions
 * @returns {Object} Question object
 */
export async function generateQuestion(difficulty, levelNumber, totalLevels = 5, existingQuestions = []) {
  const questionBank = getQuestionBank(difficulty);
  const shuffledBank = shuffleArray(questionBank);
  
  // Get questions that haven't been used yet
  const usedQuestions = existingQuestions.map(q => q.question.toLowerCase());
  const availableQuestions = shuffledBank.filter(q => 
    !usedQuestions.includes(q.question.toLowerCase())
  );
  
  // If we've used all questions, start over with shuffled bank
  const questionsToUse = availableQuestions.length > 0 ? availableQuestions : shuffledBank;
  
  // Select a random question from available
  const randomIndex = Math.floor(Math.random() * questionsToUse.length);
  const selectedQuestion = questionsToUse[randomIndex];
  
  return {
    question: selectedQuestion.question,
    answer: selectedQuestion.answer.toLowerCase().trim(),
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
      answer: selectedQuestion.answer.toLowerCase().trim(),
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
