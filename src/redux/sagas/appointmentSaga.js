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
  fetchDoctorAppointmentsRequest, // NUOVO
  fetchDoctorAppointmentsSuccess, // NUOVO
  fetchDoctorAppointmentsFailure, // NUOVO
  updateAppointmentStatusRequest, // NUOVO
  updateAppointmentStatusSuccess, // NUOVO
  updateAppointmentStatusFailure, // NUOVO
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
    const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento degli slot';
    yield put(fetchAvailableSlotsFailure(errorMessage));
  }
}

// CREATE APPOINTMENT SAGA
function* createAppointmentSaga(action) {
  try {
    const appointment = yield call(appointmentApi.createAppointment, action.payload);
    yield put(createAppointmentSuccess(appointment));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Errore nella creazione appuntamento';
    yield put(createAppointmentFailure(errorMessage));
  }
}

// FETCH MY APPOINTMENTS SAGA (Paziente)
function* fetchMyAppointmentsSaga() {
  try {
    const appointments = yield call(appointmentApi.getMyAppointments);
    yield put(fetchMyAppointmentsSuccess(appointments));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento appuntamenti';
    yield put(fetchMyAppointmentsFailure(errorMessage));
  }
}

// --- NUOVO: FETCH DOCTOR APPOINTMENTS SAGA (Medico) ---
function* fetchDoctorAppointmentsSaga(action) {
  try {
    // action.payload può contenere { date: 'YYYY-MM-DD' } opzionale
    const date = action.payload?.date || null;
    const appointments = yield call(appointmentApi.getDoctorAppointments, date);
    yield put(fetchDoctorAppointmentsSuccess(appointments));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Errore nel caricamento appuntamenti medico';
    yield put(fetchDoctorAppointmentsFailure(errorMessage));
  }
}

// --- NUOVO: UPDATE APPOINTMENT STATUS SAGA (Medico) ---
function* updateAppointmentStatusSaga(action) {
  try {
    const { id, status } = action.payload;
    // Chiama l'API per aggiornare lo stato
    const updatedAppointment = yield call(appointmentApi.updateAppointmentStatus, id, status);
    yield put(updateAppointmentStatusSuccess(updatedAppointment));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Errore nell\'aggiornamento dello stato';
    yield put(updateAppointmentStatusFailure(errorMessage));
  }
}

// CANCEL APPOINTMENT SAGA
function* cancelAppointmentSaga(action) {
  try {
    const { id } = action.payload;
    yield call(appointmentApi.cancelAppointment, id);
    yield put(cancelAppointmentSuccess(id));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Errore nella cancellazione';
    yield put(cancelAppointmentFailure(errorMessage));
  }
}

// WATCHER SAGA
export default function* appointmentSaga() {
  yield takeLatest(fetchAvailableSlotsRequest.type, fetchAvailableSlotsSaga);
  yield takeLatest(createAppointmentRequest.type, createAppointmentSaga);
  yield takeLatest(fetchMyAppointmentsRequest.type, fetchMyAppointmentsSaga);
  
  // Nuovi watcher per il medico
  yield takeLatest(fetchDoctorAppointmentsRequest.type, fetchDoctorAppointmentsSaga);
  yield takeLatest(updateAppointmentStatusRequest.type, updateAppointmentStatusSaga);
  
  yield takeLatest(cancelAppointmentRequest.type, cancelAppointmentSaga);
}