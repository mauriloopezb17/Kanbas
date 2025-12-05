import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f0f0f5]">
      {/* Top Bar */}
      <header className="bg-[#0097b2] h-16 flex items-center justify-between px-4 shadow-md relative">
        {/* Espacio para contenido izquierdo */}
        <div className="w-20"></div>

        {/* Logo Centrado */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-4xl font-bold text-white tracking-wide font-sans drop-shadow-md">
            kanbas
          </h1>
        </div>

        {/* Iconos Derechos */}
        <div className="flex items-center space-x-4">
          <button className="text-white hover:text-gray-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </button>
          <button className="text-white hover:text-gray-200 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="p-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
