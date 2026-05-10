import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import GlobalLoader from '../ui/GlobalLoader';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <GlobalLoader isLoading={true} text="Authenticating..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
