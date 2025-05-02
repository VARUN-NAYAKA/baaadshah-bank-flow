
import { supabase, checkSupabaseConnection } from './client';

/**
 * Initialize Supabase and verify the connection
 * This can be imported and called at application startup
 */
export const initializeSupabase = async () => {
  try {
    const isConnected = await checkSupabaseConnection();
    if (isConnected) {
      console.log('🚀 Supabase connection successful');
      return true;
    } else {
      console.error('⚠️ Supabase connection check failed');
      return false;
    }
  } catch (error) {
    console.error('⚠️ Error initializing Supabase:', error);
    return false;
  }
};

// Export supabase instance for easy access
export { supabase };
