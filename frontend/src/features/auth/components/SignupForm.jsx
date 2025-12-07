import React, { useState } from 'react';

const SignupForm = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center animate-gradient-bg">
      <div className="bg-[#f0f0f5] p-8 rounded-[2rem] shadow-lg w-full max-w-2xl mx-4">
        <div className="flex justify-center mb-8">
          <h1 className="text-6xl font-bold text-kanbas-blue drop-shadow-[4px_4px_0px_rgba(92,92,138,0.5)] tracking-wide font-sans">
            kanbas
          </h1>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-800 text-lg font-medium mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              placeholder="nombreEjemplo01"
              className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#8da3b6] text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1">
                Nombres
              </label>
              <input
                type="text"
                placeholder="Juan"
                className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#8da3b6] text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-800 text-lg font-medium mb-1">
                Apellidos
              </label>
              <input
                type="text"
                placeholder="Perez"
                className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#8da3b6] text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 text-lg font-medium mb-1">
              E-mail
            </label>
            <input
              type="email"
              placeholder="Ejemplo@correo.com"
              className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#8da3b6] text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-800 text-lg font-medium mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#8da3b6] text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-kanbas-blue hover:text-blue-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-kanbas-blue font-bold hover:underline text-sm sm:text-base"
            >
              Iniciar Sesion
            </button>
            <button
              type="submit"
              className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
            >
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
