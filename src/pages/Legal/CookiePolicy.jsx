import { Container, Typography, Box, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Cookie } from 'lucide-react';

const CookiePolicy = () => {
  const cookieData = [
    {
      nome: 'session_token',
      tipo: 'Necessario',
      scopo: 'Gestione della sessione utente',
      durata: 'Sessione'
    },
    {
      nome: 'user_preferences',
      tipo: 'Funzionale',
      scopo: 'Salvataggio delle preferenze utente',
      durata: '1 anno'
    },
    {
      nome: '_ga',
      tipo: 'Analitico',
      scopo: 'Google Analytics - analisi traffico',
      durata: '2 anni'
    },
    {
      nome: '_gid',
      tipo: 'Analitico',
      scopo: 'Google Analytics - identificazione utente',
      durata: '24 ore'
    }
  ];

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
              <Cookie size={32} color="white" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0077B6' }}>
                Cookie Policy
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
                1. Cosa sono i Cookie
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Vengono utilizzati per far funzionare il sito in modo efficiente, migliorare l'esperienza dell'utente e fornire informazioni ai proprietari del sito.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                2. Come utilizziamo i Cookie
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                SmileCare utilizza cookie per diversi scopi:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1">Garantire il corretto funzionamento del sito</Typography></li>
                <li><Typography variant="body1">Ricordare le tue preferenze e impostazioni</Typography></li>
                <li><Typography variant="body1">Mantenere attiva la tua sessione di login</Typography></li>
                <li><Typography variant="body1">Analizzare come utilizzi il sito per migliorare i nostri servizi</Typography></li>
                <li><Typography variant="body1">Personalizzare la tua esperienza</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                3. Tipologie di Cookie
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0077B6', mb: 1 }}>
                  Cookie Necessari
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  Questi cookie sono essenziali per il funzionamento del sito. Senza di essi, alcune funzionalità non potrebbero essere fornite. Includono cookie per la gestione della sessione e della sicurezza.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0077B6', mb: 1 }}>
                  Cookie Funzionali
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  Questi cookie permettono al sito di ricordare le scelte che fai (come il tuo nome utente o le preferenze di lingua) e fornire funzionalità migliorate e più personalizzate.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0077B6', mb: 1 }}>
                  Cookie Analitici
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  Questi cookie ci aiutano a capire come i visitatori interagiscono con il sito, raccogliendo e riportando informazioni in forma anonima. Utilizziamo questi dati per migliorare il funzionamento del sito.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0077B6', mb: 1 }}>
                  Cookie di Terze Parti
                </Typography>
                <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                  Alcuni cookie sono installati da servizi di terze parti che appaiono sulle nostre pagine, come Google Analytics per le statistiche di traffico e PayPal per i pagamenti.
                </Typography>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                4. Cookie utilizzati sul nostro sito
              </Typography>
              <TableContainer sx={{ 
                border: '1px solid rgba(0, 180, 216, 0.2)', 
                borderRadius: 2,
                mb: 3
              }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F0F9FF' }}>
                      <TableCell sx={{ fontWeight: 700, color: '#0077B6' }}>Nome</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0077B6' }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0077B6' }}>Scopo</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#0077B6' }}>Durata</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cookieData.map((cookie) => (
                      <TableRow key={cookie.nome} sx={{ '&:hover': { bgcolor: '#F0F9FF' } }}>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {cookie.nome}
                        </TableCell>
                        <TableCell>{cookie.tipo}</TableCell>
                        <TableCell>{cookie.scopo}</TableCell>
                        <TableCell>{cookie.durata}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                5. Cookie di Google Analytics
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Utilizziamo Google Analytics per analizzare l'utilizzo del nostro sito. Google Analytics genera informazioni statistiche e di altro tipo tramite cookie memorizzati sui computer degli utenti. Le informazioni generate relative al nostro sito web sono utilizzate per creare report sull'utilizzo del sito. Google conserverà e utilizzerà queste informazioni secondo la propria informativa sulla privacy.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                6. Cookie di PayPal
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Quando effettui un pagamento tramite PayPal, questo servizio può installare i propri cookie per gestire la transazione in modo sicuro. Questi cookie sono regolati dalla privacy policy di PayPal.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                7. Gestione dei Cookie
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Puoi controllare e/o eliminare i cookie come desideri. Puoi eliminare tutti i cookie già presenti sul tuo computer e puoi impostare la maggior parte dei browser per impedire che vengano installati.
              </Typography>
              
              <Box sx={{ 
                p: 3, 
                bgcolor: '#FFF9E6', 
                borderRadius: 2,
                border: '1px solid rgba(255, 193, 7, 0.3)',
                mb: 2
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#F57C00', mb: 1 }}>
                  ⚠️ Attenzione
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Se blocchi i cookie, alcune funzionalità del sito potrebbero non funzionare correttamente. In particolare, non sarai in grado di effettuare il login o prenotare appuntamenti.
                </Typography>
              </Box>

              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mt: 2 }}>
                Per gestire i cookie nel tuo browser:
              </Typography>
              <Box component="ul" sx={{ pl: 3, '& li': { mb: 1.5 } }}>
                <li><Typography variant="body1"><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti</Typography></li>
                <li><Typography variant="body1"><strong>Firefox:</strong> Opzioni → Privacy e sicurezza → Cookie e dati dei siti web</Typography></li>
                <li><Typography variant="body1"><strong>Safari:</strong> Preferenze → Privacy → Gestisci dati siti web</Typography></li>
                <li><Typography variant="body1"><strong>Edge:</strong> Impostazioni → Cookie e autorizzazioni sito → Cookie e dati archiviati</Typography></li>
              </Box>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                8. Il tuo Consenso
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Utilizzando il nostro sito, acconsenti all'utilizzo dei cookie in conformità con questa Cookie Policy. Se non accetti l'uso dei cookie, dovrai configurare il tuo browser di conseguenza o astenerti dall'utilizzare il sito.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                9. Modifiche alla Cookie Policy
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Possiamo aggiornare questa Cookie Policy periodicamente. Ti informeremo di eventuali modifiche significative pubblicando la nuova policy su questa pagina con una data di aggiornamento rivista.
              </Typography>
            </section>

            <section>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#00B4D8', mb: 2 }}>
                10. Ulteriori Informazioni
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                Per ulteriori informazioni sull'utilizzo dei cookie e sulla protezione dei tuoi dati personali, consulta la nostra Privacy Policy o contattaci:
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

export default CookiePolicy;