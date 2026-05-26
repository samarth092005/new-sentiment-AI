import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlobalLoader from '../ui/GlobalLoader';

export default function PublicLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <GlobalLoader
        isLoading={true}
        text="Initializing Emovix..."
      />
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-slate-100 bg-white/70 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-slate-900 flex items-center gap-2.5 tracking-tight"
          >

            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldAlert className="text-white" size={20} />
            </div>

            Emovix
          </Link>

          {/* Navigation */}
          <div className="flex gap-8 items-center">

            <Link
              to="/login"
              className="text-slate-500 hover:text-slate-900 font-semibold text-sm transition-all"
            >
              Sign In
            </Link>

            <Link
              to="/login"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 text-sm font-bold"
            >
              Start Free
              <ArrowRight size={16} />
            </Link>

          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <main className="flex-grow flex flex-col pt-20">
        <Outlet />
      </main>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-slate-50 border-t border-slate-100 py-16">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col md:flex-row justify-between items-start gap-12">

            {/* Brand */}
            <div className="max-w-xs">

              <Link
                to="/"
                className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4"
              >

                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <ShieldAlert className="text-white" size={16} />
                </div>

                Emovix
              </Link>

              <p className="text-slate-500 text-sm leading-relaxed">
                Transforming customer signals into operational intelligence
                and AI-driven business insights.
              </p>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 gap-16">

              {/* Platform */}
              <div className="space-y-4">

                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Platform
                </h4>

                <ul className="space-y-3 text-sm text-slate-500">

                  <li>
                    <Link
                      to="/dashboard"
                      className="hover:text-slate-900 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/assistant"
                      className="hover:text-slate-900 transition-colors"
                    >
                      AI Copilot
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/login"
                      className="hover:text-slate-900 transition-colors"
                    >
                      Login
                    </Link>
                  </li>

                </ul>
              </div>

              {/* Resources */}
              <div className="space-y-4">

                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Resources
                </h4>

                <ul className="space-y-3 text-sm text-slate-500">

                  <li className="hover:text-slate-900 transition-colors cursor-pointer">
                    AI Intelligence
                  </li>

                  <li className="hover:text-slate-900 transition-colors cursor-pointer">
                    Operational Analytics
                  </li>

                  <li className="hover:text-slate-900 transition-colors cursor-pointer">
                    Customer Insights
                  </li>

                </ul>
              </div>

            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">

            <p>
              © 2026 Emovix AI Intelligence Platform. All rights reserved.
            </p>

            <div className="flex gap-6">

              <span className="hover:text-slate-600 transition-colors cursor-pointer">
                Privacy Policy
              </span>

              <span className="hover:text-slate-600 transition-colors cursor-pointer">
                Terms of Service
              </span>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}