import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { Check, X, Shield, RefreshCcw, Loader2, Search, Package, ArrowLeftRight, Clock, DollarSign, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order, Transaction } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, fetchAllOrders, fetchAllTransactions, adminManageOrder } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'orders' | 'transactions'>('orders');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminTransactions, setAdminTransactions] = useState<Transaction[]>([]);
  
  // UI State
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  // Initial Load and Auth Check
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    } else {
      refreshAllData();
    }
  }, [isAdmin, navigate]);

  // Real-time Simulation (Polling every 10s)
  useEffect(() => {
    const timer = setInterval(() => {
      refreshAllData(true);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const refreshAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [ordersData, transactionsData] = await Promise.all([
        fetchAllOrders(),
        fetchAllTransactions()
      ]);
      setAdminOrders(ordersData);
      setAdminTransactions(transactionsData);
    } catch (e) {
      console.error("Failed to load admin data");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: string, action: 'confirm' | 'cancel') => {
    setActionLoading(orderId);
    
    // Optimistic Update: Immediately mark it as processed in UI to prevent "stuck" feeling
    const previousOrders = [...adminOrders];
    setAdminOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: action === 'confirm' ? 'Completed' : 'Cancelled' } : o
    ));

    const success = await adminManageOrder(orderId, action);
    
    if (success) {
      // Success: Fetch latest data to ensure consistency
      await refreshAllData(true);
    } else {
      // Revert if failed
      setAdminOrders(previousOrders);
    }
    
    setActionLoading(null);
  };

  // Filter logic: Only show Processing orders in the Orders tab
  const pendingOrders = adminOrders.filter(o => o.status === 'Processing');
  const filteredOrders = pendingOrders.filter(o => 
    o.productName.toLowerCase().includes(filter.toLowerCase()) || 
    o.playerId?.toLowerCase().includes(filter.toLowerCase()) ||
    o.email?.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredTransactions = adminTransactions.filter(t => 
    t.description.toLowerCase().includes(filter.toLowerCase()) || 
    t.userEmail?.toLowerCase().includes(filter.toLowerCase()) ||
    t.trxId?.toLowerCase().includes(filter.toLowerCase())
  );

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-950 -mx-4 pb-20">
      {/* Admin Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-16 z-30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
               <Shield className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">ADMIN CONSOLE</h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">System Live</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => refreshAllData()} 
            disabled={loading}
            className="p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'orders' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package size={16} />
            Orders
            {pendingOrders.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md min-w-[18px]">{pendingOrders.length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'transactions' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeftRight size={16} />
            History
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={activeTab === 'orders' ? "Search Order ID, Player, Email..." : "Search TrxID, User..."}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-600"
          />
        </div>

        {loading && !filteredOrders.length && !filteredTransactions.length ? (
           <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 className="animate-spin text-indigo-500" size={40} />
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Fetching Data...</p>
           </div>
        ) : (
          <>
            {/* --- ORDERS TAB --- */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="py-20 text-center space-y-4 border border-dashed border-slate-800 rounded-2xl">
                    <Package size={48} className="mx-auto text-slate-800" />
                    <p className="text-slate-600 font-medium">No pending orders.</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {/* Order Header */}
                      <div className="bg-slate-800/50 px-4 py-3 flex justify-between items-center border-b border-slate-800">
                        <span className="text-xs font-mono text-slate-500">#{order.id}</span>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock size={12} />
                          {order.date}
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Product & User */}
                        <div className="mb-4">
                          <h4 className="font-bold text-white text-lg mb-1">{order.productName}</h4>
                          <p className="text-xs text-indigo-400 font-mono mb-3">{order.email}</p>
                          
                          {order.playerId && (
                             <div className="bg-black/40 border border-slate-700 rounded-lg p-2.5 flex items-center gap-3">
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Player ID</span>
                                <span className="text-emerald-400 font-mono font-bold select-all">{order.playerId}</span>
                             </div>
                          )}
                        </div>

                        {/* Actions Footer */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-800">
                           <div className="mr-auto">
                              <p className="text-[10px] text-slate-500 font-bold uppercase">Amount</p>
                              <p className="text-lg font-black text-white">৳{order.amount}</p>
                           </div>
                           
                           <button 
                             onClick={() => handleOrderAction(order.id, 'cancel')}
                             disabled={!!actionLoading}
                             className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 disabled:opacity-50"
                           >
                             {actionLoading === order.id ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
                           </button>
                           
                           <button 
                             onClick={() => handleOrderAction(order.id, 'confirm')}
                             disabled={!!actionLoading}
                             className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 disabled:opacity-50"
                           >
                             {actionLoading === order.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                             <span>Complete</span>
                           </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* --- TRANSACTIONS TAB --- */}
            {activeTab === 'transactions' && (
              <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                  <div className="py-20 text-center space-y-4 border border-dashed border-slate-800 rounded-2xl">
                    <ArrowLeftRight size={48} className="mx-auto text-slate-800" />
                    <p className="text-slate-600 font-medium">No transaction history found.</p>
                  </div>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div key={tx.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                       {/* Icon */}
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                         tx.type === 'Deposit' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                         tx.type === 'Purchase' ? 'bg-orange-500/10 border-orange-500/20 text-orange-500' :
                         'bg-blue-500/10 border-blue-500/20 text-blue-500'
                       }`}>
                          {tx.type === 'Deposit' ? <Wallet size={18} /> : 
                           tx.type === 'Purchase' ? <Package size={18} /> : <ArrowLeftRight size={18} />}
                       </div>

                       {/* Info */}
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                             <h5 className="text-slate-200 font-bold text-sm truncate pr-2">{tx.userEmail}</h5>
                             <span className={`text-sm font-black whitespace-nowrap ${
                               tx.type === 'Deposit' || tx.type === 'Refund' ? 'text-emerald-400' : 'text-slate-200'
                             }`}>
                               {tx.type === 'Deposit' || tx.type === 'Refund' ? '+' : '-'}৳{tx.amount}
                             </span>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="flex flex-col">
                               <span className="text-[10px] text-slate-500 font-mono">{tx.trxId || tx.id}</span>
                               <span className="text-[10px] text-slate-600">{tx.date}</span>
                             </div>
                             <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                               tx.type === 'Deposit' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-400'
                             }`}>
                               {tx.type}
                             </span>
                          </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};