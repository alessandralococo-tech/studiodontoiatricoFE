import axiosInstance from '../utils/axiosConfig';

const paymentApi = {
  //POST /payments/create?amount=XX&appointmentId=YY
  initiatePayPalPayment: (amount, appointmentId) => {
    return axiosInstance.post('/payments/create', null, {
      params: {
        amount: amount,
        appointmentId: appointmentId
      }
    });
  },
};

export default paymentApi;