
import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { History, ArrowUpRight, ArrowDownLeft, RefreshCcw } from 'lucide-react';

export const Transactions: React.FC = () => {
  const { transactions } = useApp();

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
         <h2 className="text-2xl font-black text-gray-800">Transactions</h2>
         <div className="p-2 bg-white rounded-full text-gray-300 shadow-sm"><RefreshCcw size={16} /></div>
      </div>

      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <History size={48} className="mx-auto text-gray-100" />
            <p className="text-gray-400 font-medium">No transactions found.</p>
          </div>
        ) : (
          transactions.map(tx => (
            <GlassCard key={tx.id} className="p-4 bg-white border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'Deposit' ? 'bg-emerald-50 text-emerald-500' : 
                  tx.type === 'Refund' ? 'bg-sky-50 text-sky-500' : 'bg-red-50 text-red-500'
                }`}>
                  {tx.type === 'Deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{tx.description}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-sm ${tx.type === 'Deposit' || tx.type === 'Refund' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {tx.type === 'Deposit' || tx.type === 'Refund' ? '+' : '-'}৳{tx.amount}
                </p>
                <span className="text-[8px] font-black uppercase text-gray-300 tracking-widest">{tx.type}</span>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
