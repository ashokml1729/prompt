import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));

const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const TypingTest = lazy(() => import('./pages/TypingTest'));
const Results = lazy(() => import('./pages/Results'));
const StreetRace = lazy(() => import('./pages/StreetRace'));
const Multiplayer = lazy(() => import('./pages/Multiplayer'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Practice = lazy(() => import('./pages/Practice'));
const Feedback = lazy(() => import('./pages/Feedback'));

function LoadingFallback() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/test" element={<TypingTest />} />
                <Route path="/results" element={<Results />} />
                <Route path="/race" element={<StreetRace />} />
                <Route path="/multiplayer" element={<Multiplayer />} />
                <Route path="/multiplayer/:code" element={<Multiplayer />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/practice" element={<Practice />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
