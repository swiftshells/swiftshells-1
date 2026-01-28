
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
}

export interface Order {
  id: string;
  productName: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Completed' | 'Processing' | 'Cancelled';
  playerId?: string;
  email?: string; // Added for admin view
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Refund' | 'Purchase';
  amount: number;
  date: string;
  description: string;
  userEmail?: string; // Added for Admin Dashboard
  trxId?: string; // Added for Deposit tracking
}

export interface User {
  id: string; 
  name: string;
  email: string;
  phone: string;
  balance: number;
  supportPin: string;
  isVerified: boolean;
  role: 'user' | 'admin';
}