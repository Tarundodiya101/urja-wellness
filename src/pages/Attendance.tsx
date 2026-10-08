import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { FiCheckSquare, FiSearch, FiSmartphone, FiCreditCard, FiCheckCircle, FiClock, FiCoffee, FiAlertTriangle, FiX } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Badge from '../components/shared/Badge';
import Modal from '../components/shared/Modal';

export default function Attendance() {
  const { members, attendance, markAttendance, todayAttendance } = useApp();
  const [search, setSearch] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  // Check-in Form state
  const [shake, setShake] = useState('Formula 1 Shake (Vanilla)');
  const [shakeCount, setShakeCount] = useState(1);
  const [tea, setTea] = useState(true);
  const [aloe, setAloe] = useState(true);
  const [protein, setProtein] = useState(false);
  const [fiber, setFiber] = useState(false);
  const [remarks, setRemarks] = useState('');

  // Welcome Popup Modal after scanning barcode or marking
  const [welcomeModal, setWelcomeModal] = useState(null);

  const matchedMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase()) ||
    m.mobile.includes(search) ||
    m.barcode?.includes(search)
  );

  const handleBarcodeScanSubmit = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const query = barcodeInput.trim().toLowerCase();
    const found = members.find(m =>
      (m.barcode && m.barcode.toLowerCase() === query) ||
      (m.id && m.id.toLowerCase() === query) ||
      m.mobile === query ||
      m.name.toLowerCase().includes(query)
    );

    if (!found) {
      alert(`No member found matching Barcode / QR / ID: ${barcodeInput}`);
      return;
    }

    // Mark attendance automatically
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    markAttendance({
      memberId: found.id,
      memberName: found.name,
      date: new Date().toISOString().split('T')[0],
      shake,
      shakeCount: 1,
      tea: true,
      aloe: true,
      protein: false,
      fiber: false,
      remarks: 'Barcode Scan Attendance'
    });

    // Show Specification Section 5 Barcode Scan Welcome Popup!
    setWelcomeModal({
      member: found,
      time: timeStr,
      todayShake: 1,
      outstanding: found.pending || 0,
      refillDaysLeft: 4
    });

    setBarcodeInput('');
  };

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (!selectedMember) return alert('Please select a member first');

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    markAttendance({
      memberId: selectedMember.id,
      memberName: selectedMember.name,
      date: new Date().toISOString().split('T')[0],
      shake,
      shakeCount,
      tea,
      aloe,
      protein,
      fiber,
      remarks
    });

    setWelcomeModal({
      member: selectedMember,
      time: timeStr,
      todayShake: shakeCount,
      outstanding: selectedMember.pending || 0,
      refillDaysLeft: 4
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Attendance & Barcode Check-in</h1>
          <p className="text-sm text-gray-500">Method 1: Search Name • Method 2: Mobile Number • Method 3: Barcode / QR Scan</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
            Present Today: {todayAttendance.length}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-navy-100 text-navy-800 font-bold text-xs">
            Total Members: {members.length}
          </span>
        </div>
      </div>

      {/* METHOD 3: BARCODE SCANNER BANNER (Specification Section 5) */}
      <div className="card bg-gradient-to-r from-navy-900 to-emerald-900 text-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-bold text-base flex items-center gap-2">
            <FiCreditCard className="text-emerald-400" /> METHOD 3: Barcode / QR Scanner Check-in
          </div>
          <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
            INSTANT AUTO CHECK-IN
          </span>
        </div>

        <form onSubmit={handleBarcodeScanSubmit} className="flex gap-3">
          <input
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Scan Barcode / QR Code (Try typing 890001 or URJA-00001 & press Enter)..."
            value={barcodeInput}
            onChange={e => setBarcodeInput(e.target.value)}
          />
          <button type="submit" className="btn-primary py-2.5 px-6 font-bold">
            Scan & Check-in
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Member Search List */}
        <div className="card space-y-4">
          <h3 className="section-title">Methods 1 & 2: Search Member</h3>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search by Name, Mobile, ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto border border-gray-100 rounded-xl">
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
                  <div className="text-xs text-gray-500">{m.id} • {m.mobile}</div>
                </div>
                <div className="text-right">
                  <Badge status={m.status} />
                  <div className="text-[11px] text-red-500 font-semibold mt-1">Due: ₹{m.pending}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle/Right: Mark Attendance Form & Summary */}
        <div className="card lg:col-span-2 space-y-5">
          <h3 className="section-title">Attendance & Daily Center Consumption Entry</h3>

          {selectedMember ? (
            <form onSubmit={handleManualCheckIn} className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-emerald-900">{selectedMember.name}</div>
                  <div className="text-xs text-emerald-700">Member ID: {selectedMember.id} | Mobile: {selectedMember.mobile}</div>
                  <div className="text-xs text-emerald-700">Coach: {selectedMember.coach} | Batch: {selectedMember.batchTime}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Outstanding Balance</div>
                  <div className={`text-xl font-bold ${selectedMember.pending > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    ₹{selectedMember.pending?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Shake Flavor</label>
                  <Select className="input-field" value={shake} onChange={e => setShake(e.target.value)}>
                    <option value="Formula 1 Shake (Vanilla)">Formula 1 Shake (Vanilla)</option>
                    <option value="Formula 1 Shake (Chocolate)">Formula 1 Shake (Chocolate)</option>
                    <option value="Formula 1 Shake (Mango)">Formula 1 Shake (Mango)</option>
                    <option value="Personalized Protein Powder">Personalized Protein Powder</option>
                  </Select>
                </div>
                <div>
                  <label className="label">Shake Count</label>
                  <input type="number" min="1" max="3" className="input-field" value={shakeCount} onChange={e => setShakeCount(Number(e.target.value))} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="p-2.5 bg-gray-50 rounded-xl border">
                  <label className="label text-[10px]">Tea</label>
                  <button type="button" onClick={() => setTea(!tea)} className={`w-full py-1 text-xs font-bold rounded ${tea ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {tea ? 'YES' : 'NO'}
                  </button>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border">
                  <label className="label text-[10px]">Aloe</label>
                  <button type="button" onClick={() => setAloe(!aloe)} className={`w-full py-1 text-xs font-bold rounded ${aloe ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {aloe ? 'YES' : 'NO'}
                  </button>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border">
                  <label className="label text-[10px]">Protein</label>
                  <button type="button" onClick={() => setProtein(!protein)} className={`w-full py-1 text-xs font-bold rounded ${protein ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {protein ? 'YES' : 'NO'}
                  </button>
                </div>
                <div className="p-2.5 bg-gray-50 rounded-xl border">
                  <label className="label text-[10px]">Fiber</label>
                  <button type="button" onClick={() => setFiber(!fiber)} className={`w-full py-1 text-xs font-bold rounded ${fiber ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {fiber ? 'YES' : 'NO'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
                <FiCheckCircle size={18} /> MARK ATTENDANCE & SHAKE ENTRY
              </button>
            </form>
          ) : (
            <div className="p-12 text-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <FiCheckSquare size={36} className="mx-auto mb-2 text-gray-300" />
              <div>Select a member from the left or scan barcode above to mark attendance</div>
            </div>
          )}

          {/* Today's Attendance Table */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-navy-900 text-sm mb-3">Today's Check-in Log ({todayAttendance.length})</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold uppercase">
                    <th className="p-2">Member</th>
                    <th className="p-2">Time</th>
                    <th className="p-2">Shake</th>
                    <th className="p-2">Tea / Aloe / Protein</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAttendance.map(a => (
                    <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-2 font-bold text-navy-900">{a.memberName}</td>
                      <td className="p-2 text-gray-500">{a.time || '07:42 AM'}</td>
                      <td className="p-2 text-emerald-800 font-semibold">{a.shake} (x{a.shakeCount})</td>
                      <td className="p-2 text-gray-600">
                        {a.tea ? 'Tea ' : ''}{a.aloe ? 'Aloe ' : ''}{a.protein ? 'Protein ' : ''}
                      </td>
                      <td className="p-2"><Badge status="Present" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SPECIFICATION SECTION 5: BARCODE SCAN WELCOME POPUP MODAL */}
      {welcomeModal && (
        <Modal isOpen={true} onClose={() => setWelcomeModal(null)} title="Barcode Check-in Confirmation" size="md">
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black shadow-inner">
              
            </div>

            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Attendance Marked</div>
              <h2 className="text-2xl font-black text-navy-900 mt-1">WELCOME {welcomeModal.member.name.toUpperCase()}</h2>
              <div className="text-xs text-gray-500 mt-0.5">Check-in Time: <span className="font-bold text-gray-800">{welcomeModal.time}</span></div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-center">
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Today Shake</div>
                <div className="text-lg font-bold text-emerald-700">{welcomeModal.todayShake}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Outstanding</div>
                <div className={`text-lg font-bold ${welcomeModal.outstanding > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                  ₹{welcomeModal.outstanding.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Product Refill</div>
                <div className="text-lg font-bold text-orange-600">{welcomeModal.refillDaysLeft} Days Left</div>
              </div>
            </div>

            <button onClick={() => setWelcomeModal(null)} className="btn-primary w-full justify-center">
              Close Screen
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
