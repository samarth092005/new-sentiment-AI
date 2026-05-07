import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShieldAlert, BarChart3, History as HistoryIcon, LogIn } from 'lucide-react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
            <ShieldAlert className="text-blue-600" /> Fuzzo
          </Link>
          <div className="flex gap-6 items-center">
            <Link to="/analyze" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Analyze</Link>
            <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"><BarChart3 size={18}/> Dashboard</Link>
            <Link to="/history" className="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1"><HistoryIcon size={18}/> History</Link>
            <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"><LogIn size={18}/> Login</Link>
          </div>
        </nav>

        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyze" element={<Analyze />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
        
        <footer className="bg-slate-900 text-slate-400 py-8 text-center">
          <p>© 2026 Fuzzo AI Intelligence Platform. MVP Phase 1.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
