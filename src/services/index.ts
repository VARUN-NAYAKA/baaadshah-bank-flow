
// Re-export services and types with proper organization to avoid conflicts

// Types
export * from './types';

// Authentication service - contains getCurrentUser and getCurrentAccount
export * from './authService';

// Account service - avoid conflicting with transactionService
export { 
  addMoney as addMoneyToAccount,
  withdrawMoney as withdrawMoneyFromAccount 
} from './accountService';

// Transaction service
export * from './transactionService';

// Profile service
export * from './profileService';

// Utils
export * from './utils';
