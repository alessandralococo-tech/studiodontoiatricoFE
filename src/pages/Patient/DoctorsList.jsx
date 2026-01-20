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
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// STILI & ASSETS
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

  // HELPER NORMALIZZAZIONE DATI
  // Queste funzioni gestiscono le varianti dei nomi dei campi dal backend
  const getDoctorName = (doc) => doc.firstName || doc.first_name || doc.name || 'Nome';
  const getDoctorSurname = (doc) => doc.lastName || doc.last_name || doc.surname || 'Cognome';
  const getDoctorEmail = (doc) => doc.email || doc.mail || doc.emailAddress || 'Email non disponibile';
  const getDoctorSpecialization = (doc) => doc.specialization || doc.speciality || 'Odontoiatria Generale';

  // AZIONI
  
  const handleSelectDoctor = (doctor) => {
    // In questo modo BookAppointment troverà sempre le proprietà .name, .surname, .email
    const normalizedDoctor = {
      id: doctor.id,
      name: getDoctorName(doctor),
      surname: getDoctorSurname(doctor),
      email: getDoctorEmail(doctor),
      specialization: getDoctorSpecialization(doctor),
      image: doctorImages[doctor.id % doctorImages.length] // Passiamo anche l'immagine se serve
    };

    console.log("Medico Selezionato (Normalizzato):", normalizedDoctor); // Debug
    dispatch(selectDoctor(normalizedDoctor));
    navigate('/book-appointment');
  };

  const handleNoPreference = () => {
    if (list && list.length > 0) {
      // Seleziona il primo disponibile come fallback
      const autoSelectedDoctor = list[0]; 
      handleSelectDoctor({
        ...autoSelectedDoctor,
        specialization: "Medico Assegnato dallo Studio" // Override visuale
      });
    } else {
      alert('Nessun medico disponibile al momento.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ minHeight: '100vh', background: 'radial-gradient(circle at top left, #F0F9FF, #E0F7FA)', py: 8 }}>
      <Container maxWidth="lg">
        
        {/* HEADER */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box 
            sx={{ 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
              mb: 3, boxShadow: '0 8px 24px rgba(0, 180, 216, 0.3)'
            }}
          >
            <MedicalServicesIcon sx={{ fontSize: 40, color: '#ffffff' }} />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#00B4D8', mb: 1, letterSpacing: '-0.5px' }}>
            I Nostri Specialisti
          </Typography>
          <Typography variant="h6" sx={{ color: '#546E7A', fontWeight: 500, maxWidth: 600, mx: 'auto' }}>
            Affidati ai migliori professionisti per la cura del tuo sorriso. Scegli il medico che preferisci.
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

        {/* CARD "NESSUNA PREFERENZA" */}
        {list && list.length > 0 && (
          <Paper 
            elevation={0}
            onClick={handleNoPreference}
            sx={{ 
              mb: 6, p: 4, borderRadius: 4, cursor: 'pointer',
              background: 'linear-gradient(120deg, #FFFFFF 0%, #F0F9FF 100%)',
              border: '2px dashed #00B4D8',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3,
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(0, 180, 216, 0.15)', borderColor: '#0096C7' }
            }}
          >
            <Avatar sx={{ bgcolor: '#E1F5FE', color: '#00B4D8', width: 70, height: 70 }}>
              <HowToRegIcon sx={{ fontSize: 35 }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0077B6' }}>Nessuna Preferenza?</Typography>
              <Typography variant="body1" color="text.secondary">
                Lascia che sia il nostro staff ad assegnarti il primo specialista disponibile per ridurre i tempi di attesa.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              size="large"
              endIcon={<CalendarMonthIcon />}
              sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 700, bgcolor: '#00B4D8', boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)' }}
            >
              Prenota al Primo Disponibile
            </Button>
          </Paper>
        )}

        {/* GRIGLIA MEDICI */}
        {list.length === 0 ? (
          <Alert severity="warning" sx={{ borderRadius: 2 }}>Non ci sono medici disponibili al momento.</Alert>
        ) : (
          <Grid container spacing={4}>
            {list.map((doctor, index) => {
              const name = getDoctorName(doctor);
              const surname = getDoctorSurname(doctor);
              const email = getDoctorEmail(doctor);
              const spec = getDoctorSpecialization(doctor);
              const image = doctorImages[index % doctorImages.length];

              return (
                <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                  <Card 
                    sx={{ 
                      height: '100%', display: 'flex', flexDirection: 'column', 
                      borderRadius: 4, border: '1px solid #E3F2FD',
                      transition: 'all 0.3s', overflow: 'hidden', bgcolor: '#fff',
                      '&:hover': { 
                        transform: 'translateY(-8px)', 
                        boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
                        borderColor: 'transparent'
                      }
                    }}
                  >
                    {/* Immagine con Overlay Sfumato */}
                    <Box sx={{ position: 'relative', height: 260, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        image={image}
                        alt={`Dr. ${name}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        className="doctor-img"
                      />
                      <Box sx={{ 
                        position: 'absolute', bottom: 0, left: 0, right: 0, 
                        background: 'linear-gradient(to top, rgba(0,30,60,0.8) 0%, transparent 100%)', 
                        p: 3, pt: 8 
                      }}>
                        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                          Dr. {name} {surname}
                        </Typography>
                        <Chip 
                          label={spec} 
                          size="small" 
                          icon={<VerifiedUserIcon sx={{fontSize: '14px !important'}} />}
                          sx={{ 
                            bgcolor: 'rgba(255,255,255,0.9)', 
                            color: '#0077B6', 
                            fontWeight: 700, 
                            height: 24, 
                            mt: 0.5 
                          }} 
                        />
                      </Box>
                    </Box>

                    {/* Contenuto */}
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, p: 1.5, bgcolor: '#F1F8E9', borderRadius: 2, color: '#33691E' }}>
                        <VerifiedUserIcon fontSize="small" />
                        <Typography variant="caption" fontWeight={700}>SPECIALISTA CERTIFICATO</Typography>
                      </Box>

                      <Tooltip title={email} arrow placement="top">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#546E7A' }}>
                          <EmailIcon fontSize="small" sx={{ color: '#90A4AE' }} />
                          <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                            {email}
                          </Typography>
                        </Box>
                      </Tooltip>
                    </CardContent>

                    {/* Azione */}
                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        size="large"
                        onClick={() => handleSelectDoctor(doctor)}
                        sx={{ 
                          borderRadius: 3, fontWeight: 700, py: 1.5,
                          background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                          boxShadow: '0 4px 12px rgba(0, 180, 216, 0.2)',
                          '&:hover': { background: 'linear-gradient(135deg, #0096C7 0%, #0077A8 100%)' }
                        }}
                      >
                        Prenota Visita
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DoctorsList;