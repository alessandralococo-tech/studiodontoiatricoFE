import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F7FA 100%)',
      py: 8
    }}>
      <Container maxWidth="md">
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 4, 
            boxShadow: '0 10px 40px rgba(0, 180, 216, 0.15)',
            border: '1px solid rgba(255,255,255,0.8)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box sx={{ 
              width: 60, height: 60, 
              background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 4px 14px rgba(0, 180, 216, 0.3)'
            }}>
              <Shield size={32} color="white" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0077B6' }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ultimo aggiornamento: Gennaio 2026
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box sx={{ '& > *': { mb: 3 } }}>
            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                1. Introduzione
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                SmileCare Studio Dentistico ("noi", "nostro") rispetta la tua privacy e si impegna a proteggere i tuoi dati personali. Questa informativa sulla privacy ti informa su come trattiamo i tuoi dati personali quando visiti il nostro sito web e ti parla dei tuoi diritti sulla privacy.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                2. Dati che raccogliamo
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Raccogliamo e trattiamo le seguenti categorie di dati personali:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1"><strong>Dati identificativi:</strong> nome, cognome, data di nascita</Typography></li>
                <li><Typography variant="body1"><strong>Dati di contatto:</strong> indirizzo email, numero di telefono</Typography></li>
                <li><Typography variant="body1"><strong>Dati sanitari:</strong> informazioni relative agli appuntamenti e alle cure dentali</Typography></li>
                <li><Typography variant="body1"><strong>Dati di pagamento:</strong> informazioni necessarie per processare i pagamenti tramite PayPal</Typography></li>
                <li><Typography variant="body1"><strong>Dati tecnici:</strong> indirizzo IP, tipo di browser, dati di navigazione</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                3. Come utilizziamo i tuoi dati
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Utilizziamo i tuoi dati personali per:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Gestire la tua registrazione e il tuo account</Typography></li>
                <li><Typography variant="body1">Prenotare e gestire appuntamenti</Typography></li>
                <li><Typography variant="body1">Fornire servizi sanitari dentali</Typography></li>
                <li><Typography variant="body1">Processare pagamenti</Typography></li>
                <li><Typography variant="body1">Comunicare con te riguardo ai tuoi appuntamenti</Typography></li>
                <li><Typography variant="body1">Migliorare i nostri servizi</Typography></li>
                <li><Typography variant="body1">Rispettare obblighi legali e normativi</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                4. Base giuridica del trattamento
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Trattiamo i tuoi dati personali sulla base di:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1"><strong>Consenso:</strong> hai fornito il consenso esplicito al trattamento</Typography></li>
                <li><Typography variant="body1"><strong>Esecuzione contrattuale:</strong> necessario per fornire i servizi richiesti</Typography></li>
                <li><Typography variant="body1"><strong>Obblighi legali:</strong> richiesto dalla normativa vigente in ambito sanitario</Typography></li>
                <li><Typography variant="body1"><strong>Interesse legittimo:</strong> per migliorare i nostri servizi</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                5. Condivisione dei dati
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Non vendiamo i tuoi dati personali a terzi. Possiamo condividere i tuoi dati con:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Fornitori di servizi (es. PayPal per i pagamenti)</Typography></li>
                <li><Typography variant="body1">Autorità sanitarie quando richiesto dalla legge</Typography></li>
                <li><Typography variant="body1">Consulenti professionali e legali</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                6. Sicurezza dei dati
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Implementiamo misure tecniche e organizzative appropriate per proteggere i tuoi dati personali contro accesso non autorizzato, alterazione, divulgazione o distruzione. Tutti i dati sensibili sono crittografati e archiviati in modo sicuro.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                7. Conservazione dei dati
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Conserviamo i tuoi dati personali solo per il tempo necessario agli scopi per cui sono stati raccolti, inclusi eventuali obblighi legali, contabili o di reporting. I dati sanitari sono conservati per 10 anni come richiesto dalla normativa italiana.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                8. I tuoi diritti
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Hai diritto a:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Accedere ai tuoi dati personali</Typography></li>
                <li><Typography variant="body1">Rettificare dati inesatti</Typography></li>
                <li><Typography variant="body1">Cancellare i tuoi dati (diritto all'oblio)</Typography></li>
                <li><Typography variant="body1">Limitare il trattamento</Typography></li>
                <li><Typography variant="body1">Opporti al trattamento</Typography></li>
                <li><Typography variant="body1">Portabilità dei dati</Typography></li>
                <li><Typography variant="body1">Revocare il consenso in qualsiasi momento</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                9. Cookie e tecnologie simili
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza sul nostro sito. Per maggiori informazioni, consulta la nostra Cookie Policy.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                10. Modifiche a questa policy
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Potremmo aggiornare questa informativa sulla privacy periodicamente. Ti informeremo di eventuali modifiche significative pubblicando la nuova informativa su questa pagina e aggiornando la data di "Ultimo aggiornamento".
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                11. Contatti
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Per qualsiasi domanda riguardante questa informativa sulla privacy o per esercitare i tuoi diritti, contattaci:
              </Typography>
              <Box sx={{ 
                p: 3, 
                bgcolor: '#F0F9FF', 
                borderRadius: 2,
                border: '1px solid rgba(0, 180, 216, 0.2)'
              }}>
                <Typography variant="body1" sx={{ mb: 1 }}><strong>SmileCare Studio Dentistico</strong></Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>Via Roma 123, 00100 Roma, Italia</Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>Email: privacy@smilecare.it</Typography>
                <Typography variant="body1">Telefono: +39 06 1234 5678</Typography>
              </Box>
            </section>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;