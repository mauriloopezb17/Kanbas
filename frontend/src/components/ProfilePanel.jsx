import React, { useState, useEffect } from 'react';

const ProfilePanel = ({ isOpen, onClose, onLogout, user }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowPanel(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
      const timer = setTimeout(() => setShowPanel(false), 250);
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
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/10 backdrop-blur-sm transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      ></div>

      {/* Panel - Fixed usage to overlap the topbar profile button */}
      {/* Right-4 aligns with the px-4 of the header for the last item */}
      <div 
        className={`fixed z-50 w-72 h-auto top-3 right-4 bg-[#f0f0f5] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col origin-top-right transition-all duration-300 ease-in-out ${isExiting ? 'animate-fade-out scale-95 opacity-0' : 'animate-modal-grow scale-100 opacity-100'}`}
      >
        
        {/* Header content */}
        <div className="bg-white p-6 rounded-t-[2rem] relative">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-kanbas-blue font-sans">{user?.usuario || 'Usuario'}</h2>
                    <p className="text-gray-500 text-sm font-medium">{user?.nombre || user?.firstName || ''} {user?.apellido || user?.lastName || ''}</p>
                </div>
                {/* Profile Icon Clone for overlap effect */}
                <div className="h-9 w-9 bg-[#f0f0f5] rounded-full flex items-center justify-center -mt-1 -mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-kanbas-blue" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-6">
            <button 
              onClick={onLogout}
              className="w-full bg-kanbas-blue hover:bg-blue-600 text-white font-bold py-3 rounded-full transition-colors shadow-md"
            >
                Cerrar Sesion
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
