import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Paper, Typography, Box, Grid, TextField, Button,
  Avatar, IconButton, Alert, Snackbar, Chip, InputAdornment, Stack, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CakeIcon from '@mui/icons-material/Cake';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { fetchProfileRequest } from '../redux/slices/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  // Stato del form con tutti i campi
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birth: ''
  });

  // Carica i dati dal backend all'avvio
  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  // Aggiorna il form quando i dati utente arrivano dallo store Redux
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '', 
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        birth: user.birth || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    // Ripristina i dati originali
    setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        birth: user.birth || ''
    });
    setIsEditing(false);
  };

  const handleSubmit = () => {
    // Per ora simuliamo il successo
    console.log("Dati aggiornati:", formData);
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
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top center, #F0F9FF 0%, #E0F7FA 100%)', 
      py: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="md">
        
        {/* CARD PRINCIPALE */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 5, 
            overflow: 'hidden', 
            boxShadow: '0 20px 60px rgba(0, 180, 216, 0.15)',
            border: '1px solid rgba(255,255,255,0.8)',
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Banner Superiore */}
          <Box sx={{ 
            height: 180, 
            background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
            position: 'relative'
          }}>
            {/* Pattern decorativo opzionale */}
            <Box sx={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
              opacity: 0.1, 
              backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2.5px)',
              backgroundSize: '20px 20px'
            }} />
          </Box>
          
          <Box sx={{ px: { xs: 3, md: 6 }, pb: 6, mt: -8 }}>
            
            {/* Intestazione Profilo */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-end', justifyContent: 'space-between', gap: 3 }}>
              
              {/* Avatar con bordo */}
              <Box sx={{ position: 'relative', mx: { xs: 'auto', sm: 0 } }}>
                <Avatar 
                  sx={{ 
                    width: 140, height: 140, 
                    border: '6px solid #ffffff',
                    bgcolor: '#E1F5FE', color: '#0077B6', 
                    fontSize: '3.5rem', fontWeight: 800, 
                    boxShadow: '0 8px 24px rgba(0, 180, 216, 0.25)'
                  }}
                >
                  {getInitials()}
                </Avatar>
                <IconButton 
                  sx={{ 
                    position: 'absolute', bottom: 5, right: 5, 
                    bgcolor: '#ffffff', color: '#00B4D8',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)', 
                    '&:hover': { bgcolor: '#f0f0f0' }
                  }}
                  size="small"
                >
                  <CameraAltIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Nome e Ruolo */}
              <Box sx={{ mb: 1, flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a365d', letterSpacing: '-0.5px' }}>
                  {formData.firstName} {formData.lastName}
                </Typography>
                
                <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'center', sm: 'flex-start' }} sx={{ mt: 1 }}>
                  <Chip 
                    icon={<VerifiedUserIcon sx={{ fontSize: '16px !important' }} />} 
                    label={user.role === 'ROLE_ADMIN' ? 'Medico Specialista' : 'Paziente Verificato'} 
                    size="small"
                    sx={{ 
                      bgcolor: user.role === 'ROLE_ADMIN' ? '#E3F2FD' : '#E8F5E9', 
                      color: user.role === 'ROLE_ADMIN' ? '#1565C0' : '#2E7D32',
                      fontWeight: 700, px: 0.5
                    }} 
                  />
                  <Chip label="Account Attivo" size="small" variant="outlined" sx={{ fontWeight: 600, color: '#666', borderColor: '#ddd' }} />
                </Stack>
              </Box>

              {/* Pulsanti Azione */}
              <Box sx={{ mb: 1, width: { xs: '100%', sm: 'auto' } }}>
                {!isEditing ? (
                  <Button 
                    fullWidth
                    variant="contained" 
                    startIcon={<EditIcon />} 
                    onClick={() => setIsEditing(true)}
                    sx={{ 
                      borderRadius: 3, px: 4, py: 1.2, fontWeight: 700,
                      background: '#fff', color: '#00B4D8', 
                      border: '2px solid #E0F7FA',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      '&:hover': { bgcolor: '#F0F9FF', borderColor: '#00B4D8', transform: 'translateY(-2px)' },
                      transition: 'all 0.2s'
                    }}
                  >
                    Modifica
                  </Button>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel} sx={{ borderRadius: 3, fontWeight: 600, border: '2px solid' }}>
                      Annulla
                    </Button>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSubmit} sx={{ borderRadius: 3, px: 3, fontWeight: 700, bgcolor: '#00B4D8', boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)' }}>
                      Salva
                    </Button>
                  </Stack>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 5, borderColor: 'rgba(0,0,0,0.06)' }} />

            {/* Form Dati */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#333', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: '#00B4D8' }} /> Dati Personali
              </Typography>

              <Grid container spacing={3}>
                {/* NOME */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Nome" name="firstName" value={formData.firstName} onChange={handleChange}
                    disabled={!isEditing} variant="filled"
                    InputProps={{ disableUnderline: true, startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>) }}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: 3, bgcolor: isEditing ? '#fff' : '#f8f9fa', border: '1px solid', borderColor: isEditing ? '#00B4D8' : 'transparent' } }}
                  />
                </Grid>
                {/* COGNOME */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Cognome" name="lastName" value={formData.lastName} onChange={handleChange}
                    disabled={!isEditing} variant="filled"
                    InputProps={{ disableUnderline: true, startAdornment: (<InputAdornment position="start"><PersonIcon color="action" /></InputAdornment>) }}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: 3, bgcolor: isEditing ? '#fff' : '#f8f9fa', border: '1px solid', borderColor: isEditing ? '#00B4D8' : 'transparent' } }}
                  />
                </Grid>
                
                {/* EMAIL (Sola lettura) */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Email" name="email" value={formData.email} disabled
                    variant="filled"
                    InputProps={{ disableUnderline: true, startAdornment: (<InputAdornment position="start"><EmailIcon color="action" /></InputAdornment>) }}
                    helperText={isEditing ? "L'email non può essere modificata" : ""}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: 3, bgcolor: '#f0f2f5' } }}
                  />
                </Grid>

                {/* TELEFONO */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth label="Telefono" name="phone" value={formData.phone} onChange={handleChange}
                    disabled={!isEditing} placeholder="Inserisci numero..." variant="filled"
                    InputProps={{ disableUnderline: true, startAdornment: (<InputAdornment position="start"><PhoneIcon color={formData.phone ? "primary" : "action"} /></InputAdornment>) }}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: 3, bgcolor: isEditing ? '#fff' : '#f8f9fa', border: '1px solid', borderColor: isEditing ? '#00B4D8' : 'transparent' } }}
                  />
                </Grid>

                {/* DATA DI NASCITA */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth type="date" label="Data di Nascita" name="birth" value={formData.birth} onChange={handleChange}
                    disabled={!isEditing} variant="filled"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ disableUnderline: true, startAdornment: (<InputAdornment position="start"><CakeIcon color={formData.birth ? "primary" : "action"} /></InputAdornment>) }}
                    sx={{ '& .MuiFilledInput-root': { borderRadius: 3, bgcolor: isEditing ? '#fff' : '#f8f9fa', border: '1px solid', borderColor: isEditing ? '#00B4D8' : 'transparent' } }}
                  />
                </Grid>
              </Grid>
            </Box>

          </Box>
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