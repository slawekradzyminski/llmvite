import TokenizerPage from './components/TokenizerPage';
import { Container, AppBar, Toolbar, Typography, Box, Paper } from '@mui/material';
import { Psychology } from '@mui/icons-material';

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Psychology sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LLM Visualizer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
          <TokenizerPage />
        </Paper>
      </Container>
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            LLM Visualizer - Explore how language models process text
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default App;
