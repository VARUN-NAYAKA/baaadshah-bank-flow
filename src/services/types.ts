
// Common types for the banking application

// Interface for user data
export interface User {
  id: string;
  phone: string;
  username: string;
  fullName: string;
  age: number;
  address: string;
  pin: string;
  createdAt: string;
}

// Interface for account data
export interface Account {
  id: string;
  user_id: string;
  balance: number;
  account_number: string;
  created_at: string;
  updated_at: string;
}

// Interface for transaction data
export interface Transaction {
  id: string;
  sender_id: string;
  receiver_id: string | null;
  amount: number;
  description: string;
  transaction_type: 'credit' | 'debit' | 'transfer';
  created_at: string;
}

// Interface for user session
export interface UserSession {
  user: User;
  account: Account;
  expiresAt: string;
}
