import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, MessageSquare, ArrowUpRight, AlertTriangle, Layers } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import GlobalLoader from '../components/ui/GlobalLoader';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

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
      { name: 'Wed', positive: 45, negative: 5 },
      { name: 'Thu', positive: 50, negative: 8 },
      { name: 'Fri', positive: 65, negative: 12 },
      { name: 'Sat', positive: 55, negative: 10 },
      { name: 'Sun', positive: 70, negative: 5 },
    ]
  });

  const [loading, setLoading] = useState(true);

  // We can fetch real data from Firestore here
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'history'));
        let total = 0;
        let pos = 0;
        let neg = 0;
        let neu = 0;
        const depts = {};

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.type === 'single') {
            total++;
            if (data.sentiment === 'Positive') pos++;
            else if (data.sentiment === 'Negative') neg++;
            else neu++;

            const d = data.department || 'General Feedback';
            depts[d] = (depts[d] || 0) + 1;
          } else if (data.type === 'bulk') {
            total += data.total || 0;
            // Rough estimation for bulk for simplicity
            pos += Math.round((data.total * data.positive_percent) / 100) || 0;
          }
        });

        if (total > 0) {
          const formattedDepts = Object.keys(depts).map(k => ({ name: k, value: depts[k] }));
          setStats(prev => ({
            ...prev,
            total: prev.total + total,
            positive: Math.round(((prev.total * prev.positive / 100) + pos) / (prev.total + total) * 100),
            negative: Math.round(((prev.total * prev.negative / 100) + neg) / (prev.total + total) * 100),
            // Just blending in the new department counts
            departments: formattedDepts.length > 0 ? formattedDepts : prev.departments
          }));
        }
      } catch (err) {
        console.error("Error fetching dashboard data, falling back to mock", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const sentimentData = [
    { name: 'Positive', value: stats.positive, color: '#22c55e' },
    { name: 'Neutral', value: 100 - stats.positive - stats.negative, color: '#94a3b8' },
    { name: 'Negative', value: stats.negative, color: '#ef4444' },
  ];

  // Logic for Priority Alerts
  const alerts = [];
  if (stats.negative > 20) { // Lowered threshold for demo purposes
    alerts.push({
      type: 'high',
      title: 'High Customer Dissatisfaction Detected',
      message: `${stats.negative}% of recent reviews are negative. Immediate action required.`
    });
  }
  
  const supportDept = stats.departments.find(d => d.name.includes('Support'));
  if (supportDept && (supportDept.value / stats.total) > 0.3) {
    alerts.push({
      type: 'medium',
      title: 'Support Team Bottleneck',
      message: 'Customer support complaints are unusually high this week.'
    });
  }

  if (loading) {
    return <GlobalLoader isLoading={true} text="Compiling dashboard metrics..." />;
  }

  return (
    <div className="flex-grow bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Intelligence Dashboard</h1>
          <p className="text-slate-500 mt-2">Overview of your customer sentiment metrics.</p>
        </div>

        {/* Priority Alerts */}
        {alerts.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {alerts.map((alert, idx) => (
              <AlertCard key={idx} type={alert.type} title={alert.title} message={alert.message} />
            ))}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <KpiCard
            title="Total Reviews Analyzed"
            value={stats.total.toLocaleString()}
            trend="+12% this week"
            icon={<MessageSquare className="text-blue-500" />}
          />
          <KpiCard
            title="Positive Sentiment"
            value={`${stats.positive}%`}
            trend="+2.4% this week"
            icon={<TrendingUp className="text-green-500" />}
          />
          <KpiCard
            title="Active Users"
            value="342"
            trend="+5% this week"
            icon={<Users className="text-indigo-500" />}
          />
        </div>

        {/* Charts */}
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
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="positive" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-3xl border border-slate-200"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-2">Sentiment Breakdown</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
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
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    {item.name}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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
                        className="h-2 rounded-full" 
                        style={{ width: `${Math.min((dept.value / 500) * 100, 100)}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
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

function KpiCard({ title, value, trend, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 rounded-2xl">
          {icon}
        </div>
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
