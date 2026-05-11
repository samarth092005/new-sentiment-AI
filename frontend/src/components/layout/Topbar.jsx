import React from 'react';
import { useLocation } from 'react-router-dom';
import DropdownMenu from '../ui/DropdownMenu';
import { Bell, Menu } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Intelligence Dashboard',
  '/analyze':   'Analyze Feedback',
  '/history':   'Analysis Timeline',
  '/assistant': 'AI Copilot',
  '/profile':   'My Profile',
  '/settings':  'Settings',
};

export default function Topbar({ onMenuToggle }) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Emovix';

  return (
    <header className="h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg md:text-2xl font-bold text-slate-800 truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="text-slate-400 hover:text-blue-600 transition-colors relative" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />
        </button>
        <DropdownMenu />
      </div>
    </header>
  );
}
