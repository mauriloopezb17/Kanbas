const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getTeamsByProject = async (projectId) => {
    // GET /api/equipos/proyecto/:id
    const response = await fetch(`${API_URL}/equipos/proyecto/${projectId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error fetching teams');
    return await response.json();
};

export const getTeamMembers = async (teamId) => {
    // GET /api/equipos/:id/integrantes
    const response = await fetch(`${API_URL}/equipos/${teamId}/integrantes`, {
        method: 'GET',
        headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error fetching team members');
    return await response.json();
};
