import { useState, useCallback, useRef, useEffect } from 'react';

export function useTypingEngine(text, mode = 'time_60') {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charStatuses, setCharStatuses] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [wpmHistory, setWpmHistory] = useState([]);

  const timerRef = useRef(null);
  const wpmIntervalRef = useRef(null);

  // Parse mode
  const isTimeBased = mode.startsWith('time_');
  const duration = isTimeBased ? parseInt(mode.split('_')[1]) : 0;

  // Initialize
  useEffect(() => {
    if (text) {
      setCharStatuses(new Array(text.length).fill('upcoming'));
      setCurrentIndex(0);
      setIsStarted(false);
      setIsFinished(false);
      setStartTime(null);
      setElapsedTime(0);
      setTimeLeft(isTimeBased ? duration : 0);
      setErrors(0);
      setCorrectChars(0);
      setTotalTyped(0);
      setWpmHistory([]);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    };
  }, [text, mode]);

  const startTimer = useCallback(() => {
    const now = Date.now();
    setStartTime(now);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - now) / 1000;
      setElapsedTime(elapsed);

      if (isTimeBased) {
        const remaining = Math.max(0, duration - elapsed);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          clearInterval(wpmIntervalRef.current);
          setIsFinished(true);
        }
      }
    }, 100);

    // WPM history tracking
    wpmIntervalRef.current = setInterval(() => {
      setCorrectChars(prev => {
        const elapsed = (Date.now() - now) / 1000 / 60;
        if (elapsed > 0) {
          const wpm = Math.round((prev / 5) / elapsed);
          setWpmHistory(h => [...h, { time: Date.now() - now, wpm }]);
        }
        return prev;
      });
    }, 1000);
  }, [isTimeBased, duration]);

  const handleKeyPress = useCallback((key) => {
    if (isFinished) return;

    if (!isStarted) {
      setIsStarted(true);
      startTimer();
    }

    if (key === 'Backspace') {
      if (currentIndex > 0) {
        const newIndex = currentIndex - 1;
        setCharStatuses(prev => {
          const updated = [...prev];
          updated[newIndex] = 'upcoming';
          return updated;
        });
        setCurrentIndex(newIndex);
        setTotalTyped(prev => prev + 1);
      }
      return;
    }

    // Only process single characters
    if (key.length !== 1) return;

    const expectedChar = text[currentIndex];
    const isCorrect = key === expectedChar;

    setCharStatuses(prev => {
      const updated = [...prev];
      updated[currentIndex] = isCorrect ? 'correct' : 'incorrect';
      return updated;
    });

    if (isCorrect) {
      setCorrectChars(prev => prev + 1);
    } else {
      setErrors(prev => prev + 1);
    }

    setTotalTyped(prev => prev + 1);
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    // Check if finished (word/text mode)
    if (newIndex >= text.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
      setIsFinished(true);
    }
  }, [currentIndex, isStarted, isFinished, text, startTimer]);

  // Calculate stats
  const minutes = elapsedTime / 60 || 0.001;
  const wpm = Math.round((correctChars / 5) / minutes) || 0;
  const rawWpm = Math.round((totalTyped / 5) / minutes) || 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / (correctChars + errors)) * 100) : 100;
  const progress = text ? Math.round((currentIndex / text.length) * 100) : 0;

  const resetTest = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    setCharStatuses(text ? new Array(text.length).fill('upcoming') : []);
    setCurrentIndex(0);
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setElapsedTime(0);
    setTimeLeft(isTimeBased ? duration : 0);
    setErrors(0);
    setCorrectChars(0);
    setTotalTyped(0);
    setWpmHistory([]);
  }, [text, isTimeBased, duration]);

  return {
    currentIndex,
    charStatuses,
    isStarted,
    isFinished,
    wpm,
    rawWpm,
    accuracy,
    errors,
    progress,
    timeLeft,
    elapsedTime,
    wpmHistory,
    handleKeyPress,
    resetTest,
  };
}
