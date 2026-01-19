import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import VerifiedIcon from '@mui/icons-material/Verified';
import StarIcon from '@mui/icons-material/Star';

const Home = () => {
  const navigate = useNavigate();
  // Recuperiamo lo stato dell'autenticazione per decidere cosa far fare al bottone
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=1200&h=600&fit=crop',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Funzione che gestisce il click sul bottone principale
  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === 'ROLE_ADMIN') {
        // Se è medico, va alla dashboard
        navigate('/doctor-dashboard');
      } else {
        // Se è paziente (o utente generico), va al PROFILO come richiesto
        navigate('/profile');
      }
    } else {
      // Se non è loggato, va alla registrazione
      navigate('/register');
    }
  };

  const features = [
    {
      icon: <CalendarMonthIcon sx={{ fontSize: 48 }} />,
      title: 'Prenotazioni Online',
      description: 'Prenota il tuo appuntamento in pochi clic, 24 ore su 24.',
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 48 }} />,
      title: 'Orari Flessibili',
      description: 'Scegli tra una vasta gamma di orari disponibili per le tue esigenze.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 48 }} />,
      title: 'Sicurezza Garantita',
      description: 'I tuoi dati sono protetti con i più alti standard di sicurezza.',
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 48 }} />,
      title: 'Supporto Dedicato',
      description: 'Il nostro team è sempre disponibile per aiutarti.',
    },
  ];

  const stats = [
    { number: '15+', label: 'Anni di Esperienza', icon: <VerifiedIcon /> },
    { number: '10K+', label: 'Pazienti Soddisfatti', icon: <LocalHospitalIcon /> },
    { number: '5', label: 'Specialisti Certificati', icon: <StarIcon /> },
    { number: '98%', label: 'Tasso di Soddisfazione', icon: <StarIcon /> },
  ];

  return (
    <Box>
      {/* --- HERO SECTION --- */}
      <Box
        sx={{
          position: 'relative',
          height: '650px',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
        }}
      >
        {/* Carousel Images */}
        {carouselImages.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlide === index ? 0.25 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />
        ))}

        {/* Overlay Content */}
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <Box sx={{ maxWidth: 700, color: 'white' }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem' },
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
              }}
            >
              SmileCare Studio
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 4,
                fontWeight: 400,
                lineHeight: 1.6,
                textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
              }}
            >
              Professionalità, Tecnologia e Cura per il tuo sorriso. 
              Prenota online la tua visita con i nostri specialisti certificati.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {/* TASTO PRINCIPALE - Porta al Profilo se loggato */}
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  background: '#ffffff',
                  color: '#00B4D8',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  '&:hover': {
                    background: '#F0F9FF',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
                  },
                }}
              >
                {isAuthenticated ? 'Vai al Tuo Profilo' : 'Inizia Ora'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/doctors')}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  borderColor: '#ffffff',
                  color: '#ffffff',
                  borderWidth: 2,
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 2,
                  },
                }}
              >
                Scopri i Nostri Medici
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Carousel Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1.5,
            zIndex: 3,
          }}
        >
          {carouselImages.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: currentSlide === index ? 40 : 12,
                height: 12,
                borderRadius: 6,
                background: currentSlide === index ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: '#ffffff',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* --- STATS SECTION --- */}
      <Box sx={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 2, color: '#00B4D8' }}>
                    {stat.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 800,
                      color: '#00B4D8',
                      lineHeight: 1,
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#666',
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', md: '1.1rem' },
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* --- FEATURES SECTION --- */}
      <Box sx={{ py: 10, background: '#ffffff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}
            >
              Perché Sceglierci
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Offriamo servizi all'avanguardia per garantire la migliore esperienza ai nostri pazienti
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="stretch" justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    textAlign: 'center',
                    p: 4,
                    height: '100%',
                    border: '2px solid #E0F7FA',
                    bgcolor: '#F0F9FF',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#00B4D8',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0, 180, 216, 0.2)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      minWidth: 100,
                      minHeight: 100,
                      margin: '0 auto 24px',
                      background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 8px 24px rgba(0, 180, 216, 0.3)',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#00B4D8' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* --- CTA SECTION --- */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
          py: 10,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
            Pronto per il Tuo Nuovo Sorriso?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, opacity: 0.95 }}>
            Prenota oggi stesso la tua visita e inizia il percorso verso un sorriso sano e splendente
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 6,
              py: 2.5,
              fontSize: '1.2rem',
              background: '#ffffff',
              color: '#00B4D8',
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              '&:hover': {
                background: '#F0F9FF',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.3)',
              },
            }}
          >
            {isAuthenticated ? 'Vai al Tuo Profilo' : 'Prenota Ora'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;