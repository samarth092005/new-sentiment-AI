import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, Users, MessageSquare, ArrowUpRight, Layers,
  BrainCircuit, Loader2, Lightbulb, AlertTriangle, ShieldCheck,
  TrendingDown, ChevronRight
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import GlobalLoader from '../components/ui/GlobalLoader';
import PriorityAlertCard from '../components/ui/PriorityAlertCard';
import axios from 'axios';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

const RISK_CONFIG = {
  low:      { label: 'Low Risk',      badge: 'bg-green-100 text-green-700',   dot: 'bg-green-400' },
  medium:   { label: 'Moderate Risk', badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400' },
  high:     { label: 'High Risk',     badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  critical: { label: 'Critical Risk', badge: 'bg-red-100 text-red-700',       dot: 'bg-red-500'    },
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 1284,
    positive: 65,
    neutral: 20,
    negative: 15,
    departments: [
      { name: 'Customer Support', value: 400 },
      { name: 'Delivery', value: 350 },
      { name: 'Product Quality', value: 250 },
      { name: 'General Feedback', value: 284 }
    ],
    trend: [
      { name: 'Mon', positive: 40, negative: 10 },
      { name: 'Tue', positive: 30, negative: 15 },
      { name: 'Wed', positive: 45, negative: 5  },
      { name: 'Thu', positive: 50, negative: 8  },
      { name: 'Fri', positive: 65, negative: 12 },
      { name: 'Sat', positive: 55, negative: 10 },
      { name: 'Sun', positive: 70, negative: 5  },
    ]
  });

  const [loading, setLoading]           = useState(true);
  const [intelligence, setIntelligence] = useState(null);
  const [aiLoading, setAiLoading]       = useState(false);
  const [reviewContext, setReviewContext] = useState([]);

  // ── Firestore fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const q = query(collection(db, 'history'), orderBy('timestamp', 'desc'), limit(40));
        const snap = await getDocs(q);
        let total = 0, pos = 0, neg = 0, neu = 0;
        const depts = {};
        const ctx   = [];

        snap.forEach((doc) => {
          const d = doc.data();
          if (d.type === 'single') {
            total++;
            if (d.sentiment === 'Positive') pos++;
            else if (d.sentiment === 'Negative') neg++;
            else neu++;
            const dept = d.department || 'General Feedback';
            depts[dept] = (depts[dept] || 0) + 1;

            if (ctx.length < 25 && d.review && d.sentiment) {
              ctx.push({
                review:     d.review.substring(0, 220),
                sentiment:  d.sentiment,
                department: d.department || 'General',
                timestamp:  d.timestamp  || new Date().toISOString(),
              });
            }
          } else if (d.type === 'bulk') {
            total += d.total || 0;
            pos   += Math.round(((d.total || 0) * (d.positive_percent || 0)) / 100);
          }
        });

        setReviewContext(ctx);

        if (total > 0) {
          const formattedDepts = Object.keys(depts).map(k => ({ name: k, value: depts[k] }));
          setStats(prev => ({
            ...prev,
            total:       prev.total + total,
            positive:    Math.round(((prev.total * prev.positive / 100) + pos) / (prev.total + total) * 100),
            negative:    Math.round(((prev.total * prev.negative / 100) + neg) / (prev.total + total) * 100),
            departments: formattedDepts.length > 0 ? formattedDepts : prev.departments,
          }));
        }
      } catch (err) {
        console.error('Dashboard Firestore error (using mock data):', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // ── AI Intelligence fetch (runs after context ready) ─────────────────────
  useEffect(() => {
    if (reviewContext.length === 0) return;
    const fetchIntelligence = async () => {
      setAiLoading(true);
      try {
        const res = await axios.post('http://localhost:8000/api/intelligence/dashboard', {
          context: reviewContext,
        });
        setIntelligence(res.data);
      } catch (err) {
        console.error('AI intelligence unavailable (non-blocking):', err);
      } finally {
        setAiLoading(false);
      }
    };
    fetchIntelligence();
  }, [reviewContext]);

  const sentimentData = [
    { name: 'Positive', value: stats.positive,                              color: '#22c55e' },
    { name: 'Neutral',  value: 100 - stats.positive - stats.negative,      color: '#94a3b8' },
    { name: 'Negative', value: stats.negative,                              color: '#ef4444' },
  ];

  if (loading) return <GlobalLoader isLoading text="Compiling dashboard metrics…" />;

  const riskCfg = RISK_CONFIG[intelligence?.risk_level] || RISK_CONFIG.low;

  return (
    <div className="flex-grow bg-slate-50 p-6 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Intelligence Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time customer intelligence and operational analytics.</p>
        </div>

        {/* ── AI Executive Intelligence Card ────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-400/20">
                  <BrainCircuit size={22} className="text-blue-400" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">AI Executive Intelligence</span>
                  <p className="text-white/60 text-xs mt-0.5">Powered by Emovix Gemini Engine</p>
                </div>
              </div>
              {intelligence && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${riskCfg.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${riskCfg.dot} animate-pulse`} />
                  {riskCfg.label}
                </span>
              )}
            </div>

            {aiLoading ? (
              <div className="flex items-center gap-3 text-white/60 py-4">
                <Loader2 size={18} className="animate-spin text-blue-400" />
                <span className="text-sm">Generating executive intelligence summary…</span>
              </div>
            ) : intelligence ? (
              <p className="text-white/85 leading-relaxed text-[15px]">
                {intelligence.executive_summary}
              </p>
            ) : (
              <p className="text-white/50 text-sm italic">
                AI intelligence unavailable. Ensure the backend is running and review history exists.
              </p>
            )}

            {intelligence?.department_risk && (
              <p className="mt-3 text-blue-200/70 text-xs border-t border-white/10 pt-3">
                <span className="font-semibold text-blue-200">Department Signal: </span>
                {intelligence.department_risk}
              </p>
            )}
          </div>
        </motion.div>

        {/* ── AI Smart Alerts ───────────────────────────────────────── */}
        <AnimatePresence>
          {intelligence?.alerts?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Operational Alerts
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {intelligence.alerts.map((alert, i) => (
                  <PriorityAlertCard
                    key={i}
                    index={i}
                    title={alert.title}
                    message={alert.message}
                    severity={alert.severity}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── KPI Cards ─────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">
          <KpiCard title="Total Reviews Analyzed" value={stats.total.toLocaleString()} trend="+12% this week" icon={<MessageSquare className="text-blue-500" />} delay={0} />
          <KpiCard title="Positive Sentiment"     value={`${stats.positive}%`}         trend="+2.4% this week" icon={<TrendingUp className="text-green-500" />}   delay={0.05} />
          <KpiCard title="Active Users"           value="342"                           trend="+5% this week"   icon={<Users className="text-indigo-500" />}        delay={0.1} />
        </div>

        {/* ── Emerging Issues + Recommendations ─────────────────────── */}
        {intelligence && (
          <div className="grid md:grid-cols-2 gap-6">

            {/* Top Emerging Issues */}
            {intelligence.top_issues?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-500" />
                  Top Emerging Issues
                </h3>
                <ul className="space-y-2.5">
                  {intelligence.top_issues.map((issue, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100"
                    >
                      <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                      {issue}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* AI Recommendations */}
            {intelligence.recommendations?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm"
              >
                <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Lightbulb size={18} className="text-yellow-500" />
                  AI Recommendations
                </h3>
                <ul className="space-y-2.5">
                  {intelligence.recommendations.map((rec, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 + 0.1 }}
                      className="flex items-start gap-3 text-sm text-slate-700 bg-blue-50/60 px-4 py-2.5 rounded-xl border border-blue-100"
                    >
                      <ChevronRight size={15} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}

        {/* ── Charts ────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 rounded-3xl md:col-span-2 border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={20} /> Sentiment Volume Trend
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="positive" fill="#3b82f6" radius={[4,4,0,0]} />
                  <Bar dataKey="negative" fill="#ef4444" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass p-6 rounded-3xl border border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-2">Sentiment Breakdown</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                {sentimentData.map(item => (
                  <div key={item.name} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass p-6 rounded-3xl border border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers className="text-indigo-500" size={20} /> Department Heat
              </h3>
              <div className="space-y-3">
                {stats.departments.slice(0, 4).map((dept, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{dept.name}</span>
                      <span className="text-slate-500">{dept.value}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min((dept.value / 500) * 100, 100)}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ title, value, trend, icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-2xl">{icon}</div>
        <div className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} className="mr-1" /> {trend}
        </div>
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
      </div>
    </motion.div>
  );
}
