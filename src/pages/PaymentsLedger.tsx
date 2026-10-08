import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { FiCreditCard, FiPlus, FiPrinter, FiMessageSquare, FiBookOpen } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Badge from '../components/shared/Badge';
import Modal from '../components/shared/Modal';

export default function PaymentsLedger() {
  const { members, payments, addPayment } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const member = members.find((m: any) => m.id === selectedMemberId) || members[0];
  const memberPaymentsList = payments.filter((p: any) => p.memberId === member.id);

  const [amount, setAmount] = useState(1250);
  const [mode, setMode] = useState('UPI');
  const [particular, setParticular] = useState('Part Payment Received');

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return alert('Enter a valid amount');

    addPayment({
      memberId: member.id,
      memberName: member.name,
      amount: Number(amount),
      mode,
      type: particular,
      date: new Date().toISOString().split('T')[0]
    });

    setShowPaymentModal(false);
    alert(`Payment of ₹${amount} recorded for ${member.name}! Ledger & Pending balance updated.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Member Payment & Ledger Account</h1>
          <p className="text-sm text-gray-500">Master Section 14: Per-member Ledger Account (Total Amount - Paid Amount = Pending Balance Formula)</p>
        </div>
        <button onClick={() => setShowPaymentModal(true)} className="btn-primary">
          <FiPlus /> Add Payment Received
        </button>
      </div>

      {/* Member Selector */}
      <div className="card bg-gray-50 border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiBookOpen className="text-emerald-600 text-xl" />
          <span className="font-bold text-navy-900 text-sm">Select Member Ledger:</span>
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
        <div className="flex gap-2">
          <button onClick={() => alert(`Printing Ledger Statement for ${member.name}...`)} className="btn-outline py-1 px-3 text-xs">
            <FiPrinter /> Print Statement
          </button>
          <button onClick={() => alert(`WhatsApp Statement sent to ${member.name}`)} className="btn-primary py-1 px-3 text-xs">
            <FiMessageSquare /> WhatsApp Statement
          </button>
        </div>
      </div>

      {/* Ledger Calculation Summary Box (Formula: Total - Paid = Pending) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card border-l-4 border-navy-900">
          <div className="text-xs text-gray-400 font-bold uppercase">Package Total Amount</div>
          <div className="text-2xl font-black text-navy-900 mt-1">₹{(member.amount || 0).toLocaleString()}</div>
        </div>
        <div className="card border-l-4 border-emerald-500">
          <div className="text-xs text-gray-400 font-bold uppercase">Total Amount Paid</div>
          <div className="text-2xl font-black text-emerald-700 mt-1">₹{(member.paid || 0).toLocaleString()}</div>
        </div>
        <div className="card border-l-4 border-rose-500">
          <div className="text-xs text-gray-400 font-bold uppercase">Net Pending Dues Balance</div>
          <div className="text-2xl font-black text-rose-600 mt-1">₹{(member.pending || 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Specification Section 14 Ledger Table */}
      <div className="card p-0 overflow-hidden border-t-4 border-emerald-600">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-navy-900 text-sm">
          Per-Member Account Ledger Statement ({member.name} — {member.id})
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="table-head">
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Particulars / Transaction</th>
              <th className="px-4 py-3 text-left">Receipt No</th>
              <th className="px-4 py-3 text-right">Debit (Dr ₹)</th>
              <th className="px-4 py-3 text-right">Credit (Cr ₹)</th>
              <th className="px-4 py-3 text-right">Running Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-row font-semibold">
              <td className="px-4 py-3 text-gray-600">{member.joiningDate}</td>
              <td className="px-4 py-3 text-navy-900">{member.package}</td>
              <td className="px-4 py-3 text-gray-500">INV-1025</td>
              <td className="px-4 py-3 text-right text-rose-600">₹{(member.amount || 0).toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-gray-400">—</td>
              <td className="px-4 py-3 text-right font-bold text-navy-900">₹{(member.amount || 0).toLocaleString()}</td>
            </tr>

            {memberPaymentsList.map((p: any) => (
              <tr key={p.id} className="table-row">
                <td className="px-4 py-3 text-gray-600">{p.date}</td>
                <td className="px-4 py-3 text-emerald-800 font-semibold">{p.type} ({p.mode})</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.receiptNo}</td>
                <td className="px-4 py-3 text-right text-gray-400">—</td>
                <td className="px-4 py-3 text-right text-emerald-700 font-bold">₹{p.amount?.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-black text-navy-900">₹{(member.pending || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <Modal isOpen={true} onClose={() => setShowPaymentModal(false)} title={`Record Payment for ${member.name}`} size="md">
          <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
            <div>
              <label className="label text-[10px]">Payment Particular</label>
              <input className="input-field" value={particular} onChange={e => setParticular(e.target.value)} />
            </div>

            <div>
              <label className="label text-[10px]">Amount Received (₹) *</label>
              <input type="number" className="input-field text-lg font-bold" value={amount} onChange={e => setAmount(Number(e.target.value))} required />
            </div>

            <div>
              <label className="label text-[10px]">Payment Mode</label>
              <Select className="input-field" value={mode} onChange={e => setMode(e.target.value)}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Bank">Bank Transfer / NEFT</option>
                <option value="Card">Credit / Debit Card</option>
              </Select>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
              <div className="flex justify-between font-bold text-emerald-900">
                <span>New Pending Dues After Payment:</span>
                <span className="text-rose-600 font-black">₹{Math.max(0, (member.pending || 0) - (Number(amount) || 0)).toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
              SAVE PAYMENT & UPDATE LEDGER
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
