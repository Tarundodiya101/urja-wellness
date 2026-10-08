import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiEye, FiEyeOff, FiUser, FiLock, FiChevronDown } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { Checkbox } from '../components/ui/fields';

const ROLES = ['Admin', 'Reception', 'Coach', 'Accounts'];

const FEATURES = [
  'Member Management & Profiles',
  'Attendance & Biometric Tracking',
  'Billing, Payments & Ledger',
  'Inventory & Supplement Tracking',
  'WhatsApp CRM & Follow-ups',
  'Comprehensive Reports & Analytics',
];

/* ── URJA SVG Logo (large variant for login page) ── */
function UrjaLogo({ size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-label="URJA Wellness Club Logo">
      <defs>
        <linearGradient id="lgLeaf1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <linearGradient id="lgLeaf2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="lgBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Outer glow ring */}
      <circle cx="40" cy="40" r="38" fill="url(#lgBg)" stroke="white" strokeOpacity="0.25" strokeWidth="1" />

      {/* Left leaf */}
      <path
        d="M18 52 C18 34, 34 22, 40 26 C34 34, 30 43, 32 55 C24 55, 18 54, 18 52 Z"
        fill="url(#lgLeaf1)"
      />
      {/* Right leaf */}
      <path
        d="M62 52 C62 34, 46 22, 40 26 C46 34, 50 43, 48 55 C56 55, 62 54, 62 52 Z"
        fill="url(#lgLeaf2)"
      />

      {/* Human figure — white */}
      {/* Head */}
      <circle cx="40" cy="27" r="5.5" fill="white" />
      {/* Body */}
      <line x1="40" y1="32.5" x2="40" y2="50" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Arms */}
      <line x1="30" y1="39" x2="50" y2="39" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Left leg */}
      <line x1="40" y1="50" x2="33" y2="61" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="40" y1="50" x2="47" y2="61" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Stem below leaves */}
      <line x1="40" y1="55" x2="40" y2="64" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useApp();
  const navigate   = useNavigate();

  const [role,       setRole]       = useState('Admin');
  const [username,   setUsername]   = useState('');
  const [password,   setPassword]   = useState('');
  const [remember,   setRemember]   = useState(false);
  const [showPass,   setShowPass]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('Please enter a username.'); return; }
    if (!password.trim()) { setError('Please enter a password.'); return; }

    setLoading(true);
    try {
      // Small artificial delay for UX polish
      await new Promise(r => setTimeout(r, 600));
      login({ username: username.trim(), role, name: username.trim() });
      
      const roleUpper = role.toUpperCase();
      if (roleUpper === 'COACH') {
        navigate('/coach-dashboard');
      } else if (roleUpper === 'RECEPTION' || roleUpper === 'STAFF') {
        navigate('/attendance');
      } else if (roleUpper === 'ACCOUNTS' || roleUpper === 'MEMBER') {
        navigate('/photo-management');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ══════════════════════════════════════════
          LEFT PANEL — Branding
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#0a3320] p-12 relative overflow-hidden">

        {/* Decorative background blobs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-green-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-teal-400/5 blur-2xl pointer-events-none" />

        {/* Top logo */}
        <div className="flex items-center gap-4 z-10">
          <UrjaLogo size={56} />
          <div>
            <h1 className="text-white font-extrabold text-xl tracking-wide leading-tight">
              URJA WELLNESS CLUB
            </h1>
            <p className="text-green-300 text-xs font-medium tracking-widest uppercase mt-0.5">
              Nutrition Center Management
            </p>
          </div>
        </div>

        {/* Center content */}
        <div className="z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-snug">
              Healthy People,<br />
              <span className="text-green-300">Happier Lives...</span>
            </h2>
            <p className="text-green-200/80 text-sm mt-3 leading-relaxed max-w-xs">
              A complete management solution for modern nutrition &amp; wellness centers — designed for efficiency, built for growth.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-400/20 border border-green-400/40 shrink-0">
                  <FiCheck size={11} className="text-green-300" />
                </span>
                <span className="text-green-100 text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="z-10 border-t border-white/10 pt-6">
          <p className="text-green-200/70 text-sm italic">
            "Better Nutrition, Brighter Tomorrow"
          </p>
          <p className="text-green-400/60 text-xs mt-1 font-medium tracking-wide uppercase">
            — URJA Wellness Club
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Login form
      ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 sm:p-12 relative">

        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg">
            <UrjaLogo size={36} />
          </div>
          <div>
            <p className="font-extrabold text-green-800 text-base tracking-wide leading-tight">URJA WELLNESS CLUB</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">Nutrition Center Mgmt</p>
          </div>
        </div>

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-800">Welcome Back! </h2>
            <p className="text-slate-500 text-sm mt-1.5">Sign in to your management portal</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Login As
              </label>
              <div className="relative">
                <Select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all cursor-pointer"
                >
                  {ROLES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
                <FiChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiUser size={16} />
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiLock size={16} />
                </span>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Center Name */}
            <div>
              <label htmlFor="centerName" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Center Name
              </label>
              <Select
                id="centerName"
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all cursor-pointer"
              >
                <option value="Surat Main">URJA Wellness Club — Main Branch (Surat)</option>
                <option value="City Light">URJA Wellness Club — City Light Branch</option>
                <option value="Varachha">URJA Wellness Club — Varachha Branch</option>
              </Select>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="cursor-pointer"
                />
                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to registered mobile/email.')}
                className="text-xs font-semibold text-green-600 hover:text-green-700"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm tracking-wide shadow-lg
                         bg-gradient-to-r from-green-500 to-emerald-600
                         hover:from-green-600 hover:to-emerald-700
                         active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-center">
            <p className="text-xs text-blue-600 font-medium">
              Demo Mode — Use any username &amp; password to login
            </p>
          </div>

          {/* Quote */}
          <p className="text-center text-xs text-slate-400 mt-8 italic">
            "Better Nutrition, Brighter Tomorrow" — URJA Wellness Club
          </p>
        </div>
      </div>
    </div>
  );
}
