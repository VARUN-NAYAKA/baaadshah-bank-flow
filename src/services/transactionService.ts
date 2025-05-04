
import { supabase } from "@/integrations/supabase/client";
import { Account } from "./types";
import { getCurrentUserSession, saveUserSession } from "./utils";

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

  // Get all transactions where user is sender or receiver
  const { data: transactions, error } = await supabase
    .rpc('get_user_transactions', { user_id_param: user.id });

  if (error) {
    throw new Error(`Error fetching transactions: ${error.message}`);
  }

  return transactions;
};
