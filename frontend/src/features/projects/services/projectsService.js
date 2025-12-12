const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getProjects = async () => {
    try {
        const response = await fetch(`${API_URL}/proyectos`, {
            method: 'GET',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al obtener proyectos');
        }

        return data.map(p => ({
            id: p.idproyecto || p.idProyecto,
            name: p.nombreproyecto || p.nombreProyecto || p.nombre,
            description: p.descripcion,
            color: p.color || '#e9d5ff',
            // IDs de roles para determinar permisos en el frontend
            idPO: p.idusuario_po || p.idUsuario_PO,
            idSRM: p.idusuario_srm || p.idUsuario_SRM,
            idSDM: p.idusuario_sdm || p.idUsuario_SDM
        }));
    } catch (error) {
        throw error;
    }
};

export const createProject = async (projectData) => {
    try {
        const response = await fetch(`${API_URL}/proyectos/crear`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(projectData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al crear el proyecto');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const assignProductOwner = async (projectId, emailOrUsername) => {
    try {
        const response = await fetch(`${API_URL}/proyectos/${projectId}/product-owner`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ emailOrUsername })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al asignar Product Owner');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const assignSDM = async (projectId, emailOrUsername) => {
    try {
        const response = await fetch(`${API_URL}/proyectos/${projectId}/sdm`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ emailOrUsername })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al asignar SDM');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const createTeam = async (projectId, teamName) => {
    try {
        const response = await fetch(`${API_URL}/equipos/crear`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ nombreEquipo: teamName, idProyecto: projectId })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al crear equipo');
        }

        return data; // devuelve { mensaje, equipo: { idEquipo, ... } }
    } catch (error) {
        throw error;
    }
};

export const addTeamMember = async (teamId, projectId, emailOrUsername) => {
    try {
        const response = await fetch(`${API_URL}/integrantes/agregar`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ idEquipo: teamId, idProyecto: projectId, emailOrUsername })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al agregar integrante');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteTeam = async (teamId) => {
    try {
        const response = await fetch(`${API_URL}/equipos/${teamId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.mensaje || 'Error al eliminar equipo');
        }

        return data;
    } catch (error) {
        throw error;
    }
};
