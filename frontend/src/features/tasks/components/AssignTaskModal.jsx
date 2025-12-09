import React, { useState, useRef, useEffect } from 'react';

const AssignTaskModal = ({ isOpen, onClose, onConfirm, taskName }) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasAnimated(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div 
        ref={containerRef}
        onAnimationEnd={() => setHasAnimated(true)}
        className={`bg-[#f0f0f5] rounded-[2rem] w-full max-w-lg shadow-2xl relative z-10 mx-4 overflow-hidden p-8 text-center ${!hasAnimated ? 'animate-modal-grow origin-center' : ''}`}
      >
        <h2 className="text-2xl font-bold text-black mb-2 font-sans">
          ¿Estas seguro de que quieres asignarte a la <span className="text-kanbas-blue">{taskName}</span>?
        </h2>
        <p className="text-sm text-black font-medium mb-8">
          (Esta acción es irreversible por ti u otros integrantes)
        </p>

        <div className="flex items-center justify-center space-x-4">
          <button 
            type="button" 
            onClick={onClose} 
            className="text-kanbas-blue font-bold hover:underline text-lg px-6"
          >
            Cancelar
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskModal;
