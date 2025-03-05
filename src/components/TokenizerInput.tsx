import { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  Divider
} from '@mui/material';
import { 
  Send as SendIcon, 
  Clear as ClearIcon,
  AutoFixHigh as ExamplesIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

interface TokenizerInputProps {
  onSubmit: (text: string) => void;
  isProcessing: boolean;
}

// Example prompts that demonstrate interesting tokenization patterns
const EXAMPLE_PROMPTS = [
  {
    title: "Basic English",
    text: "The quick brown fox jumps over the lazy dog."
  },
  {
    title: "Special Tokens",
    text: "<|endoftext|> <|fim_prefix|> <|fim_middle|> <|fim_suffix|>"
  },
  {
    title: "Numbers & Symbols",
    text: "In 2023, the price was $1,234.56 with a 15% discount!"
  },
  {
    title: "Code Snippet",
    text: "function calculateTokens(text) {\n  return tokenizer.encode(text).length;\n}"
  },
  {
    title: "Multilingual",
    text: "English: Hello\nSpanish: Hola\nFrench: Bonjour\nJapanese: こんにちは\nChinese: 你好"
  },
  {
    title: "Whitespace & Formatting",
    text: "This   text   has   multiple   spaces   and\n\ntwo line breaks."
  }
];

export default function TokenizerInput({ onSubmit, isProcessing }: TokenizerInputProps) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Load last input from localStorage
  useEffect(() => {
    const savedText = localStorage.getItem('tokenizer_input');
    if (savedText) {
      setText(savedText);
    }
  }, []);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    // Save to localStorage
    localStorage.setItem('tokenizer_input', event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleClear = () => {
    setText('');
    localStorage.removeItem('tokenizer_input');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExamplesClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExampleClose = () => {
    setAnchorEl(null);
  };

  const handleExampleSelect = (exampleText: string) => {
    setText(exampleText);
    localStorage.setItem('tokenizer_input', exampleText);
    setAnchorEl(null);
    // Auto-submit the example
    onSubmit(exampleText);
  };

  const characterCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Input Text</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Example prompts">
              <IconButton 
                size="small" 
                onClick={handleExamplesClick}
                color={open ? "primary" : "default"}
              >
                <ExamplesIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleExampleClose}
              PaperProps={{
                sx: { maxWidth: '320px' }
              }}
            >
              {EXAMPLE_PROMPTS.map((example, index) => (
                <MenuItem 
                  key={index} 
                  onClick={() => handleExampleSelect(example.text)}
                  sx={{ 
                    whiteSpace: 'normal',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Typography variant="subtitle2">{example.title}</Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '100%',
                      alignSelf: 'stretch'
                    }}
                  >
                    {example.text.substring(0, 40)}{example.text.length > 40 ? '...' : ''}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
            <Tooltip title={copied ? "Copied!" : "Copy text"}>
              <IconButton 
                size="small" 
                onClick={handleCopy}
                disabled={!text}
              >
                {copied ? <CheckIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear text">
              <IconButton 
                size="small" 
                onClick={handleClear}
                disabled={!text}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            placeholder="Enter text to tokenize..."
            value={text}
            onChange={handleTextChange}
            disabled={isProcessing}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                label={`${characterCount} characters`} 
                size="small" 
                variant="outlined" 
                color="default"
              />
              <Chip 
                label={`~${wordCount} words`} 
                size="small" 
                variant="outlined" 
                color="default"
              />
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!text.trim() || isProcessing}
              endIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            >
              {isProcessing ? 'Processing...' : 'Tokenize'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
} 