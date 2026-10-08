import React, { useState } from 'react';
import { FiBell, FiPhone, FiMessageSquare, FiCheck, FiClock, FiGlobe } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Modal from '../components/shared/Modal';

export default function RefillReminder() {
  const { refillReminders, setRefillReminders } = useApp();
  const [filter, setFilter] = useState('ALL');
  const [selectedMsgModal, setSelectedMsgModal] = useState(null);
  const [lang, setLang] = useState('GUJ'); // 'GUJ' or 'ENG'

  const filtered = refillReminders.filter(r => {
    if (filter === 'DUE TODAY') return r.daysLeft <= 0;
    if (filter === 'DUE SOON') return r.daysLeft > 0 && r.daysLeft <= 7;
    if (filter === 'UPCOMING') return r.daysLeft > 7;
    return true;
  });

  const markDone = (id) => {
    setRefillReminders(prev => prev.filter(r => r.id !== id));
    alert('Refill reminder marked as DONE!');
  };

  const remindTomorrow = (id) => {
    setRefillReminders(prev => prev.map(r => r.id === id ? { ...r, daysLeft: r.daysLeft + 1 } : r));
    alert('Reminder rescheduled for tomorrow.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Product Refill Reminder System</h1>
          <p className="text-sm text-gray-500">Automated 26-day usage tracking & Gujarati/English WhatsApp refill alerts</p>
        </div>
        <div className="flex gap-2">
          {['ALL', 'DUE TODAY', 'DUE SOON', 'UPCOMING'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                filter === f ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Specification Section 12 Dashboard Alert Banner */}
      <div className="card bg-amber-50 border-l-4 border-amber-500 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-bold text-amber-900 text-sm flex items-center gap-2">
            <FiBell className="text-amber-600" /> PRODUCT REFILL DUE DASHBOARD ALERT
          </div>
          <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
            {refillReminders.length} Reminders Active
          </span>
        </div>
        <div className="text-xs text-amber-800">
          Specification rule: Auto-calculated finish based on product usage period (26 days). Reminders triggered 4 days before finish date.
        </div>
      </div>

      {/* Reminders Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-head">
              <th className="px-4 py-3 text-left">Member Name</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Product Purchased</th>
              <th className="px-4 py-3 text-left">Purchase Date</th>
              <th className="px-4 py-3 text-left">Expected Finish</th>
              <th className="px-4 py-3 text-left">Days Left</th>
              <th className="px-4 py-3 text-center">Action Buttons</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className="table-row">
                <td className="px-4 py-3 font-bold text-navy-900">{r.memberName}</td>
                <td className="px-4 py-3 text-gray-600">{r.mobile}</td>
                <td className="px-4 py-3 font-semibold text-emerald-800">{r.product}</td>
                <td className="px-4 py-3 text-gray-500">{r.purchaseDate}</td>
                <td className="px-4 py-3 text-gray-800 font-semibold">{r.expectedFinish}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                    r.daysLeft <= 0 ? 'bg-red-100 text-red-700' :
                    r.daysLeft <= 7 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {r.daysLeft <= 0 ? 'EXPIRED' : `${r.daysLeft} Days Left`}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => alert(`Calling ${r.memberName} on ${r.mobile}...`)}
                      className="btn-outline py-1 px-2.5 text-xs text-blue-700 border-blue-300 hover:bg-blue-50"
                      title="Call"
                    >
                      <FiPhone size={14} /> CALL
                    </button>
                    <button
                      onClick={() => setSelectedMsgModal(r)}
                      className="btn-primary py-1 px-2.5 text-xs"
                      title="WhatsApp"
                    >
                      <FiMessageSquare size={14} /> WHATSAPP
                    </button>
                    <button
                      onClick={() => markDone(r.id)}
                      className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      title="Mark Done"
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      onClick={() => remindTomorrow(r.id)}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
                      title="Remind Tomorrow"
                    >
                      <FiClock size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SPECIFICATION SECTION 13: WHATSAPP MESSAGE FORMAT MODAL (GUJARATI & ENGLISH) */}
      {selectedMsgModal && (
        <Modal isOpen={true} onClose={() => setSelectedMsgModal(null)} title="WhatsApp Refill Message Format" size="md">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="font-bold text-navy-900 text-sm">Recipient: {selectedMsgModal.memberName}</div>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setLang('GUJ')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    lang === 'GUJ' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  ગુજરાતી (Gujarati)
                </button>
                <button
                  onClick={() => setLang('ENG')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    lang === 'ENG' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 whitespace-pre-wrap font-sans text-sm text-emerald-950 leading-relaxed">
              {lang === 'GUJ' ? (
                `નમસ્તે ${selectedMsgModal.memberName}જી,

તમારી Nutrition Product (${selectedMsgModal.product}) નો અંદાજિત Refill સમય નજીક આવી રહ્યો છે.

અંદાજિત તારીખ: ${selectedMsgModal.expectedFinish}

જરૂર હોય તો URJA WELLNESS CLUB નો સંપર્ક કરશો.

આભાર.`
              ) : (
                `Namaste ${selectedMsgModal.memberName} Ji,

Your nutrition product refill date is approaching.

Product: ${selectedMsgModal.product}
Expected refill date: ${selectedMsgModal.expectedFinish}

For refill assistance, please contact URJA WELLNESS CLUB.

Thank You.`
              )}
            </div>

            <button
              onClick={() => {
                alert(`WhatsApp message sent to ${selectedMsgModal.memberName} (${selectedMsgModal.mobile})!`);
                setSelectedMsgModal(null);
              }}
              className="btn-primary w-full justify-center py-3 text-base"
            >
              <FiMessageSquare size={18} /> SEND WHATSAPP MESSAGE NOW
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
