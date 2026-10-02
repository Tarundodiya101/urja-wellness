import { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  FiDownload, FiCalendar, FiTrendingUp, FiUsers, FiDollarSign,
  FiActivity, FiStar, FiSearch, FiAward, FiRefreshCw,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MONTHLY_STATS = [
  { month: 'Apr', revenue: 182000, newMembers: 28, active: 145, expired: 12, shakes: 890,  renewals: 18, attendance: 78 },
  { month: 'May', revenue: 196000, newMembers: 34, active: 158, expired: 10, shakes: 960,  renewals: 22, attendance: 80 },
  { month: 'Jun', revenue: 210000, newMembers: 41, active: 170, expired: 8,  shakes: 1050, renewals: 26, attendance: 82 },
  { month: 'Jul', revenue: 198000, newMembers: 30, active: 162, expired: 14, shakes: 980,  renewals: 20, attendance: 79 },
  { month: 'Aug', revenue: 225000, newMembers: 45, active: 178, expired: 9,  shakes: 1120, renewals: 30, attendance: 85 },
  { month: 'Sep', revenue: 238000, newMembers: 52, active: 192, expired: 7,  shakes: 1200, renewals: 34, attendance: 87 },
  { month: 'Oct', revenue: 245000, newMembers: 48, active: 196, expired: 6,  shakes: 1250, renewals: 38, attendance: 88 },
];

const MEMBER_PERFORMANCE = [
  { id: 1, name: 'Anjali Mehta',  package: '3-Month Premium', attendance: 92, consistency: 22, lastVisit: '2026-10-01', weightLoss: '-4.2 kg', renewals: 3, status: 'Active'   },
  { id: 2, name: 'Suresh Patel',  package: '1-Month Basic',   attendance: 75, consistency: 18, lastVisit: '2026-09-30', weightLoss: '-2.1 kg', renewals: 1, status: 'Active'   },
  { id: 3, name: 'Pooja Rao',     package: '6-Month Premium', attendance: 88, consistency: 21, lastVisit: '2026-09-29', weightLoss: '-6.8 kg', renewals: 5, status: 'Active'   },
  { id: 4, name: 'Ramesh Kumar',  package: '3-Month Basic',   attendance: 55, consistency: 13, lastVisit: '2026-09-28', weightLoss: '-1.0 kg', renewals: 2, status: 'At Risk'  },
  { id: 5, name: 'Deepa Iyer',    package: '1-Month Basic',   attendance: 40, consistency: 10, lastVisit: '2026-09-27', weightLoss: '-0.5 kg', renewals: 0, status: 'Inactive' },
  { id: 6, name: 'Vikram Nair',   package: '6-Month Premium', attendance: 96, consistency: 23, lastVisit: '2026-10-01', weightLoss: '-8.3 kg', renewals: 4, status: 'Active'   },
  { id: 7, name: 'Lata Tiwari',   package: '3-Month Basic',   attendance: 68, consistency: 16, lastVisit: '2026-09-30', weightLoss: '-2.7 kg', renewals: 2, status: 'Active'   },
  { id: 8, name: 'Nikhil Chawla', package: '1-Month Premium', attendance: 33, consistency: 8,  lastVisit: '2026-09-23', weightLoss: '0 kg',    renewals: 1, status: 'Inactive' },
  { id: 9, name: 'Meena Singh',   package: '3-Month Premium', attendance: 80, consistency: 19, lastVisit: '2026-09-29', weightLoss: '-3.5 kg', renewals: 3, status: 'Active'   },
  { id: 10, name: 'Arun Pillai',  package: '6-Month Basic',   attendance: 62, consistency: 15, lastVisit: '2026-09-25', weightLoss: '-1.8 kg', renewals: 2, status: 'At Risk'  },
];

const COACH_PERFORMANCE = [
  { id: 1, name: 'Priya Sharma', members: 52, avgAttendance: 84, followUps: 38, renewals: 12, collections: 82000, rating: 4.8 },
  { id: 2, name: 'Rahul Verma',  members: 48, avgAttendance: 79, followUps: 31, renewals: 10, collections: 74000, rating: 4.5 },
  { id: 3, name: 'Neha Gupta',   members: 40, avgAttendance: 88, followUps: 35, renewals: 9,  collections: 68000, rating: 4.9 },
  { id: 4, name: 'Amit Singh',   members: 38, avgAttendance: 76, followUps: 28, renewals: 7,  collections: 58000, rating: 4.3 },
];

const DAILY_DATA = {
  cash:        12500,
  upi:         28400,
  bank:         9100,
  outstanding: 15000,
  expenses:     8200,
};

const PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

const STATUS_STYLE = {
  Active:   'bg-green-100 text-green-700',
  'At Risk':'bg-orange-100 text-orange-700',
  Inactive: 'bg-red-100 text-red-700',
};

// ─── Shared Components ────────────────────────────────────────────────────────

function StatCard({ label, value, sub = '', icon: Icon, color = 'text-primary-600', bg = 'bg-primary-50' }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
      <div className={`${bg} p-2.5 rounded-xl flex-shrink-0`}>
        <Icon className={color} size={18}/>
      </div>
      <div>
        <p className="text-xl font-bold text-navy-800">{value}</p>
        <p className="text-xs font-medium text-gray-700 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <FiStar key={s} size={12}
          className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
          fill="currentColor"/>
      ))}
      <span className="text-xs text-gray-600 ml-1">{rating}</span>
    </div>
  );
}

function ExportButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-navy-700 text-white rounded-lg text-sm font-semibold hover:bg-navy-800 transition-colors">
      <FiDownload size={14}/> Export
    </button>
  );
}

function CustomTooltip({ active, payload, label, prefix = '₹', suffix = '' }: { active?: boolean; payload?: any[]; label?: string; prefix?: string; suffix?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-medium">
          {p.name}: {prefix}{p.value.toLocaleString()}{suffix}
        </p>
      ))}
    </div>
  );
}

// ─── Tab 1: Daily Report ──────────────────────────────────────────────────────

function DailyReport() {
  const [date, setDate] = useState('2026-10-01');
  const total = DAILY_DATA.cash + DAILY_DATA.upi + DAILY_DATA.bank;

  const pieData = [
    { name: 'Cash',  value: DAILY_DATA.cash },
    { name: 'UPI',   value: DAILY_DATA.upi  },
    { name: 'Bank',  value: DAILY_DATA.bank  },
  ];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Date:</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
        </div>
        <ExportButton/>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Cash', value: `₹${DAILY_DATA.cash.toLocaleString()}`, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'UPI',  value: `₹${DAILY_DATA.upi.toLocaleString()}`,  color: 'text-blue-600',  bg: 'bg-blue-50'  },
          { label: 'Bank', value: `₹${DAILY_DATA.bank.toLocaleString()}`, color: 'text-purple-600',bg: 'bg-purple-50'},
          { label: 'Outstanding', value: `₹${DAILY_DATA.outstanding.toLocaleString()}`, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Expenses',    value: `₹${DAILY_DATA.expenses.toLocaleString()}`,    color: 'text-red-600',    bg: 'bg-red-50'    },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Summary Table + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Summary Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-navy-800">Daily Closing Summary — {date}</h3>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-50">
                {[
                  { label: 'Cash Collection',     value: `₹${DAILY_DATA.cash.toLocaleString()}`,        style: 'text-green-600 font-semibold'  },
                  { label: 'UPI Collection',       value: `₹${DAILY_DATA.upi.toLocaleString()}`,         style: 'text-blue-600 font-semibold'   },
                  { label: 'Bank Transfer',        value: `₹${DAILY_DATA.bank.toLocaleString()}`,        style: 'text-purple-600 font-semibold' },
                  { label: 'Total Collection',     value: `₹${total.toLocaleString()}`,                  style: 'text-navy-800 font-bold text-base'},
                  { label: 'Outstanding',          value: `₹${DAILY_DATA.outstanding.toLocaleString()}`, style: 'text-orange-600 font-semibold' },
                  { label: 'Expenses',             value: `₹${DAILY_DATA.expenses.toLocaleString()}`,    style: 'text-red-500 font-semibold'    },
                  { label: 'Net Collection',       value: `₹${(total - DAILY_DATA.expenses).toLocaleString()}`, style: 'text-primary-700 font-bold text-base'},
                ].map((r) => (
                  <tr key={r.label}>
                    <td className="py-3 text-gray-600">{r.label}</td>
                    <td className={`py-3 text-right ${r.style}`}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-navy-800 mb-1">Payment Mode Split</h3>
          <p className="text-xs text-gray-400 mb-3">Total: ₹{total.toLocaleString()}</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={95}
                dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
              </Pie>
              <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, '']}/>
              <Legend/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Monthly Report ────────────────────────────────────────────────────

function MonthlyReport() {
  const [month, setMonth] = useState('2026-10');
  const latest = MONTHLY_STATS[MONTHLY_STATS.length - 1];

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Month:</label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
        </div>
        <ExportButton/>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="New Members"    value={latest.newMembers}       icon={FiUsers}      color="text-blue-600"    bg="bg-blue-50"/>
        <StatCard label="Active Members" value={latest.active}           icon={FiActivity}   color="text-green-600"   bg="bg-green-50"/>
        <StatCard label="Expired"        value={latest.expired}          icon={FiRefreshCw}  color="text-red-500"     bg="bg-red-50"/>
        <StatCard label="Attendance"     value={`${latest.attendance}%`} icon={FiTrendingUp} color="text-primary-600" bg="bg-primary-50"/>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Total Shakes"   value={latest.shakes.toLocaleString()}    icon={FiActivity}   color="text-purple-600"  bg="bg-purple-50"/>
        <StatCard label="Total Revenue"  value={`₹${(latest.revenue/1000).toFixed(0)}K`} icon={FiDollarSign} color="text-green-600"   bg="bg-green-50"  sub={`₹${latest.revenue.toLocaleString()}`}/>
        <StatCard label="Renewal Rate"   value={`${Math.round((latest.renewals/latest.active)*100)}%`} icon={FiRefreshCw} color="text-teal-600" bg="bg-teal-50"/>
      </div>

      {/* Revenue Line Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-navy-800 mb-4">Revenue Trend (₹)</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={MONTHLY_STATS} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<CustomTooltip prefix="₹"/>}/>
            <Legend/>
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Members Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-navy-800 mb-4">Members Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_STATS} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip prefix=""/>}/>
              <Legend/>
              <Bar dataKey="newMembers" name="New"     fill="#3b82f6" radius={[4,4,0,0]}/>
              <Bar dataKey="active"     name="Active"  fill="#22c55e" radius={[4,4,0,0]}/>
              <Bar dataKey="expired"    name="Expired" fill="#f87171" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Shakes Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-navy-800 mb-4">Shakes Served Monthly</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_STATS} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip prefix=""/>}/>
              <Bar dataKey="shakes" name="Shakes" fill="#a855f7" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Member Performance ────────────────────────────────────────────────

function MemberPerformance() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() =>
    MEMBER_PERFORMANCE.filter((m) =>
      (statusFilter === 'All' || m.status === statusFilter) &&
      m.name.toLowerCase().includes(search.toLowerCase())
    ),
    [search, statusFilter]
  );

  const avg = (key) => Math.round(filtered.reduce((s, m) => s + m[key], 0) / (filtered.length || 1));

  return (
    <div className="space-y-5">
      {/* Summary quick stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-green-700">{avg('attendance')}%</p>
          <p className="text-xs text-gray-500">Avg Attendance</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-blue-700">{avg('consistency')}</p>
          <p className="text-xs text-gray-500">Avg Visits/Month</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-purple-700">{avg('renewals')}</p>
          <p className="text-xs text-gray-500">Avg Renewals</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search member..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          {['All', 'Active', 'At Risk', 'Inactive'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${statusFilter === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
              {s}
            </button>
          ))}
        </div>
        <ExportButton/>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Member</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Package</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Attendance %</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Consistency</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Last Visit</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Weight Loss</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Renewals</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-10 text-gray-400">No members found.</td></tr>
              )}
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                        {m.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 whitespace-nowrap">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{m.package}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-bold ${m.attendance >= 80 ? 'text-green-600' : m.attendance >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {m.attendance}%
                      </span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${m.attendance >= 80 ? 'bg-green-500' : m.attendance >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${m.attendance}%` }}/>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{m.consistency}/24</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{m.lastVisit}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-semibold ${m.weightLoss.startsWith('-') ? 'text-green-600' : 'text-gray-500'}`}>
                      {m.weightLoss}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-700">{m.renewals}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[m.status]}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 4: Coach Performance ─────────────────────────────────────────────────

function CoachPerformance() {
  const best = [...COACH_PERFORMANCE].sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="space-y-5">
      {/* Best Coach Highlight */}
      <div className="bg-gradient-to-r from-primary-600 to-teal-500 rounded-2xl p-5 text-white flex items-center gap-5">
        <div className="bg-white/20 p-3 rounded-full flex-shrink-0">
          <FiAward size={28} className="text-white"/>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-0.5">⭐ Top Performing Coach</p>
          <h3 className="text-2xl font-bold">{best.name}</h3>
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 text-sm text-white/80">
            <span>{best.members} members</span>
            <span>{best.avgAttendance}% avg attendance</span>
            <span>{best.renewals} renewals</span>
            <span>₹{best.collections.toLocaleString()} collected</span>
            <span>⭐ {best.rating}/5</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Coaches', value: COACH_PERFORMANCE.length, color: 'text-navy-700', bg: 'bg-navy-50' },
          { label: 'Total Members', value: COACH_PERFORMANCE.reduce((s,c)=>s+c.members,0), color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Total Follow-ups', value: COACH_PERFORMANCE.reduce((s,c)=>s+c.followUps,0), color: 'text-primary-700', bg: 'bg-primary-50' },
          { label: 'Total Revenue', value: `₹${(COACH_PERFORMANCE.reduce((s,c)=>s+c.collections,0)/1000).toFixed(0)}K`, color: 'text-green-700', bg: 'bg-green-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Coach</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Members</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Avg Attendance</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Follow-ups</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Renewals</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Collections</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {COACH_PERFORMANCE.map((c) => (
                <tr key={c.id} className={`hover:bg-gray-50/70 transition-colors ${c.id === best.id ? 'bg-green-50/30' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{c.name}</p>
                        {c.id === best.id && (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                            <FiAward size={10}/> Top Coach
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-gray-700">{c.members}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={`text-sm font-bold ${c.avgAttendance >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {c.avgAttendance}%
                      </span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c.avgAttendance >= 80 ? 'bg-green-500' : 'bg-yellow-400'}`}
                          style={{ width: `${c.avgAttendance}%` }}/>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-gray-700">{c.followUps}</td>
                  <td className="px-4 py-4 text-center font-medium text-gray-700">{c.renewals}</td>
                  <td className="px-4 py-4 text-right font-semibold text-green-700">₹{c.collections.toLocaleString()}</td>
                  <td className="px-4 py-4 text-center"><StarRating rating={c.rating}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coach performance bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-navy-800 mb-4">Revenue by Coach</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={COACH_PERFORMANCE} layout="vertical" margin={{ top: 5, right: 40, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false}/>
            <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`}/>
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={100}/>
            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Collections']}/>
            <Bar dataKey="collections" name="Collections" fill="#22c55e" radius={[0,6,6,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'daily',   label: 'Daily Report',        icon: FiCalendar   },
  { id: 'monthly', label: 'Monthly Report',      icon: FiTrendingUp },
  { id: 'member',  label: 'Member Performance',  icon: FiUsers      },
  { id: 'coach',   label: 'Coach Performance',   icon: FiStar       },
];

export default function Reports() {
  // eslint-disable-next-line no-unused-vars
  const app = useApp();
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-800">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Deep insights into daily operations, monthly growth, and performance metrics.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit mb-6 flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon size={15}/>{t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'daily'   && <DailyReport/>}
      {activeTab === 'monthly' && <MonthlyReport/>}
      {activeTab === 'member'  && <MemberPerformance/>}
      {activeTab === 'coach'   && <CoachPerformance/>}
    </div>
  );
}
