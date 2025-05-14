
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { getCurrentUserSession, saveUserSession } from "./utils";

// Update user profile information
export const updateUserProfile = async (userData: {
  id: string;
  full_name: string;
  username: string;
  age: number;
  address: string;
}) => {
  try {
    // Update the user in the database
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: userData.full_name,
        username: userData.username,
        age: userData.age,
        address: userData.address
      })
      .eq('id', userData.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }

    // Update the current user session
    const session = getCurrentUserSession();
    if (session) {
      session.user = {
        ...session.user,
        full_name: userData.full_name,
        username: userData.username,
        age: userData.age,
        address: userData.address
      };
      saveUserSession(session);
    }

    return data as User;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Update user PIN
export const updateUserPin = async (userId: string, newPin: string) => {
  try {
    // Update the PIN in the database
    const { data, error } = await supabase
      .from('users')
      .update({ pin: newPin })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating PIN: ${error.message}`);
    }

    // Update the current user session
    const session = getCurrentUserSession();
    if (session) {
      session.user = {
        ...session.user,
        pin: newPin
      };
      saveUserSession(session);
    }

    return data as User;
  } catch (error: any) {
    console.error("Error updating PIN:", error);
    throw error;
  }
};

// Update user phone number
export const updateUserPhone = async (userId: string, newPhone: string) => {
  try {
    // Check if phone number already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('phone', newPhone)
      .single();

    if (existingUser) {
      throw new Error("This phone number is already registered to another account");
    }

    // Update the phone number in the database
    const { data, error } = await supabase
      .from('users')
      .update({ phone: newPhone })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating phone number: ${error.message}`);
    }

    // Update the current user session
    const session = getCurrentUserSession();
    if (session) {
      session.user = {
        ...session.user,
        phone: newPhone
      };
      saveUserSession(session);
    }

    return data as User;
  } catch (error: any) {
    console.error("Error updating phone number:", error);
    throw error;
  }
};
