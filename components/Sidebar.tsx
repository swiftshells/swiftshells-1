import React from 'react';
import { X, LogOut, FileText, CreditCard, MessageCircle, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, isAdmin } = useApp();
  const navigate = useNavigate();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <aside 
        className={`fixed top-0 left-0 h-full w-[280px] bg-[#0a0d2c] z-[70] transform transition-transform duration-300 ease-in-out border-r border-white/10 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">GameVault</h2>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
              <X size={24} className="text-white" />
            </button>
          </div>

          <div className="space-y-4">
            {isAdmin && (
              <button onClick={() => handleNav('/admin')} className="w-full flex items-center gap-4 p-3 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-lg transition-colors text-indigo-300">
                <Shield size={20} />
                <span className="font-bold">Admin Panel</span>
              </button>
            )}

            <button onClick={() => handleNav('/orders')} className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors text-gray-200">
              <FileText size={20} />
              <span>My Orders</span>
            </button>
            <button onClick={() => handleNav('/transactions')} className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors text-gray-200">
              <CreditCard size={20} />
              <span>My Transactions</span>
            </button>
            <button className="w-full flex items-center gap-4 p-3 hover:bg-white/5 rounded-lg transition-colors text-gray-200">
              <MessageCircle size={20} />
              <span>Contact Us</span>
            </button>
            <div className="h-[1px] bg-white/10 my-6" />
            <button 
              onClick={() => { logout(); onClose(); }}
              className="w-full flex items-center gap-4 p-3 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};