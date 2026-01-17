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
}) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔊 SOUND EFFECTS FUNCTION
  const playSound = (soundFile) => {
    try {
      const audio = new Audio(soundFile);
      audio.volume = 0.5; // 50% volume, adjust as needed (0.0 to 1.0)
      audio.play().catch((err) => console.log("Sound play failed:", err));
    } catch (err) {
      console.log("Sound error:", err);
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
        // ✅ PLAY CORRECT SOUND
        playSound("/sounds/correct.mp3");

        setAnswer("");
        onCorrectAnswer();
      } else {
        // ❌ PLAY WRONG SOUND
        playSound("/sounds/wrong.mp3");

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
      <div className="fade-in p-4 md:p-5 relative z-10 bg-black bg-opacity-30 backdrop-blur-sm border border-cyber-border border-opacity-50 rounded-lg shadow-xl">
        {/* Level Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            <Lock className="text-cyber-accent" size={20} />
            <h2 className="text-lg md:text-2xl font-bold text-cyber-accent glow-text">
              LEVEL {levelNumber}
            </h2>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 bg-black bg-opacity-40 backdrop-blur-sm border border-cyber-border border-opacity-50 
                     rounded-lg hover:border-cyber-warning transition-all duration-300 text-xs md:text-sm"
          >
            <Lightbulb size={16} className="text-cyber-warning" />
            <span className="text-cyber-warning font-bold">Hint</span>
          </button>
        </div>

        {/* Question */}
        <div className="bg-black bg-opacity-20 backdrop-blur-sm p-3 md:p-4 rounded-lg mb-3 md:mb-4 border-l-4 border-cyber-accent">
          <p className="text-sm md:text-base text-white font-semibold leading-relaxed whitespace-pre-wrap break-words drop-shadow-lg">
            {question.question}
          </p>
        </div>

        {/* Hint (if shown) */}
        {showHint && (
          <div
            className="bg-black bg-opacity-40 backdrop-blur-sm p-2.5 md:p-3 rounded-lg mb-3 md:mb-4 border border-cyber-warning 
                        animate-pulse"
          >
            <p className="text-cyber-warning font-bold text-xs md:text-sm break-words drop-shadow-lg">
              💡 {question.hint}
            </p>
          </div>
        )}

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-2.5 md:space-y-3">
          <div>
            <label className="block text-cyber-accent mb-1 font-bold text-xs md:text-sm glow-text">
              YOUR ANSWER
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="input text-sm md:text-base bg-black bg-opacity-40 backdrop-blur-sm border-cyber-accent border-opacity-50 text-white placeholder-white placeholder-opacity-50"
              disabled={submitting}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm p-2 md:p-3 rounded-lg border border-cyber-danger">
              <p className="text-cyber-danger font-bold text-xs md:text-sm drop-shadow-lg">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !answer.trim()}
            className="btn-primary w-full text-sm md:text-base py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT ANSWER"}
          </button>
        </form>

        <p className="text-center text-white font-semibold mt-2 md:mt-3 text-xs drop-shadow-lg">
          ⚠️ You cannot skip questions. Answer correctly to proceed.
        </p>
      </div>
    </div>
  );
}
