import React, { useState } from 'react';
import { FiCamera, FiPlus, FiArrowRight, FiCheck, FiDownload } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function PhotoManagement() {
  const { members, photos, addPhoto } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stage, setStage] = useState('Day 30 Progress');

  const member = members.find((m: any) => m.id === selectedMemberId) || members[0];
  const memberPhotosList = photos[member.id] || [];

  const baselinePhoto = memberPhotosList.find((p: any) => p.stage === 'Day 1 Baseline') || memberPhotosList[0];
  const currentPhoto = memberPhotosList[memberPhotosList.length - 1];

  const handleUploadPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    addPhoto(member.id, {
      date: new Date().toISOString().split('T')[0],
      stage,
      front: `📸 ${stage} Front View`,
      side: `📸 ${stage} Side View`,
      back: `📸 ${stage} Back View`
    });
    setShowUploadModal(false);
    alert(`Photos uploaded successfully for ${member.name} (${stage})!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Photo Management & Before/Current Comparison</h1>
          <p className="text-sm text-gray-500">Day-by-Day photo timeline storage (Day 1, 7, 14, 30, 60, 90) with side-by-side comparison</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="btn-primary">
          <FiPlus /> Upload New Progress Photos
        </button>
      </div>

      {/* Member Selector Bar */}
      <div className="card bg-gray-50 border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiCamera className="text-emerald-600 text-xl" />
          <span className="font-bold text-navy-900 text-sm">Select Member:</span>
          <select
            className="input-field w-64 bg-white"
            value={selectedMemberId}
            onChange={e => setSelectedMemberId(e.target.value)}
          >
            {members.map((m: any) => (
              <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
            ))}
          </select>
        </div>
        <div className="text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1 rounded-full">
          Total Photo Records: {memberPhotosList.length} Timeline Entries
        </div>
      </div>

      {/* BEFORE vs CURRENT Comparison Tool (Section 6 Specification) */}
      <div className="card space-y-4 border-2 border-emerald-500 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="section-title flex items-center gap-2 mb-0">
            <FiCamera className="text-emerald-600" /> BEFORE 📸 → CURRENT 📸 Transformation Comparison
          </h3>
          <button
            onClick={() => alert(`Generating Before/Current Transformation Comparison PDF for ${member.name}...`)}
            className="btn-outline py-1 px-3 text-xs"
          >
            <FiDownload /> Export Comparison Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          {/* BEFORE Photo Box */}
          <div className="space-y-2 text-center">
            <span className="px-3 py-1 rounded-full bg-navy-900 text-white font-bold text-xs">
              BEFORE — {baselinePhoto?.stage || 'Day 1 Baseline'} ({baselinePhoto?.date || '11/09/2025'})
            </span>
            <div className="aspect-video bg-navy-950 text-emerald-400 rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-500/50 shadow-inner">
              <FiCamera size={48} className="mb-2 opacity-80" />
              <div className="font-bold text-white text-base">{baselinePhoto?.front || 'Day 1 Front View'}</div>
              <div className="text-xs text-gray-400 mt-1">Weight: 78.0 kg • Waist: 38"</div>
            </div>
          </div>

          {/* CURRENT Photo Box */}
          <div className="space-y-2 text-center">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs">
              CURRENT — {currentPhoto?.stage || 'Day 30 Progress'} ({currentPhoto?.date || '01/10/2025'})
            </span>
            <div className="aspect-video bg-emerald-950 text-emerald-300 rounded-2xl flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-400 shadow-inner">
              <FiCamera size={48} className="mb-2 opacity-80" />
              <div className="font-bold text-white text-base">{currentPhoto?.front || 'Day 30 Front View'}</div>
              <div className="text-xs text-emerald-300 mt-1">Weight: 74.0 kg (-4.0 kg!) • Waist: 35.5" (-2.5")</div>
            </div>
          </div>
        </div>
      </div>

      {/* Date-wise Photo Timeline Storage (Section 6 & 22 Isolated Storage) */}
      <div className="card space-y-4">
        <h3 className="section-title">Date-wise Photo Timeline Storage (Folder: URJA → {member.id} → Photos)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memberPhotosList.map((p: any, idx: number) => (
            <div key={idx} className="p-4 bg-white rounded-2xl border border-gray-200 space-y-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-bold text-sm text-navy-900">{p.stage}</span>
                <span className="text-xs text-gray-500">{p.date}</span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-700 font-mono">
                <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Front View:</span>
                  <span className="font-bold text-emerald-700">{p.front}</span>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Side View:</span>
                  <span className="font-bold text-emerald-700">{p.side}</span>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span>Back View:</span>
                  <span className="font-bold text-emerald-700">{p.back}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 animate-fade-in">
            <h3 className="font-bold text-navy-900 text-lg">Upload Progress Photos for {member.name}</h3>
            <form onSubmit={handleUploadPhoto} className="space-y-3 text-xs">
              <div>
                <label className="label text-[10px]">Select Timeline Milestone</label>
                <select className="input-field" value={stage} onChange={e => setStage(e.target.value)}>
                  <option value="Day 7 Progress">Day 7 Progress Review</option>
                  <option value="Day 14 Progress">Day 14 Progress Review</option>
                  <option value="Day 30 Progress">Day 30 Progress Review</option>
                  <option value="Day 60 Progress">Day 60 Transformation</option>
                  <option value="Day 90 Transformation">Day 90 Final Transformation</option>
                </select>
              </div>

              <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl space-y-2 text-center">
                <div className="font-semibold text-gray-600">Select Angle Files (Front, Side, Back)</div>
                <input type="file" multiple className="text-xs text-gray-500" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Save to Member Folder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
