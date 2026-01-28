
import React, { useState, useEffect } from 'react';
import { ChevronRight, Bell, Zap, TrendingUp, User as UserIcon, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { Product } from '../types.ts';
import { useNavigate } from 'react-router-dom';

const banners = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80"
];

const hotProducts: Product[] = [
  { id: '1', name: '100% Bonus টপআপ ইভেন্ট', price: 0, image: 'https://picsum.photos/200/200?random=10', category: 'Hot' },
  { id: '2', name: 'Uid Topup [BD SERVER]', price: 20, image: 'https://picsum.photos/200/200?random=11', category: 'Hot' },
  { id: '3', name: 'UNIPIN VOUCHER (BDT)', price: 100, image: 'https://picsum.photos/200/200?random=12', category: 'Hot' },
  { id: '4', name: 'Weekly/Monthly', price: 175, image: 'https://picsum.photos/200/200?random=13', category: 'Hot' },
];

const games: Product[] = [
  { id: '5', name: 'Level Up Pass BD', price: 210, image: 'https://picsum.photos/200/200?random=14', category: 'Games' },
  { id: '6', name: 'PUBG MOBILE UC', price: 95, image: 'https://picsum.photos/200/200?random=15', category: 'Games' },
  { id: '7', name: 'Weekly Lite', price: 80, image: 'https://picsum.photos/200/200?random=16', category: 'Games' },
];

export const Home: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div 
      onClick={() => navigate(`/topup/${product.id}`)}
      className="flex flex-col items-center gap-2 cursor-pointer group"
    >
      <div className="w-full aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 p-1">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" 
        />
      </div>
      <h4 className="text-[12px] font-bold text-[#2c3e50] dark:text-slate-200 text-center leading-tight line-clamp-2 px-1">
        {product.name}
      </h4>
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Banner Carousel */}
      <div className="relative h-[160px] rounded-xl overflow-hidden shadow-md">
        {banners.map((banner, idx) => (
          <img
            key={idx}
            src={banner}
            alt="Promotion"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentBanner ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, idx) => (
            <div key={idx} className={`h-1 rounded-full transition-all ${idx === currentBanner ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* Marquee Notice */}
      <div className="bg-white dark:bg-slate-800 border-y border-gray-100 dark:border-slate-800 py-2 flex items-center gap-3 px-4 shadow-sm">
        <div className="bg-[#ff8c00]/10 p-1.5 rounded-lg">
          <Bell size={16} className="text-[#ff8c00]" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-[13px] font-medium text-gray-600 dark:text-gray-300">
            🔥 100% Bonus Topup Event is Live! • Instant Delivery for all BD Server Top-ups • Trusted by 50k+ Gamers.
          </div>
        </div>
      </div>

      {/* Hot Product Section */}
      <section>
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-xl font-extrabold text-[#2c3e50] dark:text-white tracking-tight uppercase">HOT PRODUCT</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {hotProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Games Section */}
      <section>
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-xl font-extrabold text-[#2c3e50] dark:text-white tracking-tight uppercase">Games</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {games.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Install App Banner */}
      <div className="bg-[#ff8c00] rounded-xl p-4 flex items-center justify-between shadow-lg text-white">
        <div className="flex items-center gap-3">
          <Zap className="fill-white" size={24} />
          <div>
            <p className="font-bold text-sm">Install App</p>
            <p className="text-[10px] opacity-80">Get best experience on mobile</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-white text-[#ff8c00] px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">Install</button>
          <button className="text-white/80 p-1"><ChevronRight size={18} /></button>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-150%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
