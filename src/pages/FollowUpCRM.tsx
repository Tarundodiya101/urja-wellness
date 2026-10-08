import { Select } from '../components/ui/fields';
import { useState, useMemo } from 'react';
import {
  FiPlus, FiPhone, FiMessageCircle, FiCheckCircle, FiChevronRight,
  FiChevronLeft, FiUser, FiX, FiSearch, FiAlertTriangle,
  FiUsers, FiGift, FiTrendingUp, FiEdit2, FiTrash2
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { FormField, Textarea } from '../components/ui/fields';

// ─── Constants ───────────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  'New Lead',
  'Welcome Sent',
  'Replied',
  'Interested',
  'Visit Date',
  'Visited',
  'Joined',
];

const STAGE_COLORS = {
  'New Lead':     'bg-gray-100 text-gray-700 border-gray-300',
  'Welcome Sent': 'bg-blue-100 text-blue-700 border-blue-300',
  'Replied':      'bg-indigo-100 text-indigo-700 border-indigo-300',
  'Interested':   'bg-yellow-100 text-yellow-700 border-yellow-300',
  'Visit Date':   'bg-orange-100 text-orange-700 border-orange-300',
  'Visited':      'bg-teal-100 text-teal-700 border-teal-300',
  'Joined':       'bg-green-100 text-green-700 border-green-300',
};

const STAGE_DOT = {
  'New Lead':     'bg-gray-500',
  'Welcome Sent': 'bg-blue-500',
  'Replied':      'bg-indigo-500',
  'Interested':   'bg-yellow-500',
  'Visit Date':   'bg-orange-500',
  'Visited':      'bg-teal-500',
  'Joined':       'bg-green-500',
};

const SOURCES = ['Walk-in', 'WhatsApp', 'Referral', 'Social Media', 'Website'];
const COACHES = ['Priya Sharma', 'Rahul Verma', 'Neha Gupta', 'Amit Singh'];

const INITIAL_LEADS = [
  { id: 1, name: 'Anjali Mehta',  mobile: '9876543210', source: 'WhatsApp',    coach: 'Priya Sharma', stage: 'Interested',   lastContact: '2026-09-29', notes: 'Interested in weight loss program' },
  { id: 2, name: 'Suresh Patel',  mobile: '9876501234', source: 'Referral',    coach: 'Rahul Verma',  stage: 'Replied',      lastContact: '2026-09-30', notes: 'Referred by member Karan' },
  { id: 3, name: 'Pooja Rao',     mobile: '9123456789', source: 'Walk-in',     coach: 'Neha Gupta',   stage: 'New Lead',     lastContact: '2026-10-01', notes: '' },
  { id: 4, name: 'Vikram Nair',   mobile: '9988776655', source: 'Social Media', coach: 'Amit Singh',  stage: 'Visit Date',   lastContact: '2026-09-28', notes: 'Visit scheduled for Oct 3' },
  { id: 5, name: 'Deepa Iyer',    mobile: '9001122334', source: 'WhatsApp',    coach: 'Priya Sharma', stage: 'Visited',      lastContact: '2026-09-27', notes: 'Liked the center, thinking' },
  { id: 6, name: 'Rohan Sharma',  mobile: '9445566778', source: 'Referral',    coach: 'Rahul Verma',  stage: 'Joined',       lastContact: '2026-09-25', notes: 'Signed up for 3-month plan' },
  { id: 7, name: 'Kavita Desai',  mobile: '9334455667', source: 'Walk-in',     coach: 'Neha Gupta',   stage: 'Welcome Sent', lastContact: '2026-09-30', notes: '' },
];

const ABSENT_MEMBERS_DATA = [
  { id: 1, name: 'Ramesh Kumar',   lastVisit: '2026-09-28', coach: 'Priya Sharma', mobile: '9876500001' },
  { id: 2, name: 'Sunita Joshi',   lastVisit: '2026-09-26', coach: 'Rahul Verma',  mobile: '9876500002' },
  { id: 3, name: 'Arun Pillai',    lastVisit: '2026-09-25', coach: 'Amit Singh',   mobile: '9876500003' },
  { id: 4, name: 'Meena Singh',    lastVisit: '2026-09-29', coach: 'Neha Gupta',   mobile: '9876500004' },
  { id: 5, name: 'Ravi Shankar',   lastVisit: '2026-09-24', coach: 'Priya Sharma', mobile: '9876500005' },
  { id: 6, name: 'Lata Tiwari',    lastVisit: '2026-09-27', coach: 'Rahul Verma',  mobile: '9876500006' },
  { id: 7, name: 'Nikhil Chawla',  lastVisit: '2026-09-23', coach: 'Amit Singh',   mobile: '9876500007' },
];

