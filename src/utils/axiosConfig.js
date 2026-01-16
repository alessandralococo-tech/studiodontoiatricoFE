import axios from 'axios';

// URL DEL BACKEND
const API_BASE_URL = 'http://localhost:8080';

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
    
    // Controllo che il token esista
    if (token && token !== 'undefined' && token !== 'null') {
      
      //Rimuove eventuali virgolette extra salvate per sbaglio
      token = token.replace(/"/g, '');
      
      //Se il token salvato ha già "Bearer ", lo togliamo per non metterlo doppio
      if (token.startsWith('Bearer ')) {
         token = token.substring(7);
      }
      
      //Invio pulito
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor Response: Gestione Errori
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Token scaduto o invalido. Logout necessario.");
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;