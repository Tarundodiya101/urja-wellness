import React, { useState } from 'react';
import { FiUser, FiCheckCircle, FiCamera, FiTrendingUp, FiCoffee, FiCreditCard, FiMaximize, FiPhone, FiSun, FiMoon, FiActivity, FiSmile } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function MemberPortal() {
  const { members, attendance, measurements, photos, wellnessLogs, payments } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001');
  const [activeTab, setActiveTab] = useState('overview');

  const member = members.find((m: any) => m.id === selectedMemberId) || members[0];
  const memberAttendance = attendance.filter((a: any) => a.memberId === member.id);
  const memberMeasurements = measurements[member.id] || [];
  const memberPhotosList = photos[member.id] || [];
  const memberPayments = payments.filter((p: any) => p.memberId === member.id);
  const log = wellnessLogs[member.id] || {};

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen shadow-2xl rounded-3xl overflow-hidden border-4 border-emerald-800 animate-fade-in my-2">
      {/* App Mobile Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-emerald-900 text-white p-5 pt-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center">
              U
            </div>
            <div>
              <div className="text-xs font-black tracking-wider">URJA WELLNESS</div>
              <div className="text-[9px] text-emerald-300">MEMBER PERSONAL PORTAL</div>
            </div>
          </div>
          
          <select
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none font-bold"
            value={selectedMemberId}
            onChange={e => setSelectedMemberId(e.target.value)}
          >
            {members.map((m: any) => (
              <option key={m.id} value={m.id} className="text-gray-900">{m.name}</option>
            ))}
          </select>
        </div>

        {/* Member Profile Banner */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center text-xl shadow-md">
              {member.name[0]}
            </div>
            <div>
              <div className="text-base font-bold text-white">{member.name}</div>
              <div className="text-xs text-emerald-300">ID: {member.id} • {member.programType}</div>
              <div className="text-[10px] text-gray-300 mt-0.5">Coach: {member.coach}</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
            {member.status}
          </span>
        </div>
      </div>

      {/* Specification Section 31: Member Access QR Code Card */}
      <div className="p-4 bg-white m-4 rounded-2xl shadow-sm border border-gray-200 text-center space-y-2">
        <div className="text-xs font-bold text-navy-900 uppercase flex items-center justify-center gap-1">
          <FiMaximize className="text-emerald-600" /> Digital Member Center QR Access Card
        </div>
        <div className="p-3 bg-gray-50 inline-block rounded-xl border border-dashed border-emerald-400">
          <svg width="110" height="110" viewBox="0 0 100 100" className="mx-auto">
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
          </svg>
        </div>
        <div className="text-[10px] font-mono text-gray-500">Barcode: {member.barcode || '890001'}</div>
      </div>

      {/* Nav Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-2 text-xs font-bold justify-around">
        {[
          { id: 'overview', label: 'Home', icon: FiUser },
          { id: 'habits', label: 'Habits', icon: FiCheckCircle },
          { id: 'photos', label: 'Photos', icon: FiCamera },
          { id: 'measurements', label: 'Body', icon: FiTrendingUp },
          { id: 'payments', label: 'Ledger', icon: FiCreditCard },
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

      {/* Tab Content */}
      <div className="p-4 space-y-4 pb-16">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 text-sm">🎯 Your Transformation Goal</div>
              <div className="text-emerald-800">{member.wellnessGoal}</div>
              <div className="flex justify-between font-bold text-emerald-900 pt-1">
                <span>Start: 78.0 kg</span>
                <span className="text-emerald-700">Current: {member.weight || 74.0} kg</span>
                <span>Target: {member.targetWeight || 68.0} kg</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border space-y-2 text-xs">
              <div className="font-bold text-navy-900 flex justify-between">
                <span>💧 Daily Hydration Target</span>
                <span className="text-blue-600 font-bold">3.5 / 3.5 Liters (100%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[100%] rounded-full"></div>
              </div>
            </div>

            <button onClick={() => alert(`Calling Coach ${member.coach}...`)} className="btn-primary w-full justify-center">
              <FiPhone /> Call Coach {member.coach}
            </button>
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="space-y-3 text-xs">
            <div className="font-bold text-navy-900 text-sm">Your Daily Habit Score: <span className="text-emerald-600 font-bold">8/8 Excellent ⭐</span></div>
            <div className="p-4 bg-white rounded-2xl border space-y-2">
              <div>✓ 1. Portion Controlled Nutrition Meal</div>
              <div>✓ 2. Hydration 3.5L Water Completed</div>
              <div>✓ 3. 45+ mins Daily Walking / Movement</div>
              <div>✓ 4. 7.5 hrs Restful Sleep</div>
              <div>✓ 5. Fresh Fruits & Vegetables Served</div>
              <div>✓ 6. Active Stress Relief & Breathing</div>
              <div>✓ 7. URJA Center Session Attended</div>
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="space-y-3 text-xs">
            <div className="font-bold text-navy-900 text-sm">Your Transformation Photos</div>
            {memberPhotosList.map((p: any, idx: number) => (
              <div key={idx} className="p-3 bg-white rounded-2xl border space-y-1">
                <div className="font-bold text-navy-900">{p.stage} ({p.date})</div>
                <div className="text-emerald-700 font-mono">{p.front} • {p.side}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'measurements' && (
          <div className="space-y-3 text-xs">
            <div className="font-bold text-navy-900 text-sm">Body Measurement History</div>
            {memberMeasurements.map((m: any, idx: number) => (
              <div key={idx} className="p-3 bg-white rounded-2xl border flex justify-between">
                <div>
                  <div className="font-bold text-navy-900">{m.stage} ({m.date})</div>
                  <div className="text-gray-500">Waist: {m.waist}" • Fat: {m.bodyFat}%</div>
                </div>
                <div className="font-bold text-emerald-700 text-sm">{m.weight} kg</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-3 text-xs">
            <div className="font-bold text-navy-900 text-sm">Payment Ledger Summary</div>
            <div className="p-3 bg-emerald-50 rounded-xl border flex justify-between font-bold">
              <span>Paid: ₹{(member.paid || 0).toLocaleString()}</span>
              <span className="text-rose-600">Pending Dues: ₹{(member.pending || 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
