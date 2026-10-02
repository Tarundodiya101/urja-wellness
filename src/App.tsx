import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Attendance from './pages/Attendance';
import CenterConsumption from './pages/CenterConsumption';
import Billing from './pages/Billing';
import Payments from './pages/Payments';
import MemberLedger from './pages/MemberLedger';
import Purchases from './pages/Purchases';
import Inventory from './pages/Inventory';
import RefillReminder from './pages/RefillReminder';
import FollowUpCRM from './pages/FollowUpCRM';
import Expenses from './pages/Expenses';
import DailyClosing from './pages/DailyClosing';
import Reports from './pages/Reports';
import WhatsApp from './pages/WhatsApp';
import UserManagement from './pages/UserManagement';
import AuditLog from './pages/AuditLog';
import DataBackup from './pages/DataBackup';
import MemberApp from './pages/MemberApp';
import CoachApp from './pages/CoachApp';
import GuestRegister from './pages/GuestRegister';

function ProtectedLayout({ children }) {
  const { user, sidebarOpen, setSidebarOpen } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user } = useApp();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      
      {/* Management Panel Routes */}
      <Route path="/dashboard" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
      <Route path="/members" element={<ProtectedLayout><Members /></ProtectedLayout>} />
      <Route path="/attendance" element={<ProtectedLayout><Attendance /></ProtectedLayout>} />
      <Route path="/consumption" element={<ProtectedLayout><CenterConsumption /></ProtectedLayout>} />
      <Route path="/billing" element={<ProtectedLayout><Billing /></ProtectedLayout>} />
      <Route path="/payments" element={<ProtectedLayout><Payments /></ProtectedLayout>} />
      <Route path="/ledger" element={<ProtectedLayout><MemberLedger /></ProtectedLayout>} />
      <Route path="/purchases" element={<ProtectedLayout><Purchases /></ProtectedLayout>} />
      <Route path="/inventory" element={<ProtectedLayout><Inventory /></ProtectedLayout>} />
      <Route path="/refill" element={<ProtectedLayout><RefillReminder /></ProtectedLayout>} />
      <Route path="/refill-reminder" element={<ProtectedLayout><RefillReminder /></ProtectedLayout>} />
      <Route path="/crm" element={<ProtectedLayout><FollowUpCRM /></ProtectedLayout>} />
      <Route path="/expenses" element={<ProtectedLayout><Expenses /></ProtectedLayout>} />
      <Route path="/closing" element={<ProtectedLayout><DailyClosing /></ProtectedLayout>} />
      <Route path="/daily-closing" element={<ProtectedLayout><DailyClosing /></ProtectedLayout>} />
      <Route path="/reports" element={<ProtectedLayout><Reports /></ProtectedLayout>} />
      <Route path="/whatsapp" element={<ProtectedLayout><WhatsApp /></ProtectedLayout>} />
      <Route path="/users" element={<ProtectedLayout><UserManagement /></ProtectedLayout>} />
      <Route path="/audit-log" element={<ProtectedLayout><AuditLog /></ProtectedLayout>} />
      <Route path="/backup" element={<ProtectedLayout><DataBackup /></ProtectedLayout>} />

      {/* Mobile Application Portals (Specification Sections 32 & 33 & 37) */}
      <Route path="/member-app" element={<ProtectedLayout><MemberApp /></ProtectedLayout>} />
      <Route path="/coach-app" element={<ProtectedLayout><CoachApp /></ProtectedLayout>} />
      <Route path="/guest-register" element={<ProtectedLayout><GuestRegister /></ProtectedLayout>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
