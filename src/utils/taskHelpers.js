import { COLUMNS } from './constants';

export const generateId = () => {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createTask = (title, description = '', priority = 'medium', dueDate = null, tags = []) => {
  return {
    id: generateId(),
    title,
    description,
    priority,
    dueDate,
    tags,
    column: COLUMNS.TODO,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const isTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const isTaskDueSoon = (dueDate) => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};
