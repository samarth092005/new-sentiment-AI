import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { User, Mail, Calendar, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import GlobalLoader from '../components/ui/GlobalLoader';

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    positiveCount: 0,
    negativeCount: 0,
    joinDate: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        // In a real app, you'd filter by user ID. Assuming all history is this user's for MVP.
        const q = query(collection(db, 'history')); 
        const querySnapshot = await getDocs(q);
        
        let total = 0;
        let pos = 0;
        let neg = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === 'single') {
            total++;
            if (data.sentiment === 'Positive') pos++;
            if (data.sentiment === 'Negative') neg++;
          } else if (data.type === 'bulk') {
            total += data.total || 0;
            pos += Math.round((data.total * data.positive_percent) / 100) || 0;
            neg += Math.round((data.total * (100 - data.positive_percent)) / 100) || 0; // rough est
          }
        });

        setStats(prev => ({
          ...prev,
          totalAnalyses: total,
          positiveCount: pos,
          negativeCount: neg,
        }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  if (loading) return <GlobalLoader isLoading={true} text="Loading Profile..." />;

  const getInitials = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className="flex-grow p-8 max-w-5xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl text-white font-bold">
                {getInitials()}
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">
              Edit Profile
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">{user?.displayName || 'SaaS User'}</h2>
            <div className="flex items-center gap-4 text-slate-500 mt-2">
              <span className="flex items-center gap-1"><Mail size={16}/> {user?.email}</span>
              <span className="flex items-center gap-1"><Calendar size={16}/> Joined {stats.joinDate}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Usage Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4"
            >
              <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Analyses</p>
                <p className="text-2xl font-bold text-slate-800">{stats.totalAnalyses.toLocaleString()}</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4"
            >
              <div className="p-4 bg-green-100 text-green-600 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Positive Insights</p>
                <p className="text-2xl font-bold text-slate-800">{stats.positiveCount.toLocaleString()}</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -2 }}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex items-center gap-4"
            >
              <div className="p-4 bg-red-100 text-red-600 rounded-xl">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Negative Insights</p>
                <p className="text-2xl font-bold text-slate-800">{stats.negativeCount.toLocaleString()}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
