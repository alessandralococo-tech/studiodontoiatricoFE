import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  selectedDoctor: null,
  loading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    // FETCH ALL DOCTORS
    fetchDoctorsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDoctorsSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
      state.error = null;
    },
    fetchDoctorsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // SELECT DOCTOR
    selectDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },

    // CLEAR SELECTION
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },
});

export const {
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  selectDoctor,
  clearSelectedDoctor,
} = doctorSlice.actions;

export default doctorSlice.reducer;