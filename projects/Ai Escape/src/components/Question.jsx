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
    <div className="max-w-3xl mx-auto w-full overflow-x-hidden relative">
      <div className="fade-in p-4 md:p-5 relative z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-md">
        {/* Level Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 md:mb-4">
          <div className="flex items-center gap-2.5">
            <Lock className="text-cyber-accent" size={20} />
            <h2 className="text-lg md:text-xl font-semibold text-cyber-accent glow-text tracking-tight">
              LEVEL {levelNumber}
            </h2>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/70 border border-slate-700 rounded-full hover:border-cyber-warning transition-all duration-200 text-[11px] md:text-xs shadow-sm hover:shadow-md"
          >
            <Lightbulb size={18} className="text-cyber-warning" />
            <span className="text-cyber-warning font-medium">Hint</span>
          </button>
        </div>

        {/* Question */}
        <div className="bg-slate-950/70 backdrop-blur-sm p-3.5 md:p-4 rounded-lg mb-3 md:mb-4 border-l-4 border-cyber-accent">
          <p className="text-sm md:text-base text-slate-50 font-medium leading-relaxed whitespace-pre-wrap break-words">
            {question.question}
          </p>
        </div>

        {/* Hint (if shown) */}
        {showHint && (
          <div
            className="bg-amber-500/5 backdrop-blur-sm p-3 md:p-3.5 rounded-lg mb-3 md:mb-4 border border-cyber-warning/80"
          >
            <p className="text-cyber-warning font-medium text-xs md:text-sm break-words">
              💡 {question.hint}
            </p>
          </div>
        )}

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-4">
          <div>
            <label className="block text-cyber-accent mb-2 font-bold text-sm md:text-base glow-text">
              YOUR ANSWER
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="input bg-slate-950/70 backdrop-blur-sm border-slate-700/80 text-slate-50 placeholder-slate-500"
              disabled={submitting}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-500/5 backdrop-blur-sm p-3 md:p-3.5 rounded-lg border border-cyber-danger/80">
              <p className="text-cyber-danger font-medium text-xs md:text-sm">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !answer.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT ANSWER"}
          </button>
        </form>

        <p className="text-center text-slate-400 font-medium mt-3.5 md:mt-4 text-[11px] md:text-xs">
          ⚠️ You cannot skip questions. Answer correctly to proceed.
        </p>
      </div>
    </div>
  );
}
