// src/App.jsx
import React, { useState } from 'react';
import LoginForm from './features/auth/components/LoginForm';
import SignupForm from './features/auth/components/SignupForm';
import ProjectsDashboard from './features/projects/pages/ProjectsDashboard';
import BoardPage from './features/board/pages/BoardPage';
import { login } from './features/auth/services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
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

  // Si el usuario está logueado
  if (user) {
    if (currentProject) {
      return (
        <div className="animate-fade-in">
          <BoardPage 
            project={currentProject} 
            onBack={() => setCurrentProject(null)} 
          />
        </div>
      );
    }
    return (
      <div className="animate-fade-in">
        <ProjectsDashboard user={user} onProjectClick={setCurrentProject} />
      </div>
    );
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