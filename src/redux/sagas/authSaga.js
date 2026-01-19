import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  fetchProfileRequest,
  fetchProfileSuccess,
  fetchProfileFailure
} from '../slices/authSlice';
import authApi from '../../api/authApi';

// Helper JWT
const parseJwt = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function* loginSaga(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(authApi.login, email, password);

    const token = response.token || response.accessToken;
    const decodedToken = parseJwt(token);
    
    // Costruiamo un oggetto utente base dal token
    const basicUserData = {
      email: response.email || decodedToken?.sub || email,
      role: response.role || decodedToken?.role || 'ROLE_PATIENT',
    };

    localStorage.setItem('token', token);
    // Salviamo temporaneamente i dati base
    localStorage.setItem('user', JSON.stringify(basicUserData));

    yield put(loginSuccess({ ...basicUserData, token }));
    
    // Prende i dati completi dopo il login
    yield put(fetchProfileRequest());

  } catch (error) {
    yield put(loginFailure(error.message || 'Errore Login'));
  }
}

function* registerSaga(action) {
  try {
    const { firstName, lastName, email, password } = action.payload;
    const response = yield call(authApi.register, firstName, lastName, email, password);
    const token = response.token || response.accessToken;

    const userData = {
      email: email,
      role: 'ROLE_PATIENT',
      firstName: firstName,
      lastName: lastName,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    yield put(registerSuccess({ ...userData, token }));
    yield put(fetchProfileRequest());

  } catch (error) {
    yield put(registerFailure(error.message || 'Errore registrazione'));
  }
}

// FETCH PROFILE
function* fetchProfileSaga() {
  try {
    // Recuperiamo lo stato attuale per sapere il ruolo
    const state = yield select();
    const role = state.auth.user?.role;

    let profileData = null;

    if (role === 'ROLE_ADMIN') {
      // Se è medico
      const response = yield call(authApi.getDoctorProfile);
      profileData = response; 
    } else {
      // Se è paziente
      const response = yield call(authApi.getPatientProfile);
      profileData = response;
    }

    // NORMALIZZAZIONE DATI
    const normalizedData = {
      id: profileData.id,
      email: profileData.email,
      firstName: profileData.name,
      lastName: profileData.surname,
      phone: profileData.phone || '',
      specialization: profileData.specialization || '', // Solo per medici
      birth: profileData.birth || ''
    };

    yield put(fetchProfileSuccess(normalizedData));

  } catch (error) {
    yield put(fetchProfileFailure(error.message));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(fetchProfileRequest.type, fetchProfileSaga);
}