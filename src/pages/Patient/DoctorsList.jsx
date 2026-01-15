import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Box,
  Paper,
  CardMedia,
  Tooltip,
} from '@mui/material';
import { fetchDoctorsRequest, selectDoctor } from '../../redux/slices/doctorSlice';
import LoadingSpinner from '../../components/LoadingSpinner';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import EmailIcon from '@mui/icons-material/Email';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const DoctorsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.doctors);

  const doctorImages = [
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=400&h=400&fit=crop',
  ];

  useEffect(() => {
    dispatch(fetchDoctorsRequest());
  }, [dispatch]);

  // --- FUNZIONI HELPER PER RECUPERARE I DATI DAL DB IN MODO SICURO ---
  // Queste funzioni controllano diverse varianti del nome della colonna
  // per adattarsi a come il backend potrebbe inviare i dati (snake_case o camelCase)

  const getDoctorName = (doctor) => {
    if (!doctor) return '';
    return doctor.firstName || doctor.first_name || doctor.name || 'Nome';
  };

  const getDoctorSurname = (doctor) => {
    if (!doctor) return '';
    return doctor.lastName || doctor.last_name || doctor.surname || 'Cognome';
  };

  const getDoctorEmail = (doctor) => {
    if (!doctor) return '';
    // Cerca 'email' (come nel tuo screenshot) o varianti comuni
    return doctor.email || doctor.mail || doctor.emailAddress || 'Email non disponibile';
  };

  const getDoctorSpecialization = (doctor) => {
    if (!doctor) return '';
    return doctor.specialization || doctor.speciality || 'Medico Generico';
  };
  // -------------------------------------------------------------------

  const handleSelectDoctor = (doctor) => {
    // Quando selezioniamo il dottore, passiamo i dati normalizzati
    // così nella pagina di prenotazione non avremo problemi
    const normalizedDoctor = {
      ...doctor,
      name: getDoctorName(doctor),
      surname: getDoctorSurname(doctor),
      email: getDoctorEmail(doctor),
      specialization: getDoctorSpecialization(doctor)
    };
    dispatch(selectDoctor(normalizedDoctor));
    navigate('/book-appointment');
  };

  const handleNoPreference = () => {
    if (list && list.length > 0) {
      const autoSelectedDoctor = list[0];
      
      dispatch(selectDoctor({
        id: autoSelectedDoctor.id,
        name: getDoctorName(autoSelectedDoctor),
        surname: getDoctorSurname(autoSelectedDoctor),
        specialization: getDoctorSpecialization(autoSelectedDoctor),
        email: getDoctorEmail(autoSelectedDoctor),
        isAutoSelected: true
      }));
      
      navigate('/book-appointment');
    } else {
      alert('Nessun medico disponibile al momento. Riprova più tardi.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)',
        py: 6
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0, 180, 216, 0.1)',
            background: '#ffffff'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
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
              <MedicalServicesIcon sx={{ fontSize: 40, color: '#ffffff' }} />
            </Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: '#00B4D8',
                mb: 2
              }}
            >
              I Nostri Specialisti
            </Typography>
            <Typography variant="h6" sx={{ color: '#48CAE4', fontWeight: 600 }}>
              Scegli il professionista più adatto alle tue esigenze
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 4,
                borderRadius: 2,
                border: '1px solid #d32f2f20'
              }}
            >
              {error}
            </Alert>
          )}

          {/* Opzione "Nessuna Preferenza" */}
          {list && list.length > 0 && (
            <Card 
              sx={{ 
                mb: 5,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0, 180, 216, 0.25)',
                border: '2px solid #00B4D8',
                overflow: 'visible',
              }}
            >
              <CardContent sx={{ py: 4, px: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HowToRegIcon sx={{ fontSize: 40 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 250 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      Nessuna Preferenza
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.95 }}>
                      Lascia che il nostro team assegni il medico disponibile più adatto
                    </Typography>
                  </Box>
                  <Button
                    size="large"
                    variant="contained"
                    onClick={handleNoPreference}
                    startIcon={<CalendarMonthIcon />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontWeight: 700,
                      background: '#ffffff',
                      color: '#00B4D8',
                      '&:hover': {
                        background: '#F0F9FF',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Continua
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Divider */}
          {list && list.length > 0 && (
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#00B4D8',
                }}
              >
                Oppure scegli un medico specifico
              </Typography>
            </Box>
          )}

          {/* Doctors Grid */}
          {list.length === 0 && !loading ? (
            <Alert 
              severity="warning" 
              sx={{ 
                borderRadius: 2,
                border: '2px solid #ff980020'
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Al momento non ci sono medici disponibili
              </Typography>
              <Typography variant="body2">
                Riprova più tardi o contatta la reception per assistenza.
              </Typography>
            </Alert>
          ) : (
            <Grid container spacing={4}>
              {list.map((doctor, index) => {
                // Usiamo le funzioni helper per estrarre i dati
                const docName = getDoctorName(doctor);
                const docSurname = getDoctorSurname(doctor);
                const docEmail = getDoctorEmail(doctor);
                const docSpecialization = getDoctorSpecialization(doctor);

                return (
                  <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        border: '2px solid #E0F7FA',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#00B4D8',
                          boxShadow: '0 12px 40px rgba(0, 180, 216, 0.2)',
                          transform: 'translateY(-8px)',
                          '& .doctor-image': {
                            transform: 'scale(1.1)',
                          },
                        },
                      }}
                    >
                      {/* Immagine Medico */}
                      <Box
                        sx={{
                          position: 'relative',
                          height: 280,
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                        }}
                      >
                        <CardMedia
                          className="doctor-image"
                          component="img"
                          image={doctorImages[index % doctorImages.length]}
                          alt={`Dr. ${docName} ${docSurname}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                            color: 'white',
                            p: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Dr. {docName} {docSurname}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        {/* Specializzazione */}
                        <Box 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            mb: 2,
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            background: '#F0F9FF',
                            border: '1px solid #E0F7FA',
                          }}
                        >
                          <MedicalServicesIcon sx={{ color: '#00B4D8', fontSize: 24 }} />
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#00B4D8',
                            }}
                          >
                            {docSpecialization}
                          </Typography>
                        </Box>

                        {/* Email Medico con Tooltip e Safe Access */}
                        <Tooltip title={docEmail} placement="top" arrow>
                          <Box 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              px: 2,
                              py: 1.5,
                              borderRadius: 2,
                              background: '#F0F9FF',
                              border: '1px solid #E0F7FA',
                              cursor: 'default'
                            }}
                          >
                            <EmailIcon sx={{ color: '#00B4D8', fontSize: 20 }} />
                            <Typography 
                              variant="body2"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: '#666',
                                width: '100%' 
                              }}
                            >
                              {docEmail}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </CardContent>

                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button
                          size="large"
                          variant="contained"
                          fullWidth
                          onClick={() => handleSelectDoctor(doctor)}
                          startIcon={<CalendarMonthIcon />}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #0096C7 0%, #0077A8 100%)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(0, 180, 216, 0.4)',
                            },
                            transition: 'all 0.2s',
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
        </Paper>
      </Container>
    </Box>
  );
};

export default DoctorsList;