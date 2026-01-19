import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Paper, Typography, Box, Grid, TextField, Button,
  Avatar, IconButton, Alert, Snackbar, Chip, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { fetchProfileRequest } from '../redux/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Carica i dati dal backend
  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  // Aggiorna il form quando i dati utente arrivano dallo store
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '', 
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
    });
    setIsEditing(false);
  };

  const handleSubmit = () => {
    console.log("Salvataggio dati:", formData);
    setShowSuccessSnackbar(true);
    setIsEditing(false);
  };

  const getInitials = () => {
    if (formData.firstName && formData.lastName) {
        return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  if (!user) return null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F4F6F8', py: 6 }}>
      <Container maxWidth="md">
        
        {/* HEADER CARD CON BANNER GRADIENTE */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden', 
            mb: 4,
            boxShadow: '0 8px 32px rgba(0, 180, 216, 0.15)',
            position: 'relative'
          }}
        >
          <Box sx={{ height: 160, background: 'linear-gradient(120deg, #00B4D8 0%, #0077B6 100%)' }} />
          
          <Box sx={{ px: 4, pb: 4, mt: -7, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  sx={{ 
                    width: 130, height: 130, border: '5px solid #ffffff',
                    bgcolor: '#E0F7FA', color: '#0077B6', fontSize: '3rem',
                    fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  {getInitials()}
                </Avatar>
                <IconButton 
                  sx={{ 
                    position: 'absolute', bottom: 5, right: 5, bgcolor: '#ffffff', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)', '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                  size="small"
                >
                  <CameraAltIcon fontSize="small" color="primary" />
                </IconButton>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d', lineHeight: 1.2 }}>
                  {formData.firstName || 'Caricamento...'} {formData.lastName}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                  <Chip 
                    icon={<VerifiedUserIcon fontSize="small" />} 
                    label={user.role === 'ROLE_ADMIN' ? 'Medico Specialista' : 'Paziente'} 
                    size="small"
                    sx={{ 
                      bgcolor: user.role === 'ROLE_ADMIN' ? '#E3F2FD' : '#E8F5E9', 
                      color: user.role === 'ROLE_ADMIN' ? '#1565C0' : '#2E7D32',
                      fontWeight: 700, border: 'none'
                    }} 
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              {!isEditing ? (
                <Button 
                  variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}
                  sx={{ 
                    borderRadius: 3, px: 4, py: 1, fontWeight: 700,
                    bgcolor: '#ffffff', color: '#00B4D8', border: '2px solid #E0F7FA',
                    boxShadow: 'none', '&:hover': { bgcolor: '#F0F9FF', borderColor: '#00B4D8' }
                  }}
                >
                  Modifica Profilo
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} sx={{ borderRadius: 3, fontWeight: 600 }}>
                    Annulla
                  </Button>
                  <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit} sx={{ borderRadius: 3, px: 3, fontWeight: 700, color: '#fff', bgcolor: '#00B4D8' }}>
                    Salva
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* DETTAGLI PERSONALI */}
        <Paper elevation={0} sx={{ p: 5, borderRadius: 4, boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#E0F7FA', color: '#00B4D8' }}><PersonIcon /></Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#333' }}>Informazioni Personali</Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Nome" name="firstName" value={formData.firstName} onChange={handleChange}
                disabled={!isEditing} variant="outlined"
                InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>) }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 }, bgcolor: isEditing ? '#fff' : '#f9f9f9' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Cognome" name="lastName" value={formData.lastName} onChange={handleChange}
                disabled={!isEditing} variant="outlined"
                InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>) }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 }, bgcolor: isEditing ? '#fff' : '#f9f9f9' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Email" name="email" value={formData.email} disabled={true}
                variant="outlined"
                InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>) }}
                helperText="L'email non può essere modificata"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 }, bgcolor: '#f4f4f4' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Telefono" name="phone" value={formData.phone} onChange={handleChange}
                disabled={!isEditing} placeholder="Inserisci numero..." variant="outlined"
                InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment>) }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 }, bgcolor: isEditing ? '#fff' : '#f9f9f9' }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar open={showSuccessSnackbar} autoHideDuration={4000} onClose={() => setShowSuccessSnackbar(false)}>
        <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success" variant="filled" sx={{ width: '100%', borderRadius: 3, fontWeight: 600 }}>
          Profilo aggiornato con successo!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;