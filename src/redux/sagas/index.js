import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import doctorSaga from './doctorSaga';
import appointmentSaga from './appointmentSaga';
// 1. IMPORTA LA SAGA
import paymentSaga from './paymentSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    doctorSaga(),
    appointmentSaga(),
    // 2. AGGIUNGI ALL'ARRAY
    paymentSaga(),
  ]);
}