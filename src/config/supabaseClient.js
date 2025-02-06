import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERROR: Variables de entorno de Supabase no están definidas.");
  throw new Error("Configuración de Supabase no encontrada. Verifica el archivo .env");
}

// ✅ Configurar con más seguridad
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,  // Mantener sesión activa
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

export default supabase;
