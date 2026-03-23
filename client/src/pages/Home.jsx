import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <h1>Type Faster.<br />Race Further.</h1>
          <p>
            Sharpen your typing skills with real-time speed tests, compete in street races,
            and challenge friends in multiplayer. How fast can you go?
          </p>
          <div className="hero-actions">
            <Link to="/test" className="btn btn-primary btn-lg">
              ⌨️ Start Typing Test
            </Link>
            <Link to="/race" className="btn btn-secondary btn-lg">
              🏎️ Street Race
            </Link>
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
              <div className="feature-icon">📝</div>
              <h3>Practice</h3>
              <p>Hone your skills with dedicated practice mode. Improve accuracy and build muscle memory.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
