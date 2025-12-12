const API_URL = 'http://100.113.154.56:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const getProjectReport = async (projectId) => {
  console.log('[ReportService] Fetching report for Project ID:', projectId);
  
  try {
    const headers = getAuthHeaders();
    console.log('[ReportService] Headers:', { ...headers, Authorization: headers.Authorization ? 'Bearer ...' : 'Missing' });

    const response = await fetch(`${API_URL}/reportes/rendimiento/${projectId}`, {
      method: 'GET',
      headers: headers,
    });

    console.log('[ReportService] Response Status:', response.status);

    if (!response.ok) {
        const text = await response.text();
        console.error('[ReportService] Error Response Body:', text);
        
        let errorData;
        try {
            errorData = JSON.parse(text);
        } catch {
            errorData = { message: text || `Error ${response.status}` };
        }
        
        throw new Error(errorData.message || 'Error fetching report');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting project report:', error);
    throw error;
  }
};
