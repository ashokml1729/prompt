import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    if (user) {
      api.get(`/profile/${user.id}`)
        .then(res => {
          setProfile(res.data);
          setNewUsername(res.data.user.username);
        })
        .catch(() => addToast('Failed to load profile', 'error'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleUpdateUsername = async () => {
    try {
      await api.put('/profile', { username: newUsername });
      setProfile(prev => ({
        ...prev,
        user: { ...prev.user, username: newUsername },
      }));
      setEditing(false);
      addToast('Username updated!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Update failed', 'error');
    }
  };

  if (loading) {
    return <div className="page"><div className="loading-spinner"><div className="spinner"></div></div></div>;
  }

  if (!profile) return null;

  const { user: profileUser, stats, recentTests } = profile;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {profileUser.avatar ? (
              <img src={profileUser.avatar} alt={profileUser.username} />
            ) : (
              profileUser.username.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            {editing ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  className="input"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{ width: '200px' }}
                />
                <button className="btn btn-primary btn-sm" onClick={handleUpdateUsername}>Save</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{profileUser.username}</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>✏️ Edit</button>
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>
              Member since {new Date(profileUser.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="results-grid" style={{ marginBottom: '32px' }}>
          <div className="card result-card">
            <div className="stat-value">{stats.avg_wpm}</div>
            <div className="stat-label">Avg WPM</div>
          </div>
          <div className="card result-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.best_wpm}</div>
            <div className="stat-label">Best WPM</div>
          </div>
          <div className="card result-card">
            <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>{stats.total_tests}</div>
            <div className="stat-label">Total Tests</div>
          </div>
          <div className="card result-card">
            <div className="stat-value">{stats.avg_accuracy}%</div>
            <div className="stat-label">Avg Accuracy</div>
          </div>
        </div>

        {/* Test History */}
        <h3 style={{ fontWeight: 700, marginBottom: '16px' }}>Recent Tests</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {recentTests.length === 0 ? (
            <p style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              No tests yet. Start typing!
            </p>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>WPM</th>
                  <th>Accuracy</th>
                  <th>Mode</th>
                  <th>Errors</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTests.map(test => (
                  <tr key={test.id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent)' }}>{test.wpm}</td>
                    <td>{test.accuracy}%</td>
                    <td style={{ fontSize: '0.82rem' }}>{test.mode?.replace('_', ' ')}</td>
                    <td style={{ color: test.errors > 0 ? 'var(--error)' : 'var(--success)' }}>
                      {test.errors}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                      {new Date(test.created_at).toLocaleDateString()}
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
