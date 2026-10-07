import React, { useState } from 'react';
import { FiPhoneCall, FiMessageSquare, FiClock, FiCheckCircle, FiPlus } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function FollowUpSystem() {
  const { followUps, setFollowUps } = useApp();
  const [filterReason, setFilterReason] = useState('ALL');

  const filtered = followUps.filter((f: any) => {
    if (filterReason === 'ALL') return true;
    return f.reason.toLowerCase().includes(filterReason.toLowerCase());
  });

  const markDone = (id: string) => {
    setFollowUps((prev: any[]) => prev.filter(f => f.id !== id));
    alert('Follow-up task marked as COMPLETED!');
  };

  const rescheduleDate = (id: string) => {
    const newDate = prompt('Enter Next Follow-up Date (yyyy-mm-dd):', '2025-10-08');
    if (newDate) {
      setFollowUps((prev: any[]) => prev.map(f => f.id === id ? { ...f, dueDate: newDate } : f));
      alert(`Follow-up rescheduled to ${newDate}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Follow-up System</h1>
          <p className="text-sm text-gray-500">Master Section 18: Auto-flagged 🔴 Follow-up Required for Absent Members, Payments, Expiries & Progress Reviews</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'Absent', 'Payment', 'Expiry', 'Measurement', 'Refill'].map(r => (
            <button
              key={r}
              onClick={() => setFilterReason(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterReason === r ? 'bg-emerald-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Follow-up Required Table */}
      <div className="card p-0 overflow-hidden border-l-4 border-rose-500">
        <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
            <FiPhoneCall className="text-rose-600" /> 🔴 Follow-up Required Tasks ({followUps.length})
          </div>
          <span className="text-xs bg-rose-200 text-rose-900 font-bold px-3 py-0.5 rounded-full">
            Action Required Today
          </span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="table-head">
              <th className="px-4 py-3 text-left">Member Name</th>
              <th className="px-4 py-3 text-left">Follow-up Reason</th>
              <th className="px-4 py-3 text-left">Assigned Coach</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-center">Action Workflow</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f: any) => (
              <tr key={f.id} className="table-row">
                <td className="px-4 py-3 font-bold text-navy-900">{f.memberName}</td>
                <td className="px-4 py-3 font-semibold text-rose-700">{f.reason}</td>
                <td className="px-4 py-3 text-gray-600">{f.coach}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{f.dueDate}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => alert(`Calling ${f.memberName}...`)}
                      className="btn-outline py-1 px-2.5 text-xs text-blue-700 border-blue-300"
                    >
                      Call
                    </button>
                    <button
                      onClick={() => alert(`WhatsApp opened for ${f.memberName}`)}
                      className="btn-primary py-1 px-2.5 text-xs"
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => rescheduleDate(f.id)}
                      className="p-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
                      title="Reschedule Date"
                    >
                      <FiClock size={16} />
                    </button>
                    <button
                      onClick={() => markDone(f.id)}
                      className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      title="Mark Complete"
                    >
                      <FiCheckCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
