const API_URL = 'http://100.113.154.56:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const createComment = async (idTarea, contenido) => {
    const response = await fetch(`${API_URL}/comentarios/crear`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ idTarea, contenido })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error creando comentario');
    }
    return data; // { mensaje, comentario }
};

export const getComments = async (idTarea) => {
    const response = await fetch(`${API_URL}/comentarios/listar/${idTarea}`, {
        method: 'GET',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error obteniendo comentarios');
    }
    return data; // Array of comments
};

export const deleteComment = async (idComentario) => {
    const response = await fetch(`${API_URL}/comentarios/eliminar/${idComentario}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.mensaje || 'Error eliminando comentario');
    }
    return data;
};
