import React, { useState } from 'react';

const NotificationsPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('proyecto');
  const [isExiting, setIsExiting] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setShowPanel(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
      const timer = setTimeout(() => setShowPanel(false), 250); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !showPanel) return null;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop - Matches CreateProjectModal */}
      <div 
        className={`absolute inset-0 bg-black/10 backdrop-blur-sm transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      ></div>

      {/* Panel - Overlapping the topbar button */}
      <div 
        className={`fixed z-50 w-96 h-auto max-h-[85vh] top-3 right-[4.5rem] bg-[#f0f0f5] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col origin-top-right transition-all duration-300 ease-in-out ${isExiting ? 'animate-fade-out scale-95 opacity-0' : 'animate-modal-grow scale-100 opacity-100'}`}
      >
        
        {/* Header */}
        <div className="bg-white p-4 pb-2 rounded-t-[2rem]">
          <div className="flex items-center justify-between mb-4 px-2 pt-1">
            <h2 className="text-2xl font-bold text-kanbas-blue font-sans">Notificaciones</h2>
            <div className="text-kanbas-blue">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
               </svg>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-around text-lg border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('proyecto')}
              className={`pb-2 font-medium transition-colors relative ${activeTab === 'proyecto' ? 'text-kanbas-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Proyecto
              {activeTab === 'proyecto' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-kanbas-blue rounded-t-full"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('inbox')}
              className={`pb-2 font-medium transition-colors relative ${activeTab === 'inbox' ? 'text-kanbas-blue' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Inbox
              {activeTab === 'inbox' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-kanbas-blue rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-3">
          
          {activeTab === 'proyecto' && (
            <>
              {/* Notification Item: Deadline Warning */}
              <div className="bg-[#cbd5e1] rounded-3xl p-5 relative">
                <p className="text-gray-800 text-sm leading-snug">
                  Queda <span className="text-red-500 font-bold">menos del 25%</span> del tiempo estimado para la <span className="text-kanbas-blue font-bold">Tarea 3</span>
                </p>
                <p className="text-gray-500 text-xs text-right mt-2">11/30/25 10:49 PM</p>
              </div>

              {/* Notification Item: Comment */}
              <div className="bg-[#cbd5e1] rounded-3xl p-5 relative">
                <p className="text-gray-800 text-sm leading-snug">
                  Recibiste un comentario en la <span className="text-kanbas-blue font-bold">Tarea 3</span> del <span className="text-kanbas-blue font-bold">Proyecto Ejemplo</span>
                </p>
                <p className="text-gray-500 text-xs text-right mt-2">11/30/25 11:00 PM</p>
              </div>

              {/* Notification Item: New Tasks */}
              <div className="bg-[#cbd5e1] rounded-3xl p-5 relative">
                <p className="text-gray-800 text-sm leading-snug">
                  Tienes nuevas tareas en el proyecto <span className="text-kanbas-blue font-bold">Angry Birds</span>
                </p>
                <p className="text-gray-500 text-xs text-right mt-2">11/30/25 10:49 PM</p>
              </div>

              {/* Notification Item: Assignment */}
              <div className="bg-[#cbd5e1] rounded-3xl p-5 relative">
                <p className="text-gray-800 text-sm leading-snug">
                  Fuiste Asignado al equipo <span className="text-kanbas-blue font-bold">Dev Movil</span> del proyecto <span className="text-kanbas-blue font-bold">Angry Birds</span>
                </p>
                <p className="text-gray-500 text-xs text-right mt-2">11/30/25 10:45 PM</p>
              </div>
            </>
          )}

          {activeTab === 'inbox' && (
            <>
              {/* Message Item */}
              <div className="bg-[#cbd5e1] rounded-3xl p-5 relative">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-800">De: Orlando Rivera</span>
                </div>
                <p className="text-gray-800 text-sm font-medium mb-1">
                  Cumplen la mitad de RF en su Mockup
                </p>
                <p className="text-gray-500 text-xs text-right">12/3/25 10:45 PM</p>
              </div>

              {/* FAB */}
              <button className="absolute bottom-6 right-6 bg-kanbas-blue text-white rounded-full p-3 shadow-lg hover:bg-blue-600 transition transform hover:scale-105">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;
