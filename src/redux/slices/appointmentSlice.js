import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [], // Per il paziente
  doctorList: [], // Per il medico
  availableSlots: [],
  loading: false,
  error: null,
  bookingSuccess: false,
  cancelSuccess: false,
  updateSuccess: false, // Per notificare aggiornamenti
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // --- FETCH SLOTS ---
    fetchAvailableSlotsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAvailableSlotsSuccess: (state, action) => {
      state.loading = false;
      state.availableSlots = action.payload;
    },
    fetchAvailableSlotsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- CREATE APPOINTMENT ---
    createAppointmentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.bookingSuccess = false;
    },
    createAppointmentSuccess: (state, action) => {
      state.loading = false;
      state.bookingSuccess = true;
      // Se è un paziente, aggiungi alla sua lista
      state.list.push(action.payload); 
    },
    createAppointmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- FETCH MY APPOINTMENTS (PAZIENTE) ---
    fetchMyAppointmentsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMyAppointmentsSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchMyAppointmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- FETCH DOCTOR APPOINTMENTS (NUOVO - MEDICO) ---
    fetchDoctorAppointmentsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDoctorAppointmentsSuccess: (state, action) => {
      state.loading = false;
      state.doctorList = action.payload;
    },
    fetchDoctorAppointmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- UPDATE APPOINTMENT STATUS ---
    updateAppointmentStatusRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.updateSuccess = false;
    },
    updateAppointmentStatusSuccess: (state, action) => {
      state.loading = false;
      state.updateSuccess = true;
      // Aggiorniamo l'elemento nella lista del medico
      const updatedApp = action.payload;
      state.doctorList = state.doctorList.map(app => 
        app.id === updatedApp.id ? updatedApp : app
      );
    },
    updateAppointmentStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // --- CANCEL APPOINTMENT ---
    cancelAppointmentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.cancelSuccess = false;
    },
    cancelAppointmentSuccess: (state, action) => {
      state.loading = false;
      state.cancelSuccess = true;
      const id = action.payload;
      // Rimuovi da entrambe le liste per sicurezza
      state.list = state.list.filter(app => app.id !== id);
      state.doctorList = state.doctorList.filter(app => app.id !== id);
    },
    cancelAppointmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // UTILS
    resetBookingSuccess: (state) => { state.bookingSuccess = false; },
    resetCancelSuccess: (state) => { state.cancelSuccess = false; },
    resetUpdateSuccess: (state) => { state.updateSuccess = false; },
    clearAppointmentError: (state) => { state.error = null; },
  },
});

export const {
  fetchAvailableSlotsRequest,
  fetchAvailableSlotsSuccess,
  fetchAvailableSlotsFailure,
  createAppointmentRequest,
  createAppointmentSuccess,
  createAppointmentFailure,
  fetchMyAppointmentsRequest,
  fetchMyAppointmentsSuccess,
  fetchMyAppointmentsFailure,
  fetchDoctorAppointmentsRequest,
  fetchDoctorAppointmentsSuccess,
  fetchDoctorAppointmentsFailure,
  updateAppointmentStatusRequest,
  updateAppointmentStatusSuccess,
  updateAppointmentStatusFailure,
  cancelAppointmentRequest,
  cancelAppointmentSuccess,
  cancelAppointmentFailure,
  resetBookingSuccess,
  resetCancelSuccess,
  resetUpdateSuccess,
  clearAppointmentError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;