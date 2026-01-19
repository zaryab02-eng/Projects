// Easy Level Questions (100 questions) - Professional & Tech-Focused
const easyQuestions = [
  {
    question: "What has a brain but no heart?",
    answer: ["computer", "pc", "laptop"],
    hint: "It processes information",
  },
  {
    question: "What does CPU stand for?",
    answer: ["central processing unit", "cpu"],
    hint: "The brain of the computer",
  },
  {
    question: "What is the binary representation of 1?",
    answer: ["1"],
    hint: "Same as decimal",
  },
  {
    question: "What comes after 3 in the sequence: 1, 2, 3, __?",
    answer: ["4", "four"],
    hint: "Next number",
  },
  {
    question: "What has keys but can't open locks?",
    answer: ["keyboard", "piano"],
    hint: "Input device or instrument",
  },
  {
    question: "What does AI stand for?",
    answer: ["artificial intelligence"],
    hint: "Machine intelligence",
  },
  {
    question: "What device do you use to click on a computer?",
    answer: ["mouse"],
    hint: "Pointing device",
  },
  {
    question: "What is 5 + 5?",
    answer: ["10", "ten"],
    hint: "Basic addition",
  },
  {
    question: "Complete this word: C_DE",
    answer: ["code"],
    hint: "Programming instructions",
  },
  {
    question: "What does RAM stand for?",
    answer: ["random access memory", "ram"],
    hint: "Temporary computer memory",
  },
  {
    question: "What symbol is used in email addresses?",
    answer: ["@", "at"],
    hint: "Located between username and domain",
  },
  {
    question: "What is the opposite of 'encrypt'?",
    answer: ["decrypt"],
    hint: "Reverse the encoding",
  },
  {
    question: "What device displays computer output?",
    answer: ["monitor", "screen", "display"],
    hint: "Visual output device",
  },
  {
    question: "What is 2 × 3?",
    answer: ["6", "six"],
    hint: "Simple multiplication",
  },
  {
    question: "What does HTML stand for?",
    answer: ["hypertext markup language", "html"],
    hint: "Web page language",
  },
  {
    question: "What comes after Monday?",
    answer: ["tuesday"],
    hint: "Second day of the work week",
  },
  {
    question: "What is the binary of 0?",
    answer: ["0"],
    hint: "Same as decimal",
  },
  {
    question: "What key do you press to enter text on a new line?",
    answer: ["enter", "return"],
    hint: "Large key on right side",
  },
  {
    question: "What does URL stand for?",
    answer: ["uniform resource locator", "url"],
    hint: "Web address",
  },
  {
    question: "What is the first letter of 'Technology'?",
    answer: ["t"],
    hint: "First character",
  },
  {
    question: "What does USB stand for?",
    answer: ["universal serial bus", "usb"],
    hint: "Common connection port",
  },
  {
    question: "What is 10 - 7?",
    answer: ["3", "three"],
    hint: "Subtraction",
  },
  {
    question: "What programming language is known for web development?",
    answer: ["javascript", "html", "css"],
    hint: "Runs in browsers",
  },
  {
    question: "What does PDF stand for?",
    answer: ["portable document format", "pdf"],
    hint: "Document file type",
  },
  {
    question: "What number comes before 10?",
    answer: ["9", "nine"],
    hint: "One less than ten",
  },
  {
    question: "What does Wi-Fi provide?",
    answer: ["internet", "wireless connection", "network"],
    hint: "Wireless connectivity",
  },
  {
    question: "What is the opposite of 'input'?",
    answer: ["output"],
    hint: "Data leaving the system",
  },
  {
    question: "What does GB stand for in storage?",
    answer: ["gigabyte", "gigabytes", "gb"],
    hint: "Unit of storage",
  },
  {
    question: "What letter comes after A in the alphabet?",
    answer: ["b"],
    hint: "Second letter",
  },
  {
    question: "What does OS stand for?",
    answer: ["operating system", "os"],
    hint: "System software like Windows or macOS",
  },
  {
    question: "What is 8 ÷ 2?",
    answer: ["4", "four"],
    hint: "Division",
  },
  {
    question: "What does VPN stand for?",
    answer: ["virtual private network", "vpn"],
    hint: "Secure network connection",
  },
  {
    question: "What device captures audio input?",
    answer: ["microphone", "mic"],
    hint: "Voice input device",
  },
  {
    question: "What is the main search engine created by Google?",
    answer: ["google"],
    hint: "Same as the company name",
  },
  {
    question: "What number comes between 4 and 6?",
    answer: ["5", "five"],
    hint: "Middle number",
  },
  {
    question: "What does SSD stand for?",
    answer: ["solid state drive", "ssd"],
    hint: "Fast storage device",
  },
  {
    question:
      "What programming language starts with 'P' and is named after a snake?",
    answer: ["python"],
    hint: "Popular for AI and data science",
  },
  {
    question: "What is 3 + 7?",
    answer: ["10", "ten"],
    hint: "Addition to ten",
  },
  {
    question: "What does API stand for?",
    answer: ["application programming interface", "api"],
    hint: "Allows software to communicate",
  },
  {
    question: "What is the first month of the year?",
    answer: ["january", "jan"],
    hint: "New Year's month",
  },
  {
    question: "What does SQL stand for?",
    answer: ["structured query language", "sql"],
    hint: "Database language",
  },
  {
    question: "What is 12 ÷ 4?",
    answer: ["3", "three"],
    hint: "Division",
  },
  {
    question: "What does HTTP stand for?",
    answer: ["hypertext transfer protocol", "http"],
    hint: "Web protocol",
  },
  {
    question: "What key combination is used to copy text?",
    answer: ["ctrl+c", "ctrl c", "command+c", "command c"],
    hint: "Common keyboard shortcut",
  },
  {
    question: "What does DNS stand for?",
    answer: ["domain name system", "dns"],
    hint: "Converts domain names to IP addresses",
  },
  {
    question: "What is 6 × 2?",
    answer: ["12", "twelve"],
    hint: "Multiplication",
  },
  {
    question: "What file extension is used for JavaScript?",
    answer: [".js", "js"],
    hint: "Two letters",
  },
  {
    question: "What does CSS stand for?",
    answer: ["cascading style sheets", "css"],
    hint: "Styles web pages",
  },
  {
    question: "What is 15 - 10?",
    answer: ["5", "five"],
    hint: "Subtraction",
  },
  {
    question: "What cloud service is provided by Amazon?",
    answer: ["aws", "amazon web services"],
    hint: "Three letters: AWS",
  },
  {
    question: "What does FAQ stand for?",
    answer: ["frequently asked questions", "faq"],
    hint: "Common questions section",
  },
  {
    question: "What is 4 + 4?",
    answer: ["8", "eight"],
    hint: "Addition",
  },
  {
    question: "What programming language is known for iOS development?",
    answer: ["swift"],
    hint: "Apple's modern language",
  },
  {
    question: "What does GPU stand for?",
    answer: ["graphics processing unit", "gpu"],
    hint: "Processes graphics",
  },
  {
    question: "What is 20 ÷ 5?",
    answer: ["4", "four"],
    hint: "Division",
  },
  {
    question: "What file format is used for images with transparency?",
    answer: ["png"],
    hint: "Three letters, not JPG",
  },
  {
    question: "What does IT stand for?",
    answer: ["information technology", "it"],
    hint: "Technology department",
  },
  {
    question: "What is 7 + 8?",
    answer: ["15", "fifteen"],
    hint: "Addition",
  },
  {
    question: "What version control system is most popular?",
    answer: ["git"],
    hint: "Used with GitHub",
  },
  {
    question: "What does IoT stand for?",
    answer: ["internet of things", "iot"],
    hint: "Connected devices",
  },
  {
    question: "What is 9 × 1?",
    answer: ["9", "nine"],
    hint: "Multiply by one",
  },
  {
    question: "What programming language is known for Android development?",
    answer: ["java", "kotlin"],
    hint: "Coffee-related or modern alternative",
  },
  {
    question: "What does LAN stand for?",
    answer: ["local area network", "lan"],
    hint: "Local network",
  },
  {
    question: "What is 100 ÷ 10?",
    answer: ["10", "ten"],
    hint: "Division",
  },
  {
    question: "What does UI stand for?",
    answer: ["user interface", "ui"],
    hint: "Visual design",
  },
  {
    question: "What key refreshes a browser page?",
    answer: ["f5"],
    hint: "Function key",
  },
  {
    question: "What does UX stand for?",
    answer: ["user experience", "ux"],
    hint: "How users interact",
  },
  {
    question: "What is 5 × 5?",
    answer: ["25", "twenty five"],
    hint: "Five squared",
  },
  {
    question: "What protocol is used for secure websites?",
    answer: ["https"],
    hint: "Secure HTTP",
  },
  {
    question: "What does CMS stand for?",
    answer: ["content management system", "cms"],
    hint: "Manages website content",
  },
  {
    question: "What is 18 - 9?",
    answer: ["9", "nine"],
    hint: "Subtraction to nine",
  },
  {
    question: "What database is known for being 'NoSQL'?",
    answer: ["mongodb", "mongo"],
    hint: "Document-based database",
  },
  {
    question: "What does SEO stand for?",
    answer: ["search engine optimization", "seo"],
    hint: "Improves search rankings",
  },
  {
    question: "What is 3 × 4?",
    answer: ["12", "twelve"],
    hint: "Multiplication",
  },
  {
    question: "What cloud platform is provided by Google?",
    answer: ["gcp", "google cloud platform", "google cloud"],
    hint: "Google's cloud service",
  },
  {
    question: "What does IDE stand for?",
    answer: ["integrated development environment", "ide"],
    hint: "Code editor environment",
  },
  {
    question: "What is 16 ÷ 4?",
    answer: ["4", "four"],
    hint: "Division",
  },
  {
    question: "What markup language is used for documentation?",
    answer: ["markdown"],
    hint: "Simple text formatting",
  },
  {
    question: "What does SDK stand for?",
    answer: ["software development kit", "sdk"],
    hint: "Development tools package",
  },
  {
    question: "What is 11 - 6?",
    answer: ["5", "five"],
    hint: "Subtraction",
  },
  {
    question: "What JavaScript framework is maintained by Facebook?",
    answer: ["react"],
    hint: "Component-based library",
  },
  {
    question: "What does FTP stand for?",
    answer: ["file transfer protocol", "ftp"],
    hint: "File transfer method",
  },
  {
    question: "What is 7 × 3?",
    answer: ["21", "twenty one"],
    hint: "Multiplication",
  },
  {
    question: "What does ML stand for in tech?",
    answer: ["machine learning", "ml"],
    hint: "AI subset",
  },
  {
    question: "What command lists files in Linux/Unix?",
    answer: ["ls"],
    hint: "Two letters",
  },
  {
    question: "What is 14 + 6?",
    answer: ["20", "twenty"],
    hint: "Addition to twenty",
  },
  {
    question: "What does CLI stand for?",
    answer: ["command line interface", "cli"],
    hint: "Text-based interface",
  },
  {
    question: "What language is used for styling web pages?",
    answer: ["css"],
    hint: "Works with HTML",
  },
  {
    question: "What is 30 ÷ 6?",
    answer: ["5", "five"],
    hint: "Division",
  },
  {
    question: "What does REST stand for in APIs?",
    answer: ["representational state transfer", "rest"],
    hint: "API architecture",
  },
  {
    question: "What key combination pastes copied text?",
    answer: ["ctrl+v", "ctrl v", "command+v", "command v"],
    hint: "Common keyboard shortcut",
  },
  {
    question: "What is 8 × 8?",
    answer: ["64", "sixty four"],
    hint: "Eight squared",
  },
  {
    question: "What does JSON stand for?",
    answer: ["javascript object notation", "json"],
    hint: "Data format",
  },
  {
    question: "What is the port number for HTTP?",
    answer: ["80"],
    hint: "Default web port",
  },
  {
    question: "What does CRUD stand for in databases?",
    answer: ["create read update delete", "crud"],
    hint: "Basic database operations",
  },
  {
    question: "What is 9 + 9?",
    answer: ["18", "eighteen"],
    hint: "Double nine",
  },
  {
    question: "What framework is known for rapid Python web development?",
    answer: ["django", "flask"],
    hint: "Popular Python web frameworks",
  },
  {
    question: "What does XML stand for?",
    answer: ["extensible markup language", "xml"],
    hint: "Markup language for data",
  },
];

