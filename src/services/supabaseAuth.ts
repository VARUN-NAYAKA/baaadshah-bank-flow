
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

// Interface for user data
export interface User {
  id: string;
  phone: string;
  username: string;
  full_name: string;
  age: number;
  address: string;
  pin: string;
  created_at: string;
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

// Check if a phone number is already registered
export const checkPhoneExists = async (phone: string) => {
  try {
    const { data, error } = await supabase
      .rpc('check_phone_exists', { phone_param: phone });
    
    if (error) {
      throw new Error(`Error checking phone: ${error.message}`);
    }
    
    return data;
  } catch (error: any) {
    console.error("Error checking if phone exists:", error.message);
    return false;
  }
};

// Generate a random 15-digit account number
const generateAccountNumber = () => {
  return Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
};

// Register a new user
export const registerUser = async (userData: {
  phone: string;
  username: string;
  full_name: string;
  age: number;
  address: string;
  pin: string;
}) => {
  // Check if phone number already exists
  const phoneExists = await checkPhoneExists(userData.phone);
  if (phoneExists) {
    throw new Error('A user with this phone number already exists');
  }

  // Create a unique ID for the user
  const userId = uuidv4();

  // Insert user record using raw SQL via RPC function to avoid type issues
  const { data: userData1, error: userError } = await supabase
    .rpc('create_user', {
      user_id: userId,
      user_phone: userData.phone,
      user_username: userData.username,
      user_full_name: userData.full_name,
      user_age: userData.age,
      user_address: userData.address,
      user_pin: userData.pin
    });

  if (userError) {
    throw new Error(`Error creating user: ${userError.message}`);
  }

  // Generate account number
  const accountNumber = generateAccountNumber();

  // Create account for the user using RPC function
  const { data: accountData, error: accountError } = await supabase
    .rpc('create_account', {
      account_user_id: userId,
      account_number: accountNumber
    });

  if (accountError) {
    throw new Error(`Error creating account: ${accountError.message}`);
  }

  // Get the created user
  const { data: createdUser, error: fetchError } = await supabase
    .rpc('get_user_by_id', { user_id_param: userId });

  if (fetchError || !createdUser) {
    throw new Error(`Error fetching created user: ${fetchError?.message || 'User not found'}`);
  }

  // Return user data with proper type assertion
  return createdUser as unknown as User;
};

// Login a user
export const loginUser = async (phone: string, pin: string) => {
  // Find user with the provided phone
  const { data: user, error: userError } = await supabase
    .rpc('get_user_by_phone', { phone_param: phone });

  if (userError || !user) {
    throw new Error('Invalid phone number or PIN');
  }

  // Type assertion to access properties safely
  const userData = user as unknown as User;

  // Verify PIN
  if (userData.pin !== pin) {
    throw new Error('Invalid phone number or PIN');
  }

  // Get user account
  const { data: account, error: accountError } = await supabase
    .rpc('get_account_by_user_id', { user_id_param: userData.id });

  if (accountError || !account) {
    throw new Error('Account not found');
  }

  const accountData = account as unknown as Account;

  // Store the current session
  localStorage.setItem('baadshah_bank_session', JSON.stringify({
    user: userData,
    account: accountData,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }));

  return { user: userData, account: accountData };
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem('baadshah_bank_session');
};

// Get current user session
export const getCurrentUserSession = () => {
  const session = localStorage.getItem('baadshah_bank_session');
  if (!session) return null;
  
  const parsedSession = JSON.parse(session);
  const now = new Date();
  const expiresAt = new Date(parsedSession.expiresAt);
  
  if (now > expiresAt) {
    logoutUser();
    return null;
  }
  
  return parsedSession;
};

// Get current user
export const getCurrentUser = () => {
  const session = getCurrentUserSession();
  return session ? session.user : null;
};

// Get current account
export const getCurrentAccount = () => {
  const session = getCurrentUserSession();
  return session ? session.account : null;
};

// Add money to account
export const addMoney = async (amount: number, description: string) => {
  const session = getCurrentUserSession();
  if (!session) {
    throw new Error('User not logged in');
  }

  const user = session.user;
  const account = session.account;

  // Update account balance
  const { data: updatedAccount, error: updateError } = await supabase
    .rpc('update_account_balance', { 
      account_id_param: account.id,
      new_balance: account.balance + amount,
      update_time: new Date().toISOString()
    });

  if (updateError || !updatedAccount) {
    throw new Error(`Error updating account: ${updateError?.message || 'Unknown error'}`);
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .rpc('create_transaction', {
      sender_id_param: user.id,
      receiver_id_param: user.id,
      amount_param: amount,
      description_param: description,
      transaction_type_param: 'credit'
    });

  if (transactionError || !transaction) {
    throw new Error(`Error creating transaction: ${transactionError?.message || 'Unknown error'}`);
  }

  // Update session
  session.account = updatedAccount as unknown as Account;
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));

