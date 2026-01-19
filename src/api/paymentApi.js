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

  // POST /payments/capture?orderId=...
  capturePayPalPayment: (token) => {
    return axiosInstance.post('/payments/capture', null, {
      params: {
        orderId: token
      }
    });
  },

  // GET /payments/my
  getMyPayments: () => {
    return axiosInstance.get('/payments/my');
  }
};

export default paymentApi;