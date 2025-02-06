import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL, // <--- Aquí podría estar el error
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
