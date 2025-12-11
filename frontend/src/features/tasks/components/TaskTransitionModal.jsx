import React, { useState } from 'react';
import { createPortal } from 'react-dom';

const TaskTransitionModal = ({ isOpen, onClose, onConfirm, taskName, type }) => {
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(comment);
    setComment('');
  };

  const handleClose = () => {
    onClose();
    setComment('');
  }

  // Config based on type
  const getModalConfig = () => {
      switch(type) {
          case 'REJECT': // Review -> In Progress
              return {
                  title: <>Rechazar <span className="text-kanbas-blue">{taskName}</span></>,
                  confirmText: "Aceptar" // The button to confirm rejection
              };
          case 'APPROVE': // Review -> Done
             return {
                  title: <>Aceptar <span className="text-kanbas-blue">{taskName}</span> Completada</>, // "Aceptar Tarea 1 Completada"
                  confirmText: "Aceptar"
             };
          case 'SUBMIT': // In Progress -> Review
          default:
              return {
                  title: <>Entrega de <span className="text-kanbas-blue">{taskName}</span></>,
                  confirmText: "Aceptar"
              };
      }
  };

  const config = getModalConfig();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      ></div>

      <div 
        className="bg-[#f0f0f5] rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl transform transition-all scale-100 opacity-100 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
            <h2 className="text-3xl font-bold text-black mb-2 font-sans">
              {config.title}
            </h2>
            
            <div className="mt-6">
                <label className="block text-black text-lg font-bold mb-2 font-sans">
                    Agregar Comentarios (opcional)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-3xl bg-[#cbd5e1] border border-kanbas-blue text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue resize-none font-sans"
                    placeholder="Escribe un comentario..."
                    rows={4}
                />
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleClose}
                className="text-kanbas-blue font-bold hover:underline text-lg font-sans"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md transform hover:scale-105 font-sans"
              >
                {config.confirmText}
              </button>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskTransitionModal;
