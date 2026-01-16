import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  FormControl, InputLabel, Select, MenuItem, Grid, Chip,
  Stepper, Step, StepLabel, Card, Tooltip, Divider, Radio,
  RadioGroup, FormControlLabel, FormLabel
} from '@mui/material';
import {
  fetchAvailableSlotsRequest,
  createAppointmentRequest,
  resetBookingSuccess,
  clearAppointmentError,
} from '../../redux/slices/appointmentSlice';
import {
  setPaymentMethod,
  createPayPalPaymentRequest,
  resetPaymentState,
} from '../../redux/slices/paymentSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// --- ICONA DENTE PERSONALIZZATA ---
const ToothIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C9.5,2 7.5,3.5 6.5,5.5C5.5,7.5 5,10 5,12C5,14.5 5.5,16.5 6.5,18C7,18.75 7.5,19.25 8,19.5C8.5,19.75 8.75,19.75 9,19.75C9.5,19.75 10,19.5 10.5,19C11,18.5 11.5,17.5 12,16C12.5,17.5 13,18.5 13.5,19C14,19.5 14.5,19.75 15,19.75C15.25,19.75 15.5,19.75 16,19.5C16.5,19.25 17,18.75 17.5,18C18.5,16.5 19,14.5 19,12C19,10 18.5,7.5 17.5,5.5C16.5,3.5 14.5,2 12,2M12,4C13.5,4 15,5 15.5,6.5C16,8 16.5,10 16.5,12C16.5,13.5 16.25,15 15.75,16C15.5,16.5 15.25,16.75 15,17C15,17 14.75,17 14.5,16.75C14.25,16.5 14,16 13.5,15C13,14 12.5,12.5 12,11C11.5,12.5 11,14 10.5,15C10,16 9.75,16.5 9.5,16.75C9.25,17 9,17 9,17C8.75,16.75 8.5,16.5 8.25,16C7.75,15 7.5,13.5 7.5,12C7.5,10 8,8 8.5,6.5C9,5 10.5,4 12,4Z"/>
  </svg>
);

const steps = ['Seleziona Data e Orario', 'Conferma Dettagli', 'Metodo di Pagamento', 'Riepilogo'];

// SLOT DEFINITIONS
const ALL_TIME_SLOTS = [
  'NINE', 'NINE_15', 'NINE_30', 'NINE_45',
  'TEN', 'TEN_15', 'TEN_30', 'TEN_45',
  'ELEVEN', 'ELEVEN_15', 'ELEVEN_30', 'ELEVEN_45',
  'TWELVE', 'TWELVE_15', 'TWELVE_30', 'TWELVE_45',
  'FOURTEEN', 'FOURTEEN_15', 'FOURTEEN_30', 'FOURTEEN_45',
  'FIFTEEN', 'FIFTEEN_15', 'FIFTEEN_30', 'FIFTEEN_45',
  'SIXTEEN', 'SIXTEEN_15', 'SIXTEEN_30', 'SIXTEEN_45',
  'SEVENTEEN'
];

const formatSlotTime = (slot) => {
  const timeMap = {
    'NINE': '09:00', 'NINE_15': '09:15', 'NINE_30': '09:30', 'NINE_45': '09:45',
    'TEN': '10:00', 'TEN_15': '10:15', 'TEN_30': '10:30', 'TEN_45': '10:45',
    'ELEVEN': '11:00', 'ELEVEN_15': '11:15', 'ELEVEN_30': '11:30', 'ELEVEN_45': '11:45',
    'TWELVE': '12:00', 'TWELVE_15': '12:15', 'TWELVE_30': '12:30', 'TWELVE_45': '12:45',
    'FOURTEEN': '14:00', 'FOURTEEN_15': '14:15', 'FOURTEEN_30': '14:30', 'FOURTEEN_45': '14:45',
    'FIFTEEN': '15:00', 'FIFTEEN_15': '15:15', 'FIFTEEN_30': '15:30', 'FIFTEEN_45': '15:45',
    'SIXTEEN': '16:00', 'SIXTEEN_15': '16:15', 'SIXTEEN_30': '16:30', 'SIXTEEN_45': '16:45',
    'SEVENTEEN': '17:00',
  };
  return timeMap[slot] || slot;
};

