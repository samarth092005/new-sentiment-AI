import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function GlobalLoader({ isLoading, text = "Loading..." }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl border border-slate-100"
          >
            <div className="relative mb-6">
              <ShieldAlert size={48} className="text-blue-600" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center -m-4 border-2 border-dashed border-blue-400 rounded-full w-[80px] h-[80px]"
              />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-wide">{text}</h2>
            <div className="mt-4 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
