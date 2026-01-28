import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import { ArrowLeft, Lock, Loader2, CreditCard, ShieldCheck, CheckCircle2, Copy, Zap, ShieldAlert } from 'lucide-react';

export const PaymentGateway: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { verifyTransaction, addNotification, addMoney } = useApp();
  const amount = state?.amount || 0;

  const [method, setMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'selection' | 'manual_instruction' | 'processing'>('selection');
  const [trxId, setTrxId] = useState('');

  const merchantNumber = "01893758095";

  useEffect(() => {
    if (!amount) navigate('/add-money');
  }, [amount, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(merchantNumber);
    addNotification("Number copied to clipboard!", "success");
  };

  const handleProceedToManual = () => {
    if (method === 'card') {
      handleInstantPay();
    } else {
      setStep('manual_instruction');
    }
  };

  const handleInstantPay = async () => {
    setStep('processing');
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const res = await addMoney(amount);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate('/transactions'), 2000);
      } else {
        setStep('selection');
        addNotification(res.message || "Payment failed", "error");
      }
    } catch (error) {
      setStep('selection');
      addNotification("Payment failed due to an error.", "error");
    }
  };

  const handleVerifyTrx = async () => {
    if (trxId.length < 8) {
      addNotification("Please enter a valid Transaction ID", "error");
      return;
    }
    setLoading(true);
    
    // Call the database-backed verification
    const result = await verifyTransaction(amount, trxId, method);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } else {
      setLoading(false);
      addNotification(result.message, "error");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-4">
        <div className="text-center space-y-4 animate-in zoom-in duration-300">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
            <CheckCircle2 size={48} className="text-white" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Recharge Success!</h2>
            <p className="text-gray-500 dark:text-slate-400 font-medium">৳{amount} has been added to your balance.</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-100 dark:border-slate-800 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-[#ff8c00] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="text-[#ff8c00]" size={32} />
            </div>
        </div>
        <div className="space-y-3">
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Processing</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xs mx-auto">
                Communicating with secure bank servers. Please wait...
            </p>
        </div>
      </div>
    );
  }

  const methods = [
    { id: 'bkash', name: 'bKash', img: 'https://freepnglogo.com/images/all_img/1701670291bkash-app-logo-png.png' },
    { id: 'nagad', name: 'Nagad', img: 'https://freepnglogo.com/images/all_img/1701669440nagad-app-logo.png' },
    { id: 'rocket', name: 'Rocket', img: 'https://seeklogo.com/images/D/dutch-bangla-rocket-logo-B4D1CC458D-seeklogo.com.png' },
    { id: 'card', name: 'Card', icon: CreditCard },
  ];

  if (step === 'manual_instruction') {
    return (
      <div className="fixed inset-0 bg-[#f4f7f9] dark:bg-slate-950 flex flex-col z-[100] transition-colors duration-300">
        <header className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 p-4 flex items-center gap-4 shrink-0 shadow-sm">
          <button onClick={() => setStep('selection')} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
              <img src={methods.find(m => m.id === method)?.img} className="w-full h-full object-contain" alt={method} />
            </div>
            <span className="font-black text-gray-800 dark:text-white uppercase text-sm tracking-tight">Manual Checkout</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-64 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-[20px] shadow-sm flex justify-between items-center">
             <div>
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Payable Amount</p>
                <h2 className="text-3xl font-black text-gray-800 dark:text-white">৳ {amount}</h2>
             </div>
             <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center text-[#ff8c00]">
                <Zap size={24} />
             </div>
          </div>

          <div className="bg-[#D82A6C] text-white rounded-[28px] p-6 shadow-2xl space-y-6 animate-in slide-in-from-bottom-6 duration-500">
            <div className="text-center">
               <h3 className="text-xl font-black uppercase tracking-tight">ট্রানজেকশন আইডি দিন</h3>
            </div>

            <div className="bg-white/10 p-1 rounded-2xl backdrop-blur-sm">
              <div className="bg-white rounded-xl overflow-hidden shadow-inner">
                 <input 
                   type="text"
                   value={trxId}
                   onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                   placeholder="TrxID এখানে লিখুন"
                   className="w-full p-5 text-center text-xl text-gray-900 font-black focus:outline-none placeholder:text-gray-200"
                 />
              </div>
            </div>

            <ul className="space-y-4 text-[13px] font-semibold leading-relaxed">
               <li className="flex gap-3 items-start">
                 <div className="w-2 h-2 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                 <p>*247# ডায়াল করে অথবা <span className="underline decoration-white/40">{method}</span> অ্যাপ ব্যবহার করুন।</p>
               </li>
               <li className="flex gap-3 items-start">
                 <div className="w-2 h-2 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                 <p><span className="text-yellow-300 font-black">"Send Money"</span> অপশনে যান।</p>
               </li>
               <li className="flex gap-3 items-center">
                 <div className="w-2 h-2 rounded-full bg-white shrink-0 shadow-sm" />
                 <div className="flex-1 flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/10">
                    <p className="font-bold">নম্বর: <span className="text-yellow-300 font-black">{merchantNumber}</span></p>
                    <button onClick={handleCopy} className="bg-white text-[#D82A6C] px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm active:scale-90 transition-transform">
                       <Copy size={14} />
                       <span className="text-[10px] font-black uppercase">Copy</span>
                    </button>
                 </div>
               </li>
               <li className="flex gap-3 items-start">
                 <div className="w-2 h-2 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                 <p>টাকার পরিমাণঃ <span className="text-yellow-300 font-black">৳{amount}</span></p>
               </li>
               <li className="flex gap-3 items-start">
                 <div className="w-2 h-2 rounded-full bg-white mt-1.5 shrink-0 shadow-sm" />
                 <p>পেমেন্ট সফল হলে প্রাপ্ত <span className="text-yellow-300 font-black">TrxID</span> কপি করে উপরের বক্সে দিন এবং ভেরিফাই করুন।</p>
               </li>
            </ul>
          </div>
        </div>

        {/* Improved Footer with Safe Area Support */}
        <div className="bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] fixed bottom-0 left-0 right-0 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] transition-colors duration-300">
           <button 
             onClick={handleVerifyTrx}
             disabled={loading || !trxId}
             className="w-full py-5 bg-[#C90000] hover:bg-[#a00000] text-white font-black text-xl rounded-2xl shadow-xl shadow-red-500/30 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 relative z-[60]"
           >
             {loading ? <Loader2 className="animate-spin" size={24} /> : 'VERIFY TRANSACTION'}
           </button>
           <p className="text-center mt-4 text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
              <ShieldAlert size={12} /> SECURE SMS AUTOMATION ENABLED
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f9] dark:bg-slate-950 transition-colors duration-300">
      <header className="fixed top-0 left-0 right-0 z-40 max-w-xl mx-auto bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-4 h-16 flex items-center justify-between shadow-sm transition-colors duration-300">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-gray-300">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-black text-[#2c3e50] dark:text-white tracking-tight uppercase">Checkout</h1>
        <div className="w-10"></div>
      </header>

      <div className="pt-20 p-4 max-w-lg mx-auto space-y-6">
        <div className="bg-[#ff8c00] text-white p-6 rounded-2xl shadow-lg shadow-orange-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-orange-100 text-xs font-bold uppercase tracking-widest mb-1">Total Payable</p>
            <h2 className="text-4xl font-black">৳{amount}</h2>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Zap size={120} />
          </div>
        </div>

        <section className="space-y-3">
           <h3 className="text-xs font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-1">Select Wallet</h3>
           <div className="grid grid-cols-4 gap-3">
             {methods.map(m => (
               <div 
                 key={m.id}
                 onClick={() => setMethod(m.id as any)}
                 className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                   method === m.id 
                     ? 'border-[#ff8c00] bg-white dark:bg-slate-900 shadow-lg' 
                     : 'border-white dark:border-slate-900 bg-white/50 dark:bg-slate-900/50 grayscale opacity-40'
                 }`}
               >
                 {m.img ? (
                   <img src={m.img} alt={m.name} className="w-8 h-8 object-contain" />
                 ) : (
                   <CreditCard size={24} className="text-gray-400" />
                 )}
                 <span className={`text-[9px] font-black uppercase tracking-tighter ${method === m.id ? 'text-[#ff8c00]' : 'text-gray-400'}`}>{m.name}</span>
               </div>
             ))}
           </div>
        </section>

        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-50 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-gray-100 dark:border-slate-800">
               {methods.find(m => m.id === method)?.img ? (
                 <img src={methods.find(m => m.id === method)?.img} className="w-8 h-8 object-contain" />
               ) : (
                 <CreditCard className="text-gray-400" size={20} />
               )}
            </div>
            <div>
                <p className="font-black text-gray-800 dark:text-white uppercase tracking-tight">{methods.find(m => m.id === method)?.name} Gateway</p>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                    <Lock size={10} /> Secure Transfer
                </p>
            </div>
          </div>

          <button 
            onClick={handleProceedToManual}
            className="w-full py-5 bg-[#ff8c00] hover:bg-[#e67e00] text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <span>Proceed to Pay ৳{amount}</span>
          </button>
        </GlassCard>

        <div className="flex flex-col items-center gap-3 py-4 text-gray-400 dark:text-slate-600">
            <div className="flex items-center gap-1.5">
                <ShieldAlert size={12} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Authorized Transaction</span>
            </div>
        </div>
      </div>
    </div>
  );
};