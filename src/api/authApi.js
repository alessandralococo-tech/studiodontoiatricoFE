import axiosInstance from '../utils/axiosConfig';

export const authApi = {
  // Login
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  // Registra paziente
  register: async (firstName, lastName, email, password, phone, birth) => {
    const response = await axiosInstance.post('/auth/register', {
      firstName, lastName, email, password, phone, birth
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
  },

  // Modifica Profilo
  updatePatientProfile: async (profileData) => {
    const response = await axiosInstance.patch('/patient/me/profile', profileData);
    return response.data;
  },

  // Cambio Password
  changePatientPassword: async (oldPassword, newPassword, confirmPassword) => {
    const response = await axiosInstance.put('/patient/me/password', {
      oldPassword,
      newPassword,
      confirmNewPassword: confirmPassword
    });
    return response.data;
  }
};

export default authApi;