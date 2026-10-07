import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FiMessageSquare, FiSend, FiCheckCircle, FiClock, FiGlobe, FiAlertCircle, FiCopy, FiRefreshCw } from 'react-icons/fi';

export default function WhatsAppReminders() {
  const { members, payments, inventory, dailyWellness } = useApp();
  const [language, setLanguage] = useState<'GUJ' | 'ENG'>('GUJ');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Mock template library in Gujarati & English
  const templates = {
    GUJ: {
      PAYMENT: 'નમસ્તે {name}, URJA Wellness Club માં આપનું બાકી ચૂકવણું ₹{amount} બાકી છે. કૃપા કરીને વહેલી તકે ચુકવણી કરશો. આભાર!',
      RENEWAL: 'નમસ્તે {name}, આપનું પ્લસ મેમ્બરશિપ પેકેજ {date} ના રોજ સમાપ્ત થાય છે. સાતત્ય જાળવવા માટે આજે જ રીન્યુ કરો! 🌿',
      ABSENT: 'નમસ્તે {name}, URJA Wellness Club માં છેલ્લા ૨ દિવસથી તમારી હાજરી જોવા મળી નથી. તમારું સ્વાસ્થ્ય અમારું લક્ષ્ય છે. આજે જ આવો! 💪',
      REFILL: 'નમસ્તે {name}, તમારી ન્યુટ્રિશન પ્રોડક્ટનું રીફિલ {date} એ પૂરું થાય છે. સ્ટોક સમાપ્ત થાય તે પહેલાં રીફિલ ઓર્ડર કરો! 🥤',
      PROGRESS: 'નમસ્તે {name}, આ અઠવાડિયે તમારું બોડી મેઝરમેન્ટ અને પ્રોગ્રેસ રિવ્યુ બાકી છે. તમારા કોચ સાથે રિવ્યુ સ્લોટ બુક કરો! 📸',
      BIRTHDAY: '💐 URJA Wellness Club તરફથી તમને જન્મદિવસની હાર્દિક શુભેચ્છાઓ! તમારું સ્વાસ્થ્ય અને જીવન હંમેશા ઉર્જાવાન રહે! 🎂',
    },
    ENG: {
      PAYMENT: 'Hello {name}, your pending payment of ₹{amount} is due at URJA Wellness Club. Please complete the payment at your earliest convenience. Thank you!',
      RENEWAL: 'Hello {name}, your membership package is expiring on {date}. Renew today to continue your transformation journey without interruption! 🌿',
      ABSENT: 'Hello {name}, we missed you at URJA Wellness Club for the last 2 days. Your health is our priority. See you today! 💪',
      REFILL: 'Hello {name}, your nutrition stock refill is due around {date}. Please order your refill before your current supply ends! 🥤',
      PROGRESS: 'Hello {name}, your weekly body measurement and progress review is due. Please schedule a slot with your coach today! 📸',
      BIRTHDAY: '💐 Happy Birthday {name} from team URJA Wellness Club! Wishing you a healthy, energetic, and happy year ahead! 🎂',
    }
  };

  // Generate reminder items list
  const reminderItems = [
    {
      id: 'rem-1',
      memberName: 'Amit Sureliya',
      mobile: '9426934500',
      type: 'PAYMENT',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
      title: 'Pending Payment Due',
      detail: 'Pending Amount: ₹1,250',
      date: 'Today',
      amount: 1250,
      customMsgGUJ: templates.GUJ.PAYMENT.replace('{name}', 'Amit Sureliya').replace('{amount}', '1250'),
      customMsgENG: templates.ENG.PAYMENT.replace('{name}', 'Amit Sureliya').replace('{amount}', '1250'),
    },
    {
      id: 'rem-2',
      memberName: 'Priya Sharma',
      mobile: '9876543210',
      type: 'RENEWAL',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
      title: 'Membership Expiring Soon',
      detail: 'Expiry Date: 2026-10-15',
      date: 'In 3 Days',
      amount: 4500,
      customMsgGUJ: templates.GUJ.RENEWAL.replace('{name}', 'Priya Sharma').replace('{date}', '15-Oct'),
      customMsgENG: templates.ENG.RENEWAL.replace('{name}', 'Priya Sharma').replace('{date}', '15-Oct'),
    },
    {
      id: 'rem-3',
      memberName: 'Rajesh Patel',
      mobile: '9825012345',
      type: 'ABSENT',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
      title: 'Absent 3+ Consecutive Days',
      detail: 'Last Visit: 3 Days ago',
      date: 'Overdue',
      amount: 0,
      customMsgGUJ: templates.GUJ.ABSENT.replace('{name}', 'Rajesh Patel'),
      customMsgENG: templates.ENG.ABSENT.replace('{name}', 'Rajesh Patel'),
    },
    {
      id: 'rem-4',
      memberName: 'Neha Varma',
      mobile: '9712345678',
      type: 'REFILL',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
      title: 'Product Refill Due',
      detail: 'Formula 1 Shake Powder',
      date: 'Today',
      amount: 2200,
      customMsgGUJ: templates.GUJ.REFILL.replace('{name}', 'Neha Varma').replace('{date}', 'Today'),
      customMsgENG: templates.ENG.REFILL.replace('{name}', 'Neha Varma').replace('{date}', 'Today'),
    },
    {
      id: 'rem-5',
      memberName: 'Amit Sureliya',
      mobile: '9426934500',
      type: 'PROGRESS',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      title: '14-Day Progress Review',
      detail: 'Photo & Weight Measurements Due',
      date: 'Today',
      amount: 0,
      customMsgGUJ: templates.GUJ.PROGRESS.replace('{name}', 'Amit Sureliya'),
      customMsgENG: templates.ENG.PROGRESS.replace('{name}', 'Amit Sureliya'),
    },
    {
      id: 'rem-6',
      memberName: 'Kavita Dave',
      mobile: '9909011223',
      type: 'BIRTHDAY',
      badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
      title: 'Birthday Today 🎂',
      detail: 'Send Special Wellness Wish',
      date: 'Today',
      amount: 0,
      customMsgGUJ: templates.GUJ.BIRTHDAY.replace('{name}', 'Kavita Dave'),
      customMsgENG: templates.ENG.BIRTHDAY.replace('{name}', 'Kavita Dave'),
    },
  ];

  const filteredReminders = selectedCategory === 'ALL'
    ? reminderItems
    : reminderItems.filter(r => r.type === selectedCategory);

  const handleSendWhatsApp = (mobile: string, text: string) => {
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const url = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0a1628] via-[#0d2137] to-[#16a34a] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <FiMessageSquare className="animate-pulse" /> Section 17 — Master Blueprint
          </div>
          <h1 className="text-2xl font-black tracking-tight">📱 Automatic WhatsApp Reminders</h1>
          <p className="text-gray-300 text-sm mt-1">
            Send 1-Click WhatsApp alerts in Gujarati & English for Payments, Renewals, Attendance, Refill & Birthdays.
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/20">
          <FiGlobe className="text-emerald-400 ml-2" />
          <button
            onClick={() => setLanguage('GUJ')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'GUJ' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            ગુજરાતી (Gujarati)
          </button>
          <button
            onClick={() => setLanguage('ENG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'ENG' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-300 hover:text-white'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'ALL', label: 'All Reminders (6)' },
          { key: 'PAYMENT', label: 'Payment Due' },
          { key: 'RENEWAL', label: 'Renewal Due' },
          { key: 'ABSENT', label: 'Absent Alert' },
          { key: 'REFILL', label: 'Refill Due' },
          { key: 'PROGRESS', label: 'Progress Review' },
          { key: 'BIRTHDAY', label: 'Birthday Wish' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedCategory(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === tab.key
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-emerald-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reminders List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReminders.map((item) => {
          const messageText = language === 'GUJ' ? item.customMsgGUJ : item.customMsgENG;
          const isCopied = copiedId === item.id;

          return (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${item.badgeColor}`}>
                    {item.type}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-1">{item.memberName}</h3>
                  <p className="text-xs text-gray-500 font-mono">📱 +91 {item.mobile}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    {item.date}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-1">{item.detail}</p>
                </div>
              </div>

              {/* Message Preview Box */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-xs text-gray-800 font-sans leading-relaxed relative">
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Template Preview ({language})</span>
                  <button
                    onClick={() => handleCopyText(item.id, messageText)}
                    className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1 font-semibold"
                  >
                    {isCopied ? <FiCheckCircle /> : <FiCopy />}
                    {isCopied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                "{messageText}"
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => handleSendWhatsApp(item.mobile, messageText)}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <FiSend /> 1-Click WhatsApp Trigger
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Template Manager Note */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
        <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
          <FiRefreshCw size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">Auto-Sync & Scheduled Triggers</h4>
          <p className="text-xs text-gray-600 mt-0.5">
            URJA Master System automatically flags members whose payments, refills, or attendance pass the threshold and generates personalized Gujarati & English WhatsApp message payloads.
          </p>
        </div>
      </div>
    </div>
  );
}
