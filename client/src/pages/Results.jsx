import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  useEffect(() => {
    if (!data) {
      navigate('/test');
    }
  }, []);

  if (!data) return null;

  const getWpmLevel = (wpm) => {
    if (wpm >= 100) return { label: 'Lightning', color: '#fbbf24', emoji: '⚡' };
    if (wpm >= 80) return { label: 'Expert', color: '#a855f7', emoji: '🏆' };
    if (wpm >= 60) return { label: 'Advanced', color: '#22c55e', emoji: '🚀' };
    if (wpm >= 40) return { label: 'Intermediate', color: '#3b82f6', emoji: '👍' };
    return { label: 'Beginner', color: '#94a3b8', emoji: '🌱' };
  };

  const level = getWpmLevel(data.wpm);

  // Simple WPM chart
  const renderChart = () => {
    if (!data.wpmHistory || data.wpmHistory.length < 2) return null;
    const maxWpm = Math.max(...data.wpmHistory.map(h => h.wpm), 1);
    const width = 600;
    const height = 120;
    const points = data.wpmHistory.map((h, i) => {
      const x = (i / (data.wpmHistory.length - 1)) * width;
      const y = height - (h.wpm / maxWpm) * (height - 10);
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="card" style={{ marginBottom: '24px', padding: '20px' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '12px', fontWeight: 600 }}>
          WPM Over Time
        </h3>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '120px' }}>
          <polyline
            points={points}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.wpmHistory.map((h, i) => {
            const x = (i / (data.wpmHistory.length - 1)) * width;
            const y = height - (h.wpm / maxWpm) * (height - 10);
            return <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" />;
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{level.emoji}</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>
            {level.label} Typist
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {data.mode.replace('_', ' ')} mode
          </p>
        </div>

        <div className="results-grid">
          <div className="card result-card">
            <div className="stat-value" style={{ color: level.color }}>{data.wpm}</div>
            <div className="stat-label">WPM</div>
          </div>
          <div className="card result-card">
            <div className="stat-value">{data.accuracy}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="card result-card">
            <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>{data.rawWpm}</div>
            <div className="stat-label">Raw WPM</div>
          </div>
          <div className="card result-card">
            <div className="stat-value" style={{ color: data.errors > 0 ? 'var(--error)' : 'var(--success)' }}>
              {data.errors}
            </div>
            <div className="stat-label">Errors</div>
          </div>
        </div>

        {renderChart()}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/test" className="btn btn-primary btn-lg">
            Try Again
          </Link>
          <Link to="/race" className="btn btn-secondary btn-lg">
            Street Race
          </Link>
        </div>
      </div>
    </div>
  );
}
