import React, { useState, useRef, useEffect } from 'react';

const NewMessageModal = ({ isOpen, onClose }) => {
  // estados
  const [recipient, setRecipient] = useState('Nadie');
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [content, setContent] = useState('');
  
  // datos dummy
  const availableRecipients = ['Nadie', 'Pedro Parques', 'Jose Cortez', 'Ana Torres', 'Miguel Pacheco', 'Orlando Rivera'];

  // animacion
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRecipient('Nadie');
      setContent('');
      setSelectedRecipients([]);
      setHasAnimated(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddRecipient = () => {
    if (recipient && recipient !== 'Nadie' && !selectedRecipients.some(r => r.name === recipient)) {
      setSelectedRecipients([...selectedRecipients, { name: recipient }]);
      setRecipient('Nadie');
    }
  };

  const handleRemoveRecipient = (index) => {
    const updated = [...selectedRecipients];
    updated.splice(index, 1);
    setSelectedRecipients(updated);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>

      <div 
        ref={containerRef}
        onAnimationEnd={() => setHasAnimated(true)}
        className={`bg-[#f0f0f5] rounded-[2rem] w-full max-w-2xl shadow-2xl relative z-60 mx-4 overflow-hidden ${!hasAnimated ? 'animate-modal-grow origin-center' : ''}`}
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold text-black mb-6 font-sans">Nuevo Mensaje</h2>
          
          <form className="space-y-6">
            
            {/* Añadir receptor */}
            <div>
              <label className="block text-black text-lg font-bold mb-2">Añadir receptor</label>
              <div className="flex items-center space-x-2 mb-4">
                 <div className="relative w-full">
                    <select 
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-kanbas-blue text-gray-800 focus:outline-none focus:ring-2 focus:ring-kanbas-blue appearance-none cursor-pointer"
                    >
                        {availableRecipients.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-kanbas-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
                <button 
                  type="button"
                  onClick={handleAddRecipient} 
                  className="bg-kanbas-blue text-white rounded-full p-2 hover:bg-blue-600 transition shadow-md flex-shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>

               {/* Bolitas de receptores */}
              <div className="flex flex-wrap gap-3">
                {selectedRecipients.map((r, index) => (
                  <div key={index} className="bg-[#cbd5e1] rounded-full px-4 py-2 flex items-center space-x-2 group border border-transparent hover:border-kanbas-blue transition relative min-w-[150px] pr-10">
                    <span className="text-black font-medium">{r.name}</span>
                    <div className="bg-kanbas-blue rounded-full p-1 ml-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                    </div>

                    <button 
                      onClick={() => handleRemoveRecipient(index)}
                      className="absolute right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-black text-lg font-bold mb-2">Contenido</label>
              <textarea 
                rows="4" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 rounded-3xl bg-[#cbd5e1] border border-kanbas-blue text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue resize-none"
              ></textarea>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end space-x-4 pt-2">
              <button type="button" onClick={onClose} className="text-kanbas-blue font-bold hover:underline text-lg">Cancelar</button>
              <button type="button" onClick={() => { console.log('Enviando mensaje', { selectedRecipients, content }); onClose(); }} className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md">Enviar</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMessageModal;
