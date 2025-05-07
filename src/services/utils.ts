
import { supabase } from "@/integrations/supabase/client";
import { UserSession } from "./types";

// Check if a phone number is already registered
export const checkPhoneExists = async (phone: string) => {
  try {
    // Direct check to avoid any race conditions
    const { data, error } = await supabase
      .from('users')
      .select('phone')
      .eq('phone', phone)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error("Error checking phone:", error.message);
      // If there's an error, we'll return false to be safe
      return false;
    }
    
    // If we got data back, the phone exists
    return !!data;
    
  } catch (error: any) {
    console.error("Error checking if phone exists:", error.message);
    return false;
  }
};

// Generate a random 15-digit account number
export const generateAccountNumber = () => {
  // Ensure the number starts with a non-zero digit
  const firstDigit = Math.floor(Math.random() * 9) + 1; // 1-9
  
  // Generate the remaining 14 digits
  const remainingDigits = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10)).join('');
  
  // Combine for a 15-digit account number
  const accountNumber = `${firstDigit}${remainingDigits}`;
  console.log("Generated account number in utils:", accountNumber);
  return accountNumber;
};

// Get current user session
export const getCurrentUserSession = (): UserSession | null => {
  const session = localStorage.getItem('baadshah_bank_session');
  if (!session) return null;
  
  try {
    const parsedSession = JSON.parse(session);
    const now = new Date();
    const expiresAt = new Date(parsedSession.expiresAt);
    
    if (now > expiresAt) {
      localStorage.removeItem('baadshah_bank_session');
      return null;
    }
    
    return parsedSession;
  } catch (error) {
    localStorage.removeItem('baadshah_bank_session');
    return null;
  }
};

// Save the current session
export const saveUserSession = (session: UserSession) => {
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));
};

// Get a unique username by adding a random suffix if needed
export const generateUniqueUsername = (baseUsername: string) => {
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${baseUsername}${randomSuffix}`;
};

// Format currency (e.g., "₹ 10,000.00")
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};
