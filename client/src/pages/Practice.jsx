import { useState, useRef, useEffect, useCallback } from 'react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { getRandomQuote } from '../utils/quotes';

export default function Practice() {
  const [practiceMode, setPracticeMode] = useState('quote'); // 'quote' or 'custom'
  const [customText, setCustomText] = useState('');
  const [activeText, setActiveText] = useState('');
  const [currentQuote, setCurrentQuote] = useState(null);
  const inputRef = useRef(null);


  const {
    currentIndex, charStatuses, isStarted, isFinished,
    wpm, rawWpm, accuracy, errors, progress, elapsedTime,
    handleKeyPress, resetTest,
  } = useTypingEngine(activeText, 'words_999');

  const loadQuote = useCallback(() => {
    const q = getRandomQuote();
    setCurrentQuote(q);
    setActiveText(q.text);
  }, []);

  useEffect(() => {
    if (practiceMode === 'quote') {
      loadQuote();
    }
  }, [practiceMode]);



  const handleStart = () => {
    if (practiceMode === 'custom' && customText.trim()) {
      setActiveText(customText.trim());
    } else if (practiceMode === 'quote') {
      loadQuote();
    }
    resetTest();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e) => {
    if (!activeText || isFinished) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      handleStart();
      return;
    }
    e.preventDefault();
    handleKeyPress(e.key);
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px' }}>
          📝 Practice
        </h1>

        {/* Mode toggle */}
        <div className="mode-selector" style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '24px' }}>
          <button
            className={`mode-btn ${practiceMode === 'quote' ? 'active' : ''}`}
            onClick={() => setPracticeMode('quote')}
          >
            Random Quote
          </button>
          <button
            className={`mode-btn ${practiceMode === 'custom' ? 'active' : ''}`}
            onClick={() => setPracticeMode('custom')}
          >
            Custom Text
          </button>
        </div>

        {/* Custom text input */}
        {practiceMode === 'custom' && (
          <div style={{ marginBottom: '24px' }}>
            <textarea
              className="input"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste or type your custom text here..."
              style={{ width: '100%', minHeight: '100px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
            />
            <button
              className="btn btn-primary"
              onClick={handleStart}
              style={{ marginTop: '12px' }}
              disabled={!customText.trim()}
            >
              Start Practice
            </button>
          </div>
        )}

        {/* Quote display */}
        {practiceMode === 'quote' && currentQuote && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              — {currentQuote.author}
            </p>
          </div>
        )}

        {/* Stats */}
        {activeText && (
          <div className="stats-bar">
            <div className="stat-item">
              <span className="stat-value">{wpm}</span>
              <span className="stat-label">WPM</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{progress}%</span>
              <span className="stat-label">Progress</span>
            </div>
          </div>
        )}

        {/* Typing area */}
        {activeText && (
          <div className="typing-area" onClick={() => inputRef.current?.focus()}>
            <input
              ref={inputRef}
              className="typing-hidden-input"
              onKeyDown={handleKeyDown}
              autoFocus
              aria-label="Practice typing input"
            />
            {activeText.split('').map((char, i) => (
              <span
                key={i}
                className={`char ${charStatuses[i] || 'upcoming'} ${i === currentIndex ? 'current' : ''}`}
              >
                {char}
              </span>
            ))}
          </div>
        )}

        {/* Finished */}
        {isFinished && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px' }}>
              {wpm} WPM
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Accuracy: {accuracy}% · Errors: {errors}
            </p>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
          {practiceMode === 'quote' && (
            <button className="btn btn-secondary" onClick={handleStart}>
              🔄 New Quote
            </button>
          )}
          {practiceMode === 'custom' && activeText && (
            <button className="btn btn-secondary" onClick={handleStart}>
              🔄 Restart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
