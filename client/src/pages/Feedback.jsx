import { useState } from 'react';
import { useToast } from '../components/Toast';
import api from '../services/api';

export default function Feedback() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setLoading(true);

    try {
      await api.post('/feedback', { name, email, message });
      addToast('Thank you for your feedback!', 'success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to submit feedback', 'error');
    } finally {
      setLoading(false);
    }
  };

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
              <label htmlFor="feedback-name">Your Name</label>
              <input
                id="feedback-name"
                className="input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="feedback-email">Email</label>
              <input
                id="feedback-email"
                className="input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
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
            <button type="submit" className="btn btn-primary" disabled={loading || !name.trim() || !email.trim() || !message.trim()}>
              {loading ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
