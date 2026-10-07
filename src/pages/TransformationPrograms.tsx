import React, { useState } from 'react';
import { FiAward, FiCheck, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function TransformationPrograms() {
  const { members } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('URJA-00001');

  const member = members.find((m: any) => m.id === selectedMemberId) || members[0];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">30-Day & 90-Day Transformation Programs</h1>
          <p className="text-sm text-gray-500">Master Sections 23 & 24: Structured 30-Day Foundation & 90-Day Lifestyle Transformation Roadmaps</p>
        </div>
        <select
          className="input-field w-64 bg-white font-bold"
          value={selectedMemberId}
          onChange={e => setSelectedMemberId(e.target.value)}
        >
          {members.map((m: any) => (
            <option key={m.id} value={m.id}>{m.name} ({m.id})</option>
          ))}
        </select>
      </div>

      {/* Specification Section 23: 30-DAY PROGRAM */}
      <div className="card space-y-4 border-l-4 border-emerald-500">
        <h3 className="section-title flex items-center gap-2 mb-0">
          <FiCalendar className="text-emerald-600" /> Master Section 23: 30-Day Wellness Program Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">WEEK 1</span>
            <div className="font-bold text-emerald-950 text-sm">FOUNDATION</div>
            <div className="text-emerald-800 font-semibold">• Food + Water + Sleep + Attendance</div>
            <div className="text-[11px] text-gray-600 pt-1">Establish daily 3.5L hydration & attendance consistency.</div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">WEEK 2</span>
            <div className="font-bold text-blue-950 text-sm">CONSISTENCY</div>
            <div className="text-blue-800 font-semibold">• Activity + Nutrition + Habits</div>
            <div className="text-[11px] text-gray-600 pt-1">Integrate 45-min daily movement & portion control.</div>
          </div>

          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold text-[10px]">WEEK 3</span>
            <div className="font-bold text-purple-950 text-sm">PROGRESS</div>
            <div className="text-purple-800 font-semibold">• Measurements + Activity + Food Awareness</div>
            <div className="text-[11px] text-gray-600 pt-1">Track body fat reduction & active exercise minutes.</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[10px]">WEEK 4</span>
            <div className="font-bold text-amber-950 text-sm">REVIEW</div>
            <div className="text-amber-800 font-semibold">• Photos + Measurements + Report + Goal</div>
            <div className="text-[11px] text-gray-600 pt-1">Generate 30-Day PDF report & set next 60-day target.</div>
          </div>
        </div>
      </div>

      {/* Specification Section 24: 90-DAY TRANSFORMATION */}
      <div className="card space-y-4 border-l-4 border-navy-900">
        <h3 className="section-title flex items-center gap-2 mb-0">
          <FiAward className="text-navy-900" /> Master Section 24: 90-Day Lifestyle Transformation Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 bg-navy-50 rounded-2xl border border-navy-200 space-y-2">
            <div className="font-bold text-navy-900 text-base">MONTH 1: BUILD HABITS</div>
            <div className="text-navy-700">Focus on daily attendance, nutritional shakes, water hydration & habit score 8/8.</div>
            <div className="pt-2 font-mono font-bold text-emerald-700">Milestone: -4.0 kg Weight Loss</div>
          </div>

          <div className="p-4 bg-navy-50 rounded-2xl border border-navy-200 space-y-2">
            <div className="font-bold text-navy-900 text-base">MONTH 2: BUILD CONSISTENCY</div>
            <div className="text-navy-700">Focus on visceral fat reduction, waist inch loss & strength training routines.</div>
            <div className="pt-2 font-mono font-bold text-emerald-700">Milestone: -3.5 kg & 2.5" Waist Loss</div>
          </div>

          <div className="p-4 bg-navy-50 rounded-2xl border border-navy-200 space-y-2">
            <div className="font-bold text-navy-900 text-base">MONTH 3: BUILD LIFESTYLE</div>
            <div className="text-navy-700">Long-term maintenance habits, optimal BMI, & complete transformation photo review.</div>
            <div className="pt-2 font-mono font-bold text-emerald-700">Milestone: Target Weight Achieved 🎉</div>
          </div>
        </div>

        {/* Before -> 30d -> 60d -> 90d Timeline Banner */}
        <div className="p-4 bg-gradient-to-r from-navy-900 to-emerald-900 text-white rounded-2xl flex items-center justify-between text-xs">
          <div className="font-bold">Transformation Timeline for {member.name}:</div>
          <div className="flex items-center gap-3 font-semibold">
            <span>BEFORE (78kg)</span>
            <FiArrowRight />
            <span>30 DAYS (74kg)</span>
            <FiArrowRight />
            <span>60 DAYS (71kg)</span>
            <FiArrowRight />
            <span className="text-emerald-300 font-bold">90 DAYS TARGET (68kg)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
