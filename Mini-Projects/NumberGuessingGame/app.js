const randomNumber = Math.floor(Math.random() * 10) + 1;
let attempt = 0;
let guess;

do {
  let message = "";
  if (attempt > 0) {
    if (guess > randomNumber) {
      message = "Too high! ";
    } else if (guess < randomNumber) {
      message = "Too low! ";
    }
  }

  const guessNum = prompt(message + "Guess the number between (1-10)");
  guess = Number(guessNum);
  attempt++;
} while (guess !== randomNumber);

alert(`Correct! You got it in ${attempt} attempts!`);
