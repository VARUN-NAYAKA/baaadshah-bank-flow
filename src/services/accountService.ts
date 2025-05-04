
import { supabase } from "@/integrations/supabase/client";
import { Account } from "./types";
import { getCurrentUserSession, saveUserSession } from "./utils";

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
  saveUserSession(session);

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
  saveUserSession(session);

  return { 
    account: updatedAccount as unknown as Account, 
    transaction 
  };
};
