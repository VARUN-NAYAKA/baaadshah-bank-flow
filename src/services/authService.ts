
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { User, Account, UserSession } from "./types";
import { checkPhoneExists, generateAccountNumber, getCurrentUserSession } from "./utils";

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
  const session: UserSession = {
    user: userData,
    account: accountData,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  };
  
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));

  return { user: userData, account: accountData };
};

// Logout function
export const logoutUser = () => {
  localStorage.removeItem('baadshah_bank_session');
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
