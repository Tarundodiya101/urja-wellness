import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { FiUsers, FiCheckSquare, FiCamera, FiTrendingUp, FiPhoneCall, FiCoffee, FiAlertCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Badge from '../components/shared/Badge';

export default function CoachDashboard() {
  const { members, attendance, followUps, coaches } = useApp();
  const [selectedCoach, setSelectedCoach] = useState('Priya Sharma');

  const coachMembers = members.filter((m: any) => m.coach === selectedCoach);
  const coachAttendance = attendance.filter((a: any) => coachMembers.some((m: any) => m.id === a.memberId));
  const coachFollowups = followUps.filter((f: any) => coachMembers.some((m: any) => m.id === f.memberId));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">👨‍🏫 Coach Dashboard & Daily Priorities</h1>
          <p className="text-sm text-gray-500">Master Section 25: Coach Priorities (Attendance, Photos Due, Measurements Due, Follow-ups & Nutrition Reviews)</p>
        </div>
        <Select
          className="input-field w-64 bg-white font-bold"
          value={selectedCoach}
          onChange={e => setSelectedCoach(e.target.value)}
        >
          {coaches.map((c: any) => (
            <option key={c.id} value={c.name}>{c.name} ({c.assignedCount} Clients)</option>
          ))}
        </Select>
      </div>

      {/* Priority Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-l-4 border-emerald-500 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Today Check-ins</div>
            <div className="text-2xl font-black text-navy-900 mt-1">{coachAttendance.length} / {coachMembers.length}</div>
          </div>
          <FiCheckSquare size={32} className="text-emerald-500 opacity-80" />
        </div>

        <div className="card border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Photo Reviews Due</div>
            <div className="text-2xl font-black text-blue-600 mt-1">3 Clients</div>
          </div>
          <FiCamera size={32} className="text-blue-500 opacity-80" />
        </div>

        <div className="card border-l-4 border-purple-500 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Measurements Due</div>
            <div className="text-2xl font-black text-purple-600 mt-1">2 Clients</div>
          </div>
          <FiTrendingUp size={32} className="text-purple-500 opacity-80" />
        </div>

        <div className="card border-l-4 border-rose-500 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-bold uppercase">Follow-up Required</div>
            <div className="text-2xl font-black text-rose-600 mt-1">{coachFollowups.length} Priority</div>
          </div>
          <FiPhoneCall size={32} className="text-rose-500 opacity-80" />
        </div>
      </div>

      {/* Section 25 Priorities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members Needing Attention */}
        <div className="card space-y-3 border-l-4 border-rose-500">
          <h3 className="section-title flex items-center gap-2 mb-0">
            <FiAlertCircle className="text-rose-600" /> Members Needing Immediate Coach Attention
          </h3>
          <div className="space-y-2 text-xs">
            {coachFollowups.map((f: any) => (
              <div key={f.id} className="p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-950">{f.memberName}</div>
                  <div className="text-rose-700">{f.reason}</div>
                </div>
                <button onClick={() => alert(`Calling ${f.memberName}...`)} className="btn-primary py-1 text-xs">
                  Call Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Members & Nutrition Review */}
        <div className="card space-y-3 border-l-4 border-emerald-500">
          <h3 className="section-title flex items-center gap-2 mb-0">
            <FiCoffee className="text-emerald-600" /> Assigned Clients Nutrition & Habit Status
          </h3>
          <div className="space-y-2 text-xs">
            {coachMembers.map((m: any) => (
              <div key={m.id} className="p-3 bg-gray-50 rounded-xl border flex items-center justify-between">
                <div>
                  <div className="font-bold text-navy-900">{m.name} ({m.programType})</div>
                  <div className="text-gray-500">Weight: {m.weight} kg • Goal: {m.wellnessGoal}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    Habit 8/8 
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
