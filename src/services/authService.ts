
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { User, Account, UserSession } from "./types";
import { checkPhoneExists, generateAccountNumber, getCurrentUserSession, saveUserSession } from "./utils";

// Register a new user
export const registerUser = async (userData: {
  phone: string;
  username: string;
  full_name: string;
  age: number;
  address: string;
  pin: string;
}) => {
  try {
    // Check if phone number already exists
    const phoneExists = await checkPhoneExists(userData.phone);
    if (phoneExists) {
      throw new Error('A user with this phone number already exists');
    }

    // Create a unique ID for the user
    const userId = uuidv4();
    
    console.log("Starting user registration process with ID:", userId);
    
    // Generate account number first
    const accountNumber = generateAccountNumber();
    console.log("Generated account number:", accountNumber);

    // Create user record first
    const { data: createdUser, error: userError } = await supabase
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
      // Check if the error is a duplicate phone number error
      if (userError.message.includes('users_phone_key')) {
        throw new Error('This phone number is already registered. Please use a different phone number or try logging in.');
      }
      throw new Error(`Error creating user: ${userError.message}`);
    }
    
    console.log("User created successfully:", createdUser);

    // Create account directly using insert
    const { data: accountData, error: accountError } = await supabase
      .from('accounts')
      .insert({
        user_id: userId,
        account_number: accountNumber,
        balance: 0
      })
      .select();

    if (accountError) {
      console.error("Account creation error:", accountError);
      // If account creation fails, attempt to clean up the user we just created
      await supabase.from('users').delete().eq('id', userId);
      throw new Error(`Error creating account: ${accountError.message}`);
    }
    
    console.log("Account created successfully:", accountData);

    // Transform the user data to match our User type
    const transformedUser: User = {
      id: createdUser.id,
      phone: createdUser.phone,
      username: createdUser.username,
      fullName: createdUser.full_name,
      age: createdUser.age,
      address: createdUser.address,
      pin: createdUser.pin,
      createdAt: createdUser.created_at
    };

    // Return user data
    return transformedUser;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw error;
  }
};

// Login a user
export const loginUser = async (phone: string, pin: string) => {
  try {
    // Find user with the provided phone
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (userError || !user) {
      throw new Error('Invalid phone number or PIN');
    }

    // Verify PIN
    if (user.pin !== pin) {
      throw new Error('Invalid phone number or PIN');
    }

    // Transform the user data to match our User type
    const transformedUser: User = {
      id: user.id,
      phone: user.phone,
      username: user.username,
      fullName: user.full_name,
      age: user.age,
      address: user.address,
      pin: user.pin,
      createdAt: user.created_at
    };

    // Get user account
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      throw new Error('Account not found');
    }

    // Store the current session
    const session: UserSession = {
      user: transformedUser,
      account: account as Account,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };
    
    saveUserSession(session);

    return { user: transformedUser, account: account as Account };
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
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
