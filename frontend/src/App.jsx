// src/App.jsx
import React, { useState } from 'react';
import LoginForm from './features/auth/components/LoginForm';
import SignupForm from './features/auth/components/SignupForm';
import ProjectsDashboard from './features/projects/pages/ProjectsDashboard';
import BoardPage from './features/board/pages/BoardPage';
import { login, register } from './features/auth/services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  // Efecto para persistencia
  React.useEffect(() => {
    // 1. Recuperar usuario del localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Recuperar proyecto actual
    const storedProject = localStorage.getItem('currentProject');
    if (storedProject) {
      setCurrentProject(JSON.parse(storedProject));
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token); 
      localStorage.setItem('user', JSON.stringify(response.usuario)); // Persistir usuario
      setUser(response.usuario); 
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (userData) => {
    try {
      await register(userData);
      setIsLoginView(true);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentProject');
    setUser(null);
    setCurrentProject(null);
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    localStorage.setItem('currentProject', JSON.stringify(project));
  };

  const handleBackToDashboard = () => {
    setCurrentProject(null);
    localStorage.removeItem('currentProject');
  };

  // Si el usuario está logueado
  if (user) {
    if (currentProject) {
      return (
        <div className="animate-fade-in">
          <BoardPage 
            user={user}
            project={currentProject} 
            onBack={handleBackToDashboard}
            onLogout={handleLogout}
          />
        </div>
      );
    }
    return (
      <div className="animate-fade-in">
        <ProjectsDashboard 
          user={user} 
          onProjectClick={handleProjectSelect} 
          onLogout={handleLogout} 
        />
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
        <SignupForm 
          onSwitchToLogin={() => setIsLoginView(true)} 
          onSubmit={handleSignup}
        />
      )}
    </div>
  );
}

export default App;