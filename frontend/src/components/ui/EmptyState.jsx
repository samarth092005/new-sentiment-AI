import React from 'react';
import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200"
    >
      <div className="p-4 bg-slate-50 rounded-full mb-6">
        <Icon size={48} className="text-slate-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">
        {description}
      </p>
      {action && (
        <div>{action}</div>
      )}
    </motion.div>
  );
}
