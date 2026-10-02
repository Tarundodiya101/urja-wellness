import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUsers, FiCheckSquare, FiCoffee, FiFileText, FiCreditCard,
  FiBookOpen, FiShoppingBag, FiPackage, FiBell, FiTarget,
  FiDollarSign, FiBarChart2, FiMessageSquare, FiShield,
  FiActivity, FiDatabase, FiLock, FiLogOut, FiChevronLeft, FiChevronRight,
  FiSmartphone, FiUserCheck, FiUserPlus
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const mainNavItems = [
  { label: 'DASHBOARD', icon: FiHome, path: '/dashboard' },
  { label: 'MEMBERS', icon: FiUsers, path: '/members' },
  { label: 'ATTENDANCE', icon: FiCheckSquare, path: '/attendance' },
  { label: 'CENTER CONSUMPTION', icon: FiCoffee, path: '/consumption' },
  { label: 'SALES & BILLING', icon: FiFileText, path: '/billing' },
  { label: 'PAYMENTS & DUES', icon: FiCreditCard, path: '/payments' },
  { label: 'MEMBER LEDGER', icon: FiBookOpen, path: '/ledger' },
  { label: 'PURCHASE ENTRY', icon: FiShoppingBag, path: '/purchases' },
  { label: 'INVENTORY & STOCK', icon: FiPackage, path: '/inventory' },
  { label: 'REFILL REMINDER', icon: FiBell, path: '/refill-reminder' },
  { label: 'LEADS & FOLLOW-UP', icon: FiTarget, path: '/crm' },
  { label: 'EXPENSES', icon: FiDollarSign, path: '/expenses' },
  { label: 'DAILY CLOSING', icon: FiLock, path: '/daily-closing' },
  { label: 'REPORTS', icon: FiBarChart2, path: '/reports' },
  { label: 'WHATSAPP MESSAGES', icon: FiMessageSquare, path: '/whatsapp' },
  { label: 'USER SECURITY', icon: FiShield, path: '/users' },
  { label: 'AUDIT LOG', icon: FiActivity, path: '/audit-log' },
  { label: 'DATA BACKUP', icon: FiDatabase, path: '/backup' },
];

const mobileAppNavItems = [
  { label: 'MEMBER MOBILE APP', icon: FiSmartphone, path: '/member-app' },
  { label: 'COACH MOBILE PORTAL', icon: FiUserCheck, path: '/coach-app' },
  { label: 'GUEST QR REGISTER', icon: FiUserPlus, path: '/guest-register' },
];

export default function Sidebar({ open, onToggle }) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`
        relative flex flex-col h-screen transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-[72px]'}
        bg-gradient-to-b from-[#0a1628] via-[#0d2137] to-[#0a3320]
        shadow-2xl border-r border-white/5 z-30 shrink-0
      `}
    >
      {/* ── Brand Header ── */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${open ? '' : 'justify-center'}`}>
        <svg width="40" height="40" viewBox="0 0 42 42" className="shrink-0" aria-label="URJA logo">
          <defs>
            <linearGradient id="sgLf1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="sgLf2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
          <circle cx="21" cy="21" r="20" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
          <path d="M9 27 C9 18, 17 12, 21 14 C17 18, 15 23, 16 29 C12 29, 9 28, 9 27 Z" fill="url(#sgLf1)" />
          <path d="M33 27 C33 18, 25 12, 21 14 C25 18, 27 23, 26 29 C30 29, 33 28, 33 27 Z" fill="url(#sgLf2)" />
          <circle cx="21" cy="14" r="3" fill="white" />
          <line x1="21" y1="17" x2="21" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="20" x2="27" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {open && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-black text-white tracking-wider leading-none">URJA</div>
            <div className="text-[10px] font-bold text-emerald-400 tracking-wider">WELLNESS CLUB</div>
            <div className="text-[9px] text-gray-400 truncate mt-0.5">Management System</div>
          </div>
        )}
      </div>

      {/* User Role Banner */}
      {open && user && (
        <div className="mx-3 my-2 p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">{user.name}</div>
            <div className="text-[10px] text-emerald-400 font-semibold">{user.role || 'ADMIN'}</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      )}

      {/* ── Navigation List ── */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {open && <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Management</div>}
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-900/40 translate-x-1'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
                }
                ${open ? '' : 'justify-center'}
              `}
              title={item.label}
            >
              <Icon size={17} className="shrink-0" />
              {open && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}

        {/* Mobile Applications Section (Specification Section 32 & 33) */}
        {open && <div className="px-3 pt-3 pb-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest border-t border-white/10 mt-2">Mobile App Portals</div>}
        {mobileAppNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-xs transition-all duration-200
                ${isActive
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-emerald-900/40 translate-x-1'
                  : 'text-emerald-300 hover:text-white hover:bg-white/10'
                }
                ${open ? '' : 'justify-center'}
              `}
              title={item.label}
            >
              <Icon size={17} className="shrink-0" />
              {open && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Bottom Controls ── */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors ${
            open ? '' : 'justify-center'
          }`}
        >
          {open ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
          {open && <span>Collapse Sidebar</span>}
        </button>

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors ${
            open ? '' : 'justify-center'
          }`}
        >
          <FiLogOut size={18} />
          {open && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
