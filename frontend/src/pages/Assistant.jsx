import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Bot, User, Send, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';

const SUGGESTED_PROMPTS = [
  { icon: '📉', text: 'What are customers complaining about most?' },
  { icon: '📋', text: 'Summarize recent negative reviews.' },
  { icon: '🏢', text: 'Which department has the highest complaints?' },
  { icon: '📈', text: 'What trends do you notice in customer feedback?' },
];

// ── Animated typing dots ──────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1 px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-blue-400 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Typewriter text ───────────────────────────────────────────────────────────
function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(id);
    }, 12);
    return () => clearInterval(id);
  }, [text]);
  return <span>{displayed}</span>;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Assistant() {
  const [messages, setMessages]         = useState([]);
  const [input, setInput]               = useState('');
  const [isThinking, setIsThinking]     = useState(false);
  const [contextLoaded, setContextLoaded] = useState(false);
  const [reviewContext, setReviewContext] = useState([]);
  const [contextError, setContextError]  = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // ── Fetch review context (UID-scoped) ───────────────────────────────────
  const fetchContext = async () => {
    setContextError(false);
    setContextLoaded(false);

    const uid = auth.currentUser?.uid;
    if (!uid) {
      setContextLoaded(true);
      return;
    }

    try {
      const q = query(
        collection(db, 'history'),
        where('uid', '==', uid),
        orderBy('timestamp', 'desc'),
        limit(30)
      );
      const snap = await getDocs(q);
      const records = [];
      snap.forEach((doc) => {
        const d = doc.data();
        if (d.type === 'single' && d.review && d.sentiment) {
          records.push({
            review:     d.review.substring(0, 250),
            sentiment:  d.sentiment,
            department: d.department || 'General',
            timestamp:  d.timestamp || new Date().toISOString(),
          });
        }
      });
      setReviewContext(records);
      setContextLoaded(true);
    } catch (err) {
      console.error('[Assistant] Failed to fetch review context:', err);
      setContextError(true);
      setContextLoaded(true);
    }
  };

  useEffect(() => { fetchContext(); }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ── Send message ─────────────────────────────────────────────────────────
  const sendMessage = async (text, retryMsgId = null) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    // If not a retry, add the user message
    if (!retryMsgId) {
      const userMsg = { role: 'user', text: trimmed, id: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
    }

    setInput('');
    setIsThinking(true);

    // If retry, remove the previous error message
    if (retryMsgId) {
      setMessages((prev) => prev.filter((m) => m.id !== retryMsgId));
    }

    try {
      const res = await axios.post('http://localhost:8000/api/assistant/query', {
        query:   trimmed,
        context: reviewContext,
      });
      const aiMsg = {
        role:  'ai',
        text:  res.data.response,
        id:    Date.now() + 1,
        isNew: true,
        query: trimmed,  // store for retry
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('[Assistant] Request failed:', err);
      setMessages((prev) => [
        ...prev,
        {
          role:    'ai',
          text:    trimmed,          // store original query for retry
          id:      Date.now() + 1,
          isNew:   false,
          isError: true,
          query:   trimmed,
        },
      ]);
    } finally {
      setIsThinking(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const isEmpty = messages.length === 0;

  // ── Status indicator label ────────────────────────────────────────────────
  const statusLabel = () => {
    if (!contextLoaded) return 'Loading review context…';
    if (contextError)   return 'Context unavailable — tap to retry';
    if (reviewContext.length === 0) return 'No reviews found — analyze feedback first';
    return `Ready · ${reviewContext.length} recent review${reviewContext.length !== 1 ? 's' : ''} loaded`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center gap-4 flex-shrink-0">
        <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-md shadow-blue-500/20">
          <Bot size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-slate-800">Emovix AI Copilot</h2>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full animate-pulse ${contextError ? 'bg-amber-400' : 'bg-green-400'}`} />
            <button
              onClick={contextError ? fetchContext : undefined}
              className={`text-xs text-slate-500 truncate ${contextError ? 'underline underline-offset-2 cursor-pointer hover:text-slate-700' : 'cursor-default'}`}
            >
              {statusLabel()}
            </button>
          </div>
        </div>
      </div>

      {/* ── Message Area ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        <AnimatePresence>
          {isEmpty ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full pt-10 pb-4 text-center"
            >
              <div className="p-5 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6 shadow-inner">
                <Sparkles size={42} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Ask me anything about your customers
              </h3>
              <p className="text-slate-500 max-w-md mb-10 text-sm leading-relaxed">
                I'm your Emovix AI Copilot. I analyze your customer feedback history and provide actionable business intelligence — just ask.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTED_PROMPTS.map((p) => (
                  <motion.button
                    key={p.text}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => sendMessage(p.text)}
                    disabled={isThinking || !contextLoaded}
                    className="flex items-center gap-3 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-left hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <span className="text-xl flex-shrink-0">{p.icon}</span>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
                      {p.text}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    : 'bg-white border border-slate-200'
                }`}>
                  {msg.role === 'user'
                    ? <User size={18} className="text-white" />
                    : <Bot size={18} className="text-blue-600" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                    : msg.isError
                      ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-sm'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                }`}>
                  {msg.isError ? (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2 text-red-500 font-medium text-xs">
                        <AlertCircle size={13} /> Intelligence temporarily unavailable
                      </div>
                      <p className="text-red-600 text-xs mb-3">
                        The AI Intelligence Engine is temporarily operating at reduced capacity. Please try again.
                      </p>
                      <button
                        onClick={() => sendMessage(msg.query, msg.id)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 underline underline-offset-2"
                      >
                        <RefreshCw size={11} /> Retry Response
                      </button>
                    </div>
                  ) : msg.role === 'ai' && msg.isNew ? (
                    <TypewriterText text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
              </motion.div>
            ))
          )}

          {/* Thinking indicator */}
          {isThinking && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                <Bot size={18} className="text-blue-600" />
              </div>
              <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* ── Input Area ───────────────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 flex-shrink-0">
        {!isEmpty && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            {SUGGESTED_PROMPTS.map((p) => (
              <button
                key={p.text}
                onClick={() => sendMessage(p.text)}
                disabled={isThinking}
                className="flex-shrink-0 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 hover:border-blue-200 rounded-full text-xs font-medium text-slate-600 transition-all disabled:opacity-50"
              >
                {p.icon} {p.text}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about customer sentiment, trends, complaints…"
            disabled={isThinking || !contextLoaded}
            className="flex-1 px-5 py-3 bg-slate-50 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none rounded-xl text-sm text-slate-800 placeholder-slate-400 transition-all disabled:opacity-60"
          />
          <motion.button
            type="submit"
            disabled={!input.trim() || isThinking || !contextLoaded}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isThinking
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send size={18} />
            }
          </motion.button>
        </form>
      </div>
    </div>
  );
}
