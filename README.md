# Interactive LLM Visualizer

An interactive Vite React application for visualizing LLM processes such as tokenization, embeddings, and attention mechanisms.

## Features

- Tokenization visualization with highlighted subwords
- Interactive 3D embeddings visualization
- Attention mechanism visualization with heatmaps
- Nearest neighbor retrieval and similarity scoring

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **UI Components**: Tailwind CSS + shadcn/ui
- **Visualizations**: D3.js (2D) and Three.js (3D)
- **Model Interaction**: TensorFlow.js and Hugging Face Tokenizers

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd llmvite
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run format` - Format code using Prettier
- `npm test` - Run Jest tests
- `npm run test:watch` - Run Jest in watch mode
- `npm run test:e2e` - Run end-to-end tests with Playwright

## Project Structure

```
llmvite/
├── src/
│   ├── components/    # React components
│   │   └── ui/        # UI components from shadcn/ui
│   ├── lib/           # Utility functions and helpers
│   └── types/         # TypeScript type definitions
├── tests/             # End-to-end tests with Playwright
└── ...
```

## License

MIT
