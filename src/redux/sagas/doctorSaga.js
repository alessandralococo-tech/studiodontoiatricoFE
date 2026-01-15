import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchDoctorsRequest,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
} from '../slices/doctorSlice';
import doctorApi from '../../api/doctorApi';

// FETCH DOCTORS SAGA
function* fetchDoctorsSaga() {
  try {
    // Chiama l'API reale (che ora punta a /alldoctors)
    const doctors = yield call(doctorApi.getAllDoctors);
    
    // Salva i medici reali nello store di Redux
    yield put(fetchDoctorsSuccess(doctors));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Errore nel caricamento dei medici';
    yield put(fetchDoctorsFailure(errorMessage));
  }
}

// WATCHER SAGA
export default function* doctorSaga() {
  yield takeLatest(fetchDoctorsRequest.type, fetchDoctorsSaga);
}