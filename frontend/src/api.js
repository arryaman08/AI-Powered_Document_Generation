import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    return api.post('/token', formData);
};

export const register = (email, password) => api.post('/register', { email, password });
export const getProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const generateTemplate = (topic, type, context) => api.post('/projects/generate-template', null, { params: { topic, doc_type: type, context }});
export const createProject = (data) => api.post('/projects', data);
export const refineSection = (id, instruction) => api.post('/refine', { section_id: id, instruction });
export const sendFeedback = (id, type, comment) => api.post('/feedback', { section_id: id, feedback_type: type, comment });
export const exportProject = (id) => `${API_URL}/projects/${id}/export`; // Returns URL