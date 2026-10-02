import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FiMenu, FiBell, FiSearch, FiUser, FiLogOut,
  FiChevronDown, FiAlertCircle, FiClock, FiX, FiCheck, FiPackage, FiFileText
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

export default function Header() {
  const {
    user, logout, sidebarOpen, setSidebarOpen,
    members, products, payments, refillReminders, lowStockItems, expiringProducts, leads
  } = useApp();

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

    const matchedMembers = members.filter(m =>
      m.name?.toLowerCase().includes(q) ||
      m.mobile?.includes(q) ||
      m.id?.toLowerCase().includes(q) ||
      m.barcode?.includes(q)
    ).slice(0, 4).map(m => ({ type: 'Member', label: `${m.name} (${m.id})`, sub: `Mobile: ${m.mobile} | Outstanding: ₹${m.pending}`, data: m, link: '/members' }));

    const matchedProducts = products.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q) ||
      p.barcode?.includes(q)
    ).slice(0, 3).map(p => ({ type: 'Product', label: `${p.name}`, sub: `Code: ${p.id} | Stock: ${p.currentStock} ${p.unit}`, data: p, link: '/inventory' }));

    const matchedBills = payments.filter(p =>
      p.receiptNo?.toLowerCase().includes(q) ||
      p.memberName?.toLowerCase().includes(q)
    ).slice(0, 3).map(b => ({ type: 'Bill', label: `Receipt #${b.receiptNo}`, sub: `Member: ${b.memberName} | ₹${b.amount}`, data: b, link: '/payments' }));

    const combined = [...matchedMembers, ...matchedProducts, ...matchedBills];
    setSearchResults(combined);
    setShowSearchDropdown(combined.length > 0);
  }, [query, members, products, payments]);

  // Click outside to close menus
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchDropdown(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSearchResult = (res) => {
    setShowSearchDropdown(false);
    setQuery('');
    navigate(res.link);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard': return 'Main Dashboard';
      case '/members': return 'Member Master & Profiles';
      case '/attendance': return 'Attendance & Barcode Check-in';
      case '/consumption': return 'Daily Shake & Center Consumption';
      case '/billing': return 'Barcode Billing Screen';
      case '/payments': return 'Payment Collection & Dues';
      case '/ledger': return 'Member Account Ledger';
      case '/purchases': return 'Stock Purchase Entry';
      case '/inventory': return 'Product Stock & Inventory';
      case '/adjustments': return 'Stock Adjustments';
      case '/expiries': return 'Expiry Management';
      case '/refill-reminder': return 'Product Refill Reminders';
      case '/crm': return 'Lead & Follow-Up CRM';
      case '/expenses': return 'Daily Expense Management';
      case '/daily-closing': return 'Daily Cash Closing Screen';
      case '/reports': return 'Reports & Business Analytics';
      case '/whatsapp': return 'WhatsApp Message Center';
      case '/users': return 'User Security & Access Rights';
      case '/audit-log': return 'Audit & Activity Log';
      default: return 'URJA Wellness Club Panel';
    }
  };

  // Specification Notification items calculation
  const notificationsList = [
    { title: '12 Refill Due Today', sub: 'Amit Sureliya & 11 others expected finish', icon: '🔔', color: 'orange' },
    { title: '6 Payment Dues Pending', sub: 'Total ₹12,850 pending collection', icon: '💳', color: 'red' },
    { title: `3 Low Stock Items`, sub: `${lowStockItems.map(i => i.name).join(', ')}`, icon: '⚠️', color: 'yellow' },
    { title: `${expiringProducts.length} Products Expiring Soon`, sub: 'Check Expiry Management tab', icon: '⏳', color: 'purple' },
    { title: '8 Follow-ups Scheduled Today', sub: 'Check Lead & Follow-up CRM', icon: '🎯', color: 'blue' },
    { title: '5 Absent Members (3+ Days)', sub: 'Priya Desai & 4 others', icon: '🚨', color: 'rose' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Sidebar toggle + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-500 hover:text-navy-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Toggle Sidebar"
        >
          <FiMenu size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-navy-900 leading-tight">{getPageTitle()}</h1>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>Surat Main Branch</span>
            <span>•</span>
            <span className="font-medium text-gray-500">{format(time, 'EEE, dd MMM yyyy — hh:mm:ss a')}</span>
          </div>
        </div>
      </div>

      {/* Middle: Specification Section 23 Global Search */}
      <div className="flex-1 max-w-md relative hidden md:block" ref={searchRef}>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            placeholder="Global Search: Member, Mobile, Barcode, Bill No..."
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
            {searchResults.map((res, i) => (
              <div
                key={i}
                onClick={() => handleSelectSearchResult(res)}
                className="px-4 py-2.5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-gray-50 last:border-0"
              >
                <div>
                  <div className="text-sm font-semibold text-navy-900">{res.label}</div>
                  <div className="text-xs text-gray-500">{res.sub}</div>
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

      {/* Right Actions: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Specification Section 24: Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 text-gray-600 hover:text-navy-900 hover:bg-gray-100 rounded-xl transition-colors"
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
                <div className="font-bold text-navy-900 text-sm">🔔 Notification Center</div>
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
                <button onClick={() => { setShowNotifs(false); navigate('/refill-reminder'); }} className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
                  View All Dashboard Alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Role Badge & Avatar */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-navy-900 text-white font-bold flex items-center justify-center text-sm shadow-md">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-navy-900 leading-tight">{user?.name || 'Admin User'}</div>
              <span className="inline-block text-[10px] font-bold px-2 py-0.2 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {user?.role || 'ADMIN'}
              </span>
            </div>
            <FiChevronDown className="text-gray-400" size={14} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-bold text-navy-900">{user?.name || 'Admin User'}</div>
                <div className="text-xs text-gray-400">Role: <span className="font-semibold text-emerald-700">{user?.role || 'ADMIN'}</span></div>
              </div>
              <button
                onClick={() => { setShowProfile(false); navigate('/users'); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FiUser size={14} /> User Security & Access
              </button>
              <button
                onClick={() => { setShowProfile(false); logout(); navigate('/login'); }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FiLogOut size={14} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
