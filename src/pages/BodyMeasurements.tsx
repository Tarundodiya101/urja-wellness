import React, { useState } from 'react';
import { FiTrendingUp, FiPlus, FiSave, FiActivity } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';

export default function BodyMeasurements() {
  const { members, measurements, addMeasurement } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001');
  const [showModal, setShowModal] = useState(false);

  const member = members.find((m: any) => m.id === selectedMemberId) || members[0];
  const list = measurements[member.id] || [];

  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    stage: 'Day 30 Progress',
    weight: 74.0, height: 175, bmi: 24.2, bodyFat: 23.8,
    muscleMass: 55.2, visceralFat: 7, waist: 35.5, abdomen: 37.5,
    chest: 40.0, hip: 40.5, arm: 14.0, thigh: 22.0
  });

  const latest = list[list.length - 1] || form;
  const previous = list[list.length - 2] || list[0] || form;

  const getDiff = (key: string) => {
    const cur = Number(latest[key]) || 0;
    const prev = Number(previous[key]) || 0;
    const diff = (cur - prev).toFixed(1);
    return Number(diff) > 0 ? `+${diff}` : `${diff}`;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addMeasurement(member.id, form);
    setShowModal(false);
    alert(`Measurement record saved for ${member.name}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Body Measurement & Progress Tracking</h1>
          <p className="text-sm text-gray-500">Track Weight, Body Fat %, Visceral Fat, Waist, Abdomen, Chest, Hip & Recharts progress graphs</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FiPlus /> Record New Measurement Date
        </button>
      </div>

      {/* Member Selector Bar */}
      <div className="card bg-gray-50 border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiActivity className="text-emerald-600 text-xl" />
          <span className="font-bold text-navy-900 text-sm">Select Member:</span>
          <select
            className="input-field w-64 bg-white"
            value={selectedMemberId}
            onChange={e => setSelectedMemberId(e.target.value)}
          >
            {members.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1 rounded-full">
          Total Sessions Measured: {list.length} Records
        </div>
      </div>

      {/* Specification Section 7 Comparison Table: Previous -> Current -> Difference */}
      <div className="card space-y-4 border-l-4 border-emerald-500">
        <h3 className="section-title">Body Measurement Analysis (Previous → Current → Difference)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-center text-xs">
          {[
            { label: 'Weight (kg)', cur: latest.weight, prev: previous.weight, diff: getDiff('weight'), unit: 'kg' },
            { label: 'Body Fat %', cur: latest.bodyFat, prev: previous.bodyFat, diff: getDiff('bodyFat'), unit: '%' },
            { label: 'Visceral Fat', cur: latest.visceralFat, prev: previous.visceralFat, diff: getDiff('visceralFat'), unit: '' },
            { label: 'Waist (inches)', cur: latest.waist, prev: previous.waist, diff: getDiff('waist'), unit: '"' },
            { label: 'Abdomen (inches)', cur: latest.abdomen, prev: previous.abdomen, diff: getDiff('abdomen'), unit: '"' },
            { label: 'Muscle Mass (kg)', cur: latest.muscleMass, prev: previous.muscleMass, diff: getDiff('muscleMass'), unit: 'kg' },
          ].map(item => (
            <div key={item.label} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <div className="text-gray-400 font-bold uppercase text-[10px]">{item.label}</div>
              <div className="text-base font-black text-navy-900">{item.cur}{item.unit}</div>
              <div className="text-[10px] text-gray-500">Prev: {item.prev}{item.unit}</div>
              <div className={`text-xs font-bold ${Number(item.diff) <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                Diff: {item.diff}{item.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Graphs: Weight, Body Fat, Waist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <h4 className="font-bold text-navy-900 text-sm">📈 Weight Loss Trend Line (kg)</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={list}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#16a34a" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card space-y-3">
          <h4 className="font-bold text-navy-900 text-sm">📈 Body Fat & Waist Reduction Trend</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={list}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="bodyFat" stroke="#2563eb" strokeWidth={2} name="Body Fat %" />
                <Line type="monotone" dataKey="waist" stroke="#d97706" strokeWidth={2} name="Waist (in)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Record Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xl w-full space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-navy-900 text-lg">Record Body Measurements for {member.name}</h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label text-[10px]">Date</label>
                  <input type="date" className="input-field" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <label className="label text-[10px]">Milestone Stage</label>
                  <select className="input-field" value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
                    <option value="Day 1 Baseline">Day 1 Baseline</option>
                    <option value="Day 7 Review">Day 7 Review</option>
                    <option value="Day 14 Review">Day 14 Review</option>
                    <option value="Day 30 Progress">Day 30 Progress</option>
                    <option value="Day 60 Transformation">Day 60 Transformation</option>
                    <option value="Day 90 Transformation">Day 90 Transformation</option>
                  </select>
                </div>
                <div>
                  <label className="label text-[10px]">Weight (kg)</label>
                  <input type="number" step="0.1" className="input-field" value={form.weight} onChange={e => setForm({ ...form, weight: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="label text-[10px]">Height (cm)</label>
                  <input type="number" className="input-field" value={form.height} onChange={e => setForm({ ...form, height: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label text-[10px]">Body Fat %</label>
                  <input type="number" step="0.1" className="input-field" value={form.bodyFat} onChange={e => setForm({ ...form, bodyFat: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label text-[10px]">Muscle Mass (kg)</label>
                  <input type="number" step="0.1" className="input-field" value={form.muscleMass} onChange={e => setForm({ ...form, muscleMass: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label text-[10px]">Visceral Fat</label>
                  <input type="number" className="input-field" value={form.visceralFat} onChange={e => setForm({ ...form, visceralFat: Number(e.target.value) })} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="label text-[10px]">Waist (in)</label>
                  <input type="number" step="0.5" className="input-field" value={form.waist} onChange={e => setForm({ ...form, waist: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label text-[10px]">Abdomen (in)</label>
                  <input type="number" step="0.5" className="input-field" value={form.abdomen} onChange={e => setForm({ ...form, abdomen: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label text-[10px]">Chest (in)</label>
                  <input type="number" step="0.5" className="input-field" value={form.chest} onChange={e => setForm({ ...form, chest: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label text-[10px]">Hip (in)</label>
                  <input type="number" step="0.5" className="input-field" value={form.hip} onChange={e => setForm({ ...form, hip: Number(e.target.value) })} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center"><FiSave /> Save Measurement Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
