import { call, put, takeLatest } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
} from '../slices/authSlice';
import authApi from '../../api/authApi';

// Helper per decodificare il token (JWT)
const parseJwt = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Errore parsing JWT:", e);
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
    
    // Tenta di recuperare l'ID, ma se non c'è, NON FARE ERRORI.
    // Il backend userà il token per identificare l'utente.
    let userId = response.id || 
                 response.userId || 
                 response.patientId || 
                 decodedToken?.id || 
                 decodedToken?.userId || 
                 decodedToken?.patientId;

    // Se l'ID è ancora null, controlliamo il 'sub' solo se è numerico (raro, di solito è email)
    if (!userId && decodedToken?.sub && !isNaN(decodedToken.sub)) {
        userId = parseInt(decodedToken.sub, 10);
    }

    // Se non troviamo l'ID, lo lasciamo null invece di mettere -1 o bloccare tutto
    if (!userId) {
        console.warn("⚠️ ID Utente non trovato nel Login. Si presume che il Backend usi il Token per l'identificazione.");
        userId = null;
    }

    const userData = {
      id: userId, // Può essere null
      email: response.email || decodedToken?.sub || email,
      role: response.role || decodedToken?.role || 'ROLE_PATIENT',
      firstName: response.firstName || '',
      lastName: response.lastName || '',
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    yield put(loginSuccess({ ...userData, token }));

  } catch (error) {
    yield put(loginFailure(error.message || 'Errore Login'));
  }
}

// --- REGISTER SAGA ---
function* registerSaga(action) {
  try {
    const { firstName, lastName, email, password } = action.payload;
    
    const response = yield call(authApi.register, firstName, lastName, email, password);
    const token = response.token || response.accessToken;
    const decodedToken = parseJwt(token);
    
    let userId = response.id || response.userId;

    if (!userId) {
        console.warn("⚠️ ID non ricevuto post-registrazione. Uso null.");
        userId = null; 
    }

    const userData = {
      id: userId,
      email: response.email || email,
      role: response.role || 'ROLE_PATIENT',
      firstName: firstName,
      lastName: lastName,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    yield put(registerSuccess({ ...userData, token }));

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Errore registrazione';
    yield put(registerFailure(errorMessage));
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
}