import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps the production build portable — it can be served
// from any static server or sub-path without configuration changes.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173 },
});
