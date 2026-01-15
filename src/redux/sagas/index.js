import { all } from 'redux-saga/effects';
import authSaga from './authSaga';
import doctorSaga from './doctorSaga';
import appointmentSaga from './appointmentSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    doctorSaga(),
    appointmentSaga(),
  ]);
}