import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  FiPlus, FiSearch, FiEdit2, FiPackage, FiAlertTriangle,
  FiX, FiCheck, FiChevronDown, FiTrendingDown
} from 'react-icons/fi';
import { format } from 'date-fns';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 'PRD001', name: 'Whey Protein (1kg)',    category: 'Supplements', unit: 'Bag',    price: 2499, minStock: 10, openingStock: 25, consumed: 4  },
  { id: 'PRD002', name: 'Creatine Monohydrate',  category: 'Supplements', unit: 'Bottle', price: 799,  minStock: 8,  openingStock: 6,  consumed: 2  },
  { id: 'PRD003', name: 'Multivitamin Tablets',  category: 'Health',      unit: 'Strip',  price: 349,  minStock: 20, openingStock: 0,  consumed: 0  },
  { id: 'PRD004', name: 'BCAA Powder (300g)',     category: 'Supplements', unit: 'Jar',    price: 1299, minStock: 5,  openingStock: 12, consumed: 1  },
  { id: 'PRD005', name: 'Yoga Mat',              category: 'Equipment',   unit: 'Piece',  price: 599,  minStock: 3,  openingStock: 7,  consumed: 0  },
  { id: 'PRD006', name: 'Resistance Band Set',   category: 'Equipment',   unit: 'Set',    price: 899,  minStock: 4,  openingStock: 3,  consumed: 1  },
  { id: 'PRD007', name: 'Electrolyte Drink Mix', category: 'Health',      unit: 'Sachet', price: 49,   minStock: 50, openingStock: 30, consumed: 12 },
  { id: 'PRD008', name: 'Weight Loss Capsules',  category: 'Health',      unit: 'Bottle', price: 999,  minStock: 6,  openingStock: 2,  consumed: 0  },
];

const MOCK_CONSUMPTION = [
  { memberId: 'MEM001', memberName: 'Rahul Sharma',  product: 'Whey Protein (1kg)',    qty: 1, date: format(new Date(), 'yyyy-MM-dd') },
  { memberId: 'MEM002', memberName: 'Priya Verma',   product: 'BCAA Powder (300g)',     qty: 1, date: format(new Date(), 'yyyy-MM-dd') },
  { memberId: 'MEM003', memberName: 'Amit Patel',    product: 'Electrolyte Drink Mix', qty: 3, date: format(new Date(), 'yyyy-MM-dd') },
  { memberId: 'MEM001', memberName: 'Rahul Sharma',  product: 'Whey Protein (1kg)',    qty: 1, date: format(new Date(), 'yyyy-MM-dd') },
  { memberId: 'MEM004', memberName: 'Sneha Gupta',   product: 'Resistance Band Set',   qty: 1, date: format(new Date(), 'yyyy-MM-dd') },
];

const CATEGORIES = ['All', 'Supplements', 'Health', 'Equipment', 'Food & Beverages', 'Other'];

