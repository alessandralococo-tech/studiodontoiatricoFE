import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  paymentMethod: null, // 'PAYPAL' o 'CASH'
  paypalOrderId: null,
  loading: false,
  error: null,
  paymentSuccess: false,
  paymentList: [], // NUOVO: Lista per salvare i pagamenti scaricati
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // SET PAYMENT METHOD
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      state.error = null;
    },

    // CREATE PAYPAL PAYMENT
    createPayPalPaymentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPayPalPaymentSuccess: (state, action) => {
      state.loading = false;
      state.paypalOrderId = action.payload.orderId;
      state.error = null;
    },
    createPayPalPaymentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // CAPTURE PAYPAL PAYMENT
    capturePayPalPaymentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    capturePayPalPaymentSuccess: (state) => {
      state.loading = false;
      state.paymentSuccess = true;
      state.error = null;
    },
    capturePayPalPaymentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // NUOVO: FETCH MY PAYMENTS
    fetchMyPaymentsRequest: (state) => {
      state.loading = true;
    },
    fetchMyPaymentsSuccess: (state, action) => {
      state.loading = false;
      state.paymentList = action.payload;
    },
    fetchMyPaymentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // RESET PAYMENT STATE
    resetPaymentState: (state) => {
      state.paymentMethod = null;
      state.paypalOrderId = null;
      state.loading = false;
      state.error = null;
      state.paymentSuccess = false;
    },

    // CLEAR ERROR
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setPaymentMethod,
  createPayPalPaymentRequest,
  createPayPalPaymentSuccess,
  createPayPalPaymentFailure,
  capturePayPalPaymentRequest,
  capturePayPalPaymentSuccess,
  capturePayPalPaymentFailure,
  fetchMyPaymentsRequest, // EXPORT
  fetchMyPaymentsSuccess, // EXPORT
  fetchMyPaymentsFailure, // EXPORT
  resetPaymentState,
  clearPaymentError,
} = paymentSlice.actions;

export default paymentSlice.reducer;