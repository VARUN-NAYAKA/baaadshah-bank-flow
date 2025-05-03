
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

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
  const { data, error } = await supabase
    .from('users')
    .select('phone')
    .eq('phone', phone)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows found
    throw new Error(`Error checking phone: ${error.message}`);
  }
  
  return !!data;
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

  // Insert user record
  const { data: userData1, error: userError } = await supabase
    .from('users')
    .insert({
      id: userId,
      phone: userData.phone,
      username: userData.username,
      full_name: userData.full_name,
      age: userData.age,
      address: userData.address,
      pin: userData.pin
    })
    .select()
    .single();

  if (userError) {
    throw new Error(`Error creating user: ${userError.message}`);
  }

  // Generate account number
  const accountNumber = generateAccountNumber();

  // Create account for the user
  const { data: accountData, error: accountError } = await supabase
    .from('accounts')
    .insert({
      user_id: userId,
      balance: 0, // Initial balance is 0
      account_number: accountNumber
    })
    .select()
    .single();

  if (accountError) {
    throw new Error(`Error creating account: ${accountError.message}`);
  }

  // Return user data
  return userData1 as User;
};

// Login a user
export const loginUser = async (phone: string, pin: string) => {
  // Find user with the provided phone
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (userError) {
    throw new Error('Invalid phone number or PIN');
  }

  // Verify PIN
  if (user.pin !== pin) {
    throw new Error('Invalid phone number or PIN');
  }

  // Get user account
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (accountError) {
    throw new Error('Account not found');
  }

  // Store the current session
  localStorage.setItem('baadshah_bank_session', JSON.stringify({
    user,
    account,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }));

  return { user, account };
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
    .from('accounts')
    .update({ 
      balance: account.balance + amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', account.id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Error updating account: ${updateError.message}`);
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      sender_id: user.id,
      receiver_id: user.id,
      amount,
      description,
      transaction_type: 'credit'
    })
    .select()
    .single();

  if (transactionError) {
    throw new Error(`Error creating transaction: ${transactionError.message}`);
  }

  // Update session
  session.account = updatedAccount;
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));

  return { account: updatedAccount, transaction };
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
    .from('accounts')
    .update({ 
      balance: account.balance - amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', account.id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Error updating account: ${updateError.message}`);
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      sender_id: user.id,
      receiver_id: null,
      amount,
      description,
      transaction_type: 'debit'
    })
    .select()
    .single();

  if (transactionError) {
    throw new Error(`Error creating transaction: ${transactionError.message}`);
  }

  // Update session
  session.account = updatedAccount;
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));

  return { account: updatedAccount, transaction };
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

  // Get receiver user
  const { data: receiver, error: receiverError } = await supabase
    .from('users')
    .select('id')
    .eq('phone', receiverPhone)
    .single();

  if (receiverError) {
    throw new Error('Receiver account not found');
  }

  // Get receiver account
  const { data: receiverAccount, error: accountError } = await supabase
    .from('accounts')
    .select('id, balance')
    .eq('user_id', receiver.id)
    .single();

  if (accountError) {
    throw new Error('Receiver account not found');
  }

  // Deduct from sender account
  const { data: updatedSenderAccount, error: senderUpdateError } = await supabase
    .from('accounts')
    .update({ 
      balance: senderAccount.balance - amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', senderAccount.id)
    .select()
    .single();

  if (senderUpdateError) {
    throw new Error(`Error updating sender account: ${senderUpdateError.message}`);
  }

  // Add to receiver account
  const { error: receiverUpdateError } = await supabase
    .from('accounts')
    .update({ 
      balance: receiverAccount.balance + amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', receiverAccount.id);

  if (receiverUpdateError) {
    throw new Error(`Error updating receiver account: ${receiverUpdateError.message}`);
  }

  // Create transaction record
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert({
      sender_id: sender.id,
      receiver_id: receiver.id,
      amount,
      description,
      transaction_type: 'transfer'
    })
    .select()
    .single();

  if (transactionError) {
    throw new Error(`Error creating transaction: ${transactionError.message}`);
  }

  // Update session
  session.account = updatedSenderAccount;
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));

  return { account: updatedSenderAccount, transaction };
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
    .from('transactions')
    .select(`
      id,
      sender_id,
      receiver_id,
      amount,
      description,
      transaction_type,
      created_at,
      sender:sender_id(full_name, phone),
      receiver:receiver_id(full_name, phone)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }

  return transactions;
};
