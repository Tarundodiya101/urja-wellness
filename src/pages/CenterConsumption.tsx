import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { FiCheck, FiCoffee, FiPlus, FiSearch, FiSave } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function CenterConsumption() {
  const { members, attendance, markAttendance, products } = useApp();
  const [selectedMember, setSelectedMember] = useState(null);
  const [search, setSearch] = useState('');
  const [shakeCount, setShakeCount] = useState(1);
  const [shakeFlavor, setShakeFlavor] = useState('Formula 1 Shake (Vanilla)');
  const [proteinScoops, setProteinScoops] = useState(1);
  const [tea, setTea] = useState(true);
  const [aloe, setAloe] = useState(true);
  const [fiber, setFiber] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const matchedMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile.includes(search)
  );

  const handleSaveConsumption = (e) => {
    e.preventDefault();
    if (!selectedMember) return alert('Please select a member first');

    markAttendance({
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      date: new Date().toISOString().split('T')[0],
      shake: shakeFlavor,
      shakeCount,
      tea,
      aloe,
      protein: proteinScoops > 0,
      fiber,
      remarks: remarks || `Consumption: ${shakeFlavor} x${shakeCount}, Protein x${proteinScoops}, Tea: ${tea?'Yes':'No'}, Aloe: ${aloe?'Yes':'No'}`
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Daily Shake & Center Consumption</h1>
          <p className="text-sm text-gray-500">Record member shake, tea, aloe, protein, fiber & deduct inventory automatically</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
          Auto Inventory Connected 
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Member Selection */}
        <div className="card space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <FiSearch className="text-emerald-600" /> 1. Select Member
          </h3>
          <input
            className="input-field"
            placeholder="Search Member Name, ID, or Mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto border border-gray-100 rounded-xl">
            {matchedMembers.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMember(m)}
                className={`p-3 cursor-pointer flex items-center justify-between transition-colors ${
                  selectedMember?.id === m.id ? 'bg-emerald-50 border-l-4 border-emerald-600' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-navy-900">{m.name}</div>
                  <div className="text-xs text-gray-400">{m.id} • {m.mobile}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-emerald-700">{m.programType}</div>
                  <div className="text-[11px] text-gray-500">Due: ₹{m.pending}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedMember && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1">
              <div className="font-bold text-emerald-900 text-sm">{selectedMember.name} Selected</div>
              <div className="text-emerald-700">ID: {selectedMember.id} | Batch: {selectedMember.batchTime}</div>
              <div className="text-emerald-700">Coach: {selectedMember.coach} | Visits: {selectedMember.visitsCount}</div>
            </div>
          )}
        </div>

        {/* Middle Col: Consumption Form */}
        <div className="card lg:col-span-2 space-y-5">
          <h3 className="section-title flex items-center gap-2">
            <FiCoffee className="text-emerald-600" /> 2. Consumption Items Entry
          </h3>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
              <FiCheck size={18} /> Consumption record saved & inventory updated successfully!
            </div>
          )}

          <form onSubmit={handleSaveConsumption} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Shake Flavor</label>
                <Select className="input-field" value={shakeFlavor} onChange={e => setShakeFlavor(e.target.value)}>
                  <option value="Formula 1 Shake (Vanilla)">Formula 1 Shake (Vanilla)</option>
                  <option value="Formula 1 Shake (Chocolate)">Formula 1 Shake (Chocolate)</option>
                  <option value="Formula 1 Shake (Mango)">Formula 1 Shake (Mango)</option>
                  <option value="Dinoshake Chocolate (Kids)">Dinoshake Chocolate (Kids)</option>
                </Select>
              </div>

              <div>
                <label className="label">Shake Quantity (Count)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="input-field"
                  value={shakeCount}
                  onChange={e => setShakeCount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <label className="label">Herbal Tea</label>
                <button
                  type="button"
                  onClick={() => setTea(!tea)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tea ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {tea ? 'YES ' : 'NO '}
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <label className="label">Aloe Vera</label>
                <button
                  type="button"
                  onClick={() => setAloe(!aloe)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                    aloe ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {aloe ? 'YES ' : 'NO '}
                </button>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <label className="label">Protein Scoops</label>
                <div className="flex items-center justify-center gap-2">
                  <button type="button" onClick={() => setProteinScoops(Math.max(0, proteinScoops - 1))} className="w-7 h-7 rounded bg-gray-200 font-bold text-xs">-</button>
                  <span className="font-bold text-sm text-navy-900">{proteinScoops}</span>
                  <button type="button" onClick={() => setProteinScoops(proteinScoops + 1)} className="w-7 h-7 rounded bg-gray-200 font-bold text-xs">+</button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                <label className="label">Active Fiber</label>
                <button
                  type="button"
                  onClick={() => setFiber(!fiber)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                    fiber ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {fiber ? 'YES ' : 'NO '}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Remarks / Special Notes</label>
              <input
                className="input-field"
                placeholder="e.g. Extra ice, post-cardio session..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
              <FiSave size={18} /> SAVE CONSUMPTION & DEDUCT STOCK
            </button>
          </form>

          {/* Today's Consumption Summary */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Today's Total Consumption Served</h4>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <div className="text-lg font-bold text-emerald-800">18</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Shakes Served</div>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                <div className="text-lg font-bold text-blue-800">14</div>
                <div className="text-[10px] text-blue-600 font-semibold">Tea Served</div>
              </div>
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                <div className="text-lg font-bold text-purple-800">12</div>
                <div className="text-[10px] text-purple-600 font-semibold">Aloe Served</div>
              </div>
              <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100">
                <div className="text-lg font-bold text-orange-800">16</div>
                <div className="text-[10px] text-orange-600 font-semibold">Protein Scoops</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
