
// Re-export all services and types

// Types
export * from './types';

// Authentication service
export * from './authService';

// Account service
// Only export functions that actually exist in accountService.ts
export { 
  addMoney,
  withdrawMoney 
} from './accountService';

// Transaction service
export * from './transactionService';

// Profile service
export * from './profileService';

// Utils
export * from './utils';

// Re-export getCurrentAccount and getCurrentUser from authService to maintain API compatibility
export {
  getCurrentAccount,
  getCurrentUser
} from './authService';
