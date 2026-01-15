import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Icona dente stilizzata
const ToothIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C9.5,2 7.5,3.5 6.5,5.5C5.5,7.5 5,10 5,12C5,14.5 5.5,16.5 6.5,18C7,18.75 7.5,19.25 8,19.5C8.5,19.75 8.75,19.75 9,19.75C9.5,19.75 10,19.5 10.5,19C11,18.5 11.5,17.5 12,16C12.5,17.5 13,18.5 13.5,19C14,19.5 14.5,19.75 15,19.75C15.25,19.75 15.5,19.75 16,19.5C16.5,19.25 17,18.75 17.5,18C18.5,16.5 19,14.5 19,12C19,10 18.5,7.5 17.5,5.5C16.5,3.5 14.5,2 12,2M12,4C13.5,4 15,5 15.5,6.5C16,8 16.5,10 16.5,12C16.5,13.5 16.25,15 15.75,16C15.5,16.5 15.25,16.75 15,17C15,17 14.75,17 14.5,16.75C14.25,16.5 14,16 13.5,15C13,14 12.5,12.5 12,11C11.5,12.5 11,14 10.5,15C10,16 9.75,16.5 9.5,16.75C9.25,17 9,17 9,17C8.75,16.75 8.5,16.5 8.25,16C7.75,15 7.5,13.5 7.5,12C7.5,10 8,8 8.5,6.5C9,5 10.5,4 12,4Z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #00B4D8 0%, #0096C7 100%)',
        color: '#ffffff',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                }}
              >
                <ToothIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  SmileCare
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Studio Dentistico
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.8 }}>
              Il tuo sorriso è la nostra missione. Da oltre 15 anni offriamo 
              cure dentali di alta qualità con tecnologie all'avanguardia e un 
              team di specialisti dedicati.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                sx={{
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                    transform: 'translateY(-3px)',
                  },
                  transition: 'all 0.2s',
                }}
              >
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Link Rapidi
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Link
                href="/"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  opacity: 0.9,
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(5px)',
                  },
                }}
              >
                Home
              </Link>
              <Link
                href="/doctors"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  opacity: 0.9,
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(5px)',
                  },
                }}
              >
                I Nostri Medici
              </Link>
              <Link
                href="/my-appointments"
                sx={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  opacity: 0.9,
                  transition: 'all 0.2s',
                  '&:hover': {
                    opacity: 1,
                    transform: 'translateX(5px)',
                  },
                }}
              >
                Appuntamenti
              </Link>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Servizi
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                • Odontoiatria Generale
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                • Ortodonzia
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                • Implantologia
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                • Estetica Dentale
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                • Igiene Professionale
              </Typography>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Contatti
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationOnIcon sx={{ fontSize: 20, mt: 0.5, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Via Roma 123<br />
                  00100 Roma, Italia
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +39 06 1234 5678
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  info@smilecare.it
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 3,
                p: 2,
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Orari di Apertura
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Lun - Ven: 09:00 - 19:00<br />
                Sabato: 09:00 - 13:00
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            mt: 6,
            pt: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {currentYear} SmileCare Studio Dentistico. Tutti i diritti riservati.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link
              href="#"
              sx={{
                color: '#ffffff',
                textDecoration: 'none',
                opacity: 0.9,
                fontSize: '0.875rem',
                '&:hover': { opacity: 1 },
              }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              sx={{
                color: '#ffffff',
                textDecoration: 'none',
                opacity: 0.9,
                fontSize: '0.875rem',
                '&:hover': { opacity: 1 },
              }}
            >
              Termini di Servizio
            </Link>
            <Link
              href="#"
              sx={{
                color: '#ffffff',
                textDecoration: 'none',
                opacity: 0.9,
                fontSize: '0.875rem',
                '&:hover': { opacity: 1 },
              }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;