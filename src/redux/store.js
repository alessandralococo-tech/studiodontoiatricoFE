import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import appointmentReducer from './slices/appointmentSlice';
import paymentReducer from './slices/paymentSlice';
import rootSaga from './sagas';

// Crea il middleware saga
const sagaMiddleware = createSagaMiddleware();

// Configura lo store
const store = configureStore({
  reducer: {
    auth: authReducer,
    doctors: doctorReducer,
    appointments: appointmentReducer,
    payment: paymentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

// Avvia le sagas
sagaMiddleware.run(rootSaga);

export default store;