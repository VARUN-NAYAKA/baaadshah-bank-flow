
import { supabase } from "@/integrations/supabase/client";
import { UserSession } from "./types";

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
export const generateAccountNumber = () => {
  return Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
};

// Get current user session
export const getCurrentUserSession = (): UserSession | null => {
  const session = localStorage.getItem('baadshah_bank_session');
  if (!session) return null;
  
  const parsedSession = JSON.parse(session);
  const now = new Date();
  const expiresAt = new Date(parsedSession.expiresAt);
  
  if (now > expiresAt) {
    localStorage.removeItem('baadshah_bank_session');
    return null;
  }
  
  return parsedSession;
};

// Save the current session
export const saveUserSession = (session: UserSession) => {
  localStorage.setItem('baadshah_bank_session', JSON.stringify(session));
};
