import axiosInstance from '../utils/axiosConfig';

export const doctorApi = {
  // Restituisce tutti i medici
  getAllDoctors: async () => {
    const response = await axiosInstance.get('/alldoctors');
    return response.data;
  },

  // Restituisce il medico specifico (id)
  getDoctorById: async (id) => {
    const response = await axiosInstance.get(`/doctor/${id}`);
    return response.data;
  },
};

export default doctorApi;