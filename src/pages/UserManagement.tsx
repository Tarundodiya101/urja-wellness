import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { FiPlus, FiShield, FiUserCheck, FiLock, FiSave } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import Modal from '../components/shared/Modal';

const ACCESS_MODULES = [
  { key: 'attendance', label: 'Attendance & Check-in' },
  { key: 'billing', label: 'Barcode Billing & Sales' },
  { key: 'payment', label: 'Payments & Collections' },
  { key: 'inventory', label: 'Stock & Inventory Control' },
  { key: 'purchaseRate', label: 'View Supplier Purchase Rates' },
  { key: 'profitReport', label: 'View Profit & Business Analytics' },
  { key: 'ledger', label: 'Member Ledger & Dues' },
  { key: 'settings', label: 'System Settings & Users' },
];

export default function UserManagement() {
  const { usersList, addUser } = useApp();
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('RECEPTION');
  const [access, setAccess] = useState({
    attendance: true, billing: true, payment: true, inventory: false,
    purchaseRate: false, profitReport: false, ledger: true, settings: false
  });

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === 'ADMIN') {
      setAccess({ attendance: true, billing: true, payment: true, inventory: true, purchaseRate: true, profitReport: true, ledger: true, settings: true });
    } else if (selectedRole === 'RECEPTION') {
      setAccess({ attendance: true, billing: true, payment: true, inventory: false, purchaseRate: false, profitReport: false, ledger: true, settings: false });
    } else if (selectedRole === 'STOCK MANAGER') {
      setAccess({ attendance: false, billing: false, payment: false, inventory: true, purchaseRate: true, profitReport: false, ledger: false, settings: false });
    } else if (selectedRole === 'ACCOUNT USER') {
      setAccess({ attendance: false, billing: true, payment: true, inventory: true, purchaseRate: true, profitReport: true, ledger: true, settings: false });
    } else if (selectedRole === 'COACH') {
      setAccess({ attendance: true, billing: true, payment: true, inventory: false, purchaseRate: false, profitReport: false, ledger: false, settings: false });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !username || !password) return alert('Name, username & password are required');

    addUser({ name, mobile, username, password, role, access });
    setShowModal(false);
    setName(''); setMobile(''); setUsername(''); setPassword('');
    alert(`User ${name} created successfully with ${role} permissions.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">User Security & Access Rights Matrix</h1>
          <p className="text-sm text-gray-500">Configure role-based access security so each user only sees authorized center modules</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <FiPlus /> Add New System User
        </button>
      </div>

      {/* Access Rights Overview Matrix */}
      <div className="card space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <FiShield className="text-emerald-600" /> System Role Permissions Matrix (Specification Section 27)
        </h3>

        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-navy-900 text-white font-bold uppercase">
                <th className="p-3">User Role</th>
                <th className="p-3">Attendance</th>
                <th className="p-3">Billing</th>
                <th className="p-3">Payments</th>
                <th className="p-3">Inventory</th>
                <th className="p-3">Purchase Rates</th>
                <th className="p-3">Profit Reports</th>
                <th className="p-3">Member Ledger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold">
              <tr className="bg-emerald-50/50">
                <td className="p-3 font-bold text-emerald-900">ADMIN</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-900">RECEPTION</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-emerald-700">Allowed</td>
              </tr>
              <tr className="bg-purple-50/50">
                <td className="p-3 font-bold text-purple-900">COACH</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-900">STOCK MANAGER</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-emerald-700">Allowed</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
                <td className="p-3 text-red-500">❌ Restricted</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Registered Users List */}
      <div className="card p-0 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-navy-900 text-sm">
          Active Center System Users ({usersList.length})
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="table-head">
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Username</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Security Rights</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(u => (
              <tr key={u.id} className="table-row">
                <td className="px-4 py-3 font-bold text-navy-900">{u.id}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{u.name}</td>
                <td className="px-4 py-3 text-gray-600">{u.mobile}</td>
                <td className="px-4 py-3 text-gray-600 font-mono text-xs">{u.username}</td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {Object.entries(u.access || {}).filter(([_, val]) => val).map(([k]) => k).join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Center User" size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name *</label>
              <input className="input-field" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <input className="input-field" placeholder="98250XXXXX" value={mobile} onChange={e => setMobile(e.target.value)} />
            </div>
            <div>
              <label className="label">Username *</label>
              <input className="input-field" placeholder="e.g. rahul_rec" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div>
              <label className="label">Password *</label>
              <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">Role Assignment *</label>
            <Select className="input-field" value={role} onChange={e => handleRoleChange(e.target.value)}>
              <option value="ADMIN">ADMIN (Full Access)</option>
              <option value="RECEPTION">RECEPTION (Attendance, Billing, Payments, Ledger)</option>
              <option value="COACH">COACH (Attendance & Client Tracking)</option>
              <option value="STOCK MANAGER">STOCK MANAGER (Inventory & Purchase Entry)</option>
              <option value="ACCOUNT USER">ACCOUNT USER (Ledger, Billing, Financial Reports)</option>
            </Select>
          </div>

          <div className="border border-gray-200 rounded-xl p-3 bg-gray-50 space-y-2">
            <h4 className="text-xs font-bold text-navy-900 uppercase">Module Access Permissions Checkboxes</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {ACCESS_MODULES.map(m => (
                <label key={m.key} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={access[m.key] || false}
                    onChange={e => setAccess({ ...access, [m.key]: e.target.checked })}
                    className="accent-emerald-600 rounded"
                  />
                  <span className="font-semibold text-gray-700">{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
            <FiSave size={18} /> SAVE NEW USER & GRANT PERMISSIONS
          </button>
        </form>
      </Modal>
    </div>
  );
}
