import axiosInstance from '../utils/axiosConfig';

export const authApi = {
  // Login
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Registra paziente
  register: async (firstName, lastName, email, password) => {
    const response = await axiosInstance.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },
  
  // Ottieni profilo Paziente
  getPatientProfile: async () => {
    const response = await axiosInstance.get('/patient/me');
    return response.data;
  },

  // Ottieni profilo Medico
  getDoctorProfile: async () => {
    const response = await axiosInstance.get('/alldoctors/me');
    return response.data;
  }
};

export default authApi;