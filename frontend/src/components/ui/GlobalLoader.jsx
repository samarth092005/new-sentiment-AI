import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

/**
 * GlobalLoader — premium Emovix loading component.
 *
 * Props:
 *   isLoading — boolean to show/hide
 *   text      — loading message string OR array of staged messages
 *   variant   — 'overlay' (full-screen, default) | 'inline' (fills parent container)
 *
 * Staged loading example:
 *   text={["Connecting...", "Loading data...", "Almost ready..."]}
 */
export default function GlobalLoader({
  isLoading,
  text = 'Loading…',
  variant = 'overlay',
}) {
  const stages = Array.isArray(text) ? text : [text];
  const [stageIndex, setStageIndex] = useState(0);

  // Cycle through staged messages every 1.8s
  useEffect(() => {
    if (!isLoading || stages.length <= 1) {
      setStageIndex(0);
      return;
    }
    const id = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 1800);
    return () => clearInterval(id);
  }, [isLoading, stages.length]);

  const currentText = stages[stageIndex];

  // ── Inner content (shared between variants) ──────────────────────────────
  const content = (
    <motion.div
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.4 }}
      className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl border border-slate-100"
    >
      <div className="relative mb-6">
        <ShieldAlert size={44} className="text-blue-600" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
          className="absolute -inset-4 border-2 border-dashed border-blue-300 rounded-full"
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentText}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="text-[15px] font-bold text-slate-700 tracking-wide text-center max-w-[220px]"
        >
          {currentText}
        </motion.h2>
      </AnimatePresence>
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.15, ease: 'easeInOut' }}
            className="w-2 h-2 bg-blue-500 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );

  // ── Overlay variant (full-screen backdrop) ───────────────────────────────
  if (variant === 'overlay') {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50/80 backdrop-blur-md"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── Inline variant (fits parent container, no fixed positioning) ─────────
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-sm rounded-3xl"
        >
          {content}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
