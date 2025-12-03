// src/features/auth/services/authService.js

const API_URL = 'http://localhost:3000/api'; // Marcador de posición
 
export const login = async (credentials) => {
  // Inicio de sesión falso para vista previa
  if (credentials.identifier === 'Pancake99' && credentials.password === '12345678') {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            username: 'Pancake99',
            firstName: 'Juan',
            lastName: 'Perez',
            email: 'pancake99@example.com'
          },
          token: 'fake-jwt-token'
        });
      }, 500); // Simular retraso de red
    });
  }

  // Implementación real (comentada por ahora)
  /*
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
  */
  throw new Error('Invalid credentials');
};

export const register = async (userData) => {
  // Registro falso
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: { ...userData },
        token: 'fake-jwt-token'
      });
    }, 500);
  });
};
