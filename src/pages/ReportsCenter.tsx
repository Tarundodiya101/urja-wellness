import { Select } from '../components/ui/fields';
import React, { useState } from 'react';
import { FiFileText, FiDownload, FiUpload, FiFolder, FiCheck, FiPrinter } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function ReportsCenter() {
  const { members, measurements, photos } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001');

  const member = members.find((m: any) => m.id === selectedMemberId) || members[0];

  const handleDownloadPDF = (reportType: string) => {
    alert(`Generating & downloading ${reportType} PDF for ${member.name} (${member.id})... Download started!`);
  };

  const handleExportExcel = (type: string) => {
    alert(`Exporting ${type} report as Excel (.xlsx)... Download started!`);
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Document uploaded successfully to folder: URJA → ${member.id} → Documents`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Reports, Download & Upload Center</h1>
          <p className="text-sm text-gray-500">Master Sections 19, 20, 21, 22: 1-Click URJA Wellness Reports, Download PDF/Excel, Upload Center & Member-wise Storage</p>
        </div>
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

      {/* Specification Section 19: 1-CLICK URJA WELLNESS REPORT */}
      <div className="card space-y-4 border-2 border-emerald-500 shadow-xl">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="section-title mb-0 flex items-center gap-2">
              <FiFileText className="text-emerald-600" /> 1-Click URJA WELLNESS REPORT — {member.name}
            </h3>
            <div className="text-xs text-gray-500">Comprehensive Transformation & Wellness Assessment Report</div>
          </div>
          <button onClick={() => handleDownloadPDF('URJA Wellness Complete Report')} className="btn-primary">
            <FiDownload /> Download Complete Report (PDF)
          </button>
        </div>

        {/* Report Preview */}
        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4 text-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-xl border">
            <div><span className="text-gray-400">Name:</span> <span className="font-bold text-navy-900">{member.name}</span></div>
            <div><span className="text-gray-400">ID:</span> <span className="font-bold text-navy-900">{member.id}</span></div>
            <div><span className="text-gray-400">Coach:</span> <span className="font-bold text-navy-900">{member.coach}</span></div>
            <div><span className="text-gray-400">Joining:</span> <span className="font-bold text-navy-900">{member.joiningDate}</span></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-xl border space-y-1">
              <div className="font-bold text-emerald-900 border-b pb-1">Body Measurements</div>
              <div>Weight: <span className="font-bold">78.0 kg → 74.0 kg (-4.0 kg)</span></div>
              <div>Body Fat: <span className="font-bold">26.5% → 23.8% (-2.7%)</span></div>
              <div>Waist: <span className="font-bold">38" → 35.5" (-2.5")</span></div>
            </div>

            <div className="p-3 bg-white rounded-xl border space-y-1">
              <div className="font-bold text-blue-900 border-b pb-1">Lifestyle & Habits</div>
              <div>Hydration: <span className="font-bold">3.5 Liters Daily (100%)</span></div>
              <div>Activity: <span className="font-bold">8,400 Steps / 75 Active mins</span></div>
              <div>Habit Score: <span className="font-bold text-emerald-600">8/8 Excellent</span></div>
            </div>

            <div className="p-3 bg-white rounded-xl border space-y-1">
              <div className="font-bold text-purple-900 border-b pb-1">Attendance & Progress</div>
              <div>Visits Count: <span className="font-bold">86 Sessions</span></div>
              <div>Attendance %: <span className="font-bold text-emerald-600">96.5% Regular</span></div>
              <div>30-Day Milestone: <span className="font-bold text-emerald-600">Completed </span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Specification Section 20: DOWNLOAD CENTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-3 border-l-4 border-blue-500">
          <h3 className="section-title flex items-center gap-2 mb-0">
            <FiDownload className="text-blue-600" /> PDF Report Download Center
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              'Today Report', 'Weekly Report', 'Monthly Report',
              '30-Day Report', '90-Day Report', 'Before/After Report',
              'Complete History', 'Payment Statement'
            ].map(r => (
              <button
                key={r}
                onClick={() => handleDownloadPDF(r)}
                className="btn-outline py-2 px-3 text-xs justify-center text-blue-800 border-blue-200 hover:bg-blue-50"
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Excel Downloads */}
        <div className="card space-y-3 border-l-4 border-emerald-500">
          <h3 className="section-title flex items-center gap-2 mb-0">
            <FiDownload className="text-emerald-600" /> Excel Export Center
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {['Member List', 'Attendance Summary', 'Payment Ledger', 'Stock Report', 'Follow-up List'].map(x => (
              <button
                key={x}
                onClick={() => handleExportExcel(x)}
                className="btn-secondary py-2 px-3 text-xs justify-center"
              >
                Export {x} (.xlsx)
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Specification Section 21 & 22: UPLOAD CENTER & ISOLATED STORAGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Center */}
        <div className="card space-y-3 border-l-4 border-purple-500">
          <h3 className="section-title flex items-center gap-2 mb-0">
            <FiUpload className="text-purple-600" /> Upload Center for {member.name}
          </h3>
          <form onSubmit={handleUploadDocument} className="space-y-3 text-xs">
            <div>
              <label className="label text-[10px]">Select Document Category</label>
              <Select className="input-field">
                <option value="Photo">Photo (Front/Side/Back)</option>
                <option value="Measurement">Measurement Report</option>
                <option value="Analysis">Body Analysis Report</option>
                <option value="FoodRecord">Food Record</option>
                <option value="DoctorNote">Doctor / Coach Note</option>
              </Select>
            </div>
            <input type="file" className="text-xs text-gray-500 bg-gray-50 p-2 rounded-xl border w-full" />
            <button type="submit" className="btn-primary w-full justify-center">Upload File to Member Folder</button>
          </form>
        </div>

        {/* Specification Section 22: Member-wise Storage Layout */}
        <div className="card space-y-3 border-l-4 border-navy-900">
          <h3 className="section-title flex items-center gap-2 mb-0">
            <FiFolder className="text-navy-900" /> Isolated Member Storage Layout
          </h3>
          <div className="p-3 bg-navy-950 text-emerald-400 font-mono text-xs rounded-xl space-y-1">
            <div className="font-bold text-white">URJA / Members /</div>
            <div className="pl-4">└── Member ID: {member.id} ({member.name})</div>
            <div className="pl-8 text-emerald-300">├── Profile & Program</div>
            <div className="pl-8 text-emerald-300">├── Day-by-Day Photos (Baseline, Day 7, 14, 30, 90)</div>
            <div className="pl-8 text-emerald-300">├── Body Measurements & BMI</div>
            <div className="pl-8 text-emerald-300">├── Nutrition & Daily Habit Score</div>
            <div className="pl-8 text-emerald-300">├── QR Attendance Log</div>
            <div className="pl-8 text-emerald-300">└── Payments & Reports</div>
          </div>
        </div>
      </div>
    </div>
  );
}
