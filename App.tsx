import React, { useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext.tsx";
import { Home } from "./pages/Home.tsx";
import { Account } from "./pages/Account.tsx";
import { AddMoney } from "./pages/AddMoney.tsx";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { TopupPage } from "./pages/TopupPage.tsx";
import { Transactions } from "./pages/Transactions.tsx";
import { PaymentGateway } from "./pages/PaymentGateway.tsx";
import { AdminDashboard } from "./pages/AdminDashboard.tsx";
import { BottomNav } from "./components/BottomNav.tsx";
import { Sidebar } from "./components/Sidebar.tsx";
import {
  Menu,
  X,
  Bell,
  Crown,
  Zap,
  ShoppingBag,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Send,
  AlertCircle,
  CheckCircle2,
  Info,
  Sun,
  Moon,
  Monitor,
  Loader2,
  Shield,
} from "lucide-react";

const Footer: React.FC = () => (
  <footer className="bg-[#0a1128] dark:bg-black text-white p-8 space-y-12 pb-24 -mx-4 mt-8">
    <div className="space-y-4">
      <h3 className="text-xl font-black uppercase tracking-tight">
        Stay Connected
      </h3>
      <p className="text-xs text-white/50 leading-relaxed">
        কোন সমস্যায় পড়লে টেলিগ্রামে যোগাযোগ করবেন। তাহলে দ্রুত সমাধান পেয়ে
        যাবেন।
      </p>
      <div className="flex gap-4">
        {[Facebook, Instagram, Youtube, Mail].map((Icon, i) => (
          <div
            key={i}
            className="w-10 h-10 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Icon size={20} />
          </div>
        ))}
      </div>
    </div>
    <div className="space-y-6">
      <h3 className="text-xl font-black uppercase tracking-tight">
        Support Center
      </h3>
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-4">
        <div className="p-3 bg-sky-500 rounded-full">
          <Send size={24} className="fill-white" />
        </div>
        <div>
          <p className="font-bold text-sm">Help line [9AM-12PM]</p>
          <p className="text-xs text-white/40">টেলিগ্রামে সাপোর্ট</p>
        </div>
      </div>
    </div>
  </footer>
);

const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useApp();
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4 pointer-events-none space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`bg-white dark:bg-slate-800 border p-4 rounded-2xl shadow-2xl pointer-events-auto flex items-start gap-3 animate-in slide-in-from-top-4 duration-300 ${
            n.type === "error"
              ? "border-red-100 bg-red-50/30 dark:border-red-900/50 dark:bg-red-900/20"
              : n.type === "info"
                ? "border-sky-100 bg-sky-50/30 dark:border-sky-900/50 dark:bg-sky-900/20"
                : "border-orange-100 bg-orange-50/30 dark:border-orange-900/50 dark:bg-orange-900/20"
          }`}
        >
          <div
            className={`p-2 rounded-xl shrink-0 ${
              n.type === "error"
                ? "bg-red-500"
                : n.type === "info"
                  ? "bg-sky-500"
                  : "bg-[#ff8c00]"
            }`}
          >
            {n.type === "error" ? (
              <AlertCircle size={16} className="text-white" />
            ) : n.type === "info" ? (
              <Info size={16} className="text-white" />
            ) : (
              <CheckCircle2 size={16} className="text-white" />
            )}
          </div>
          <p
            className={`text-[13px] font-bold flex-1 py-1 ${
              n.type === "error"
                ? "text-red-800 dark:text-red-300"
                : n.type === "info"
                  ? "text-sky-800 dark:text-sky-300"
                  : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {n.message}
          </p>
          <button
            onClick={() => dismissNotification(n.id)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useApp();

  const toggle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <button
      onClick={toggle}
      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
      title={`Current theme: ${theme}`}
    >
      {theme === "light" ? (
        <Sun size={20} />
      ) : theme === "dark" ? (
        <Moon size={20} />
      ) : (
        <Monitor size={20} />
      )}
    </button>
  );
};

const OrdersList: React.FC = () => {
  const { orders } = useApp();
  const activeOrders = orders.filter(
    (o) => o.status === "Processing" || o.status === "Pending",
  );

  return (
    <div className="space-y-4">
      {activeOrders.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <ShoppingBag
            size={48}
            className="mx-auto text-gray-100 dark:text-slate-700"
          />
          <p className="text-gray-400 dark:text-slate-500 font-medium">
            No pending orders found.
          </p>
        </div>
      ) : (
        activeOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-5 rounded-2xl flex flex-col gap-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-gray-800 dark:text-gray-100">
                  {order.productName}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                  <span>{order.date}</span>
                  {order.playerId && (
                    <span className="text-gray-500 dark:text-gray-400 font-bold px-2 py-0.5 bg-gray-50 dark:bg-slate-700 rounded border border-gray-100 dark:border-slate-600">
                      ID: {order.playerId}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-lg text-[#ff8c00]">
                  ৳{order.amount}
                </p>
                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-wider bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400`}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isLoggedIn, user, isAuthReady, isAdmin } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#f4f7f9] dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-[#ffdd00] rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
          <img
            src="https://picsum.photos/100/100?random=mango"
            className="w-10 h-10 object-cover rounded-lg"
          />
        </div>
        <Loader2 className="animate-spin text-[#ff8c00]" size={32} />
      </div>
    );
  }

  return (
    <Router>
      <NotificationToast />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="max-w-xl mx-auto min-h-screen bg-[#f4f7f9] dark:bg-slate-950 flex flex-col relative overflow-x-hidden transition-colors duration-300">
          <header className="fixed top-0 left-0 right-0 z-40 max-w-xl mx-auto bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-4 h-16 flex items-center justify-between shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-700 dark:text-white"
              >
                <Menu size={24} />
              </button>
              <div className="w-10 h-10 bg-[#ffdd00] rounded-full flex items-center justify-center p-1 shadow-sm overflow-hidden">
                <img
                  src="https://picsum.photos/100/100?random=mango"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight leading-none">
                  <span className="text-[#2c3e50] dark:text-slate-100">
                    SwiftShells
                  </span>
                  <span className="text-[#ff8c00]">TOPUP</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <div className="px-2 py-1 bg-red-600 rounded text-[10px] font-black text-white tracking-wider flex items-center gap-1">
                  <Shield size={10} /> ADMIN
                </div>
              )}
              <ThemeToggle />
              <div className="bg-[#ff8c00] text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                <ShoppingBag size={14} />
                <span className="text-xs font-bold">
                  {(user?.balance ?? 0).toFixed(0)}৳
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 mt-20 px-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/topup/:id" element={<TopupPage />} />
              <Route path="/account" element={<Account />} />
              <Route path="/add-money" element={<AddMoney />} />
              <Route path="/payment" element={<PaymentGateway />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="/orders"
                element={
                  <div className="space-y-4 pb-24">
                    <h2 className="text-2xl font-black text-gray-800 dark:text-white">
                      Pending Orders
                    </h2>
                    <OrdersList />
                  </div>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
          </main>

          <BottomNav />
        </div>
      )}
    </Router>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
