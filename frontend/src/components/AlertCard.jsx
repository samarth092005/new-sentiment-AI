import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function AlertCard({ title, message, type = "high" }) {
  const isHigh = type === "high";
  const colors = isHigh 
    ? "bg-red-50 border-red-200 text-red-800 glow-red"
    : "bg-orange-50 border-orange-200 text-orange-800 glow-orange";
    
  const iconColor = isHigh ? "text-red-600" : "text-orange-600";

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-2xl border flex items-start gap-4 shadow-lg relative overflow-hidden ${colors}`}
    >
      {/* Pulse effect in background */}
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20 animate-pulse-fast ${isHigh ? 'bg-red-500' : 'bg-orange-500'}`}></div>
      
      <div className={`p-2 rounded-xl bg-white shadow-sm ${iconColor}`}>
        <AlertTriangle size={24} />
      </div>
      
      <div className="z-10">
        <h4 className="font-bold text-sm tracking-wide uppercase mb-1 flex items-center gap-2">
          {title}
          {isHigh && <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>}
        </h4>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </motion.div>
  );
}
