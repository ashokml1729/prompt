import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useToast } from '../components/Toast';
import api from '../services/api';

export default function Multiplayer() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { emit, on, off, connected } = useSocket();
  const { addToast } = useToast();

  const [roomCode, setRoomCode] = useState(code || '');
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [raceText, setRaceText] = useState('');
  const [raceState, setRaceState] = useState('lobby'); // lobby, countdown, racing, finished
  const [countdown, setCountdown] = useState(3);
  const [joinCode, setJoinCode] = useState('');
  const [publicRooms, setPublicRooms] = useState([]);
  const inputRef = useRef(null);

  const {
    currentIndex, charStatuses, isStarted, isFinished,
    wpm, accuracy, progress, timeLeft, handleKeyPress, resetTest,
  } = useTypingEngine(raceText, 'time_30');

  // Load public rooms
  useEffect(() => {
    if (!code) {
      api.get('/rooms').then(res => setPublicRooms(res.data)).catch(() => {});
    }
  }, [code]);

  // Join room on mount if code provided
  useEffect(() => {
    if (code && user && connected) {
      emit('join-room', { roomCode: code, user });
    }
  }, [code, user, connected]);

  // Socket listeners
  useEffect(() => {
    if (!connected) return;

    const unsubRoomUpdate = on('room-update', (data) => {
      setPlayers(data.players);
      if (data.text) setRaceText(data.text);
    });

    const unsubCountdown = on('race-countdown', (data) => {
      setRaceState('countdown');
      if (data.text) setRaceText(data.text);
    });

    const unsubTick = on('countdown-tick', ({ count }) => {
      setCountdown(count);
    });

    const unsubStart = on('race-start', ({ text }) => {
      setRaceState('racing');
      setRaceText(text);
      resetTest();
      setTimeout(() => inputRef.current?.focus(), 100);
    });

    const unsubProgress = on('progress-update', ({ players: updatedPlayers }) => {
      setPlayers(updatedPlayers);
    });

    const unsubFinished = on('race-finished', ({ players: finalPlayers }) => {
      setRaceState('finished');
      setPlayers(finalPlayers);
    });

    return () => {
      unsubRoomUpdate();
      unsubCountdown();
      unsubTick();
      unsubStart();
      unsubProgress();
      unsubFinished();
    };
  }, [connected]);

  // Send progress updates
  useEffect(() => {
    if (raceState === 'racing' && isStarted) {
      emit('player-progress', { roomCode: code, progress, wpm, accuracy });
    }
  }, [progress, wpm]);

  // Handle finish
  useEffect(() => {
    if (isFinished && raceState === 'racing') {
      emit('player-finished', { roomCode: code, wpm, accuracy });
    }
  }, [isFinished]);

  const createRoom = async () => {
    try {
      const res = await api.post('/rooms', { mode: 'time_30' });
      navigate(`/multiplayer/${res.data.room_code}`);
    } catch (err) {
      addToast('Failed to create room', 'error');
    }
  };

  const joinRoom = () => {
    if (joinCode.trim()) {
      navigate(`/multiplayer/${joinCode.trim().toUpperCase()}`);
    }
  };

  const handleStartRace = () => {
    const words = 'the quick brown fox jumps over the lazy dog and the cat sat on the warm mat while birds flew across the clear blue sky above the tall green trees near the old stone bridge that crossed over the flowing river below';
    emit('start-race', { roomCode: code, text: words });
  };

  const handleKeyDown = (e) => {
    if (raceState !== 'racing') return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    e.preventDefault();
    handleKeyPress(e.key);
  };

  // Lobby view
  if (!code) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px' }}>
            👥 Multiplayer
          </h1>

          {!user ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Please log in to join multiplayer races
              </p>
              <a href="/login" className="btn btn-primary">Log In</a>
            </div>
          ) : (
            <div className="lobby-grid">
              <div>
                <div className="card" style={{ marginBottom: '16px' }}>
                  <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>Create Room</h3>
                  <button className="btn btn-primary" onClick={createRoom} style={{ width: '100%' }}>
                    + Create New Room
                  </button>
                </div>

                <div className="card">
                  <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>Join Room</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      className="input"
                      placeholder="Room code (e.g. ABC123)"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      style={{ flex: 1, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}
                    />
                    <button className="btn btn-primary" onClick={joinRoom}>Join</button>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>Public Rooms</h3>
                {publicRooms.length === 0 ? (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>
                    No active rooms. Create one!
                  </p>
                ) : (
                  publicRooms.map((r) => (
                    <div key={r.id} className="room-card">
                      <div>
                        <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{r.room_code}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                          Host: {r.host_username} · {r.player_count} players
                        </div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/multiplayer/${r.room_code}`)}
                      >
                        Join
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Race room view
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Countdown */}
        {raceState === 'countdown' && (
          <div className="countdown-overlay">
            <div className="countdown-number">{countdown}</div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: 800 }}>Room: <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{code}</span></h2>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            {players.length} player{players.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Race Track */}
        <div className="race-track">
          <div className="finish-line"></div>
          {players.map((p, i) => (
            <div key={i} className="race-lane">
              <div className="race-lane-bg"></div>
              <div
                className="race-car"
                style={{ transform: `translateX(${(p.progress || 0) * 6}px)` }}
              >
                {['🏎️', '🚗', '🚙', '🚕'][i % 4]}
              </div>
              <span className="race-player-name">
                {p.username} {p.finished ? '✅' : ''}
              </span>
              <span className="race-player-wpm">{p.wpm} WPM</span>
            </div>
          ))}
        </div>

        {/* Host controls */}
        {raceState === 'lobby' && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <button className="btn btn-primary btn-lg" onClick={handleStartRace}>
              🏁 Start Race
            </button>
          </div>
        )}

        {/* Typing area */}
        {(raceState === 'racing' || raceState === 'finished') && raceText && (
          <div className="typing-area" onClick={() => inputRef.current?.focus()}>
            <input
              ref={inputRef}
              className="typing-hidden-input"
              onKeyDown={handleKeyDown}
              aria-label="Multiplayer typing input"
            />
            {raceText.split('').map((char, i) => (
              <span
                key={i}
                className={`char ${charStatuses[i] || 'upcoming'} ${i === currentIndex ? 'current' : ''}`}
              >
                {char}
              </span>
            ))}
          </div>
        )}

        {/* Result Popup */}
        {raceState === 'finished' && (
          <div className="result-overlay">
            <div className="result-popup">
              <div className="result-popup-title">🏁 Race Complete!</div>
              <div className="result-popup-wpm">{wpm}</div>
              <div className="result-popup-wpm-label">Your WPM</div>
              <div className="result-popup-stats">
                <div className="result-popup-stat">
                  <div className="result-popup-stat-value">{accuracy}%</div>
                  <div className="result-popup-stat-label">Accuracy</div>
                </div>
              </div>
              <div className="result-popup-ranking">
                {[...players].sort((a, b) => (a.position || 99) - (b.position || 99)).map((p, i) => (
                  <div key={i} className="result-popup-ranking-item">
                    <span className="result-popup-ranking-rank">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <span className="result-popup-ranking-name">{p.username}</span>
                    <span className="result-popup-ranking-wpm">{p.wpm} WPM</span>
                  </div>
                ))}
              </div>
              <div className="result-popup-actions">
                <button className="btn btn-primary btn-lg" onClick={handleStartRace}>
                  🔄 Race Again
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/multiplayer')}>
                  Leave Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
