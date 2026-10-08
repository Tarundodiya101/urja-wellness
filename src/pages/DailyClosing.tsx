import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FiCalendar, FiLock, FiCheck, FiX, FiAlertTriangle,
  FiTrendingUp, FiDollarSign, FiCreditCard, FiSmartphone, FiZap
} from 'react-icons/fi';
import { format, subDays } from 'date-fns';

// ─── Mock previous closings ───────────────────────────────────────────────────
const MOCK_PREVIOUS = [
  {
    id: 1, date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    cash: 8500, credit: 3200, bank: 5000, upi: 4700,
    expenses: 1200, actualCash: 7300, remarks: 'Normal day', closed: true,
  },
  {
    id: 2, date: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    cash: 12000, credit: 0, bank: 3500, upi: 6200,
    expenses: 800, actualCash: 11250, remarks: 'Festival offer day', closed: true,
  },
  {
    id: 3, date: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    cash: 6800, credit: 2000, bank: 0, upi: 3100,
    expenses: 500, actualCash: 6300, remarks: '', closed: true,
  },
  {
    id: 4, date: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    cash: 9200, credit: 1500, bank: 4200, upi: 5500,
    expenses: 950, actualCash: 8200, remarks: 'Minor shortfall noted', closed: true,
  },
  {
    id: 5, date: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    cash: 7600, credit: 800, bank: 2800, upi: 4100,
    expenses: 600, actualCash: 7000, remarks: '', closed: true,
  },
];

const EMPTY_FORM = {
  cash: '', credit: '', bank: '', upi: '',
  expenses: '', actualCash: '', remarks: '',
};

function numVal(v) { return parseFloat(v) || 0; }

function diffColor(diff) {
  if (diff === 0)  return 'text-green-600  bg-green-50  border-green-200';
  if (diff < 0)   return 'text-red-600    bg-red-50    border-red-200';
  return                  'text-orange-600 bg-orange-50 border-orange-200';
}

