import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import AuthLayout   from './components/layout/AuthLayout';
import PublicLayout from './components/layout/PublicLayout';
import GlobalLoader from './components/ui/GlobalLoader';
import ErrorBoundary from './components/ui/ErrorBoundary';

import { AuthProvider }  from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// ── Lazy-loaded pages (code splitting for faster initial load) ───────────────
const Landing   = lazy(() => import('./pages/Landing'));
const Login     = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analyze   = lazy(() => import('./pages/Analyze'));
const History   = lazy(() => import('./pages/History'));
const Profile   = lazy(() => import('./pages/Profile'));
const Settings  = lazy(() => import('./pages/Settings'));
const Assistant = lazy(() => import('./pages/Assistant'));

const PageFallback = <GlobalLoader isLoading text="Loading…" />;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#fff',
                color: '#334155',
                boxShadow: '0 4px 16px -2px rgb(0 0 0 / 0.12)',
                borderRadius: '14px',
                border: '1px solid #f1f5f9',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          {/* Root boundary — catches anything that escapes page boundaries */}
          <ErrorBoundary variant="page">
            <Suspense fallback={PageFallback}>
              <Routes>
                {/* Public routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/"      element={<ErrorBoundary variant="page"><Landing /></ErrorBoundary>} />
                  <Route path="/login" element={<ErrorBoundary variant="page"><Login /></ErrorBoundary>} />
                </Route>

                {/* Authenticated routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/dashboard" element={<ErrorBoundary variant="page"><Dashboard /></ErrorBoundary>} />
                  <Route path="/analyze"   element={<ErrorBoundary variant="page"><Analyze /></ErrorBoundary>} />
                  <Route path="/history"   element={<ErrorBoundary variant="page"><History /></ErrorBoundary>} />
                  <Route path="/profile"   element={<ErrorBoundary variant="page"><Profile /></ErrorBoundary>} />
                  <Route path="/settings"  element={<ErrorBoundary variant="page"><Settings /></ErrorBoundary>} />
                  <Route path="/assistant" element={<ErrorBoundary variant="page"><Assistant /></ErrorBoundary>} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;