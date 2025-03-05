// Simple test script for tiktoken
import { get_encoding, encoding_for_model } from 'tiktoken';

// Test text
const text = "In 2023, the price was $1,234.56 with a 15% discount!";

// Try model-specific encoding
try {
  console.log("Testing model-specific encoding for 'gpt-4'...");
  const enc = encoding_for_model('gpt-4');
  
  // Encode the text
  const tokens = enc.encode(text);
  console.log("Token IDs:", tokens);
  console.log("Token count:", tokens.length);
  
  // Decode each token individually
  console.log("\nDecoding each token:");
  tokens.forEach((id, i) => {
    const bytes = enc.decode([id]);
    const decoded = new TextDecoder().decode(bytes);
    console.log(`Token ${i+1}: ID=${id}, Text="${decoded}" (${bytes.length} bytes)`);
  });
  
  // Decode the entire sequence
  const decoded = enc.decode(tokens);
  console.log("\nFull decoded text:", new TextDecoder().decode(decoded));
  
} catch (error) {
  console.error("Error with model-specific encoding:", error);
  
  // Fall back to cl100k_base
  try {
    console.log("\nFalling back to 'cl100k_base' encoding...");
    const enc = get_encoding('cl100k_base');
    
    // Encode the text
    const tokens = enc.encode(text);
    console.log("Token IDs:", tokens);
    console.log("Token count:", tokens.length);
    
    // Decode each token individually
    console.log("\nDecoding each token:");
    tokens.forEach((id, i) => {
      const bytes = enc.decode([id]);
      const decoded = new TextDecoder().decode(bytes);
      console.log(`Token ${i+1}: ID=${id}, Text="${decoded}" (${bytes.length} bytes)`);
    });
    
    // Decode the entire sequence
    const decoded = enc.decode(tokens);
    console.log("\nFull decoded text:", new TextDecoder().decode(decoded));
    
  } catch (fallbackError) {
    console.error("Error with fallback encoding:", fallbackError);
  }
} 