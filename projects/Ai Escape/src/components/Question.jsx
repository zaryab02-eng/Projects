import { useState } from "react";
import { submitAnswer } from "../services/gameService";
import { Lightbulb, Lock } from "lucide-react";

/**
 * Question component - displays current level question
 */
export default function Question({
  roomCode,
  playerId,
  question,
  levelNumber,
  onCorrectAnswer,
  onWrongAnswer, // NEW: callback for wrong answers
}) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔊 SOUND EFFECTS FUNCTION - Safari-safe with defensive error handling
  const playSound = (soundFile) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.5; // 50% volume, adjust as needed (0.0 to 1.0)
      
      // Safari-safe: handle autoplay restrictions
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Sound playing: ${soundFile}`);
          })
          .catch((err) => {
            console.log("Sound autoplay prevented (normal on Safari):", err);
            // App continues - sound is non-critical
          });
      }
      
      // Handle audio loading errors
      audio.addEventListener('error', (e) => {
        console.error(`Audio file failed to load: ${soundFile}`, e);
        // App continues - sound is non-critical
      });
      
    } catch (err) {
      console.log("Sound initialization error (non-critical):", err);
      // App continues - sound is non-critical
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answer.trim()) {
      setError("Please enter an answer");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const isCorrect = await submitAnswer(
        roomCode,
        playerId,
        levelNumber,
        answer,
      );

      if (isCorrect) {
        // ✅ PLAY CORRECT SOUND (using unlock.mp3 as correct sound)
        playSound("/sounds/unlock.mp3");

        setAnswer("");
        // Pass the level number that was just completed
        onCorrectAnswer(levelNumber);
      } else {
        // ❌ PLAY WRONG SOUND
        playSound("/sounds/wrong.mp3");

        // NEW: Trigger wrong answer video
        if (onWrongAnswer) {
          onWrongAnswer();
        }

        setError("❌ Incorrect answer. Try again!");
        setAnswer("");
      }
    } catch (err) {
      setError("Error submitting answer: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full overflow-x-hidden relative">
      <div className="fade-in p-5 md:p-6 relative z-10 bg-black bg-opacity-30 backdrop-blur-sm border border-cyber-border border-opacity-50 rounded-xl shadow-xl">
        {/* Level Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-5">
          <div className="flex items-center gap-3">
            <Lock className="text-cyber-accent" size={24} />
            <h2 className="text-xl md:text-3xl font-bold text-cyber-accent glow-text tracking-tight">
              LEVEL {levelNumber}
            </h2>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-black bg-opacity-40 backdrop-blur-sm border border-cyber-border border-opacity-50 
                     rounded-xl hover:border-cyber-warning transition-all duration-300 text-xs md:text-sm shadow-lg hover:shadow-xl"
          >
            <Lightbulb size={18} className="text-cyber-warning" />
            <span className="text-cyber-warning font-bold">Hint</span>
          </button>
        </div>

        {/* Question */}
        <div className="bg-black bg-opacity-20 backdrop-blur-sm p-4 md:p-5 rounded-xl mb-4 md:mb-5 border-l-4 border-cyber-accent">
          <p className="text-base md:text-lg text-white font-semibold leading-relaxed whitespace-pre-wrap break-words drop-shadow-lg">
            {question.question}
          </p>
        </div>

        {/* Hint (if shown) */}
        {showHint && (
          <div
            className="bg-black bg-opacity-40 backdrop-blur-sm p-3 md:p-4 rounded-xl mb-4 md:mb-5 border border-cyber-warning 
                        animate-pulse shadow-lg"
          >
            <p className="text-cyber-warning font-bold text-sm md:text-base break-words drop-shadow-lg">
              💡 {question.hint}
            </p>
          </div>
        )}

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
          <div>
            <label className="block text-cyber-accent mb-2 font-bold text-sm md:text-base glow-text">
              YOUR ANSWER
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="input text-sm md:text-base bg-black bg-opacity-40 backdrop-blur-sm border-cyber-accent border-opacity-50 text-white placeholder-white placeholder-opacity-50 rounded-xl"
              disabled={submitting}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm p-3 md:p-4 rounded-xl border border-cyber-danger shadow-lg">
              <p className="text-cyber-danger font-bold text-sm md:text-base drop-shadow-lg">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !answer.trim()}
            className="btn-primary w-full text-sm md:text-base py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT ANSWER"}
          </button>
        </form>

        <p className="text-center text-white font-semibold mt-4 md:mt-5 text-xs md:text-sm drop-shadow-lg opacity-80">
          ⚠️ You cannot skip questions. Answer correctly to proceed.
        </p>
      </div>
    </div>
  );
}
