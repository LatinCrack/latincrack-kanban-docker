import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
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

    const subscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addTask = async (title, description, priority, dueDate, tags) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            title,
            description: description || null,
            priority,
            due_date: dueDate || null,
            tags: tags || [],
            status: 'todo'
          }
        ])
        .select()
        .single();

      if (error) throw error;

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

      Object.keys(dbUpdates).forEach(key => 
        dbUpdates[key] === undefined && delete dbUpdates[key]
      );

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', taskId);

      if (error) throw error;

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
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

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
