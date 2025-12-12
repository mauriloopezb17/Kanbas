const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getInboxMessages = async () => {
    try {
        const response = await fetch(`${API_URL}/mensajes/inbox`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al obtener mensajes');
        }

        return data; 
    } catch (error) {
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error fetching users');
        return data;
    } catch (error) {
        throw error;
    }
};

export const sendMessage = async (payload) => {
    try {
        const response = await fetch(`${API_URL}/mensajes/enviar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || data.mensaje || 'Error sending message');
        return data;
    } catch (error) {
        throw error;
    }
};
