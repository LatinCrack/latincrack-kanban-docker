// Configuración dual: Supabase o PostgreSQL directo
import { createClient } from '@supabase/supabase-js';

const USE_DOCKER = import.meta.env.VITE_USE_DOCKER === 'true';

let dbClient;

if (USE_DOCKER) {
  // Modo Docker: Conexión directa a PostgreSQL
  // NOTA: Para usar PostgreSQL directo desde el navegador necesitamos un backend API
  // Por ahora, esta configuración es para referencia
  console.log('🐳 Modo Docker activado - Usando PostgreSQL directo');
  
  const postgresConfig = {
    host: import.meta.env.VITE_POSTGRES_HOST || 'localhost',
    port: import.meta.env.VITE_POSTGRES_PORT || 5432,
    database: import.meta.env.VITE_POSTGRES_DB || 'kanban_db',
    user: import.meta.env.VITE_POSTGRES_USER || 'kanban_user',
    password: import.meta.env.VITE_POSTGRES_PASSWORD || 'kanban_password_2024',
  };

  // Para PostgreSQL directo necesitarás un backend API
  // Ver: src/api/server.js (próximo paso)
  dbClient = {
    mode: 'postgres',
    config: postgresConfig,
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  };
} else {
  // Modo Supabase (default)
  console.log('☁️ Modo Supabase activado');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Credenciales de Supabase no configuradas');
  }

  dbClient = createClient(supabaseUrl, supabaseAnonKey);
}

export { dbClient, USE_DOCKER };
