import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, RefreshCw, AlertTriangle } from 'lucide-react';

/**
 * Reusable React Error Boundary for Emovix.
 *
 * Props:
 *   variant  — 'page' | 'card' | 'widget'   (default: 'card')
 *   children — the component tree to protect
 *
 * Usage:
 *   <ErrorBoundary variant="card">
 *     <MyComponent />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, info) {
    console.error('[Emovix ErrorBoundary] Component failure:', error, info?.componentStack);
  }

  handleReset() {
    this.setState({ hasError: false, errorMessage: '' });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const variant = this.props.variant || 'card';

    // ── Page-level fallback ─────────────────────────────────────────────────
    if (variant === 'page') {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center"
          >
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={32} className="text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Page temporarily unavailable
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              The Emovix platform encountered an unexpected issue with this view.
              Core platform functionality remains operational.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Reload View
            </button>
          </motion.div>
        </div>
      );
    }

    // ── Card-level fallback ─────────────────────────────────────────────────
    if (variant === 'card') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-sm"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} className="text-amber-500" />
          </div>
          <h3 className="text-base font-bold text-slate-700 mb-1">
            Component temporarily unavailable
          </h3>
          <p className="text-slate-400 text-sm mb-5 max-w-xs mx-auto">
            This section encountered an issue. Other platform features are unaffected.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 px-5 py-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-xl text-sm font-medium text-slate-600 transition-all"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </motion.div>
      );
    }

    // ── Widget-level fallback (compact inline) ──────────────────────────────
    return (
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700">
        <AlertTriangle size={15} className="flex-shrink-0" />
        <span>This widget encountered an issue.</span>
        <button
          onClick={this.handleReset}
          className="ml-auto flex items-center gap-1 text-amber-600 hover:text-amber-800 font-medium underline underline-offset-2"
        >
          <RefreshCw size={12} />
          Retry
        </button>
      </div>
    );
  }
}
