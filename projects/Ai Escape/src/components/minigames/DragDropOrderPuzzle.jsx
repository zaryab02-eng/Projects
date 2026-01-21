import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { hashStringToUint32, mulberry32 } from "../../utils/seededRandom";

/**
 * Drag Drop Order Puzzle - Player must arrange items in the correct order
 * 
 * DIFFICULTY SETTINGS:
 * - Easy: 3-4 items, simpler themes
 * - Medium: 4 items, mixed themes
 * - Hard: 4-5 items, complex themes
 * 
 * Props:
 * - difficulty: "easy" | "medium" | "hard"
 * - levelNumber: current level (affects progression scaling)
 * - totalLevels: total levels in game
 * - seed: deterministic seed for multiplayer sync
 * - onSuccess: callback when order is correct
 * - onFail: callback when wrong order is submitted
 */
const DragDropOrderPuzzle = ({
  difficulty = "medium",
  levelNumber = 1,
  totalLevels = 0,
  seed = "",
  onSuccess,
  onFail,
}) => {
  const difficultyLower = (difficulty || "medium").toLowerCase();
  const level = Number(levelNumber) || 1;
  const total = Number(totalLevels) || 5;

  // Calculate progress (0 to 1)
  const progress = useMemo(() => {
    if (total <= 1) return 0;
    return Math.min(1, Math.max(0, (level - 1) / (total - 1)));
  }, [level, total]);

  // Item count based on difficulty and progress
  const itemCount = useMemo(() => {
    switch (difficultyLower) {
      case 'easy':
        return progress > 0.7 ? 4 : 3;
      case 'hard':
        return progress > 0.5 ? 5 : 4;
      default: // medium
        return 4;
    }
  }, [difficultyLower, progress]);

  // Theme sets for variety
  const THEMES = [
    ["Wake up", "Find clue", "Decode", "Unlock", "Escape"],
    ["Observe", "Collect", "Combine", "Test", "Proceed"],
    ["Scan room", "Spot pattern", "Try key", "Solve lock", "Exit"],
    ["Boot system", "Authenticate", "Bypass", "Override", "Access"],
    ["Connect", "Scan ports", "Exploit", "Escalate", "Root"],
    ["Initialize", "Load", "Compile", "Execute", "Deploy"],
    ["Investigate", "Eliminate", "Confirm", "Commit", "Finish"],
    ["Gather info", "Interview", "Analyze", "Deduce", "Solve"],
    ["Listen", "Watch", "Wait", "Act", "Recover"],
    ["Scout", "Plan route", "Avoid traps", "Reach goal", "Extract"],
    ["Read clue", "Find piece", "Rotate", "Connect", "Complete"],
    ["Decode", "Match", "Insert key", "Turn lock", "Open"],
  ];

  // Build items deterministically
  const { items, correctOrder } = useMemo(() => {
    const seedString = `${seed}:dragDrop:${difficultyLower}:L${level}:T${total}`;
    const rand = mulberry32(hashStringToUint32(seedString));
    
    const themeIndex = Math.floor(rand() * THEMES.length);
    const theme = THEMES[themeIndex];
    
    const words = [...theme];
    while (words.length < itemCount) {
      words.push(`Step ${words.length + 1}`);
    }
    
    const selected = words.slice(0, itemCount);
    const builtItems = selected.map((text, idx) => ({ id: idx + 1, text }));
    
    return {
      items: builtItems,
      correctOrder: builtItems.map(item => item.id),
    };
  }, [seed, difficultyLower, level, total, itemCount]);

  // Shuffle items for initial state
  const getShuffledItems = useCallback(() => {
    const shuffleSeed = `${seed}:dragDrop:shuffle:${difficultyLower}:L${level}:T${total}`;
    const rand = mulberry32(hashStringToUint32(shuffleSeed));
    return [...items].sort(() => rand() - 0.5);
  }, [seed, difficultyLower, level, total, items]);

  // Game state
  const [orderedItems, setOrderedItems] = useState(getShuffledItems);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(null); // 'correct' | 'wrong' | null

  // Reset when dependencies change
  useEffect(() => {
    setOrderedItems(getShuffledItems());
    setIsSuccess(false);
    setHasSubmitted(false);
    setShowResult(null);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [getShuffledItems]);

  // Check if current order is correct
  const checkOrder = useCallback((currentOrder) => {
    if (currentOrder.length !== correctOrder.length) return false;
    return currentOrder.every((item, index) => item.id === correctOrder[index]);
  }, [correctOrder]);

  // Drag handlers
  const handleDragStart = (index) => setDraggedIndex(index);
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (dropIndex) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...orderedItems];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);

    setOrderedItems(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);

    // Reset result if user rearranges after wrong
    if (showResult === 'wrong') {
      setShowResult(null);
      setHasSubmitted(false);
    }
  };

  // Touch handlers for mobile
  const handleTouchStart = (index) => setDraggedIndex(index);

  const handleTouchMove = (e) => {
    if (draggedIndex === null) return;
    const touch = e.touches[0];
    const elements = document.querySelectorAll('[data-drop-zone]');
    elements.forEach((el, idx) => {
      const rect = el.getBoundingClientRect();
      if (touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
        setDragOverIndex(idx);
      }
    });
  };

  const handleTouchEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      handleDrop(dragOverIndex);
    } else {
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  // Submit handler
  const handleSubmit = () => {
    if (hasSubmitted && showResult === 'correct') return;

    setHasSubmitted(true);

    if (checkOrder(orderedItems)) {
      setShowResult('correct');
      setIsSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 400);
    } else {
      setShowResult('wrong');
      if (onFail) onFail();
      setTimeout(() => {
        setHasSubmitted(false);
      }, 800);
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="mb-2 text-center">
        <h2 className="text-lg sm:text-xl font-bold text-cyber-accent glow-text">
          Order the Sequence
        </h2>
        <p className="text-[10px] sm:text-xs text-white text-opacity-70">
          Drag to arrange in correct order, then submit
        </p>
      </div>

      {/* Items */}
      <div className="space-y-1.5 sm:space-y-2 mb-3">
        {orderedItems.map((item, index) => {
          const isDragging = draggedIndex === index;
          const isOver = dragOverIndex === index && draggedIndex !== index;

          return (
            <div
              key={item.id}
              data-drop-zone
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onTouchStart={() => handleTouchStart(index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`
                py-2.5 px-3 sm:py-3 sm:px-4 rounded-lg border-2 cursor-move select-none
                transition-all duration-150 shadow-sm
                ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                ${isOver ? 'border-cyber-accent border-dashed' : 'border-cyber-border'}
                ${isSuccess ? 'bg-green-500/20 border-green-500' : 'bg-black bg-opacity-40 hover:bg-opacity-60'}
              `}
              style={{ touchAction: 'none' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-medium text-white">
                  {item.text}
                </span>
                <div className="flex gap-0.5 ml-2 opacity-50">
                  <div className="w-0.5 h-4 bg-cyber-accent rounded"></div>
                  <div className="w-0.5 h-4 bg-cyber-accent rounded"></div>
                  <div className="w-0.5 h-4 bg-cyber-accent rounded"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult === 'correct' && (
        <div className="py-2 px-3 bg-green-500/20 border-2 border-green-500 rounded-lg text-center mb-2">
          <p className="text-sm font-semibold text-green-300">✓ Correct Order!</p>
        </div>
      )}

      {showResult === 'wrong' && (
        <div className="py-2 px-3 bg-red-500/20 border-2 border-red-500 rounded-lg text-center mb-2">
          <p className="text-sm font-semibold text-red-300">✗ Wrong! Try again.</p>
        </div>
      )}

      {/* Submit Button */}
      {!isSuccess && (
        <button
          onClick={handleSubmit}
          disabled={hasSubmitted && showResult === 'wrong'}
          className={`
            w-full py-2.5 px-4 text-sm sm:text-base font-bold rounded-lg
            transition-all duration-150 shadow-md
            ${hasSubmitted && showResult === 'wrong'
              ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              : 'bg-cyber-accent text-black hover:bg-opacity-90 cursor-pointer'
            }
          `}
        >
          {hasSubmitted && showResult === 'wrong' ? 'Rearranging...' : 'SUBMIT ORDER'}
        </button>
      )}
    </div>
  );
};

export default DragDropOrderPuzzle;
