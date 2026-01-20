import axios from 'axios';

// Legge l'URL dal file .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Request: PULIZIA E INVIO TOKEN
axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    
    // Controllo che il token esista e sia valido
    if (token && token !== 'undefined' && token !== 'null') {
      
      // Rimuove eventuali virgolette extra
      token = token.replace(/"/g, '');
      
      // Rimuove prefisso Bearer se già presente
      if (token.startsWith('Bearer ')) {
         token = token.substring(7);
      }
      
      // Invio pulito nell'header
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Gestione Errori Globali
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token scaduto o invalido. Logout forzato.");
      // Pulisce lo storage per evitare loop
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;