function diffLabel(diff) {
  if (diff === 0) return 'Balanced ';
  if (diff < 0)  return `Short by ₹${Math.abs(diff).toLocaleString()}`;
  return                 `Excess ₹${diff.toLocaleString()}`;
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ summary, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-navy-700 to-navy-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Confirm Day Close</h2>
          <button onClick={onCancel} className="text-white/70 hover:text-white"><FiX size={22} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
            <FiAlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-amber-700">
              You are about to close <strong>{format(new Date(), 'dd MMM yyyy')}</strong>.
              This action cannot be undone. Please verify the figures below.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: 'Cash Collection', value: summary.cash     },
              { label: 'Credit Sale',     value: summary.credit   },
              { label: 'Bank Transfer',   value: summary.bank     },
              { label: 'UPI Collection',  value: summary.upi      },
              { label: 'Total Sales',     value: summary.total, bold: true },
              { label: 'Expenses',        value: summary.expenses },
              { label: 'Expected Cash',   value: summary.expected },
              { label: 'Actual Cash',     value: summary.actualCash },
            ].map(({ label, value, bold }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500">{label}</span>
                <span className={`font-semibold ${bold ? 'text-primary-700' : 'text-gray-800'}`}>
                  ₹{value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className={`rounded-xl border px-4 py-3 flex justify-between items-center ${diffColor(summary.diff)}`}>
            <span className="font-semibold text-sm">Difference</span>
            <span className="font-bold text-base">
              {summary.diff >= 0 ? '+' : ''}{summary.diff.toLocaleString()} &nbsp; {diffLabel(summary.diff)}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm">
              Go Back
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 bg-navy-700 hover:bg-navy-800 text-white rounded-lg font-semibold transition shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <FiLock size={14} /> Confirm & Close Day
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function DailyClosing() {
  useApp();

  const [form, setForm]               = useState(EMPTY_FORM);
  const [previousClosings, setPrevious] = useState(MOCK_PREVIOUS);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isClosed, setIsClosed]       = useState(false);
  const [toast, setToast]             = useState(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const computed = useMemo(() => {
    const cash     = numVal(form.cash);
    const credit   = numVal(form.credit);
    const bank     = numVal(form.bank);
    const upi      = numVal(form.upi);
    const expenses = numVal(form.expenses);
    const actual   = numVal(form.actualCash);
    const total    = cash + credit + bank + upi;
    const expected = cash - expenses;
    const diff     = actual - expected;
    return { cash, credit, bank, upi, expenses, actualCash: actual, total, expected, diff };
  }, [form]);

  function handleChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleConfirmClose() {
    const newClosing = {
      id: Date.now(),
      date: format(new Date(), 'yyyy-MM-dd'),
      ...computed,
      remarks: form.remarks,
      closed: true,
    };
    setPrevious(prev => [newClosing, ...prev]);
    setIsClosed(true);
    setShowConfirm(false);
    showToast('Day closed successfully! Records saved.');
  }

  const inputClass = (disabled) =>
    `w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition font-medium
    ${disabled
      ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
      : 'border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
    }`;

  const SectionInput = ({ label, fieldKey, icon: Icon, prefix = '₹', disabled = false, placeholder = '0' }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />}
        <span className="absolute left-9 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{prefix}</span>
        <input
          type="number"
          min="0"
          disabled={disabled || isClosed}
          value={form[fieldKey] ?? ''}
          onChange={e => handleChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          className={`${inputClass(disabled || isClosed)} pl-14`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg bg-green-500 text-white text-sm font-medium">
          <FiCheck size={16} /> {toast.msg}
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          summary={computed}
          onConfirm={handleConfirmClose}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Daily Closing</h1>
            <p className="text-gray-500 text-sm mt-0.5">End-of-day cash & sales reconciliation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm text-sm text-gray-600">
              <FiCalendar className="text-primary-500" size={15} />
              <span className="font-semibold">{format(new Date(), 'EEEE, dd MMM yyyy')}</span>
            </div>
            <button
              onClick={() => !isClosed && setShowConfirm(true)}
              disabled={isClosed}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm
                ${isClosed
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-navy-700 hover:bg-navy-800 text-white'
                }`}
            >
              <FiLock size={15} />
              {isClosed ? 'Day Closed' : 'Close Day'}
            </button>
          </div>
        </div>

        {/* Closed banner */}
        {isClosed && (
          <div className="flex items-center gap-3 px-5 py-4 bg-green-50 border border-green-200 rounded-2xl">
            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shrink-0">
              <FiCheck className="text-white" size={18} />
            </div>
            <div>
              <p className="font-bold text-green-800">Day Successfully Closed</p>
              <p className="text-green-600 text-sm">Records have been saved for {format(new Date(), 'dd MMM yyyy')}.</p>
            </div>
          </div>
        )}

        {/* ── Today's Summary Form ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiTrendingUp className="text-primary-500" size={18} />
            <h3 className="font-bold text-navy-800">Today's Collections & Expenses</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Collections */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Collections</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <SectionInput label="Cash Collection"  fieldKey="cash"   icon={FiDollarSign}  />
                <SectionInput label="Credit Sale"      fieldKey="credit" icon={FiCreditCard}   />
                <SectionInput label="Bank Transfer"    fieldKey="bank"   icon={FiZap}          />
                <SectionInput label="UPI Collection"   fieldKey="upi"    icon={FiSmartphone}   />
              </div>
            </div>

            {/* Total Sales */}
            <div className="bg-primary-50 border border-primary-200 rounded-xl px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide">Total Sales</p>
                <p className="text-xs text-primary-400 mt-0.5">Cash + Credit + Bank + UPI</p>
              </div>
              <p className="text-3xl font-bold text-primary-700">₹{computed.total.toLocaleString()}</p>
            </div>

            {/* Cash Reconciliation */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Cash Reconciliation</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SectionInput label="Expenses" fieldKey="expenses" icon={FiDollarSign} />
                {/* Expected Cash – computed */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Expected Cash</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                    <input
                      readOnly
                      value={computed.expected.toLocaleString()}
                      className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed font-medium"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Cash − Expenses</p>
                </div>
                <SectionInput label="Actual Cash (counted)" fieldKey="actualCash" icon={FiDollarSign} />
              </div>
            </div>

            {/* Difference */}
            <div className={`rounded-xl border px-5 py-4 flex items-center justify-between ${diffColor(computed.diff)}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide opacity-70">Difference</p>
                <p className="text-xs opacity-60 mt-0.5">Actual Cash − Expected Cash</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {computed.diff >= 0 ? '+' : ''}₹{computed.diff.toLocaleString()}
                </p>
                <p className="text-xs font-semibold opacity-70 mt-0.5">{diffLabel(computed.diff)}</p>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Remarks</label>
              <textarea
                rows={2}
                disabled={isClosed}
                value={form.remarks}
                onChange={e => handleChange('remarks', e.target.value)}
                placeholder="Optional notes for today's closing…"
                className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition resize-none ${
                  isClosed
                    ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                    : 'border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500'
                }`}
              />
            </div>

            {/* Close Day button (bottom) */}
            {!isClosed && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowConfirm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-navy-700 hover:bg-navy-800 text-white rounded-xl font-semibold text-sm transition shadow-sm"
                >
                  <FiLock size={15} /> Close Day
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Previous Closings ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-navy-800">Previous Closings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-right">Cash</th>
                  <th className="px-4 py-3 text-right">Credit</th>
                  <th className="px-4 py-3 text-right">Bank</th>
                  <th className="px-4 py-3 text-right">UPI</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-right">Expenses</th>
                  <th className="px-4 py-3 text-right">Diff</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {previousClosings.map(c => {
                  const total = c.cash + c.credit + c.bank + c.upi;
                  const diff  = c.actualCash - (c.cash - c.expenses);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                        {format(new Date(c.date), 'EEE, dd MMM yyyy')}
                        {c.remarks && (
                          <p className="text-xs text-gray-400 font-normal">{c.remarks}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{c.cash.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{c.credit.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{c.bank.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-600">₹{c.upi.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold text-primary-700">₹{total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-red-500">₹{c.expenses.toLocaleString()}</td>
                      <td className={`px-4 py-3 text-right font-semibold ${diff === 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                        {diff >= 0 ? '+' : ''}₹{diff.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          <FiLock size={10} /> Closed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
