import axiosInstance from '../utils/axiosConfig';

export const doctorApi = {
  // GET ALL DOCTORS
  getAllDoctors: async () => {
    const response = await axiosInstance.get('/alldoctors');
    return response.data;
  },

  // GET DOCTOR BY ID
  getDoctorById: async (id) => {
    const response = await axiosInstance.get(`/doctor/${id}`);
    return response.data;
  },
};

export default doctorApi;