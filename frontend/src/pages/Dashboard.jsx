import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, MessageSquareWarning, ArrowUpRight } from 'lucide-react';

const sentimentData = [
  { name: 'Positive', value: 65, color: '#22c55e' },
  { name: 'Neutral', value: 20, color: '#94a3b8' },
  { name: 'Negative', value: 15, color: '#ef4444' },
];

const trendData = [
  { name: 'Mon', positive: 40, negative: 10 },
  { name: 'Tue', positive: 30, negative: 15 },
  { name: 'Wed', positive: 45, negative: 5 },
  { name: 'Thu', positive: 50, negative: 8 },
  { name: 'Fri', positive: 65, negative: 12 },
  { name: 'Sat', positive: 55, negative: 10 },
  { name: 'Sun', positive: 70, negative: 5 },
];

export default function Dashboard() {
  return (
    <div className="flex-grow bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Intelligence Dashboard</h1>
          <p className="text-slate-500 mt-2">Overview of your customer sentiment metrics.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <KpiCard 
            title="Total Reviews Analyzed" 
            value="1,284" 
            trend="+12% this week" 
            icon={<MessageSquareWarning className="text-blue-500" />} 
          />
          <KpiCard 
            title="Avg Sentiment Score" 
            value="4.2/5" 
            trend="+0.3 this week" 
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
            <h3 className="text-lg font-bold text-slate-800 mb-6">Sentiment Volume Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="positive" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-3xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-6">Sentiment Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {sentimentData.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  {item.name}
                </div>
              ))}
            </div>
          </motion.div>
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
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-2xl">
          {icon}
        </div>
        <div className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={14} className="mr-1"/> {trend}
        </div>
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
      </div>
    </motion.div>
  );
}
