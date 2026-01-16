import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './App.css';

// Components
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import DoctorsList from './pages/Patient/DoctorsList';
import BookAppointment from './pages/Patient/BookAppointment';
import MyAppointments from './pages/Patient/MyAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00B4D8',
      light: '#48CAE4',
      dark: '#0096C7',
    },
    secondary: {
      main: '#90E0EF',
      light: '#CAF0F8',
      dark: '#00B4D8',
    },
    background: {
      default: '#F0F9FF',
      paper: '#ffffff',
    },
    success: {
      main: '#4CAF50',
    },
    info: {
      main: '#00B4D8',
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(0, 180, 216, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(0, 180, 216, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 180, 216, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navbar />
            <main>
              <Routes>
                {/* Home Page */}
                <Route path="/" element={<Home />} />

                {/* Route pubbliche */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Route per pazienti */}
                <Route
                  path="/doctors"
                  element={
                    <PrivateRoute>
                      <DoctorsList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/book-appointment"
                  element={
                    <PrivateRoute requiredRole="ROLE_USER">
                      <BookAppointment />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-appointments"
                  element={
                    <PrivateRoute requiredRole="ROLE_USER">
                      <MyAppointments />
                    </PrivateRoute>
                  }
                />

                {/* Route per medici */}
                <Route
                  path="/doctor-dashboard"
                  element={
                    <PrivateRoute requiredRole="ROLE_ADMIN">
                      <DoctorDashboard />
                    </PrivateRoute>
                  }
                />

                {/* 404 - Redirect alla home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;