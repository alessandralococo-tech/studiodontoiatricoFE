import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchAvailableSlotsRequest, fetchAvailableSlotsSuccess, fetchAvailableSlotsFailure,
  createAppointmentRequest, createAppointmentSuccess, createAppointmentFailure,
  fetchMyAppointmentsRequest, fetchMyAppointmentsSuccess, fetchMyAppointmentsFailure,
  fetchDoctorAppointmentsRequest, fetchDoctorAppointmentsSuccess, fetchDoctorAppointmentsFailure,
  updateAppointmentStatusRequest, updateAppointmentStatusSuccess, updateAppointmentStatusFailure,
  updateAppointmentRequest, updateAppointmentSuccess, updateAppointmentFailure,
  cancelAppointmentRequest, cancelAppointmentSuccess, cancelAppointmentFailure,
} from '../slices/appointmentSlice';
import appointmentApi from '../../api/appointmentApi';

function* fetchAvailableSlotsSaga(action) {
  try {
    const { doctorId, date, durationMinutes } = action.payload;
    const slots = yield call(appointmentApi.getAvailableSlots, doctorId, date, durationMinutes);
    yield put(fetchAvailableSlotsSuccess(slots));
  } catch (error) { yield put(fetchAvailableSlotsFailure(error.message)); }
}

function* createAppointmentSaga(action) {
  try {
    const appointment = yield call(appointmentApi.createAppointment, action.payload);
    yield put(createAppointmentSuccess(appointment));
  } catch (error) { yield put(createAppointmentFailure(error.message)); }
}

function* fetchMyAppointmentsSaga() {
  try {
    const appointments = yield call(appointmentApi.getMyAppointments);
    yield put(fetchMyAppointmentsSuccess(appointments));
  } catch (error) { yield put(fetchMyAppointmentsFailure(error.message)); }
}

// DOCTOR FETCH
function* fetchDoctorAppointmentsSaga(action) {
  try {
    const date = action.payload?.date || null;
    const appointments = yield call(appointmentApi.getDoctorAppointments, date);
    yield put(fetchDoctorAppointmentsSuccess(appointments));
  } catch (error) { yield put(fetchDoctorAppointmentsFailure(error.message)); }
}

// UPDATE STATUS
function* updateAppointmentStatusSaga(action) {
  try {
    const { id, status } = action.payload;
    const updated = yield call(appointmentApi.updateAppointmentStatus, id, status);
    yield put(updateAppointmentStatusSuccess(updated));
  } catch (error) { yield put(updateAppointmentStatusFailure(error.message)); }
}

// UPDATE FULL (RESCHEDULE) - NUOVO
function* updateAppointmentSaga(action) {
  try {
    const { id, data } = action.payload;
    const updated = yield call(appointmentApi.updateAppointment, id, data);
    yield put(updateAppointmentSuccess(updated));
  } catch (error) { yield put(updateAppointmentFailure(error.message)); }
}

// CANCEL
function* cancelAppointmentSaga(action) {
  try {
    const { id } = action.payload;
    yield call(appointmentApi.cancelAppointment, id);
    yield put(cancelAppointmentSuccess(id));
  } catch (error) { yield put(cancelAppointmentFailure(error.message)); }
}

export default function* appointmentSaga() {
  yield takeLatest(fetchAvailableSlotsRequest.type, fetchAvailableSlotsSaga);
  yield takeLatest(createAppointmentRequest.type, createAppointmentSaga);
  yield takeLatest(fetchMyAppointmentsRequest.type, fetchMyAppointmentsSaga);
  yield takeLatest(fetchDoctorAppointmentsRequest.type, fetchDoctorAppointmentsSaga);
  yield takeLatest(updateAppointmentStatusRequest.type, updateAppointmentStatusSaga);
  yield takeLatest(updateAppointmentRequest.type, updateAppointmentSaga);
  yield takeLatest(cancelAppointmentRequest.type, cancelAppointmentSaga);
}