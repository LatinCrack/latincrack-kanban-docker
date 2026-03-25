// Hook para usar con PostgreSQL directo (modo Docker)
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useTasksDocker = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) throw new Error('Error al obtener tareas');
      
      const data = await response.json();
      
      // Mapear campos de PostgreSQL a formato frontend
      const formattedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.due_date,
        tags: task.tags || [],
        column: task.status,
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }));
      
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Polling cada 5 segundos para simular tiempo real
    const interval = setInterval(fetchTasks, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const addTask = async (title, description, priority, dueDate, tags) => {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          priority,
          due_date: dueDate || null,
          tags: tags || [],
          status: 'todo'
        })
      });

      if (!response.ok) throw new Error('Error al crear tarea');
      
      const data = await response.json();
      
      const newTask = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        dueDate: data.due_date,
        tags: data.tags || [],
        column: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setTasks([...tasks, newTask]);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const dbUpdates = {
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        due_date: updates.dueDate,
        tags: updates.tags,
        status: updates.column
      };

      // Eliminar campos undefined
      Object.keys(dbUpdates).forEach(key => 
        dbUpdates[key] === undefined && delete dbUpdates[key]
      );

      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbUpdates)
      });

      if (!response.ok) throw new Error('Error al actualizar tarea');

      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar tarea');

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const moveTask = async (taskId, newColumn) => {
    await updateTask(taskId, { column: newColumn });
  };

  const getTasksByColumn = (column) => {
    return tasks.filter(task => task.column === column);
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    getTasksByColumn
  };
};
