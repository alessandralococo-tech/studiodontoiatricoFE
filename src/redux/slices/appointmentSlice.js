import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [], 
  doctorList: [], 
  availableSlots: [],
  loading: false,
  error: null,
  bookingSuccess: false,
  cancelSuccess: false,
  updateSuccess: false,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // FETCH SLOTS
    fetchAvailableSlotsRequest: (state) => { state.loading = true; state.error = null; },
    fetchAvailableSlotsSuccess: (state, action) => { state.loading = false; state.availableSlots = action.payload; },
    fetchAvailableSlotsFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // CREATE
    createAppointmentRequest: (state) => { state.loading = true; state.error = null; state.bookingSuccess = false; },
    createAppointmentSuccess: (state, action) => { state.loading = false; state.bookingSuccess = true; state.list.push(action.payload); },
    createAppointmentFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // FETCH LISTS
    fetchMyAppointmentsRequest: (state) => { state.loading = true; state.error = null; },
    fetchMyAppointmentsSuccess: (state, action) => { state.loading = false; state.list = action.payload; },
    fetchMyAppointmentsFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    fetchDoctorAppointmentsRequest: (state) => { state.loading = true; state.error = null; },
    fetchDoctorAppointmentsSuccess: (state, action) => { state.loading = false; state.doctorList = action.payload; },
    fetchDoctorAppointmentsFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // UPDATE STATUS
    updateAppointmentStatusRequest: (state) => { state.loading = true; state.error = null; },
    updateAppointmentStatusSuccess: (state, action) => { 
      state.loading = false; 
      const updated = action.payload;
      state.doctorList = state.doctorList.map(app => app.id === updated.id ? updated : app);
    },
    updateAppointmentStatusFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // UPDATE FULL
    updateAppointmentRequest: (state) => { state.loading = true; state.error = null; state.updateSuccess = false; },
    updateAppointmentSuccess: (state, action) => { 
      state.loading = false; 
      state.updateSuccess = true;
      const updated = action.payload;
      state.doctorList = state.doctorList.map(app => app.id === updated.id ? updated : app);
    },
    updateAppointmentFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // CANCEL
    cancelAppointmentRequest: (state) => { state.loading = true; state.error = null; state.cancelSuccess = false; },
    cancelAppointmentSuccess: (state, action) => { 
      state.loading = false; 
      state.cancelSuccess = true; 
      const id = action.payload;
      state.list = state.list.filter(app => app.id !== id);
      state.doctorList = state.doctorList.filter(app => app.id !== id);
    },
    cancelAppointmentFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // UTILS
    resetBookingSuccess: (state) => { state.bookingSuccess = false; },
    resetCancelSuccess: (state) => { state.cancelSuccess = false; },
    resetUpdateSuccess: (state) => { state.updateSuccess = false; },
    clearAppointmentError: (state) => { state.error = null; },
  },
});

export const {
  fetchAvailableSlotsRequest, fetchAvailableSlotsSuccess, fetchAvailableSlotsFailure,
  createAppointmentRequest, createAppointmentSuccess, createAppointmentFailure,
  fetchMyAppointmentsRequest, fetchMyAppointmentsSuccess, fetchMyAppointmentsFailure,
  fetchDoctorAppointmentsRequest, fetchDoctorAppointmentsSuccess, fetchDoctorAppointmentsFailure,
  updateAppointmentStatusRequest, updateAppointmentStatusSuccess, updateAppointmentStatusFailure,
  updateAppointmentRequest, updateAppointmentSuccess, updateAppointmentFailure,
  cancelAppointmentRequest, cancelAppointmentSuccess, cancelAppointmentFailure,
  resetBookingSuccess, resetCancelSuccess, resetUpdateSuccess, clearAppointmentError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;