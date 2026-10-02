import React, { useState, useMemo, useRef } from 'react';
import { format } from 'date-fns';
import {
  FiPlus, FiTrash2, FiSearch, FiPrinter, FiSave, FiEye,
  FiX, FiFileText, FiChevronDown, FiCheckCircle, FiAlertCircle,
  FiDollarSign,
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/mockData';

// ─── helpers ────────────────────────────────────────────────────────────────
const nextBillId = () => `BILL-${Date.now()}`;
const fmt = (n) => `₹${Number(n || 0).toFixed(2)}`;

const StatusBadge = ({ status }) => {
  const map = {
    paid:    'bg-green-100 text-green-700',
    draft:   'bg-yellow-100 text-yellow-700',
    partial: 'bg-orange-100 text-orange-700',
    unpaid:  'bg-red-100 text-red-600',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

const emptyRow = () => ({
  key: Math.random().toString(36).slice(2),
  product: '',
  qty: 1,
  rate: 0,
  amount: 0,
});

// ─── View Bill Modal ─────────────────────────────────────────────────────────
function ViewBillModal({ bill, onClose }) {
  if (!bill) return null;
  const printRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML ?? '';
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>URJA Bill ${bill.billId}</title>
      <style>
        body { font-family: sans-serif; padding: 20px; color: #111; }
        table { width:100%; border-collapse:collapse; margin-top:12px; }
        th,td { border:1px solid #ddd; padding:8px; text-align:left; font-size:13px; }
        th { background:#f3f4f6; }
        .header { text-align:center; margin-bottom:20px; }
        .totals { text-align:right; margin-top:12px; }
        .totals p { margin:4px 0; }
      </style></head><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2"><FiFileText className="text-primary-600" /> Invoice – {bill.billId}</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-700 hover:bg-navy-800 text-white rounded-lg text-xs font-medium transition">
              <FiPrinter /> Print
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500">
              <FiX />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="overflow-y-auto flex-1 p-6" ref={printRef}>
          {/* Header */}
          <div className="header text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">U</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-primary-700">URJA Wellness Club</h1>
                <p className="text-xs text-gray-500">Nutrition Center Management</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Invoice No: <strong>{bill.billId}</strong> | Date: {bill.date}</p>
          </div>

          {/* Member Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
            <p className="font-semibold text-gray-800">Billed To:</p>
            <p className="text-gray-700 mt-0.5">{bill.memberName}</p>
            <p className="text-gray-500 text-xs">{bill.memberId}</p>
          </div>

          {/* Items Table */}
          <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#', 'Product', 'Qty', 'Rate', 'Amount'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bill.items?.map((item, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{item.product}</td>
                  <td className="px-4 py-2.5 text-gray-600">{item.qty}</td>
                  <td className="px-4 py-2.5 text-gray-600">{fmt(item.rate)}</td>
                  <td className="px-4 py-2.5 font-semibold text-gray-800">{fmt(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals mt-4 text-sm space-y-1 text-right">
            <p className="text-gray-600">Subtotal: <span className="font-semibold text-gray-800">{fmt(bill.subtotal)}</span></p>
            {bill.gst > 0 && <p className="text-gray-600">GST ({bill.gstRate}%): <span className="font-semibold text-gray-800">{fmt(bill.gst)}</span></p>}
            <p className="text-lg font-bold text-gray-900 border-t border-gray-200 pt-2 mt-2">Total: {fmt(bill.total)}</p>
            <p className="text-green-700 font-medium">Paid: {fmt(bill.paid)}</p>
            <p className={`font-semibold ${bill.balance > 0 ? 'text-red-600' : 'text-green-700'}`}>
              Balance: {fmt(bill.balance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Billing() {
  const { members = [], bills = [], addBill, deleteBill } = useApp();

  // ── New Bill State ─────────────────────────────────────────────────────────
  const [showNew, setShowNew] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [billDate, setBillDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [rows, setRows] = useState([emptyRow()]);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstRate] = useState(0);
  const [paymentReceived, setPaymentReceived] = useState('');
  const [alertMsg, setAlertMsg] = useState(null);

  // ── View/Search State ──────────────────────────────────────────────────────
  const [billSearch, setBillSearch] = useState('');
  const [viewBill, setViewBill] = useState(null);

  // ── member suggestions ─────────────────────────────────────────────────────
  const memberSuggestions = useMemo(() => {
    if (!memberSearch.trim()) return [];
    const q = memberSearch.toLowerCase();
    return members.filter(
      (m) => m.name?.toLowerCase().includes(q) || m.id?.toLowerCase().includes(q),
    ).slice(0, 5);
  }, [memberSearch, members]);

  // ── product lookup ─────────────────────────────────────────────────────────
  const productOptions = PRODUCTS ?? [];
  const getProduct = (name) => productOptions.find((p) => p.name === name);

  // ── row handlers ──────────────────────────────────────────────────────────
  const updateRow = (key, field, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.key !== key) return r;
        const updated = { ...r, [field]: value };
        if (field === 'product') {
          const prod = getProduct(value);
          updated.rate = prod?.sellingPrice ?? 0;
          updated.amount = updated.rate * updated.qty;
        }
        if (field === 'qty' || field === 'rate') {
          updated.amount = Number(updated.rate) * Number(field === 'qty' ? value : updated.qty);
        }
        return updated;
      }),
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (key) => setRows((prev) => prev.filter((r) => r.key !== key));

  // ── totals ────────────────────────────────────────────────────────────────
  const subtotal = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const gst = gstEnabled ? (subtotal * gstRate) / 100 : 0;
  const total = subtotal + gst;
  const paid = Number(paymentReceived || 0);
  const balance = total - paid;

  // ── save bill ─────────────────────────────────────────────────────────────
  const saveBill = (asDraft = false) => {
    if (!selectedMember) {
      setAlertMsg({ type: 'error', text: 'Please select a member.' });
      return;
    }
    const validRows = rows.filter((r) => r.product);
    if (!validRows.length) {
      setAlertMsg({ type: 'error', text: 'Add at least one product.' });
      return;
    }
    const bill = {
      billId: nextBillId(),
      date: billDate,
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      items: validRows,
      subtotal,
      gstRate,
      gst,
      total,
      paid,
      balance,
      status: asDraft ? 'draft' : balance <= 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid',
    };
    addBill?.(bill);
    if (!asDraft) setAlertMsg({ type: 'success', text: `Bill ${bill.billId} saved!` });
    resetForm();
  };

  const resetForm = () => {
    setShowNew(false);
    setSelectedMember(null);
    setMemberSearch('');
    setRows([emptyRow()]);
    setPaymentReceived('');
    setGstEnabled(false);
  };

  // ── filtered bills ────────────────────────────────────────────────────────
  const filteredBills = useMemo(() => {
    if (!billSearch.trim()) return bills;
    const q = billSearch.toLowerCase();
    return bills.filter(
      (b) =>
        b.billId?.toLowerCase().includes(q) ||
        b.memberName?.toLowerCase().includes(q) ||
        b.memberId?.toLowerCase().includes(q),
    );
  }, [bills, billSearch]);

  // ─── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {viewBill && <ViewBillModal bill={viewBill} onClose={() => setViewBill(null)} />}

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
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage member bills</p>
        </div>
        <button
          onClick={() => setShowNew((v) => !v)}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow"
        >
          <FiPlus /> New Bill
        </button>
      </div>

      {/* ── New Bill Panel ──────────────────────────────────────────────────── */}
      {showNew && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 text-base">
            <FiFileText className="text-primary-600" /> New Bill
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Member Search */}
            <div className="relative">
              <label className="text-xs text-gray-500 font-medium mb-1 block">Member *</label>
              {selectedMember ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                  <FiCheckCircle className="text-green-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{selectedMember.name}</p>
                    <p className="text-xs text-gray-500">{selectedMember.id}</p>
                  </div>
                  <button onClick={() => { setSelectedMember(null); setMemberSearch(''); }}
                    className="text-gray-400 hover:text-red-500"><FiX /></button>
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
                          onClick={() => { setSelectedMember(m); setMemberSearch(''); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                            {m.name?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{m.name}</p>
                            <p className="text-xs text-gray-400">{m.id} {m.outstanding > 0 && `• Due ₹${m.outstanding}`}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bill Date */}
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1 block">Bill Date</label>
              <input
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {/* Product Rows */}
          <div>
            <label className="text-xs text-gray-500 font-medium mb-2 block">Products</label>
            <div className="space-y-2">
              {rows.map((row, idx) => (
                <div key={row.key} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <div className="relative">
                      <select
                        value={row.product}
                        onChange={(e) => updateRow(row.key, 'product', e.target.value)}
                        className="w-full appearance-none text-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                      >
                        <option value="">Select product…</option>
                        {productOptions.map((p) => (
                          <option key={p.name} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-2 top-2.5 text-gray-400 text-sm pointer-events-none" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={row.qty}
                      onChange={(e) => updateRow(row.key, 'qty', e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300 text-center"
                      placeholder="Qty"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={row.rate}
                      onChange={(e) => updateRow(row.key, 'rate', e.target.value)}
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
                      placeholder="Rate"
                    />
                  </div>
                  <div className="col-span-2 text-sm font-semibold text-gray-800 text-right pr-1">
                    {fmt(row.amount)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    {rows.length > 1 && (
                      <button onClick={() => removeRow(row.key)} className="text-red-400 hover:text-red-600 transition">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addRow}
              className="mt-3 flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-sm font-medium transition"
            >
              <FiPlus /> Add Row
            </button>
          </div>

          {/* Totals + Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
            <div className="space-y-3">
              {/* GST Toggle */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div
                  onClick={() => setGstEnabled((v) => !v)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${gstEnabled ? 'bg-primary-500' : 'bg-gray-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${gstEnabled ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm text-gray-600">Apply GST ({gstRate}%)</span>
              </label>

              {/* Payment Received */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Payment Received (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={paymentReceived}
                  onChange={(e) => setPaymentReceived(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
              </div>
            </div>

            {/* Totals Box */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span className="font-semibold">{fmt(subtotal)}</span>
              </div>
              {gstEnabled && (
                <div className="flex justify-between text-gray-600">
                  <span>GST ({gstRate}%)</span><span className="font-semibold">{fmt(gst)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 border-t border-gray-200 pt-2">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
              <div className="flex justify-between text-green-700 font-medium">
                <span>Paid</span><span>{fmt(paid)}</span>
              </div>
              <div className={`flex justify-between font-bold ${balance > 0 ? 'text-red-600' : 'text-green-700'}`}>
                <span>Balance</span><span>{fmt(balance)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => saveBill(true)}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl text-sm transition"
            >
              <FiSave /> Save Draft
            </button>
            <button
              onClick={() => saveBill(false)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-sm transition shadow"
            >
              <FiPrinter /> Print & Save
            </button>
            <button
              onClick={resetForm}
              className="ml-auto flex items-center gap-1.5 px-4 py-2.5 text-gray-400 hover:text-gray-600 text-sm transition"
            >
              <FiX /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Bills Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-semibold text-gray-800">All Bills</h2>
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400 text-sm" />
            <input
              value={billSearch}
              onChange={(e) => setBillSearch(e.target.value)}
              placeholder="Search by Bill ID, member…"
              className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredBills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FiFileText className="text-4xl mb-3 opacity-40" />
              <p className="text-sm">No bills found.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Bill ID', 'Date', 'Member', 'Items', 'Total', 'Paid', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.billId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-primary-700 font-semibold">{bill.billId}</td>
                    <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{bill.date}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{bill.memberName}</p>
                      <p className="text-xs text-gray-400">{bill.memberId}</p>
                    </td>
                    <td className="px-5 py-3 text-center text-gray-600">{bill.items?.length ?? 0}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{fmt(bill.total)}</td>
                    <td className="px-5 py-3 text-green-700 font-medium">{fmt(bill.paid)}</td>
                    <td className="px-5 py-3"><StatusBadge status={bill.status} /></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewBill(bill)} title="View"
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                          <FiEye className="text-sm" />
                        </button>
                        <button onClick={() => setViewBill(bill)} title="Print"
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition">
                          <FiPrinter className="text-sm" />
                        </button>
                        <button onClick={() => deleteBill?.(bill.billId)} title="Delete"
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition">
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
      </div>
    </div>
  );
}
