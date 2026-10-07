import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu, FiBell, FiSearch, FiUser, FiLogOut,
  FiChevronDown, FiGlobe, FiX, FiCheck, FiPackage, FiFileText
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

export default function Header() {
  const {
    user, logout, sidebarOpen, setSidebarOpen,
    members = [], products = [], payments = [], refillReminders = [], lowStockItems = [], expiringProducts = [], leads = [],
    lang, toggleLang, t
  } = useApp() || {};

  const location = useLocation();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Global Search state
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Update clock live
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle global search typing
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const q = query.toLowerCase().trim();

    const matchedMembers = (members || []).filter((m: any) =>
      m.name?.toLowerCase().includes(q) ||
      m.mobile?.includes(q) ||
      m.id?.toLowerCase().includes(q) ||
      m.barcode?.includes(q)
    ).slice(0, 4).map((m: any) => ({ type: 'Member', label: `${m.name} (${m.id})`, sub: `Mobile: ${m.mobile} | Outstanding: ₹${m.pending}`, data: m, link: '/members' }));

    const matchedProducts = (products || []).filter((p: any) =>
      p.name?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q) ||
      p.barcode?.includes(q)
    ).slice(0, 3).map((p: any) => ({ type: 'Product', label: `${p.name}`, sub: `Code: ${p.id} | Stock: ${p.currentStock} ${p.unit}`, data: p, link: '/inventory' }));

    const matchedBills = (payments || []).filter((p: any) =>
      p.receiptNo?.toLowerCase().includes(q) ||
      p.memberName?.toLowerCase().includes(q)
    ).slice(0, 3).map((b: any) => ({ type: 'Bill', label: `Receipt #${b.receiptNo}`, sub: `Member: ${b.memberName} | ₹${b.amount}`, data: b, link: '/payments' }));

    const combined = [...matchedMembers, ...matchedProducts, ...matchedBills];
    setSearchResults(combined);
    setShowSearchDropdown(combined.length > 0);
  }, [query, members, products, payments]);

  // Click outside to close menus
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (notifRef.current && !(notifRef.current as any).contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !(profileRef.current as any).contains(e.target)) setShowProfile(false);
      if (searchRef.current && !(searchRef.current as any).contains(e.target)) setShowSearchDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (res: any) => {
    setShowSearchDropdown(false);
    setQuery('');
    navigate(res.link);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard': return t ? t('મુખ્ય ડેશબોર્ડ', 'Main Dashboard') : 'Main Dashboard';
      case '/coach-dashboard': return t ? t('કોચ ડેશબોર્ડ', 'Coach Dashboard') : 'Coach Dashboard';
      case '/members': return t ? t('સભ્ય રજીસ્ટ્રેશન અને પ્રોફાઈલ', 'Member Registration & Profiles') : 'Member Registration & Profiles';
      case '/attendance': return t ? t('QR હાજરી અને ચેક-ઈન', 'QR Attendance & Check-in') : 'QR Attendance & Check-in';
      case '/photo-management': return t ? t('ફોટો ટ્રાન્સફોર્મેશન રિવ્યુ', 'Photo Transformation Review') : 'Photo Transformation Review';
      case '/body-measurements': return t ? t('બોડી માપન અને પ્રોગ્રેસ', 'Body Measurements & Progress') : 'Body Measurements & Progress';
      case '/wellness-trackers': return t ? t('ન્યુટ્રિશન અને વેલનેસ ટ્રેકર્સ', 'Nutrition & Wellness Trackers') : 'Nutrition & Wellness Trackers';
      case '/habits-tracker': return t ? t('દૈનિક 8-પોઇન્ટ હેબિટ ટ્રેકર', 'Daily 8-Point Habit Tracker') : 'Daily 8-Point Habit Tracker';
      case '/payments-ledger': return t ? t('ચુકવણી અને લેજર', 'Payments & Ledger') : 'Payments & Ledger';
      case '/inventory-refill': return t ? t('સ્ટોક અને રીફિલ રીમાઇન્ડર', 'Inventory & Refill Alerts') : 'Inventory & Refill Alerts';
      case '/whatsapp-reminders': return t ? t('વોટ્સએપ ઓટો રીમાઇન્ડર્સ', 'WhatsApp Auto Reminders') : 'WhatsApp Auto Reminders';
      case '/followup-system': return t ? t('ફોલો-અપ અને લીડ સિસ્ટમ', 'Follow-up & Lead System') : 'Follow-up & Lead System';
      case '/transformation-programs': return t ? t('૩૦ અને ૯૦ દિવસ રોડમેપ', '30 & 90-Day Transformation') : '30 & 90-Day Transformation';
      case '/reports-center': return t ? t('રિપોર્ટ્સ અને ડાઉનલોડ સેન્ટર', 'Reports & Download Center') : 'Reports & Download Center';
      case '/member-portal': return t ? t('મેમ્બર મોબાઇલ એપ પોર્ટલ', 'Member Mobile Portal') : 'Member Mobile Portal';
      default: return 'URJA Wellness Club Panel';
    }
  };

  // Notification items calculation
  const notificationsList = [
    { title: t ? t('૧૨ રીફિલ ડ્યૂ આજે', '12 Refill Due Today') : '12 Refill Due Today', sub: 'Amit Sureliya & 11 others expected finish', icon: '🔔', color: 'orange' },
    { title: t ? t('૬ પેમેન્ટ બાકી ચુકવણી', '6 Payment Dues Pending') : '6 Payment Dues Pending', sub: 'Total ₹12,850 pending collection', icon: '💳', color: 'red' },
    { title: t ? t('૩ ઓછો સ્ટોક પ્રોડક્ટ્સ', '3 Low Stock Items') : '3 Low Stock Items', sub: `${(lowStockItems || []).map((i: any) => i.name).join(', ') || 'Formula 1 Shake, Protein'}`, icon: '⚠️', color: 'yellow' },
    { title: `${(expiringProducts || []).length} ${t ? t('પ્રોડક્ટ્સ એક્સપાયરી નજીક', 'Products Expiring Soon') : 'Products Expiring Soon'}`, sub: 'Check Expiry Management tab', icon: '⏳', color: 'purple' },
    { title: t ? t('૮ ફોલો-અપ શેડ્યૂલ', '8 Follow-ups Scheduled Today') : '8 Follow-ups Scheduled Today', sub: 'Check Lead & Follow-up CRM', icon: '🎯', color: 'blue' },
    { title: t ? t('૫ સભ્યો ગેરહાજર (૩+ દિવસ)', '5 Absent Members (3+ Days)') : '5 Absent Members (3+ Days)', sub: 'Priya Desai & 4 others', icon: '🚨', color: 'rose' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
      {/* Left: Sidebar toggle + Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors shrink-0"
          title="Toggle Navigation Menu"
        >
          <FiMenu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-black text-[#0a1628] leading-tight truncate">{getPageTitle()}</h1>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Surat Main Branch</span>
            <span>•</span>
            <span className="font-medium text-gray-600">{format(time, 'EEE, dd MMM — hh:mm:ss a')}</span>
          </div>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-xs sm:max-w-md relative hidden md:block" ref={searchRef}>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            placeholder={t ? t('ગ્લોબલ સર્ચ: સભ્યનું નામ, મોબાઈલ, બારકોડ...', 'Global Search: Member, Mobile, Barcode...') : 'Global Search: Member, Mobile, Barcode...'}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowSearchDropdown(true)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Global Search Dropdown */}
        {showSearchDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
            <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Search Results</div>
            {searchResults.map((res: any, i: number) => (
              <div
                key={i}
                onClick={() => handleSelectSearchResult(res)}
                className="px-4 py-2.5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0"
              >
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-[#0a1628]">{res.label}</div>
                  <div className="text-[11px] text-gray-500">{res.sub}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  res.type === 'Member' ? 'bg-emerald-100 text-emerald-800' :
                  res.type === 'Product' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {res.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Actions: Language Switcher, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Language Toggle Switcher */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all shadow-sm active:scale-95"
          title="Switch Language (ગુજરાતી / English)"
        >
          <FiGlobe className="text-emerald-600 animate-spin-slow" size={15} />
          <span>{lang === 'GUJ' ? 'ગુજરાતી' : 'English'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 text-gray-600 hover:text-emerald-700 hover:bg-gray-100 rounded-xl transition-colors"
            title="Notification Center"
          >
            <FiBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
              6
            </span>
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-fade-in">
              <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                <div className="font-bold text-[#0a1628] text-sm">🔔 Notification Center</div>
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">6 Action Required</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {notificationsList.map((n, idx) => (
                  <div key={idx} className="p-3 hover:bg-gray-50 flex gap-3 items-start transition-colors cursor-pointer">
                    <span className="text-xl flex-shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-800">{n.title}</div>
                      <div className="text-[11px] text-gray-500 truncate">{n.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pt-2 border-t border-gray-100 text-center">
                <button onClick={() => { setShowNotifs(false); navigate('/inventory-refill'); }} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                  {t ? t('બધા એલર્ટ્સ જુઓ →', 'View All Dashboard Alerts →') : 'View All Dashboard Alerts →'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-[#0a1628] text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow-md">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-[#0a1628] leading-tight">{user?.name || 'Admin User'}</div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {user?.role || 'ADMIN'}
              </span>
            </div>
            <FiChevronDown className="text-gray-400" size={14} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-bold text-[#0a1628]">{user?.name || 'Admin User'}</div>
                <div className="text-xs text-gray-400">Role: <span className="font-semibold text-emerald-700">{user?.role || 'ADMIN'}</span></div>
              </div>
              <button
                onClick={() => { setShowProfile(false); navigate('/members'); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FiUser size={14} /> {t ? t('સભ્યોની પ્રોફાઈલ', 'Members Profiles') : 'Members Profiles'}
              </button>
              <button
                onClick={() => { setShowProfile(false); logout(); navigate('/login'); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FiLogOut size={14} /> {t ? t('લોગ આઉટ (Sign Out)', 'Sign Out') : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
