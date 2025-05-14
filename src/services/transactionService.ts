
import { supabase } from "@/integrations/supabase/client";
import { Account } from "./types";
import { getCurrentUserSession, saveUserSession } from "./utils";

// Transfer money to another account
export const transferMoney = async (receiverPhone: string, amount: number, description: string = "") => {
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
      description_param: description || "" // Ensure empty string if description is null/undefined
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
  saveUserSession(session);

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
  console.log("Fetching transactions for user ID:", user.id); // Debug log

  // Get all transactions where user is sender or receiver
  const { data: transactions, error } = await supabase
    .rpc('get_user_transactions', { user_id_param: user.id });

  if (error) {
    console.error("Transaction fetch error:", error);
    throw new Error(`Error fetching transactions: ${error.message}`);
  }

  console.log("Fetched transactions:", transactions); // Debug log
  return transactions;
};

// Add money to account (deposit)
export const addMoney = async (amount: number, description: string = "") => {
  const session = getCurrentUserSession();
  if (!session) {
    throw new Error('User not logged in');
  }

  const user = session.user;
  const account = session.account;

  // Create a new transaction
  const { data: result, error } = await supabase
    .from('transactions')
    .insert({
      sender_id: user.id,
      amount: amount,
      description: description || "", // Ensure empty string if description is null/undefined
      transaction_type: 'credit'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }

  // Update account balance
  const newBalance = account.balance + amount;
  const { data: updatedAccount, error: updateError } = await supabase
    .from('accounts')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update account: ${updateError.message}`);
  }

  // Update session
  session.account = updatedAccount as Account;
  saveUserSession(session);

  return {
    account: updatedAccount,
    transaction: result
  };
};

// Withdraw money from account
export const withdrawMoney = async (amount: number, description: string = "") => {
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

  // Create a new transaction
  const { data: result, error } = await supabase
    .from('transactions')
    .insert({
      sender_id: user.id,
      amount: amount,
      description: description || "", // Ensure empty string if description is null/undefined
      transaction_type: 'debit'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }

  // Update account balance
  const newBalance = account.balance - amount;
  const { data: updatedAccount, error: updateError } = await supabase
    .from('accounts')
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update account: ${updateError.message}`);
  }

  // Update session
  session.account = updatedAccount as Account;
  saveUserSession(session);

  return {
    account: updatedAccount,
    transaction: result
  };
};