// Medium Level Questions (100 questions) - Enhanced Professional Content
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
    question: "What data structure uses LIFO?",
    answer: ["stack"],
    hint: "Last In First Out",
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
    question: "What port is used for HTTPS?",
    answer: ["443"],
    hint: "Secure web port",
  },
  {
    question: "What database query language is most common?",
    answer: ["sql"],
    hint: "Structured Query Language",
  },
  {
    question: "What is 15% of 100?",
    answer: ["15", "fifteen"],
    hint: "Percentage calculation",
  },
  {
    question: "What does MVC stand for?",
    answer: ["model view controller", "mvc"],
    hint: "Design pattern",
  },
  {
    question: "What is the square of 6?",
    answer: ["36", "thirty six"],
    hint: "6 × 6",
  },
  {
    question: "What HTTP method is used to retrieve data?",
    answer: ["get"],
    hint: "Request method",
  },
  {
    question: "What comes next: A, C, E, G, __?",
    answer: ["i"],
    hint: "Skip one letter",
  },
  {
    question: "What is the time complexity of binary search?",
    answer: ["o(log n)", "log n", "logarithmic"],
    hint: "Better than linear",
  },
  {
    question: "What does OOP stand for?",
    answer: ["object oriented programming", "oop"],
    hint: "Programming paradigm",
  },
  {
    question: "If today is Friday, what day is it after 10 days?",
    answer: ["monday"],
    hint: "Count forward",
  },
  {
    question: "What protocol does email use for sending?",
    answer: ["smtp"],
    hint: "Simple Mail Transfer Protocol",
  },
  {
    question: "What is the binary of 5?",
    answer: ["101"],
    hint: "4 + 1 in binary",
  },
  {
    question: "What data structure uses FIFO?",
    answer: ["queue"],
    hint: "First In First Out",
  },
  {
    question: "What is 3² + 4²?",
    answer: ["25", "twenty five"],
    hint: "9 + 16",
  },
  {
    question: "What does CI/CD stand for?",
    answer: ["continuous integration continuous deployment", "ci cd"],
    hint: "DevOps practice",
  },
  {
    question: "What number is missing: 3, 6, 9, __, 15?",
    answer: ["12", "twelve"],
    hint: "Multiples of 3",
  },
  {
    question: "What command shows current directory in Linux?",
    answer: ["pwd"],
    hint: "Print working directory",
  },
  {
    question: "What comes next: 100, 90, 80, __?",
    answer: ["70", "seventy"],
    hint: "Decrease by 10",
  },
  {
    question: "What does NPM stand for?",
    answer: ["node package manager", "npm"],
    hint: "JavaScript package manager",
  },
  {
    question: "How many bits in a byte?",
    answer: ["8", "eight"],
    hint: "Standard byte size",
  },
  {
    question: "What is the default HTTP method for form submission?",
    answer: ["post"],
    hint: "Sends data to server",
  },
  {
    question: "What is the output of: 12 ÷ 4 × 2?",
    answer: ["6", "six"],
    hint: "Left to right",
  },
  {
    question: "What does JWT stand for?",
    answer: ["json web token", "jwt"],
    hint: "Authentication token",
  },
  {
    question: "What is the next prime after 7?",
    answer: ["11", "eleven"],
    hint: "Prime number",
  },
  {
    question: "What HTTP status code means 'Not Found'?",
    answer: ["404"],
    hint: "Common error code",
  },
  {
    question: "What comes next: 1, 4, 9, 16, __?",
    answer: ["25", "twenty five"],
    hint: "Perfect squares",
  },
  {
    question: "What does AJAX stand for?",
    answer: ["asynchronous javascript and xml", "ajax"],
    hint: "Web technique",
  },
  {
    question: "How many sides does a hexagon have?",
    answer: ["6", "six"],
    hint: "Hex means six",
  },
  {
    question: "What command creates a new Git repository?",
    answer: ["git init"],
    hint: "Initialize Git",
  },
  {
    question: "If 'console.log(2 + \"2\")' in JavaScript, output is?",
    answer: ["22"],
    hint: "String concatenation",
  },
  {
    question: "What does SSH stand for?",
    answer: ["secure shell", "ssh"],
    hint: "Secure remote access",
  },
  {
    question: "What is the value of: 2⁴?",
    answer: ["16", "sixteen"],
    hint: "2 to the power of 4",
  },
  {
    question: "What framework is known for building SPAs?",
    answer: ["react", "angular", "vue"],
    hint: "Single Page Applications",
  },
  {
    question: "What comes next: Sun, Mon, Tue, __?",
    answer: ["wed", "wednesday"],
    hint: "Days of week",
  },
  {
    question: "What does SOAP stand for?",
    answer: ["simple object access protocol", "soap"],
    hint: "Web service protocol",
  },
  {
    question: "What is the binary of 10?",
    answer: ["1010"],
    hint: "8 + 2 in binary",
  },
  {
    question: "What Linux command runs with superuser privileges?",
    answer: ["sudo"],
    hint: "Superuser do",
  },
  {
    question: "What is 7! (factorial)?",
    answer: ["5040"],
    hint: "7 × 6 × 5 × 4 × 3 × 2 × 1",
  },
  {
    question: "What does CDN stand for?",
    answer: ["content delivery network", "cdn"],
    hint: "Distributed server network",
  },
  {
    question: "What number is missing: 8, 16, __, 64?",
    answer: ["32", "thirty two"],
    hint: "Doubling",
  },
  {
    question: "What is the default branch in Git?",
    answer: ["main", "master"],
    hint: "Primary branch",
  },
  {
    question: "What is the hex code for white?",
    answer: ["#ffffff", "ffffff", "#fff", "fff"],
    hint: "All F's",
  },
  {
    question: "What does SaaS stand for?",
    answer: ["software as a service", "saas"],
    hint: "Cloud software model",
  },
  {
    question: "What comes next: 2, 3, 5, 7, 11, __?",
    answer: ["13", "thirteen"],
    hint: "Prime numbers",
  },
  {
    question: "What HTTP status code means 'OK'?",
    answer: ["200"],
    hint: "Success code",
  },
  {
    question: "If A=1, B=2, what is Z?",
    answer: ["26", "twenty six"],
    hint: "26th letter",
  },
  {
    question: "What does CRUD stand for?",
    answer: ["create read update delete", "crud"],
    hint: "Database operations",
  },
  {
    question: "What is the square root of 144?",
    answer: ["12", "twelve"],
    hint: "Perfect square",
  },
  {
    question: "What command stages files in Git?",
    answer: ["git add"],
    hint: "Prepare for commit",
  },
  {
    question: "What is 8 + 7 - 5?",
    answer: ["10", "ten"],
    hint: "Simple arithmetic",
  },
  {
    question: "What does TDD stand for?",
    answer: ["test driven development", "tdd"],
    hint: "Testing methodology",
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
    question: "What does NoSQL stand for?",
    answer: ["not only sql", "nosql"],
    hint: "Database type",
  },
  {
    question: "What is 25% of 80?",
    answer: ["20", "twenty"],
    hint: "Quarter of 80",
  },
  {
    question: "What HTTP method updates a resource?",
    answer: ["put", "patch"],
    hint: "Update methods",
  },
  {
    question: "What is the binary of 7?",
    answer: ["111"],
    hint: "4 + 2 + 1",
  },
  {
    question: "What does YAML stand for?",
    answer: [
      "yaml ain't markup language",
      "yaml",
      "yet another markup language",
    ],
    hint: "Configuration format",
  },
  {
    question: "What is 10² - 5²?",
    answer: ["75", "seventy five"],
    hint: "100 - 25",
  },
  {
    question: "What command shows Git commit history?",
    answer: ["git log"],
    hint: "View commits",
  },
  {
    question: "What comes next: Jan, Mar, May, __?",
    answer: ["jul", "july"],
    hint: "Odd months",
  },
  {
    question: "What does WYSIWYG stand for?",
    answer: ["what you see is what you get", "wysiwyg"],
    hint: "Editor type",
  },
  {
    question: "What is the only even prime number?",
    answer: ["2", "two"],
    hint: "Smallest prime",
  },
  {
    question: "What HTTP status code means 'Unauthorized'?",
    answer: ["401"],
    hint: "Auth error",
  },
  {
    question: "What is 3 × 3 × 3?",
    answer: ["27", "twenty seven"],
    hint: "3 cubed",
  },
  {
    question: "What does DOM stand for?",
    answer: ["document object model", "dom"],
    hint: "Browser document structure",
  },
  {
    question: "If 'typeof null' in JavaScript, what is returned?",
    answer: ["object"],
    hint: "JavaScript quirk",
  },
  {
    question: "What command commits changes in Git?",
    answer: ["git commit"],
    hint: "Save changes",
  },
  {
    question: "What is the hex code for black?",
    answer: ["#000000", "000000", "#000", "000"],
    hint: "All zeros",
  },
  {
    question: "What does CORS stand for?",
    answer: ["cross origin resource sharing", "cors"],
    hint: "Browser security",
  },
  {
    question: "What comes next: 5, 10, 20, 40, __?",
    answer: ["80", "eighty"],
    hint: "Doubling",
  },
  {
    question: "What is the time complexity of linear search?",
    answer: ["o(n)", "linear"],
    hint: "Check each element",
  },
  {
    question: "What does PaaS stand for?",
    answer: ["platform as a service", "paas"],
    hint: "Cloud platform model",
  },
  {
    question: "What is 50 ÷ 2 + 5?",
    answer: ["30", "thirty"],
    hint: "Division first",
  },
  {
    question: "What HTTP method deletes a resource?",
    answer: ["delete"],
    hint: "Remove resource",
  },
  {
    question: "What is the binary of 15?",
    answer: ["1111"],
    hint: "8 + 4 + 2 + 1",
  },
  {
    question: "What does XSS stand for in security?",
    answer: ["cross site scripting", "xss"],
    hint: "Common vulnerability",
  },
  {
    question: "What is 12 × 12?",
    answer: ["144", "one hundred forty four"],
    hint: "Dozen squared",
  },
  {
    question: "What command pushes to remote Git repository?",
    answer: ["git push"],
    hint: "Upload commits",
  },
  {
    question: "What comes next: A, B, D, E, G, H, __?",
    answer: ["j"],
    hint: "Skip C, F, I",
  },
  {
    question: "What does IaaS stand for?",
    answer: ["infrastructure as a service", "iaas"],
    hint: "Cloud infrastructure model",
  },
  {
    question: "What is 2 + 3 × 4?",
    answer: ["14", "fourteen"],
    hint: "Multiplication first",
  },
  {
    question: "What HTTP status code means 'Forbidden'?",
    answer: ["403"],
    hint: "Access denied",
  },
  {
    question: "If A=1, B=2, what is 'CAB' in numbers?",
    answer: ["312"],
    hint: "C=3, A=1, B=2",
  },
  {
    question: "What does DRY stand for in programming?",
    answer: ["don't repeat yourself", "dry"],
    hint: "Code principle",
  },
  {
    question: "What is the square root of 81?",
    answer: ["9", "nine"],
    hint: "Perfect square",
  },
  {
    question: "What command pulls from remote Git repository?",
    answer: ["git pull"],
    hint: "Download updates",
  },
  {
    question: "What key refreshes browser page?",
    answer: ["f5"],
    hint: "Function key",
  },
  {
    question: "What does SOLID stand for in OOP? (First letter)",
    answer: ["s", "single"],
    hint: "Single Responsibility",
  },
  {
    question: "What is 20% of 50?",
    answer: ["10", "ten"],
    hint: "Fifth of 50",
  },
];

