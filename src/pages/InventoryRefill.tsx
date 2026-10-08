import React, { useState } from 'react';
import { FiPackage, FiPlus, FiAlertTriangle, FiRefreshCw, FiTruck } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Badge from '../components/shared/Badge';

export default function InventoryRefill() {
  const { products, setProducts } = useApp();
  const [showStockInModal, setShowStockInModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [addQty, setAddQty] = useState(10);

  const handleStockIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setProducts((prev: any[]) => prev.map(p => {
      if (p.id === selectedProduct.id) {
        const newClosing = p.currentStock + Number(addQty);
        return {
          ...p,
          currentStock: newClosing,
          status: newClosing <= p.minStock ? 'Low Stock' : 'Good Stock'
        };
      }
      return p;
    }));

    setShowStockInModal(false);
    alert(`Added ${addQty} units of ${selectedProduct.name}! Updated Closing Stock: ${selectedProduct.currentStock + addQty}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Product Stock & Refill Management</h1>
          <p className="text-sm text-gray-500">Master Sections 15 & 16: Stock Formula (Opening + Stock In - Stock Out = Closing Stock) & Low Stock Alerts</p>
        </div>
        <button onClick={() => { setSelectedProduct(products[0]); setShowStockInModal(true); }} className="btn-primary">
          <FiPlus /> Record Stock In (Purchase Inward)
        </button>
      </div>

      {/* Stock Summary Formula Box */}
      <div className="card bg-gradient-to-r from-navy-900 to-emerald-900 text-white p-5 space-y-2">
        <div className="font-bold text-base flex items-center gap-2">
          <FiPackage className="text-emerald-400" /> MASTER STOCK FORMULA (Specification Section 15)
        </div>
        <div className="p-3 bg-white/10 rounded-xl font-mono text-xs font-bold flex justify-between items-center">
          <span>Opening Stock</span>
          <span>+</span>
          <span>Stock In (Purchases)</span>
          <span>−</span>
          <span>Stock Out (Sales/Center Use)</span>
          <span>=</span>
          <span className="text-emerald-300 font-extrabold text-sm">Closing Stock Balance</span>
        </div>
      </div>

      {/* Product Inventory Table */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-navy-900 text-sm flex items-center justify-between">
          <span>Product Inventory & Stock Status ({products.length} Products)</span>
          <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-0.5 rounded-full">
            Low Stock Alerts Active ️
          </span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="table-head">
              <th className="px-4 py-3 text-left">Code & Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Opening</th>
              <th className="px-4 py-3 text-right">Stock In</th>
              <th className="px-4 py-3 text-right">Stock Out</th>
              <th className="px-4 py-3 text-right">Closing Stock</th>
              <th className="px-4 py-3 text-left">Min Stock</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p: any) => {
              const stockIn = 10;
              const stockOut = (p.openingStock + stockIn) - p.currentStock;
              return (
                <tr key={p.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="font-bold text-navy-900">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.id} • Barcode: {p.barcode}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-emerald-800">{p.category}</td>
                  <td className="px-4 py-3 text-right font-mono">{p.openingStock}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-700">+{stockIn}</td>
                  <td className="px-4 py-3 text-right font-mono text-rose-600">-{Math.max(0, stockOut)}</td>
                  <td className="px-4 py-3 text-right font-black text-navy-900 text-base">{p.currentStock} {p.unit}</td>
                  <td className="px-4 py-3 text-gray-500 font-semibold">{p.minStock} {p.unit}</td>
                  <td className="px-4 py-3"><Badge status={p.status} /></td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => { setSelectedProduct(p); setShowStockInModal(true); }}
                      className="btn-outline py-1 px-2.5 text-xs"
                    >
                      + Stock In
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Stock In Modal */}
      {showStockInModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 animate-fade-in">
            <h3 className="font-bold text-navy-900 text-lg">Stock In Entry — {selectedProduct.name}</h3>
            <form onSubmit={handleStockIn} className="space-y-4 text-xs">
              <div>
                <label className="label text-[10px]">Supplier Name</label>
                <input className="input-field" defaultValue={selectedProduct.supplier || 'HerbaLife India Ltd'} />
              </div>

              <div>
                <label className="label text-[10px]">Quantity Stock In (+)</label>
                <input type="number" min="1" className="input-field text-base font-bold" value={addQty} onChange={e => setAddQty(Number(e.target.value))} required />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>New Updated Closing Stock Balance:</span>
                  <span className="text-emerald-700 font-black text-base">{selectedProduct.currentStock + addQty} {selectedProduct.unit}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowStockInModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Update Stock Balance</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
