import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './index';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!config.supabaseUrl || !config.supabaseKey) {
      throw new Error('Supabase URL or Key is missing in environment variables');
    }
    supabaseClient = createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        persistSession: false,
      },
    });
  }
  return supabaseClient;
}
