import { Container, Typography, Paper, Box } from '@mui/material';

const DoctorDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Medico
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">
          Benvenuto nella tua dashboard!
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Questa sezione verrà completata nei prossimi giorni con:
          </Typography>
          <ul>
            <li>Visualizzazione appuntamenti personali</li>
            <li>Panoramica appuntamenti altri medici</li>
            <li>Statistiche e analytics</li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
};

export default DoctorDashboard;