  return { 
    account: updatedAccount as unknown as Account, 
    transaction 
  };
};

// Withdraw money
export const withdrawMoney = async (amount: number, description: string) => {
  const session = getCurrentUserSession();
  if (!session) {
    throw new Error('User not logged in');
  }

  const user = session.user;
  const account = session.account;

  // Check if enough balance
  if (account.balance < amount) {
    throw new Error('Insufficient balance');
  }

  // Update account balance
  const { data: updatedAccount, error: updateError } = await supabase
    .rpc('update_account_balance', { 
      account_id_param: account.id,
      new_balance: account.balance - amount,
      update_time: new Date().toISOString()
    });

  if (updateError || !updatedAccount) {
    throw new Error(`Error updating account: ${updateError?.message || 'Unknown error'}`);
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .rpc('create_transaction', {
      sender_id_param: user.id,
      receiver_id_param: null,
      amount_param: amount,
      description_param: description,
      transaction_type_param: 'debit'
    });

  if (transactionError || !transaction) {
    throw new Error(`Error creating transaction: ${transactionError?.message || 'Unknown error'}`);
  }

  // Update session
  session.account = updatedAccount as unknown as Account;
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));

  return { 
    account: updatedAccount as unknown as Account, 
    transaction 
  };
};

// Transfer money to another account
export const transferMoney = async (receiverPhone: string, amount: number, description: string) => {
  const session = getCurrentUserSession();
  if (!session) {
    throw new Error('User not logged in');
  }

  const sender = session.user;
  const senderAccount = session.account;

  // Check if enough balance
  if (senderAccount.balance < amount) {
    throw new Error('Insufficient balance');
  }

  // Call RPC function to handle transfer
  const { data: result, error } = await supabase
    .rpc('transfer_money', {
      sender_id_param: sender.id,
      receiver_phone_param: receiverPhone,
      amount_param: amount,
      description_param: description
    });

  if (error || !result) {
    throw new Error(`Transfer failed: ${error?.message || 'Unknown error'}`);
  }

  // Get updated sender account
  const { data: updatedSenderAccount, error: accountError } = await supabase
    .rpc('get_account_by_user_id', { user_id_param: sender.id });

  if (accountError || !updatedSenderAccount) {
    throw new Error(`Error fetching updated account: ${accountError?.message || 'Unknown error'}`);
  }

  // Update session
  session.account = updatedSenderAccount as unknown as Account;
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));

  return { 
    account: updatedSenderAccount as unknown as Account, 
    transaction: result 
  };
};

// Get all transactions for current user
export const getUserTransactions = async () => {
  const session = getCurrentUserSession();
  if (!session) {
    throw new Error('User not logged in');
  }

  const user = session.user;

  // Get all transactions where user is sender or receiver
  const { data: transactions, error } = await supabase
    .rpc('get_user_transactions', { user_id_param: user.id });

  if (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }

  return transactions;
};
