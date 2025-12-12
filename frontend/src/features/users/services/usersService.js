const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const searchUser = async (emailOrUsername) => {
    try {
        // GET /api/usuarios/buscar?identifier={emailOrUsername}
        const encodedParam = encodeURIComponent(emailOrUsername);
        const response = await fetch(`${API_URL}/usuarios/buscar?identifier=${encodedParam}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Usuario no encontrado');
        }

        return data; // devuelve directamente el objeto usuario
    } catch (error) {
        throw error;
    }
};
