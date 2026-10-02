import React, { useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import { FiDatabase, FiDownload, FiPrinter, FiFileText, FiCheck, FiUpload, FiSave } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

function downloadFile(content: BlobPart, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function rowsFor(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value as Record<string, unknown>[];
  if (value && typeof value === 'object') return Object.entries(value).map(([key, entry]) => ({ key, value: entry }));
  return [];
}

function csvValue(value: unknown) {
  const text = value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

export default function DataBackup() {
  const {
    members, products, payments, attendance, leads, expenses, purchases,
    stockAdjustments, auditLogs, usersList, guests, whatsappMessages,
    dailyClosing, refillReminders, memberLedgers, createBackup, restoreBackup,
  } = useApp();
  const fileInput = useRef<HTMLInputElement>(null);
  const [lastBackup, setLastBackup] = useState(() => localStorage.getItem('urja_backup_at') || 'Not created yet');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const reports: Record<string, unknown> = {
    Ledger: Object.entries(memberLedgers).flatMap(([memberId, entries]) => (Array.isArray(entries) ? entries : []).map((entry: Record<string, unknown>) => ({ memberId, ...entry }))),
    Sales: payments,
    Inventory: products,
    Attendance: attendance,
    'Daily Closing': dailyClosing,
    Refill: refillReminders,
    Members: members,
    Leads: leads,
    Purchases: purchases,
    Expenses: expenses,
    'Stock Adjustments': stockAdjustments,
    'Audit Log': auditLogs,
    Users: usersList,
    Guests: guests,
    WhatsApp: whatsappMessages,
  };

  const setNotice = (message: string, isError = false) => {
    setSuccessMsg(isError ? '' : message);
    setErrorMsg(isError ? message : '');
  };

  const saveLocalSnapshot = () => {
    try {
      localStorage.setItem('urja_demo_snapshot', JSON.stringify(createBackup()));
      const savedAt = new Date().toLocaleString();
      localStorage.setItem('urja_backup_at', savedAt);
      setLastBackup(savedAt);
      setNotice('A complete snapshot has been saved in this browser.');
    } catch {
      setNotice('The browser could not save a snapshot. Download the JSON backup instead.', true);
    }
  };

  const downloadJSONBackup = () => {
    downloadFile(JSON.stringify(createBackup(), null, 2), `URJA_Wellness_Backup_${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
    setNotice('Complete JSON backup downloaded.');
  };

  const restoreJSONBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    try {
      restoreBackup(JSON.parse(await file.text()));
      setNotice('Backup restored. The updated data is now saved in this browser.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to restore this backup file.', true);
    } finally {
      input.value = '';
    }
  };

  const exportCSV = (moduleName: string) => {
    const rows = rowsFor(reports[moduleName]);
    if (!rows.length) {
      setNotice(`There are no ${moduleName.toLowerCase()} records to export.`, true);
      return;
    }
    const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
    const csv = [columns.map(csvValue).join(','), ...rows.map(row => columns.map(column => csvValue(row[column])).join(','))].join('\r\n');
    downloadFile(`\uFEFF${csv}`, `URJA_${moduleName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8');
    setNotice(`${moduleName} CSV downloaded.`);
  };

  const exportPDF = (moduleName: string) => {
    const rows = rowsFor(reports[moduleName]);
    if (!rows.length) {
      setNotice(`There are no ${moduleName.toLowerCase()} records to export.`, true);
      return;
    }
    const pdf = new jsPDF();
    pdf.setTextColor(18, 61, 45);
    pdf.setFontSize(18);
    pdf.text(`URJA Wellness Club | ${moduleName}`, 18, 22);
    pdf.setFontSize(9);
    pdf.setTextColor(90, 105, 96);
    pdf.text(`Generated ${new Date().toLocaleString()} | ${rows.length} records`, 18, 30);
    pdf.setDrawColor(34, 153, 90);
    pdf.line(18, 35, 192, 35);
    let y = 44;
    rows.forEach((row, index) => {
      const line = Object.entries(row).map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : String(value ?? '')}`).join(' | ');
      const wrapped = pdf.splitTextToSize(`${index + 1}. ${line}`, 174);
      if (y + wrapped.length * 5 > 276) {
        pdf.addPage();
        y = 20;
      }
      pdf.setTextColor(39, 56, 47);
      pdf.text(wrapped, 18, y);
      y += wrapped.length * 5 + 3;
    });
    pdf.save(`URJA_${moduleName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
    setNotice(`${moduleName} PDF downloaded.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Data Backup, Export & Printing Center</h1>
        <p className="text-sm text-muted-foreground">Download, restore, and print the data stored by this demo.</p>
      </div>

      {successMsg && (
        <div role="status" className="p-4 bg-primary-50 border border-primary-200 text-primary-800 rounded-lg font-semibold text-sm flex items-center gap-2">
          <FiCheck size={20} /> {successMsg}
        </div>
      )}
      {errorMsg && <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg font-semibold text-sm">{errorMsg}</div>}

      {/* Local and downloadable backup options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="card space-y-4 border-t-2 border-t-primary-600">
          <div className="flex items-center justify-between">
            <h3 className="section-title flex items-center gap-2 mb-0">
              <FiSave className="text-primary-700" /> Browser Snapshot
            </h3>
            <span className="text-xs bg-primary-100 text-primary-800 font-bold px-2.5 py-1 rounded-full">LOCAL</span>
          </div>

          <p className="text-sm text-muted-foreground">
            This demo stores data in this browser only. A snapshot does not sync to a cloud service or another device.
          </p>

          <div className="p-3 bg-muted/50 rounded-md border border-border text-sm">
            <div className="text-muted-foreground">Last local snapshot</div>
            <div className="font-semibold text-foreground">{lastBackup}</div>
          </div>

          <button onClick={saveLocalSnapshot} className="btn-primary w-full justify-center">
            <FiSave /> Save Local Snapshot
          </button>
        </div>

        <div className="card space-y-4 border-t-2 border-t-primary-600">
          <div className="flex items-center justify-between">
            <h3 className="section-title flex items-center gap-2 mb-0">
              <FiDatabase className="text-primary-700" /> Full Data Backup
            </h3>
            <span className="text-xs bg-secondary text-secondary-foreground font-bold px-2.5 py-1 rounded-full">JSON</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Includes members, visits, leads, payments, inventory, reminders, ledgers, users, and audit history.
          </p>

          <div className="flex flex-wrap gap-2">
            <button onClick={downloadJSONBackup} className="btn-primary flex-1 justify-center"><FiDownload /> Download Backup</button>
            <button onClick={() => fileInput.current?.click()} className="btn-outline flex-1 justify-center"><FiUpload /> Restore Backup</button>
            <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={restoreJSONBackup} aria-label="Choose URJA JSON backup" />
          </div>
          <div className="text-xs text-muted-foreground">{members.length} members · {products.length} products · {payments.length} payments · {attendance.length} visits</div>
        </div>
      </div>

      {/* Export Reports & Printing System (Section 30) */}
      <div className="card space-y-4">
        <div>
          <h3 className="section-title flex items-center gap-2 mb-1">
            <FiPrinter className="text-primary-700" /> Report Export
          </h3>
          <p className="text-sm text-muted-foreground">Create CSV files for spreadsheets or printable PDF summaries from current demo records.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Member Ledger Statement', module: 'Ledger' },
            { title: 'Sales & Revenue Report', module: 'Sales' },
            { title: 'Stock & Inventory Report', module: 'Inventory' },
            { title: 'Attendance Summary', module: 'Attendance' },
            { title: 'Daily Closing Summary', module: 'Daily Closing' },
            { title: 'Refill Due Report', module: 'Refill' },
          ].map(r => (
            <div key={r.title} className="p-4 bg-card rounded-md border border-border space-y-3">
              <div className="font-semibold text-sm text-foreground">{r.title}</div>
              <div className="flex gap-2">
                <button onClick={() => exportCSV(r.module)} className="btn-outline py-1 px-2.5 text-xs flex-1 justify-center">
                  <FiFileText /> CSV
                </button>
                <button onClick={() => exportPDF(r.module)} className="btn-secondary py-1 px-2.5 text-xs flex-1 justify-center">
                  <FiPrinter /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <a className="btn-outline w-fit" href="/URJA_Wellness_Club_Requirements.pdf" download>
        <FiDownload /> Download Client Requirements PDF
      </a>
    </div>
  );
}
