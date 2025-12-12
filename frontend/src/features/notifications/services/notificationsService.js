const API_URL = 'http://100.113.154.56:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getNotifications = async () => {
    const response = await fetch(`${API_URL}/notificaciones`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error obteniendo notificaciones');
    }
    return data;
};
