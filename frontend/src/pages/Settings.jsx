import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { Moon, Sun, Monitor, Bell, Shield, Key, LogOut } from 'lucide-react';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="flex-grow p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account preferences and application settings.</p>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Monitor size={20} /></div>
            <h2 className="text-xl font-bold text-slate-800">Appearance</h2>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-700">Theme Preference</h3>
              <p className="text-sm text-slate-500">Toggle between light and dark mode (Preview)</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={theme !== 'light' ? toggleTheme : undefined}
                className={`p-2 rounded-lg flex items-center gap-2 transition-all ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Sun size={18} /> <span className="text-sm font-medium">Light</span>
              </button>
              <button 
                onClick={theme !== 'dark' ? toggleTheme : undefined}
                className={`p-2 rounded-lg flex items-center gap-2 transition-all ${theme === 'dark' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Moon size={18} /> <span className="text-sm font-medium">Dark</span>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Account Settings */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Shield size={20} /></div>
            <h2 className="text-xl font-bold text-slate-800">Account Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-full shadow-sm"><Key size={18} className="text-slate-600" /></div>
                <div>
                  <h3 className="font-semibold text-slate-700">Password</h3>
                  <p className="text-sm text-slate-500">Last changed never</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                Update
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-full shadow-sm"><Bell size={18} className="text-slate-600" /></div>
                <div>
                  <h3 className="font-semibold text-slate-700">Notifications</h3>
                  <p className="text-sm text-slate-500">Manage email alerts</p>
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors">
                Configure
              </button>
            </div>
          </div>
        </motion.section>

        {/* Danger Zone */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm"
        >
           <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-red-800 text-lg">Sign Out</h3>
                <p className="text-sm text-red-600/80 mt-1">End your current session on this device.</p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-red-500/20"
              >
                <LogOut size={18} /> Logout
              </button>
           </div>
        </motion.section>
      </div>
    </div>
  );
}
