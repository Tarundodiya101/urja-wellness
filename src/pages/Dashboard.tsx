import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer,
} from 'recharts';
import {
  FiUsers, FiCheckCircle, FiXCircle, FiCoffee, FiDollarSign,
  FiAlertTriangle, FiBell, FiGift, FiTrendingUp, FiUserPlus,
  FiClipboard, FiFileText, FiPackage, FiArrowUpRight,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import {
  SALES_BY_MODE_TODAY, MONTHLY_STATS, RECENT_ACTIVITIES,
} from '../data/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, icon: Icon, gradient, textColor, iconBg }) => (
  <div className={`rounded-2xl p-5 shadow-lg flex items-center gap-4 ${gradient} relative overflow-hidden`}>
    {/* decorative circle */}
    <span className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} shadow`}>
      <Icon className={`text-xl ${textColor}`} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-white/70 uppercase tracking-wider truncate">{label}</p>
      <p className="text-2xl font-extrabold text-white leading-tight">{value}</p>
      {sub && <p className="text-xs text-white/60 mt-0.5">{sub}</p>}
    </div>
    <FiArrowUpRight className="absolute top-4 right-4 text-white/30 text-lg" />
  </div>
);

const AlertBanner = ({ icon, label, count, detail, bg, border, textMain, textSub }) => (
  <div className={`rounded-xl px-5 py-3 flex items-center gap-3 border-l-4 shadow ${bg} ${border}`}>
    <span className="text-2xl">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className={`font-bold text-sm ${textMain}`}>{label}</p>
      {detail && <p className={`text-xs ${textSub}`}>{detail}</p>}
    </div>
    {count !== undefined && (
      <span className={`text-2xl font-extrabold ${textMain}`}>{count}</span>
    )}
  </div>
);

const CustomPieTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700">{payload[0].name}</p>
      <p className="text-gray-500">₹{fmt(payload[0].value)}</p>
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-primary-600">{payload[0].value} units</p>
    </div>
  );
};

const CustomLineTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === 'revenue' ? `₹${fmt(p.value)}` : p.value}
        </p>
      ))}
    </div>
  );
};

const activityBorderColor = {
  green: 'border-green-400',
  blue: 'border-blue-400',
  red: 'border-red-400',
  purple: 'border-purple-400',
  orange: 'border-orange-400',
};

// Today's consumption data derived from products
const TODAY_CONSUMPTION = [
  { product: 'F1 Shake', consumed: 14 },
  { product: 'Protein', consumed: 6 },
  { product: 'Aloe Vera', consumed: 0 },
  { product: 'Fiber', consumed: 4 },
  { product: 'NRG', consumed: 3 },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const {
    members, activeMembers, todayAttendance, totalOutstanding,
    todayCollection, lowStockItems, renewalsToday, todayBirthdays,
  } = useApp();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('revenue');

  const absentToday = activeMembers.length - todayAttendance.filter(a => a.status === 'Present').length;
  const todayShakes = todayAttendance.reduce((sum, a) => sum + (a.shakeCount || 0), 0);

  const statCards = [
    {
      label: 'Total Active Members',
      value: activeMembers.length,
      sub: `of ${members.length} total`,
      icon: FiUsers,
      gradient: 'bg-gradient-to-br from-primary-500 to-primary-700',
      textColor: 'text-primary-100',
      iconBg: 'bg-white/20',
    },
    {
      label: 'Present Today',
      value: todayAttendance.filter(a => a.status === 'Present').length,
      sub: 'checked in',
      icon: FiCheckCircle,
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
      textColor: 'text-blue-100',
      iconBg: 'bg-white/20',
    },
    {
      label: 'Absent Today',
      value: Math.max(0, absentToday),
      sub: 'active members',
      icon: FiXCircle,
      gradient: 'bg-gradient-to-br from-orange-400 to-orange-600',
      textColor: 'text-orange-100',
      iconBg: 'bg-white/20',
    },
    {
      label: "Today's Shakes Served",
      value: todayShakes,
      sub: 'scoops consumed',
      icon: FiCoffee,
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
      textColor: 'text-purple-100',
      iconBg: 'bg-white/20',
    },
    {
      label: "Today's Collection ₹",
      value: `₹${fmt(todayCollection)}`,
      sub: 'all payment modes',
      icon: FiDollarSign,
      gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-700',
      textColor: 'text-emerald-100',
      iconBg: 'bg-white/20',
    },
    {
      label: 'Total Outstanding ₹',
      value: `₹${fmt(totalOutstanding)}`,
      sub: `${members.filter(m => m.pending > 0).length} members`,
      icon: FiAlertTriangle,
      gradient: 'bg-gradient-to-br from-red-500 to-red-700',
      textColor: 'text-red-100',
      iconBg: 'bg-white/20',
    },
  ];

  const quickActions = [
    { label: 'Add Member', icon: FiUserPlus, color: 'bg-primary-600 hover:bg-primary-700', path: '/members' },
    { label: 'Mark Attendance', icon: FiCheckCircle, color: 'bg-blue-600 hover:bg-blue-700', path: '/attendance' },
    { label: 'New Bill', icon: FiFileText, color: 'bg-purple-600 hover:bg-purple-700', path: '/billing' },
    { label: 'Add Stock', icon: FiPackage, color: 'bg-orange-500 hover:bg-orange-600', path: '/inventory' },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-800 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
          <FiBell className="text-primary-500" />
          <span className="text-sm font-medium text-gray-700">Live Overview</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-1" />
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Alert Banners ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertBanner
          icon="🚨"
          label="Low Stock Alert"
          count={lowStockItems.length}
          detail={lowStockItems.length > 0 ? lowStockItems.map(p => p.name).join(', ') : 'All stocks OK'}
          bg="bg-red-50"
          border="border-red-500"
          textMain="text-red-700"
          textSub="text-red-500"
        />
        <AlertBanner
          icon="🔄"
          label="Renewals Due Today"
          count={renewalsToday.length}
          detail={renewalsToday.length > 0 ? renewalsToday.map(m => m.name).join(', ') : 'No renewals today'}
          bg="bg-orange-50"
          border="border-orange-500"
          textMain="text-orange-700"
          textSub="text-orange-500"
        />
        <AlertBanner
          icon="🎉"
          label="Today's Birthdays"
          count={todayBirthdays.length}
          detail={todayBirthdays.length > 0 ? todayBirthdays.map(m => m.name).join(', ') : 'No birthdays today'}
          bg="bg-purple-50"
          border="border-purple-500"
          textMain="text-purple-700"
          textSub="text-purple-500"
        />
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Pie Chart - Sales by Payment Mode */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h2 className="text-base font-bold text-navy-800 mb-1">Today's Sales by Mode</h2>
          <p className="text-xs text-gray-400 mb-4">Payment breakdown — ₹{fmt(SALES_BY_MODE_TODAY.reduce((s, i) => s + i.value, 0))} total</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={SALES_BY_MODE_TODAY}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {SALES_BY_MODE_TODAY.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
            {SALES_BY_MODE_TODAY.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600 truncate">{item.name}</span>
                <span className="text-xs font-semibold text-gray-800 ml-auto">₹{fmt(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - Today's Consumption */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <h2 className="text-base font-bold text-navy-800 mb-1">Today's Consumption</h2>
          <p className="text-xs text-gray-400 mb-4">Units served by product</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={TODAY_CONSUMPTION} barSize={28} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="product" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="consumed" name="Units" radius={[6, 6, 0, 0]}>
                {TODAY_CONSUMPTION.map((_, i) => (
                  <Cell
                    key={i}
                    fill={['#4ade80', '#60a5fa', '#f87171', '#a78bfa', '#fb923c'][i % 5]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities Feed */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 flex flex-col">
          <h2 className="text-base font-bold text-navy-800 mb-1">Recent Activities</h2>
          <p className="text-xs text-gray-400 mb-4">Live feed — today</p>
          <div className="flex-1 space-y-3 overflow-y-auto max-h-64 pr-1 scrollbar-thin scrollbar-thumb-gray-200">
            {RECENT_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className={`flex items-start gap-3 pl-3 border-l-4 ${activityBorderColor[act.color] || 'border-gray-300'} bg-gray-50 rounded-r-lg py-2 pr-2`}
              >
                <span className="text-base leading-none mt-0.5">{act.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 leading-snug">{act.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/attendance')}
            className="mt-4 text-xs text-primary-600 hover:text-primary-700 font-semibold text-center"
          >
            View All Activity →
          </button>
        </div>
      </div>

      {/* ── Bottom Row: Revenue Chart + Quick Actions ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly Revenue Line Chart (spans 2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-navy-800">Monthly Performance</h2>
              <p className="text-xs text-gray-400">Last 6 months — Revenue, Members & Shakes</p>
            </div>
            <div className="flex gap-2">
              {['revenue', 'members', 'shakes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-primary-600 text-white shadow'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY_STATS} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomLineTooltip />} />
              {activeTab === 'revenue' && (
                <Line
                  type="monotone" dataKey="revenue" name="Revenue"
                  stroke="#16a34a" strokeWidth={3} dot={{ r: 5, fill: '#16a34a', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              )}
              {activeTab === 'members' && (
                <Line
                  type="monotone" dataKey="members" name="Members"
                  stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              )}
              {activeTab === 'shakes' && (
                <Line
                  type="monotone" dataKey="shakes" name="Shakes"
                  stroke="#9333ea" strokeWidth={3} dot={{ r: 5, fill: '#9333ea', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 flex flex-col">
          <h2 className="text-base font-bold text-navy-800 mb-1">Quick Actions</h2>
          <p className="text-xs text-gray-400 mb-5">Common daily tasks</p>
          <div className="flex-1 grid grid-cols-2 gap-3 content-start">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className={`flex flex-col items-center justify-center gap-2 rounded-xl py-5 text-white font-semibold text-xs shadow transition-all hover:scale-105 hover:shadow-md ${action.color}`}
              >
                <action.icon className="text-2xl" />
                <span className="text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Mini stats footer */}
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-400">This Month</p>
              <p className="text-lg font-extrabold text-primary-600">
                ₹{fmt(MONTHLY_STATS[MONTHLY_STATS.length - 1]?.revenue || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Total Members</p>
              <p className="text-lg font-extrabold text-navy-800">{members.length}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
