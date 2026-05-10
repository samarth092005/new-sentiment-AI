import React from 'react';
import { useLocation } from 'react-router-dom';
import DropdownMenu from '../ui/DropdownMenu';
import { Bell } from 'lucide-react';

export default function Topbar() {
  const location = useLocation();
  
  // Format the path name to be a nice title
  const getPageTitle = () => {
    const path = location.pathname.substring(1);
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="text-slate-400 hover:text-blue-600 transition-colors relative">
          <Bell size={22} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>
        <DropdownMenu />
      </div>
    </header>
  );
}