const INITIAL_GUESTS = [
  { id: 1, name: 'Harish Mehta',  mobile: '9700001111', introducedBy: 'Anjali Mehta',  visitDate: '2026-09-28', shakeGiven: true,  converted: false },
  { id: 2, name: 'Sunaina Rao',   mobile: '9700002222', introducedBy: 'Suresh Patel',  visitDate: '2026-09-30', shakeGiven: true,  converted: true  },
  { id: 3, name: 'Dev Mishra',    mobile: '9700003333', introducedBy: 'Pooja Rao',     visitDate: '2026-10-01', shakeGiven: false, converted: false },
  { id: 4, name: 'Priti Nair',    mobile: '9700004444', introducedBy: 'Vikram Nair',   visitDate: '2026-09-27', shakeGiven: true,  converted: true  },
  { id: 5, name: 'Tarun Gupta',   mobile: '9700005555', introducedBy: 'Deepa Iyer',    visitDate: '2026-09-25', shakeGiven: false, converted: false },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const daysSince = (dateStr) => {
  const today = new Date('2026-10-01');
  const last  = new Date(dateStr);
  return Math.floor((today.getTime() - last.getTime()) / 86400000);
};

// ─── Modal: Add Lead ─────────────────────────────────────────────────────────

function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', mobile: '', source: 'Walk-in', coach: COACHES[0], notes: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile.trim()) return;
    onAdd({ ...form, id: Date.now(), stage: 'New Lead', lastContact: new Date().toISOString().slice(0, 10) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-navy-800">Add New Lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><FiX size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input required value={form.name} onChange={set('name')} placeholder="e.g. Anjali Mehta"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
            <input required value={form.mobile} onChange={set('mobile')} placeholder="10-digit number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <Select value={form.source} onChange={set('source')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Coach</label>
              <Select value={form.coach} onChange={set('coach')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                {COACHES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </div>
          </div>
          <FormField label="Notes" htmlFor="lead-notes">
            <Textarea id="lead-notes" value={form.notes} onChange={set('notes')} rows={3} placeholder="Any initial notes..." className="resize-none" />
          </FormField>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700">
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Modal: Add Guest ─────────────────────────────────────────────────────────

function AddGuestModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', mobile: '', introducedBy: '', visitDate: new Date().toISOString().slice(0,10), shakeGiven: false, converted: false });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (k) => () => setForm((f) => ({ ...f, [k]: !f[k] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({ ...form, id: Date.now() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-navy-800">Add Guest Visit</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><FiX size={20}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
            <input required value={form.name} onChange={set('name')} placeholder="Guest full name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input value={form.mobile} onChange={set('mobile')} placeholder="Mobile number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
              <input type="date" value={form.visitDate} onChange={set('visitDate')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Introduced By (Member)</label>
            <input value={form.introducedBy} onChange={set('introducedBy')} placeholder="Member name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.shakeGiven} onChange={toggle('shakeGiven')} className="w-4 h-4 accent-primary-600"/>
              <span className="text-sm text-gray-700">Shake Given</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.converted} onChange={toggle('converted')} className="w-4 h-4 accent-primary-600"/>
              <span className="text-sm text-gray-700">Converted to Member</span>
            </label>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700">
              Add Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Tab 1: Lead Pipeline ─────────────────────────────────────────────────────

function LeadPipeline() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [filterStage, setFilterStage] = useState('All');

  const addLead = (lead) => setLeads((prev) => [lead, ...prev]);

  const moveStage = (id, direction) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const idx = PIPELINE_STAGES.indexOf(l.stage);
        const next = direction === 'next' ? idx + 1 : idx - 1;
        if (next < 0 || next >= PIPELINE_STAGES.length) return l;
        return { ...l, stage: PIPELINE_STAGES[next], lastContact: new Date().toISOString().slice(0, 10) };
      })
    );
  };

  const updateStage = (id, stage) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, stage } : l));
  };

  const deleteLead = (id) => setLeads((prev) => prev.filter((l) => l.id !== id));

  const filtered = useMemo(() => leads.filter((l) =>
    (filterStage === 'All' || l.stage === filterStage) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.mobile.includes(search))
  ), [leads, search, filterStage]);

  const stageCounts = useMemo(() =>
    PIPELINE_STAGES.reduce((acc, s) => ({ ...acc, [s]: leads.filter((l) => l.stage === s).length }), {}),
    [leads]
  );

  return (
    <div className="space-y-5">
      {/* Stage pills summary */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStage('All')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterStage === 'All' ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-gray-700 border-gray-300 hover:border-navy-400'}`}>
          All ({leads.length})
        </button>
        {PIPELINE_STAGES.map((s) => (
          <button key={s} onClick={() => setFilterStage(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterStage === s ? `${STAGE_COLORS[s]} border-current` : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
            {s} ({stageCounts[s]})
          </button>
        ))}
      </div>

      {/* Actions row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15}/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or mobile..."
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500"/>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors">
          <FiPlus size={16}/> Add Lead
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Mobile</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Coach</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Stage</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Last Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Notes</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Move</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">No leads found.</td></tr>
              )}
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 whitespace-nowrap">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{lead.mobile}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{lead.source}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{lead.coach}</td>
                  <td className="px-4 py-3">
                    <Select value={lead.stage} onChange={(e) => updateStage(lead.id, e.target.value)}
                      className={`text-xs font-semibold border rounded-full px-2 py-1 focus:outline-none cursor-pointer ${STAGE_COLORS[lead.stage]}`}>
                      {PIPELINE_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{lead.lastContact}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[160px] truncate">{lead.notes || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => moveStage(lead.id, 'prev')}
                        disabled={lead.stage === PIPELINE_STAGES[0]}
                        title="Move back"
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <FiChevronLeft size={14}/>
                      </button>
                      <button onClick={() => moveStage(lead.id, 'next')}
                        disabled={lead.stage === PIPELINE_STAGES[PIPELINE_STAGES.length - 1]}
                        title="Move forward"
                        className="p-1.5 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <FiChevronRight size={14}/>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <a href={`tel:${lead.mobile}`} title="Call"
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                        <FiPhone size={14}/>
                      </a>
                      <a href={`https://wa.me/91${lead.mobile}`} target="_blank" rel="noreferrer" title="WhatsApp"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <FiMessageCircle size={14}/>
                      </a>
                      <button onClick={() => setConfirmDeleteId(lead.id)} title="Delete"
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                        <FiTrash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AddLeadModal onClose={() => setShowModal(false)} onAdd={addLead}/>}
    </div>
  );
}

// ─── Tab 2: Absent Members ────────────────────────────────────────────────────

function AbsentMembers() {
  const [members, setMembers] = useState(
    ABSENT_MEMBERS_DATA.map((m) => ({ ...m, days: daysSince(m.lastVisit) }))
      .sort((a, b) => b.days - a.days)
  );
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const markVisited = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Member marked as visited today.');
  };

  const urgentCount = members.filter((m) => m.days > 3).length;

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}

      {/* Alert banner */}
      {urgentCount > 0 && (
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <FiAlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={18}/>
          <div>
            <p className="text-sm font-semibold text-orange-800">{urgentCount} member{urgentCount > 1 ? 's' : ''} absent for more than 3 days</p>
            <p className="text-xs text-orange-600 mt-0.5">Immediate follow-up recommended to improve retention.</p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Absent', value: members.length, color: 'text-gray-700', bg: 'bg-gray-50' },
          { label: '2–3 Days', value: members.filter((m) => m.days >= 2 && m.days <= 3).length, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: '4–7 Days', value: members.filter((m) => m.days >= 4 && m.days <= 7).length, color: 'text-orange-700', bg: 'bg-orange-50' },
          { label: '7+ Days', value: members.filter((m) => m.days > 7).length, color: 'text-red-700', bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-navy-800">Members Who Haven't Visited (2+ Days)</h3>
          <span className="text-xs text-gray-500">{members.length} members</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Last Visit</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Days Absent</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Coach</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Mobile</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Recommendation</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => {
                const urgent = m.days > 3;
                return (
                  <tr key={m.id} className={`hover:bg-gray-50/70 transition-colors ${urgent ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center text-navy-700 font-bold text-xs flex-shrink-0">
                          {m.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800 whitespace-nowrap">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{m.lastVisit}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        m.days > 7 ? 'bg-red-100 text-red-700' :
                        m.days > 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'}`}>
                        {m.days}d
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{m.coach}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{m.mobile}</td>
                    <td className="px-4 py-3">
                      {urgent ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                          <FiAlertTriangle size={12}/> Urgent: Auto follow-up
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Send reminder</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <a href={`tel:${m.mobile}`} title="Call"
                          className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                          <FiPhone size={11}/> Call
                        </a>
                        <a href={`https://wa.me/91${m.mobile}`} target="_blank" rel="noreferrer" title="WhatsApp"
                          className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors">
                          <FiMessageCircle size={11}/> WA
                        </a>
                        <button onClick={() => markVisited(m.id)} title="Mark Visited"
                          className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors">
                          <FiCheckCircle size={11}/> Visited
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 3: Guest Management ──────────────────────────────────────────────────

function GuestManagement() {
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [showModal, setShowModal] = useState(false);

  const addGuest = (g) => setGuests((prev) => [g, ...prev]);

  const toggleShake = (id) => setGuests((prev) => prev.map((g) => g.id === id ? { ...g, shakeGiven: !g.shakeGiven } : g));
  const toggleConverted = (id) => setGuests((prev) => prev.map((g) => g.id === id ? { ...g, converted: !g.converted } : g));

  const conversionRate = guests.length ? Math.round((guests.filter((g) => g.converted).length / guests.length) * 100) : 0;
  const shakeRate = guests.length ? Math.round((guests.filter((g) => g.shakeGiven).length / guests.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Guests', value: guests.length, color: 'text-navy-700', bg: 'bg-navy-50' },
          { label: 'Shakes Given', value: guests.filter((g) => g.shakeGiven).length, color: 'text-purple-700', bg: 'bg-purple-50' },
          { label: 'Converted', value: guests.filter((g) => g.converted).length, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, color: 'text-primary-700', bg: 'bg-primary-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Conversion progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-navy-800">Conversion Funnel</h4>
            <p className="text-xs text-gray-500 mt-0.5">Guest → Shake Given → Converted Member</p>
          </div>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${conversionRate >= 50 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
            {conversionRate}% Conv.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Shake Given</span><span>{shakeRate}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-400 rounded-full transition-all" style={{ width: `${shakeRate}%` }}/>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Converted</span><span>{conversionRate}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${conversionRate}%` }}/>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors">
          <FiPlus size={16}/> Add Guest
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Guest Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Mobile</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Introduced By</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Visit Date</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Shake Given</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Converted</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {guests.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs flex-shrink-0">
                        {g.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 whitespace-nowrap">{g.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{g.mobile || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{g.introducedBy || '—'}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap text-xs">{g.visitDate}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleShake(g.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${g.shakeGiven ? 'bg-purple-500' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${g.shakeGiven ? 'left-5' : 'left-0.5'}`}/>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleConverted(g.id)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${g.converted ? 'bg-green-500' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${g.converted ? 'left-5' : 'left-0.5'}`}/>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <a href={`tel:${g.mobile}`} title="Call"
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                        <FiPhone size={14}/>
                      </a>
                      <a href={`https://wa.me/91${g.mobile}`} target="_blank" rel="noreferrer" title="WhatsApp"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors">
                        <FiMessageCircle size={14}/>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AddGuestModal onClose={() => setShowModal(false)} onAdd={addGuest}/>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'pipeline', label: 'Lead Pipeline',    icon: FiTrendingUp },
  { id: 'absent',   label: 'Absent Members',   icon: FiUsers      },
  { id: 'guests',   label: 'Guest Management', icon: FiGift       },
];

export default function FollowUpCRM() {
  // eslint-disable-next-line no-unused-vars
  const app = useApp();
  const [activeTab, setActiveTab] = useState('pipeline');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-800">Follow-Up & CRM</h1>
        <p className="text-sm text-gray-500 mt-1">Manage leads, track absent members, and oversee guest conversions.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-fit mb-6 flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'}`}>
              <Icon size={15}/>{t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'pipeline' && <LeadPipeline/>}
      {activeTab === 'absent'   && <AbsentMembers/>}
      {activeTab === 'guests'   && <GuestManagement/>}
    </div>
  );
}
