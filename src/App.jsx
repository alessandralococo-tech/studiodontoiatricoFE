import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DoctorsList from './pages/Patient/DoctorsList';
import BookAppointment from './pages/Patient/BookAppointment';
import MyAppointments from './pages/Patient/MyAppointments';
import PaymentSuccess from './pages/Patient/PaymentSuccess';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import CookiePolicy from './pages/Legal/CookiePolicy';
import Contact from './pages/Contact';

const theme = createTheme({
  palette: {
    primary: { main: '#00B4D8', light: '#48CAE4', dark: '#0096C7' },
    secondary: { main: '#90E0EF', light: '#CAF0F8', dark: '#00B4D8' },
    background: { default: '#F0F9FF', paper: '#ffffff' },
    success: { main: '#4CAF50' },
    info: { main: '#00B4D8' }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: { fontWeight: 700 }, h2: { fontWeight: 700 }, h3: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
});

function App() {
  const paypalOptions = {
    "client-id": "AVanfDamxvGjc6ng8ChNUTGCd3lSrMTZ3XTem1LYL638BN49Bv-0zdVRACrjVY-WAHy_GycCHgO-zfXC",
    currency: "EUR",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <Provider store={store}>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
              <div className="App">
                <Navbar />
                <main>
                  <Routes>
                    {/* Pagine Pubbliche */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/contact" element={<Contact />} />
                    
                    {/* Pagine Legali */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />
                    <Route path="/cookie-policy" element={<CookiePolicy />} />
                    
                    {/* Pagine Private */}
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/doctors" element={<PrivateRoute><DoctorsList /></PrivateRoute>} />
                    
                    {/* Pagine Pazienti */}
                    <Route 
                      path="/book-appointment" 
                      element={<PrivateRoute requiredRole="ROLE_USER"><BookAppointment /></PrivateRoute>} 
                    />
                    <Route 
                      path="/my-appointments" 
                      element={<PrivateRoute requiredRole="ROLE_USER"><MyAppointments /></PrivateRoute>} 
                    />
                    <Route 
                      path="/payments/success" 
                      element={<PrivateRoute requiredRole="ROLE_USER"><PaymentSuccess /></PrivateRoute>} 
                    />

                    {/* Pagine Dottori */}
                    <Route 
                      path="/doctor-dashboard" 
                      element={<PrivateRoute requiredRole="ROLE_ADMIN"><DoctorDashboard /></PrivateRoute>} 
                    />

                    {/* Redirect per route non trovate */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ThemeProvider>
        </ErrorBoundary>
      </Provider>
    </PayPalScriptProvider>
  );
}

export default App;