import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL, // ← Usa `process.env` en lugar de `import.meta.env`
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
