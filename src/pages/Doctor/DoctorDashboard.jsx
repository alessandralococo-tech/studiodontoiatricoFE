import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Typography, Paper, Box, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Button, IconButton, TextField, Tooltip, Alert, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider // <--- AGGIUNTO QUI
} from '@mui/material';
import { 
  fetchDoctorAppointmentsRequest, 
  updateAppointmentStatusRequest, 
  cancelAppointmentRequest 
} from '../../redux/slices/appointmentSlice';
import LoadingSpinner from '../../components/LoadingSpinner';

// Icone
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { doctorList, loading, error } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  // Stato per la data filtro
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Stati per menu azioni
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApptId, setSelectedApptId] = useState(null);

  // Stati per dialog conferma cancellazione
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [apptToDelete, setApptToDelete] = useState(null);

  // Caricamento dati iniziale e al cambio data
  useEffect(() => {
    dispatch(fetchDoctorAppointmentsRequest({ date: selectedDate }));
  }, [dispatch, selectedDate]);

  // Gestione Menu Azioni
  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedApptId(id);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApptId(null);
  };

  // Cambio Stato
  const handleChangeStatus = (status) => {
    if (selectedApptId) {
      dispatch(updateAppointmentStatusRequest({ id: selectedApptId, status }));
      handleMenuClose();
    }
  };

  // Eliminazione
  const handleDeleteClick = (id) => {
    setApptToDelete(id);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDelete = () => {
    if (apptToDelete) {
      dispatch(cancelAppointmentRequest({ id: apptToDelete }));
      setDeleteDialogOpen(false);
      setApptToDelete(null);
    }
  };

  // Helper formattazione orario
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

  // Chip status helper
  const getStatusChip = (status) => {
    let color = 'default';
    let label = status;
    if (status === 'BOOKED') { color = 'primary'; label = 'Prenotato'; }
    if (status === 'COMPLETED') { color = 'success'; label = 'Completato'; }
    if (status === 'CANCELLED') { color = 'error'; label = 'Annullato'; }
    
    return <Chip label={label} color={color} size="small" sx={{ fontWeight: 600 }} />;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8', py: 4 }}>
      <Container maxWidth="xl">
        
        {/* Header Dashboard */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a365d' }}>
              Dashboard Medico
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Benvenuto Dr. {user?.firstName} {user?.lastName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              type="date"
              label="Filtra per data"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{ bgcolor: 'white' }}
            />
            <Button 
              variant="contained" 
              startIcon={<RefreshIcon />}
              onClick={() => dispatch(fetchDoctorAppointmentsRequest({ date: selectedDate }))}
            >
              Aggiorna
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ borderLeft: '5px solid #00B4D8' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                      APPUNTAMENTI OGGI
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#00B4D8' }}>
                      {doctorList ? doctorList.length : 0}
                    </Typography>
                  </Box>
                  <CalendarTodayIcon sx={{ fontSize: 40, color: '#00B4D8', opacity: 0.5 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {/* Puoi aggiungere altre card KPI qui (es. Pazienti Totali, Guadagno odierno) */}
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Tabella Appuntamenti */}
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          {loading ? (
            <Box sx={{ p: 5 }}><LoadingSpinner /></Box>
          ) : doctorList && doctorList.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Orario</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Paziente</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Contatti</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Motivo / Note</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Stato</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Azioni</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctorList.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          <Typography fontWeight={600}>{formatTimeSlot(row.timeSlot)}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">{row.durationMinutes} min</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#E0F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00B4D8' }}>
                            <PersonIcon fontSize="small" />
                          </Box>
                          <Box>
                            <Typography fontWeight={600}>
                              {row.patientFirstName ? `${row.patientFirstName} ${row.patientLastName}` : `Paziente #${row.patientId}`}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.patientEmail || '-'}</Typography>
                        <Typography variant="caption" color="text.secondary">{row.patientPhone || '-'}</Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {row.reason && (
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.reason}
                          </Typography>
                        )}
                        {row.notes && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                            "{row.notes}"
                          </Typography>
                        )}
                        {!row.reason && !row.notes && <Typography variant="caption" color="text.secondary">-</Typography>}
                      </TableCell>
                      <TableCell>
                        {getStatusChip(row.status)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuClick(e, row.id)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">Nessun appuntamento per questa data</Typography>
            </Box>
          )}
        </Paper>

        {/* Menu Azioni */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
        >
          <MenuItem onClick={() => handleChangeStatus('COMPLETED')}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1.5, color: '#4CAF50' }} /> Segna Completato
          </MenuItem>
          <MenuItem onClick={() => handleChangeStatus('CANCELLED')}>
            <CancelIcon fontSize="small" sx={{ mr: 1.5, color: '#FF9800' }} /> Segna Annullato
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleDeleteClick(selectedApptId)} sx={{ color: '#ef5350' }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1.5 }} /> Elimina Definitivamente
          </MenuItem>
        </Menu>

        {/* Dialog Conferma Eliminazione */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Conferma Eliminazione</DialogTitle>
          <DialogContent>
            Sei sicuro di voler eliminare definitivamente questo appuntamento? L'azione è irreversibile.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annulla</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">Elimina</Button>
          </DialogActions>
        </Dialog>

      </Container>
    </Box>
  );
};

export default DoctorDashboard;