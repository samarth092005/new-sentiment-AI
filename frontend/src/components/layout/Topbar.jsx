import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DropdownMenu from '../ui/DropdownMenu';

import {
  Bell,
  Menu,
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
} from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Intelligence Dashboard',
  '/analyze': 'Analyze Feedback',
  '/history': 'Analysis Timeline',
  '/assistant': 'AI Copilot',
  '/profile': 'My Profile',
  '/settings': 'Settings',
};

export default function Topbar({ onMenuToggle }) {

  const location = useLocation();
  const navigate = useNavigate();

  const title =
    PAGE_TITLES[location.pathname] || 'Emovix';

  const [open, setOpen] = useState(false);

  const notificationRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: 'Operational risk detected',
      description:
        'Spike in negative delivery feedback.',
      icon: AlertTriangle,
      color: 'text-red-500',
      time: '2m ago',
    },

    {
      id: 2,
      title: 'Dashboard intelligence updated',
      description:
        'AI insights refreshed successfully.',
      icon: BrainCircuit,
      color: 'text-indigo-500',
      time: '10m ago',
    },

    {
      id: 3,
      title: 'Bulk analysis completed',
      description:
        'Customer analytics report generated.',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      time: '1h ago',
    },
  ];

  useEffect(() => {

    function handleClickOutside(event) {

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };

  }, []);

  return (
    <header className="h-16 md:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 flex-shrink-0">

      {/* Left Side */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        {/* Page Title */}
        <h1 className="text-lg md:text-2xl font-bold text-slate-800 truncate">
          {title}
        </h1>

      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4 md:gap-6">

        {/* Notifications */}
        <div
          className="relative"
          ref={notificationRef}
        >

          <button
            onClick={() => setOpen(prev => !prev)}
            className="text-slate-400 hover:text-blue-600 transition-colors relative"
            aria-label="Notifications"
          >

            <Bell size={20} />

            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" />

          </button>

          {open && (

            <div className="absolute right-0 mt-4 w-[360px] bg-white border border-slate-200 rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

                <div>

                  <h3 className="text-sm font-bold text-slate-900">
                    Notifications
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Operational intelligence updates
                  </p>

                </div>

                <span className="text-[10px] font-bold bg-red-50 text-red-600 px-2 py-1 rounded-full">
                  {notifications.length} New
                </span>

              </div>

              {/* Notification List */}
              <div className="max-h-[360px] overflow-y-auto">

                {notifications.map((item) => {

                  const Icon = item.icon;

                  return (

                    <div
                      key={item.id}
                      className="px-5 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    >

                      <div className="flex gap-3">

                        <div
                          className={`w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center ${item.color}`}
                        >
                          <Icon size={18} />
                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center justify-between gap-2">

                            <h4 className="text-sm font-semibold text-slate-800 truncate">
                              {item.title}
                            </h4>

                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {item.time}
                            </span>

                          </div>

                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {item.description}
                          </p>

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 text-center">

                <button 
                    onClick={() => {
                    navigate('/history');
                    setOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View all activity
                </button>

              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <DropdownMenu />

      </div>
    </header>
  );
}