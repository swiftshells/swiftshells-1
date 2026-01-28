import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { AlertCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddMoney: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const { user, addNotification } = useApp();
  const navigate = useNavigate();

  const handleDeposit = () => {
    const val = parseFloat(amount);
    if (!val || val < 10) {
      addNotification("Minimum deposit is ৳10", "error");
      return;
    }
    navigate('/payment', { state: { amount: val } });
  };

  return (
    <div className="space-y-6 pb-24 animate-in slide-in-from-bottom duration-300">
      <GlassCard className="p-6 bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#ff8c00] rounded-2xl shadow-lg shadow-orange-200 dark:shadow-orange-900/20 text-white">
              <Zap size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 dark:text-white">Refill Wallet</h2>
              <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">Secure instant deposit</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-bold tracking-tighter">Current</p>
             <p className="text-lg font-black text-[#ff8c00]">৳{(user?.balance ?? 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase mb-3 block tracking-widest ml-1">Enter Amount</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-2xl text-[#ff8c00]">৳</span>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl py-6 pl-12 pr-6 text-3xl font-black focus:outline-none focus:border-[#ff8c00] transition-all placeholder:text-gray-200 dark:placeholder:text-slate-700 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[100, 500, 1000].map((v) => (
              <button 
                key={v}
                onClick={() => setAmount(v.toString())}
                className="py-3 px-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-200 dark:hover:border-orange-900/30 hover:text-[#ff8c00] transition-all active:scale-95"
              >
                +৳{v}
              </button>
            ))}
          </div>

          <button 
            onClick={handleDeposit}
            disabled={!amount || parseFloat(amount) < 10}
            className="w-full py-5 rounded-2xl bg-[#ff8c00] text-white hover:bg-[#e67e00] transition-all font-black text-xl shadow-xl shadow-orange-100 dark:shadow-orange-900/20 disabled:opacity-30 active:scale-[0.98] flex items-center justify-center gap-3"
          >
            Deposit Now
          </button>
        </div>
      </GlassCard>

      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 flex gap-3">
          <AlertCircle className="text-[#ff8c00] shrink-0" size={20} />
          <div className="space-y-1">
            <p className="text-sm font-bold text-orange-900 dark:text-orange-200">Payment Notice</p>
            <p className="text-xs text-orange-800 dark:text-orange-300 leading-relaxed font-medium">
              You will be redirected to our secure payment gateway to complete the transaction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};