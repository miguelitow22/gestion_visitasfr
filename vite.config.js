import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_URL || "https://gestionvisitas-production.up.railway.app", // ✅ Backend en Railway
        changeOrigin: true,
        secure: process.env.NODE_ENV === "production", // ✅ Solo HTTPS en producción
        ws: true, // Habilita WebSockets si es necesario
      },
    },
    port: 3000, // ✅ Puerto estándar para desarrollo
    strictPort: true, // Evita que Vite cambie de puerto automáticamente
    open: true, // Abre automáticamente el navegador en desarrollo
  },
  build: {
    target: 'esnext', // ✅ Optimiza para navegadores modernos
    minify: 'terser', // Usa Terser para mejor compresión
    sourcemap: false, // ❌ Evita exponer el código fuente en producción
  },
  preview: {
    port: 5000, // ✅ Define puerto específico para vista previa de producción
  },
});
