import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Clock, FileText, Database, Filter, Trash2 } from 'lucide-react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import EmptyState from '../components/ui/EmptyState';
import GlobalLoader from '../components/ui/GlobalLoader';
import toast from 'react-hot-toast';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(collection(db, 'history'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedData = [];
        querySnapshot.forEach((doc) => {
          fetchedData.push({ id: doc.id, ...doc.data() });
        });
        setHistoryData(fetchedData);
      } catch (err) {
        console.error("Failed to fetch history", err);
        // Fallback for UI visualization if Firebase fails/not configured
        setHistoryData([
          {
            id: '1',
            type: 'single',
            timestamp: new Date().toISOString(),
            review: "The new dashboard update is fantastic. It saves me so much time tracking everything.",
            sentiment: 'Positive',
            department: 'Product Quality',
            confidence: 0.95,
            insights: {
              summary: "Customer highly appreciates the new dashboard efficiency.",
              key_phrases: ["dashboard update", "fantastic", "saves time"]
            }
          },
          {
            id: '2',
            type: 'bulk',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            total: 250,
            positive_percent: 68
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const filteredHistory = historyData.filter(item => {
    let matchesSearch = true;
    let matchesSentiment = true;

    if (item.type === 'bulk') {
      matchesSearch = true; // Bulk could be matched by other things later
    } else {
      matchesSearch = (item.review && item.review.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.department && item.department.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (sentimentFilter !== 'All') {
        matchesSentiment = item.sentiment === sentimentFilter;
      }
    }

    return matchesSearch && matchesSentiment;
  });

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'history', id));
      setHistoryData(prev => prev.filter(item => item.id !== id));
      toast.success('Record deleted successfully');
    } catch (err) {
      console.error("Error deleting document:", err);
      toast.error('Failed to delete record');
    }
  };

  return (
    <div className="flex-grow bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Analysis Timeline</h1>
            <p className="text-slate-500 mt-2">Track the history of processed customer intelligence.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search reviews..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="relative">
              <select 
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none bg-white shadow-sm font-medium text-slate-700"
              >
                <option value="All">All Sentiments</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Negative">Negative</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {loading ? (
          <GlobalLoader isLoading={true} text="Loading history..." />
        ) : (
          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-8 pb-10">
            {filteredHistory.length === 0 ? (
              <div className="pl-8 pt-4">
                <EmptyState 
                  icon={Search} 
                  title="No history found" 
                  description="We couldn't find any analysis records matching your criteria. Try adjusting your search or filters." 
                />
              </div>
            ) : (
              filteredHistory.map((item, index) => (
                <HistoryCard 
                  key={item.id} 
                  item={item} 
                  index={index}
                  isExpanded={expandedId === item.id}
                  onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ item, index, isExpanded, onToggle, onDelete }) {
  const isBulk = item.type === 'bulk';
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-8 md:pl-10"
    >
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-6 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-slate-50 ${isBulk ? 'bg-indigo-500' : 'bg-blue-500'}`}></div>
      
      <div 
        onClick={!isBulk ? onToggle : undefined}
        className={`bg-white rounded-2xl border ${isExpanded ? 'border-blue-200 shadow-md glow' : 'border-slate-100 shadow-sm'} p-6 transition-all ${!isBulk ? 'cursor-pointer hover:border-blue-300' : ''}`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl flex-shrink-0 ${isBulk ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
              {isBulk ? <Database size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-800">
                  {isBulk ? 'Bulk CSV Analysis' : 'Single Review Analysis'}
                </h3>
                {!isBulk && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                    item.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {item.sentiment}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(item.timestamp).toLocaleString()}</span>
                {!isBulk && item.department && (
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.department}</span>
                )}
              </div>
              
              {isBulk ? (
                <p className="mt-3 text-sm text-slate-600">
                  Analyzed <span className="font-bold text-slate-800">{item.total} reviews</span>. Overall sentiment was <span className="font-bold text-green-600">{item.positive_percent}% positive</span>.
                </p>
              ) : (
                <p className={`mt-3 text-sm text-slate-600 ${!isExpanded && 'line-clamp-2'}`}>
                  "{item.review}"
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
              title="Delete Record"
            >
              <Trash2 size={18} />
            </button>
            {!isBulk && (
              <button className="text-slate-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && !isBulk && item.insights && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-50">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">AI Summary</h4>
                  <p className="text-sm text-indigo-900 mb-4">{item.insights.summary}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.insights.key_phrases?.map((phrase, i) => (
                      <span key={i} className="text-xs bg-white border border-indigo-100 px-2 py-1 rounded-md text-indigo-700 shadow-sm">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
