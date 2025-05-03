// Simple interface for user data
export interface User {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  age: number;
  address: string;
  createdAt: string;
}

interface UserCredentials {
  phone: string;
  password: string;
}

// Store for keeping user accounts
export const getUsers = (): Record<string, User & { password: string }> => {
  const storedUsers = localStorage.getItem('baadshah_bank_users');
  return storedUsers ? JSON.parse(storedUsers) : {};
};

// Store a new user account
export const createUser = (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): User => {
  const users = getUsers();
  
  // Check if phone already exists
  if (users[userData.phone]) {
    throw new Error('A user with this phone number already exists');
  }
  
  const newUser: User & { password: string } = {
    ...userData,
    id: userData.phone,
    createdAt: new Date().toISOString(),
  };
  
  // Store the user
  users[userData.phone] = newUser;
  localStorage.setItem('baadshah_bank_users', JSON.stringify(users));
  
  // Create an account entry
  const accounts = getAccounts();
  const accountNumber = generateAccountNumber();
  
  accounts[userData.phone] = {
    userId: userData.phone,
    accountNumber,
    balance: 1000,
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem('baadshah_bank_accounts', JSON.stringify(accounts));
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Login function
export const login = (credentials: UserCredentials): User => {
  const users = getUsers();
  const user = users[credentials.phone];
  
  if (!user || user.password !== credentials.password) {
    throw new Error('Invalid phone number or PIN');
  }
  
  // Store the current session
  const { password, ...userWithoutPassword } = user;
  localStorage.setItem('baadshah_bank_session', JSON.stringify({
    user: userWithoutPassword,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }));
  
  return userWithoutPassword;
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('baadshah_bank_session');
};

// Check if user is logged in
export const getCurrentUser = (): User | null => {
  const session = localStorage.getItem('baadshah_bank_session');
  if (!session) return null;
  
  const parsedSession = JSON.parse(session);
  const now = new Date();
  const expiresAt = new Date(parsedSession.expiresAt);
  
  if (now > expiresAt) {
    logout();
    return null;
  }
  
  return parsedSession.user;
};

// Helper function to generate a random 15-digit account number
const generateAccountNumber = (): string => {
  return Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
};

// Account interfaces
export interface Account {
  userId: string;
  accountNumber: string;
  balance: number;
  createdAt: string;
}

// Get all accounts
export const getAccounts = (): Record<string, Account> => {
  const storedAccounts = localStorage.getItem('baadshah_bank_accounts');
  return storedAccounts ? JSON.parse(storedAccounts) : {};
};

// Get account by user ID
export const getAccountByUserId = (userId: string): Account | null => {
  const accounts = getAccounts();
  return accounts[userId] || null;
};
