import { call, put, takeLatest, select } from 'redux-saga/effects';
import {
  loginRequest, loginSuccess, loginFailure,
  registerRequest, registerSuccess, registerFailure,
  fetchProfileRequest, fetchProfileSuccess, fetchProfileFailure,
  updateProfileRequest, updateProfileSuccess, updateProfileFailure,
  changePasswordRequest, changePasswordSuccess, changePasswordFailure
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

// --- LOGIN SAGA ---
function* loginSaga(action) {
  try {
    const { email, password } = action.payload;
    const response = yield call(authApi.login, email, password);

    const token = response.token || response.accessToken;
    const decodedToken = parseJwt(token);
    
    const basicUserData = {
      email: response.email || decodedToken?.sub,
      role: response.role || decodedToken?.role || 'ROLE_USER', 
      id: response.id || decodedToken?.id
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(basicUserData));

    yield put(loginSuccess({ ...basicUserData, token }));
    yield put(fetchProfileRequest()); 

  } catch (error) {
    yield put(loginFailure(error.response?.data?.message || 'Login fallito'));
  }
}

// --- REGISTER SAGA ---
function* registerSaga(action) {
  try {
    const { firstName, lastName, email, password, phone, birth } = action.payload;
    const response = yield call(authApi.register, firstName, lastName, email, password, phone, birth);
    
    const token = response.token || response.accessToken;
    
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      role: 'ROLE_USER',
      phone: phone,
      birth: birth,
      id: response.id
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    yield put(registerSuccess({ ...userData, token }));
    yield put(fetchProfileRequest());

  } catch (error) {
    yield put(registerFailure(error.message || 'Errore registrazione'));
  }
}

// --- FETCH PROFILE SAGA ---
function* fetchProfileSaga() {
  try {
    const state = yield select();
    const role = state.auth.user?.role;

    let profileData = null;

    if (role === 'ROLE_ADMIN') {
      profileData = yield call(authApi.getDoctorProfile);
    } else {
      profileData = yield call(authApi.getPatientProfile);
    }

    console.log("Dati Profilo Ricevuti dal Backend:", profileData);

    // Normalizzazione dati
    const normalizedData = {
      id: profileData.id,
      email: profileData.email,
      firstName: profileData.firstName || profileData.name,
      lastName: profileData.lastName || profileData.surname,
      phone: profileData.phone || profileData.phoneNumber || '',
      birth: profileData.birth || profileData.birthDate || '',
      specialization: profileData.specialization || ''
    };

    console.log("Dati normalizzati per Redux:", normalizedData);

    yield put(fetchProfileSuccess(normalizedData));

  } catch (error) {
    yield put(fetchProfileFailure(error.message));
  }
}

// UPDATE PROFILE SAGA
function* updateProfileSaga(action) {
  try {
    // action.payload contiene { firstName, lastName, phone, birth }
    const updatedProfile = yield call(authApi.updatePatientProfile, action.payload);
    
    // Normalizziamo la risposta per aggiornare lo store Redux senza dover ricaricare la pagina
    const normalizedData = {
      firstName: updatedProfile.firstName || updatedProfile.name,
      lastName: updatedProfile.lastName || updatedProfile.surname,
      phone: updatedProfile.phone || updatedProfile.phoneNumber,
      birth: updatedProfile.birth || updatedProfile.birthDate
    };
    
    yield put(updateProfileSuccess(normalizedData));
  } catch (error) {
    // Gestiamo l'errore se il backend risponde con un messaggio specifico
    const errorMessage = error.response?.data?.message || error.message || "Errore durante l'aggiornamento del profilo";
    yield put(updateProfileFailure(errorMessage));
  }
}

// CHANGE PASSWORD SAGA
function* changePasswordSaga(action) {
  try {
    const { oldPassword, newPassword, confirmPassword } = action.payload;
    // Chiamata all'API
    yield call(authApi.changePatientPassword, oldPassword, newPassword, confirmPassword);
    
    yield put(changePasswordSuccess());
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Errore cambio password. Verifica la vecchia password.";
    yield put(changePasswordFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(fetchProfileRequest.type, fetchProfileSaga);
  yield takeLatest(updateProfileRequest.type, updateProfileSaga);
  yield takeLatest(changePasswordRequest.type, changePasswordSaga);
}