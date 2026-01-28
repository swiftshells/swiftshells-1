
import { createClient } from '@supabase/supabase-js';

// Hardcoded fallbacks for the AI Studio environment to ensure connection
const supabaseUrl = 'https://heahfvrdmrjlnpyoocpl.supabase.co';
const supabaseAnonKey = 'sb_publishable_jF_X6Yh09HflTjZ36t64fg_jisvwaSe';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