// CALCOLA PREZZO BASATO SULLA DURATA
const calculatePrice = (duration) => {
  switch(duration) {
    case 15: return 35.00;
    case 30: return 60.00;
    case 60: return 100.00;
    default: return 35.00;
  }
};

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedDoctor } = useSelector((state) => state.doctors);
  
  // MODIFICA IMPORTANTE: Aggiungiamo 'list' per recuperare l'appuntamento appena creato
  const { availableSlots, loading, error, bookingSuccess, list } = useSelector((state) => state.appointments);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { paymentMethod, loading: paymentLoading, error: paymentError } = useSelector((state) => state.payment);

  const [activeStep, setActiveStep] = useState(0);
  
  // Flag per gestire il flusso PayPal
  const [isProcessingPayPal, setIsProcessingPayPal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    date: '',
    duration: 15,
    selectedSlot: '',
    notes: '',
    phone: '',
    reason: '',
  });

  // Aggiorna i dati quando user cambia
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) { 
        navigate('/login'); 
    } else if (!selectedDoctor) { 
        navigate('/doctors'); 
    }
  }, [selectedDoctor, isAuthenticated, navigate]);

  // GESTIONE SUCCESSO PRENOTAZIONE E AVVIO PAGAMENTO
  useEffect(() => {
    if (bookingSuccess) {
      // SE ABBIAMO SCELTO PAYPAL E STIAMO PROCESSANDO:
      if (isProcessingPayPal) {
        
        // Recuperiamo l'ultimo appuntamento creato (che Redux ha aggiunto alla lista)
        const lastCreatedAppointment = list[list.length - 1];

        // Verifichiamo che esista e abbia un ID valido
        if (lastCreatedAppointment && lastCreatedAppointment.id) {
            const amount = calculatePrice(formData.duration);
            console.log("✅ Appuntamento creato con ID:", lastCreatedAppointment.id);
            console.log("🚀 Avvio pagamento PayPal...");
            
            // Disattiviamo il flag per evitare loop
            setIsProcessingPayPal(false); 
            
            // Avviamo il pagamento usando l'ID VERO
            dispatch(createPayPalPaymentRequest({ 
              amount: amount.toFixed(2), 
              appointmentId: lastCreatedAppointment.id 
            }));
        } else {
            console.error("❌ ERRORE: Impossibile recuperare l'ID dell'appuntamento creato dallo store.");
        }
      } 
      // SE INVECE È UN PAGAMENTO IN CONTANTI O PAYPAL È GIÀ PARTITO:
      else if (!isProcessingPayPal && paymentMethod === 'CASH') {
        const timer = setTimeout(() => {
          dispatch(resetBookingSuccess());
          dispatch(resetPaymentState());
          navigate('/my-appointments');
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [bookingSuccess, isProcessingPayPal, list, paymentMethod, formData.duration, dispatch, navigate]);

  useEffect(() => {
    if (error) dispatch(clearAppointmentError());
  }, [activeStep, dispatch, error]);

  const fetchSlots = (date, duration) => {
    if (date && selectedDoctor?.id) {
      dispatch(fetchAvailableSlotsRequest({
        doctorId: selectedDoctor.id, 
        date, 
        durationMinutes: duration,
      }));
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormData({ ...formData, date: newDate, selectedSlot: '' });
    fetchSlots(newDate, formData.duration);
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    setFormData({ ...formData, duration: newDuration, selectedSlot: '' });
    fetchSlots(formData.date, newDuration);
  };

  const handleSlotSelect = (slot, isAvailable) => {
    if (isAvailable) setFormData({ ...formData, selectedSlot: slot });
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePaymentMethodChange = (e) => {
    dispatch(setPaymentMethod(e.target.value));
  };

  const handleNext = () => {
    if (activeStep === 0 && (!formData.date || !formData.selectedSlot)) {
      alert('Seleziona data e orario prima di continuare');
      return;
    }
    if (activeStep === 2 && !paymentMethod) {
      alert('Seleziona un metodo di pagamento');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    // 1. Recupero robusto dell'ID paziente (lasciamo che il backend gestisca se è null)
    let patientId = user?.id;
    if (!patientId) {
      const stored = localStorage.getItem('user');
      if (stored) try { patientId = JSON.parse(stored).id; } catch(e){}
    }

    const appointmentData = {
      doctorId: parseInt(selectedDoctor.id, 10),
      patientId: patientId ? parseInt(patientId, 10) : null, 
      appointmentDate: formData.date,
      timeSlot: formData.selectedSlot,
      durationMinutes: parseInt(formData.duration, 10),
      status: 'BOOKED',
      notes: formData.notes || '',
      reason: formData.reason || '',
      phone: formData.phone || ''
    };
    
    if (paymentMethod === 'PAYPAL') {
        // Attiviamo il flag e creiamo l'appuntamento
        // Il pagamento vero e proprio partirà nell'useEffect quando avremo l'ID
        setIsProcessingPayPal(true);
        console.log("Creazione appuntamento pre-pagamento...");
        dispatch(createAppointmentRequest(appointmentData));
    } else {
        // Pagamento contanti
        console.log("Invio prenotazione (Contanti)..."); 
        dispatch(createAppointmentRequest(appointmentData));
    }
  };

  if (!selectedDoctor) return null;
  const today = new Date().toISOString().split('T')[0];

  const doctorDisplayName = selectedDoctor.isAutoSelected 
    ? "Primo Medico Disponibile" 
    : `Dr. ${selectedDoctor.name} ${selectedDoctor.surname}`;

  const appointmentPrice = calculatePrice(formData.duration);

  // Calcolo stato di caricamento e errori combinati
  const isLoading = loading || paymentLoading;
  const combinedError = error || paymentError;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)', py: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: '#ffffff', boxShadow: '0 8px 32px rgba(0, 180, 216, 0.12)' }}>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box 
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                mb: 3,
                boxShadow: '0 8px 24px rgba(0, 180, 216, 0.3)',
                color: '#ffffff'
              }}
            >
              <ToothIcon />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#00B4D8', mb: 1 }}>
              Prenota Appuntamento
            </Typography>
            
            {selectedDoctor.isAutoSelected && (
              <Typography variant="body2" sx={{ color: '#666', mt: 1, fontStyle: 'italic' }}>
                Ti verrà assegnato automaticamente un medico disponibile
              </Typography>
            )}
          </Box>

          {bookingSuccess && paymentMethod === 'CASH' && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>
              Prenotazione confermata con successo! Pagamento da effettuare in studio. Reindirizzamento...
            </Alert>
          )}

          {combinedError && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{combinedError}</Alert>}

          <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>

          {/* STEP 1: DATA E SLOT */}
          {activeStep === 0 && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3, border: '2px solid #CAF0F8', bgcolor: '#F0F9FF' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#00B4D8', fontWeight: 700, mb: 3 }}>
                    Parametri Prenotazione
                  </Typography>
                  <TextField 
                    fullWidth 
                    label="Data" 
                    type="date" 
                    value={formData.date} 
                    onChange={handleDateChange} 
                    InputLabelProps={{ shrink: true }} 
                    inputProps={{ min: today }} 
                    sx={{ mb: 3 }} 
                  />
                  <FormControl fullWidth>
                    <InputLabel>Durata</InputLabel>
                    <Select value={formData.duration} label="Durata" onChange={handleDurationChange}>
                      <MenuItem value={15}>15 minuti - €35.00</MenuItem>
                      <MenuItem value={30}>30 minuti - €60.00</MenuItem>
                      <MenuItem value={60}>1 ora - €100.00</MenuItem>
                    </Select>
                  </FormControl>
                </Card>
              </Grid>

              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3, minHeight: '300px', border: '2px solid #CAF0F8', bgcolor: '#F0F9FF' }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#00B4D8', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700 }}>
                    <AccessTimeIcon /> Orari Disponibili
                  </Typography>

                  {!formData.date ? (
                    <Typography color="text.secondary">Seleziona una data per vedere gli orari.</Typography>
                  ) : loading ? (
                    <LoadingSpinner />
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                      {ALL_TIME_SLOTS.map((slot) => {
                        const isAvailable = availableSlots && availableSlots.includes(slot);
                        const isSelected = formData.selectedSlot === slot;
                        return (
                          <Tooltip key={slot} title={isAvailable ? "Disponibile" : "Occupato"} arrow>
                            <Chip
                              label={formatSlotTime(slot)}
                              onClick={() => handleSlotSelect(slot, isAvailable)}
                              icon={isAvailable ? <AccessTimeIcon /> : <BlockIcon />}
                              sx={{ 
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                bgcolor: isAvailable ? (isSelected ? '#00B4D8' : '#ffffff') : '#e0e0e0',
                                color: isAvailable ? (isSelected ? '#ffffff' : '#00B4D8') : '#9e9e9e',
                                border: isAvailable ? `2px solid ${isSelected ? '#00B4D8' : '#CAF0F8'}` : '1px solid transparent',
                                opacity: isAvailable ? 1 : 0.6,
                                fontWeight: 600,
                                '&:hover': isAvailable ? {
                                  borderColor: '#00B4D8',
                                  transform: 'translateY(-2px)'
                                } : {}
                              }}
                            />
                          </Tooltip>
                        );
                      })}
                    </Box>
                  )}
                </Card>
              </Grid>
            </Grid>
          )}

          {/* STEP 2: DETTAGLI */}
          {activeStep === 1 && (
             <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 3, color: '#00B4D8', fontWeight: 700 }}>
                  Conferma i Tuoi Dati
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Nome" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: '#00B4D8' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#00B4D8',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Cognome" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: '#00B4D8' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#00B4D8',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Email" 
                      name="email" 
                      type="email"
                      value={formData.email} 
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1, color: '#00B4D8' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#00B4D8',
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField 
                      fullWidth 
                      label="Telefono" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: '#00B4D8' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                      label="Motivo della Visita" 
                      name="reason" 
                      value={formData.reason} 
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
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
                      multiline 
                      rows={4} 
                      label="Note Aggiuntive" 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleInputChange}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#00B4D8',
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
             </Box>
          )}

          {/* STEP 3: METODO DI PAGAMENTO */}
          {activeStep === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 4, color: '#00B4D8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PaymentIcon /> Seleziona Metodo di Pagamento
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ p: 3, border: '2px solid #CAF0F8', bgcolor: '#F0F9FF', mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>
                        Importo Totale
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#00B4D8' }}>
                        €{appointmentPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Durata: {formData.duration} minuti
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={paymentMethod || ''} onChange={handlePaymentMethodChange}>
                      <Card 
                        sx={{ 
                          mb: 2, 
                          p: 3, 
                          cursor: 'pointer',
                          border: paymentMethod === 'PAYPAL' ? '3px solid #0070BA' : '2px solid #E0E0E0',
                          bgcolor: paymentMethod === 'PAYPAL' ? '#F0F8FF' : '#FFFFFF',
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: '#0070BA',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0, 112, 186, 0.15)'
                          }
                        }}
                        onClick={() => dispatch(setPaymentMethod('PAYPAL'))}
                      >
                        <FormControlLabel 
                          value="PAYPAL" 
                          control={<Radio sx={{ color: '#0070BA', '&.Mui-checked': { color: '#0070BA' } }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Box 
                                sx={{ 
                                  width: 60, 
                                  height: 60, 
                                  borderRadius: 2, 
                                  background: 'linear-gradient(135deg, #0070BA 0%, #003087 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#ffffff',
                                  fontWeight: 700,
                                  fontSize: '1.2rem'
                                }}
                              >
                                PP
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                                  PayPal
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Paga in modo sicuro con PayPal
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </Card>

                      <Card 
                        sx={{ 
                          p: 3, 
                          cursor: 'pointer',
                          border: paymentMethod === 'CASH' ? '3px solid #4CAF50' : '2px solid #E0E0E0',
                          bgcolor: paymentMethod === 'CASH' ? '#F1F8F4' : '#FFFFFF',
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: '#4CAF50',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)'
                          }
                        }}
                        onClick={() => dispatch(setPaymentMethod('CASH'))}
                      >
                        <FormControlLabel 
                          value="CASH" 
                          control={<Radio sx={{ color: '#4CAF50', '&.Mui-checked': { color: '#4CAF50' } }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Box 
                                sx={{ 
                                  width: 60, 
                                  height: 60, 
                                  borderRadius: 2, 
                                  background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#ffffff' }} />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>
                                  Pagamento in Studio
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Paga in contanti o con carta direttamente in studio
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </Card>
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* STEP 4: RIEPILOGO */}
          {activeStep === 3 && (
            <Card sx={{ p: 4, mt: 2, border: '2px solid #00B4D8', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#00B4D8', fontWeight: 700, mb: 3 }}>
                Riepilogo Prenotazione
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ mb: 1 }}><strong>Paziente:</strong> {formData.firstName} {formData.lastName}</Typography>
                  <Typography sx={{ mb: 1 }}><strong>Email:</strong> {formData.email}</Typography>
                  <Typography><strong>Telefono:</strong> {formData.phone || 'Non specificato'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ mb: 1 }}><strong>Medico:</strong> {doctorDisplayName}</Typography>
                  <Typography sx={{ mb: 1 }}><strong>Data:</strong> {new Date(formData.date).toLocaleDateString('it-IT')} - {formatSlotTime(formData.selectedSlot)}</Typography>
                  <Typography><strong>Durata:</strong> {formData.duration} minuti</Typography>
                </Grid>
                {formData.reason && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography><strong>Motivo:</strong> {formData.reason}</Typography>
                  </Grid>
                )}
                {formData.notes && (
                  <Grid item xs={12}>
                    <Typography><strong>Note:</strong> {formData.notes}</Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#ffffff', borderRadius: 2 }}>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        <strong>Metodo di Pagamento:</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {paymentMethod === 'PAYPAL' ? 'PayPal' : 'Pagamento in Studio'}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#00B4D8' }}>
                      €{appointmentPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          )}

          {/* BOTTONI NAVIGAZIONE */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
            <Button 
              disabled={activeStep === 0} 
              onClick={handleBack} 
              variant="outlined"
              sx={{
                borderColor: '#00B4D8',
                color: '#00B4D8',
                '&:hover': {
                  borderColor: '#0096C7',
                  bgcolor: '#F0F9FF'
                }
              }}
            >
              Indietro
            </Button>
            {activeStep < 3 ? (
              <Button 
                onClick={handleNext} 
                variant="contained"
                sx={{
                  bgcolor: '#00B4D8',
                  '&:hover': {
                    bgcolor: '#0096C7'
                  }
                }}
              >
                Avanti
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                variant="contained" 
                color="success" 
                disabled={isLoading || bookingSuccess || paymentLoading}
                sx={{
                  fontWeight: 700,
                  px: 4
                }}
              >
                {isLoading || paymentLoading ? 'Attendere...' : 'Conferma Prenotazione'}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookAppointment;