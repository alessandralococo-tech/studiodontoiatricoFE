import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchAvailableSlotsRequest,
  fetchAvailableSlotsSuccess,
  fetchAvailableSlotsFailure,
  createAppointmentRequest,
  createAppointmentSuccess,
  createAppointmentFailure,
  fetchMyAppointmentsRequest,
  fetchMyAppointmentsSuccess,
  fetchMyAppointmentsFailure,
  cancelAppointmentRequest,
  cancelAppointmentSuccess,
  cancelAppointmentFailure,
} from '../slices/appointmentSlice';
import appointmentApi from '../../api/appointmentApi';

// FETCH AVAILABLE SLOTS SAGA
function* fetchAvailableSlotsSaga(action) {
  try {
    const { doctorId, date, durationMinutes } = action.payload;
    const slots = yield call(appointmentApi.getAvailableSlots, doctorId, date, durationMinutes);
    yield put(fetchAvailableSlotsSuccess(slots));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Errore nel caricamento degli slot disponibili';
    yield put(fetchAvailableSlotsFailure(errorMessage));
  }
}

// CREATE APPOINTMENT SAGA
function* createAppointmentSaga(action) {
  try {
    const appointment = yield call(appointmentApi.createAppointment, action.payload);
    yield put(createAppointmentSuccess(appointment));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Errore nella creazione dell\'appuntamento';
    yield put(createAppointmentFailure(errorMessage));
  }
}

// FETCH MY APPOINTMENTS SAGA
function* fetchMyAppointmentsSaga() {
  try {
    const appointments = yield call(appointmentApi.getMyAppointments);
    yield put(fetchMyAppointmentsSuccess(appointments));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Errore nel caricamento degli appuntamenti';
    yield put(fetchMyAppointmentsFailure(errorMessage));
  }
}

// CANCEL APPOINTMENT SAGA
function* cancelAppointmentSaga(action) {
  try {
    const { id, reason } = action.payload;
    
    // Chiama l'API per cancellare l'appuntamento passando anche il motivo
    yield call(appointmentApi.cancelAppointment, id, reason);
    
    // Se la cancellazione ha successo, invia l'ID per aggiornare lo store
    yield put(cancelAppointmentSuccess(id));
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Errore nell\'annullamento dell\'appuntamento';
    yield put(cancelAppointmentFailure(errorMessage));
  }
}

// WATCHER SAGA
export default function* appointmentSaga() {
  yield takeLatest(fetchAvailableSlotsRequest.type, fetchAvailableSlotsSaga);
  yield takeLatest(createAppointmentRequest.type, createAppointmentSaga);
  yield takeLatest(fetchMyAppointmentsRequest.type, fetchMyAppointmentsSaga);
  yield takeLatest(cancelAppointmentRequest.type, cancelAppointmentSaga);
}