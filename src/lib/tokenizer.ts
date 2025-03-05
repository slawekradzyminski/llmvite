import { get_encoding, encoding_for_model } from 'tiktoken';
import { Token } from '@/types';

// Define token mappings for common tokens to improve visualization
const TOKEN_DISPLAY_MAP: Record<string, string> = {
  ' ': '·', // Space
  '\n': '↵', // Newline
  '\t': '→', // Tab
  '': '␣', // Empty string
};

// Special token IDs and their display text
const SPECIAL_TOKENS: Record<number, string> = {
  100257: '<|endoftext|>',
  100258: '<|fim_prefix|>',
  100259: '<|fim_middle|>',
  100260: '<|fim_suffix|>',
  100276: '<|endofprompt|>',
};

// Singleton tokenizer instance
let tokenizer: any = null;

/**
 * Load the tokenizer (singleton pattern)
 */
export const loadTokenizer = async () => {
  if (tokenizer) {
    return tokenizer;
  }
  
  try {
    // First try to load the GPT-4 tokenizer
    tokenizer = encoding_for_model('gpt-4');
    console.log('Loaded GPT-4 tokenizer');
  } catch (error) {
    console.warn('Failed to load GPT-4 tokenizer, falling back to cl100k_base');
    // Fall back to cl100k_base (used by GPT-3.5 and GPT-4)
    tokenizer = get_encoding('cl100k_base');
    console.log('Loaded cl100k_base tokenizer');
  }
  
  return tokenizer;
};

/**
 * Get the display text for a token ID
 */
export const getTokenText = (tokenizer: any, id: number): string => {
  // Check for special tokens first
  if (id in SPECIAL_TOKENS) {
    return SPECIAL_TOKENS[id];
  }
  
  try {
    // Decode the token to bytes
    const bytes = tokenizer.decode([id]);
    
    // Convert bytes to string
    const text = new TextDecoder().decode(bytes);
    
    // Use the display mapping if available
    return TOKEN_DISPLAY_MAP[text] || text;
  } catch (error) {
    console.error(`Error decoding token ${id}:`, error);
    return `[${id}]`;
  }
};

/**
 * Tokenize text into an array of Token objects
 */
export const tokenizeText = async (text: string): Promise<Token[]> => {
  if (!text) {
    return [];
  }
  
  try {
    // Load the tokenizer
    const enc = await loadTokenizer();
    
    // Encode the text to get token IDs
    const ids = enc.encode(text);
    console.log('Raw token IDs:', ids);
    
    // Convert to regular array and map to Token objects
    return Array.from(ids).map((id: number) => {
      const tokenText = getTokenText(enc, id);
      return {
        id,
        text: tokenText,
        value: id
      };
    });
  } catch (error) {
    console.error('Tokenization error:', error);
    
    // Return a single error token
    return [{
      id: -1,
      text: `Error: ${error.message}`,
      value: -1
    }];
  }
}; 