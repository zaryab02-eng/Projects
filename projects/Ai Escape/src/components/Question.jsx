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
        setAnswer("");
        onCorrectAnswer();
      } else {
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
    <div className="max-w-4xl mx-auto">
      <div className="card fade-in">
        {/* Level Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock className="text-cyber-accent" size={32} />
            <h2 className="text-3xl font-bold text-cyber-accent">
              LEVEL {levelNumber}
            </h2>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-bg border border-cyber-border 
                     rounded-lg hover:border-cyber-warning transition-all duration-300"
          >
            <Lightbulb size={20} className="text-cyber-warning" />
            <span className="text-cyber-warning">Hint</span>
          </button>
        </div>

        {/* Question */}
        <div className="bg-cyber-bg p-6 rounded-lg mb-6 border-l-4 border-cyber-accent">
          <p className="text-xl text-white leading-relaxed whitespace-pre-wrap">
            {question.question}
          </p>
        </div>

        {/* Hint (if shown) */}
        {showHint && (
          <div
            className="bg-cyber-warning bg-opacity-10 p-4 rounded-lg mb-6 border border-cyber-warning 
                        animate-pulse"
          >
            <p className="text-cyber-warning">💡 {question.hint}</p>
          </div>
        )}

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cyber-accent mb-2 font-bold">
              YOUR ANSWER
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="input text-lg"
              disabled={submitting}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-cyber-danger bg-opacity-20 p-4 rounded-lg border border-cyber-danger">
              <p className="text-cyber-danger">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !answer.trim()}
            className="btn-primary w-full text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT ANSWER"}
          </button>
        </form>

        <p className="text-center text-white text-opacity-50 mt-4 text-sm">
          ⚠️ You cannot skip questions. Answer correctly to proceed.
        </p>
      </div>
    </div>
  );
}
