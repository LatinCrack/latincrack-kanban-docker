// Backend API para conectar con PostgreSQL en modo Docker
// Este servidor se ejecuta en Node.js y maneja las operaciones de base de datos

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Configuración de PostgreSQL
const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'kanban_db',
  user: process.env.POSTGRES_USER || 'kanban_user',
  password: process.env.POSTGRES_PASSWORD || 'kanban_password_2024',
});

// Test de conexión
pool.on('connect', () => {
  console.log('✅ Conectado a PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en PostgreSQL:', err);
});

// ==================== RUTAS API ====================

// GET /api/tasks - Obtener todas las tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// POST /api/tasks - Crear nueva tarea
app.post('/api/tasks', async (req, res) => {
  const { title, description, priority, due_date, tags, status } = req.body;
  
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, due_date, tags, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description || null, priority, due_date || null, tags || [], status || 'todo']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// PUT /api/tasks/:id - Actualizar tarea
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, due_date, tags, status } = req.body;
  
  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           priority = COALESCE($3, priority),
           due_date = COALESCE($4, due_date),
           tags = COALESCE($5, tags),
           status = COALESCE($6, status),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, description, priority, due_date, tags, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// DELETE /api/tasks/:id - Eliminar tarea
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    
    res.json({ message: 'Tarea eliminada', task: result.rows[0] });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await pool.end();
  process.exit(0);
});
