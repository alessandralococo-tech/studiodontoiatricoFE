import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
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
              <FileText size={32} color="white" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0077B6' }}>
                Termini di Servizio
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
                1. Accettazione dei Termini
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Benvenuto su SmileCare. Utilizzando il nostro sito web e i nostri servizi, accetti di essere vincolato dai presenti Termini di Servizio. Se non accetti questi termini, ti preghiamo di non utilizzare i nostri servizi.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                2. Descrizione dei Servizi
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                SmileCare fornisce una piattaforma online per:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Prenotazione di appuntamenti dentistici online</Typography></li>
                <li><Typography variant="body1">Gestione del profilo paziente</Typography></li>
                <li><Typography variant="body1">Consultazione delle informazioni sui nostri medici e servizi</Typography></li>
                <li><Typography variant="body1">Pagamento online degli appuntamenti</Typography></li>
                <li><Typography variant="body1">Comunicazione con il nostro studio</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                3. Registrazione Account
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Per utilizzare alcuni servizi, devi creare un account. Ti impegni a:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Fornire informazioni accurate, complete e aggiornate</Typography></li>
                <li><Typography variant="body1">Mantenere riservate le credenziali del tuo account</Typography></li>
                <li><Typography variant="body1">Notificarci immediatamente di qualsiasi uso non autorizzato</Typography></li>
                <li><Typography variant="body1">Essere responsabile di tutte le attività sul tuo account</Typography></li>
                <li><Typography variant="body1">Avere almeno 18 anni o il consenso di un genitore/tutore</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                4. Prenotazione Appuntamenti
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                La prenotazione di un appuntamento attraverso la nostra piattaforma costituisce un impegno vincolante. Ti impegni a:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Presentarti all'orario prenotato o cancellare con almeno 24 ore di preavviso</Typography></li>
                <li><Typography variant="body1">Fornire informazioni mediche accurate e complete</Typography></li>
                <li><Typography variant="body1">Pagare il servizio secondo le modalità concordate</Typography></li>
                <li><Typography variant="body1">Rispettare le politiche di cancellazione e riprogrammazione</Typography></li>
              </Box>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mt: 2 }}>
                <strong>Politica di cancellazione:</strong> Le cancellazioni effettuate con meno di 24 ore di preavviso o il mancato arrivo (no-show) possono comportare l'addebito di una penale pari al 50% del costo dell'appuntamento.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                5. Pagamenti e Tariffe
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                I pagamenti vengono elaborati tramite PayPal. Accetti di:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Pagare tutti i servizi prenotati secondo le tariffe pubblicate</Typography></li>
                <li><Typography variant="body1">Fornire informazioni di pagamento valide e aggiornate</Typography></li>
                <li><Typography variant="body1">Rispettare i termini di PayPal per le transazioni</Typography></li>
                <li><Typography variant="body1">Non contestare addebiti legittimi</Typography></li>
              </Box>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mt: 2 }}>
                I prezzi possono essere modificati con preavviso. Le modifiche non influenzeranno gli appuntamenti già prenotati.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                6. Uso Accettabile
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Ti impegni a NON:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Utilizzare il servizio per scopi illegali o non autorizzati</Typography></li>
                <li><Typography variant="body1">Violare qualsiasi legge applicabile</Typography></li>
                <li><Typography variant="body1">Tentare di accedere a sistemi o dati non autorizzati</Typography></li>
                <li><Typography variant="body1">Interferire con il corretto funzionamento del servizio</Typography></li>
                <li><Typography variant="body1">Trasmettere virus, malware o codice dannoso</Typography></li>
                <li><Typography variant="body1">Impersonare altre persone o entità</Typography></li>
                <li><Typography variant="body1">Raccogliere dati di altri utenti senza consenso</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                7. Proprietà Intellettuale
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Tutti i contenuti presenti sul sito, inclusi testo, grafica, loghi, immagini, software e design, sono di proprietà di SmileCare o dei suoi licenzianti e sono protetti dalle leggi sul copyright. Non puoi riprodurre, distribuire o modificare questi contenuti senza autorizzazione scritta.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                8. Privacy e Protezione dei Dati
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Il trattamento dei tuoi dati personali è regolato dalla nostra Privacy Policy. Utilizzando i nostri servizi, acconsenti alla raccolta e al trattamento dei tuoi dati come descritto nella Privacy Policy.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                9. Limitazione di Responsabilità
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                SmileCare fornisce il servizio "così com'è" e "come disponibile". Non garantiamo che:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Il servizio sarà sempre disponibile, ininterrotto o privo di errori</Typography></li>
                <li><Typography variant="body1">I difetti saranno corretti immediatamente</Typography></li>
                <li><Typography variant="body1">Il servizio sia privo di virus o componenti dannosi</Typography></li>
              </Box>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mt: 2 }}>
                SmileCare non sarà responsabile per danni indiretti, consequenziali, speciali o punitivi derivanti dall'uso o dall'impossibilità di utilizzare il servizio.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                10. Esclusioni di Garanzia Medica
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Le informazioni fornite sul sito hanno scopo informativo generale e non sostituiscono una consulenza medica professionale. Non ci assumiamo responsabilità per diagnosi o trattamenti basati esclusivamente sulle informazioni del sito.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                11. Modifiche ai Termini
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Ci riserviamo il diritto di modificare questi Termini in qualsiasi momento. Le modifiche sostanziali saranno comunicate via email o tramite avviso sul sito. L'uso continuato del servizio dopo le modifiche costituisce accettazione dei nuovi termini.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                12. Risoluzione
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Possiamo sospendere o terminare il tuo accesso ai servizi in caso di violazione di questi Termini. Puoi chiudere il tuo account in qualsiasi momento contattandoci.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                13. Legge Applicabile
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Questi Termini sono regolati dalla legge italiana. Qualsiasi controversia sarà di competenza esclusiva del Foro di Roma.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                14. Contatti
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Per domande riguardanti questi Termini di Servizio, contattaci:
              </Typography>
              <Box sx={{ 
                p: 3, 
                bgcolor: '#F0F9FF', 
                borderRadius: 2,
                border: '1px solid rgba(0, 180, 216, 0.2)'
              }}>
                <Typography variant="body1" sx={{ mb: 1 }}><strong>SmileCare Studio Dentistico</strong></Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>Via Roma 123, 00100 Roma, Italia</Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>Email: info@smilecare.it</Typography>
                <Typography variant="body1">Telefono: +39 06 1234 5678</Typography>
              </Box>
            </section>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService;