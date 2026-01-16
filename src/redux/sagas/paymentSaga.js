import { call, put, takeLatest } from 'redux-saga/effects';
import {
  createPayPalPaymentRequest,
  createPayPalPaymentSuccess,
  createPayPalPaymentFailure,
  capturePayPalPaymentRequest,
  capturePayPalPaymentSuccess,
  capturePayPalPaymentFailure,
  fetchMyPaymentsRequest, // IMPORT
  fetchMyPaymentsSuccess, // IMPORT
  fetchMyPaymentsFailure  // IMPORT
} from '../slices/paymentSlice';
import paymentApi from '../../api/paymentApi';

// CREATE PAYPAL PAYMENT SAGA
function* createPayPalPaymentSaga(action) {
  try {
    const { amount, appointmentId } = action.payload;
    const response = yield call(paymentApi.initiatePayPalPayment, amount, appointmentId);
    
    // response.data dovrebbe contenere l'orderId
    const orderId = response.data;
    
    yield put(createPayPalPaymentSuccess({ orderId }));
    
    // Reindirizza a PayPal
    const paypalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`;
    window.location.href = paypalUrl;
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Errore nella creazione del pagamento PayPal';
    yield put(createPayPalPaymentFailure(errorMessage));
  }
}

// CAPTURE PAYPAL PAYMENT SAGA (dopo il redirect da PayPal)
function* capturePayPalPaymentSaga(action) {
  try {
    const { token } = action.payload;
    
    // Il backend cattura il pagamento tramite il success endpoint
    yield call(paymentApi.capturePayPalPayment, token);
    
    yield put(capturePayPalPaymentSuccess());
    
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Errore nella cattura del pagamento PayPal';
    yield put(capturePayPalPaymentFailure(errorMessage));
  }
}

// NUOVO: FETCH MY PAYMENTS SAGA
function* fetchMyPaymentsSaga() {
  try {
    const response = yield call(paymentApi.getMyPayments);
    yield put(fetchMyPaymentsSuccess(response.data));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Errore recupero pagamenti';
    yield put(fetchMyPaymentsFailure(errorMessage));
  }
}

// WATCHER SAGA
export default function* paymentSaga() {
  yield takeLatest(createPayPalPaymentRequest.type, createPayPalPaymentSaga);
  yield takeLatest(capturePayPalPaymentRequest.type, capturePayPalPaymentSaga);
  yield takeLatest(fetchMyPaymentsRequest.type, fetchMyPaymentsSaga); // ASCOLTA LA NUOVA AZIONE
}