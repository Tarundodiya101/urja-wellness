import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiX, FiUser, FiPhone, FiCalendar, FiMapPin, FiCheckCircle, FiFileText, FiCreditCard, FiBook, FiPackage, FiBell, FiTrendingUp } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { PACKAGES, COACHES, PROGRAM_TYPES, BATCH_TIMES } from '../data/mockData';
import Badge from '../components/shared/Badge';
import Modal from '../components/shared/Modal';
import { Button, Input, Select } from '../components/ui/fields';

const EMPTY_MEMBER = {
  name: '', mobile: '', altMobile: '', dob: '', gender: 'Male',
  joiningDate: new Date().toISOString().split('T')[0], address: '', area: 'Vesu, Surat',
  coach: 'Priya Sharma', coachId: 'C001', batchTime: '07:00 AM - 08:00 AM', programType: 'Weight Loss',
  referralPerson: '', notes: '', photo: null, packageId: 'P2', package: 'Standard 3 Month Plan',
  startDate: new Date().toISOString().split('T')[0], expiryDate: '', totalDays: 90, amount: 6000,
  paid: 6000, pending: 0, dueDate: '', paymentMode: 'Cash', receiptNo: '', status: 'Active',
  weight: 75, targetWeight: 65,
};

function MemberAvatar({ name, size = 'md' }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const colors = ['bg-emerald-600', 'bg-navy-600', 'bg-purple-600', 'bg-orange-500', 'bg-teal-600'];
  const colorIdx = name ? name.charCodeAt(0) % colors.length : 0;
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : size === 'lg' ? 'w-16 h-16 text-2xl' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sz} ${colors[colorIdx]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md`}>
      {initials}
    </div>
  );
}

export default function Members() {
  const { members, addMember, updateMember, deleteMember, payments, attendance, memberLedgers, refillReminders } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCoach, setFilterCoach] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewMember, setViewMember] = useState(null);
  const [activeTab, setActiveTab] = useState(1);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.name?.toLowerCase().includes(q) || m.id?.toLowerCase().includes(q) || m.mobile?.includes(q) || m.coach?.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'All' || m.status === filterStatus;
    const matchCoach = filterCoach === 'All' || m.coach === filterCoach;
    return matchSearch && matchStatus && matchCoach;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const openAdd = () => { setForm({ ...EMPTY_MEMBER }); setEditingMember(null); setShowModal(true); };
  const openEdit = (m) => { setForm({ ...m }); setEditingMember(m); setShowModal(true); };
  const openView = (m) => { setViewMember(m); setActiveTab(1); setShowViewModal(true); };

  const handlePackageChange = (pkgId) => {
    const pkg = PACKAGES.find(p => p.id === pkgId);
    if (!pkg) return;
    const start = form.startDate || new Date().toISOString().split('T')[0];
    const expiry = new Date(start);
    expiry.setDate(expiry.getDate() + pkg.days);
    setForm(f => ({
      ...f, packageId: pkgId, package: pkg.name, totalDays: pkg.days,
      amount: pkg.amount, pending: Math.max(0, pkg.amount - (f.paid || 0)),
      expiryDate: expiry.toISOString().split('T')[0],
    }));
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) return alert('Name and mobile are required');
    const pending = Math.max(0, (Number(form.amount) || 0) - (Number(form.paid) || 0));
    const data = { ...form, pending };
    if (editingMember) { updateMember(editingMember.id, data); }
    else { addMember(data); }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this member?')) deleteMember(id);
  };

  const memberPayments = (id) => payments.filter(p => p.memberId === id);
  const memberAttendance = (id) => attendance.filter(a => a.memberId === id);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Member Master & Profiles</h1>
          <p className="text-sm text-gray-500">Register members, view 8 profile tabs & track program progress</p>
        </div>
        <Button onClick={openAdd} className="btn-primary"><FiPlus /> Add New Member</Button>
      </div>

      {/* Summary Pills */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total Members', val: members.length, cls: 'bg-gray-100 text-gray-700' },
          { label: 'Active', val: members.filter(m => m.status === 'Active').length, cls: 'bg-emerald-100 text-emerald-800' },
          { label: 'Expired', val: members.filter(m => m.status === 'Expired').length, cls: 'bg-red-100 text-red-700' },
          { label: 'Pending Dues', val: members.filter(m => m.pending > 0).length, cls: 'bg-orange-100 text-orange-800' },
        ].map(s => (
          <div key={s.label} className={`${s.cls} px-4 py-1.5 rounded-full text-sm font-bold`}>
            {s.label}: {s.val}
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="card">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9" placeholder="Search by name, ID, mobile, coach..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <select className="input-field w-40" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Trial">Trial</option>
            <option value="Hold">Hold</option>
          </select>
          <select className="input-field w-44" value={filterCoach} onChange={e => setFilterCoach(e.target.value)}>
            <option value="All">All Coaches</option>
            {COACHES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-head">
                {['Member', 'Mobile', 'Program & Package', 'Coach', 'Batch', 'Paid / Pending', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(m => (
                <tr key={m.id} className="table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <MemberAvatar name={m.name} size="sm" />
                      <div>
                        <div className="font-bold text-navy-900">{m.name}</div>
                        <div className="text-xs text-gray-400">{m.id} • {m.area}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.mobile}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-emerald-800 text-xs">{m.programType}</div>
                    <div className="text-[11px] text-gray-400">{m.package}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{m.coach}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{m.batchTime}</td>
                  <td className="px-4 py-3">
                    <span className="text-emerald-700 font-bold">₹{m.paid?.toLocaleString()}</span>
                    {m.pending > 0 && <div className="text-rose-600 font-bold text-xs">Due: ₹{m.pending?.toLocaleString()}</div>}
                  </td>
                  <td className="px-4 py-3"><Badge status={m.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openView(m)} className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-lg" title="View 8-Tab Profile"><FiEye size={16} /></button>
                      <button onClick={() => openEdit(m)} className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg" title="Edit"><FiEdit2 size={16} /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg" title="Delete"><FiTrash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingMember ? 'Edit Member Master' : 'Add New Member Master'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Full Name *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Mobile Number *</label>
              <Input value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
            </div>
            <div>
              <label className="label">Alternate Mobile</label>
              <Input value={form.altMobile} onChange={e => setForm({ ...form, altMobile: e.target.value })} />
            </div>
            <div>
              <label className="label">Gender</label>
              <Select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </div>
            <div>
              <label className="label">Date of Birth</label>
              <input type="date" className="input-field" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
            </div>
            <div>
              <label className="label">Joining Date</label>
              <input type="date" className="input-field" value={form.joiningDate} onChange={e => setForm({ ...form, joiningDate: e.target.value })} />
            </div>
            <div>
              <label className="label">Area / Location</label>
              <input className="input-field" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
            </div>
            <div>
              <label className="label">Program Type</label>
              <select className="input-field" value={form.programType} onChange={e => setForm({ ...form, programType: e.target.value })}>
                {PROGRAM_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Batch Time</label>
              <select className="input-field" value={form.batchTime} onChange={e => setForm({ ...form, batchTime: e.target.value })}>
                {BATCH_TIMES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Package</label>
              <select className="input-field" value={form.packageId} onChange={e => handlePackageChange(e.target.value)}>
                {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.amount})</option>)}
              </select>
            </div>
            <div>
              <label className="label">Coach Assignment</label>
              <select className="input-field" value={form.coach} onChange={e => setForm({ ...form, coach: e.target.value })}>
                {COACHES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Referral Person</label>
              <input className="input-field" value={form.referralPerson} onChange={e => setForm({ ...form, referralPerson: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
            <div>
              <label className="label">Package Fee (₹)</label>
              <input type="number" className="input-field" value={form.amount} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Paid Amount (₹)</label>
              <input type="number" className="input-field" value={form.paid} onChange={e => setForm({ ...form, paid: Number(e.target.value) })} />
            </div>
            <div>
              <label className="label">Pending Balance (₹)</label>
              <div className="text-xl font-bold text-rose-600 mt-2">
                ₹{Math.max(0, (Number(form.amount)||0) - (Number(form.paid)||0)).toLocaleString()}
              </div>
            </div>
          </div>

          <button onClick={handleSave} className="btn-primary w-full justify-center py-3 text-base">
            SAVE MEMBER MASTER
          </button>
        </div>
      </Modal>

      {/* SPECIFICATION SECTION 4: MEMBER PROFILE SCREEN WITH 8 TABS */}
      {viewMember && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title={`Member Profile — ${viewMember.name}`} size="xl">
          <div className="space-y-4">
            {/* Top Summary Header */}
            <div className="p-4 bg-gradient-to-r from-navy-900 to-emerald-900 text-white rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <MemberAvatar name={viewMember.name} size="lg" />
                <div>
                  <h2 className="text-xl font-black">{viewMember.name}</h2>
                  <div className="text-xs text-emerald-300">ID: {viewMember.id} • Mobile: {viewMember.mobile}</div>
                  <div className="text-xs text-gray-300">Coach: {viewMember.coach} | Batch: {viewMember.batchTime}</div>
                </div>
              </div>
              <div className="text-right">
                <Badge status={viewMember.status} />
                <div className="text-xs text-gray-300 mt-1">Outstanding Balance</div>
                <div className={`text-xl font-black ${viewMember.pending > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  ₹{(viewMember.pending || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Quick Information Cards */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-gray-50 p-2 rounded-xl border">
                <div className="text-gray-400">Total Visits</div>
                <div className="font-bold text-navy-900 text-sm">{viewMember.visitsCount || 0} Visits</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl border">
                <div className="text-gray-400">Last Purchase</div>
                <div className="font-bold text-emerald-800 text-sm">{viewMember.lastPurchaseDate || '01/09/2025'}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl border">
                <div className="text-gray-400">Next Refill Date</div>
                <div className="font-bold text-orange-600 text-sm">{viewMember.nextRefillDate || '05/10/2025'}</div>
              </div>
              <div className="bg-gray-50 p-2 rounded-xl border">
                <div className="text-gray-400">Active Program</div>
                <div className="font-bold text-emerald-700 text-sm">{viewMember.programType}</div>
              </div>
            </div>

            {/* 8 Specification Tabs */}
            <div className="flex border-b border-gray-200 overflow-x-auto text-xs font-bold gap-1">
              {[
                { id: 1, label: '1. Attendance' },
                { id: 2, label: '2. Sales History' },
                { id: 3, label: '3. Payment History' },
                { id: 4, label: '4. Ledger' },
                { id: 5, label: '5. Product History' },
                { id: 6, label: '6. Refill Reminder' },
                { id: 7, label: '7. Notes' },
                { id: 8, label: '8. Progress' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === t.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-48 text-xs">
              {activeTab === 1 && (
                <div className="space-y-2">
                  <div className="font-bold text-navy-900">Attendance Log</div>
                  {memberAttendance(viewMember.id).map(a => (
                    <div key={a.id} className="p-2.5 bg-gray-50 rounded-xl flex justify-between">
                      <div><span className="font-bold">{a.date}</span> ({a.time || '07:42 AM'})</div>
                      <div className="text-emerald-700 font-semibold">{a.shake} (x{a.shakeCount})</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-2">
                  <div className="font-bold text-navy-900">Sales History</div>
                  <div className="p-3 bg-gray-50 rounded-xl border flex justify-between">
                    <div>INV-1025 • Formula 1 Shake (Vanilla) + Aloe Vera</div>
                    <div className="font-bold text-emerald-800">₹4,000</div>
                  </div>
                </div>
              )}

              {activeTab === 3 && (
                <div className="space-y-2">
                  <div className="font-bold text-navy-900">Payment Collection History</div>
                  {memberPayments(viewMember.id).map(p => (
                    <div key={p.id} className="p-3 bg-gray-50 rounded-xl border flex justify-between">
                      <div>Receipt #{p.receiptNo} • Mode: {p.mode}</div>
                      <div className="font-bold text-emerald-700">₹{p.amount?.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 4 && (
                <div className="space-y-2">
                  <div className="font-bold text-navy-900">Account Ledger (Debit / Credit)</div>
                  {(memberLedgers[viewMember.id] || []).map((l, i) => (
                    <div key={i} className="p-2.5 bg-gray-50 rounded-xl border flex justify-between">
                      <div>{l.date} • {l.particular}</div>
                      <div className="font-mono font-bold">Dr: ₹{l.debit} | Cr: ₹{l.credit} | Bal: ₹{l.balance}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 5 && (
                <div className="space-y-2">
                  <div className="font-bold text-navy-900">Product Consumption History</div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    • Formula 1 Shake (Vanilla) — Purchased 01/09/2025<br/>
                    • Personalized Protein Powder — Purchased 15/09/2025
                  </div>
                </div>
              )}

              {activeTab === 6 && (
                <div className="space-y-2">
                  <div className="font-bold text-navy-900">Refill Reminder Status</div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-900">
                    🔔 Formula 1 Shake Refill due in 4 days (Expected Finish: 05/10/2025).
                  </div>
                </div>
              )}

              {activeTab === 7 && (
                <div className="space-y-2">
                  <div className="font-bold text-navy-900">Coach Notes & Goals</div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {viewMember.notes || 'Target weight loss of 10kg over 3 months. Low carb diet recommended.'}
                  </div>
                </div>
              )}

              {activeTab === 8 && (
                <div className="space-y-2">
                  <div className="font-bold text-navy-900">Weight & Fitness Progress Tracker</div>
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 font-bold flex justify-between">
                    <div>Current Weight: {viewMember.weight} kg</div>
                    <div>Target Weight: {viewMember.targetWeight} kg</div>
                    <div className="text-emerald-700">Progress: 4 kg Lost! 🎉</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
