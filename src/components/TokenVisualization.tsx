import { useState, useEffect } from 'react';
import { Token } from '@/types';
import { tokenizeText } from '@/lib/tokenizer';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  IconButton, 
  Tooltip, 
  Alert, 
  AlertTitle, 
  Grid, 
  Paper,
  Popover,
  Divider,
  Chip
} from '@mui/material';
import { 
  Info as InfoIcon, 
  ContentCopy as CopyIcon, 
  CheckCircle as CheckIcon,
  Numbers as NumbersIcon
} from '@mui/icons-material';

interface TokenVisualizationProps {
  text: string;
  onTokenizationComplete: () => void;
  onTokenizationStart: () => void;
}

export default function TokenVisualization({ 
  text, 
  onTokenizationComplete,
  onTokenizationStart
}: TokenVisualizationProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [copied, setCopied] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverToken, setPopoverToken] = useState<Token | null>(null);
  const [showTokenIds, setShowTokenIds] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    const processTokenization = async () => {
      try {
        onTokenizationStart();
        const tokenizedResult = await tokenizeText(text);
        setTokens(tokenizedResult);
        setTokenCount(tokenizedResult.length);
        onTokenizationComplete();
      } catch (error) {
        console.error('Error tokenizing text:', error);
        onTokenizationComplete();
      }
    };

    processTokenization();
  }, [text, onTokenizationComplete, onTokenizationStart]);

  // OpenAI-like color palette
  const getTokenColor = (index: number) => {
    const colors = [
      '#FFF8E1', // Amber 50
      '#E3F2FD', // Blue 50
      '#F3E5F5', // Purple 50
      '#E8F5E9', // Green 50
      '#FFEBEE', // Red 50
      '#E0F7FA', // Cyan 50
      '#FFF3E0', // Orange 50
      '#F1F8E9', // Light Green 50
      '#E8EAF6', // Indigo 50
      '#FCE4EC'  // Pink 50
    ];
    
    return colors[index % colors.length];
  };

  const getTextColor = (index: number) => {
    const colors = [
      '#F57F17', // Amber 900
      '#0D47A1', // Blue 900
      '#4A148C', // Purple 900
      '#1B5E20', // Green 900
      '#B71C1C', // Red 900
      '#006064', // Cyan 900
      '#E65100', // Orange 900
      '#33691E', // Light Green 900
      '#1A237E', // Indigo 900
      '#880E4F'  // Pink 900
    ];
    
    return colors[index % colors.length];
  };

  const copyTokensToClipboard = () => {
    const tokenIds = tokens.map(t => t.id).join(', ');
    navigator.clipboard.writeText(tokenIds);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTokenIds = () => {
    setShowTokenIds(!showTokenIds);
  };

  const handleTokenClick = (token: Token) => {
    setSelectedToken(selectedToken?.id === token.id ? null : token);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, token: Token) => {
    setAnchorEl(event.currentTarget);
    setPopoverToken(token);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverToken(null);
  };

  const open = Boolean(anchorEl);

  // Safe Array.from helper function
  const safeArrayFrom = (text: string | undefined | null) => {
    if (!text) return [];
    return Array.from(text);
  };

  // Format bytes for display
  const formatBytes = (text: string | undefined | null) => {
    if (!text) return '(none)';
    return safeArrayFrom(text)
      .map(char => char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
  };

  if (!tokens.length) {
    return null;
  }

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Tokenization Result</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={showTokenIds ? "Hide token IDs" : "Show token IDs"}>
                <IconButton 
                  size="small" 
                  onClick={toggleTokenIds}
                  color={showTokenIds ? "primary" : "default"}
                >
                  <NumbersIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={copied ? "Copied!" : "Copy token IDs"}>
                <IconButton size="small" onClick={copyTokensToClipboard}>
                  {copied ? <CheckIcon fontSize="small" color="success" /> : <CopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Text broken into tokens using the tiktoken library (cl100k_base encoding)
            </Typography>
            <Chip 
              label={`${tokenCount} tokens`} 
              size="small" 
              sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
              color="primary"
              variant="outlined"
            />
          </Box>
        }
      />
      
      <Divider />
      
      <CardContent>
        {/* OpenAI-like token visualization */}
        <Box sx={{ 
          p: 2, 
          borderRadius: 1, 
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          lineHeight: 2.2,
          fontFamily: 'monospace',
          fontSize: '1rem'
        }}>
          {tokens.map((token, index) => (
            <Box
              key={`${token.id}-${index}`}
              component="span"
              sx={{
                display: 'inline-block',
                bgcolor: getTokenColor(index),
                color: getTextColor(index),
                px: 0.5,
                py: 0.25,
                borderRadius: 0.5,
                m: 0.25,
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 2,
                },
                ...(selectedToken?.id === token.id && {
                  outline: '2px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '2px'
                })
              }}
              onClick={() => handleTokenClick(token)}
              onMouseEnter={(e) => handlePopoverOpen(e, token)}
              onMouseLeave={handlePopoverClose}
            >
              {token.text || '␣'}
              {showTokenIds && (
                <Typography 
                  component="span" 
                  sx={{ 
                    position: 'absolute', 
                    top: -14, 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    fontSize: '0.6rem',
                    bgcolor: 'background.paper',
                    px: 0.5,
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  {token.id}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        <Popover
          sx={{ pointerEvents: 'none' }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          {popoverToken && (
            <Paper sx={{ p: 2, maxWidth: 300 }}>
              <Typography variant="subtitle2" gutterBottom>Token Details</Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Text:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" fontFamily="monospace">{popoverToken.text || '(space)'}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">ID:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" fontFamily="monospace">{popoverToken.id}</Typography>
                </Grid>
                
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">Unicode:</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2" fontFamily="monospace">
                    {safeArrayFrom(popoverToken.text).map(char => 
                      `U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`
                    ).join(' ') || '(none)'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Popover>
        
        {selectedToken && (
          <Alert 
            severity="info" 
            icon={<InfoIcon fontSize="inherit" />}
            sx={{ mt: 2 }}
          >
            <AlertTitle>
              Selected Token: <Box component="span" sx={{ fontFamily: 'monospace' }}>{selectedToken.text || '(space)'}</Box>
            </AlertTitle>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item xs={3} sm={2}>
                <Typography variant="body2" fontWeight="medium">Token ID:</Typography>
              </Grid>
              <Grid item xs={9} sm={10}>
                <Typography variant="body2" fontFamily="monospace">
                  {selectedToken.id}
                </Typography>
              </Grid>
              
              <Grid item xs={3} sm={2}>
                <Typography variant="body2" fontWeight="medium">Bytes:</Typography>
              </Grid>
              <Grid item xs={9} sm={10}>
                <Typography variant="body2" fontFamily="monospace">
                  {formatBytes(selectedToken.text)}
                </Typography>
              </Grid>
            </Grid>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 