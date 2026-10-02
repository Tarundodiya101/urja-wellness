import { useState, useMemo } from 'react';
import {
  FiSend, FiEdit2, FiMessageCircle, FiAlertCircle, FiCheckCircle,
  FiX, FiEye, FiUsers, FiClock, FiGift, FiBell, FiRepeat,
  FiCalendar, FiCheck, FiInfo
} from 'react-icons/fi';
import { useApp } from '../context/AppContext';

// ─── Constants ───────────────────────────────────────────────────────────────

const SEGMENTS = [
  'All Members',
  'Active Members',
  'Expired Members',
  'Coach: Priya Sharma',
  'Coach: Rahul Verma',
  'Coach: Neha Gupta',
  'Coach: Amit Singh',
];

const TRIGGER_CARDS = [
  {
    id: 'welcome',
    title: 'Welcome Message',
    desc: 'Sent automatically when a new member joins.',
    icon: FiGift,
    color: 'bg-green-50 border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-700',
    sendCount: 142,
    template: 'Hi {name}! 🌿 Welcome to URJA Wellness Club! We\'re thrilled to have you on your wellness journey. Your coach {coach} will be in touch shortly. See you at the center! 💪',
  },
  {
    id: 'payment',
    title: 'Payment Reminder',
    desc: 'Reminds members with pending dues.',
    icon: FiAlertCircle,
    color: 'bg-blue-50 border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700',
    sendCount: 38,
    template: 'Hi {name}! 💳 This is a gentle reminder that your payment of ₹{amount} is due on {date}. Please complete the payment at the center or via UPI. Thank you! – URJA Wellness',
  },
  {
    id: 'renewal',
    title: 'Renewal Reminder',
    desc: 'Sent 7 days before membership expires.',
    icon: FiRepeat,
    color: 'bg-orange-50 border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-700',
    sendCount: 56,
    template: 'Hi {name}! ⏳ Your URJA membership expires on {expiry_date}. Renew now to continue your wellness journey without a break! Early renewal gets a *special discount*. Contact us today 🙏',
  },
  {
    id: 'absence',
    title: 'Absence Reminder',
    desc: 'Triggered after 3+ days of no visits.',
    icon: FiBell,
    color: 'bg-red-50 border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    badgeColor: 'bg-red-100 text-red-700',
    sendCount: 29,
    template: 'Hi {name}! 😊 We miss you at URJA! It\'s been {days} days since your last visit. Your coach {coach} is waiting for you. Come back and stay on track with your goals! 💚',
  },
  {
    id: 'birthday',
    title: 'Birthday Wish',
    desc: 'Automatically sent on member\'s birthday.',
    icon: FiGift,
    color: 'bg-purple-50 border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-700',
    sendCount: 17,
    template: '🎂 Happy Birthday {name}! The entire URJA Wellness family wishes you a wonderful year ahead. May you be healthy, happy & strong! Come celebrate with a free shake today! 🎉',
  },
  {
    id: 'appointment',
    title: 'Appointment Reminder',
    desc: 'Sent 24h before a scheduled session.',
    icon: FiCalendar,
    color: 'bg-teal-50 border-teal-200',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    badgeColor: 'bg-teal-100 text-teal-700',
    sendCount: 84,
    template: 'Hi {name}! 📅 Reminder: You have a session scheduled at URJA Wellness tomorrow at {time} with {coach}. Please be on time. See you! 🌿',
  },
];

const SEGMENT_COUNTS = {
  'All Members': 210,
  'Active Members': 178,
  'Expired Members': 32,
  'Coach: Priya Sharma': 52,
  'Coach: Rahul Verma': 48,
  'Coach: Neha Gupta': 40,
  'Coach: Amit Singh': 38,
};

const STATUS_STYLE = {
  Delivered: 'bg-blue-100 text-blue-700',
  Read:      'bg-green-100 text-green-700',
  Failed:    'bg-red-100 text-red-700',
  Pending:   'bg-yellow-100 text-yellow-700',
};

const STATUS_ICON = {
  Delivered: <FiCheck size={11}/>,
  Read:      <FiCheckCircle size={11}/>,
  Failed:    <FiX size={11}/>,
  Pending:   <FiClock size={11}/>,
};

