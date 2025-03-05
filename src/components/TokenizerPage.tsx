import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  CardHeader, 
  Paper
} from '@mui/material';
import TokenizerInput from './TokenizerInput';
import TokenVisualization from './TokenVisualization';

export default function TokenizerPage() {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleTokenize = (text: string) => {
    setInputText(text);
  };

  const handleTokenizationStart = () => {
    setIsProcessing(true);
  };

  const handleTokenizationComplete = () => {
    setIsProcessing(false);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tokenization Visualizer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Explore how language models process text by breaking it down into tokens. 
          This tool uses OpenAI's tiktoken library to demonstrate the tokenization process.
        </Typography>
      </Box>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="fullWidth" 
            aria-label="LLM visualization tabs"
          >
            <Tab label="Tokenization" />
            <Tab label="Embeddings" disabled />
            <Tab label="Attention" disabled />
          </Tabs>
        </Box>
        
        {tabValue === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TokenizerInput 
              onSubmit={handleTokenize} 
              isProcessing={isProcessing} 
            />
            
            <TokenVisualization 
              text={inputText} 
              onTokenizationStart={handleTokenizationStart}
              onTokenizationComplete={handleTokenizationComplete}
            />
            
            <Card variant="outlined">
              <CardHeader 
                title="About Tokenization" 
                subheader="How language models process text"
              />
              <CardContent>
                <Typography variant="body2">
                  Language models like GPT-4 don't process text character by character or word by word. 
                  Instead, they break text into "tokens" - small chunks that might be words, parts of words, 
                  or individual characters depending on how common they are.
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  This visualization uses OpenAI's <code>tiktoken</code> library, the same tokenizer used by 
                  models like GPT-3.5 and GPT-4. The cl100k_base encoding (used by GPT-4) typically processes 
                  English text at a rate of about 0.7 tokens per word.
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Understanding tokenization helps you:
                </Typography>
                
                <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                  <li>
                    <Typography variant="body2">
                      - Optimize your prompts to use fewer tokens (saving costs)
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      - Understand why models sometimes split words in unexpected ways
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      - Better estimate how much text you can fit within token limits
                    </Typography>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Embeddings Visualization</Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              This feature will allow you to visualize text embeddings and semantic relationships.
              Coming soon.
            </Typography>
          </Paper>
        )}
        
        {tabValue === 2 && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6">Attention Visualization</Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              This feature will allow you to visualize attention patterns in transformer models.
              Coming soon.
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
} 