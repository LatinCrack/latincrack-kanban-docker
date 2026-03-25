import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Task } from './Task';
import { TaskModal } from './TaskModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { useTasks } from '../hooks/useTasksWrapper';
import { COLUMNS, COLUMN_NAMES } from '../utils/constants';

export const Board = () => {
  const { tasks, addTask, updateTask, deleteTask, moveTask, getTasksByColumn } = useTasks();
  const [activeId, setActiveId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [targetColumn, setTargetColumn] = useState(null);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    
    if (Object.values(COLUMNS).includes(overId)) {
      if (activeTask.column !== overId) {
        moveTask(active.id, overId);
      }
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask && activeTask.column !== overTask.column) {
        moveTask(active.id, overTask.column);
      }
    }
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    const overTask = tasks.find(t => t.id === over.id);

    if (!activeTask) return;

    if (activeTask && overTask && activeTask.id !== overTask.id) {
      const activeColumn = activeTask.column;
      const overColumn = overTask.column;

      if (activeColumn === overColumn) {
        const columnTasks = getTasksByColumn(activeColumn);
        const oldIndex = columnTasks.findIndex(t => t.id === active.id);
        const newIndex = columnTasks.findIndex(t => t.id === over.id);

        if (oldIndex !== newIndex) {
          const newOrder = arrayMove(columnTasks, oldIndex, newIndex);
        }
      }
    }
  };

  const handleAddTask = (column) => {
    setTargetColumn(column);
    setCurrentTask(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setTargetColumn(null);
    setIsTaskModalOpen(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (currentTask) {
      updateTask(currentTask.id, taskData);
    } else {
      const newTask = addTask(
        taskData.title,
        taskData.description,
        taskData.priority,
        taskData.dueDate,
        taskData.tags
      );
      if (targetColumn && targetColumn !== COLUMNS.TODO) {
        moveTask(newTask.id, targetColumn);
      }
    }
    setIsTaskModalOpen(false);
    setCurrentTask(null);
    setTargetColumn(null);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start pt-16 md:pt-24 pb-12 px-4 md:px-8">
      <header className="mb-8 md:mb-12 text-center w-full">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-500 [text-shadow:_0_0_20px_rgba(6,182,212,0.8),_0_0_40px_rgba(56,189,248,0.3)] bg-slate-900/40 px-6 py-2 rounded-2xl border border-white/10 backdrop-blur-[2px]">
          Tablero de LatinCrack
        </h1>
        <p className="text-slate-400 text-sm md:text-lg">
          Organiza tus tareas de manera eficiente.
        </p>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-auto mt-24 md:mt-40">
            <Column
              column={COLUMNS.TODO}
              title={COLUMN_NAMES[COLUMNS.TODO]}
              tasks={getTasksByColumn(COLUMNS.TODO)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <Column
              column={COLUMNS.DOING}
              title={COLUMN_NAMES[COLUMNS.DOING]}
              tasks={getTasksByColumn(COLUMNS.DOING)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
            <Column
              column={COLUMNS.DONE}
              title={COLUMN_NAMES[COLUMNS.DONE]}
              tasks={getTasksByColumn(COLUMNS.DONE)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 scale-105">
              <Task
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setCurrentTask(null);
          setTargetColumn(null);
        }}
        onSave={handleSaveTask}
        task={currentTask}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDelete?.title}
      />
    </div>
  );
};
