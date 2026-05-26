import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import {
  Bell,
  Shield,
  LogOut,
  Brain,
  ToggleLeft,
  ToggleRight,
  Save
} from 'lucide-react';

import toast from 'react-hot-toast';

// ── Persisted state helpers ──────────────────────────────────────────────────
function loadPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function savePref(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch { }
}

// ── Toggle row component ─────────────────────────────────────────────────────
function ToggleRow({
  label,
  description,
  value,
  onChange
}) {
  return (
    <div className="flex items-center justify-between py-3.5">

      <div className="flex-1 min-w-0 pr-4">

        <p className="font-semibold text-slate-700 text-sm">
          {label}
        </p>

        {description && (
          <p className="text-xs text-slate-500 mt-0.5">
            {description}
          </p>
        )}

      </div>

      <button
        onClick={() => onChange(!value)}
        className={`flex-shrink-0 flex items-center transition-colors ${value
            ? 'text-blue-600'
            : 'text-slate-300 hover:text-slate-400'
          }`}
        aria-checked={value}
        role="switch"
      >

        {value ? (
          <ToggleRight size={32} strokeWidth={1.5} />
        ) : (
          <ToggleLeft size={32} strokeWidth={1.5} />
        )}

      </button>
    </div>
  );
}

// ── Section container ────────────────────────────────────────────────────────
function Section({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  children,
  delay = 0
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white p-5 md:p-7 rounded-3xl border border-slate-200 shadow-sm"
    >

      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">

        <div className={`p-2 rounded-xl ${iconBg}`}>
          <Icon size={19} className={iconColor} />
        </div>

        <h2 className="text-lg font-bold text-slate-800">
          {title}
        </h2>

      </div>

      {children}
    </motion.section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Settings() {

  const navigate = useNavigate();

  // Notification prefs
  const [notifs, setNotifs] = useState({
    aiAlerts: loadPref('notif_aiAlerts', true),
    riskNotifs: loadPref('notif_riskNotifs', true),
    dashboardNotifs: loadPref('notif_dashNotifs', false),
    weeklySummary: loadPref('notif_weekly', false),
  });

  // AI prefs
  const [aiPrefs, setAiPrefs] = useState({
    responseStyle: loadPref('ai_responseStyle', 'concise'),
    alertSensitivity: loadPref('ai_alertSens', 'medium'),
    executiveTone: loadPref('ai_execTone', true),
  });

  // Persist notification prefs
  useEffect(() => {

    savePref('notif_aiAlerts', notifs.aiAlerts);
    savePref('notif_riskNotifs', notifs.riskNotifs);
    savePref('notif_dashNotifs', notifs.dashboardNotifs);
    savePref('notif_weekly', notifs.weeklySummary);

  }, [notifs]);

  // Persist AI prefs
  useEffect(() => {

    savePref('ai_responseStyle', aiPrefs.responseStyle);
    savePref('ai_alertSens', aiPrefs.alertSensitivity);
    savePref('ai_execTone', aiPrefs.executiveTone);

  }, [aiPrefs]);

  const setNotif = (key, val) =>
    setNotifs(prev => ({ ...prev, [key]: val }));

  const setAi = (key, val) =>
    setAiPrefs(prev => ({ ...prev, [key]: val }));

  const handleLogout = async () => {

    try {

      await signOut(auth);

      toast.success('Signed out successfully.');

      setTimeout(() => {
        navigate('/');
      }, 800);

    } catch (err) {

      console.error(err);

      toast.error('Failed to sign out. Try again.');
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-5 bg-white min-h-screen">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="text-slate-500 mt-1 text-sm">
          Manage your account preferences and AI platform configuration.
        </p>

      </div>

      {/* ── Notifications ── */}
      <Section
        icon={Bell}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
        title="Notification Preferences"
        delay={0.05}
      >

        <div className="divide-y divide-slate-50">

          <ToggleRow
            label="AI Operational Alerts"
            description="Receive alerts from the Emovix AI intelligence engine."
            value={notifs.aiAlerts}
            onChange={v => setNotif('aiAlerts', v)}
          />

          <ToggleRow
            label="Operational Risk Notifications"
            description="Get notified when risk levels change on your dashboard."
            value={notifs.riskNotifs}
            onChange={v => setNotif('riskNotifs', v)}
          />

          <ToggleRow
            label="Dashboard Intelligence Updates"
            description="Notify when new AI insights are generated."
            value={notifs.dashboardNotifs}
            onChange={v => setNotif('dashboardNotifs', v)}
          />

          <ToggleRow
            label="Weekly Intelligence Summary"
            description="Receive a weekly digest of customer sentiment trends."
            value={notifs.weeklySummary}
            onChange={v => setNotif('weeklySummary', v)}
          />

        </div>
      </Section>

      {/* ── AI Preferences ── */}
      <Section
        icon={Brain}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        title="AI Intelligence Preferences"
        delay={0.1}
      >

        <div className="space-y-5">

          {/* Response Style */}
          <div>

            <p className="font-semibold text-slate-700 text-sm mb-2">
              AI Response Style
            </p>

            <div className="flex gap-2">

              {['concise', 'detailed'].map(style => (

                <button
                  key={style}
                  onClick={() => setAi('responseStyle', style)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all capitalize ${aiPrefs.responseStyle === style
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                    }`}
                >

                  {style === 'concise'
                    ? '⚡ Concise'
                    : '📋 Detailed'}

                </button>
              ))}

            </div>
          </div>

          {/* Alert Sensitivity */}
          <div>

            <p className="font-semibold text-slate-700 text-sm mb-2">
              Alert Sensitivity
            </p>

            <div className="flex gap-2">

              {['low', 'medium', 'high'].map(level => (

                <button
                  key={level}
                  onClick={() => setAi('alertSensitivity', level)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all capitalize ${aiPrefs.alertSensitivity === level
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                >
                  {level}
                </button>
              ))}

            </div>
          </div>

          <div className="pt-1 divide-y divide-slate-50">

            <ToggleRow
              label="Executive Intelligence Tone"
              description="Use senior analyst language in AI summaries and copilot responses."
              value={aiPrefs.executiveTone}
              onChange={v => setAi('executiveTone', v)}
            />

          </div>
        </div>
      </Section>

      {/* ── Account Security ── */}
      <Section
        icon={Shield}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        title="Account Security"
        delay={0.15}
      >

        <div className="space-y-3">

          {[
            {
              label: 'Two-Factor Authentication',
              note: 'Recommended for enterprise accounts',
            },

            {
              label: 'Active Sessions',
              note: 'Manage devices logged into your account',
            },

          ].map(row => (

            <div
              key={row.label}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
            >

              <div>

                <p className="font-semibold text-slate-700 text-sm">
                  {row.label}
                </p>

                <p className="text-xs text-slate-500 mt-0.5">
                  {row.note}
                </p>

              </div>

              <span className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-xl">
                Coming Soon
              </span>

            </div>
          ))}

        </div>
      </Section>

      {/* ── Auto Saved State ── */}
      <motion.button
        disabled
        className="w-full py-3.5 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-md shadow-blue-200 opacity-70 cursor-default"
      >

        <Save size={18} />

        Preferences Auto-Saved

      </motion.button>

      {/* ── Danger Zone ── */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-red-50 border border-red-100 rounded-3xl p-5 md:p-7"
      >

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h3 className="font-bold text-red-800 text-base">
              Sign Out
            </h3>

            <p className="text-sm text-red-600/80 mt-1">
              End your current session on this device.
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md shadow-red-500/20"
          >

            <LogOut size={17} />

            Sign Out

          </button>

        </div>
      </motion.section>
    </div>
  );
}