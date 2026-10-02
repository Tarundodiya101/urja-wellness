import React, { useState } from 'react';
import { FiPlus, FiShoppingBag, FiTruck, FiSave, FiTrash2 } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Modal from '../components/shared/Modal';
import Badge from '../components/shared/Badge';

export default function Purchases() {
  const { purchases, addPurchase, products } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [supplier, setSupplier] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [items, setItems] = useState([
    { product: 'Nutrition Formula 1 Shake (Vanilla)', batchNo: 'BCH-2025-X', expiryDate: '2026-12-31', qty: 10, purchaseRate: 1800, amount: 18000 }
  ]);

  const [paidAmount, setPaidAmount] = useState(18000);

  const addItemRow = () => {
    setItems(prev => [
      ...prev,
      { product: products[0]?.name || 'Nutrition Formula 1 Shake (Vanilla)', batchNo: 'BCH-2025-Y', expiryDate: '2026-12-31', qty: 5, purchaseRate: 1000, amount: 5000 }
    ]);
  };

  const removeItemRow = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const updateItemField = (idx, field, val) => {
    setItems(prev => prev.map((item, i) => {
      if (i === idx) {
        const updated = { ...item, [field]: val };
        if (field === 'qty' || field === 'purchaseRate') {
          updated.amount = (Number(updated.qty) || 0) * (Number(updated.purchaseRate) || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const totalAmount = items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  const supplierDue = Math.max(0, totalAmount - (Number(paidAmount) || 0));

  const handleSavePurchase = (e) => {
    e.preventDefault();
    if (!supplier || !invoiceNo) return alert('Supplier name and invoice number are required');

    addPurchase({
      supplier,
      invoiceNo,
      date,
      totalAmount,
      paidAmount: Number(paidAmount) || 0,
      supplierDue,
      paymentStatus: supplierDue === 0 ? 'Paid' : paidAmount > 0 ? 'Part Paid' : 'Unpaid',
      items
    });

    setShowModal(false);
    setSupplier('');
    setInvoiceNo('');
    alert('Purchase entry saved! Product stock automatically increased in Inventory.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Stock Purchase Entry</h1>
          <p className="text-sm text-gray-500">Record supplier stock inward entries & auto-increment product stock levels</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FiPlus /> New Purchase Inward Entry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card border-l-4 border-emerald-500">
          <div className="text-xs text-gray-400 font-bold uppercase">Total Stock Inward Value</div>
          <div className="text-2xl font-black text-navy-900 mt-1">₹{purchases.reduce((s, p) => s + p.totalAmount, 0).toLocaleString()}</div>
        </div>
        <div className="card border-l-4 border-blue-500">
          <div className="text-xs text-gray-400 font-bold uppercase">Total Suppliers Paid</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">₹{purchases.reduce((s, p) => s + p.paidAmount, 0).toLocaleString()}</div>
        </div>
        <div className="card border-l-4 border-orange-500">
          <div className="text-xs text-gray-400 font-bold uppercase">Total Supplier Dues Outstanding</div>
          <div className="text-2xl font-black text-orange-600 mt-1">₹{purchases.reduce((s, p) => s + p.supplierDue, 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="table-head">
              <th className="px-4 py-3 text-left">Purchase ID</th>
              <th className="px-4 py-3 text-left">Supplier Name</th>
              <th className="px-4 py-3 text-left">Invoice No</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Items Purchased</th>
              <th className="px-4 py-3 text-left">Total Amount</th>
              <th className="px-4 py-3 text-left">Paid / Due</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(p => (
              <tr key={p.id} className="table-row">
                <td className="px-4 py-3 font-bold text-navy-900">{p.id}</td>
                <td className="px-4 py-3 text-gray-800 font-semibold">{p.supplier}</td>
                <td className="px-4 py-3 text-gray-600">{p.invoiceNo}</td>
                <td className="px-4 py-3 text-gray-600">{p.date}</td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {p.items?.map(i => `${i.product} (x${i.qty})`).join(', ')}
                </td>
                <td className="px-4 py-3 font-bold text-navy-900">₹{p.totalAmount?.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="text-emerald-700 font-semibold">Paid: ₹{p.paidAmount?.toLocaleString()}</span>
                  {p.supplierDue > 0 && <div className="text-orange-600 font-semibold">Due: ₹{p.supplierDue?.toLocaleString()}</div>}
                </td>
                <td className="px-4 py-3"><Badge status={p.paymentStatus} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Purchase Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Stock Purchase Entry" size="xl">
        <form onSubmit={handleSavePurchase} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Supplier Name *</label>
              <input className="input-field" placeholder="e.g. HerbaLife India Ltd" value={supplier} onChange={e => setSupplier(e.target.value)} required />
            </div>
            <div>
              <label className="label">Invoice No *</label>
              <input className="input-field" placeholder="e.g. INV-HL-9982" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} required />
            </div>
            <div>
              <label className="label">Purchase Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-3 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-navy-900 uppercase">Product Details (Stock Inward)</h4>
              <button type="button" onClick={addItemRow} className="btn-outline py-1 px-2 text-xs">
                <FiPlus size={14} /> Add Product Line
              </button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-gray-200 text-xs">
                <div className="col-span-4">
                  <label className="label text-[10px]">Product</label>
                  <select className="input-field py-1" value={item.product} onChange={e => updateItemField(idx, 'product', e.target.value)}>
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label text-[10px]">Batch No</label>
                  <input className="input-field py-1" value={item.batchNo} onChange={e => updateItemField(idx, 'batchNo', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label text-[10px]">Expiry Date</label>
                  <input type="date" className="input-field py-1" value={item.expiryDate} onChange={e => updateItemField(idx, 'expiryDate', e.target.value)} />
                </div>
                <div className="col-span-1">
                  <label className="label text-[10px]">Qty</label>
                  <input type="number" min="1" className="input-field py-1" value={item.qty} onChange={e => updateItemField(idx, 'qty', e.target.value)} />
                </div>
                <div className="col-span-1">
                  <label className="label text-[10px]">Rate (₹)</label>
                  <input type="number" className="input-field py-1" value={item.purchaseRate} onChange={e => updateItemField(idx, 'purchaseRate', e.target.value)} />
                </div>
                <div className="col-span-1 text-right">
                  <label className="label text-[10px]">Amount</label>
                  <div className="font-bold text-navy-900">₹{item.amount?.toLocaleString()}</div>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button type="button" onClick={() => removeItemRow(idx)} className="text-red-500 hover:text-red-700 p-1">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Total Purchase</div>
              <div className="text-2xl font-black text-navy-900">₹{totalAmount.toLocaleString()}</div>
            </div>
            <div>
              <label className="label">Amount Paid Now (₹)</label>
              <input type="number" className="input-field" value={paidAmount} onChange={e => setPaidAmount(Number(e.target.value))} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-bold uppercase">Supplier Due Balance</div>
              <div className="text-2xl font-black text-orange-600">₹{supplierDue.toLocaleString()}</div>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
            <FiSave size={18} /> SAVE PURCHASE & UPDATE INVENTORY STOCK
          </button>
        </form>
      </Modal>
    </div>
  );
}
