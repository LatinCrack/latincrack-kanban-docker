import { useState, useEffect } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { PRIORITIES, PRIORITY_LABELS } from '../utils/constants';

export const TaskModal = ({ isOpen, onClose, onSave, task = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || PRIORITIES.MEDIUM);
      setDueDate(task.dueDate || '');
      setTags(task.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority(PRIORITIES.MEDIUM);
      setDueDate('');
      setTags([]);
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      tags,
    });

    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100">
            {task ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-700 text-slate-100 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título de la tarea"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-700 text-slate-100 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descripción detallada..."
              rows="4"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Prioridad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(PRIORITIES).map(([key, value]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPriority(value)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all ${
                    priority === value
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {PRIORITY_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-700 text-slate-100 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Etiquetas
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Agregar etiqueta..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                <TagIcon size={20} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              {task ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
