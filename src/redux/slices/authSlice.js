import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
  updateSuccess: false, // Per notificare l'avvenuto aggiornamento
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // LOGIN & REGISTER
    loginRequest: (state) => { state.loading = true; state.error = null; },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => { state.loading = false; state.error = action.payload; },
    registerRequest: (state) => { state.loading = true; state.error = null; },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    // FETCH PROFILE
    fetchProfileRequest: (state) => { state.loading = true; },
    fetchProfileSuccess: (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    fetchProfileFailure: (state, action) => { state.loading = false; console.error(action.payload); },

    // --- NUOVE AZIONI PER UPDATE ---
    updateProfileRequest: (state) => { state.loading = true; state.updateSuccess = false; state.error = null; },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.updateSuccess = true;
      // Aggiorniamo i dati locali con quelli nuovi
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    updateProfileFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    changePasswordRequest: (state) => { state.loading = true; state.updateSuccess = false; state.error = null; },
    changePasswordSuccess: (state) => { state.loading = false; state.updateSuccess = true; },
    changePasswordFailure: (state, action) => { state.loading = false; state.error = action.payload; },

    resetUpdateStatus: (state) => { state.updateSuccess = false; state.error = null; },

    // LOGOUT
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => { state.error = null; },
  },
});

export const {
  loginRequest, loginSuccess, loginFailure,
  registerRequest, registerSuccess, registerFailure,
  fetchProfileRequest, fetchProfileSuccess, fetchProfileFailure,
  updateProfileRequest, updateProfileSuccess, updateProfileFailure,
  changePasswordRequest, changePasswordSuccess, changePasswordFailure,
  resetUpdateStatus, logout, clearError,
} = authSlice.actions;

export default authSlice.reducer;