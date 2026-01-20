import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Aggiorna lo stato per mostrare la UI di fallback al prossimo render
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puoi anche loggare l'errore in un servizio di reporting qui
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // UI di Fallback personalizzata
      return (
        <Container maxWidth="sm" sx={{ mt: 10, textAlign: 'center' }}>
          <Paper elevation={3} sx={{ p: 5, borderRadius: 4 }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold" color="text.primary">
              Ops! Qualcosa è andato storto.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Si è verificato un errore imprevisto durante il caricamento della pagina.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={this.handleReload}
              sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
            >
              Ricarica la Pagina
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;