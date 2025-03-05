import { loadTokenizer, tokenizeText, getTokenText } from './tokenizer';
import { Token } from '@/types';

// Mock the tiktoken module
jest.mock('tiktoken', () => {
  // Define mock Unicode bytes for specific tokens
  const mockBytes = {
    101: new Uint8Array([91, 67, 76, 83, 93]), // "[CLS]"
    2023: new Uint8Array([72, 101, 108, 108, 111]), // "Hello"
    2003: new Uint8Array([32, 119, 111, 114, 108, 100]), // " world"
    1037: new Uint8Array([33]), // "!"
    102: new Uint8Array([91, 83, 69, 80, 93]), // "[SEP]"
    4937: new Uint8Array([63]), // Unknown token
  };

  // Mock tokenizer with encode and decode methods
  const mockTokenizer = {
    encode: jest.fn().mockImplementation((text) => {
      // Return a predefined array of token IDs for any input
      return [101, 2023, 2003, 1037, 4937, 102];
    }),
    decode: jest.fn().mockImplementation((ids) => {
      // Return the mock bytes for the first token ID
      const id = ids[0];
      return mockBytes[id] || new Uint8Array([63]); // Default to "?" for unknown tokens
    }),
  };

  return {
    get_encoding: jest.fn().mockReturnValue(mockTokenizer),
    encoding_for_model: jest.fn().mockReturnValue(mockTokenizer),
  };
});

// Add TextEncoder and TextDecoder polyfills for Node.js environment
beforeAll(() => {
  if (typeof TextEncoder === 'undefined') {
    // @ts-ignore
    global.TextEncoder = class TextEncoder {
      encode(str: string): Uint8Array {
        return new Uint8Array([...str].map(c => c.charCodeAt(0)));
      }
    };
  }

  if (typeof TextDecoder === 'undefined') {
    // @ts-ignore
    global.TextDecoder = class TextDecoder {
      decode(bytes: Uint8Array): string {
        // Map specific byte patterns to expected strings for our tests
        const bytesArray = Array.from(bytes);
        
        if (bytesArray.length === 5 && bytesArray[0] === 91 && bytesArray[1] === 67) return '[CLS]';
        if (bytesArray.length === 5 && bytesArray[0] === 72) return 'Hello';
        if (bytesArray.length === 6 && bytesArray[0] === 32) return ' world';
        if (bytesArray.length === 1 && bytesArray[0] === 33) return '!';
        if (bytesArray.length === 5 && bytesArray[0] === 91 && bytesArray[1] === 83) return '[SEP]';
        if (bytesArray.length === 1 && bytesArray[0] === 63) return '?';
        
        // Default case: convert bytes to string
        return String.fromCharCode(...bytesArray as number[]);
      }
    };
  }
});

describe('Tokenizer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loadTokenizer loads the tokenizer correctly', async () => {
    // when
    const tokenizer = await loadTokenizer();
    
    // then
    expect(tokenizer).toBeDefined();
    expect(require('tiktoken').encoding_for_model).toHaveBeenCalledWith('gpt-4');
  });

  it('tokenizeText returns correctly formatted tokens', async () => {
    // given
    const testText = 'Hello world!';

    // when
    const tokens = await tokenizeText(testText);
    
    // then
    expect(tokens).toHaveLength(6);
    expect(tokens[0]).toEqual({
      id: 101,
      text: '[CLS]',
      value: 101
    });
    expect(tokens[1]).toEqual({
      id: 2023,
      text: 'Hello',
      value: 2023
    });
  });

  it('getTokenText returns string representation of a token', async () => {
    // given
    const tokenizer = await loadTokenizer();
    const tokenId = 2023;
    
    // when
    const text = getTokenText(tokenizer, tokenId);
    
    // then
    expect(text).toBe('Hello');
  });
}); 