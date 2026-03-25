-- Script de inicialización de la base de datos PostgreSQL para Docker

-- Crear tabla de tareas
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date DATE,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'todo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para mejorar las consultas por status
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo (opcional)
INSERT INTO tasks (title, description, priority, status, tags) VALUES
  ('Configurar Docker', 'Dockerizar la aplicación LatinCrack', 'high', 'done', ARRAY['devops', 'docker']),
  ('Documentar proyecto', 'Crear documentación completa', 'medium', 'doing', ARRAY['docs']),
  ('Desplegar a producción', 'Subir a Linode con Docker', 'high', 'todo', ARRAY['deployment', 'cloud'])
ON CONFLICT DO NOTHING;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Base de datos inicializada correctamente para LatinCrack Kanban';
END $$;
