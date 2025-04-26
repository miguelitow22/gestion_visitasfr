import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client Module
 *
 * Initializes and exports a singleton Supabase client instance using environment variables.
 * Ensures session persistence and automatic token refresh.
 *
 * Environment Variables (client-side safe anon-key):
 *   - VITE_SUPABASE_URL: Supabase project URL
 *   - VITE_SUPABASE_ANON_KEY: Public anon key (do NOT use service role key here)
 *
 * Throws an error at startup if required variables are missing.
 *
 * @module supabaseClient
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment configuration
if (!supabaseUrl) {
  throw new Error("[Supabase] Missing required environment variable: VITE_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("[Supabase] Missing required environment variable: VITE_SUPABASE_ANON_KEY");
}

/**
 * Create and configure the Supabase client.
 * 
 * Session options:
 *  - persistSession: keep the session in localStorage
 *  - autoRefreshToken: automatically refresh access tokens
 *  - detectSessionInUrl: parse auth settings from URL hash
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  // You can add global headers or custom fetch here if needed
  // global: { headers: { 'x-app-name': 'VerifiK' } }
});

export default supabase;