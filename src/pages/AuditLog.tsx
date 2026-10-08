import React from 'react';
import { FiActivity, FiClock, FiShield, FiUser } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function AuditLog() {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Audit & Activity Log</h1>
        <p className="text-sm text-gray-500">Track all sensitive user actions, bill edits, stock adjustments & security events in real-time</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div className="font-bold text-navy-900 text-sm flex items-center gap-2">
            <FiActivity className="text-emerald-600" /> System Audit Trail Records ({auditLogs.length})
          </div>
          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
            Real-time Immutable Log 
          </span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="table-head">
              <th className="px-4 py-3 text-left">Log ID</th>
              <th className="px-4 py-3 text-left">Date & Time</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Action Performed</th>
              <th className="px-4 py-3 text-left">Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map(log => (
              <tr key={log.id} className="table-row">
                <td className="px-4 py-3 font-mono font-bold text-gray-400 text-xs">{log.id}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">
                  <div className="font-semibold text-gray-800">{log.date}</div>
                  <div className="text-gray-400">{log.time}</div>
                </td>
                <td className="px-4 py-3 font-semibold text-navy-900 flex items-center gap-1.5">
                  <FiUser size={14} className="text-emerald-600" /> {log.user}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 font-bold text-xs">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 text-xs font-mono">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
