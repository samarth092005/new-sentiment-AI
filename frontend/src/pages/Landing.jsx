import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BrainCircuit, Zap, ShieldCheck } from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="max-w-6xl mx-auto px-4 z-10 text-center mt-20 mb-32">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 mb-8"
        >
          Decode Customer <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Sentiment instantly.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12"
        >
          Emovix uses state-of-the-art Machine Learning and Gemini AI to transform your raw customer feedback into actionable business intelligence.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/analyze" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
            Start Analyzing Now
          </Link>
          <Link to="/dashboard" className="px-8 py-4 rounded-full bg-white text-blue-600 border border-blue-200 font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-sm">
            View Dashboard
          </Link>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 z-10 w-full mb-32">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BrainCircuit className="w-10 h-10 text-blue-500" />}
            title="Gemini AI Insights"
            description="Go beyond basic positive/negative scores. Get actionable summaries and recommendations."
            delay={0.6}
          />
          <FeatureCard 
            icon={<Zap className="w-10 h-10 text-yellow-500" />}
            title="Real-time Processing"
            description="Analyze thousands of reviews in milliseconds with our optimized ML pipeline."
            delay={0.8}
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-10 h-10 text-green-500" />}
            title="Enterprise Security"
            description="Your data is safe. We use Firebase Auth and secure API endpoints to protect your insights."
            delay={1.0}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass p-8 rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-slate-200"
    >
      <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
