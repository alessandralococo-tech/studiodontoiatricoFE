import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Divider,
  Snackbar,
} from '@mui/material';
import { fetchMyAppointmentsRequest, cancelAppointmentRequest } from '../../redux/slices/appointmentSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MessageIcon from '@mui/icons-material/Message';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const MyAppointments = () => {
  const dispatch = useDispatch();
  const { list, loading, error, cancelSuccess } = useSelector((state) => state.appointments);
  
  // Stati per i popup
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [note, setNote] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [reasonError, setReasonError] = useState(false);

  useEffect(() => {
    dispatch(fetchMyAppointmentsRequest());
  }, [dispatch]);

  // Quando la cancellazione ha successo
  useEffect(() => {
    if (cancelSuccess) {
      setShowSuccessSnackbar(true);
      setShowCancelDialog(false);
      setSelectedAppointment(null);
      setCancellationReason('');
      dispatch(fetchMyAppointmentsRequest());
    }
  }, [cancelSuccess, dispatch]);

  const formatTimeSlot = (slot) => {
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

  // Funzione per calcolare lo stato effettivo basato sulla data
  const getEffectiveStatus = (appointment) => {
    if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
      return appointment.status;
    }

    const timeStr = formatTimeSlot(appointment.timeSlot);
    const appDateTime = new Date(appointment.appointmentDate);
    
    if (timeStr && timeStr.includes(':')) {
      const [hours, minutes] = timeStr.split(':');
      appDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
    }

    const now = new Date();
    if (now > appDateTime) {
      return 'COMPLETED';
    }

    return appointment.status;
  };

  // Memoizzazione e divisione delle liste
  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    if (!list || list.length === 0) return { upcomingAppointments: [], pastAppointments: [] };
    
    const sorted = [...list].sort((a, b) => b.id - a.id);
    const upcoming = [];
    const past = [];

    sorted.forEach(app => {
      const status = getEffectiveStatus(app);
      if (status === 'COMPLETED' || status === 'CANCELLED') {
        past.push(app);
      } else {
        upcoming.push(app);
      }
    });

    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [list]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'BOOKED': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'BOOKED': return 'Prenotato';
      case 'COMPLETED': return 'Completato';
      case 'CANCELLED': return 'Annullato';
      default: return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'BOOKED': return <HourglassEmptyIcon sx={{ fontSize: 18 }} />;
      case 'COMPLETED': return <CheckCircleIcon sx={{ fontSize: 18 }} />;
      case 'CANCELLED': return <CancelIcon sx={{ fontSize: 18 }} />;
      default: return null;
    }
  };

  const handleRowClick = (appointment, allowClick) => {
    if (allowClick) {
      setSelectedAppointment(appointment);
      setShowDetailsDialog(true);
    }
  };

  const handleCloseDetails = () => {
    setShowDetailsDialog(false);
    setSelectedAppointment(null);
  };

  const handleOpenCancel = () => {
    setShowDetailsDialog(false);
    setShowCancelDialog(true);
  };

  const handleCloseCancel = () => {
    setShowCancelDialog(false);
    setCancellationReason('');
    setReasonError(false);
    setShowDetailsDialog(true);
  };

  const handleConfirmCancel = () => {
    if (!cancellationReason.trim()) {
      setReasonError(true);
      return;
    }
    dispatch(cancelAppointmentRequest({ 
      id: selectedAppointment.id,
      reason: cancellationReason 
    }));
  };

  const handleOpenNote = () => {
    setShowDetailsDialog(false);
    setShowNoteDialog(true);
  };

  const handleCloseNote = () => {
    setShowNoteDialog(false);
    setNote('');
    setShowDetailsDialog(true);
  };

  const handleSendNote = () => {
    if (note.trim()) {
      setShowSuccessSnackbar(true);
      setShowNoteDialog(false);
      setNote('');
      setSelectedAppointment(null);
    } else {
      alert('Inserisci un messaggio prima di inviare');
    }
  };

  // Helper per renderizzare una tabella
  const renderTable = (appointments, sectionType) => {
    const isHistory = sectionType === 'completed';
    const isCancelled = sectionType === 'cancelled';
    const allowClick = sectionType === 'upcoming';

    return (
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 4,
          boxShadow: isCancelled ? 'none' : (isHistory ? 'none' : '0 10px 40px rgba(0, 180, 216, 0.15)'),
          overflow: 'hidden',
          background: isCancelled ? '#fff5f5' : (isHistory ? '#f8f9fa' : '#ffffff'),
          border: isCancelled ? '1px solid #ffcdd2' : (isHistory ? '1px solid #e0e0e0' : 'none'),
          opacity: (isHistory || isCancelled) ? 0.9 : 1
        }}
      >
        <Table>
          <TableHead>
            <TableRow 
              sx={{ 
                background: isCancelled 
                  ? '#ef5350' 
                  : (isHistory ? '#e0e0e0' : 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)')
              }}
            >

              {['Data', 'Orario', 'Durata', 'Stato'].map((header, i) => (
                <TableCell 
                  key={i}
                  sx={{ 
                    color: (isHistory && !isCancelled) ? '#666' : '#ffffff', 
                    fontWeight: 700, 
                    fontSize: '1rem', 
                    py: 2,
                    borderBottom: 'none'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => {
              const effectiveStatus = getEffectiveStatus(appointment);

              return (
                <TableRow 
                  key={appointment.id}
                  onClick={() => handleRowClick(appointment, allowClick)}
                  sx={{ 
                    cursor: allowClick ? 'pointer' : 'default',
                    '&:nth-of-type(odd)': { 
                      bgcolor: isCancelled ? '#fff5f5' : (isHistory ? '#f8f9fa' : '#F0F9FF')
                    },
                    '&:hover': allowClick ? {
                      bgcolor: '#E0F7FA',
                      transform: 'scale(1.01)',
                      boxShadow: '0 4px 12px rgba(0, 180, 216, 0.1)',
                      transition: 'all 0.2s'
                    } : {},
                    borderBottom: index === appointments.length - 1 ? 'none' : '1px solid #CAF0F8'
                  }}
                >
                  <TableCell sx={{ py: 3, borderBottom: 'none' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, color: isCancelled ? '#d32f2f' : (isHistory ? '#666' : '#00B4D8'), fontSize: '1.05rem' }}>
                        {new Date(appointment.appointmentDate).toLocaleDateString('it-IT', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {new Date(appointment.appointmentDate).toLocaleDateString('it-IT', { weekday: 'long' })}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 3, borderBottom: 'none' }}>
                    <Chip
                      label={formatTimeSlot(appointment.timeSlot)}
                      sx={{ 
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        bgcolor: isCancelled ? '#ffcdd2' : (isHistory ? '#e0e0e0' : '#00B4D8'),
                        color: isCancelled ? '#d32f2f' : (isHistory ? '#666' : '#ffffff'),
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 3, borderBottom: 'none' }}>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.durationMinutes} min
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 3, borderBottom: 'none' }}>
                    <Chip
                      icon={getStatusIcon(effectiveStatus)}
                      label={getStatusLabel(effectiveStatus)}
                      color={getStatusColor(effectiveStatus)}
                      variant={isCancelled || isHistory ? "outlined" : "filled"}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (loading) return <LoadingSpinner />;

  const hasNoAppointments = upcomingAppointments.length === 0 && pastAppointments.length === 0;

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
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
              boxShadow: '0 8px 24px rgba(0, 180, 216, 0.3)'
            }}
          >
            <EventAvailableIcon sx={{ fontSize: 40, color: '#ffffff' }} />
          </Box>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}
          >
            I Miei Appuntamenti
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>
        )}

        {hasNoAppointments && !loading ? (
          <Card 
            sx={{ 
              textAlign: 'center', py: 10, borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #F0F9FF 100%)',
              border: '2px dashed #00B4D850',
            }}
          >
            <CardContent>
              <CalendarMonthIcon sx={{ fontSize: 60, color: '#00B4D8', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                Nessun appuntamento trovato
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Prenota la tua prima visita per iniziare!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {upcomingAppointments.length > 0 && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#333', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon color="primary" /> In Programma
                </Typography>
                {renderTable(upcomingAppointments, 'upcoming')}
              </Box>
            )}

            {pastAppointments.length > 0 && (
              <Box>
                <Divider sx={{ mb: 4 }}>
                  <Chip label="STORICO" sx={{ fontWeight: 600, color: '#999' }} />
                </Divider>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#666', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HistoryIcon color="action" /> Storico Appuntamenti
                </Typography>
                {renderTable(pastAppointments, 'completed')}
              </Box>
            )}
          </Box>
        )}
      </Container>

      {/* Dialog Dettagli Appuntamento */}
      {selectedAppointment && (
        <Dialog 
          open={showDetailsDialog} 
          onClose={handleCloseDetails}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4 } }}
        >
          <DialogTitle 
            sx={{ 
              background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
              color: '#ffffff',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Dettagli Appuntamento</Typography>
            <IconButton onClick={handleCloseDetails} sx={{ color: '#ffffff' }}><CloseIcon /></IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 4, pb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>DATA</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {new Date(selectedAppointment.appointmentDate).toLocaleDateString('it-IT')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>ORARIO</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {formatTimeSlot(selectedAppointment.timeSlot)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 2, flexDirection: 'column' }}>
            <Button
              fullWidth variant="contained" startIcon={<MessageIcon />} onClick={handleOpenNote}
              sx={{ bgcolor: '#00B4D8', py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#0096C7' } }}
            >
              Invia Nota al Medico
            </Button>
            <Button
              fullWidth variant="outlined" startIcon={<DeleteOutlineIcon />} onClick={handleOpenCancel}
              sx={{ borderColor: '#ef4444', color: '#ef4444', py: 1.5, fontWeight: 700, '&:hover': { borderColor: '#dc2626', bgcolor: '#fef2f2' } }}
            >
              Annulla Appuntamento
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog Conferma Cancellazione con Causale */}
      <Dialog 
        open={showCancelDialog} 
        onClose={handleCloseCancel} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
          fontWeight: 700,
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CancelIcon sx={{ fontSize: 32 }} />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Conferma Annullamento
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: '1.1rem' }}>
            Sei sicuro di voler annullare questo appuntamento?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Motivo della cancellazione *"
            value={cancellationReason}
            onChange={(e) => {
              setCancellationReason(e.target.value);
              setReasonError(false);
            }}
            placeholder="Inserisci il motivo per cui vuoi annullare l'appuntamento..."
            variant="outlined"
            required
            error={reasonError}
            helperText={reasonError ? "Il motivo è obbligatorio" : ""}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#ef4444',
                },
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            * Campo obbligatorio
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={handleCloseCancel} 
            variant="outlined" 
            sx={{ flex: 1, py: 1.5, fontWeight: 600 }}
          >
            Torna Indietro
          </Button>
          <Button 
            onClick={handleConfirmCancel} 
            variant="contained" 
            disabled={loading}
            sx={{ 
              flex: 1, 
              bgcolor: '#ef4444',
              py: 1.5,
              fontWeight: 700,
              '&:hover': {
                bgcolor: '#dc2626'
              }
            }}
          >
            {loading ? 'Annullamento...' : 'Conferma Annullamento'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Invia Nota */}
      <Dialog open={showNoteDialog} onClose={handleCloseNote} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
          color: '#ffffff',
          fontWeight: 700,
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MessageIcon />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Invia Nota al Medico</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          <TextField
            fullWidth 
            multiline 
            rows={4} 
            value={note} 
            onChange={(e) => setNote(e.target.value)}
            placeholder="Scrivi qui il tuo messaggio..." 
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#00B4D8',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={handleCloseNote} variant="outlined" sx={{ flex: 1, py: 1.5 }}>Annulla</Button>
          <Button onClick={handleSendNote} variant="contained" sx={{ flex: 1, bgcolor: '#00B4D8', py: 1.5, fontWeight: 700 }}>Invia</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Successo */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)} 
          severity="success" 
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(76, 175, 80, 0.3)',
            fontSize: '1rem',
            fontWeight: 600
          }}
          icon={<CheckCircleOutlineIcon fontSize="large" />}
        >
          Appuntamento annullato con successo!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyAppointments;