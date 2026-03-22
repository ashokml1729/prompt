import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { generateWordsForTime, generateWords } from '../utils/wordLists';

const TIME_MODES = [
  { label: '15s', value: 'time_15' },
  { label: '30s', value: 'time_30' },
  { label: '60s', value: 'time_60' },
  { label: '120s', value: 'time_120' },
];

const WORD_MODES = [
  { label: '25 words', value: 'words_25' },
  { label: '50 words', value: 'words_50' },
  { label: '100 words', value: 'words_100' },
];

export default function TypingTest() {
  const [mode, setMode] = useState('time_30');
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  const textDisplayRef = useRef(null);
  const navigate = useNavigate();

  const {
    currentIndex, charStatuses, isStarted, isFinished,
    wpm, rawWpm, accuracy, errors, progress, timeLeft,
    elapsedTime, wpmHistory, handleKeyPress, resetTest,
  } = useTypingEngine(text, mode);

  // Generate text based on mode
  const generateText = useCallback(() => {
    if (mode.startsWith('time_')) {
      const seconds = parseInt(mode.split('_')[1]);
      return generateWordsForTime(seconds);
    } else {
      const count = parseInt(mode.split('_')[1]);
      return generateWords(count);
    }
  }, [mode]);

  useEffect(() => {
    setText(generateText());
  }, [mode, generateText]);

  // Navigate to results when finished
  useEffect(() => {
    if (isFinished && isStarted) {
      const duration = mode.startsWith('time_')
        ? parseInt(mode.split('_')[1])
        : Math.round(elapsedTime);

      navigate('/results', {
        state: {
          wpm, rawWpm, accuracy, errors,
          duration, mode, wpmHistory,
        },
      });
    }
  }, [isFinished]);

  // Auto-scroll text display
  useEffect(() => {
    if (textDisplayRef.current) {
      const currentChar = textDisplayRef.current.querySelector('.char.current');
      if (currentChar) {
        const container = textDisplayRef.current;
        const charTop = currentChar.offsetTop;
        const containerHeight = container.clientHeight;
        if (charTop > containerHeight * 0.6) {
          container.scrollTop = charTop - containerHeight * 0.3;
        }
      }
    }
  }, [currentIndex]);

  const handleAreaClick = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleNewTest();
      return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    handleKeyPress(e.key);
  };

  const handleNewTest = () => {
    setText(generateText());
    resetTest();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page">
      <div className="container">
        {/* Mode selector */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div className="mode-selector">
            {TIME_MODES.map(m => (
              <button
                key={m.value}
                className={`mode-btn ${mode === m.value ? 'active' : ''}`}
                onClick={() => { setMode(m.value); }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="mode-selector">
            {WORD_MODES.map(m => (
              <button
                key={m.value}
                className={`mode-btn ${mode === m.value ? 'active' : ''}`}
                onClick={() => { setMode(m.value); }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          {mode.startsWith('time_') && (
            <div className="stat-item">
              <span className="stat-value">{formatTime(isStarted ? timeLeft : parseInt(mode.split('_')[1]))}</span>
              <span className="stat-label">Time</span>
            </div>
          )}
          <div className="stat-item">
            <span className="stat-value">{wpm}</span>
            <span className="stat-label">WPM</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          {!mode.startsWith('time_') && (
            <div className="stat-item">
              <span className="stat-value">{progress}%</span>
              <span className="stat-label">Progress</span>
            </div>
          )}
        </div>

        {/* Typing area */}
        <div className="typing-area" onClick={handleAreaClick} ref={textDisplayRef}>
          <input
            ref={inputRef}
            className="typing-hidden-input"
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Typing input"
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

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={handleNewTest}>
            🔄 New Test
          </button>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem', display: 'flex', alignItems: 'center' }}>
            Press <kbd style={{ 
              padding: '2px 8px', margin: '0 4px', background: 'var(--bg-tertiary)', 
              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
              fontSize: '0.78rem'
            }}>Tab</kbd> to restart
          </span>
        </div>
      </div>
    </div>
  );
}
