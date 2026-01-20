import { useState } from 'react';
import { 
  Container, Typography, Box, Paper, TextField, Button, 
  Grid, Alert, Snackbar 
} from '@mui/material';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle 
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Il nome è obbligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }
    if (!formData.message.trim()) newErrors.message = 'Il messaggio è obbligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form inviato:', formData);
      setOpenSnackbar(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Telefono',
      content: '+39 06 1234 5678',
      subtitle: 'Lun-Ven: 09:00-19:00'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      content: 'info@smilecare.it',
      subtitle: 'Rispondiamo entro 24h'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Indirizzo',
      content: 'Via Roma 123',
      subtitle: '00100 Roma, Italia'
    },
    {
      icon: <Clock size={24} />,
      title: 'Orari',
      content: 'Lun-Ven: 09:00-19:00',
      subtitle: 'Sab: 09:00-13:00'
    }
  ];

  return (
    <main>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)',
        py: 6
      }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                color: '#0077B6', 
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Contattaci
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontSize: { xs: '1rem', md: '1.1rem' } }}>
              Siamo qui per aiutarti. Inviaci un messaggio e ti risponderemo al più presto!
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
            {/* Info Cards - Griglia 2x2 */}
            <Grid item xs={12} md={5} sx={{ maxWidth: { md: '500px' } }}>
              <Grid container spacing={2}>
                {contactInfo.map((info, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: 2,
                        border: '1px solid rgba(0, 180, 216, 0.2)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        transition: 'all 0.3s ease',
                        height: '100%',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0, 180, 216, 0.15)',
                          borderColor: '#00B4D8'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Box sx={{
                          width: 45,
                          height: 45,
                          borderRadius: 1.5,
                          background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          flexShrink: 0
                        }}>
                          {info.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            {info.title}
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: '#0077B6', mb: 0.5, wordBreak: 'break-word' }}>
                            {info.content}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {info.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Map placeholder */}
              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid rgba(0, 180, 216, 0.2)',
                  height: 250,
                  display: { xs: 'none', md: 'block' }
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <MapPin size={40} color="#00B4D8" />
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1
                    }}
                  >
                    Via Roma 123, Roma
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={7} sx={{ maxWidth: { md: '700px' } }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid rgba(0, 180, 216, 0.2)',
                  background: 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#0077B6', mb: 2.5 }}>
                  Invia un Messaggio
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Nome Completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            bgcolor: 'white'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            bgcolor: 'white'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Telefono (opzionale)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            bgcolor: 'white'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Oggetto (opzionale)"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            bgcolor: 'white'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Messaggio"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
                        required
                        multiline
                        rows={5}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 1.5,
                            bgcolor: 'white'
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    endIcon={<Send size={18} />}
                    sx={{
                      mt: 2.5,
                      py: 1.3,
                      borderRadius: 1.5,
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                      boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0096B8 0%, #005F96 100%)',
                        boxShadow: '0 6px 20px rgba(0, 180, 216, 0.4)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Invia Messaggio
                  </Button>

                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 2.5, 
                      borderRadius: 1.5,
                      border: '1px solid rgba(33, 150, 243, 0.2)'
                    }}
                  >
                    Ti risponderemo entro 24 ore lavorative. Per urgenze, chiamaci al +39 06 1234 5678
                  </Alert>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>

        {/* Success Snackbar */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ 
              width: '100%',
              borderRadius: 1.5,
              boxShadow: '0 4px 14px rgba(76, 175, 80, 0.25)'
            }}
            iconMapping={{
              success: <CheckCircle size={22} />
            }}
          >
            Messaggio inviato con successo! Ti risponderemo presto.
          </Alert>
        </Snackbar>
      </Box>
    </main>
  );
};

export default Contact;