// Wrapper que selecciona automáticamente entre Supabase y Docker PostgreSQL
import { useTasks as useTasksSupabase } from './useTasks';
import { useTasksDocker } from './useTasksDocker';

const USE_DOCKER = import.meta.env.VITE_USE_DOCKER === 'true';

export const useTasks = () => {
  if (USE_DOCKER) {
    console.log('🐳 Modo Docker: Usando PostgreSQL directo');
    return useTasksDocker();
  } else {
    console.log('☁️ Modo Supabase: Usando Supabase');
    return useTasksSupabase();
  }
};
