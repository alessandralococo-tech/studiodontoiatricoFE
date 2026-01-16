import axiosInstance from '../utils/axiosConfig';

const paymentApi = {
  // POST /payments/create
  initiatePayPalPayment: (amount, appointmentId) => {
    return axiosInstance.post('/payments/create', null, {
      params: {
        amount: amount,
        appointmentId: appointmentId
      }
    });
  },

  // MODIFICATO: Usa l'endpoint di cattura manuale del controller
  // POST /payments/capture?orderId=...
  capturePayPalPayment: (token) => {
    return axiosInstance.post('/payments/capture', null, {
      params: {
        orderId: token // Il controller si aspetta "orderId", PayPal ci dà "token". Sono la stessa cosa.
      }
    });
  },

  // GET /payments/my
  getMyPayments: () => {
    return axiosInstance.get('/payments/my');
  }
};

export default paymentApi;