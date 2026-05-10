import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Info, Zap } from 'lucide-react';

const SEVERITY = {
  low: {
    bg: 'bg-sky-50', border: 'border-sky-200', badge: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-400', label: 'Low', icon: Info, iconColor: 'text-sky-500', shadow: '',
  },
  medium: {
    bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400', label: 'Medium', icon: AlertTriangle, iconColor: 'text-amber-500', shadow: '',
  },
  high: {
    bg: 'bg-orange-50', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500', label: 'High', icon: ShieldAlert, iconColor: 'text-orange-500',
    shadow: 'shadow-orange-100 shadow-md',
  },
  critical: {
    bg: 'bg-red-50', border: 'border-red-300', badge: 'bg-red-100 text-red-700',
    dot: 'bg-red-500', label: 'Critical', icon: Zap, iconColor: 'text-red-500',
    shadow: 'shadow-red-100 shadow-md',
  },
};

export default function PriorityAlertCard({ title, message, severity = 'medium', index = 0 }) {
  const cfg = SEVERITY[severity] || SEVERITY.medium;
  const Icon = cfg.icon;
  const isPulsing = severity === 'high' || severity === 'critical';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`relative flex items-start gap-4 p-4 rounded-2xl border ${cfg.bg} ${cfg.border} ${cfg.shadow} overflow-hidden`}
    >
      {/* Glow strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.dot}`} />

      {/* Icon */}
      <div className={`flex-shrink-0 p-2 rounded-xl bg-white/70 ${cfg.iconColor}`}>
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${cfg.badge}`}>
            {isPulsing && (
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse inline-block`} />
            )}
            {cfg.label}
          </span>
        </div>
        <p className="text-slate-600 text-xs leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}
