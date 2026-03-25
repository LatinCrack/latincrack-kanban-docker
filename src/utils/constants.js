export const COLUMNS = {
  TODO: 'todo',
  DOING: 'doing',
  DONE: 'done'
};

export const COLUMN_NAMES = {
  [COLUMNS.TODO]: 'To Do',
  [COLUMNS.DOING]: 'Doing',
  [COLUMNS.DONE]: 'Done'
};

export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: 'bg-green-500',
  [PRIORITIES.MEDIUM]: 'bg-amber-500',
  [PRIORITIES.HIGH]: 'bg-red-500'
};

export const PRIORITY_LABELS = {
  [PRIORITIES.LOW]: 'Baja',
  [PRIORITIES.MEDIUM]: 'Media',
  [PRIORITIES.HIGH]: 'Alta'
};

export const LOCAL_STORAGE_KEY = 'kanban-tasks';
