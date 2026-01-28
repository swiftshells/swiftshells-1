
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, ShoppingBag, History, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/add-money', icon: PlusCircle, label: 'Add Money' },
    { to: '/orders', icon: ShoppingBag, label: 'My Orders' },
    { to: '/transactions', icon: History, label: 'History' },
    { to: '/account', icon: User, label: 'Account' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 px-4 pb-4 pt-2 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] transition-colors duration-300">
      <div className="flex justify-between items-center max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-[#ff8c00]' : 'text-gray-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
