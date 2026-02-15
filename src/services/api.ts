import axios from 'axios';

console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:3000/api');

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export default api;