const INITIAL_LOGS = [
  { id: 1, recipient: 'Anjali Mehta',  mobile: '9876543210', type: 'Welcome Message',      preview: 'Hi Anjali! 🌿 Welcome to URJA Wellness Club!...', sentAt: '2026-10-01 08:00', status: 'Read'      },
  { id: 2, recipient: 'Suresh Patel',  mobile: '9876501234', type: 'Payment Reminder',     preview: 'Hi Suresh! 💳 This is a gentle reminder that your payment...', sentAt: '2026-10-01 09:15', status: 'Delivered' },
  { id: 3, recipient: 'Ramesh Kumar',  mobile: '9876500001', type: 'Absence Reminder',     preview: 'Hi Ramesh! 😊 We miss you at URJA! It\'s been 3 days...', sentAt: '2026-09-30 10:30', status: 'Read'      },
  { id: 4, recipient: 'Deepa Iyer',    mobile: '9001122334', type: 'Renewal Reminder',     preview: 'Hi Deepa! ⏳ Your URJA membership expires on Oct 15...', sentAt: '2026-09-30 11:00', status: 'Read'      },
  { id: 5, recipient: 'Lata Tiwari',   mobile: '9876500006', type: 'Birthday Wish',        preview: '🎂 Happy Birthday Lata! The entire URJA Wellness...', sentAt: '2026-09-29 07:00', status: 'Delivered' },
  { id: 6, recipient: 'Vikram Nair',   mobile: '9988776655', type: 'Appointment Reminder', preview: 'Hi Vikram! 📅 Reminder: You have a session scheduled...', sentAt: '2026-09-29 09:00', status: 'Failed'    },
  { id: 7, recipient: 'Pooja Rao',     mobile: '9123456789', type: 'Welcome Message',      preview: 'Hi Pooja! 🌿 Welcome to URJA Wellness Club!...', sentAt: '2026-09-28 08:00', status: 'Read'      },
];

// ─── Edit Template Modal ──────────────────────────────────────────────────────

function EditTemplateModal({ card, onClose, onSave }) {
  const [text, setText] = useState(card.template);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-navy-800">Edit Template — {card.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><FiX size={20}/></button>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 mb-3 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Available variables: </span>
          <code>{'{name}'}</code>, <code>{'{coach}'}</code>, <code>{'{amount}'}</code>, <code>{'{date}'}</code>, <code>{'{expiry_date}'}</code>, <code>{'{days}'}</code>, <code>{'{time}'}</code>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
        <p className="text-xs text-gray-400 text-right mt-1">{text.length} chars</p>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSave(card.id, text); onClose(); }}
            className="flex-1 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700">
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