function stockStatus(product) {
  const closing = product.openingStock - product.consumed;
  if (closing <= 0)                    return { label: 'Out of Stock', color: 'bg-red-100 text-red-700',    dot: 'bg-red-500',    key: 'out'  };
  if (closing <= product.minStock)     return { label: 'Low Stock',    color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400', key: 'low'  };
  return                                      { label: 'Good Stock',   color: 'bg-green-100 text-green-700',   dot: 'bg-green-500',  key: 'good' };
}

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({ product, onClose, onSave }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    name:         product?.name         ?? '',
    category:     product?.category     ?? 'Supplements',
    unit:         product?.unit         ?? 'Piece',
    price:        product?.price        ?? '',
    minStock:     product?.minStock     ?? '',
    openingStock: product?.openingStock ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim())                            e.name         = 'Product name is required';
    if (!form.price || isNaN(Number(form.price)))             e.price        = 'Enter valid price';
    if (!form.minStock || isNaN(Number(form.minStock)))       e.minStock     = 'Enter valid min stock';
    if (!form.openingStock || isNaN(Number(form.openingStock))) e.openingStock = 'Enter valid stock';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...form,
      price:        Number(form.price),
      minStock:     Number(form.minStock),
      openingStock: Number(form.openingStock),
    });
  }

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${errors[key] ? 'border-red-400' : 'border-gray-300'}`}
        placeholder={placeholder}
      />
      {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-navy-700 to-navy-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors"><FiX size={22} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {field('Product Name *', 'name', 'text', 'e.g. Whey Protein 1kg')}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              >
                {['Piece', 'Bag', 'Bottle', 'Strip', 'Jar', 'Box', 'Set', 'Sachet', 'Pack'].map(u => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {field('Price (₹) *', 'price', 'number', '0')}
            {field('Min Stock *', 'minStock', 'number', '0')}
            {field('Opening Stock *', 'openingStock', 'number', '0')}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition shadow-sm text-sm">
              {isEdit ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Add Stock Modal ─────────────────────────────────────────────────────────
function AddStockModal({ product, onClose, onSave }) {
  const [qty, setQty]     = useState('');
  const [note, setNote]   = useState('');
  const [error, setError] = useState('');

  function handleSubmit(ev) {
    ev.preventDefault();
    if (!qty || isNaN(Number(qty)) || Number(qty) <= 0) { setError('Enter valid quantity'); return; }
    onSave(Number(qty), note);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-base">Add Stock</h2>
            <p className="text-primary-100 text-xs truncate max-w-[220px]">{product?.name}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><FiX size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 flex justify-between">
            <span>Current Stock</span>
            <span className="font-bold text-gray-800">{product ? product.openingStock - product.consumed : 0} {product?.unit}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity to Add *</label>
            <input
              type="number"
              min="1"
              value={qty}
              onChange={e => { setQty(e.target.value); setError(''); }}
              className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition ${error ? 'border-red-400' : 'border-gray-300'}`}
              placeholder="Enter quantity"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note / Reference</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="e.g. Purchase order #123"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition text-sm">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition shadow-sm text-sm">Add Stock</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Inventory() {
  useApp();

  const [products, setProducts]               = useState(INITIAL_PRODUCTS);
  const [search, setSearch]                   = useState('');
  const [categoryFilter, setCategoryFilter]   = useState('All');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct]         = useState(null);
  const [addStockProduct, setAddStockProduct] = useState(null);
  const [toast, setToast]                     = useState(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const enriched = useMemo(() =>
    products.map(p => ({
      ...p,
      closing: p.openingStock - p.consumed,
      status:  stockStatus(p),
    })),
    [products]
  );

  const filtered = useMemo(() =>
    enriched.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
      const matchCat    = categoryFilter === 'All' || p.category === categoryFilter;
      return matchSearch && matchCat;
    }),
    [enriched, search, categoryFilter]
  );

  const summary = useMemo(() => ({
    total:   enriched.length,
    good:    enriched.filter(p => p.status.key === 'good').length,
    low:     enriched.filter(p => p.status.key === 'low').length,
    out:     enriched.filter(p => p.status.key === 'out').length,
    alerts:  enriched.filter(p => p.status.key !== 'good'),
  }), [enriched]);

  function handleSaveProduct(data) {
    if (editProduct?.id) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...data } : p));
      showToast('Product updated successfully');
    } else {
      const newId = `PRD${String(products.length + 1).padStart(3, '0')}`;
      setProducts(prev => [...prev, { id: newId, consumed: 0, ...data }]);
      showToast('Product added successfully');
    }
    setShowProductModal(false);
    setEditProduct(null);
  }

  function handleAddStock(productId, qty) {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, openingStock: p.openingStock + qty } : p));
    setAddStockProduct(null);
    showToast(`Stock updated successfully`);
  }

  function openEdit(product) {
    setEditProduct(product);
    setShowProductModal(true);
  }

  function openAddProduct() {
    setEditProduct(null);
    setShowProductModal(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === 'success' ? 'bg-green-500' : 'bg-amber-500'}`}>
          <FiCheck size={16} /> {toast.msg}
        </div>
      )}

      {/* Modals */}
      {showProductModal && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowProductModal(false); setEditProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}
      {addStockProduct && (
        <AddStockModal
          product={addStockProduct}
          onClose={() => setAddStockProduct(null)}
          onSave={(qty, note) => handleAddStock(addStockProduct.id, qty)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-800">Inventory</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage products, stock levels & consumption</p>
          </div>
          <button
            onClick={openAddProduct}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <FiPlus size={16} /> Add Product
          </button>
        </div>

        {/* ── Stock Alert Banner ───────────────────────────────────────── */}
        {summary.alerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex items-start gap-3">
            <FiAlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={20} />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Stock Alert – {summary.alerts.length} product{summary.alerts.length > 1 ? 's' : ''} need attention</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {summary.alerts.map(p => (
                  <span key={p.id} className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.status.color}`}>
                    {p.name} · {p.status.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Summary Cards ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Products', value: summary.total, color: 'text-navy-700',    bg: 'bg-navy-50',    border: 'border-navy-100'    },
            { label: 'Good Stock',     value: summary.good,  color: 'text-green-700',   bg: 'bg-green-50',   border: 'border-green-100'   },
            { label: 'Low Stock',      value: summary.low,   color: 'text-yellow-700',  bg: 'bg-yellow-50',  border: 'border-yellow-100'  },
            { label: 'Out of Stock',   value: summary.out,   color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-100'     },
          ].map(card => (
            <div key={card.label} className={`${card.bg} border ${card.border} rounded-2xl p-4`}>
              <p className="text-xs text-gray-500 font-medium mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* ── Search & Filter ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition cursor-pointer text-gray-700"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={15} />
          </div>
        </div>

        {/* ── Products Table ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-bold text-navy-800">Products ({filtered.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Product ID</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-center">Opening</th>
                  <th className="px-4 py-3 text-center">Consumed</th>
                  <th className="px-4 py-3 text-center">Closing</th>
                  <th className="px-4 py-3 text-center">Min Stock</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-1 bg-navy-50 text-navy-600 rounded-full font-medium">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{p.openingStock} <span className="text-xs text-gray-400">{p.unit}</span></td>
                    <td className="px-4 py-3 text-center text-red-500 font-medium">{p.consumed}</td>
                    <td className={`px-4 py-3 text-center font-bold ${p.closing <= 0 ? 'text-red-600' : p.closing <= p.minStock ? 'text-yellow-600' : 'text-green-600'}`}>
                      {p.closing}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">{p.minStock}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${p.status.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.status.dot}`} />
                        {p.status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-700">₹{p.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setAddStockProduct(p)}
                          title="Add Stock"
                          className="px-2.5 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-medium transition flex items-center gap-1"
                        >
                          <FiPlus size={12} /> Stock
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          title="Edit"
                          className="px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-medium transition flex items-center gap-1"
                        >
                          <FiEdit2 size={12} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-gray-400 text-sm">
                      <FiPackage size={32} className="mx-auto mb-3 opacity-30" />
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Today's Consumption ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <FiTrendingDown className="text-red-500" size={18} />
            <h3 className="font-bold text-navy-800">Today's Consumption</h3>
            <span className="ml-auto text-xs text-gray-400">{format(new Date(), 'dd MMM yyyy')}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Member</th>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-center">Qty</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_CONSUMPTION.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{c.memberName}</p>
                      <p className="text-xs text-gray-400">{c.memberId}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.product}</td>
                    <td className="px-4 py-3 text-center font-bold text-red-500">{c.qty}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{format(new Date(c.date), 'dd MMM yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
