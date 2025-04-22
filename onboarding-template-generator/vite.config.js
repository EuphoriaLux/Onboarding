import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './src/manifest.json';
// import tailwindcss from '@tailwindcss/postcss'; // No longer needed for v3 via postcss.config
import autoprefixer from 'autoprefixer'; // Keep autoprefixer if needed by PostCSS config

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }), // Use crx plugin with imported manifest
  ],
  // base and publicDir are usually not needed with crx plugin
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // rollupOptions are often handled by crx plugin based on manifest
  },
  // css.postcss config in vite.config.js is often not needed
  // if postcss.config.mjs (or .js) exists. Let's remove it
  // to rely solely on postcss.config.mjs.
  // css: {
  //   postcss: {
  //     plugins: [
  //       // tailwindcss, // Removed import
  //       autoprefixer
  //     ]
  //   }
  // }
})
