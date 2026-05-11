import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  History as HistoryIcon,
  MessageSquare,
  Settings,
  User,
  ShieldAlert,
  Bot,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard',  path: '/dashboard', icon: BarChart3 },
  { name: 'Analyze',    path: '/analyze',   icon: MessageSquare },
  { name: 'History',    path: '/history',   icon: HistoryIcon },
  { name: 'AI Copilot', path: '/assistant', icon: Bot, badge: true },
];

const BOTTOM_ITEMS = [
  { name: 'Profile',  path: '/profile',  icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

function NavItem({ item, onClick }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm
        ${isActive
          ? 'bg-blue-50 text-blue-700 shadow-sm'
          : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <item.icon size={19} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
          <span className="flex-1">{item.name}</span>
          {item.badge && !isActive && (
            <span className="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-1.5 py-0.5 rounded-full leading-none">
              NEW
            </span>
          )}
          {isActive && (
            <motion.div
              layoutId="active-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-blue-600 rounded-r-full"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 flex items-center justify-between flex-shrink-0">
        <NavLink
          to="/dashboard"
          onClick={onClose}
          className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          <ShieldAlert className="text-blue-600" size={22} />
          Emovix
        </NavLink>
        {/* Close on mobile */}
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main nav */}
      <div className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Overview</p>
        {NAV_ITEMS.map(item => (
          <NavItem key={item.path} item={item} onClick={onClose} />
        ))}
      </div>

      {/* Bottom nav */}
      <div className="px-4 py-4 border-t border-slate-100 flex flex-col gap-1">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">Account</p>
        {BOTTOM_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm
              ${isActive
                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={19} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex-col z-40 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — slide-in */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 z-50 flex flex-col md:hidden shadow-2xl"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
