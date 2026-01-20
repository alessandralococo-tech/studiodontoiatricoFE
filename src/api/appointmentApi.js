import axiosInstance from '../utils/axiosConfig';

export const appointmentApi = {
  // Recupera gli slot orari disponibili per un medico in una data specifica
  getAvailableSlots: async (doctorId, date, durationMinutes) => {
    const response = await axiosInstance.get('/appointments/available-slots', {
      params: { 
        doctorId, 
        date, 
        durationMinutes 
      },
    });
    return response.data;
  },

  // Crea un nuovo appuntamento
  createAppointment: async (appointmentData) => {
    const response = await axiosInstance.post('/appointments', appointmentData);
    return response.data;
  },

  // Recupera gli appuntamenti del paziente loggato
  getMyAppointments: async () => {
    const response = await axiosInstance.get('/appointments/patient');
    return response.data;
  },

  // Recupera gli appuntamenti del medico loggato
  getDoctorAppointments: async (date = null) => {
    const params = date ? { date } : {};
    const response = await axiosInstance.get('/appointments/doctor', { params });
    return response.data;
  },

  // Recupera tutti gli appuntamenti (funzionalità Admin)
  getAllAppointments: async () => {
    const response = await axiosInstance.get('/appointments/admin');
    return response.data;
  },

  // Elimina definitivamente un appuntamento dal database
  cancelAppointment: async (id) => {
    const response = await axiosInstance.delete(`/appointments/${id}`);
    return response.data;
  },

  // Modifica completa di un appuntamento
  updateAppointment: async (id, appointmentData) => {
    const response = await axiosInstance.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },

  // Aggiorna solo lo stato dell'appuntamento
  updateAppointmentStatus: async (id, status) => {
    const response = await axiosInstance.put(`/appointments/${id}/status`, { status });
    return response.data;
  },
};

export default appointmentApi;