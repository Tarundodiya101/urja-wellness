import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MEMBERS, ATTENDANCE, PAYMENTS, PRODUCTS, LEADS, GUESTS,
  WHATSAPP_MESSAGES, DAILY_CLOSING, PURCHASES, STOCK_ADJUSTMENTS,
  EXPENSES, AUDIT_LOGS, USERS, REFILL_REMINDERS, MEMBER_LEDGERS
} from '../data/mockData';

const AppContext = createContext(null);

function readStoredState(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readStoredState(key, fallback));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Unable to persist ${key} in this browser`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export function AppProvider({ children }) {
  const [user, setUser] = useStoredState('urja_user', { username: 'admin', name: 'Admin User', role: 'ADMIN' });
  const [members, setMembers] = useStoredState('urja_members', MEMBERS);
  const [attendance, setAttendance] = useStoredState('urja_attendance', ATTENDANCE);
  const [payments, setPayments] = useStoredState('urja_payments', PAYMENTS);
  const [products, setProducts] = useStoredState('urja_products', PRODUCTS);
  const [leads, setLeads] = useStoredState('urja_leads', LEADS);
  const [purchases, setPurchases] = useStoredState('urja_purchases', PURCHASES);
  const [expenses, setExpenses] = useStoredState('urja_expenses', EXPENSES);
  const [stockAdjustments, setStockAdjustments] = useStoredState('urja_adjustments', STOCK_ADJUSTMENTS);
  const [auditLogs, setAuditLogs] = useStoredState('urja_audit_logs', AUDIT_LOGS);
  const [usersList, setUsersList] = useStoredState('urja_users', USERS);
  const [guests, setGuests] = useStoredState('urja_guests', GUESTS);
  const [whatsappMessages, setWhatsappMessages] = useStoredState('urja_whatsapp_messages', WHATSAPP_MESSAGES);
  const [dailyClosing, setDailyClosing] = useStoredState('urja_daily_closing', DAILY_CLOSING);
  const [refillReminders, setRefillReminders] = useStoredState('urja_refill_reminders', REFILL_REMINDERS);
  const [memberLedgers, setMemberLedgers] = useStoredState('urja_member_ledgers', MEMBER_LEDGERS);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const logAudit = (action, details) => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      user: user?.name || 'System User',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = (username, password, role) => {
    if (username && typeof username === 'object') {
      setUser(username);
    } else {
      const found = usersList.find(u => u.username.toLowerCase() === (username || '').toLowerCase());
      if (found) setUser(found);
      else setUser({ username, role: role || 'ADMIN', name: username === 'admin' ? 'Admin User' : username });
    }
    logAudit('User Login', `Logged in as ${role || 'User'}`);
    return true;
  };

  const logout = () => {
    logAudit('User Logout', `User logged out`);
    setUser(null);
  };

  const addMember = (memberData) => {
    const nextNum = members.length + 1;
    const newMember = {
      ...memberData,
      id: `URJA-${String(nextNum).padStart(5, '0')}`,
      barcode: `890${String(nextNum).padStart(3, '0')}`,
      joiningDate: memberData.joiningDate || new Date().toISOString().split('T')[0],
      visitsCount: 0,
      status: memberData.status || 'Active',
      paid: Number(memberData.paid) || 0,
      pending: (Number(memberData.amount) || 0) - (Number(memberData.paid) || 0)
    };
    setMembers(prev => [newMember, ...prev]);
    logAudit('New Member Registered', `${newMember.name} (${newMember.id}) added`);
    return newMember;
  };

  const updateMember = (id, updates) => {
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
    logAudit('Member Profile Updated', `Member ${id} details updated`);
  };

  const deleteMember = (id) => {
    const m = members.find(x => x.id === id);
    setMembers(prev => prev.filter(x => x.id !== id));
    logAudit('Member Deleted', `Member ${m?.name} (${id}) deleted`);
  };

  const markAttendance = (record) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord = { ...record, id: `ATT${Date.now()}`, time: timeStr, date: record.date || new Date().toISOString().split('T')[0] };
    setAttendance(prev => [newRecord, ...prev]);
    
    // Update visits count
    setMembers(prev => prev.map(m => m.id === record.memberId ? { ...m, visitsCount: (m.visitsCount || 0) + 1 } : m));
    
    // Auto deduct product stock if shake selected
    if (record.shake) {
      setProducts(prev => prev.map(p => {
        if (p.name.toLowerCase().includes((record.shake || '').toLowerCase())) {
          const newStock = Math.max(0, p.currentStock - (record.shakeCount || 1));
          return {
            ...p,
            currentStock: newStock,
            status: newStock === 0 ? 'Out of Stock' : newStock <= p.minStock ? 'Low Stock' : 'Good Stock'
          };
        }
        return p;
      }));
    }
    logAudit('Attendance Marked', `${record.memberName} marked present`);
    return newRecord;
  };

  const addPayment = (paymentData) => {
    const receiptNo = `RCP-${Date.now().toString().slice(-4)}`;
    const newPayment = {
      ...paymentData,
      id: `PAY${Date.now()}`,
      receiptNo,
      date: paymentData.date || new Date().toISOString().split('T')[0],
      status: (paymentData.balanceDue || 0) <= 0 ? 'Paid' : 'Part Paid'
    };
    setPayments(prev => [newPayment, ...prev]);

    // Update member pending balance
    if (paymentData.memberId) {
      setMembers(prev => prev.map(m => {
        if (m.id === paymentData.memberId) {
          const newPaid = (m.paid || 0) + (paymentData.amount || 0);
          const newPending = Math.max(0, (m.amount || 0) - newPaid);
          return { ...m, paid: newPaid, pending: newPending, lastPaymentDate: newPayment.date };
        }
        return m;
      }));

      // Add entry to Member Ledger
      const ledgerEntry = {
        date: newPayment.date,
        particular: `${paymentData.type || 'Payment Received'} (${paymentData.mode})`,
        debit: 0,
        credit: paymentData.amount,
        balance: paymentData.balanceDue || 0,
        billNo: receiptNo
      };
      setMemberLedgers(prev => ({
        ...prev,
        [paymentData.memberId]: [...(prev[paymentData.memberId] || []), ledgerEntry]
      }));
    }

    logAudit('Payment Received', `₹${paymentData.amount} received from ${paymentData.memberName} (${paymentData.mode})`);
    return newPayment;
  };

  const addPurchase = (purchaseData) => {
    const newPurchase = { ...purchaseData, id: `PUR-${Date.now().toString().slice(-4)}` };
    setPurchases(prev => [newPurchase, ...prev]);

    // Auto increase stock for each purchased item
    if (purchaseData.items && purchaseData.items.length > 0) {
      setProducts(prev => prev.map(p => {
        const item = purchaseData.items.find(i => i.product === p.name);
        if (item) {
          const newStock = p.currentStock + Number(item.qty || 0);
          return {
            ...p,
            currentStock: newStock,
            batchNo: item.batchNo || p.batchNo,
            expiryDate: item.expiryDate || p.expiryDate,
            purchasePrice: Number(item.purchaseRate) || p.purchasePrice,
            status: newStock <= p.minStock ? 'Low Stock' : 'Good Stock'
          };
        }
        return p;
      }));
    }
    logAudit('Purchase Entry Added', `Invoice #${purchaseData.invoiceNo} from ${purchaseData.supplier} (₹${purchaseData.totalAmount})`);
  };

  const addStockAdjustment = (adjData) => {
    const newAdj = { ...adjData, id: `ADJ-${Date.now().toString().slice(-4)}`, date: new Date().toISOString().split('T')[0] };
    setStockAdjustments(prev => [newAdj, ...prev]);

    // Deduct stock
    setProducts(prev => prev.map(p => {
      if (p.name === adjData.product) {
        const newStock = Math.max(0, p.currentStock - Number(adjData.qty || 0));
        return {
          ...p,
          currentStock: newStock,
          status: newStock === 0 ? 'Out of Stock' : newStock <= p.minStock ? 'Low Stock' : 'Good Stock'
        };
      }
      return p;
    }));
    logAudit('Stock Adjusted', `${adjData.qty} ${adjData.product} adjusted (${adjData.reason})`);
  };

  const addExpense = (expenseData) => {
    const newExpense = { ...expenseData, id: `EXP-${Date.now().toString().slice(-4)}`, date: expenseData.date || new Date().toISOString().split('T')[0] };
    setExpenses(prev => [newExpense, ...prev]);
    logAudit('Expense Recorded', `₹${expenseData.amount} for ${expenseData.category}`);
  };

  const addUser = (userData) => {
    const newUser = { ...userData, id: `USR${String(usersList.length + 1).padStart(2, '0')}` };
    setUsersList(prev => [...prev, newUser]);
    logAudit('New User Added', `User ${userData.name} created as ${userData.role}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === today);
  const activeMembers = members.filter(m => m.status === 'Active');
  const totalOutstanding = members.reduce((sum, m) => sum + (m.pending || 0), 0);
  const todayCollection = payments.filter(p => p.date === today).reduce((sum, p) => sum + (p.amount || 0), 0);
  const lowStockItems = products.filter(p => p.currentStock <= p.minStock);
  const expiringProducts = products.filter(p => {
    if (!p.expiryDate) return false;
    const diffDays = (new Date(p.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 60;
  });
  const renewalsToday = members.filter(m => m.expiryDate === today);
  const todayBirthdays = members.filter(m => m.dob && m.dob.slice(5) === today.slice(5));

  const createBackup = () => ({
    format: 'urja-wellness-demo-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      user, members, attendance, payments, products, leads, purchases, expenses,
      stockAdjustments, auditLogs, usersList, guests, whatsappMessages,
      dailyClosing, refillReminders, memberLedgers,
    },
  });

  const restoreBackup = (snapshot: any) => {
    const data = snapshot?.data ?? snapshot;
    if (!data || typeof data !== 'object' || !Array.isArray(data.members) || !Array.isArray(data.products)) {
      throw new Error('This file is not a valid URJA backup.');
    }
    if ('user' in data) setUser(data.user);
    if ('members' in data) setMembers(data.members);
    if ('attendance' in data) setAttendance(data.attendance);
    if ('payments' in data) setPayments(data.payments);
    if ('products' in data) setProducts(data.products);
    if ('leads' in data) setLeads(data.leads);
    if ('purchases' in data) setPurchases(data.purchases);
    if ('expenses' in data) setExpenses(data.expenses);
    if ('stockAdjustments' in data) setStockAdjustments(data.stockAdjustments);
    if ('auditLogs' in data) setAuditLogs(data.auditLogs);
    if ('usersList' in data) setUsersList(data.usersList);
    if ('guests' in data) setGuests(data.guests);
    if ('whatsappMessages' in data) setWhatsappMessages(data.whatsappMessages);
    if ('dailyClosing' in data) setDailyClosing(data.dailyClosing);
    if ('refillReminders' in data) setRefillReminders(data.refillReminders);
    if ('memberLedgers' in data) setMemberLedgers(data.memberLedgers);
  };

  const value = {
    user, login, logout,
    createBackup, restoreBackup,
    members, addMember, updateMember, deleteMember,
    attendance, markAttendance,
    payments, addPayment,
    products, setProducts,
    purchases, addPurchase,
    stockAdjustments, addStockAdjustment,
    expenses, addExpense,
    auditLogs, logAudit,
    usersList, addUser,
    leads, setLeads,
    guests, setGuests,
    whatsappMessages, setWhatsappMessages,
    dailyClosing, setDailyClosing,
    refillReminders, setRefillReminders,
    memberLedgers,
    sidebarOpen, setSidebarOpen,
    notifications, setNotifications,
    // Computed
    todayAttendance, activeMembers, totalOutstanding,
    todayCollection, lowStockItems, expiringProducts, renewalsToday, todayBirthdays,
    today,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
