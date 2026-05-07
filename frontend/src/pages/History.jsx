import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, CheckCircle2, AlertCircle, FileDown } from 'lucide-react';

const mockHistory = [
  {
    id: 1,
    date: '2026-05-07 14:30',
    review: "The new dashboard update is fantastic. It saves me so much time.",
    sentiment: 'Positive',
    confidence: 0.95
  },
  {
    id: 2,
    date: '2026-05-06 09:15',
    review: "I keep getting an error when I try to export my reports. Please fix this.",
    sentiment: 'Negative',
    confidence: 0.88
  },
  {
    id: 3,
    date: '2026-05-05 16:45',
    review: "It does the job, but the interface could be a bit more modern.",
    sentiment: 'Neutral',
    confidence: 0.65
  },
  {
    id: 4,
    date: '2026-05-04 11:20',
    review: "Absolutely the best tool our team has purchased this year. Customer support is A+.",
    sentiment: 'Positive',
    confidence: 0.98
  }
];

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = mockHistory.filter(item => 
    item.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sentiment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-grow bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Analysis History</h1>
            <p className="text-slate-500 mt-2">View your previously analyzed customer feedback.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-semibold text-slate-600">Date</th>
                  <th className="p-4 font-semibold text-slate-600">Review Snippet</th>
                  <th className="p-4 font-semibold text-slate-600">Sentiment</th>
                  <th className="p-4 font-semibold text-slate-600 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={item.id} 
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center text-slate-500 text-sm gap-2">
                        <Calendar size={14} /> {item.date}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-700 max-w-md truncate">
                        {item.review}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        item.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                        item.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.sentiment === 'Positive' && <CheckCircle2 size={12} />}
                        {item.sentiment === 'Negative' && <AlertCircle size={12} />}
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors tooltip relative group">
                        <FileDown size={18} />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Download PDF
                        </span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredHistory.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No matching history found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
