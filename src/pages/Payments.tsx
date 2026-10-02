import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  FiPlus, FiSearch, FiPrinter, FiX, FiCheckCircle,
  FiDollarSign, FiSmartphone, FiCreditCard, FiAlertCircle,
  FiEye, FiTrash2, FiCalendar, FiRefreshCw,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const nextReceiptNo = () => `REC-${Date.now()}`;

const MODE_COLORS = {
  Cash:         'bg-green-100 text-green-700',
  UPI:          'bg-blue-100 text-blue-700',
  'Bank Transfer': 'bg-indigo-100 text-indigo-700',
  Credit:       'bg-orange-100 text-orange-700',
  Mixed:        'bg-purple-100 text-purple-700',
};

const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  partial:   'bg-orange-100 text-orange-700',
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="text-white text-lg" />
      </div>
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

// ─── Split Payment Row ─────────────────────────────────────────────────────────
const SplitRow = ({ icon: Icon, label, value, onChange, color, placeholder = '0.00' }) => (
  <div className="flex items-center gap-3">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="text-white text-base" />
    </div>
    <div className="flex-1">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <div className="relative mt-0.5">
        <span className="absolute left-3 top-2 text-gray-400 text-sm">₹</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>
    </div>
  </div>
);

// ─── Payment Modal ────────────────────────────────────────────────────────────
function PaymentModal({ members, bills, onSave, onClose }) {
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [billRef, setBillRef] = useState('');
  const [cash, setCash] = useState('');
  const [upi, setUpi] = useState('');
  const [bank, setBank] = useState('');
  const [credit, setCredit] = useState('');
  const [payDate, setPayDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const memberSuggestions = useMemo(() => {
    if (!memberSearch.trim()) return [];
    const q = memberSearch.toLowerCase();
    return members.filter(
      (m) => m.name?.toLowerCase().includes(q) || m.id?.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [memberSearch, members]);

  const memberBills = selectedMember
    ? bills.filter((b) => b.memberId === selectedMember.id && b.balance > 0)
    : [];

  const selectedBill = memberBills.find((b) => b.billId === billRef);

  const totalPaid = [cash, upi, bank, credit].reduce((s, v) => s + Number(v || 0), 0);
  const totalDue = selectedBill?.balance ?? selectedMember?.outstanding ?? 0;
  const balance = totalDue - totalPaid;

  // determine mode label
  const paidFields = [
    { label: 'Cash', val: Number(cash || 0) },
    { label: 'UPI', val: Number(upi || 0) },
    { label: 'Bank Transfer', val: Number(bank || 0) },
    { label: 'Credit', val: Number(credit || 0) },
  ].filter((f) => f.val > 0);
  const modeLabel = paidFields.length === 0 ? 'Cash'
    : paidFields.length === 1 ? paidFields[0].label
    : 'Mixed';

  const handleSave = () => {
    if (!selectedMember) { setError('Please select a member.'); return; }
    if (totalPaid <= 0) { setError('Enter at least one payment amount.'); return; }
    const payment = {
      receiptNo: nextReceiptNo(),
      date: payDate,
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      billRef,
      totalDue,
      totalPaid,
      balance,
      cash: Number(cash || 0),
      upi: Number(upi || 0),
      bank: Number(bank || 0),
      credit: Number(credit || 0),
      mode: modeLabel,
      remarks,
      status: balance <= 0 ? 'completed' : 'partial',
    };
    onSave(payment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FiDollarSign className="text-primary-600" /> Record Payment
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
            <FiX />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm">
              <FiAlertCircle /> {error}
            </div>
          )}

          {/* Member Search */}
          <div className="relative">
            <label className="text-xs text-gray-500 font-medium mb-1 block">Member *</label>
            {selectedMember ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                <FiCheckCircle className="text-green-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{selectedMember.name}</p>
                  <p className="text-xs text-gray-500">{selectedMember.id} {selectedMember.outstanding > 0 && `• Due ₹${selectedMember.outstanding}`}</p>
                </div>
                <button onClick={() => { setSelectedMember(null); setMemberSearch(''); setBillRef(''); }} className="text-gray-400 hover:text-red-500">
                  <FiX />
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
                  <input
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    placeholder="Search member by name or ID…"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
                {memberSuggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {memberSuggestions.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setSelectedMember(m); setMemberSearch(''); setError(''); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {m.name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{m.name}</p>
                          <p className="text-xs text-gray-400">{m.id}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Bill Reference */}
          {selectedMember && (
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Bill Reference (optional)</label>
              <select
                value={billRef}
                onChange={(e) => setBillRef(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
              >
                <option value="">— Select Bill —</option>
                {memberBills.map((b) => (
                  <option key={b.billId} value={b.billId}>
                    {b.billId} | Due: ₹{b.balance?.toFixed(2)} | {b.date}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Total Due */}
          {(totalDue > 0 || selectedMember) && (
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-orange-700 font-medium">Total Amount Due</span>
              <span className="text-lg font-bold text-orange-700">{fmt(totalDue)}</span>
            </div>
          )}

          {/* Split Payment */}
          <div className="space-y-3">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Split Payment</p>
            <SplitRow icon={FiDollarSign}   label="Cash"          value={cash}   onChange={setCash}   color="bg-green-500" />
            <SplitRow icon={FiSmartphone}   label="UPI"           value={upi}    onChange={setUpi}    color="bg-blue-500" />
            <SplitRow icon={FiCreditCard}   label="Bank Transfer" value={bank}   onChange={setBank}   color="bg-indigo-500" />
            <SplitRow icon={FiAlertCircle}  label="Credit (Pending)" value={credit} onChange={setCredit} color="bg-orange-400" />
          </div>

          {/* Running Totals */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Total Paid</span>
              <span className="font-bold text-gray-900">{fmt(totalPaid)}</span>
            </div>
            {totalDue > 0 && (
              <div className={`flex justify-between font-semibold ${balance > 0 ? 'text-red-600' : 'text-green-700'}`}>
                <span>Balance {balance > 0 ? 'Due' : 'Overpaid'}</span>
                <span>{fmt(Math.abs(balance))}</span>
              </div>
            )}
            {totalPaid > 0 && totalDue > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div
                  className={`h-1.5 rounded-full transition-all ${balance <= 0 ? 'bg-green-500' : 'bg-primary-500'}`}
                  style={{ width: `${Math.min(100, (totalPaid / totalDue) * 100).toFixed(0)}%` }}
                />
              </div>
            )}
          </div>

          {/* Payment Date & Remarks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Payment Date</label>
              <input
                type="date"
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Remarks</label>
              <input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional notes…"
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl py-2.5 text-sm transition shadow"
            >
              <FiCheckCircle /> Save & Complete
            </button>
            <button
              onClick={() => {
                if (!selectedMember) return;
                const printWin = window.open('', '_blank');
                printWin.document.write(`<html><head><title>Receipt</title>
                  <style>body{font-family:sans-serif;padding:20px;} h1{color:#2d6a4f;} table{width:100%;border-collapse:collapse;} td{padding:8px;border:1px solid #ddd;}</style>
                  </head><body>
                  <h1>URJA Wellness Club – Payment Receipt</h1>
                  <p>Receipt: ${nextReceiptNo()} | Date: ${payDate}</p>
                  <p>Member: ${selectedMember.name} (${selectedMember.id})</p>
                  <table><tr><td>Total Due</td><td>₹${totalDue.toFixed(2)}</td></tr>
                  <tr><td>Total Paid</td><td>₹${totalPaid.toFixed(2)}</td></tr>
                  <tr><td>Balance</td><td>₹${balance.toFixed(2)}</td></tr></table>
                  </body></html>`);
                printWin.document.close();
                printWin.print();
              }}
              className="px-4 py-2.5 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold rounded-xl text-sm transition flex items-center gap-2"
            >
              <FiPrinter />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Payments() {
  const { members = [], bills = [], payments = [], addPayment, deletePayment } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [alertMsg, setAlertMsg] = useState(null);

  // ── summary ────────────────────────────────────────────────────────────────
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayPayments = payments.filter((p) => p.date === today);
  const todayTotal   = todayPayments.reduce((s, p) => s + (p.totalPaid || 0), 0);
  const todayCash    = todayPayments.reduce((s, p) => s + (p.cash || 0), 0);
  const todayUpi     = todayPayments.reduce((s, p) => s + (p.upi || 0), 0);
  const todayBank    = todayPayments.reduce((s, p) => s + (p.bank || 0), 0);
  const totalOutstanding = members.reduce((s, m) => s + (m.outstanding || 0), 0);

  // ── filtered list ──────────────────────────────────────────────────────────
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch = !search.trim() ||
        p.receiptNo?.toLowerCase().includes(search.toLowerCase()) ||
        p.memberName?.toLowerCase().includes(search.toLowerCase()) ||
        p.memberId?.toLowerCase().includes(search.toLowerCase());
      const matchFrom = !dateFrom || p.date >= dateFrom;
      const matchTo   = !dateTo   || p.date <= dateTo;
      return matchSearch && matchFrom && matchTo;
    });
  }, [payments, search, dateFrom, dateTo]);

  const handleSave = (payment) => {
    addPayment?.(payment);
    setShowModal(false);
    setAlertMsg({ type: 'success', text: `Payment ${payment.receiptNo} recorded successfully!` });
  };

  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {showModal && (
        <PaymentModal
          members={members}
          bills={bills}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Alert */}
      {alertMsg && (
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium shadow-sm
          ${alertMsg.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'}`}>
          <span>{alertMsg.text}</span>
          <button onClick={() => setAlertMsg(null)} className="ml-4 text-lg leading-none opacity-60 hover:opacity-100">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-0.5">Record and track member payments</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow"
        >
          <FiPlus /> Record Payment
        </button>
      </div>

      {/* ── Summary Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard icon={FiDollarSign}  label="Today's Collection" value={fmt(todayTotal)}       color="bg-primary-600" sub="today" />
        <SummaryCard icon={FiDollarSign}  label="Cash"               value={fmt(todayCash)}        color="bg-green-500"   sub="today" />
        <SummaryCard icon={FiSmartphone}  label="UPI"                value={fmt(todayUpi)}         color="bg-blue-500"    sub="today" />
        <SummaryCard icon={FiCreditCard}  label="Bank Transfer"      value={fmt(todayBank)}        color="bg-indigo-500"  sub="today" />
        <SummaryCard icon={FiAlertCircle} label="Total Outstanding"  value={fmt(totalOutstanding)} color="bg-orange-400"  sub="all members" />
      </div>

      {/* ── Filters ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search receipt, member…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <div className="flex items-center gap-2">
          <FiCalendar className="text-gray-400" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <button
          onClick={() => { setSearch(''); setDateFrom(''); setDateTo(format(new Date(), 'yyyy-MM-dd')); }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition"
        >
          <FiRefreshCw className="text-sm" /> Reset
        </button>
      </div>

      {/* ── Payments Table ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Payment Records</h2>
          <span className="text-xs text-gray-400">{filteredPayments.length} record{filteredPayments.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiDollarSign className="text-4xl mb-3 opacity-40" />
              <p className="text-sm">No payments found for the selected filters.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Receipt No', 'Date', 'Member', 'Amount', 'Mode', 'Balance', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.receiptNo} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-primary-700 font-semibold whitespace-nowrap">{p.receiptNo}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{p.date}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{p.memberName}</p>
                      <p className="text-xs text-gray-400">{p.memberId}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-gray-900">{fmt(p.totalPaid)}</p>
                      {p.billRef && <p className="text-xs text-gray-400">Ref: {p.billRef}</p>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${MODE_COLORS[p.mode] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.mode}
                      </span>
                      {/* Split breakdown tooltip-style */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.cash > 0 && <span className="text-[10px] text-green-600">Cash: {fmt(p.cash)}</span>}
                        {p.upi > 0  && <span className="text-[10px] text-blue-600">UPI: {fmt(p.upi)}</span>}
                        {p.bank > 0 && <span className="text-[10px] text-indigo-600">Bank: {fmt(p.bank)}</span>}
                        {p.credit > 0 && <span className="text-[10px] text-orange-600">Credit: {fmt(p.credit)}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`font-semibold text-sm ${p.balance > 0 ? 'text-red-600' : 'text-green-700'}`}>
                        {fmt(p.balance)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const win = window.open('', '_blank');
                            win.document.write(`<html><head><title>Receipt ${p.receiptNo}</title>
                              <style>body{font-family:sans-serif;padding:24px;} h2{color:#2d6a4f;} table{width:100%;border-collapse:collapse;} td,th{padding:8px;border:1px solid #ddd;text-align:left;}</style>
                              </head><body>
                              <h2>URJA Wellness Club – Payment Receipt</h2>
                              <p><strong>${p.receiptNo}</strong> | ${p.date}</p>
                              <p>Member: ${p.memberName} (${p.memberId})</p>
                              ${p.billRef ? `<p>Bill Ref: ${p.billRef}</p>` : ''}
                              <table><thead><tr><th>Mode</th><th>Amount</th></tr></thead><tbody>
                              ${p.cash ? `<tr><td>Cash</td><td>₹${p.cash.toFixed(2)}</td></tr>` : ''}
                              ${p.upi ? `<tr><td>UPI</td><td>₹${p.upi.toFixed(2)}</td></tr>` : ''}
                              ${p.bank ? `<tr><td>Bank Transfer</td><td>₹${p.bank.toFixed(2)}</td></tr>` : ''}
                              ${p.credit ? `<tr><td>Credit</td><td>₹${p.credit.toFixed(2)}</td></tr>` : ''}
                              <tr><td><strong>Total Paid</strong></td><td><strong>₹${p.totalPaid.toFixed(2)}</strong></td></tr>
                              <tr><td>Balance</td><td>₹${p.balance.toFixed(2)}</td></tr>
                              </tbody></table>
                              ${p.remarks ? `<p>Remarks: ${p.remarks}</p>` : ''}
                              </body></html>`);
                            win.document.close();
                            win.print();
                          }}
                          title="Print Receipt"
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition"
                        >
                          <FiPrinter className="text-sm" />
                        </button>
                        <button
                          onClick={() => deletePayment?.(p.receiptNo)}
                          title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table Footer */}
        {filteredPayments.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="font-semibold text-gray-800">Totals →</span>
            <span>Collected: <strong className="text-primary-700">{fmt(filteredPayments.reduce((s, p) => s + (p.totalPaid || 0), 0))}</strong></span>
            <span>Cash: <strong className="text-green-700">{fmt(filteredPayments.reduce((s, p) => s + (p.cash || 0), 0))}</strong></span>
            <span>UPI: <strong className="text-blue-700">{fmt(filteredPayments.reduce((s, p) => s + (p.upi || 0), 0))}</strong></span>
            <span>Bank: <strong className="text-indigo-700">{fmt(filteredPayments.reduce((s, p) => s + (p.bank || 0), 0))}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
}
