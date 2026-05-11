import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from 'firebase/auth';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import {
  User, Mail, Calendar, Activity, TrendingUp, AlertTriangle,
  Edit2, Check, X, FileText, Database, BrainCircuit, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── Skeleton loader ───────────────────────────────────────────────────────────
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, iconColor, label, value, loading }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4"
    >
      <div className={`p-3.5 rounded-xl ${iconBg}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {loading
          ? <Skeleton className="h-7 w-16 mt-1" />
          : <p className="text-2xl font-bold text-slate-800">{value}</p>
        }
      </div>
    </motion.div>
  );
}

// ── Activity item ──────────────────────────────────────────────────────────────
function ActivityItem({ item, index }) {
  const config = {
    single: { icon: FileText,  color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'Review Analyzed' },
    bulk:   { icon: Database,  color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'CSV Bulk Upload' },
  };
  const cfg  = config[item.type] || config.single;
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-start gap-3"
    >
      <div className={`p-2 rounded-lg ${cfg.bg} flex-shrink-0 mt-0.5`}>
        <Icon size={15} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700">{cfg.label}</p>
        {item.type === 'single' && item.review && (
          <p className="text-xs text-slate-500 truncate mt-0.5">"{item.review.substring(0, 60)}…"</p>
        )}
        {item.type === 'bulk' && (
          <p className="text-xs text-slate-500 mt-0.5">{item.total} reviews · {item.positive_percent}% positive</p>
        )}
      </div>
      <span className="text-[11px] text-slate-400 flex-shrink-0 mt-0.5 flex items-center gap-1">
        <Clock size={11} />
        {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '—'}
      </span>
    </motion.div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Profile() {
  const { user } = useAuth();

  const [statsLoading,    setStatsLoading]    = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [editing,         setEditing]         = useState(false);
  const [displayName,     setDisplayName]     = useState(user?.displayName || '');
  const [saving,          setSaving]          = useState(false);

  const [stats, setStats] = useState({
    totalAnalyses:  0,
    positiveCount:  0,
    negativeCount:  0,
    neutralCount:   0,
    bulkReports:    0,
    topDepartment:  '—',
  });
  const [recentActivity, setRecentActivity] = useState([]);

  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  // ── Fetch stats (UID-scoped) ─────────────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const snap = await getDocs(
          query(collection(db, 'history'), where('uid', '==', user.uid))
        );
        let total = 0, pos = 0, neg = 0, neu = 0, bulk = 0;
        const deptMap = {};

        snap.forEach(doc => {
          const d = doc.data();
          if (d.type === 'single') {
            total++;
            if (d.sentiment === 'Positive') pos++;
            else if (d.sentiment === 'Negative') neg++;
            else neu++;
            const dept = d.department || 'General';
            deptMap[dept] = (deptMap[dept] || 0) + 1;
          } else if (d.type === 'bulk') {
            bulk++;
            total += d.total || 0;
          }
        });

        const topDept = Object.entries(deptMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

        if (!cancelled) {
          setStats({ totalAnalyses: total, positiveCount: pos, negativeCount: neg, neutralCount: neu, bulkReports: bulk, topDepartment: topDept });
          setStatsLoading(false);
        }
      } catch (err) {
        console.error('[Profile] Stats fetch failed:', err);
        if (!cancelled) setStatsLoading(false);
      }
    };

    fetchStats();
    return () => { cancelled = true; };
  }, [user?.uid]);

  // ── Fetch recent activity (UID-scoped) ────────────────────────────────────
  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;

    const fetchActivity = async () => {
      try {
        const q = query(
          collection(db, 'history'),
          where('uid', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(6)
        );
        const snap = await getDocs(q);
        const items = [];
        snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
        if (!cancelled) { setRecentActivity(items); setActivityLoading(false); }
      } catch (err) {
        console.error('[Profile] Activity fetch failed:', err);
        if (!cancelled) setActivityLoading(false);
      }
    };

    fetchActivity();
    return () => { cancelled = true; };
  }, [user?.uid]);

  // ── Save display name ────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!displayName.trim()) { toast.error('Display name cannot be empty.'); return; }
    setSaving(true);
    try {
      await updateProfile(auth.currentUser, { displayName: displayName.trim() });
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error('[Profile] Update failed:', err);
      toast.error('Failed to update profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => { setDisplayName(user?.displayName || ''); setEditing(false); };

  const getInitials = () => {
    const name = displayName || user?.displayName || user?.email;
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-6">

      {/* ── Profile Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
      >
        {/* Cover */}
        <div className="h-28 md:h-36 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        </div>

        <div className="px-5 md:px-8 pb-7 relative">
          {/* Avatar row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white p-1.5 shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl text-white font-bold">
                {getInitials()}
              </div>
            </div>
          </div>

          {/* Name + email */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {editing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    className="text-xl font-bold text-slate-800 border-b-2 border-blue-500 outline-none bg-transparent w-64 pb-0.5"
                    placeholder="Display name"
                  />
                  <button onClick={handleSaveName} disabled={saving}
                    className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                    {saving ? <span className="animate-spin block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <Check size={15} />}
                  </button>
                  <button onClick={cancelEdit}
                    className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition-colors">
                    <X size={15} />
                  </button>
                </motion.div>
              ) : (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-slate-800">{user?.displayName || 'Emovix User'}</h2>
                  <button onClick={() => setEditing(true)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit name">
                    <Edit2 size={15} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-slate-500 text-sm">
              <span className="flex items-center gap-1.5"><Mail size={14} /> {user?.email}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined {joinDate}</span>
            </div>
          </div>

          {/* Stats grid */}
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard icon={Activity}      iconBg="bg-blue-50"   iconColor="text-blue-600"   label="Total Analyses"  value={stats.totalAnalyses.toLocaleString()} loading={statsLoading} />
            <StatCard icon={TrendingUp}    iconBg="bg-green-50"  iconColor="text-green-600"  label="Positive Reviews" value={stats.positiveCount.toLocaleString()}  loading={statsLoading} />
            <StatCard icon={AlertTriangle} iconBg="bg-red-50"    iconColor="text-red-600"    label="Negative Reviews" value={stats.negativeCount.toLocaleString()}  loading={statsLoading} />
            <StatCard icon={Database}      iconBg="bg-indigo-50" iconColor="text-indigo-600" label="Bulk Reports Run"  value={stats.bulkReports.toLocaleString()}    loading={statsLoading} />
            <StatCard icon={BrainCircuit}  iconBg="bg-purple-50" iconColor="text-purple-600" label="Top Department"   value={stats.topDepartment}                   loading={statsLoading} />
            <StatCard icon={User}          iconBg="bg-slate-100" iconColor="text-slate-600"  label="Neutral Reviews"  value={stats.neutralCount.toLocaleString()}   loading={statsLoading} />
          </div>
        </div>
      </motion.div>

      {/* ── Recent Activity ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 md:p-7"
      >
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5">Recent Activity</h3>
        {activityLoading ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-9 h-9 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-56" />
                </div>
              </div>
            ))}
          </div>
        ) : recentActivity.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            No activity yet. Start analyzing customer reviews to build your activity feed!
          </p>
        ) : (
          <div className="space-y-4 divide-y divide-slate-50">
            {recentActivity.map((item, i) => (
              <div key={item.id} className={i > 0 ? 'pt-4' : ''}>
                <ActivityItem item={item} index={i} />
              </div>
            ))}
          </div>
        )}
      </motion.div>

    </div>
  );
}