function PreviewModal({ message, segment, count, onClose, onSend }) {
  const sample = message
    .replace('{name}', 'Anjali Mehta')
    .replace('{coach}', 'Priya Sharma')
    .replace('{amount}', '2500')
    .replace('{date}', '10 Oct 2026')
    .replace('{expiry_date}', '15 Oct 2026')
    .replace('{days}', '4')
    .replace('{time}', '9:00 AM');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-navy-800">Message Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><FiX size={20}/></button>
        </div>
        {/* WhatsApp-style bubble */}
        <div className="bg-[#ECE5DD] rounded-xl p-4 mb-4">
          <div className="bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-[90%]">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{sample}</p>
            <p className="text-xs text-gray-400 text-right mt-1.5">10:00 AM ✓✓</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3 mb-4">
          <FiUsers className="text-blue-500 flex-shrink-0" size={15}/>
          <p className="text-sm text-blue-700">Will be sent to <span className="font-bold">{count} members</span> in <span className="font-semibold">{segment}</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onSend}
            className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700">
            <FiSend size={14}/> Send Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fade-in min-w-[260px]">
      <FiCheckCircle size={18} className="flex-shrink-0"/>
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-green-200 hover:text-white"><FiX size={16}/></button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function WhatsApp() {
  // eslint-disable-next-line no-unused-vars
  const app = useApp();

  const [cards, setCards] = useState(TRIGGER_CARDS);
  const [logs, setLogs]   = useState(INITIAL_LOGS);
  const [editCard, setEditCard]       = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast]             = useState('');

  // Broadcast form
  const [segment, setSegment]   = useState('All Members');
  const [message, setMessage]   = useState('');
  const [logSearch, setLogSearch] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const saveTemplate = (id, text) => {
    setCards((prev) => prev.map((c) => c.id === id ? { ...c, template: text } : c));
    showToast('✅ Template saved successfully!');
  };

  const addLog = (type, preview) => {
    const now = new Date();
    const sentAt = `${now.toISOString().slice(0,10)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const newEntry = {
      id: Date.now(),
      recipient: `Bulk — ${segment}`,
      mobile: 'Multiple',
      type,
      preview: preview.slice(0, 60) + '...',
      sentAt,
      status: 'Delivered',
    };
    setLogs((prev) => [newEntry, ...prev]);
  };

  const handleSendTrigger = (card) => {
    addLog(card.title, card.template);
    showToast(`✅ "${card.title}" sent to all eligible members!`);
  };

  const handleBroadcastSend = () => {
    if (!message.trim()) return;
    addLog('Broadcast', message);
    setShowPreview(false);
    showToast(`✅ Broadcast sent to ${SEGMENT_COUNTS[segment]} members in "${segment}"!`);
    setMessage('');
  };

  const filteredLogs = useMemo(() =>
    logs.filter((l) =>
      l.recipient.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.type.toLowerCase().includes(logSearch.toLowerCase())
    ),
    [logs, logSearch]
  );

  const totalSent    = logs.length;
  const totalRead    = logs.filter((l) => l.status === 'Read').length;
  const totalFailed  = logs.filter((l) => l.status === 'Failed').length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-7">
      {toast && <Toast message={toast} onClose={() => setToast('')}/>}
      {editCard && <EditTemplateModal card={editCard} onClose={() => setEditCard(null)} onSave={saveTemplate}/>}
      {showPreview && (
        <PreviewModal
          message={message}
          segment={segment}
          count={SEGMENT_COUNTS[segment]}
          onClose={() => setShowPreview(false)}
          onSend={handleBroadcastSend}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">WhatsApp Automation</h1>
          <p className="text-sm text-gray-500 mt-1">Manage message templates, send broadcasts, and track delivery.</p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: 'Sent', value: totalSent, color: 'text-blue-600' },
            { label: 'Read', value: totalRead, color: 'text-green-600' },
            { label: 'Failed', value: totalFailed, color: 'text-red-500' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 1: Trigger Cards ────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-navy-800 mb-4">Automated Triggers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.id} className={`${card.color} border rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between">
                  <div className={`${card.iconBg} p-2.5 rounded-xl`}>
                    <Icon className={card.iconColor} size={20}/>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                    {card.sendCount} sent
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{card.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{card.desc}</p>
                </div>
                <p className="text-xs text-gray-600 bg-white/60 rounded-lg p-2.5 line-clamp-2 leading-relaxed">
                  {card.template}
                </p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => setEditCard(card)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 border border-gray-300 bg-white rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                    <FiEdit2 size={12}/> Edit Template
                  </button>
                  <button
                    onClick={() => handleSendTrigger(card)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors">
                    <FiSend size={12}/> Send Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 2: Bulk Broadcast ───────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-navy-800 mb-4 flex items-center gap-2">
          <FiUsers className="text-primary-600" size={18}/> Bulk Broadcast
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Segment</label>
              <div className="flex flex-wrap gap-2">
                {SEGMENTS.map((seg) => (
                  <button key={seg} onClick={() => setSegment(seg)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      segment === seg
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-400'}`}>
                    {seg} ({SEGMENT_COUNTS[seg]})
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Message
                <span className={`ml-2 text-xs font-normal ${message.length > 1000 ? 'text-red-500' : 'text-gray-400'}`}>
                  {message.length}/1024
                </span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 1024))}
                rows={5}
                placeholder="Type your broadcast message here... Use {name}, {coach} for personalization."
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { if (message.trim()) setShowPreview(true); }}
                disabled={!message.trim()}
                className="flex items-center gap-2 px-4 py-2.5 border-2 border-primary-500 text-primary-600 rounded-xl text-sm font-semibold hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <FiEye size={15}/> Preview
              </button>
              <button
                onClick={handleBroadcastSend}
                disabled={!message.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <FiSend size={15}/> Send to {SEGMENT_COUNTS[segment]} Members
              </button>
            </div>
          </div>

          {/* Right: tips */}
          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiInfo className="text-amber-600 flex-shrink-0" size={15}/>
                <span className="text-sm font-semibold text-amber-800">Best Practices</span>
              </div>
              <ul className="text-xs text-amber-700 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Keep messages under 500 characters</li>
                <li>Personalize with {'{name}'} variable</li>
                <li>Avoid spammy language</li>
                <li>Send between 9 AM – 7 PM</li>
                <li>Max 1 broadcast per day per member</li>
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiMessageCircle className="text-green-600 flex-shrink-0" size={15}/>
                <span className="text-sm font-semibold text-green-800">Quick Stats</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: 'Avg Open Rate', value: '82%' },
                  { label: 'Avg Response Rate', value: '41%' },
                  { label: 'Messages This Month', value: logs.length },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-xs">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-semibold text-green-700">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: Message Log ──────────────────────────────────────────── */}
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <h2 className="text-base font-bold text-navy-800 flex items-center gap-2">
            <FiClock className="text-gray-500" size={16}/> Message Log
          </h2>
          <div className="relative w-full sm:w-60">
            <FiMessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
            <input
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              placeholder="Search recipient or type..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs w-full focus:outline-none focus:ring-2 focus:ring-primary-500"/>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Recipient</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Mobile</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Message Preview</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap">Sent At</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredLogs.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">No messages found.</td></tr>
              )}
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
                        {log.recipient.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 whitespace-nowrap text-xs">{log.recipient}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{log.mobile}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium whitespace-nowrap">{log.type}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-[220px] truncate">{log.preview}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{log.sentAt}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[log.status] || STATUS_STYLE.Pending}`}>
                      {STATUS_ICON[log.status]}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Section 4: Consent Management ──────────────────────────────────── */}
      <section className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="bg-indigo-100 p-2.5 rounded-xl flex-shrink-0">
          <FiAlertCircle className="text-indigo-600" size={20}/>
        </div>
        <div>
          <h3 className="font-semibold text-indigo-900 text-sm">Consent Management — WhatsApp Opt-In</h3>
          <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
            Per WhatsApp Business Policy, all members must have explicitly opted-in to receive messages.
            Ensure members check the <span className="font-semibold">"I agree to receive WhatsApp communications"</span> checkbox
            during registration. Non-consented numbers will be automatically excluded from broadcasts.
            Non-compliance may result in account suspension.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-600 rounded flex items-center justify-center flex-shrink-0">
              <FiCheck className="text-white" size={10}/>
            </div>
            <span className="text-xs text-indigo-700 font-medium">Opt-in consent checkbox is active on the member registration form.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