// Hard Level Questions (100 questions) - Advanced Professional Content
const hardQuestions = [
  {
    question:
      "What comes once in a minute, twice in a moment, but never in a thousand years?",
    answer: ["m"],
    hint: "Letter appears in those words",
  },
  {
    question: "What is the time complexity of quicksort average case?",
    answer: ["o(n log n)", "n log n"],
    hint: "Efficient sorting",
  },
  {
    question: "What comes next: 1, 4, 9, 16, 25, __?",
    answer: ["36", "thirty six"],
    hint: "6 squared",
  },
  {
    question: "What design pattern ensures only one instance exists?",
    answer: ["singleton"],
    hint: "Single instance pattern",
  },
  {
    question: "If 2² + 3² = 13, what is 4² + 5²?",
    answer: ["41", "forty one"],
    hint: "16 + 25",
  },
  {
    question: "What does ACID stand for in databases?",
    answer: ["atomicity consistency isolation durability", "acid"],
    hint: "Transaction properties",
  },
  {
    question: "What is the binary of 255?",
    answer: ["11111111"],
    hint: "Eight 1's",
  },
  {
    question: "What HTTP status code means 'Internal Server Error'?",
    answer: ["500"],
    hint: "Server error",
  },
  {
    question: "What comes next: 2, 3, 5, 7, 11, 13, __?",
    answer: ["17", "seventeen"],
    hint: "Next prime",
  },
  {
    question: "What does CAP stand for in distributed systems?",
    answer: ["consistency availability partition tolerance", "cap"],
    hint: "CAP theorem",
  },
  {
    question: "What is the square root of 256?",
    answer: ["16", "sixteen"],
    hint: "Perfect square",
  },
  {
    question: "What sorting algorithm has O(n²) worst case?",
    answer: ["bubble sort", "insertion sort", "selection sort"],
    hint: "Simple sorting",
  },
  {
    question: "What is 15! ÷ 14!?",
    answer: ["15", "fifteen"],
    hint: "Factorial division",
  },
  {
    question: "What does REPL stand for?",
    answer: ["read eval print loop", "repl"],
    hint: "Interactive shell",
  },
  {
    question: "If f(x) = 2x + 3, what is f(5)?",
    answer: ["13", "thirteen"],
    hint: "2(5) + 3",
  },
  {
    question: "What port does PostgreSQL use by default?",
    answer: ["5432"],
    hint: "Database port",
  },
  {
    question: "What is the binary of 128?",
    answer: ["10000000"],
    hint: "2^7",
  },
  {
    question: "What does OAuth stand for?",
    answer: ["open authorization", "oauth"],
    hint: "Authorization protocol",
  },
  {
    question: "What comes next: 1, 2, 4, 7, 11, __?",
    answer: ["16", "sixteen"],
    hint: "Add increasing numbers",
  },
  {
    question: "What data structure uses parent-child relationships?",
    answer: ["tree"],
    hint: "Hierarchical structure",
  },
  {
    question: "What is 0! (zero factorial)?",
    answer: ["1", "one"],
    hint: "Mathematical definition",
  },
  {
    question: "What does JWT use for signing? (algorithm)",
    answer: ["hmac", "rsa", "hs256"],
    hint: "Signing algorithm",
  },
  {
    question: "What is the hex value of decimal 255?",
    answer: ["ff", "#ff"],
    hint: "Maximum 8-bit value",
  },
  {
    question:
      "What principle states 'program to an interface, not implementation'?",
    answer: ["dependency inversion", "solid"],
    hint: "SOLID principle",
  },
  {
    question: "What is 2^10?",
    answer: ["1024"],
    hint: "1 kilobyte",
  },
  {
    question: "What does CSRF stand for?",
    answer: ["cross site request forgery", "csrf"],
    hint: "Security vulnerability",
  },
  {
    question:
      "What sorting algorithm is most efficient for nearly sorted data?",
    answer: ["insertion sort"],
    hint: "O(n) best case",
  },
  {
    question: "What is the octal value of decimal 8?",
    answer: ["10"],
    hint: "Base 8",
  },
  {
    question: "What does BASE stand for in NoSQL?",
    answer: ["basically available soft state eventual consistency", "base"],
    hint: "Opposite of ACID",
  },
  {
    question: "What comes next: 1, 8, 27, 64, __?",
    answer: ["125", "one hundred twenty five"],
    hint: "5 cubed",
  },
  {
    question: "What port does MongoDB use by default?",
    answer: ["27017"],
    hint: "NoSQL database port",
  },
  {
    question: "What is the binary of 64?",
    answer: ["1000000"],
    hint: "2^6",
  },
  {
    question:
      "What design pattern creates objects without specifying exact class?",
    answer: ["factory"],
    hint: "Creational pattern",
  },
  {
    question: "What is 3^4?",
    answer: ["81", "eighty one"],
    hint: "3 × 3 × 3 × 3",
  },
  {
    question: "What does MITM stand for in security?",
    answer: ["man in the middle", "mitm"],
    hint: "Attack type",
  },
  {
    question: "What algorithm finds shortest path in weighted graph?",
    answer: ["dijkstra", "dijkstra's"],
    hint: "Shortest path",
  },
  {
    question: "What is the logarithm base 2 of 16?",
    answer: ["4", "four"],
    hint: "2^? = 16",
  },
  {
    question: "What does CORS allow between different?",
    answer: ["origins", "domains"],
    hint: "Cross-origin requests",
  },
  {
    question: "What data structure is used for BFS?",
    answer: ["queue"],
    hint: "Breadth-first search",
  },
  {
    question: "What is 100 in hexadecimal?",
    answer: ["64"],
    hint: "Decimal 100 to hex",
  },
  {
    question: "What principle suggests small, focused functions?",
    answer: ["single responsibility"],
    hint: "SOLID principle",
  },
  {
    question: "What is the time complexity of HashMap get?",
    answer: ["o(1)", "constant"],
    hint: "Average case",
  },
  {
    question: "What does OWASP stand for?",
    answer: ["open web application security project", "owasp"],
    hint: "Security organization",
  },
  {
    question: "What comes next: 0, 1, 1, 2, 3, 5, 8, 13, __?",
    answer: ["21", "twenty one"],
    hint: "Fibonacci",
  },
  {
    question: "What port does Redis use by default?",
    answer: ["6379"],
    hint: "Cache database port",
  },
  {
    question: "What is 5^3?",
    answer: ["125", "one hundred twenty five"],
    hint: "5 × 5 × 5",
  },
  {
    question: "What design pattern wraps an object to add behavior?",
    answer: ["decorator"],
    hint: "Structural pattern",
  },
  {
    question: "What is the binary of 1024?",
    answer: ["10000000000"],
    hint: "2^10",
  },
  {
    question: "What does RPC stand for?",
    answer: ["remote procedure call", "rpc"],
    hint: "Communication protocol",
  },
  {
    question: "What algorithm is used for encryption with public/private keys?",
    answer: ["rsa"],
    hint: "Asymmetric encryption",
  },
  {
    question: "What is 2^16?",
    answer: ["65536"],
    hint: "16-bit max + 1",
  },
  {
    question: "What does KISS stand for in programming?",
    answer: ["keep it simple stupid", "kiss"],
    hint: "Design principle",
  },
  {
    question: "What data structure is used for DFS?",
    answer: ["stack"],
    hint: "Depth-first search",
  },
  {
    question: "What is the hex value of decimal 16?",
    answer: ["10"],
    hint: "Base 16",
  },
  {
    question: "What HTTP status code means 'Service Unavailable'?",
    answer: ["503"],
    hint: "Server overload",
  },
  {
    question: "What is log₁₀(1000)?",
    answer: ["3", "three"],
    hint: "10^? = 1000",
  },
  {
    question: "What does YAGNI stand for?",
    answer: ["you aren't gonna need it", "yagni"],
    hint: "Development principle",
  },
  {
    question: "What pattern allows object behavior change at runtime?",
    answer: ["strategy"],
    hint: "Behavioral pattern",
  },
  {
    question: "What is the time complexity of merge sort?",
    answer: ["o(n log n)", "n log n"],
    hint: "Divide and conquer",
  },
  {
    question: "What port does Elasticsearch use by default?",
    answer: ["9200"],
    hint: "Search engine port",
  },
  {
    question: "What is 4^4?",
    answer: ["256", "two hundred fifty six"],
    hint: "4 × 4 × 4 × 4",
  },
  {
    question: "What does MIME stand for?",
    answer: ["multipurpose internet mail extensions", "mime"],
    hint: "Media type",
  },
  {
    question: "What algorithm is used for hashing passwords?",
    answer: ["bcrypt", "sha", "md5"],
    hint: "Cryptographic hash",
  },
  {
    question: "What is the binary of 512?",
    answer: ["1000000000"],
    hint: "2^9",
  },
  {
    question:
      "What principle states 'open for extension, closed for modification'?",
    answer: ["open closed"],
    hint: "SOLID principle",
  },
  {
    question: "What comes next: 1, 3, 6, 10, 15, __?",
    answer: ["21", "twenty one"],
    hint: "Triangular numbers",
  },
  {
    question: "What does HATEOAS stand for in REST?",
    answer: ["hypermedia as the engine of application state", "hateoas"],
    hint: "REST constraint",
  },
  {
    question: "What is 7^2?",
    answer: ["49", "forty nine"],
    hint: "Seven squared",
  },
  {
    question: "What design pattern provides global access point?",
    answer: ["singleton"],
    hint: "One instance",
  },
  {
    question:
      "What is the time complexity of binary tree insertion (balanced)?",
    answer: ["o(log n)", "log n"],
    hint: "Logarithmic",
  },
  {
    question: "What port does MySQL use by default?",
    answer: ["3306"],
    hint: "Database port",
  },
  {
    question: "What is 2^8?",
    answer: ["256", "two hundred fifty six"],
    hint: "One byte max + 1",
  },
  {
    question: "What does LDAP stand for?",
    answer: ["lightweight directory access protocol", "ldap"],
    hint: "Directory service",
  },
  {
    question: "What algorithm traverses all vertices in a graph?",
    answer: ["bfs", "dfs", "breadth first search", "depth first search"],
    hint: "Graph traversal",
  },
  {
    question: "What is the hex value of decimal 255?",
    answer: ["ff"],
    hint: "Maximum byte",
  },
  {
    question: "What pattern allows incompatible interfaces to work together?",
    answer: ["adapter"],
    hint: "Structural pattern",
  },
  {
    question: "What is 12^2?",
    answer: ["144", "one hundred forty four"],
    hint: "Dozen squared",
  },
  {
    question: "What does BLOB stand for?",
    answer: ["binary large object", "blob"],
    hint: "Database data type",
  },
  {
    question: "What is the time complexity of hash table search (average)?",
    answer: ["o(1)", "constant"],
    hint: "Direct access",
  },
  {
    question: "What comes next: 2, 6, 12, 20, 30, __?",
    answer: ["42", "forty two"],
    hint: "n(n+1)",
  },
  {
    question: "What HTTP status code means 'Bad Request'?",
    answer: ["400"],
    hint: "Client error",
  },
  {
    question: "What is 2^20?",
    answer: ["1048576"],
    hint: "1 megabyte",
  },
  {
    question: "What does SAML stand for?",
    answer: ["security assertion markup language", "saml"],
    hint: "Authentication standard",
  },
  {
    question: "What pattern notifies multiple objects of state changes?",
    answer: ["observer"],
    hint: "Behavioral pattern",
  },
  {
    question: "What is the octal value of decimal 64?",
    answer: ["100"],
    hint: "Base 8",
  },
  {
    question: "What principle suggests depending on abstractions?",
    answer: ["dependency inversion"],
    hint: "SOLID principle",
  },
  {
    question: "What is 11^2?",
    answer: ["121", "one hundred twenty one"],
    hint: "Eleven squared",
  },
  {
    question: "What port does RabbitMQ use by default?",
    answer: ["5672"],
    hint: "Message broker port",
  },
  {
    question: "What algorithm finds minimum spanning tree?",
    answer: ["kruskal", "prim", "kruskal's", "prim's"],
    hint: "Graph algorithm",
  },
  {
    question: "What is the binary of 127?",
    answer: ["1111111"],
    hint: "2^7 - 1",
  },
  {
    question: "What does gRPC stand for?",
    answer: ["google remote procedure call", "grpc"],
    hint: "RPC framework",
  },
  {
    question: "What is 13^2?",
    answer: ["169", "one hundred sixty nine"],
    hint: "Thirteen squared",
  },
  {
    question: "What pattern creates step-by-step object construction?",
    answer: ["builder"],
    hint: "Creational pattern",
  },
  {
    question: "What is the time complexity of heapify?",
    answer: ["o(log n)", "log n"],
    hint: "Tree operation",
  },
  {
    question: "What comes next: 1, 2, 4, 8, 16, 32, __?",
    answer: ["64", "sixty four"],
    hint: "Powers of 2",
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
  const normalized = userAnswer.toLowerCase().trim();
  const answers = Array.isArray(correctAnswers)
    ? correctAnswers
    : [correctAnswers];
  return answers.some((ans) => ans.toLowerCase().trim() === normalized);
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
