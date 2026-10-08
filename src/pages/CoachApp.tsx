import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { FiUsers, FiCheckSquare, FiBell, FiPhone, FiMessageSquare, FiTrendingUp, FiSave } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Badge from '../components/shared/Badge';

export default function CoachApp() {
  const { members, attendance, updateMember, refillReminders, leads } = useApp();
  const [selectedCoach, setSelectedCoach] = useState('Priya Sharma');
  const [activeTab, setActiveTab] = useState('members');
  const [editingWeightMember, setEditingWeightMember] = useState(null);
  const [newWeight, setNewWeight] = useState('');
  const [notes, setNotes] = useState('');

  const coachMembers = members.filter(m => m.coach === selectedCoach);
  const coachAttendance = attendance.filter(a => coachMembers.some(m => m.id === a.memberId));
  const coachRefills = refillReminders.filter(r => coachMembers.some(m => m.id === r.memberId));

  const handleUpdateWeight = (e) => {
    e.preventDefault();
    if (!editingWeightMember) return;
    updateMember(editingWeightMember.id, {
      weight: Number(newWeight) || editingWeightMember.weight,
      notes: notes || editingWeightMember.notes
    });
    alert(`Progress updated for ${editingWeightMember.name}! New weight: ${newWeight} kg.`);
    setEditingWeightMember(null);
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen shadow-2xl rounded-3xl overflow-hidden border-4 border-gray-800 animate-fade-in my-2">
      {/* Coach Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-emerald-900 text-white p-5 pt-7 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">Specification Section 32</div>
            <h2 className="text-lg font-black">COACH MOBILE PORTAL</h2>
          </div>
          
          <Select
            className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
            value={selectedCoach}
            onChange={e => setSelectedCoach(e.target.value)}
          >
            <option value="Priya Sharma" className="text-gray-900">Priya Sharma</option>
            <option value="Rahul Patel" className="text-gray-900">Rahul Patel</option>
            <option value="Anita Mehta" className="text-gray-900">Anita Mehta</option>
          </Select>
        </div>

        <div className="p-3 bg-white/10 rounded-xl border border-white/20 flex justify-between text-xs">
          <div>Assigned Members: <span className="font-bold text-emerald-300">{coachMembers.length}</span></div>
          <div>Present Today: <span className="font-bold text-emerald-300">{coachAttendance.length}</span></div>
          <div>Dues Pending: <span className="font-bold text-amber-300">₹{coachMembers.reduce((s, m) => s + (m.pending || 0), 0)}</span></div>
        </div>
      </div>

      {/* Coach Nav Tabs */}
      <div className="flex border-b border-gray-200 bg-white text-xs font-bold justify-around">
        {[
          { id: 'members', label: 'My Members' },
          { id: 'attendance', label: 'Today Attendance' },
          { id: 'refills', label: 'Refill Alerts' },
          { id: 'dues', label: 'Dues List' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === t.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-3">
        {activeTab === 'members' && (
          <div className="space-y-3">
            <div className="font-bold text-navy-900 text-xs uppercase tracking-wider">Members Assigned to {selectedCoach}</div>
            {coachMembers.map(m => (
              <div key={m.id} className="p-3 bg-white rounded-2xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-navy-900">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.id} • {m.mobile}</div>
                  </div>
                  <Badge status={m.status} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2 rounded-xl">
                  <div>Program: <span className="font-bold text-emerald-800">{m.programType}</span></div>
                  <div>Current Weight: <span className="font-bold text-navy-900">{m.weight} kg</span></div>
                  <div>Target Weight: <span className="font-bold text-gray-600">{m.targetWeight} kg</span></div>
                  <div>Visits: <span className="font-bold text-blue-700">{m.visitsCount || 0}</span></div>
                </div>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => { setEditingWeightMember(m); setNewWeight(m.weight); setNotes(m.notes || ''); }}
                    className="btn-outline py-1 px-3 text-xs flex-1 justify-center"
                  >
                    <FiTrendingUp /> Log Progress
                  </button>
                  <button
                    onClick={() => alert(`Calling ${m.name}...`)}
                    className="btn-primary py-1 px-3 text-xs"
                  >
                    <FiPhone /> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-2 text-xs">
            <div className="font-bold text-navy-900 text-xs">Today's Check-ins for My Members</div>
            {coachAttendance.map(a => (
              <div key={a.id} className="p-3 bg-white rounded-xl border flex justify-between items-center">
                <div>
                  <div className="font-bold text-navy-900">{a.memberName}</div>
                  <div className="text-emerald-700 font-semibold">{a.shake}</div>
                </div>
                <div className="text-right">
                  <div className="text-gray-500">{a.time || '07:42 AM'}</div>
                  <span className="text-[10px] font-bold text-emerald-700">PRESENT </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'refills' && (
          <div className="space-y-2 text-xs">
            <div className="font-bold text-navy-900 text-xs">Refill Reminders for My Clients</div>
            {coachRefills.map(r => (
              <div key={r.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <div className="font-bold text-amber-900">{r.memberName}</div>
                <div>Product: <span className="font-semibold">{r.product}</span></div>
                <div>Expected Finish: <span className="font-bold">{r.expectedFinish}</span></div>
                <div className="pt-1 flex gap-2">
                  <button onClick={() => alert(`WhatsApp sent to ${r.memberName}`)} className="btn-primary py-1 text-xs">
                    <FiMessageSquare /> WhatsApp Refill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dues' && (
          <div className="space-y-2 text-xs">
            <div className="font-bold text-navy-900 text-xs">Members Pending Payment Collection</div>
            {coachMembers.filter(m => m.pending > 0).map(m => (
              <div key={m.id} className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex justify-between items-center">
                <div>
                  <div className="font-bold text-rose-900">{m.name}</div>
                  <div className="text-gray-500">{m.mobile}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-rose-600 text-sm">₹{m.pending?.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500">Due Date: {m.dueDate || '15/10/2025'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Progress Modal */}
      {editingWeightMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4">
            <div className="font-bold text-navy-900 text-base">Log Weight & Fitness Progress</div>
            <div className="text-xs text-gray-500">Member: <span className="font-bold text-gray-800">{editingWeightMember.name}</span></div>

            <form onSubmit={handleUpdateWeight} className="space-y-3">
              <div>
                <label className="label text-[10px]">New Weight Record (kg)</label>
                <input type="number" step="0.1" className="input-field" value={newWeight} onChange={e => setNewWeight(e.target.value)} required />
              </div>
              <div>
                <label className="label text-[10px]">Coach Evaluation Notes</label>
                <textarea className="input-field h-20 text-xs" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Inch loss noticed, body fat down by 1%..." />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditingWeightMember(null)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center"><FiSave /> Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
