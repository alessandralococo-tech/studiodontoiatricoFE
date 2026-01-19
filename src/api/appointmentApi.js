import axiosInstance from '../utils/axiosConfig';

export const appointmentApi = {
  // GET AVAILABLE SLOTS per dottore/data/durata
  getAvailableSlots: async (doctorId, date, durationMinutes) => {
    const response = await axiosInstance.get('/appointments/available-slots', {
      params: {
        doctorId,
        date,
        durationMinutes,
      },
    });
    return response.data;
  },

  // CREATE APPOINTMENT
  createAppointment: async (appointmentData) => {
    const response = await axiosInstance.post('/appointments', appointmentData);
    return response.data;
  },

  // GET MY APPOINTMENTS (PAZIENTE)
  getMyAppointments: async () => {
    const response = await axiosInstance.get('/appointments/patient');
    return response.data;
  },

  // GET DOCTOR APPOINTMENTS (i propri appuntamenti del medico)
  getDoctorAppointments: async (date = null) => {
    const params = date ? { date } : {};
    const response = await axiosInstance.get('/appointments/doctor', { params });
    return response.data;
  },

  // GET ALL APPOINTMENTS
  getAllAppointments: async () => {
    const response = await axiosInstance.get('/appointments/admin');
    return response.data;
  },

  cancelAppointment: async (id) => {
    const response = await axiosInstance.delete(`/appointments/${id}`);
    return response.data;
  },

  // UPDATE APPOINTMENT (PUT /appointments/{id})
  updateAppointment: async (id, appointmentData) => {
    const response = await axiosInstance.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // UPDATE APPOINTMENT STATUS (medico cambia stato)
  updateAppointmentStatus: async (id, status) => {
    const response = await axiosInstance.put(`/appointments/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },
};

export default appointmentApi;