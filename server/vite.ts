import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'client'), // Set the root to the client folder
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Output build to top-level dist folder
    emptyOutDir: true, // Clean the dist folder before each build
  },
  server: {
    port: 5173, // Optional: dev server port
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'), // Optional: alias for cleaner imports
    },
  },
});
