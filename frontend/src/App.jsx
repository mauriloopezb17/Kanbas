// src/App.jsx
import React, { useState } from 'react';
import LoginForm from './features/auth/components/LoginForm';
import SignupForm from './features/auth/components/SignupForm';
import ProjectsDashboard from './features/projects/pages/ProjectsDashboard';
import { login } from './features/auth/services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  const handleLogin = async (credentials) => {
    try {
      // Usar servicio de login falso
      // En una app real, manejarías estados de carga aquí
      const response = await login(credentials);
      setUser(response.user);
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  // Si el usuario está logueado, mostrar el dashboard
  if (user) {
    return <ProjectsDashboard user={user} />;
  }

  return (
    <div>
      {isLoginView ? (
        <LoginForm 
          onSwitchToSignup={() => setIsLoginView(false)} 
          onSubmit={handleLogin}
        />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLoginView(true)} />
      )}
    </div>
  );
}

export default App;