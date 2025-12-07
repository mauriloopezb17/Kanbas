import React from 'react';
import logoWhite from '../assets/logo_mono.png';

const MainLayout = ({ children, isBoardView = false, projectName = '', onLogoClick }) => {
  return (
    <div className="min-h-screen bg-[#f0f0f5]">
      {/* Top Bar */}
      <header className="bg-[#0097b2] h-16 flex items-center justify-between px-4 shadow-md relative z-10">
        <div className="flex items-center">
          {/* Logo */}
          <div 
            className={`${isBoardView ? 'mr-4 cursor-pointer' : 'absolute left-1/2 transform -translate-x-1/2'}`}
            onClick={() => isBoardView && onLogoClick && onLogoClick()}
          >
            <img src={logoWhite} alt="Kanbas Logo" className="h-7 w-auto" />
          </div>

          {isBoardView && (
            <>
               {/* Separator */}
               <div className="h-8 w-1 bg-white/30 mx-2"></div>
               
               {/* Project Name */}
               <h1 className="text-white text-xl font-bold font-sans ml-2">
                 {projectName}
               </h1>
            </>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
           {isBoardView && (
             <>
               <button className="bg-white text-[#0097b2] px-4 py-1 rounded-full font-bold text-sm shadow-sm hover:bg-gray-100 transition">
                 Generar Reporte
               </button>
               {/* Separator */}
               <div className="h-8 w-1 bg-white/30 mx-2"></div>
             </>
           )}

          <button className="text-white hover:text-white/80 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </button>
          
          <button className="text-white hover:text-white/80 focus:outline-none">
            <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0097b2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
            </div>
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
