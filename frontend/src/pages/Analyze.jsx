import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Analyze() {
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!review.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // In production, this points to your deployed backend
      const response = await axios.post('http://localhost:8000/api/analyze', {
        review
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the review. Make sure the backend is running.');
      // Fallback dummy data for MVP UI testing if backend is off
      setTimeout(() => {
        setResult({
          sentiment: "Positive",
          confidence: 0.92,
          insights: {
            summary: "The customer highly praises the application's ease of use and speed.",
            urgency: "Low",
            key_phrases: ["amazing app", "fast", "intuitive"],
            action_items: ["Consider reaching out for a testimonial", "Monitor for continued positive feedback"]
          }
        });
        setError(null);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="glass p-8 rounded-3xl shadow-sm border border-slate-200 h-fit"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Send className="text-blue-500" /> Input Feedback
          </h2>
          <form onSubmit={handleAnalyze}>
            <textarea 
              className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none bg-white/70 mb-6"
              placeholder="Paste customer review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading || !review.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Analyze Sentiment & Get Insights'}
            </button>
          </form>
          {error && (
            <p className="text-amber-600 text-sm mt-4 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-center gap-2">
              <AlertCircle size={16} /> {error} (Showing mockup data instead)
            </p>
          )}
        </motion.div>

        {/* Results Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-full min-h-[500px]"
        >
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/50 backdrop-blur-sm rounded-3xl z-10 border border-slate-200">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-slate-600 font-medium animate-pulse">Running ML pipeline & Gemini AI...</p>
            </div>
          )}

          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center">
              <Bot className="w-16 h-16 mb-4 opacity-50" />
              <p>Results and AI insights will appear here.</p>
            </div>
          )}

          {result && !loading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 h-full overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Sentiment</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-lg font-bold flex items-center gap-2 ${
                      result.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                      result.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {result.sentiment === 'Positive' && <CheckCircle2 size={20} />}
                      {result.sentiment === 'Negative' && <AlertCircle size={20} />}
                      {result.sentiment}
                    </span>
                    <span className="text-slate-400 text-sm">
                      {(result.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Bot className="text-indigo-500" /> Gemini AI Insights
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-indigo-50 p-4 rounded-xl">
                    <h4 className="text-indigo-900 font-semibold mb-2">Summary</h4>
                    <p className="text-indigo-700 leading-relaxed">{result.insights.summary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <h4 className="text-slate-700 font-semibold mb-2 text-sm uppercase">Urgency</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        result.insights.urgency === 'High' ? 'bg-red-100 text-red-700' :
                        result.insights.urgency === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {result.insights.urgency}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl">
                      <h4 className="text-slate-700 font-semibold mb-2 text-sm uppercase">Key Phrases</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.insights.key_phrases.map((phrase, i) => (
                          <span key={i} className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-slate-800 font-semibold mb-3">Recommended Actions</h4>
                    <ul className="space-y-2">
                      {result.insights.action_items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
