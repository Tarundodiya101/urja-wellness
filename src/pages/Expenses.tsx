import React, { useState } from 'react';
import { FiPlus, FiDollarSign, FiCalendar, FiSave, FiTag } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Modal from '../components/shared/Modal';

const CATEGORIES = [
  'Milk', 'Fruits', 'Cleaning', 'Rent', 'Electricity',
  'Staff Salary', 'Transport', 'Office Supplies', 'Event & Promotion', 'Marketing', 'Other'
];

export default function Expenses() {
  const { expenses, addExpense } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [category, setCategory] = useState('Milk');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');

  const totalExpense = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const handleSave = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert('Please enter a valid amount');

    addExpense({
      date,
      category,
      amount: Number(amount),
      paymentMode,
      remarks: remarks || `Daily ${category} expense`
    });

    setShowModal(false);
    setAmount('');
    setRemarks('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Daily Expense Management</h1>
          <p className="text-sm text-gray-500">Record daily center expenses for accurate cash closing & financial reports</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FiPlus /> Record Daily Expense
        </button>
      </div>

      {/* Expense Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card border-l-4 border-rose-500">
          <div className="text-xs text-gray-400 font-bold uppercase">Total Center Expenses</div>
          <div className="text-2xl font-black text-rose-600 mt-1">₹{totalExpense.toLocaleString()}</div>
        </div>
        <div className="card border-l-4 border-amber-500">
          <div className="text-xs text-gray-400 font-bold uppercase">Top Expense Category</div>
          <div className="text-lg font-bold text-navy-900 mt-1">Rent & Electricity</div>
        </div>
        <div className="card border-l-4 border-emerald-500">
          <div className="text-xs text-gray-400 font-bold uppercase">Today's Expense Total</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            ₹{expenses.filter(e => e.date === new Date().toISOString().split('T')[0]).reduce((s, e) => s + e.amount, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Expense List Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-head">
              <th className="px-4 py-3 text-left">Expense ID</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Payment Mode</th>
              <th className="px-4 py-3 text-left">Remarks</th>
              <th className="px-4 py-3 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id} className="table-row">
                <td className="px-4 py-3 font-bold text-navy-900">{e.id}</td>
                <td className="px-4 py-3 text-gray-600">{e.date}</td>
                <td className="px-4 py-3 font-semibold text-emerald-800">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">{e.category}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{e.paymentMode}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{e.remarks}</td>
                <td className="px-4 py-3 font-black text-rose-600 text-right">₹{e.amount?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expense Entry Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Daily Expense" size="md">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="label">Expense Category *</label>
            <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Expense Amount (₹) *</label>
            <input type="number" className="input-field" placeholder="e.g. 450" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Payment Mode</label>
              <select className="input-field" value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank">Bank Transfer</option>
                <option value="Card">Credit/Debit Card</option>
              </select>
            </div>
            <div>
              <label className="label">Expense Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="label">Remarks / Purpose</label>
            <input className="input-field" placeholder="e.g. 20 Liters Fresh Milk for Shake Center" value={remarks} onChange={e => setRemarks(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
            <FiSave size={18} /> SAVE EXPENSE ENTRY
          </button>
        </form>
      </Modal>
    </div>
  );
}
