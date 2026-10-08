import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { FiCoffee, FiSun, FiMoon, FiActivity, FiSmile, FiSave, FiCheckCircle } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function WellnessTrackers() {
  const { members, wellnessLogs, setWellnessLogs } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001');

  const member = members.find((m: any) => m.id === selectedMemberId) || members[0];
  const log = wellnessLogs[member.id] || {
    food: { breakfast: 'Formula 1 Shake', lunch: '2 Roti + Green Veg', dinner: 'Soup + Sprouts', snacks: 'Fruits', proteinSources: 'Shake, Curd', waterLiters: 3.5 },
    hydration: { goal: 3.5, morning: 1.0, afternoon: 1.5, evening: 1.0, total: 3.5 },
    activity: { steps: 8400, walkingMin: 45, exercise: 'Cardio & Strength', strengthMin: 30, activeMin: 75 },
    sleep: { sleepTime: '10:30 PM', wakeTime: '06:00 AM', totalHours: 7.5, quality: 'Good' },
    stress: { stressLevel: 2, breathingDone: true, meditationDone: true, screenBreakDone: true }
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    setWellnessLogs((prev: any) => ({
      ...prev,
      [member.id]: log
    }));
    alert(`Daily Wellness & Lifestyle Log saved for ${member.name}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Nutrition, Hydration, Activity, Sleep & Stress Trackers</h1>
          <p className="text-sm text-gray-500">Master Sections 8, 9, 10, 11, 12: Daily Food Record, Water , Steps , Sleep & Stress Management</p>
        </div>
        <Select
          className="input-field w-64 bg-white font-bold"
          value={selectedMemberId}
          onChange={e => setSelectedMemberId(e.target.value)}
        >
          {members.map((m: any) => (
            <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
          ))}
        </Select>
      </div>

      <form onSubmit={handleSaveLog} className="space-y-6">
        {/* Section 8: Nutrition Module */}
        <div className="card space-y-4 border-l-4 border-emerald-500">
          <h3 className="section-title flex items-center gap-2 mb-0">
            <FiCoffee className="text-emerald-600" /> Section 8: Nutrition Module & Food Record
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="label">Breakfast Meal</label>
              <textarea
                className="input-field h-20"
                value={log.food?.breakfast || ''}
                onChange={e => setWellnessLogs({ ...wellnessLogs, [member.id]: { ...log, food: { ...log.food, breakfast: e.target.value } } })}
              />
            </div>
            <div>
              <label className="label">Lunch Meal</label>
              <textarea
                className="input-field h-20"
                value={log.food?.lunch || ''}
                onChange={e => setWellnessLogs({ ...wellnessLogs, [member.id]: { ...log, food: { ...log.food, lunch: e.target.value } } })}
              />
            </div>
            <div>
              <label className="label">Dinner Meal</label>
              <textarea
                className="input-field h-20"
                value={log.food?.dinner || ''}
                onChange={e => setWellnessLogs({ ...wellnessLogs, [member.id]: { ...log, food: { ...log.food, dinner: e.target.value } } })}
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
            <div className="font-bold text-emerald-900">Coach Educational Guidelines & Portion Control</div>
            <div className="text-emerald-700">Balanced Plate: 50% Veggies/Salad + 25% Lean Protein + 25% Complex Carbs</div>
            <div className="text-emerald-700">Limit added sugar, excess salt & processed foods. Ensure minimum 3.0L Hydration daily.</div>
          </div>
        </div>

        {/* Section 9 & 10: Hydration & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hydration */}
          <div className="card space-y-4 border-l-4 border-blue-500">
            <h3 className="section-title flex items-center gap-2 mb-0">
              <FiSun className="text-blue-600" /> Section 9: Hydration Tracker
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-blue-50 rounded-xl">
                <div className="text-gray-400 font-bold">Morning</div>
                <div className="text-base font-black text-blue-900">{log.hydration?.morning || 1.0} L</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <div className="text-gray-400 font-bold">Afternoon</div>
                <div className="text-base font-black text-blue-900">{log.hydration?.afternoon || 1.5} L</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <div className="text-gray-400 font-bold">Evening</div>
                <div className="text-base font-black text-blue-900">{log.hydration?.evening || 1.0} L</div>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl text-center text-xs font-bold text-blue-900">
              Total Hydration Achieved: {log.hydration?.total || 3.5} Liters / Goal: {log.hydration?.goal || 3.5} Liters (100% Complete )
            </div>
          </div>

          {/* Activity */}
          <div className="card space-y-4 border-l-4 border-orange-500">
            <h3 className="section-title flex items-center gap-2 mb-0">
              <FiActivity className="text-orange-600" /> Section 10: Daily Activity Tracker
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-orange-50 rounded-xl">
                <div className="text-gray-400 font-bold">Steps Count</div>
                <div className="text-base font-black text-orange-900">{log.activity?.steps || 8400}</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <div className="text-gray-400 font-bold">Walking</div>
                <div className="text-base font-black text-orange-900">{log.activity?.walkingMin || 45} mins</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <div className="text-gray-400 font-bold">Active Time</div>
                <div className="text-base font-black text-orange-900">{log.activity?.activeMin || 75} mins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 11 & 12: Sleep & Stress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sleep */}
          <div className="card space-y-4 border-l-4 border-purple-500">
            <h3 className="section-title flex items-center gap-2 mb-0">
              <FiMoon className="text-purple-600" /> Section 11: Sleep Tracker
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-purple-50 rounded-xl">
                <div className="text-gray-400 font-bold">Sleep Time</div>
                <div className="text-sm font-bold text-purple-900">{log.sleep?.sleepTime || '10:30 PM'}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <div className="text-gray-400 font-bold">Wake Time</div>
                <div className="text-sm font-bold text-purple-900">{log.sleep?.wakeTime || '06:00 AM'}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <div className="text-gray-400 font-bold">Quality</div>
                <div className="text-sm font-bold text-emerald-600">{log.sleep?.quality || 'Good'}</div>
              </div>
            </div>
          </div>

          {/* Stress */}
          <div className="card space-y-4 border-l-4 border-teal-500">
            <h3 className="section-title flex items-center gap-2 mb-0">
              <FiSmile className="text-teal-600" /> Section 12: Stress & Mental Wellness Tracker
            </h3>
            <div className="p-3 bg-teal-50 rounded-xl text-xs space-y-2">
              <div className="flex justify-between items-center font-bold text-teal-900">
                <span>Stress Rating (1–5):</span>
                <span className="text-base bg-teal-200 px-3 py-0.5 rounded-full">{log.stress?.stressLevel || 2} / 5 (Low Stress )</span>
              </div>
              <div className="text-teal-700">
                Daily Wellness Activities Completed: Breathing Exercises | Meditation | Outdoor Screen Break 
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
          <FiSave size={18} /> SAVE DAILY NUTRITION & WELLNESS LOGS
        </button>
      </form>
    </div>
  );
}
