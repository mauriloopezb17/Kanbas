import React, { useState } from 'react';
import logoColor from '../../../assets/logo_color.png';

const LoginForm = ({ onSwitchToLogin, onSwitchToSignup, onSubmit }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!identifier.trim()) {
      newErrors.identifier = 'El usuario/email es obligatorio';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFocus = (field) => {
    if (errors[field] || errors.general) {
      setErrors(prev => ({ ...prev, [field]: null, general: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit({ identifier, password });
      } catch (error) {
        setErrors({ general: 'Credenciales inválidas. Inténtalo de nuevo.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getInputClass = (fieldName) => {
    const hasError = errors[fieldName] || errors.general;
    return `w-full px-4 py-3 rounded-full bg-[#cbd5e1] border text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-kanbas-blue focus:border-transparent ${
      hasError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#8da3b6]'
    }`;
  };

  const ErrorMessage = ({ message }) => (
    message ? <p className="text-red-500 text-sm mt-1 ml-4 animate-fade-in">{message}</p> : null
  );

  return (
    <div className="min-h-screen flex items-center justify-center animate-gradient-bg">
      <div className="bg-[#f0f0f5] p-8 rounded-[2rem] shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-center mb-8">
          <img src={logoColor} alt="Kanbas Logo" className="h-20 w-auto" />
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-gray-800 text-lg font-medium mb-2">
              Usuario/E-mail
            </label>
            <input
              type="text"
              placeholder="Ejemplo@correo.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onFocus={() => handleFocus('identifier')}
              className={getInputClass('identifier')}
            />
            <ErrorMessage message={errors.identifier} />
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
                onFocus={() => handleFocus('password')}
                className={`${getInputClass('password')} pr-12`}
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
            <ErrorMessage message={errors.password} />
            <ErrorMessage message={errors.general} />
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-kanbas-blue font-bold hover:underline text-sm sm:text-base"
            >
              Crear cuenta
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-kanbas-blue text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300 shadow-md disabled:bg-gray-400"
            >
              {isSubmitting ? 'Iniciando...' : 'Iniciar Sesion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
