import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, Edit2, Trash2, Tag } from 'lucide-react';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../utils/constants';
import { formatDate, isTaskOverdue, isTaskDueSoon } from '../utils/taskHelpers';

export const Task = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColor = PRIORITY_COLORS[task.priority];
  const isOverdue = isTaskOverdue(task.dueDate);
  const isDueSoon = isTaskDueSoon(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: 'none' }}
      {...attributes}
      {...listeners}
      className="bg-slate-800 rounded-xl p-4 mb-3 shadow-xl hover:shadow-2xl transition-all cursor-move group border border-slate-700 hover:border-slate-600"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-slate-100 font-semibold text-lg flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex gap-1 opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 hover:bg-slate-600 active:bg-slate-500 active:opacity-100 rounded transition-colors"
            title="Editar"
          >
            <Edit2 size={16} className="text-blue-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            className="p-1.5 hover:bg-slate-600 active:bg-slate-500 active:opacity-100 rounded transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className={`${priorityColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
          {PRIORITY_LABELS[task.priority]}
        </span>

        {task.dueDate && (
          <span
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
              isOverdue
                ? 'bg-red-500/20 text-red-400'
                : isDueSoon
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-slate-600 text-slate-300'
            }`}
          >
            <Clock size={12} />
            {formatDate(task.dueDate)}
          </span>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
