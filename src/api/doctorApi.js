import axiosInstance from '../utils/axiosConfig';

export const doctorApi = {
  // GET ALL DOCTORS
  // Punta al nuovo endpoint pubblico che restituisce tutti i medici
  getAllDoctors: async () => {
    const response = await axiosInstance.get('/alldoctors');
    return response.data;
  },

  // GET DOCTOR BY ID
  // Manteniamo questo standard
  getDoctorById: async (id) => {
    const response = await axiosInstance.get(`/doctor/${id}`);
    return response.data;
  },
};

export default doctorApi;