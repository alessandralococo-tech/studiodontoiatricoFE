import axiosInstance from '../utils/axiosConfig';

export const authApi = {
  // LOGIN
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // REGISTER PAZIENTE
  register: async (firstName, lastName, email, password) => {
    const response = await axiosInstance.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    });
    return response.data;
  },

  // Questo serve perché il login non ci restituisce l'ID
  getPatientDetailsByEmail: async (email) => {
    const response = await axiosInstance.get(`/patients/email/${email}`);
    return response.data;
  }
};

export default authApi;