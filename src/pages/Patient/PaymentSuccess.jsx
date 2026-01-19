import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { capturePayPalPaymentRequest } from '../../redux/slices/paymentSlice';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Recupera il token di PayPal dall'URL
  
  const { loading, error, paymentSuccess } = useSelector((state) => state.payment);
  const [countdown, setCountdown] = useState(3);
  
  // Ref per evitare che la cattura venga chiamata due volte
  const captureAttempted = useRef(false);

  useEffect(() => {
    // Se c'è un token
    if (token && !captureAttempted.current && !paymentSuccess) {
      console.log("Token trovato", token);
      captureAttempted.current = true;
      dispatch(capturePayPalPaymentRequest({ token }));
    }
  }, [token, dispatch, paymentSuccess]);

  useEffect(() => {
    // Se il pagamento è stato confermato con successo
    if (paymentSuccess || !token) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/my-appointments');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentSuccess, token, navigate]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6
      }}
    >
      <Container maxWidth="sm">
        <Paper 
          elevation={0}
          sx={{ 
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            background: '#ffffff',
            boxShadow: '0 8px 32px rgba(0, 180, 216, 0.12)'
          }}
        >
          {loading ? (
            // Stato di Caricamento
            <Box>
              <CircularProgress size={60} sx={{ color: '#00B4D8', mb: 3 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
                Conferma del pagamento in corso...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Non chiudere la pagina.
              </Typography>
            </Box>
          ) : error ? (
            // Stato di Errore
            <Box>
              <ErrorIcon sx={{ fontSize: 60, color: '#ef5350', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#ef5350', mb: 2 }}>
                Errore nella conferma
              </Typography>
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                {error}
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Contatta l'assistenza se il problema persiste.
              </Typography>
            </Box>
          ) : (
            // Stato di Successo
            <Box>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                  mb: 3,
                  boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
                  animation: 'scaleIn 0.5s ease-out'
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 60, color: '#ffffff' }} />
              </Box>

              <Typography 
                variant="h3" 
                sx={{ fontWeight: 700, color: '#4caf50', mb: 2 }}
              >
                Pagamento Completato!
              </Typography>

              <Typography variant="h6" sx={{ color: '#666', mb: 4 }}>
                Il tuo appuntamento è stato confermato e saldato.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <CircularProgress size={20} sx={{ color: '#00B4D8' }} />
                <Typography variant="body1" color="text.secondary">
                  Reindirizzamento tra {countdown} secondi...
                </Typography>
              </Box>
            </Box>
          )}

          <style>
            {`
              @keyframes scaleIn {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
            `}
          </style>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;