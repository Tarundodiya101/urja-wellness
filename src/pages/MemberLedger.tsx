import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FiSearch, FiUser, FiPlus, FiFileText, FiPrinter,
  FiX, FiDollarSign, FiCalendar, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

// ─── Mock Ledger Data ───────────────────────────────────────────────────────
const MOCK_LEDGER = {
  'MEM001': [
    { id: 1, date: '2026-08-01', particulars: 'Package Enrollment – Gold Plan', debit: 8000, credit: 0, remarks: 'New enrollment' },
    { id: 2, date: '2026-08-05', particulars: 'Payment Received – Cash',        debit: 0, credit: 5000, remarks: 'Partial payment' },
    { id: 3, date: '2026-08-20', particulars: 'Supplement – Whey Protein',      debit: 2500, credit: 0, remarks: 'Product purchase' },
    { id: 4, date: '2026-09-01', particulars: 'Payment Received – UPI',         debit: 0, credit: 3000, remarks: 'Gpay transfer' },
    { id: 5, date: '2026-09-15', particulars: 'Monthly Renewal – Gold Plan',    debit: 4000, credit: 0, remarks: 'Sep renewal' },
  ],
  'MEM002': [
    { id: 1, date: '2026-07-15', particulars: 'Package Enrollment – Silver Plan', debit: 5000, credit: 0, remarks: 'New enrollment' },
    { id: 2, date: '2026-07-15', particulars: 'Payment Received – Cash',          debit: 0, credit: 5000, remarks: 'Full payment' },
    { id: 3, date: '2026-08-15', particulars: 'Monthly Renewal – Silver Plan',    debit: 5000, credit: 0, remarks: 'Aug renewal' },
    { id: 4, date: '2026-08-16', particulars: 'Payment Received – Bank',          debit: 0, credit: 5000, remarks: 'NEFT received' },
  ],
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function computeRunningBalance(entries) {
  let balance = 0;
  return entries.map(e => {
    balance = balance + e.debit - e.credit;
    return { ...e, balance };
  });
}

function rowStatus(entry) {
  if (entry.credit > 0 && entry.balance <= 0) return { label: 'Paid', color: 'bg-green-100 text-green-700' };
  if (entry.credit > 0 && entry.balance > 0)  return { label: 'Part Payment', color: 'bg-yellow-100 text-yellow-700' };
  return { label: 'Payment Pending', color: 'bg-red-100 text-red-700' };
}

const PAYMENT_MODES = ['Cash', 'UPI', 'Bank Transfer', 'Cheque'];

// ─── Add Payment Modal ───────────────────────────────────────────────────────
function AddPaymentModal({ member, onClose, onSave }) {
  const [form, setForm] = useState({
    amount: '',
    mode: 'Cash',
    date: format(new Date(), 'yyyy-MM-dd'),
    remarks: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter valid amount';
    if (!form.date) e.date = 'Select date';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, amount: Number(form.amount) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Add Payment</h2>
            <p className="text-primary-100 text-sm">{member?.name} · {member?.id}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <FiX size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹) *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
              <input
                type="number"
                min="0"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                className={`w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${errors.amount ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode *</label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_MODES.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, mode: m }))}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    form.mode === m
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${errors.date ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              rows={2}
              value={form.remarks}
              onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
              placeholder="Optional note…"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition shadow-sm"
            >
              Save Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mb-6">
        <FiSearch className="text-primary-400" size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">Search a Member</h3>
      <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
        Type a member name or ID in the search bar above to view their account ledger and transaction history.
      </p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function MemberLedger() {
  const { members = [] } = useApp();

  const [query, setQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ledgerData, setLedgerData] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Use context members or fallback mock
  const allMembers = useMemo(() => {
    if (members && members.length > 0) return members;
    return [
      { id: 'MEM001', name: 'Rahul Sharma',   package: 'Gold Plan',   phone: '9876543210' },
      { id: 'MEM002', name: 'Priya Verma',    package: 'Silver Plan', phone: '9845012345' },
      { id: 'MEM003', name: 'Amit Patel',     package: 'Platinum',    phone: '9812345678' },
      { id: 'MEM004', name: 'Sneha Gupta',    package: 'Basic Plan',  phone: '9898989898' },
      { id: 'MEM005', name: 'Karan Mehta',    package: 'Gold Plan',   phone: '9876001234' },
    ];
  }, [members]);

  const filteredMembers = useMemo(() =>
    query.trim() === ''
      ? []
      : allMembers.filter(m =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.id.toLowerCase().includes(query.toLowerCase())
        ),
    [query, allMembers]
  );

  const ledgerWithBalance = useMemo(() => computeRunningBalance(ledgerData), [ledgerData]);

  const outstanding = useMemo(() =>
    ledgerWithBalance.length > 0 ? ledgerWithBalance[ledgerWithBalance.length - 1].balance : 0,
    [ledgerWithBalance]
  );

  const totalDebit  = useMemo(() => ledgerData.reduce((s, e) => s + e.debit, 0),  [ledgerData]);
  const totalCredit = useMemo(() => ledgerData.reduce((s, e) => s + e.credit, 0), [ledgerData]);

  function selectMember(m) {
    setSelectedMember(m);
    setQuery(m.name);
    setShowDropdown(false);
    setLedgerData(MOCK_LEDGER[m.id] ?? []);
  }

  function clearMember() {
    setSelectedMember(null);
    setQuery('');
    setLedgerData([]);
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSavePayment(data) {
    const newEntry = {
      id: Date.now(),
      date: data.date,
      particulars: `Payment Received – ${data.mode}`,
      debit: 0,
      credit: data.amount,
      remarks: data.remarks || '',
    };
    setLedgerData(prev => [...prev, newEntry]);
    setShowPaymentModal(false);
    showToast('Payment recorded successfully!');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          <FiCheck size={16} />
          {toast.msg}
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <AddPaymentModal
          member={selectedMember}
          onClose={() => setShowPaymentModal(false)}
          onSave={handleSavePayment}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Member Ledger</h1>
            <p className="text-gray-500 text-sm mt-0.5">Per-member account statement & payment history</p>
          </div>
        </div>

        {/* ── Search Bar ──────────────────────────────────────────────── */}
        <div className="relative max-w-lg">
          <div className={`flex items-center border-2 rounded-xl px-4 py-2.5 bg-white shadow-sm transition-all ${showDropdown ? 'border-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
            <FiSearch className="text-gray-400 mr-3 shrink-0" size={18} />
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowDropdown(true); setSelectedMember(null); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search member by name or ID…"
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-sm"
            />
            {query && (
              <button onClick={clearMember} className="text-gray-400 hover:text-gray-600 transition ml-2">
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && filteredMembers.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden">
              {filteredMembers.map(m => (
                <button
                  key={m.id}
                  onClick={() => selectMember(m)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <FiUser className="text-primary-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.id} · {m.package}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {showDropdown && query.trim() !== '' && filteredMembers.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 px-4 py-6 text-center text-gray-400 text-sm">
              No members found for "{query}"
            </div>
          )}
        </div>

        {/* ── Content ─────────────────────────────────────────────────── */}
        {!selectedMember ? (
          <EmptyState />
        ) : (
          <div
            className="space-y-6"
            onClick={() => setShowDropdown(false)}
          >
            {/* Member Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">
                      {selectedMember.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-navy-800">{selectedMember.name}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-navy-50 text-navy-600 px-2.5 py-1 rounded-full border border-navy-100">
                        <FiUser size={11} /> {selectedMember.id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full border border-primary-100">
                        {selectedMember.package}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Outstanding */}
                <div className={`rounded-xl px-5 py-3 text-center border ${outstanding > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                  <p className="text-xs font-medium text-gray-500 mb-0.5">Outstanding Balance</p>
                  <p className={`text-2xl font-bold ${outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{Math.abs(outstanding).toLocaleString()}
                  </p>
                  {outstanding < 0 && <p className="text-xs text-green-500 mt-0.5">Advance / Overpaid</p>}
                  {outstanding > 0 && (
                    <p className="text-xs text-red-400 flex items-center justify-center gap-1 mt-0.5">
                      <FiAlertCircle size={11} /> Amount due
                    </p>
                  )}
                  {outstanding === 0 && <p className="text-xs text-green-500 mt-0.5">Account cleared</p>}
                </div>
              </div>

              {/* Summary strip */}
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Total Billed</p>
                  <p className="text-base font-bold text-gray-800">₹{totalDebit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Total Paid</p>
                  <p className="text-base font-bold text-green-600">₹{totalCredit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Transactions</p>
                  <p className="text-base font-bold text-gray-800">{ledgerData.length}</p>
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-navy-800 text-base">Account Statement</h3>
                <span className="text-xs text-gray-400">{ledgerData.length} entries</span>
              </div>

              {ledgerData.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm">No transactions found for this member.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Particulars</th>
                        <th className="px-4 py-3 text-right">Dr (₹)</th>
                        <th className="px-4 py-3 text-right">Cr (₹)</th>
                        <th className="px-4 py-3 text-right">Balance (₹)</th>
                        <th className="px-4 py-3 text-left">Remarks</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {ledgerWithBalance.map(entry => {
                        const isCredit = entry.credit > 0;
                        const status = rowStatus(entry);
                        return (
                          <tr
                            key={entry.id}
                            className={`border-l-4 hover:bg-gray-50/60 transition-colors ${isCredit ? 'border-l-green-400' : 'border-l-red-400'}`}
                          >
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                              {format(parseISO(entry.date), 'dd MMM yyyy')}
                            </td>
                            <td className="px-4 py-3 text-gray-800 font-medium max-w-[200px]">
                              {entry.particulars}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-red-500">
                              {entry.debit > 0 ? `₹${entry.debit.toLocaleString()}` : '—'}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-green-600">
                              {entry.credit > 0 ? `₹${entry.credit.toLocaleString()}` : '—'}
                            </td>
                            <td className={`px-4 py-3 text-right font-bold whitespace-nowrap ${entry.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              ₹{Math.abs(entry.balance).toLocaleString()}
                              <span className="text-xs font-normal ml-1">{entry.balance > 0 ? 'Dr' : entry.balance < 0 ? 'Cr' : ''}</span>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs max-w-[140px] truncate">
                              {entry.remarks || '—'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.color}`}>
                                {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    {/* Totals */}
                    <tfoot className="bg-gray-50 border-t-2 border-gray-200 font-bold text-gray-700 text-sm">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-right text-gray-500 font-semibold">Totals</td>
                        <td className="px-4 py-3 text-right text-red-600">₹{totalDebit.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-green-600">₹{totalCredit.toLocaleString()}</td>
                        <td className={`px-4 py-3 text-right ${outstanding > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{Math.abs(outstanding).toLocaleString()} {outstanding > 0 ? 'Dr' : 'Cr'}
                        </td>
                        <td colSpan={2} />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-4 flex flex-wrap gap-3 items-center justify-between">
              <p className="text-sm text-gray-500">
                {outstanding > 0
                  ? <span className="text-red-500 font-medium">₹{outstanding.toLocaleString()} pending from member</span>
                  : <span className="text-green-600 font-medium">Account is clear – no dues</span>
                }
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                >
                  <FiPlus size={15} /> Add Payment
                </button>
                <button
                  onClick={() => showToast('Bills view coming soon', 'info')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition"
                >
                  <FiFileText size={15} /> View Bills
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition"
                >
                  <FiPrinter size={15} /> Print Statement
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
