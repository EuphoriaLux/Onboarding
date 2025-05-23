import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json';
import autoprefixer from 'autoprefixer';
import path from 'path'; // Import path module

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
  ],
  resolve: {
    alias: {
      '@contexts': path.resolve(__dirname, './src/contexts'),
      // Add other aliases if needed, mirroring tsconfig.json paths
      // '@features': path.resolve(__dirname, './src/features'),
      // '@services': path.resolve(__dirname, './src/services'),
      // '@types': path.resolve(__dirname, './src/types'),
      // '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
