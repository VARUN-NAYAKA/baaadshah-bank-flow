
import { getCurrentUser } from "./localAuth";
import { User } from "./types";
import { supabase } from "@/integrations/supabase/client";

// Update user profile information
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error("User not logged in");
    }
    
    // In a real app with supabase, this would call an API to update the user
    // For now we'll use localStorage to simulate the update
    const updatedUser: User = {
      ...currentUser,
      id: currentUser.id,
      full_name: userData.full_name || currentUser.full_name,
      username: userData.username || currentUser.username,
      phone: userData.phone || currentUser.phone,
      age: userData.age || currentUser.age,
      address: userData.address || currentUser.address,
      pin: currentUser.pin,
      created_at: currentUser.created_at
    };
    
    // Store the updated user in localStorage
    localStorage.setItem('baadshah_bank_session', JSON.stringify({
      user: updatedUser,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));
    
    return updatedUser;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw new Error(error.message || "Failed to update profile");
  }
};

// Update user PIN
export const updateUserPin = async (userId: string, newPin: string): Promise<User> => {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error("User not logged in");
    }
    
    // Update the PIN
    const updatedUser: User = {
      ...currentUser,
      pin: newPin
    };
    
    // Store the updated user in localStorage
    localStorage.setItem('baadshah_bank_session', JSON.stringify({
      user: updatedUser,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));
    
    return updatedUser;
  } catch (error: any) {
    console.error("Error updating PIN:", error);
    throw new Error(error.message || "Failed to update PIN");
  }
};

// Update user phone number
export const updateUserPhone = async (userId: string, newPhone: string): Promise<User> => {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error("User not logged in");
    }
    
    // Update the phone number
    const updatedUser: User = {
      ...currentUser,
      phone: newPhone
    };
    
    // Store the updated user in localStorage
    localStorage.setItem('baadshah_bank_session', JSON.stringify({
      user: updatedUser,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));
    
    return updatedUser;
  } catch (error: any) {
    console.error("Error updating phone number:", error);
    throw new Error(error.message || "Failed to update phone number");
  }
};
