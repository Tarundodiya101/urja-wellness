import React, { useState } from 'react';
import { FiUser, FiCheckCircle, FiCalendar, FiCreditCard, FiPackage, FiTrendingUp, FiMaximize, FiPhone, FiShare2, FiCoffee } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function MemberApp() {
  const { members, attendance, payments, refillReminders } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001'); // Default demo: Amit Sureliya
  const [activeTab, setActiveTab] = useState('dashboard');

  const member = members.find(m => m.id === selectedMemberId) || members[0];
  const memberAttendance = attendance.filter(a => a.memberId === member.id);
  const memberPayments = payments.filter(p => p.memberId === member.id);
  const memberRefills = refillReminders.filter(r => r.memberId === member.id);

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen shadow-2xl rounded-3xl overflow-hidden border-4 border-gray-800 animate-fade-in my-2">
      {/* App Mobile Header */}
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white p-5 pt-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
              U
            </div>
            <div>
              <div className="text-xs font-black tracking-wider">URJA WELLNESS</div>
              <div className="text-[9px] text-emerald-300">MEMBER MOBILE APP</div>
            </div>
          </div>
          
          {/* Member Switcher Dropdown for Demo */}
          <select
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
            value={selectedMemberId}
            onChange={e => setSelectedMemberId(e.target.value)}
          >
            {members.map(m => (
              <option key={m.id} value={m.id} className="text-gray-900">{m.name} ({m.id})</option>
            ))}
          </select>
        </div>

        {/* Member Profile Card */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
              {member.name ? member.name[0] : 'M'}
            </div>
            <div>
              <div className="text-base font-bold text-white">{member.name}</div>
              <div className="text-xs text-emerald-300">ID: {member.id} • {member.programType}</div>
              <div className="text-[10px] text-gray-300 mt-0.5">Coach: {member.coach}</div>
            </div>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
              {member.status}
            </span>
            <div className="text-[10px] text-gray-300 mt-1">Visits: <span className="font-bold text-white">{member.visitsCount || 86}</span></div>
          </div>
        </div>
      </div>

      {/* Digital Member QR Code Card (Specification Section 31 & 33) */}
      <div className="p-4 bg-white m-4 rounded-2xl shadow-sm border border-gray-200 text-center space-y-2">
        <div className="text-xs font-bold text-navy-900 uppercase flex items-center justify-center gap-1">
          <FiMaximize className="text-emerald-600" /> Digital Center Access QR Code
        </div>
        <div className="p-3 bg-gray-50 inline-block rounded-xl border border-dashed border-emerald-300">
          {/* Simulated QR Code SVG */}
          <svg width="120" height="120" viewBox="0 0 100 100" className="mx-auto">
            <rect width="100" height="100" fill="white" />
            <rect x="10" y="10" width="30" height="30" fill="#0a1628" />
            <rect x="15" y="15" width="20" height="20" fill="white" />
            <rect x="20" y="20" width="10" height="10" fill="#16a34a" />

            <rect x="60" y="10" width="30" height="30" fill="#0a1628" />
            <rect x="65" y="15" width="20" height="20" fill="white" />
            <rect x="70" y="20" width="10" height="10" fill="#16a34a" />

            <rect x="10" y="60" width="30" height="30" fill="#0a1628" />
            <rect x="15" y="65" width="20" height="20" fill="white" />
            <rect x="20" y="70" width="10" height="10" fill="#16a34a" />

            <rect x="50" y="50" width="15" height="15" fill="#0a1628" />
            <rect x="70" y="65" width="20" height="20" fill="#16a34a" />
            <rect x="50" y="75" width="15" height="15" fill="#0a1628" />
          </svg>
        </div>
        <div className="text-[11px] font-mono text-gray-500">Scan at Center Reception for Instant Attendance</div>
      </div>

      {/* App Nav Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-2 text-xs font-bold justify-around">
        {[
          { id: 'dashboard', label: 'Home', icon: FiUser },
          { id: 'attendance', label: 'Attendance', icon: FiCheckCircle },
          { id: 'payments', label: 'Payments', icon: FiCreditCard },
          { id: 'refill', label: 'Refill', icon: FiPackage },
          { id: 'progress', label: 'Progress', icon: FiTrendingUp },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-3 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors ${
                activeTab === t.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-400'
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-4 space-y-4 pb-20">
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Package & Dues */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="text-gray-500 font-semibold">Active Plan</div>
                <div className="font-bold text-emerald-900 text-sm mt-0.5">{member.package}</div>
                <div className="text-[10px] text-emerald-700 mt-1">Expires: {member.expiryDate}</div>
              </div>
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                <div className="text-gray-500 font-semibold">Pending Dues</div>
                <div className={`font-black text-base mt-0.5 ${member.pending > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  ₹{(member.pending || 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">{member.pending > 0 ? 'Pay at Reception' : 'All Clear ✓'}</div>
              </div>
            </div>

            {/* Today's Shake Status */}
            <div className="p-4 bg-white rounded-2xl border border-gray-200 space-y-2">
              <div className="text-xs font-bold text-navy-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><FiCoffee className="text-emerald-600" /> Today Shake & Drink Log</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">SERVED ✓</span>
              </div>
              <div className="text-xs text-gray-600">Formula 1 Shake (Vanilla) + Protein Scoop & Aloe Drink</div>
              <div className="text-[10px] text-gray-400">Checked in at 07:42 AM Today</div>
            </div>

            {/* Goal Card */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl space-y-2">
              <div className="text-xs font-bold flex items-center justify-between">
                <span>🎯 Your Weight Loss Goal</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">4 kg Lost</span>
              </div>
              <div className="flex justify-between items-baseline text-xs">
                <div>Start: <span className="font-bold">78 kg</span></div>
                <div>Current: <span className="font-bold text-lg">74 kg</span></div>
                <div>Target: <span className="font-bold">68 kg</span></div>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[60%] rounded-full"></div>
              </div>
            </div>

            {/* Coach Quick Call */}
            <div className="p-3 bg-white rounded-2xl border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-navy-100 text-navy-900 font-bold flex items-center justify-center">
                  📞
                </div>
                <div>
                  <div className="font-bold text-navy-900">Your Wellness Coach</div>
                  <div className="text-gray-500">{member.coach}</div>
                </div>
              </div>
              <button
                onClick={() => alert(`Calling Coach ${member.coach}...`)}
                className="btn-primary py-1 px-3 text-xs"
              >
                Call Coach
              </button>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-3 text-xs">
            <div className="font-bold text-navy-900 text-sm">Your Attendance History</div>
            {memberAttendance.map(a => (
              <div key={a.id} className="p-3 bg-white rounded-xl border flex items-center justify-between">
                <div>
                  <div className="font-bold text-navy-900">{a.date} ({a.time || '07:42 AM'})</div>
                  <div className="text-emerald-700 font-semibold">{a.shake} (x{a.shakeCount})</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  PRESENT
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3 text-xs">
            <div className="font-bold text-navy-900 text-sm">Payment History & Digital Receipts</div>
            {memberPayments.map(p => (
              <div key={p.id} className="p-3 bg-white rounded-xl border flex justify-between items-center">
                <div>
                  <div className="font-bold text-navy-900">Receipt #{p.receiptNo}</div>
                  <div className="text-gray-500">{p.date} • {p.mode}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700 text-sm">₹{p.amount?.toLocaleString()}</div>
                  <span className="text-[10px] text-gray-400 font-semibold">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'refill' && (
          <div className="space-y-3 text-xs">
            <div className="font-bold text-navy-900 text-sm">Product Usage & Refill Tracker</div>
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl text-orange-950 space-y-2">
              <div className="font-bold text-sm">🔔 Nutrition Shake Refill Approaching</div>
              <div>Expected Finish Date: <span className="font-bold">05/10/2025</span></div>
              <div className="text-[11px] text-orange-800">Please order refill at URJA Wellness Club counter or via Coach.</div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-3 text-xs">
            <div className="font-bold text-navy-900 text-sm">Weight & Fitness Progress Log</div>
            <div className="p-4 bg-white rounded-2xl border space-y-2">
              <div className="flex justify-between font-semibold border-b pb-2">
                <span>Date</span>
                <span>Weight</span>
                <span>Status</span>
              </div>
              <div className="flex justify-between">
                <span>11/09/2025</span>
                <span>78.0 kg</span>
                <span className="text-gray-400">Joining</span>
              </div>
              <div className="flex justify-between">
                <span>20/09/2025</span>
                <span>76.2 kg</span>
                <span className="text-emerald-600 font-bold">-1.8 kg</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>01/10/2025</span>
                <span>74.0 kg</span>
                <span>-4.0 kg Total! 🎉</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
