import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <h1>Type Faster.<br />Race Further.</h1>
          <p>
            Sharpen your typing skills with real-time speed tests, compete in street races,
            and climb the global leaderboard. How fast can you go?
          </p>
          <div className="hero-actions">
            <Link to="/test" className="btn btn-primary btn-lg">
              ⌨️ Start Typing Test
            </Link>
            <Link to="/race" className="btn btn-secondary btn-lg">
              🏎️ Street Race
            </Link>
            {!user && (
              <Link to="/login" className="btn btn-ghost btn-lg">
                Login with Google →
              </Link>
            )}
          </div>

          <div className="hero-features">
            <div className="card feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Speed Tests</h3>
              <p>Multiple modes — 15s, 30s, 60s, 120s or word-count based. Track your WPM and accuracy in real time.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">🏁</div>
              <h3>Street Race</h3>
              <p>Watch your car zoom across the track as you type. The faster you type, the faster you go!</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">👥</div>
              <h3>Multiplayer</h3>
              <p>Race against friends or strangers in real-time multiplayer rooms. Create or join races instantly.</p>
            </div>
            <div className="card feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Leaderboard</h3>
              <p>Compete for the top spot on the global leaderboard. Filter by time period and test mode.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
