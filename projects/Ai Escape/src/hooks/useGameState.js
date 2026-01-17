import { useState, useEffect } from "react";
import { subscribeToRoom, getRemainingTime } from "../services/gameService";

/**
 * Custom hook to manage game state with real-time updates
 */
export function useGameState(roomCode) {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!roomCode) {
      setLoading(false);
      return;
    }

    // Subscribe to room updates
    const unsubscribe = subscribeToRoom(roomCode, (data) => {
      if (data) {
        setRoomData(data);
        setError(null);
      } else {
        setError("Room not found");
        setRoomData(null);
      }
      setLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [roomCode]);

  // Timer countdown
  useEffect(() => {
    if (!roomData || roomData.status !== "playing") {
      setRemainingTime(0);
      return;
    }

    const updateTimer = () => {
      const remaining = getRemainingTime(roomData);
      setRemainingTime(remaining);

      // Auto-end game when time expires
      if (remaining <= 0 && roomData.status === "playing") {
        // The admin's timer will handle ending the game
        console.log("Time expired");
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [roomData]);

  return {
    roomData,
    loading,
    error,
    remainingTime,
  };
}

/**
 * Format milliseconds to MM:SS
 */
export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
