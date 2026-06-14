import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing from environment variables.');
}
console.log("SUPABASE URL =", supabaseUrl);
console.log("SUPABASE KEY =", supabaseAnonKey);
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
