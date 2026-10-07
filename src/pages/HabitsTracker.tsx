import React, { useState } from 'react';
import { FiCheckCircle, FiSave, FiAward } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function HabitsTracker() {
  const { members } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001');

  const member = members.find((m: any) => m.id === selectedMemberId) || members[0];

  const [checklist, setChecklist] = useState({
    nutrition: true,
    water: true,
    activity: true,
    sleep: true,
    fruitsVeg: true,
    movement: true,
    stressMgmt: true,
    centerSession: true,
  });

  const activeCount = Object.values(checklist).filter(Boolean).length;

  const getScoreBadge = (score: number) => {
    if (score === 8) return { label: '8/8 Excellent ⭐', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 6) return { label: `${score}/8 Good 👍`, color: 'bg-blue-100 text-blue-800 border-blue-300' };
    if (score >= 4) return { label: `${score}/8 Focus Needed ⚠️`, color: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { label: `${score}/8 Follow-up Required 🔴`, color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const badge = getScoreBadge(activeCount);

  const toggleCheck = (key: string) => {
    setChecklist(prev => ({ ...prev, [key as keyof typeof prev]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Habit Score ${activeCount}/8 saved for ${member.name}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Daily Habit Tracker & Score</h1>
          <p className="text-sm text-gray-500">Master Section 13: 8-Point Daily Habit Evaluation (8/8 Excellent • 6-7 Good • 4-5 Focus Needed • Below 4 Follow-up)</p>
        </div>
        <select
          className="input-field w-64 bg-white font-bold"
          value={selectedMemberId}
          onChange={e => setSelectedMemberId(e.target.value)}
        >
          {members.map((m: any) => (
            <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
          ))}
        </select>
      </div>

      <div className="card space-y-6 border-l-4 border-emerald-500">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <div className="text-lg font-black text-navy-900">{member.name}'s Daily Habit Score</div>
            <div className="text-xs text-gray-500">Evaluated Date: {new Date().toISOString().split('T')[0]} • Coach: {member.coach}</div>
          </div>
          <div className={`px-4 py-2 rounded-2xl border text-sm font-black shadow-sm ${badge.color}`}>
            {badge.label}
          </div>
        </div>

        {/* 8-Point Checklist */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              { key: 'nutrition', title: '1. Balanced Nutrition Meal', desc: 'Portion controlled meal + Shake' },
              { key: 'water', title: '2. Hydration Target 💧', desc: '3.0L+ Water intake completed' },
              { key: 'activity', title: '3. Physical Activity 🚶', desc: '45+ mins workout or walking' },
              { key: 'sleep', title: '4. Restful Sleep 😴', desc: '7+ hours uninterrupted sleep' },
              { key: 'fruitsVeg', title: '5. Fruits & Vegetables', desc: '2+ servings fresh produce' },
              { key: 'movement', title: '6. Daily Movement', desc: 'Regular active movement breaks' },
              { key: 'stressMgmt', title: '7. Stress Management 🧠', desc: 'Breathing / Meditation practice' },
              { key: 'centerSession', title: '8. Center Session Attended', desc: 'URJA club visit completed' },
            ].map(item => {
              const isChecked = checklist[item.key as keyof typeof checklist];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleCheck(item.key)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isChecked ? 'bg-emerald-50 border-emerald-400 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-navy-900">{item.title}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isChecked ? 'bg-emerald-600 text-white' : 'bg-gray-300 text-gray-600'
                    }`}>
                      {isChecked ? '✓' : ''}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">{item.desc}</div>
                </div>
              );
            })}
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
            <FiSave size={18} /> SAVE HABIT EVALUATION SCORE ({activeCount}/8)
          </button>
        </form>
      </div>
    </div>
  );
}
