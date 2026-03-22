import { useState, useEffect } from 'react';
import api from '../services/api';

const PERIODS = [
  { label: 'All Time', value: 'all' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Daily', value: 'daily' },
];

const MODES = [
  { label: 'All Modes', value: '' },
  { label: '15s', value: 'time_15' },
  { label: '30s', value: 'time_30' },
  { label: '60s', value: 'time_60' },
  { label: '120s', value: 'time_120' },
];

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [period, setPeriod] = useState('all');
  const [mode, setMode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ period, limit: '100' });
    if (mode) params.append('mode', mode);

    api.get(`/leaderboard?${params}`)
      .then(res => setEntries(res.data))
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, [period, mode]);

  const getRankClass = (rank) => {
    if (rank === 1) return 'leaderboard-rank gold';
    if (rank === 2) return 'leaderboard-rank silver';
    if (rank === 3) return 'leaderboard-rank bronze';
    return 'leaderboard-rank';
  };

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, marginBottom: '32px' }}>
          🏆 Leaderboard
        </h1>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div className="mode-selector">
            {PERIODS.map(p => (
              <button
                key={p.value}
                className={`mode-btn ${period === p.value ? 'active' : ''}`}
                onClick={() => setPeriod(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mode-selector">
            {MODES.map(m => (
              <button
                key={m.value}
                className={`mode-btn ${mode === m.value ? 'active' : ''}`}
                onClick={() => setMode(m.value)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="loading-spinner"><div className="spinner"></div></div>
          ) : entries.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No results yet. Be the first to set a score!
            </div>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Typist</th>
                  <th>WPM</th>
                  <th>Accuracy</th>
                  <th>Mode</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td className={getRankClass(e.rank)}>
                      {getRankEmoji(e.rank)}
                    </td>
                    <td style={{ fontWeight: 600 }}>{e.username}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{e.wpm}</td>
                    <td>{e.accuracy}%</td>
                    <td style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                      {e.mode?.replace('_', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
