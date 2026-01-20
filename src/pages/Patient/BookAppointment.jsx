import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  FormControl, InputLabel, Select, MenuItem, Grid, Chip,
  Stepper, Step, StepLabel, Card, Tooltip, Divider, CircularProgress,
  InputAdornment, Stack
} from '@mui/material';
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  fetchAvailableSlotsRequest,
  createAppointmentRequest,
  resetBookingSuccess,
} from '../../redux/slices/appointmentSlice';
import {
  setPaymentMethod,
  createPayPalPaymentRequest,
  resetPaymentState,
} from '../../redux/slices/paymentSlice';
import { fetchProfileRequest } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotesIcon from '@mui/icons-material/Notes';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CakeIcon from '@mui/icons-material/Cake';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// --- Icona ---
const ToothIconBg = () => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)', boxShadow: '0 8px 20px rgba(0, 180, 216, 0.3)', mb: 3, color: '#ffffff' }}><svg width="45" height="45" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C9.5,2 7.5,3.5 6.5,5.5C5.5,7.5 5,10 5,12C5,14.5 5.5,16.5 6.5,18C7,18.75 7.5,19.25 8,19.5C8.5,19.75 8.75,19.75 9,19.75C9.5,19.75 10,19.5 10.5,19C11,18.5 11.5,17.5 12,16C12.5,17.5 13,18.5 13.5,19C14,19.5 14.5,19.75 15,19.75C15.25,19.75 15.5,19.75 16,19.5C16.5,19.25 17,18.75 17.5,18C18.5,16.5 19,14.5 19,12C19,10 18.5,7.5 17.5,5.5C16.5,3.5 14.5,2 12,2M12,4C13.5,4 15,5 15.5,6.5C16,8 16.5,10 16.5,12C16.5,13.5 16.25,15 15.75,16C15.5,16.5 15.25,16.75 15,17C15,17 14.75,17 14.5,16.75C14.25,16.5 14,16 13.5,15C13,14 12.5,12.5 12,11C11.5,12.5 11,14 10.5,15C10,16 9.75,16.5 9.5,16.75C9.25,17 9,17 9,17C8.75,16.75 8.5,16.5 8.25,16C7.75,15 7.5,13.5 7.5,12C7.5,10 8,8 8.5,6.5C9,5 10.5,4 12,4Z"/></svg></Box>
);

const steps = ['Data e Orario', 'I Tuoi Dati', 'Pagamento', 'Conferma'];
const ALL_TIME_SLOTS = [
    'NINE', 'NINE_15', 'NINE_30', 'NINE_45', 
    'TEN', 'TEN_15', 'TEN_30', 'TEN_45', 
    'ELEVEN', 'ELEVEN_15', 'ELEVEN_30', 'ELEVEN_45', 
    'TWELVE', 'TWELVE_15', 'TWELVE_30', 'TWELVE_45', 
    'THIRTEEN', 'THIRTEEN_15', 'THIRTEEN_30', 'THIRTEEN_45', // Pausa pranzo
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
        'THIRTEEN': '13:00', 'THIRTEEN_15': '13:15', 'THIRTEEN_30': '13:30', 'THIRTEEN_45': '13:45',
        'FOURTEEN': '14:00', 'FOURTEEN_15': '14:15', 'FOURTEEN_30': '14:30', 'FOURTEEN_45': '14:45', 
        'FIFTEEN': '15:00', 'FIFTEEN_15': '15:15', 'FIFTEEN_30': '15:30', 'FIFTEEN_45': '15:45', 
        'SIXTEEN': '16:00', 'SIXTEEN_15': '16:15', 'SIXTEEN_30': '16:30', 'SIXTEEN_45': '16:45', 
        'SEVENTEEN': '17:00' 
    }; 
    return timeMap[slot] || slot; 
};

const calculateEstimatedPrice = (duration) => { switch(parseInt(duration, 10)) { case 15: return 35.00; case 30: return 60.00; case 60: return 100.00; default: return 35.00; } };

