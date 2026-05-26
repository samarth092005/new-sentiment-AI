import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Layers,
  Bot,
  CheckCircle2,
  Sparkles,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="flex-grow bg-white overflow-hidden">

      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-36">

        <div className="absolute top-0 inset-x-0 h-[700px] bg-dot-pattern opacity-[0.35] pointer-events-none" />
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] hero-glow opacity-[0.7] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">

          <div className="text-center max-w-4xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold mb-8 uppercase tracking-widest"
            >
              <Sparkles size={14} className="text-blue-500" />
              AI Operational Intelligence
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight mb-8"
            >
              Transform Customer Feedback Into <br className="hidden md:block" />
              <span className="text-gradient">
                Operational Intelligence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Emovix converts customer signals into executive insights,
              operational risk detection, and AI-driven business intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                to="/login"
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-2"
              >
                Start Monitoring Intelligence
                <ArrowRight size={20} />
              </Link>

              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center"
              >
                View Dashboard
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative max-w-5xl mx-auto group"
          >

            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full group-hover:bg-blue-600/10 transition-all duration-700" />

            <div className="relative glass p-2 md:p-3 rounded-[32px] border border-slate-200/60 shadow-2xl overflow-hidden">

              <div className="bg-slate-50 rounded-[22px] border border-slate-100 overflow-hidden shadow-inner">

                <div className="h-12 border-b border-slate-200 bg-white flex items-center px-6 justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                  </div>

                  <div className="w-1/3 h-5 bg-slate-100 rounded-lg" />
                  <div className="w-12 h-6 bg-blue-100 rounded-md" />
                </div>

                <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">

                  <div className="md:col-span-2 space-y-6">

                    <div className="h-40 bg-white rounded-2xl border border-slate-200 p-6">

                      <div className="flex items-center gap-3 mb-4">

                        <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                          <Activity size={20} />
                        </div>

                        <div className="flex-1">
                          <div className="h-3 w-32 bg-slate-100 rounded mb-1" />
                          <div className="h-2 w-48 bg-slate-50 rounded" />
                        </div>
                      </div>

                      <div className="flex gap-2 items-end h-16">
                        {[40, 70, 45, 90, 65, 80, 55, 75, 40, 85].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-indigo-100 rounded-t-sm"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                      <div className="h-24 bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="h-3 w-16 bg-slate-100 rounded mb-2" />
                        <div className="h-6 w-24 bg-slate-900 rounded-lg" />
                      </div>

                      <div className="h-24 bg-white rounded-2xl border border-slate-200 p-4">
                        <div className="h-3 w-16 bg-slate-100 rounded mb-2" />
                        <div className="h-6 w-24 bg-blue-600 rounded-lg" />
                      </div>

                    </div>
                  </div>

                  <div className="h-full bg-slate-900 rounded-2xl p-6 text-white space-y-4">

                    <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit size={16} className="text-blue-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
                        AI Intelligence
                      </span>
                    </div>

                    <div className="h-2 w-full bg-white/10 rounded" />
                    <div className="h-2 w-[80%] bg-white/10 rounded" />
                    <div className="h-2 w-[90%] bg-white/10 rounded" />

                    <div className="pt-4 space-y-2">
                      <div className="h-12 w-full bg-white/5 rounded-xl border border-white/10" />
                      <div className="h-12 w-full bg-white/5 rounded-xl border border-white/10" />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BUSINESS PULSE ─────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50/50">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col lg:flex-row items-center gap-16">

            <div className="lg:w-1/2 space-y-8">

              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                <Target size={28} />
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Real-Time <span className="text-blue-600">Business Pulse</span>
              </h2>

              <p className="text-lg text-slate-500 leading-relaxed">
                Monitor operational health across support, product,
                delivery, and customer experience in real time.
              </p>

              <div className="space-y-6 pt-4">

                <PulseItem
                  icon={<AlertTriangle className="text-amber-500" />}
                  title="Risk Detection"
                  text="Detect operational failures before they escalate."
                />

                <PulseItem
                  icon={<TrendingUp className="text-emerald-500" />}
                  title="Trend Intelligence"
                  text="Identify sentiment shifts and customer frustration patterns."
                />

                <PulseItem
                  icon={<Layers className="text-blue-500" />}
                  title="Department Insights"
                  text="Segment intelligence across teams and workflows."
                />
              </div>
            </div>

            <div className="lg:w-1/2 grid md:grid-cols-2 gap-6">

              <IntelligenceCard
                title="Delivery Stability"
                status="Critical Alert"
                statusColor="text-red-500"
                badge="High Risk"
                badgeColor="bg-red-50 text-red-600"
                text="Shipping delay patterns detected in 14% of reviews."
              />

              <IntelligenceCard
                title="Customer Trust"
                status="Increasing"
                statusColor="text-emerald-500"
                badge="Excellent"
                badgeColor="bg-emerald-50 text-emerald-600"
                text="Quality signal improved following latest update."
              />

            </div>
          </div>
        </div>
      </section>

      {/* ── AI COPILOT ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-3xl mx-auto mb-16">

            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
              <Bot size={24} />
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Operational AI at Your <span className="text-indigo-600">Command</span>
            </h2>

            <p className="text-lg text-slate-500">
              Ask strategic questions and receive executive-grade operational intelligence instantly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto glass rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">

            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">

              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Bot size={16} />
              </div>

              <span className="font-bold text-slate-800 text-sm">
                Emovix AI Copilot
              </span>
            </div>

            <div className="p-8 space-y-8">

              <div className="flex flex-col items-end gap-3 max-w-[80%] ml-auto">

                <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm text-sm font-medium shadow-lg">
                  What are our customers most frustrated about this week?
                </div>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Operations Director
                </span>
              </div>

              <div className="flex gap-4">

                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 flex-shrink-0">
                  <Sparkles size={14} className="text-indigo-600" />
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-sm shadow-sm space-y-4">

                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Delivery latency is currently the largest source of customer frustration,
                    accounting for 62% of negative operational feedback this week.
                  </p>

                  <div className="pt-4 border-t border-slate-100 space-y-2">

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-widest">
                        Actionable Intelligence
                      </span>

                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded font-bold">
                        High Priority
                      </span>
                    </div>

                    <ul className="space-y-2">

                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={12} className="text-indigo-500" />
                        Coordinate with logistics to reduce regional delivery delays.
                      </li>

                      <li className="flex items-center gap-2 text-xs text-slate-600">
                        <CheckCircle2 size={12} className="text-indigo-500" />
                        Trigger proactive customer communication updates.
                      </li>

                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE GRID ───────────────────────────────────────────── */}
      <section className="py-24 bg-white">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-6">

            <FeatureItem
              icon={<Bot />}
              title="AI Copilot"
              text="Conversational operational intelligence powered by AI."
            />

            <FeatureItem
              icon={<AlertTriangle />}
              title="Risk Detection"
              text="Proactive alerting for customer and operational risks."
            />

            <FeatureItem
              icon={<BarChart3 />}
              title="Bulk Analytics"
              text="Process large-scale customer feedback instantly."
            />

          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-24 bg-white">

        <div className="max-w-5xl mx-auto px-6 relative">

          <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative bg-slate-900 rounded-[48px] p-10 md:p-16 text-center overflow-hidden">

            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative z-10 space-y-8"
            >

              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                Unlock Operational Intelligence Today
              </h2>

              <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
                Transform customer feedback into AI-powered business intelligence with Emovix.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">

                <Link
                  to="/login"
                  className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all shadow-2xl flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight size={22} />
                </Link>

              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PulseItem({ icon, title, text }) {
  return (
    <div className="flex gap-4">

      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-1">
          {title}
        </h4>

        <p className="text-sm text-slate-500 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}

function IntelligenceCard({
  title,
  status,
  statusColor,
  badge,
  badgeColor,
  text
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
    >

      <div className="flex justify-between items-start mb-4">

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
            {title}
          </h4>

          <span className={`text-sm font-bold ${statusColor}`}>
            {status}
          </span>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>
          {badge}
        </span>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        {text}
      </p>
    </motion.div>
  );
}

function FeatureItem({ icon, title, text }) {
  return (
    <div className="p-8 rounded-[32px] border border-slate-100 bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all">

      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 mb-6">
        {React.cloneElement(icon, { size: 22 })}
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 leading-relaxed">
        {text}
      </p>
    </div>
  );
}