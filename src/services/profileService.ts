
import { getCurrentUser, setCurrentUser } from "./localAuth";
import { User } from "./types";

// Update user profile information
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error("User not logged in");
    }
    
    // Update the user in local storage
    const updatedUser = {
      ...currentUser,
      ...userData
    };
    
    // In a real app, this would call an API to update the user in the database
    setCurrentUser(updatedUser);
    
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
    
    // Update the PIN in local storage
    const updatedUser = {
      ...currentUser,
      pin: newPin
    };
    
    // In a real app, this would call an API to update the user's PIN in the database
    setCurrentUser(updatedUser);
    
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
    
    // Update the phone number in local storage
    const updatedUser = {
      ...currentUser,
      phone: newPhone
    };
    
    // In a real app, this would call an API to update the user's phone in the database
    setCurrentUser(updatedUser);
    
    return updatedUser;
  } catch (error: any) {
    console.error("Error updating phone number:", error);
    throw new Error(error.message || "Failed to update phone number");
  }
};
