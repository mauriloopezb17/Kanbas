import React from 'react';

const CreateProjectModal = ({ isOpen, onClose, onNext }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo con efecto borroso */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Contenido del Modal */}
      <div className="bg-[#f0f0f5] rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl relative z-10 mx-4">
        <h2 className="text-3xl font-bold text-black mb-6 font-sans">Crear Proyecto</h2>

        <form className="space-y-6">
          <div>
            <label className="block text-black text-lg font-bold mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              placeholder="Proyecto Ejemplo 99"
              className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#0097b2] text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2]"
            />
          </div>

          <div>
            <label className="block text-black text-lg font-bold mb-2">
              Descripción *
            </label>
            <textarea
              rows="3"
              className="w-full px-4 py-3 rounded-3xl bg-[#cbd5e1] border border-[#0097b2] text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2] resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-black text-lg font-bold mb-2">
              Fecha Limite
            </label>
            <div className="relative w-48">
              <input
                type="text"
                placeholder="DD/MM/AA"
                className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#0097b2] text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0097b2]"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0097b2]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-[#0097b2] font-bold hover:underline text-lg"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onNext}
              className="bg-[#0097b2] text-white font-bold py-3 px-8 rounded-full hover:bg-[#007a91] transition duration-300 shadow-md"
            >
              Siguiente &gt;
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
