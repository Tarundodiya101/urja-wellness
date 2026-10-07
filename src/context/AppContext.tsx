import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  USERS, MEMBERS, MEMBER_MEASUREMENTS, MEMBER_PHOTOS, DAILY_WELLNESS_LOGS,
  ATTENDANCE_RECORDS, PAYMENT_TRANSACTIONS, PRODUCTS, FOLLOW_UP_LIST, WHATSAPP_TEMPLATES, PACKAGES, COACHES, LEADS
} from '../data/mockData';

const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'GUJ' | 'ENG'>(() => {
    const saved = localStorage.getItem('urja_master_lang');
    return (saved === 'GUJ' || saved === 'ENG') ? saved : 'GUJ';
  });

  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('urja_master_user');
    return saved ? JSON.parse(saved) : USERS[0]; // Default Owner
  });

  const [members, setMembers] = useState<any[]>(() => {
    const saved = localStorage.getItem('urja_master_members');
    return saved ? JSON.parse(saved) : MEMBERS;
  });

  const [measurements, setMeasurements] = useState<any>(() => {
    const saved = localStorage.getItem('urja_master_measurements');
    return saved ? JSON.parse(saved) : MEMBER_MEASUREMENTS;
  });

  const [photos, setPhotos] = useState<any>(() => {
    const saved = localStorage.getItem('urja_master_photos');
    return saved ? JSON.parse(saved) : MEMBER_PHOTOS;
  });

  const [wellnessLogs, setWellnessLogs] = useState<any>(() => {
    const saved = localStorage.getItem('urja_master_wellness');
    return saved ? JSON.parse(saved) : DAILY_WELLNESS_LOGS;
  });

  const [attendance, setAttendance] = useState<any[]>(() => {
    const saved = localStorage.getItem('urja_master_attendance');
    return saved ? JSON.parse(saved) : ATTENDANCE_RECORDS;
  });

  const [payments, setPayments] = useState<any[]>(() => {
    const saved = localStorage.getItem('urja_master_payments');
    return saved ? JSON.parse(saved) : PAYMENT_TRANSACTIONS;
  });

  const [products, setProducts] = useState<any[]>(() => {
    const saved = localStorage.getItem('urja_master_products');
    return saved ? JSON.parse(saved) : PRODUCTS;
  });

  const [followUps, setFollowUps] = useState<any[]>(() => {
    const saved = localStorage.getItem('urja_master_followups');
    return saved ? JSON.parse(saved) : FOLLOW_UP_LIST;
  });

  const [bills, setBills] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>(LEADS || []);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>(USERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('urja_master_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('urja_master_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('urja_master_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('urja_master_measurements', JSON.stringify(measurements)); }, [measurements]);
  useEffect(() => { localStorage.setItem('urja_master_photos', JSON.stringify(photos)); }, [photos]);
  useEffect(() => { localStorage.setItem('urja_master_wellness', JSON.stringify(wellnessLogs)); }, [wellnessLogs]);
  useEffect(() => { localStorage.setItem('urja_master_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('urja_master_payments', JSON.stringify(payments)); }, [payments]);

  const toggleLang = () => setLang(prev => prev === 'GUJ' ? 'ENG' : 'GUJ');
  const t = (gujText: string, engText: string) => lang === 'GUJ' ? gujText : engText;

  const login = (input: any, roleArg?: string) => {
    let uname = '';
    let selectedRole = roleArg || 'OWNER';

    if (typeof input === 'object' && input !== null) {
      uname = input.username || input.name || '';
      if (input.role) selectedRole = input.role;
    } else if (typeof input === 'string') {
      uname = input;
    }

    const cleanUname = String(uname).trim();
    const found = USERS.find(u => u.username.toLowerCase() === cleanUname.toLowerCase());
    if (found) {
      setUser({ ...found, role: selectedRole.toUpperCase() });
    } else {
      setUser({
        id: `USR${Date.now()}`,
        name: cleanUname || 'Admin User',
        username: cleanUname || 'admin',
        role: selectedRole.toUpperCase(),
        access: { all: true }
      });
    }
    return true;
  };

  const logout = () => setUser(null);

  const addMember = (m: any) => {
    const nextId = `URJA-${String(members.length + 1).padStart(5, '0')}`;
    const nextBarcode = `890${String(members.length + 1).padStart(3, '0')}`;
    const newMember = {
      ...m,
      id: nextId,
      barcode: nextBarcode,
      visitsCount: 0,
      status: m.status || 'Active',
      paid: Number(m.paid) || 0,
      pending: Math.max(0, (Number(m.amount) || 0) - (Number(m.paid) || 0))
    };
    setMembers(prev => [newMember, ...prev]);
    return newMember;
  };

  const updateMember = (id: string, updates: any) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const updated = { ...m, ...updates };
        if (updates.amount !== undefined || updates.paid !== undefined) {
          updated.pending = Math.max(0, (Number(updated.amount) || 0) - (Number(updated.paid) || 0));
        }
        return updated;
      }
      return m;
    }));
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  const markAttendance = (rec: any) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord = {
      ...rec,
      id: `ATT${Date.now()}`,
      time: timeStr,
      date: rec.date || new Date().toISOString().split('T')[0]
    };
    setAttendance(prev => [newRecord, ...prev]);
    setMembers(prev => prev.map(m => m.id === rec.memberId ? { ...m, visitsCount: (m.visitsCount || 0) + 1 } : m));
    return newRecord;
  };

  const addMeasurement = (memberId: string, mData: any) => {
    setMeasurements((prev: any) => ({
      ...prev,
      [memberId]: [...(prev[memberId] || []), mData]
    }));
  };

  const addPhoto = (memberId: string, pData: any) => {
    setPhotos((prev: any) => ({
      ...prev,
      [memberId]: [...(prev[memberId] || []), pData]
    }));
  };

  const addPayment = (pData: any) => {
    const receiptNo = `RCP-${Date.now().toString().slice(-4)}`;
    const newPay = {
      ...pData,
      id: `PAY${Date.now()}`,
      receiptNo,
      date: pData.date || new Date().toISOString().split('T')[0]
    };
    setPayments(prev => [newPay, ...prev]);

    if (pData.memberId) {
      setMembers(prev => prev.map(m => {
        if (m.id === pData.memberId) {
          const newPaid = (m.paid || 0) + (Number(pData.amount) || 0);
          const newPending = Math.max(0, (m.amount || 0) - newPaid);
          return { ...m, paid: newPaid, pending: newPending };
        }
        return m;
      }));
    }
    return newPay;
  };

  const deletePayment = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  const addBill = (b: any) => setBills(prev => [b, ...prev]);
  const deleteBill = (id: string) => setBills(prev => prev.filter(b => b.id !== id));
  const addExpense = (e: any) => setExpenses(prev => [e, ...prev]);
  const addPurchase = (p: any) => setPurchases(prev => [p, ...prev]);
  const addLead = (l: any) => setLeads(prev => [l, ...prev]);
  const addUser = (u: any) => setUsersList(prev => [u, ...prev]);

  // Derived Dashboard Metrics
  const activeMembers = members ? members.filter((m: any) => m.status === 'Active') : [];
  const todayAttendance = attendance || [];
  const totalOutstanding = members ? members.reduce((sum: number, m: any) => sum + (Number(m.pending) || 0), 0) : 0;
  const todayCollection = payments ? payments.reduce((sum: number, p: any) => sum + (Number(p.credit || p.amount) || 0), 0) : 0;
  const lowStockItems = products ? products.filter((p: any) => p.currentStock <= p.minStock || p.status === 'Low Stock' || p.status === 'Out of Stock') : [];
  const renewalsToday = members ? members.filter((m: any) => m.status === 'Expired' || m.status === 'Active') : [];
  const todayBirthdays = members ? members.slice(0, 2) : [];
  const refillReminders = members ? members.map((m: any) => ({
    memberId: m.id, memberName: m.name, mobile: m.mobile, product: 'F1 Shake', daysLeft: 4, expectedDate: '2025-10-05', status: 'Pending'
  })) : [];
  const expiringProducts = products ? products.filter((p: any) => p.status === 'Low Stock' || p.status === 'Out of Stock') : [];
  const memberLedgers: Record<string, any[]> = {};

  const value = {
    lang, setLang, toggleLang, t,
    user, login, logout,
    members, addMember, updateMember, deleteMember, activeMembers,
    measurements, addMeasurement,
    photos, addPhoto,
    wellnessLogs, setWellnessLogs,
    attendance, markAttendance, todayAttendance,
    payments, addPayment, deletePayment, todayCollection, totalOutstanding,
    products, setProducts, lowStockItems, expiringProducts,
    followUps, setFollowUps, renewalsToday, todayBirthdays, refillReminders, memberLedgers,
    bills, addBill, deleteBill,
    expenses, addExpense,
    purchases, addPurchase,
    leads, addLead,
    auditLogs,
    usersList, addUser,
    sidebarOpen, setSidebarOpen,
    packages: PACKAGES,
    coaches: COACHES,
    whatsappTemplates: WHATSAPP_TEMPLATES
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
