import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Typography, Grid, Card, CardContent, CardActions,
  Button, Alert, Box, Paper, CardMedia, Tooltip, Chip, Avatar
} from '@mui/material';
import { fetchDoctorsRequest, selectDoctor } from '../../redux/slices/doctorSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EmailIcon from '@mui/icons-material/Email';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const doctorImages = [
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=500&h=500&fit=crop',
];

const DoctorsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchDoctorsRequest());
  }, [dispatch]);

  const handleSelectDoctor = (doctor) => {
    // Normalizziamo l'oggetto medico
    const cleanDoctor = {
        id: doctor.id,
        name: doctor.firstName || doctor.name,
        surname: doctor.lastName || doctor.surname,
        email: doctor.email || doctor.emailAddress || '',
        specialization: doctor.specialization || 'Odontoiatra'
    };
    
    console.log("Medico Selezionato:", cleanDoctor);
    dispatch(selectDoctor(cleanDoctor));
    navigate('/book-appointment');
  };

  const handleNoPreference = () => {
    if (list && list.length > 0) {
      handleSelectDoctor(list[0]);
    } else {
      alert('Nessun medico disponibile.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, #F0F9FF, #E0F7FA)', py: 8 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)', mb: 3, boxShadow: '0 8px 24px rgba(0, 180, 216, 0.3)' }}>
            <MedicalServicesIcon sx={{ fontSize: 40, color: '#ffffff' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#00B4D8', mb: 1 }}>I Nostri Specialisti</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

        {list && list.length > 0 && (
          <Paper elevation={0} onClick={handleNoPreference} sx={{ mb: 6, p: 4, borderRadius: 4, cursor: 'pointer', background: 'linear-gradient(120deg, #FFFFFF 0%, #F0F9FF 100%)', border: '2px dashed #00B4D8', display: 'flex', alignItems: 'center', gap: 3, '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0, 180, 216, 0.15)' } }}>
            <Avatar sx={{ bgcolor: '#E1F5FE', color: '#00B4D8', width: 70, height: 70 }}><HowToRegIcon sx={{ fontSize: 35 }} /></Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0077B6' }}>Nessuna Preferenza?</Typography>
              <Typography variant="body1" color="text.secondary">Assegnami il primo specialista disponibile.</Typography>
            </Box>
            <Button variant="contained" size="large" endIcon={<CalendarMonthIcon />} sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700 }}>Prenota Ora</Button>
          </Paper>
        )}

        <Grid container spacing={4}>
          {list.map((doctor, index) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 4, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 15px 35px rgba(0,0,0,0.08)' } }}>
                <Box sx={{ position: 'relative', height: 260 }}>
                  <CardMedia component="img" image={doctorImages[index % doctorImages.length]} alt={doctor.lastName} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,30,60,0.8), transparent)', p: 3, pt: 8 }}>
                    <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Dr. {doctor.firstName} {doctor.lastName}</Typography>
                    <Chip label={doctor.specialization || 'Odontoiatra'} size="small" icon={<VerifiedUserIcon sx={{fontSize: '14px !important'}} />} sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: '#0077B6', fontWeight: 700, height: 24, mt: 0.5 }} />
                  </Box>
                </Box>
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#546E7A' }}>
                    <EmailIcon fontSize="small" sx={{ color: '#90A4AE' }} />
                    <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{doctor.email}</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button fullWidth variant="contained" size="large" onClick={() => handleSelectDoctor(doctor)} sx={{ borderRadius: 3, fontWeight: 700, py: 1.5 }}>Prenota Visita</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DoctorsList;