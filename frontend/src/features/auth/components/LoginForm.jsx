import React, { useState } from 'react';

const LoginForm = ({ onSwitchToSignup, onSubmit }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ identifier, password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0097b2]">
      <div className="bg-[#f0f0f5] p-8 rounded-[2rem] shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-center mb-8">
          <h1 className="text-6xl font-bold text-[#0097b2] drop-shadow-[4px_4px_0px_rgba(92,92,138,0.5)] tracking-wide font-sans">
            kanbas
          </h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-800 text-lg font-medium mb-2">
              Usuario/E-mail
            </label>
            <input
              type="text"
              placeholder="Ejemplo@correo.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#8da3b6] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-800 text-lg font-medium mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-[#cbd5e1] border border-[#8da3b6] text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0097b2] focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0097b2] hover:text-[#007a91] focus:outline-none"
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

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-[#0097b2] font-bold hover:underline text-sm sm:text-base"
            >
              Crear cuenta
            </button>
            <button
              type="submit"
              className="bg-[#0097b2] text-white font-bold py-3 px-8 rounded-full hover:bg-[#007a91] transition duration-300 shadow-md"
            >
              Iniciar Sesion
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
