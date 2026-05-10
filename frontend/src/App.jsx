import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import AuthLayout from './components/layout/AuthLayout';
import PublicLayout from './components/layout/PublicLayout';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#334155',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                borderRadius: '12px',
                border: '1px solid #f1f5f9'
              },
            }}
          />
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Authenticated Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;