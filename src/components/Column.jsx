import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Task } from './Task';

export const Column = ({ column, title, tasks, onAddTask, onEditTask, onDeleteTask }) => {
  const { setNodeRef } = useDroppable({
    id: column,
  });

  return (
    <div className="bg-gradient-to-b from-slate-800/60 to-slate-900 rounded-2xl p-6 flex flex-col w-full md:w-80 shadow-[0_10px_40px_-15px_rgba(6,182,212,0.15)] border border-cyan-500/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-slate-100 font-bold text-xl flex items-center gap-2">
          {title}
<span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
  {tasks.length}
</span>
        </h2>
        <button
          onClick={() => onAddTask(column)}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          title="Agregar tarea"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[200px]"
        style={{ touchAction: 'pan-y' }}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            No hay tareas
          </div>
        )}
      </div>
    </div>
  );
};
