// Token type for tokenization visualization
export interface Token {
  id: number;
  text: string;
  value: number;
}

// Embedding type for visualization
export interface Embedding {
  token: string;
  vector: number[];
}

// Attention type for visualization
export interface AttentionData {
  layer: number;
  head: number;
  weights: number[][];
} 