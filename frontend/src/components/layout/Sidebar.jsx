import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  History as HistoryIcon, 
  MessageSquare, 
  Settings,
  User,
  ShieldAlert,
  Bot
} from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Analyze', path: '/analyze', icon: MessageSquare },
    { name: 'History', path: '/history', icon: HistoryIcon },
    { name: 'AI Copilot', path: '/assistant', icon: Bot, badge: true },
  ];

  const bottomItems = [
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col hidden md:flex z-40">
      <div className="p-6">
        <NavLink to="/dashboard" className="flex items-center gap-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          <ShieldAlert className="text-blue-600" />
          Emovix
        </NavLink>
      </div>

      <div className="flex-1 px-4 py-6 flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
          Overview
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all
              ${isActive 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span className="flex-1">{item.name}</span>
                {item.badge && !isActive && (
                  <span className="text-[10px] font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-1.5 py-0.5 rounded-full leading-none">
                    NEW
                  </span>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
         <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
          Account
        </div>
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all
              ${isActive 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }
            `}
          >
             {({ isActive }) => (
               <>
                <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                {item.name}
               </>
             )}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
