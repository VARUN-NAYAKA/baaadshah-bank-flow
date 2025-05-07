
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
  return Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
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
