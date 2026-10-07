import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUsers, FiCheckSquare, FiCamera, FiTrendingUp, FiCoffee,
  FiCheckCircle, FiCreditCard, FiPackage, FiMessageSquare, FiPhoneCall,
  FiFileText, FiAward, FiSmartphone, FiLogOut, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { user, logout, t } = useApp() || {};
  const navigate = useNavigate();

  const userRole = (user?.role || 'OWNER').toUpperCase();

  const allNavItems = [
    { labelGUJ: '👑 ઓનર ડેશબોર્ડ', labelENG: '👑 OWNER DASHBOARD', icon: FiHome, path: '/dashboard', roles: ['OWNER', 'ADMIN', 'STAFF'] },
    { labelGUJ: '👨‍🏫 કોચ ડેશબોર્ડ', labelENG: '👨‍🏫 COACH DASHBOARD', icon: FiUsers, path: '/coach-dashboard', roles: ['OWNER', 'ADMIN', 'COACH'] },
    { labelGUJ: '👤 સભ્ય રજીસ્ટ્રેશન', labelENG: '👤 MEMBER REGISTRATION', icon: FiUsers, path: '/members', roles: ['OWNER', 'ADMIN', 'COACH', 'STAFF'] },
    { labelGUJ: '📲 QR હાજરી', labelENG: '📲 QR ATTENDANCE', icon: FiCheckSquare, path: '/attendance', roles: ['OWNER', 'ADMIN', 'COACH', 'STAFF'] },
    { labelGUJ: '📸 ફોટો રિવ્યૂ', labelENG: '📸 PHOTO MANAGEMENT', icon: FiCamera, path: '/photo-management', roles: ['OWNER', 'ADMIN', 'COACH', 'MEMBER'] },
    { labelGUJ: '📏 બોડી માપન', labelENG: '📏 BODY MEASUREMENTS', icon: FiTrendingUp, path: '/body-measurements', roles: ['OWNER', 'ADMIN', 'COACH', 'MEMBER'] },
    { labelGUJ: '🍎 ન્યુટ્રિશન અને વેલનેસ', labelENG: '🍎 NUTRITION & WELLNESS', icon: FiCoffee, path: '/wellness-trackers', roles: ['OWNER', 'ADMIN', 'COACH', 'MEMBER'] },
    { labelGUJ: '✅ ૮-પોઇન્ટ હેબિટ ટ્રેકર', labelENG: '✅ HABIT TRACKER', icon: FiCheckCircle, path: '/habits-tracker', roles: ['OWNER', 'ADMIN', 'COACH', 'MEMBER'] },
    { labelGUJ: '💰 પેમેન્ટ અને લેજર', labelENG: '💰 PAYMENT & LEDGER', icon: FiCreditCard, path: '/payments-ledger', roles: ['OWNER', 'ADMIN', 'STAFF'] },
    { labelGUJ: '📦 સ્ટોક અને રીફિલ', labelENG: '📦 INVENTORY & REFILL', icon: FiPackage, path: '/inventory-refill', roles: ['OWNER', 'ADMIN', 'STAFF'] },
    { labelGUJ: '📱 વોટ્સએપ રીમાઇન્ડર', labelENG: '📱 WHATSAPP REMINDERS', icon: FiMessageSquare, path: '/whatsapp-reminders', roles: ['OWNER', 'ADMIN', 'COACH', 'STAFF'] },
    { labelGUJ: '📞 ફોલો-અપ સીઆરએમ', labelENG: '📞 FOLLOW-UP SYSTEM', icon: FiPhoneCall, path: '/followup-system', roles: ['OWNER', 'ADMIN', 'COACH'] },
    { labelGUJ: '🏆 ૩૦ અને ૯૦ દિવસ પ્રોગ્રામ', labelENG: '🏆 30 & 90-DAY PROGRAM', icon: FiAward, path: '/transformation-programs', roles: ['OWNER', 'ADMIN', 'COACH'] },
    { labelGUJ: '📊 રિપોર્ટ્સ ડાઉનલોડ', labelENG: '📊 REPORTS & DOWNLOAD', icon: FiFileText, path: '/reports-center', roles: ['OWNER', 'ADMIN', 'COACH'] },
  ];

  // Strictly filter navigation items based on User Role
  const navItems = allNavItems.filter(item => item.roles.includes(userRole) || userRole === 'OWNER' || userRole === 'ADMIN');

  return (
    <>
      {/* Mobile Backdrop when sidebar is open on small screens */}
      {open && (
        <div
          onClick={onToggle}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity"
        />
      )}

      <aside
        className={`
          fixed md:relative top-0 left-0 bottom-0 flex flex-col h-screen transition-all duration-300 ease-in-out
          ${open ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-[72px]'}
          bg-gradient-to-b from-[#0a1628] via-[#0d2137] to-[#0a3320]
          shadow-2xl border-r border-white/5 z-40 shrink-0
        `}
      >
        {/* Brand Header */}
        <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${open ? '' : 'justify-center'}`}>
          <svg width="38" height="38" viewBox="0 0 42 42" className="shrink-0">
            <defs>
              <linearGradient id="mLf1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="mLf2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>
            <circle cx="21" cy="21" r="20" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.2" strokeWidth="1" />
            <path d="M9 27 C9 18, 17 12, 21 14 C17 18, 15 23, 16 29 C12 29, 9 28, 9 27 Z" fill="url(#mLf1)" />
            <path d="M33 27 C33 18, 25 12, 21 14 C25 18, 27 23, 26 29 C30 29, 33 28, 33 27 Z" fill="url(#mLf2)" />
            <circle cx="21" cy="14" r="3" fill="white" />
            <line x1="21" y1="17" x2="21" y2="26" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>

          {open && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-black text-white tracking-wider leading-none">URJA</div>
              <div className="text-[10px] font-bold text-emerald-400 tracking-wider">WELLNESS CLUB</div>
              <div className="text-[9px] text-gray-400 truncate mt-0.5">Master Blueprint Software</div>
            </div>
          )}
        </div>

        {/* User Role Banner */}
        {open && user && (
          <div className="mx-3 my-2 p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase">{userRole} ACCESS</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-white/10">
          {open && (
            <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {t ? t('માસ્ટર મોડ્યુલ્સ', 'Master Modules') : 'Master Modules'} ({navItems.length})
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const label = t ? t(item.labelGUJ, item.labelENG) : item.labelENG;
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
                title={label}
              >
                <Icon size={17} className="shrink-0" />
                {open && <span className="truncate">{label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Controls */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={onToggle}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors ${
              open ? '' : 'justify-center'
            }`}
          >
            {open ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
            {open && <span>{t ? t('મેનુ સંકોચો', 'Collapse Sidebar') : 'Collapse Sidebar'}</span>}
          </button>

          <button
            onClick={() => { logout && logout(); navigate('/login'); }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors ${
              open ? '' : 'justify-center'
            }`}
          >
            <FiLogOut size={18} />
            {open && <span>{t ? t('લોગ આઉટ', 'Sign Out') : 'Sign Out'}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
