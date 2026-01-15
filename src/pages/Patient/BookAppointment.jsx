import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  FormControl, InputLabel, Select, MenuItem, Grid, Chip,
  Stepper, Step, StepLabel, Card, Tooltip, Divider
} from '@mui/material';
import {
  fetchAvailableSlotsRequest,
  createAppointmentRequest,
  resetBookingSuccess,
  clearAppointmentError,
} from '../../redux/slices/appointmentSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const steps = ['Seleziona Data e Orario', 'Conferma Dettagli', 'Riepilogo'];

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

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedDoctor } = useSelector((state) => state.doctors);
  const { availableSlots, loading, error, bookingSuccess } = useSelector((state) => state.appointments);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeStep, setActiveStep] = useState(0);

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

  useEffect(() => {
    if (bookingSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetBookingSuccess());
        navigate('/my-appointments');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [bookingSuccess, navigate, dispatch]);

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

  const handleNext = () => {
    if (activeStep === 0 && (!formData.date || !formData.selectedSlot)) {
      alert('Seleziona data e orario prima di continuare');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => {
    // === FIX: RIMOSSO PATIENT ID ===
    // Non inviamo più il patientId nel JSON.
    // Il backend estrarrà l'utente corrente direttamente dal Token JWT.
    
    const appointmentData = {
      doctorId: parseInt(selectedDoctor.id, 10),
      // patientId: RIMOSSO
      appointmentDate: formData.date,
      timeSlot: formData.selectedSlot,
      durationMinutes: parseInt(formData.duration, 10),
      status: 'BOOKED',
      notes: formData.notes || '',
      reason: formData.reason || '',
      phone: formData.phone || ''
    };
    
    console.log("Invio appuntamento (senza patientId):", appointmentData); 
    dispatch(createAppointmentRequest(appointmentData));
  };

  if (!selectedDoctor) return null;
  const today = new Date().toISOString().split('T')[0];

  const doctorDisplayName = selectedDoctor.isAutoSelected 
    ? "Primo Medico Disponibile" 
    : `Dr. ${selectedDoctor.name} ${selectedDoctor.surname}`;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)', py: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, background: '#ffffff', boxShadow: '0 8px 32px rgba(0, 180, 216, 0.12)' }}>
          
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#00B4D8', mb: 1 }}>
              Prenota Appuntamento
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#48CAE4', fontWeight: 600 }}>
              {doctorDisplayName}
            </Typography>
            {selectedDoctor.isAutoSelected && (
              <Typography variant="body2" sx={{ color: '#666', mt: 1, fontStyle: 'italic' }}>
                Ti verrà assegnato automaticamente un medico disponibile
              </Typography>
            )}
          </Box>

          {bookingSuccess && (
            <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>
              Prenotazione confermata con successo! Reindirizzamento...
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

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
                      <MenuItem value={15}>15 minuti</MenuItem>
                      <MenuItem value={30}>30 minuti</MenuItem>
                      <MenuItem value={60}>1 ora</MenuItem>
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

          {/* STEP 3: RIEPILOGO */}
          {activeStep === 2 && (
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
            {activeStep < 2 ? (
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
                disabled={loading || bookingSuccess}
                sx={{
                  fontWeight: 700,
                  px: 4
                }}
              >
                {loading ? 'Attendere...' : 'Conferma Prenotazione'}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookAppointment;