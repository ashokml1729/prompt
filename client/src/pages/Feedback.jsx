import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Feedback() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    try {
      await api.post('/feedback', {
        name: user.username,
        email: user.email,
        message,
      });
      addToast('Thank you for your feedback!', 'success');
      setMessage('');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to submit feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Require login
  if (!user) {
    return (
      <div className="auth-page">
        <div className="card auth-card">
          <h2>💬 Feedback</h2>
          <p>Please sign in to share your feedback.</p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Login with Google</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: '560px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
          💬 Feedback
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>
          Share suggestions, report bugs, or just say hi.
        </p>

        <div className="card">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="feedback-message">Your Message</label>
              <textarea
                id="feedback-message"
                className="input"
                placeholder="Your feedback, suggestions, or bug reports..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading || !message.trim()}>
              {loading ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
