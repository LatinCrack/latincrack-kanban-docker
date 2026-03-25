import { AlertTriangle, X } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-full">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              Confirmar eliminación
            </h2>
          </div>

          <p className="text-slate-300 mb-2">
            ¿Estás seguro de que deseas eliminar esta tarea?
          </p>
          {taskTitle && (
            <p className="text-slate-400 text-sm mb-4 italic">
              "{taskTitle}"
            </p>
          )}
          <p className="text-slate-500 text-sm mb-6">
            Esta acción no se puede deshacer.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
