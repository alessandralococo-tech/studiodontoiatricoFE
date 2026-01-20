import { call, put, takeLatest } from 'redux-saga/effects';
import {
  createPayPalPaymentRequest,
  createPayPalPaymentSuccess,
  createPayPalPaymentFailure,
  capturePayPalPaymentRequest,
  capturePayPalPaymentSuccess,
  capturePayPalPaymentFailure,
  fetchMyPaymentsRequest,
  fetchMyPaymentsSuccess,
  fetchMyPaymentsFailure
} from '../slices/paymentSlice';
import paymentApi from '../../api/paymentApi';

// CREATE PAYPAL PAYMENT SAGA
function* createPayPalPaymentSaga(action) {
  try {
    const { amount, appointmentId } = action.payload;
    console.log("Richiesta creazione ordine Backend avviata...");
    
    const response = yield call(paymentApi.initiatePayPalPayment, amount, appointmentId);
    
    console.log("Risposta Backend ricevuta:", response.data);

    let orderId = null;

    // Logica estrazione token
    if (typeof response.data === 'string') {
      try {
        if (response.data.includes("token=")) {
          const urlObj = new URL(response.data);
          orderId = urlObj.searchParams.get("token");
        } else {
          orderId = response.data;
        }
      } catch (e) {
        console.warn(" Parsing URL fallito, uso Regex fallback");
        const match = response.data.match(/token=([^&]+)/);
        if (match) orderId = match[1];
      }
    } else if (response.data?.orderId) {
      orderId = response.data.orderId;
    }

    if (!orderId) {
      throw new Error('Impossibile estrarre Order ID dalla risposta del server: ' + response.data);
    }
    
    console.log('PayPal Order ID estratto:', orderId);
    yield put(createPayPalPaymentSuccess({ orderId }));
    
  } catch (error) {
    console.error('Errore creazione ordine PayPal:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Errore creazione ordine';
    yield put(createPayPalPaymentFailure(errorMessage));
  }
}

// CAPTURE PAYPAL PAYMENT SAGA
function* capturePayPalPaymentSaga(action) {
  try {
    const { token } = action.payload;
    console.log('Tentativo cattura pagamento per token:', token);
    
    yield call(paymentApi.capturePayPalPayment, token);
    
    console.log('Pagamento catturato con successo nel Backend');
    yield put(capturePayPalPaymentSuccess());
    
  } catch (error) {
    console.error('Errore cattura pagamento:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Errore cattura pagamento';
    yield put(capturePayPalPaymentFailure(errorMessage));
  }
}

// FETCH MY PAYMENTS
function* fetchMyPaymentsSaga() {
  try {
    // Chiama l'API per ottenere la lista dei pagamenti dell'utente loggato
    const response = yield call(paymentApi.getMyPayments);
    
    // Aggiorna lo stato Redux con la lista ricevuta
    yield put(fetchMyPaymentsSuccess(response.data));
    
  } catch (error) {
    console.error('Errore recupero storico pagamenti:', error);
    yield put(fetchMyPaymentsFailure(error.message || 'Errore recupero pagamenti'));
  }
}

export default function* paymentSaga() {
  yield takeLatest(createPayPalPaymentRequest.type, createPayPalPaymentSaga);
  yield takeLatest(capturePayPalPaymentRequest.type, capturePayPalPaymentSaga);
  yield takeLatest(fetchMyPaymentsRequest.type, fetchMyPaymentsSaga);
}