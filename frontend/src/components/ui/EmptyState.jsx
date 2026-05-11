import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

/**
 * EmptyState — enhanced contextual empty state component.
 *
 * Props:
 *   icon        — Lucide icon component
 *   title       — primary heading
 *   description — explanatory text
 *   subtitle    — smaller text below description (optional)
 *   action      — { label, onClick } object OR a React node (optional)
 *   variant     — 'default' | 'ai-degraded' (optional, default: 'default')
 */
export default function EmptyState({ icon: Icon, title, description, subtitle, action, variant = 'default' }) {
  const isAiDegraded = variant === 'ai-degraded';

  const iconBg = isAiDegraded
    ? 'bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100'
    : 'bg-slate-50 border border-slate-100';

  const iconColor = isAiDegraded ? 'text-indigo-400' : 'text-slate-400';
  const DisplayIcon = isAiDegraded ? BrainCircuit : Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-10 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200"
    >
      <div className={`p-4 rounded-2xl mb-5 ${iconBg}`}>
        <DisplayIcon size={40} className={iconColor} />
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>

      <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
        {description}
      </p>

      {subtitle && (
        <p className="text-slate-400 text-xs mt-2 max-w-xs leading-relaxed">
          {subtitle}
        </p>
      )}

      {action && (
        <div className="mt-6">
          {/* Support both { label, onClick } shorthand and arbitrary React nodes */}
          {action.label && action.onClick ? (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-blue-500/25 transition-all"
            >
              {action.icon && <action.icon size={15} />}
              {action.label}
            </button>
          ) : (
            action
          )}
        </div>
      )}
    </motion.div>
  );
}
