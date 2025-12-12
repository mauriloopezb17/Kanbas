const API_URL = 'http://100.113.154.56:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const createTask = async (taskData) => {
    const response = await fetch(`${API_URL}/tareas/crear`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
    });
    
    const data = await response.json();
    if (!response.ok) {
         throw new Error(data.error || data.mensaje || 'Error creating task');
    }
    return data;
};

export const deleteTask = async (taskId) => {
    const response = await fetch(`${API_URL}/tareas/eliminar/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error al eliminar la tarea');
    }
    return data;
};

export const getTaskById = async (taskId, projectId) => {
    const response = await fetch(`${API_URL}/tareas/${taskId}/${projectId}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error al obtener la tarea');
    }
    return data; // Retorna objeto tarea con idEquipo, asignados, etc.
};

export const updateTask = async (taskId, projectId, taskData) => {
    const response = await fetch(`${API_URL}/tareas/editar/${taskId}/${projectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error al actualizar la tarea');
    }
    return data;
};

export const getTasksByProject = async (projectId) => {
    try {
        const response = await fetch(`${API_URL}/tareas/proyecto/${projectId}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al obtener tareas del proyecto');
        }

        return data; 
    } catch (error) {
        throw error;
    }
};

export const autoAssignTask = async (taskId, projectId) => {
    // POST /api/tareas/autoasignar/:taskId/:projectId
    const response = await fetch(`${API_URL}/tareas/autoasignar/${taskId}/${projectId}`, {
        method: 'POST',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error al auto-asignar la tarea');
    }
    return data;
};

export const updateTaskStatus = async (taskId, projectId, newStatus) => {
    // PATCH /api/tareas/:taskId/estado
    const response = await fetch(`${API_URL}/tareas/${taskId}/estado`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ idProyecto: projectId, nuevoEstado: newStatus })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error actualizando estado');
    }
    return data;
};