const BookAppointment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedDoctor } = useSelector((state) => state.doctors);
  const { availableSlots, loading, error, bookingSuccess, list } = useSelector((state) => state.appointments);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { paymentMethod, paypalOrderId, loading: paymentLoading, error: paymentError } = useSelector((state) => state.payment);

  const [activeStep, setActiveStep] = useState(0);
  const [isProcessingPayPal, setIsProcessingPayPal] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', birth: '', date: '', duration: 15, selectedSlot: '', notes: '', reason: '' });

  const paypalRequestSent = useRef(false);

  useEffect(() => { if (!selectedDoctor) navigate('/doctors'); }, [selectedDoctor, navigate]);
  useEffect(() => { if (isAuthenticated) dispatch(fetchProfileRequest()); }, [dispatch, isAuthenticated]);

  // Precompilazione dati
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ 
        ...prev, 
        firstName: user.firstName || '', 
        lastName: user.lastName || '', 
        email: user.email || '', 
        phone: user.phone || '',
        birth: user.birth || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (bookingSuccess) {
      if (isProcessingPayPal && !paypalOrderId && !paymentLoading && !paypalRequestSent.current) {
        const lastAppt = list[list.length - 1];
        if (lastAppt?.id) {
          paypalRequestSent.current = true;
          dispatch(createPayPalPaymentRequest({ appointmentId: lastAppt.id }));
        }
      } else if (!isProcessingPayPal && paymentMethod === 'CASH') {
        setTimeout(() => { dispatch(resetBookingSuccess()); dispatch(resetPaymentState()); navigate('/my-appointments'); }, 1500);
      }
    }
  }, [bookingSuccess, isProcessingPayPal, paypalOrderId, list, formData.duration, paymentLoading, paymentMethod, navigate, dispatch]);

  const handleDateChange = (e) => {
    const d = e.target.value;
    setFormData({ ...formData, date: d, selectedSlot: '' });
    if (d && selectedDoctor?.id) dispatch(fetchAvailableSlotsRequest({ doctorId: selectedDoctor.id, date: d, durationMinutes: formData.duration }));
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => {
    if (activeStep === 0 && (!formData.date || !formData.selectedSlot)) { alert('Seleziona data e orario prima di continuare'); return; }
    setActiveStep(s => s + 1);
  };

  const handleSubmit = () => {
    if(!selectedDoctor) return;
    const data = { 
        doctorId: parseInt(selectedDoctor.id, 10), 
        patientEmail: user?.email, 
        appointmentDate: formData.date, 
        timeSlot: formData.selectedSlot, 
        durationMinutes: parseInt(formData.duration, 10), 
        status: 'BOOKED', 
        notes: formData.notes || '', 
        reason: formData.reason || '', 
    };
    if (paymentMethod === 'PAYPAL') { setIsProcessingPayPal(true); paypalRequestSent.current = false; }
    dispatch(createAppointmentRequest(data));
  };

  // Funzione per gestire il messaggio di errore
  const getErrorMessage = () => {
    if (!error && !paymentError) return null;
    const err = error || paymentError;
    // Se il backend segnala che lo slot non è disponibile
    if (String(err).includes('slot selezionato non è disponibile')) {
        return "Questo orario è stato appena prenotato da un altro paziente o non è valido. Per favore ricarica la pagina o scegli un altro orario.";
    }
    return err;
  };

  if (!selectedDoctor) return <LoadingSpinner />;
  const estimatedPrice = calculateEstimatedPrice(formData.duration);
  const isLoading = loading || paymentLoading;

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, #F0F9FF, #E0F7FA)', py: 8 }}>
      <Container maxWidth="lg">
        <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 40px rgba(0, 180, 216, 0.15)' }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <ToothIconBg /><Typography variant="h3" sx={{ fontWeight: 800, color: '#00B4D8', letterSpacing: '-0.5px' }}>Prenota la tua Visita</Typography>
          </Box>
          
          {(error || paymentError) && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }} onClose={() => dispatch(resetPaymentState())}>
              {getErrorMessage()}
            </Alert>
          )}

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 6, '& .MuiStepConnector-line': { borderColor: '#CAF0F8' }, '& .MuiStepIcon-root.Mui-active': { color: '#00B4D8', transform: 'scale(1.2)' }, '& .MuiStepIcon-root.Mui-completed': { color: '#0096C7' }, '& .MuiStepLabel-label': { fontWeight: 600, mt: 1 } }}>
            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
          </Stepper>

          <Box sx={{ mt: 4 }}>
            {activeStep === 0 && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={5}>
                  <Card sx={{ p: 4, border: '2px solid #E0F7FA', bgcolor: '#F8FDFF', borderRadius: 4, height: '100%', boxShadow: 'none' }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={3}><CalendarMonthIcon sx={{ color: '#00B4D8', fontSize: 32 }} /><Typography variant="h5" sx={{ fontWeight: 700, color: '#0077B6' }}>Quando?</Typography></Stack>
                    <TextField fullWidth type="date" label="Seleziona Data" value={formData.date} onChange={handleDateChange} InputLabelProps={{ shrink: true }} sx={{ mb: 4 }} variant="outlined" />
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Durata della Visita</InputLabel>
                      <Select value={formData.duration} label="Durata della Visita" onChange={(e) => setFormData({...formData, duration: e.target.value})}>
                        <MenuItem value={15}>15 min - €35</MenuItem><MenuItem value={30}>30 min - €60</MenuItem><MenuItem value={60}>1 ora - €100</MenuItem>
                      </Select>
                    </FormControl>
                  </Card>
                </Grid>
                <Grid item xs={12} md={7}>
                   <Box sx={{ p: 2 }}>
                       <Typography variant="h6" sx={{ fontWeight: 700, color: '#0077B6', mb: 3 }}>Orari Disponibili</Typography>
                       {!formData.date ? ( <Alert severity="info" sx={{borderRadius: 3}}>Seleziona prima una data per vedere gli orari.</Alert> ) : (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                          {ALL_TIME_SLOTS.map((slot) => {
                            // Se lo slot inizia con THIRTEEN è PAUSA PRANZO
                            const isLunchBreak = slot.startsWith('THIRTEEN');
                            // Se è SEVENTEEN è CHIUSURA (non prenotabile)
                            const isClosing = slot === 'SEVENTEEN';
                            
                            const isAvailable = availableSlots?.includes(slot) && !isLunchBreak && !isClosing;
                            const isSelected = formData.selectedSlot === slot;

                            if (isLunchBreak) {
                                return (
                                    <Tooltip key={slot} title="Pausa Pranzo" arrow placement="top">
                                        <Chip 
                                            label="Pausa" 
                                            icon={<RestaurantIcon style={{ fontSize: 16 }} />} 
                                            variant="outlined"
                                            sx={{ 
                                                cursor: 'not-allowed', 
                                                bgcolor: '#f5f5f5', 
                                                color: '#bdbdbd', 
                                                border: '1px dashed #e0e0e0',
                                                height: 42, px: 1 
                                            }} 
                                        />
                                    </Tooltip>
                                );
                            }

                            if (isClosing) return null; 

                            return (
                              <Tooltip key={slot} title={isAvailable ? "Clicca per selezionare" : "Non disponibile"} arrow placement="top">
                                <Chip 
                                    label={formatSlotTime(slot)} 
                                    onClick={() => isAvailable && setFormData({ ...formData, selectedSlot: slot })} 
                                    icon={isAvailable ? <AccessTimeIcon /> : <BlockIcon />} 
                                    sx={{ 
                                        cursor: isAvailable ? 'pointer' : 'not-allowed', 
                                        bgcolor: isSelected ? '#00B4D8' : (isAvailable ? '#ffffff' : '#f5f5f5'), 
                                        color: isSelected ? '#ffffff' : (isAvailable ? '#00B4D8' : '#9e9e9e'), 
                                        border: `2px solid ${isSelected ? '#00B4D8' : (isAvailable ? '#CAF0F8' : 'transparent')}`, 
                                        fontWeight: isSelected ? 700 : 600, 
                                        height: 42, px: 1, 
                                        boxShadow: isSelected ? '0 4px 12px rgba(0, 180, 216, 0.4)' : 'none', 
                                        transform: isSelected ? 'scale(1.05)' : 'scale(1)', 
                                        transition: 'all 0.2s ease-in-out' 
                                    }} 
                                />
                              </Tooltip>
                            );
                          })}
                        </Box>
                       )}
                   </Box>
                </Grid>
              </Grid>
            )}
            
            {activeStep === 1 && (
              <Box>
                 <Typography variant="h6" sx={{ fontWeight: 700, color: '#0077B6', mb: 3 }}>Anagrafica e Contatti</Typography>
                 <Grid container spacing={3} sx={{ mb: 5 }}>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Nome" name="firstName" value={formData.firstName} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="primary"/></InputAdornment> }} variant="filled" sx={{borderRadius: 2, overflow: 'hidden'}}/></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Cognome" name="lastName" value={formData.lastName} onChange={handleInputChange} InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon color="primary"/></InputAdornment> }} variant="filled" sx={{borderRadius: 2, overflow: 'hidden'}}/></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Email" value={formData.email} disabled InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action"/></InputAdornment> }} variant="filled" sx={{borderRadius: 2, overflow: 'hidden'}}/></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Telefono" name="phone" value={formData.phone} disabled InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="primary"/></InputAdornment> }} variant="filled" sx={{borderRadius: 2, overflow: 'hidden'}}/></Grid>
                  <Grid item xs={12} md={6}><TextField fullWidth label="Data di Nascita" value={formData.birth ? new Date(formData.birth).toLocaleDateString('it-IT') : ''} disabled InputProps={{ startAdornment: <InputAdornment position="start"><CakeIcon color="primary"/></InputAdornment> }} variant="filled" sx={{borderRadius: 2, overflow: 'hidden'}}/></Grid>
                </Grid>
                <Box sx={{ maxWidth: 900, mx: 'auto', textAlign: 'center', mt: 6, p: 4, bgcolor: '#F8FDFF', borderRadius: 4, border: '2px dashed #CAF0F8' }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#00B4D8', mb: 1 }}>Dettagli della Visita</Typography>
                    <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>Aiutaci a preparare al meglio il tuo appuntamento.</Typography>
                    <Stack spacing={4}>
                        <TextField fullWidth label="Motivo Principale della Visita (Obbligatorio)" name="reason" value={formData.reason} onChange={handleInputChange} multiline rows={3} variant="outlined" placeholder="Es. Controllo annuale, dolore al dente..." InputProps={{ startAdornment: <InputAdornment position="start" sx={{mt: 1.5, alignSelf: 'flex-start'}}><AssignmentIcon color="primary" fontSize="large"/></InputAdornment>, sx: { borderRadius: 3, fontSize: '1.1rem', bgcolor: '#fff' } }} InputLabelProps={{ sx: {fontSize: '1.1rem', fontWeight: 500} }} />
                         <TextField fullWidth label="Note Aggiuntive o Richieste Particolari (Opzionale)" name="notes" value={formData.notes} onChange={handleInputChange} multiline rows={2} variant="outlined" placeholder="Eventuali allergie, preferenze, ecc..." InputProps={{ startAdornment: <InputAdornment position="start" sx={{mt: 1.5, alignSelf: 'flex-start'}}><NotesIcon color="action" fontSize="large"/></InputAdornment>, sx: { borderRadius: 3, fontSize: '1rem', bgcolor: '#fff' } }} />
                    </Stack>
                </Box>
              </Box>
            )}
            
            {/* Steps 2 (Pagamento) e 3 (Conferma) */}
            {activeStep === 2 && (
               <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" sx={{ mb: 4, fontWeight: 700, color: '#0077B6', textAlign: 'center' }}>Come preferisci saldare?</Typography>
                  <Grid container spacing={4} justifyContent="center">
                      <Grid item xs={12} md={5}>
                          <Card onClick={() => dispatch(setPaymentMethod('PAYPAL'))} sx={{ p: 3, cursor: 'pointer', transition: 'all 0.3s', border: `3px solid ${paymentMethod === 'PAYPAL' ? '#0070BA' : 'transparent'}`, bgcolor: paymentMethod === 'PAYPAL' ? '#F0F8FF' : '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,112,186,0.2)' }, borderRadius: 4 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><PaymentIcon sx={{ color: '#0070BA', fontSize: 40 }} /><Typography variant="h6" fontWeight={700}>PayPal / Carta</Typography></Box>
                              <Typography variant="body2" color="textSecondary" mb={3}>Pagamento sicuro immediato.</Typography>
                              <Divider sx={{my: 2}}/>
                              <Typography variant="h4" color="#0070BA" fontWeight={800} align="right">€{estimatedPrice.toFixed(2)}</Typography>
                          </Card>
                      </Grid>
                      <Grid item xs={12} md={5}>
                          <Card onClick={() => dispatch(setPaymentMethod('CASH'))} sx={{ p: 3, cursor: 'pointer', transition: 'all 0.3s', border: `3px solid ${paymentMethod === 'CASH' ? '#4CAF50' : 'transparent'}`, bgcolor: paymentMethod === 'CASH' ? '#F1F8F4' : '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(76,175,80,0.2)' }, borderRadius: 4 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}><AccountBalanceWalletIcon sx={{ color: '#4CAF50', fontSize: 40 }} /><Typography variant="h6" fontWeight={700}>In Studio</Typography></Box>
                              <Typography variant="body2" color="textSecondary" mb={3}>Pagherai il giorno della visita.</Typography>
                              <Divider sx={{my: 2}}/>
                              <Typography variant="h4" color="#4CAF50" fontWeight={800} align="right">€{estimatedPrice.toFixed(2)}</Typography>
                          </Card>
                      </Grid>
                  </Grid>
               </Box>
            )}
            
            {activeStep === 3 && (
              <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                <Card sx={{ p: 5, border: 'none', background: 'linear-gradient(145deg, #E1F5FE, #F0F9FF)', borderRadius: 5, mb: 5, boxShadow: 'inset 0 0 30px rgba(0,180,216,0.05)' }}>
                  <Typography variant="h5" fontWeight={800} color="primary" mb={4} textAlign="center">Riepilogo Prenotazione</Typography>
                  <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}><Typography variant="subtitle2" color="textSecondary">Paziente</Typography><Typography variant="h6" fontWeight={600}>{formData.firstName} {formData.lastName}</Typography></Grid>
                      <Grid item xs={12} sm={6}><Typography variant="subtitle2" color="textSecondary">Medico</Typography><Typography variant="h6" fontWeight={600}>Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</Typography></Grid>
                      <Grid item xs={12} sm={6}><Typography variant="subtitle2" color="textSecondary">Data e Ora</Typography><Typography variant="h6" fontWeight={600}>{formData.date} | {formatSlotTime(formData.selectedSlot)}</Typography></Grid>
                      <Grid item xs={12} sm={6}><Typography variant="subtitle2" color="textSecondary">Motivo</Typography><Typography variant="body1" noWrap>{formData.reason || '-'}</Typography></Grid>
                  </Grid>
                  <Divider sx={{my: 4, borderColor: '#B3E5FC'}}/>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">Preventivo Stimato</Typography>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: '#00B4D8' }}>€{estimatedPrice.toFixed(2)}</Typography>
                  </Box>
                </Card>
                {paymentMethod === 'PAYPAL' && bookingSuccess ? (
                  paypalOrderId ? (
                    <Box sx={{ minHeight: 150, maxWidth: 500, mx: 'auto' }}>
                      <PayPalButtons style={{ layout: 'vertical', shape: 'rect', height: 48 }} createOrder={() => paypalOrderId} onApprove={(data) => navigate('/payments/success?token=' + data.orderID)} />
                    </Box>
                  ) : ( <Box sx={{ textAlign: 'center', p: 4 }}><CircularProgress size={30} sx={{ mb: 2 }} /><Typography color="textSecondary">Stiamo preparando il pagamento sicuro...</Typography></Box> )
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button onClick={() => setActiveStep(2)} variant="outlined" size="large" sx={{borderRadius: 3, px: 4, border: '2px solid'}}>Indietro</Button>
                    <Button onClick={handleSubmit} variant="contained" color="success" size="large" disabled={isLoading || bookingSuccess} sx={{borderRadius: 3, px: 5, py: 1.5, fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 8px 20px rgba(76,175,80,0.3)'}}>
                      {isLoading ? 'Elaborazione...' : (paymentMethod === 'PAYPAL' ? 'Procedi al Pagamento' : 'Conferma Prenotazione')}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            
            {activeStep < 3 && (
               <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8, pt: 3, borderTop: '1px solid #f0f0f0' }}>
                  <Button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)} variant="outlined" size="large" sx={{borderRadius: 3, px: 4}}>Indietro</Button>
                  <Button onClick={handleNext} variant="contained" size="large" disabled={(activeStep === 0 && !formData.selectedSlot) || (activeStep === 1 && !formData.reason) || (activeStep === 2 && !paymentMethod)} sx={{borderRadius: 3, px: 5, fontWeight: 700, boxShadow: '0 8px 20px rgba(0,180,216,0.3)'}}>Avanti</Button>
               </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default BookAppointment;