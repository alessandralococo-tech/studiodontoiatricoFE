import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  availableSlots: [],
  loading: false,
  error: null,
  bookingSuccess: false,
  cancelSuccess: false,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // FETCH AVAILABLE SLOTS
    fetchAvailableSlotsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAvailableSlotsSuccess: (state, action) => {
      state.loading = false;
      state.availableSlots = action.payload;
      state.error = null;
    },
    fetchAvailableSlotsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CREATE APPOINTMENT
    createAppointmentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.bookingSuccess = false;
    },
    createAppointmentSuccess: (state, action) => {
      state.loading = false;
      state.list.push(action.payload);
      state.bookingSuccess = true;
      state.error = null;
    },
    createAppointmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.bookingSuccess = false;
    },

    // FETCH MY APPOINTMENTS
    fetchMyAppointmentsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMyAppointmentsSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
      state.error = null;
    },
    fetchMyAppointmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CANCEL APPOINTMENT
    cancelAppointmentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.cancelSuccess = false;
    },
    cancelAppointmentSuccess: (state, action) => {
      state.loading = false;
      state.cancelSuccess = true;
      state.error = null;
      // Rimuovi l'appuntamento dalla lista locale o aggiorna il suo stato
      const appointmentId = action.payload;
      state.list = state.list.map(app => 
        app.id === appointmentId 
          ? { ...app, status: 'CANCELLED' }
          : app
      );
    },
    cancelAppointmentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.cancelSuccess = false;
    },

    // RESET BOOKING SUCCESS
    resetBookingSuccess: (state) => {
      state.bookingSuccess = false;
    },

    // RESET CANCEL SUCCESS
    resetCancelSuccess: (state) => {
      state.cancelSuccess = false;
    },

    // CLEAR ERROR
    clearAppointmentError: (state) => {
      state.error = null;
    },
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
  cancelAppointmentRequest,
  cancelAppointmentSuccess,
  cancelAppointmentFailure,
  resetBookingSuccess,
  resetCancelSuccess,
  clearAppointmentError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;