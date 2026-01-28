import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Order, Product, Transaction } from '../types.ts';
import { supabase } from '../lib/supabase.ts';

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface PlaceOrderResponse {
  success: boolean;
  error?: 'insufficient_balance' | 'database_error' | 'auth_error' | string;
}

export type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
  user: User | null;
  orders: Order[];
  transactions: Transaction[];
  isLoggedIn: boolean;
  isAuthReady: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  addMoney: (amount: number) => Promise<{success: boolean, message?: string}>;
  verifyTransaction: (amount: number, trxId: string, method: string) => Promise<{success: boolean, message: string}>;
  placeOrder: (product: Product, playerId: string) => Promise<PlaceOrderResponse>;
  cancelOrder: (orderId: string) => Promise<boolean>;
  adminManageOrder: (orderId: string, action: 'confirm' | 'cancel') => Promise<boolean>;
  notifications: AppNotification[];
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissNotification: (id: string) => void;
  isSyncing: boolean;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  refreshUserData: () => Promise<void>;
  fetchAllOrders: () => Promise<Order[]>; // Admin function
  fetchAllTransactions: () => Promise<Transaction[]>; // Admin function
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 11);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const fetchUserData = useCallback(async (email: string, uid: string) => {
    setIsSyncing(true);
    try {
      let { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).maybeSingle();
      
      if (profile) {
        setUser({
          id: profile.id,
          name: profile.full_name || profile.name || email.split('@')[0],
          email: profile.email,
          phone: profile.phone || '',
          balance: parseFloat(profile.balance || 0),
          supportPin: profile.support_pin || '0000',
          isVerified: profile.is_verified ?? false,
          role: profile.role || 'user'
        });
      } else {
        setUser({
          id: uid,
          name: email.split('@')[0],
          email: email,
          phone: '',
          balance: 0,
          supportPin: '0000',
          isVerified: false,
          role: 'user'
        });
      }

      // Fetch personal orders
      const { data: userOrders } = await supabase.from('orders').select('*')
        .eq('email', email) // Explicitly filter by email for normal user view
        .order('created_at', { ascending: false });
        
      if (userOrders) {
        setOrders(userOrders.map((o: any) => ({
          id: o.id.toString(),
          productName: o["product name"] || o.product_name,
          amount: parseFloat(o.amount || 0),
          date: o.date || new Date(o.created_at).toLocaleDateString(),
          status: o.status || 'Processing',
          playerId: o.player_id,
          email: o.email
        })));
      }

      const { data: userTx } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
      if (userTx) {
        setTransactions(userTx.map((t: any) => ({
          id: t.id.toString(),
          type: t.type,
          amount: parseFloat(t.amount),
          date: new Date(t.created_at).toLocaleString(),
          description: t.description || ''
        })));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsSyncing(false);
    }
  }, []); 

  const refreshUserData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchUserData(session.user.email!, session.user.id);
    }
  }, [fetchUserData]);

  useEffect(() => {
    let mounted = true;
    
    // Safety timeout to prevent infinite loading state
    const timeoutId = setTimeout(() => {
      if (mounted) {
        setIsAuthReady(current => {
          if (!current) console.warn("Auth initialization timed out, forcing ready state");
          return true;
        });
      }
    }, 3000);

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          setIsLoggedIn(true);
          await fetchUserData(session.user.email!, session.user.id);
        }
      } catch (error) {
        console.error("Auth init error", error);
      } finally {
        if (mounted) setIsAuthReady(true);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setIsLoggedIn(true);
        // Do not await here to avoid blocking the auth state change
        fetchUserData(session.user.email!, session.user.id);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setOrders([]);
        setTransactions([]);
      }
      setIsAuthReady(true);
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const verifyTransaction = async (amount: number, trxId: string, method: string) => {
    if (!user) return { success: false, message: 'Auth error' };
    
    try {
      const { data, error } = await supabase.rpc('verify_deposit_atomic', {
        p_amount: amount,
        p_trx_id: trxId,
        p_method: method
      });

      if (error) {
        console.error("RPC Error:", error);
        throw error;
      }
      
      if (data.success) {
        await refreshUserData();
        addNotification(`৳${amount} added successfully!`, "success");
        return { success: true, message: 'Verification successful' };
      } else {
        const msg = data.error === 'duplicate_trx_id' ? 'This Transaction ID has already been used.' : 'Failed to verify transaction.';
        return { success: false, message: msg };
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Database error' };
    }
  };

  const addMoney = async (amount: number) => {
    const dummyTrx = 'INST-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    return await verifyTransaction(amount, dummyTrx, 'Instant Payment');
  };

  const placeOrder = async (product: Product, playerId: string): Promise<PlaceOrderResponse> => {
    if (!user) {
      addNotification("Please login to place an order.", "error");
      return { success: false, error: 'auth_error' };
    }
    
    try {
      const { data, error } = await supabase.rpc('place_order_atomic', {
        p_product_name: product.name,
        p_amount: product.price,
        p_player_id: playerId
      });

      if (error) {
        console.error("Order RPC Error:", error);
        throw error;
      }

      if (data.success) {
        await refreshUserData();
        addNotification(`Order for ${product.name} placed!`, "success");
        return { success: true };
      } else {
        if (data.error === 'insufficient_balance') {
          addNotification("Insufficient balance! Please refill your wallet.", "error");
        } else {
          addNotification("Order failed: " + data.error, "error");
        }
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      addNotification("Failed to place order. Try again later.", "error");
      return { success: false, error: err.message || 'database_error' };
    }
  };

  const cancelOrder = async (orderId: string): Promise<boolean> => {
    try {
      const { data: success } = await supabase.rpc('cancel_my_order', { order_id_param: parseInt(orderId) });
      if (success) {
        await refreshUserData();
        addNotification("Order cancelled and refunded.", "success");
        return true;
      }
      return false;
    } catch (err) { 
      return false; 
    }
  };

  // Admin function to fetch all orders
  const fetchAllOrders = async (): Promise<Order[]> => {
    if (user?.role !== 'admin') return [];
    
    const { data: allOrders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    
    if (allOrders) {
      return allOrders.map((o: any) => ({
        id: o.id.toString(),
        productName: o["product name"] || o.product_name,
        amount: parseFloat(o.amount || 0),
        date: o.date || new Date(o.created_at).toLocaleDateString(),
        status: o.status || 'Processing',
        playerId: o.player_id,
        email: o.email
      }));
    }
    return [];
  };

  // Admin function to fetch all transactions (with simple join simulation)
  const fetchAllTransactions = async (): Promise<Transaction[]> => {
    if (user?.role !== 'admin') return [];

    try {
      // 1. Fetch transactions
      const { data: txs, error } = await supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      if (!txs || txs.length === 0) return [];

      // 2. Extract unique user IDs
      const userIds = Array.from(new Set(txs.map((t: any) => t.user_id)));

      // 3. Fetch profiles for those IDs
      const { data: profiles, error: pError } = await supabase.from('profiles').select('id, email').in('id', userIds);
      if (pError) throw pError;

      // 4. Map profiles to a dictionary for fast lookup
      const profileMap: Record<string, string> = {};
      profiles?.forEach((p: any) => {
        profileMap[p.id] = p.email;
      });

      // 5. Merge data
      return txs.map((t: any) => ({
        id: t.id.toString(),
        type: t.type,
        amount: parseFloat(t.amount),
        date: new Date(t.created_at).toLocaleString(),
        description: t.description || '',
        trxId: t.trx_id,
        userEmail: profileMap[t.user_id] || 'Unknown'
      }));

    } catch (err) {
      console.error("Admin Fetch TX Error", err);
      return [];
    }
  };

  // Admin function to confirm or cancel
  const adminManageOrder = async (orderId: string, action: 'confirm' | 'cancel'): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('admin_manage_order', { 
        p_order_id: parseInt(orderId), 
        p_action: action 
      });
      
      if (error) throw error;

      if (data.success) {
        addNotification(`Order ${action}ed successfully.`, "success");
        return true;
      } else {
        addNotification(`Failed: ${data.error}`, "error");
        return false;
      }
    } catch (err: any) {
      addNotification(err.message || "Admin action failed", "error");
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ 
      user, orders, transactions, isLoggedIn, isAuthReady,
      isAdmin: user?.role === 'admin',
      login: () => setIsLoggedIn(true), 
      logout: async () => { await supabase.auth.signOut(); }, 
      addMoney, verifyTransaction, placeOrder, cancelOrder, 
      notifications, addNotification, dismissNotification,
      isSyncing, theme, setTheme, refreshUserData,
      fetchAllOrders, fetchAllTransactions, adminManageOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};