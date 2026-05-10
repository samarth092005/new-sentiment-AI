import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { ShieldAlert, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlobalLoader from '../ui/GlobalLoader';

export default function PublicLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <GlobalLoader isLoading={true} text="Starting Fuzzo..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2"
        >
          <ShieldAlert className="text-blue-600" />
          Fuzzo
        </Link>

        <div className="flex gap-4 items-center">
          <Link
            to="/login"
            className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center mt-auto">
        <p>© 2026 Fuzzo AI Intelligence Platform. MVP Phase 3.</p>
      </footer>
    </div>
  );
}
