import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
} from '@mui/material';
import { registerRequest, clearError } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Icona dente stilizzata
const ToothIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C9.5,2 7.5,3.5 6.5,5.5C5.5,7.5 5,10 5,12C5,14.5 5.5,16.5 6.5,18C7,18.75 7.5,19.25 8,19.5C8.5,19.75 8.75,19.75 9,19.75C9.5,19.75 10,19.5 10.5,19C11,18.5 11.5,17.5 12,16C12.5,17.5 13,18.5 13.5,19C14,19.5 14.5,19.75 15,19.75C15.25,19.75 15.5,19.75 16,19.5C16.5,19.25 17,18.75 17.5,18C18.5,16.5 19,14.5 19,12C19,10 18.5,7.5 17.5,5.5C16.5,3.5 14.5,2 12,2M12,4C13.5,4 15,5 15.5,6.5C16,8 16.5,10 16.5,12C16.5,13.5 16.25,15 15.75,16C15.5,16.5 15.25,16.75 15,17C15,17 14.75,17 14.5,16.75C14.25,16.5 14,16 13.5,15C13,14 12.5,12.5 12,11C11.5,12.5 11,14 10.5,15C10,16 9.75,16.5 9.5,16.75C9.25,17 9,17 9,17C8.75,16.75 8.5,16.5 8.25,16C7.75,15 7.5,13.5 7.5,12C7.5,10 8,8 8.5,6.5C9,5 10.5,4 12,4Z"/>
  </svg>
);

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/doctors');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setFormError('Le password non coincidono');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('La password deve essere di almeno 6 caratteri');
      return;
    }

    dispatch(registerRequest({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 180, 216, 0.15)',
            background: '#ffffff',
          }}
        >
          {/* Header con Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 180, 216, 0.3)',
                color: '#ffffff'
              }}
            >
              <ToothIcon />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#00B4D8',
                mb: 1,
              }}
            >
              Crea il Tuo Account
            </Typography>
            <Typography variant="body1" sx={{ color: '#48CAE4', fontWeight: 600 }}>
              Registrati per accedere ai nostri servizi odontoiatrici
            </Typography>
          </Box>

          {(error || formError) && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: '1px solid #d32f2f20',
              }}
            >
              {error || formError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#00B4D8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#00B4D8',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00B4D8',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cognome"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#00B4D8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#00B4D8',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00B4D8',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#00B4D8' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#00B4D8',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00B4D8',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#00B4D8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#00B4D8',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00B4D8',
                      },
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Conferma Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#00B4D8' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          disabled={loading}
                        >
                          {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#00B4D8',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00B4D8',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {loading ? (
              <Box sx={{ mt: 3 }}>
                <LoadingSpinner />
              </Box>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  py: 1.8,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                  boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0096C7 0%, #0077A8 100%)',
                    boxShadow: '0 6px 20px rgba(0, 180, 216, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                Registrati
              </Button>
            )}

            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: '1px solid #E0F7FA',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Hai già un account?
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/login')}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderWidth: 2,
                  borderColor: '#00B4D8',
                  color: '#00B4D8',
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: '#0096C7',
                    background: 'rgba(0, 180, 216, 0.05)',
                  },
                }}
              >
                Accedi al Tuo Account
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Info aggiuntiva */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Registrandoti accetti i nostri{' '}
            <Typography
              component="span"
              sx={{
                color: '#00B4D8',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Termini di Servizio
            </Typography>
            {' '}e la{' '}
            <Typography
              component="span"
              sx={{
                color: '#00B4D8',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              Privacy Policy
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;