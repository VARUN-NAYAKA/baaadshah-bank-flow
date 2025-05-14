
import { getCurrentUser } from "./utils";
import { User } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUserSession, saveUserSession } from "./utils";

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
      fullName: userData.fullName || currentUser.fullName,
      username: userData.username || currentUser.username,
      phone: userData.phone || currentUser.phone,
      age: userData.age || currentUser.age,
      address: userData.address || currentUser.address,
      pin: currentUser.pin,
      createdAt: currentUser.createdAt
    };
    
    // Get the current session
    const session = getCurrentUserSession();
    if (!session) {
      throw new Error("User session not found");
    }
    
    // Update the user in the session
    session.user = updatedUser;
    
    // Store the updated session
    saveUserSession(session);
    
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
    
    // Get the current session
    const session = getCurrentUserSession();
    if (!session) {
      throw new Error("User session not found");
    }
    
    // Update the user in the session
    session.user = updatedUser;
    
    // Store the updated session
    saveUserSession(session);
    
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
    
    // Get the current session
    const session = getCurrentUserSession();
    if (!session) {
      throw new Error("User session not found");
    }
    
    // Update the user in the session
    session.user = updatedUser;
    
    // Store the updated session
    saveUserSession(session);
    
    return updatedUser;
  } catch (error: any) {
    console.error("Error updating phone number:", error);
    throw new Error(error.message || "Failed to update phone number");
  }
};
