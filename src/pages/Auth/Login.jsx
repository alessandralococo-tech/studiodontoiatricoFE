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
} from '@mui/material';
import { loginRequest, clearError } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Icona
const ToothIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C9.5,2 7.5,3.5 6.5,5.5C5.5,7.5 5,10 5,12C5,14.5 5.5,16.5 6.5,18C7,18.75 7.5,19.25 8,19.5C8.5,19.75 8.75,19.75 9,19.75C9.5,19.75 10,19.5 10.5,19C11,18.5 11.5,17.5 12,16C12.5,17.5 13,18.5 13.5,19C14,19.5 14.5,19.75 15,19.75C15.25,19.75 15.5,19.75 16,19.5C16.5,19.25 17,18.75 17.5,18C18.5,16.5 19,14.5 19,12C19,10 18.5,7.5 17.5,5.5C16.5,3.5 14.5,2 12,2M12,4C13.5,4 15,5 15.5,6.5C16,8 16.5,10 16.5,12C16.5,13.5 16.25,15 15.75,16C15.5,16.5 15.25,16.75 15,17C15,17 14.75,17 14.5,16.75C14.25,16.5 14,16 13.5,15C13,14 12.5,12.5 12,11C11.5,12.5 11,14 10.5,15C10,16 9.75,16.5 9.5,16.75C9.25,17 9,17 9,17C8.75,16.75 8.5,16.5 8.25,16C7.75,15 7.5,13.5 7.5,12C7.5,10 8,8 8.5,6.5C9,5 10.5,4 12,4Z"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginRequest(formData));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #80DEEA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 5, md: 6 },
            borderRadius: 4,
            boxShadow: '0 20px 60px rgba(0, 119, 182, 0.15)',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 180, 216, 0.1)',
            width: '100%',
            maxWidth: '500px',
            mx: 'auto'
          }}
        >
          {/* Header con Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2.5,
                background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 180, 216, 0.3)',
                color: '#ffffff',
                transform: 'rotate(-5deg)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(0deg) scale(1.05)'
                }
              }}
            >
              <Box sx={{ transform: 'rotate(5deg)' }}>
                <ToothIcon />
              </Box>
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                color: '#0077B6',
                letterSpacing: '-0.5px',
                mb: 1,
              }}
            >
              Bentornato
            </Typography>
            <Typography variant="body1" sx={{ color: '#546E7A', fontSize: '0.95rem' }}>
              Accedi al tuo account per gestire i tuoi appuntamenti
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 2,
                border: '1px solid rgba(211, 47, 47, 0.2)',
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} autoComplete="new-password">
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#00B4D8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#00B4D8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0077B6',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              autoComplete="new-password"
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
                      sx={{ color: '#00B4D8' }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#00B4D8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#0077B6',
                  },
                },
              }}
            />

            {loading ? (
              <LoadingSpinner />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  py: 1.8,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                  boxShadow: '0 8px 24px rgba(0, 180, 216, 0.35)',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0096B8 0%, #005F96 100%)',
                    boxShadow: '0 12px 32px rgba(0, 180, 216, 0.45)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Accedi
              </Button>
            )}

            <Box
              sx={{
                mt: 4,
                pt: 3.5,
                borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Non hai ancora un account?
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/register')}
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderWidth: 2,
                  borderRadius: 2,
                  borderColor: '#00B4D8',
                  color: '#00B4D8',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: '#0077B6',
                    background: 'rgba(0, 180, 216, 0.05)',
                  },
                }}
              >
                Crea un Nuovo Account
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Info aggiuntiva */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Hai bisogno di aiuto?{' '}
            <Typography
              component="span"
              sx={{
                color: '#0077B6',
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { 
                  color: '#00B4D8',
                  textDecoration: 'underline' 
                },
              }}
            >
              Contattaci
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;