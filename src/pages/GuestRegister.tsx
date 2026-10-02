import React, { useState } from 'react';
import { FiCheckCircle, FiUserPlus, FiSend } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

export default function GuestRegister() {
  const { addLead } = useApp();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [area, setArea] = useState('Vesu, Surat');
  const [interestedIn, setInterestedIn] = useState('Weight Loss');
  const [source, setSource] = useState('Walk-in');
  const [referredBy, setReferredBy] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !mobile) return alert('Name and mobile number are required');

    addLead({
      name,
      mobile,
      date: new Date().toISOString().split('T')[0],
      source,
      area,
      interestedIn,
      assignedTo: 'Priya Sharma',
      stage: 'NEW',
      followUpDate: new Date().toISOString().split('T')[0],
      remarks: `Guest QR Self-Registration. Referred by: ${referredBy || 'None'}`
    });

    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl rounded-3xl overflow-hidden border-4 border-emerald-700 animate-fade-in my-2 p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black shadow-md">
          🌱
        </div>
        <h1 className="text-2xl font-black text-navy-900">URJA WELLNESS CLUB</h1>
        <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Guest Registration Form (Specification Section 33)</div>
        <p className="text-xs text-gray-500">Scan QR Code at reception to self-register for a Trial Visit or Health Evaluation</p>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4 animate-fade-in">
          <FiCheckCircle size={48} className="text-emerald-600 mx-auto" />
          <h2 className="text-xl font-bold text-emerald-900">Registration Successful!</h2>
          <p className="text-xs text-emerald-700">
            Welcome to URJA Wellness Club, <span className="font-bold">{name}</span>! Your entry has been received by our Reception & Coach team.
          </p>
          <div className="p-3 bg-white rounded-xl text-xs text-gray-500 border">
            Please inform the reception counter that your name is <span className="font-bold text-navy-900">{name}</span> for your Trial Shake!
          </div>
          <button
            onClick={() => { setSubmitted(false); setName(''); setMobile(''); }}
            className="btn-primary w-full justify-center"
          >
            Register Another Guest
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name *</label>
            <input className="input-field" placeholder="e.g. Rahul Mehta" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div>
            <label className="label">Mobile / WhatsApp Number *</label>
            <input type="tel" className="input-field" placeholder="e.g. 98250XXXXX" value={mobile} onChange={e => setMobile(e.target.value)} required />
          </div>

          <div>
            <label className="label">Area / Location</label>
            <input className="input-field" placeholder="e.g. Vesu, Surat" value={area} onChange={e => setArea(e.target.value)} />
          </div>

          <div>
            <label className="label">Primary Health Goal</label>
            <select className="input-field" value={interestedIn} onChange={e => setInterestedIn(e.target.value)}>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Weight Gain">Weight Gain</option>
              <option value="Fitness">Fitness & Muscle Gain</option>
              <option value="Healthy Lifestyle">Healthy Lifestyle</option>
              <option value="General Nutrition">General Nutrition</option>
            </select>
          </div>

          <div>
            <label className="label">How did you hear about us? (Source)</label>
            <select className="input-field" value={source} onChange={e => setSource(e.target.value)}>
              <option value="Walk-in">Walk-in Visit</option>
              <option value="Friend">Friend / Relative</option>
              <option value="Referral">Member Referral</option>
              <option value="Social Media">Instagram / Facebook</option>
              <option value="WhatsApp">WhatsApp Message</option>
            </select>
          </div>

          <div>
            <label className="label">Referred By Member Name (Optional)</label>
            <input className="input-field" placeholder="e.g. Amit Sureliya" value={referredBy} onChange={e => setReferredBy(e.target.value)} />
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-3 text-base">
            <FiSend size={18} /> SUBMIT GUEST REGISTRATION
          </button>
        </form>
      )}
    </div>
  );
}
