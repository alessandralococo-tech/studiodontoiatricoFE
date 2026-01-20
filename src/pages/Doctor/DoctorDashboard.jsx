import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  IconButton, Button, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, Divider, Chip, Avatar, Stack, Slide,
  TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import React from 'react';
import { 
  fetchDoctorAppointmentsRequest, 
  updateAppointmentStatusRequest, 
  cancelAppointmentRequest,
  updateAppointmentRequest 
} from '../../redux/slices/appointmentSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

// Icone
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import TodayIcon from '@mui/icons-material/Today';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import NotesIcon from '@mui/icons-material/Notes';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import CancelIcon from '@mui/icons-material/Cancel';
import CakeIcon from '@mui/icons-material/Cake';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Slot orari
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

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { doctorList, loading, error } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ date: '', timeSlot: '' });

  useEffect(() => {
    dispatch(fetchDoctorAppointmentsRequest({ date: null })); 
  }, [dispatch]);

  const weekDays = useMemo(() => {
    const start = new Date(currentWeekStart);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(start.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentWeekStart]);

  const handlePrevWeek = () => { const d = new Date(currentWeekStart); d.setDate(d.getDate() - 7); setCurrentWeekStart(d); };
  const handleNextWeek = () => { const d = new Date(currentWeekStart); d.setDate(d.getDate() + 7); setCurrentWeekStart(d); };
  const handleToday = () => setCurrentWeekStart(new Date());
  
  const handleDateJump = (e) => {
    const selected = new Date(e.target.value);
    if (!isNaN(selected)) setCurrentWeekStart(selected);
  };

  const getAppointmentForSlot = (dateObj, slot) => {
    if (!doctorList) return null;
    const dateStr = dateObj.toISOString().split('T')[0];
    return doctorList.find(app => app.appointmentDate === dateStr && app.timeSlot === slot);
  };

  const handleOpenDetails = (appt) => {
    setSelectedAppt(appt);
    setIsEditing(false);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setOpenDetailsDialog(false);
    setSelectedAppt(null);
    setIsEditing(false);
  };

  const handleCancelStatus = () => {
    if (selectedAppt) {
      dispatch(updateAppointmentStatusRequest({ id: selectedAppt.id, status: 'CANCELLED' }));
      handleCloseDetails();
    }
  };

  const handleDeleteClick = () => setDeleteDialogOpen(true);
  const confirmDelete = () => {
    if (selectedAppt) {
      dispatch(cancelAppointmentRequest({ id: selectedAppt.id }));
      setDeleteDialogOpen(false);
      handleCloseDetails();
    }
  };

  const startEdit = () => {
    setEditForm({
      date: selectedAppt.appointmentDate,
      timeSlot: selectedAppt.timeSlot
    });
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (selectedAppt && editForm.date && editForm.timeSlot) {
      const doctorId = selectedAppt.doctorId || selectedAppt.doctor?.id || user?.id;
      const patientEmail = selectedAppt.patientEmail || selectedAppt.patient?.email;

      if (!doctorId || !patientEmail) {
        alert("Errore: Dati mancanti (Doctor ID o Email Paziente). Impossibile modificare.");
        return;
      }

      const updatePayload = {
        id: selectedAppt.id,
        doctorId: doctorId, 
        patientEmail: patientEmail,
        appointmentDate: editForm.date,
        timeSlot: editForm.timeSlot,
        durationMinutes: selectedAppt.durationMinutes || 15,
        status: selectedAppt.status,
        reason: selectedAppt.reason,
        notes: selectedAppt.notes
      };
      
      dispatch(updateAppointmentRequest({ id: selectedAppt.id, data: updatePayload }));
      handleCloseDetails();
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'COMPLETED': return '#E8F5E9'; 
      case 'CANCELLED': return '#FFEBEE'; 
      default: return '#E1F5FE'; 
    }
  };
  const getHeaderColor = (status) => {
    switch(status) {
      case 'COMPLETED': return 'linear-gradient(135deg, #43A047 0%, #2E7D32 100%)';
      case 'CANCELLED': return 'linear-gradient(135deg, #E53935 0%, #C62828 100%)';
      default: return 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8', py: 4 }}>
      <Container maxWidth="xl">
        
        {/* HEADER CONTROLS */}
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d' }}>Agenda Settimanale</Typography>
            <Typography variant="body1" color="text.secondary">Dr. {user?.firstName} {user?.lastName}</Typography>
          </Box>

          <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: '#fff', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={handlePrevWeek}><ChevronLeftIcon /></IconButton>
              <Button startIcon={<TodayIcon />} onClick={handleToday} sx={{ mx: 1, fontWeight: 700 }}>Oggi</Button>
              <IconButton onClick={handleNextWeek}><ChevronRightIcon /></IconButton>
            </Box>
            
            <TextField 
              type="date" 
              size="small" 
              onChange={handleDateJump} 
              sx={{ width: 160 }} 
              label="Filtra Data"
              InputLabelProps={{ shrink: true }}
            />
          </Paper>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* CALENDARIO */}
        <Paper sx={{ overflowX: 'auto', borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', bgcolor: '#fff', border: '1px solid #eee' }}>
          {loading ? <Box sx={{ p: 10 }}><LoadingSpinner /></Box> : (
            <Box sx={{ minWidth: 1000, display: 'flex', flexDirection: 'column' }}>
              
              {/* Header Giorni */}
              <Box sx={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                <Box sx={{ width: 80, p: 2, borderRight: '1px solid #eee', bgcolor: '#fafafa' }} /> 
                {weekDays.map((day, i) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <Box key={i} sx={{ flex: 1, p: 2, textAlign: 'center', borderRight: '1px solid #eee', bgcolor: isToday ? '#E0F7FA' : '#fff' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#999', textTransform: 'uppercase' }}>{day.toLocaleDateString('it-IT', { weekday: 'short' })}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: isToday ? '#00B4D8' : '#333' }}>{day.getDate()}</Typography>
                    </Box>
                  );
                })}
              </Box>

              {/* Griglia Orari */}
              {ALL_TIME_SLOTS.map((slot) => (
                <Box key={slot} sx={{ display: 'flex', borderBottom: '1px solid #f8f8f8', height: 95 }}>
                  <Box sx={{ width: 80, borderRight: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#666' }}>{formatTimeSlot(slot)}</Typography>
                  </Box>
                  {weekDays.map((day, i) => {
                    const appointment = getAppointmentForSlot(day, slot);
                    return (
                      <Box key={i} sx={{ flex: 1, borderRight: '1px solid #f8f8f8', p: 0.5 }}>
                        {appointment && (
                          <Card 
                            onClick={() => handleOpenDetails(appointment)}
                            sx={{ 
                              height: '100%', bgcolor: getStatusColor(appointment.status),
                              borderLeft: `5px solid ${appointment.status === 'CANCELLED' ? '#EF5350' : '#00B4D8'}`,
                              cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                              '&:hover': { transform: 'scale(1.01)', boxShadow: '0 8px 16px rgba(0,0,0,0.08)' }
                            }}
                          >
                            <CardContent sx={{ p: '8px !important', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#1a365d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {appointment.patient?.firstName || appointment.patientFirstName || "Paziente"} {appointment.patient?.lastName || appointment.patientLastName || ""}
                              </Typography>
                              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#455a64', mt: 0.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {appointment.reason || 'Visita'}
                              </Typography>
                              {appointment.status === 'CANCELLED' && (
                                <Chip label="ANNULLATO" size="small" color="error" sx={{ height: 16, fontSize: '0.55rem', mt: 0.5, fontWeight: 700 }} />
                              )}
                            </CardContent>
                          </Card>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        {/* DIALOG DETTAGLI */}
        {selectedAppt && (
          <Dialog open={openDetailsDialog} TransitionComponent={Transition} onClose={handleCloseDetails} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}>
            <Box sx={{ background: getHeaderColor(selectedAppt.status), p: 3, color: '#fff', position: 'relative' }}>
              <IconButton onClick={handleCloseDetails} sx={{ position: 'absolute', top: 8, right: 8, color: 'rgba(255,255,255,0.8)' }}><CloseIcon /></IconButton>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 50, height: 50 }}><PersonIcon /></Avatar>
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    {selectedAppt.patient?.firstName || selectedAppt.patientFirstName || "Paziente"} {selectedAppt.patient?.lastName || selectedAppt.patientLastName || ""}
                  </Typography>
                  <Chip label={isEditing ? "Modifica in corso..." : selectedAppt.status} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600, mt: 0.5 }} />
                </Box>
              </Box>
            </Box>

            <DialogContent sx={{ pt: 4, pb: 2 }}>
              {!isEditing ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={2.5}>
                      <Box sx={{ display: 'flex', gap: 2 }}><EmailIcon color="primary" /><Typography>{selectedAppt.patient?.email || selectedAppt.patientEmail || 'Email non disponibile'}</Typography></Box>
                      <Box sx={{ display: 'flex', gap: 2 }}><PhoneIcon color="primary" /><Typography>{selectedAppt.patient?.phone || selectedAppt.patient?.phoneNumber || selectedAppt.patientPhone || 'Telefono non disponibile'}</Typography></Box>
                      <Box sx={{ display: 'flex', gap: 2 }}><CakeIcon color="primary" /><Typography>{selectedAppt.patient?.birth || 'Data di nascita non disponibile'}</Typography></Box>
                      <Box sx={{ display: 'flex', gap: 2 }}><EventIcon color="primary" /><Typography fontWeight={700}>{new Date(selectedAppt.appointmentDate).toLocaleDateString()} - {formatTimeSlot(selectedAppt.timeSlot)}</Typography></Box>
                      <Divider />
                      <Box sx={{ display: 'flex', gap: 2 }}><BookmarkIcon color="action" /><Typography><strong>Motivo:</strong> {selectedAppt.reason || 'Nessun motivo specificato'}</Typography></Box>
                      <Box sx={{ display: 'flex', gap: 2 }}><NotesIcon color="action" /><Typography sx={{ fontStyle: 'italic', color: '#666' }}><strong>Note:</strong> {selectedAppt.notes || 'Nessuna nota aggiuntiva'}</Typography></Box>
                    </Stack>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField fullWidth type="date" label="Seleziona Nuova Data" InputLabelProps={{ shrink: true }} value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Seleziona Nuovo Orario</InputLabel>
                      <Select value={editForm.timeSlot} label="Seleziona Nuovo Orario" onChange={(e) => setEditForm({...editForm, timeSlot: e.target.value})}>
                        {ALL_TIME_SLOTS.map(slot => <MenuItem key={slot} value={slot}>{formatTimeSlot(slot)}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
              {!isEditing ? (
                <>
                  <Button onClick={handleDeleteClick} startIcon={<DeleteIcon />} color="error" sx={{ fontWeight: 700 }}>Elimina</Button>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedAppt.status !== 'CANCELLED' && (
                      <Button onClick={handleCancelStatus} variant="outlined" color="error" startIcon={<CancelIcon />}>Annulla Visita</Button>
                    )}
                    <Button onClick={startEdit} variant="contained" startIcon={<EditIcon />} sx={{ bgcolor: '#00B4D8', fontWeight: 700 }}>Modifica Data</Button>
                  </Box>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(false)}>Annulla</Button>
                  <Button onClick={saveEdit} variant="contained" color="success" sx={{ fontWeight: 700 }}>Salva Modifiche</Button>
                </>
              )}
            </DialogActions>
          </Dialog>
        )}

        {/* DIALOG CONFERMA ELIMINAZIONE */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ fontWeight: 800 }}>Conferma Eliminazione</DialogTitle>
          <DialogContent><Typography>Sei sicuro di voler eliminare definitivamente questo appuntamento? L'azione è irreversibile.</Typography></DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 600 }}>Chiudi</Button>
            <Button onClick={confirmDelete} color="error" variant="contained" sx={{ fontWeight: 700 }}>Sì, Elimina</Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default DoctorDashboard;