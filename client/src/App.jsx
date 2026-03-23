import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const TypingTest = lazy(() => import('./pages/TypingTest'));
const Results = lazy(() => import('./pages/Results'));
const StreetRace = lazy(() => import('./pages/StreetRace'));
const Multiplayer = lazy(() => import('./pages/Multiplayer'));
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
        <ToastProvider>
          <Navbar />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<TypingTest />} />
              <Route path="/results" element={<Results />} />
              <Route path="/race" element={<StreetRace />} />
              <Route path="/multiplayer" element={<Multiplayer />} />
              <Route path="/multiplayer/:code" element={<Multiplayer />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/feedback" element={<Feedback />} />
            </Routes>
          </Suspense>
          <Footer />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
