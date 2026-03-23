import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { generateWordsForTime } from '../utils/wordLists';
import { useToast } from '../components/Toast';

const GHOST_SPEEDS = [30, 40, 50, 60, 80];

export default function StreetRace() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [raceState, setRaceState] = useState('ready'); // ready, countdown, racing, finished
  const [countdown, setCountdown] = useState(3);
  const [ghostSpeed, setGhostSpeed] = useState(50);
  const inputRef = useRef(null);
  const { addToast } = useToast();

  const mode = 'time_30';

  const {
    currentIndex, charStatuses, isStarted, isFinished,
    wpm, rawWpm, accuracy, errors, progress, timeLeft,
    elapsedTime, handleKeyPress, resetTest,
  } = useTypingEngine(text, mode);

  useEffect(() => {
    setText(generateWordsForTime(30));
  }, []);

  // Ghost progress
  const ghostCharsTyped = isStarted ? (ghostSpeed / 60) * 5 * elapsedTime : 0;
  const ghostProgress = text.length > 0 ? Math.min((ghostCharsTyped / text.length) * 100, 100) : 0;

  const startRace = () => {
    setText(generateWordsForTime(30));
    resetTest();
    setRaceState('countdown');
    setCountdown(3);

    let c = 3;
    const interval = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(interval);
        setRaceState('racing');
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, 1000);
  };

  useEffect(() => {
    if (isFinished && raceState === 'racing') {
      setRaceState('finished');
    }
  }, [isFinished]);

  const handleKeyDown = (e) => {
    if (raceState !== 'racing') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    handleKeyPress(e.key);
  };

  const carPosition = Math.min(progress, 100);
  const trackMultiplier = window.innerWidth < 640 ? 2.5 : 6.5;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, marginBottom: '24px' }}>
          🏁 Street Race
        </h1>

        {/* Ghost Speed Selector */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Ghost Speed:</span>
          <div className="mode-selector">
            {GHOST_SPEEDS.map(speed => (
              <button
                key={speed}
                className={`mode-btn ${ghostSpeed === speed ? 'active' : ''}`}
                onClick={() => setGhostSpeed(speed)}
                disabled={raceState === 'racing' || raceState === 'countdown'}
              >
                {speed}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>WPM</span>
        </div>

        {/* Countdown overlay */}
        {raceState === 'countdown' && (
          <div className="countdown-overlay">
            <div className="countdown-number">{countdown}</div>
          </div>
        )}

        {/* Race Track */}
        <div className="race-track" style={{ marginBottom: '24px' }}>
          <div className="finish-line"></div>
          <div className="race-lane">
            <div className="race-lane-bg"></div>
            <div
              className="race-car"
              style={{ transform: `translateX(${carPosition * trackMultiplier}px)` }}
            >
              🏎️
            </div>
            <span className="race-player-name">You</span>
            <span className="race-player-wpm">{wpm} WPM</span>
          </div>
          {/* Ghost racer */}
          <div className="race-lane">
            <div className="race-lane-bg"></div>
            <div
              className="race-car"
              style={{
                transform: `translateX(${ghostProgress * trackMultiplier}px)`,
                opacity: 0.5,
              }}
            >
              🚗
            </div>
            <span className="race-player-name" style={{ opacity: 0.5 }}>Ghost ({ghostSpeed} WPM)</span>
            <span className="race-player-wpm" style={{ opacity: 0.5 }}>{ghostSpeed} WPM</span>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{Math.ceil(timeLeft)}</span>
            <span className="stat-label">Time Left</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{wpm}</span>
            <span className="stat-label">WPM</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
        </div>

        {/* Typing area */}
        {(raceState === 'racing' || raceState === 'finished') && (
          <div className="typing-area" onClick={() => inputRef.current?.focus()}>
            <input
              ref={inputRef}
              className="typing-hidden-input"
              onKeyDown={handleKeyDown}
              aria-label="Race typing input"
            />
            {text.split('').map((char, i) => (
              <span
                key={i}
                className={`char ${charStatuses[i] || 'upcoming'} ${i === currentIndex ? 'current' : ''}`}
              >
                {char}
              </span>
            ))}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          {raceState === 'ready' && (
            <button className="btn btn-primary btn-lg" onClick={startRace}>
              🏁 Start Race
            </button>
          )}
        </div>

        {/* Result Popup */}
        {raceState === 'finished' && (
          <div className="result-overlay" onClick={(e) => e.target === e.currentTarget && startRace()}>
            <div className="result-popup">
              <button className="result-popup-close" onClick={() => navigate('/')} aria-label="Close">✕</button>
              <div className="result-popup-title">
                {wpm > ghostSpeed ? '🏆 You Win!' : '🏁 Race Complete!'}
              </div>
              <div className="result-popup-wpm">{wpm}</div>
              <div className="result-popup-wpm-label">Words Per Minute</div>
              <div className="result-popup-stats">
                <div className="result-popup-stat">
                  <div className="result-popup-stat-value">{accuracy}%</div>
                  <div className="result-popup-stat-label">Accuracy</div>
                </div>
                <div className="result-popup-stat">
                  <div className="result-popup-stat-value">{errors}</div>
                  <div className="result-popup-stat-label">Errors</div>
                </div>
                <div className="result-popup-stat">
                  <div className="result-popup-stat-value">{rawWpm}</div>
                  <div className="result-popup-stat-label">Raw WPM</div>
                </div>
              </div>
              <div className="result-popup-message">
                {wpm > ghostSpeed
                  ? `You beat the ghost by ${wpm - ghostSpeed} WPM! 🎉`
                  : wpm === ghostSpeed
                    ? `Tied with the ghost at ${ghostSpeed} WPM!`
                    : `Ghost (${ghostSpeed} WPM) wins by ${ghostSpeed - wpm} WPM`}
              </div>
              <div className="result-popup-actions">
                <button className="btn btn-primary btn-lg" onClick={startRace}>
                  🔄 Race Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
