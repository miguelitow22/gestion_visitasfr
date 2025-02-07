import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carga las variables de entorno correctamente
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || "https://gestionvisitas-production.up.railway.app", // ✅ Carga `VITE_API_URL` correctamente
          changeOrigin: true,
          secure: mode === "production", // ✅ Solo HTTPS en producción
          ws: true, // Habilita WebSockets si es necesario
        },
      },
      port: 3000, // ✅ Puerto estándar para desarrollo
      strictPort: true, // Evita que Vite cambie de puerto automáticamente
      open: true, // Abre automáticamente el navegador en desarrollo
    },
    build: {
      target: 'esnext', // ✅ Optimiza para navegadores modernos
      minify: 'esbuild', // Usa Terser para mejor compresión
      sourcemap: false, // ❌ Evita exponer el código fuente en producción
    },
    preview: {
      port: 5000, // ✅ Define puerto específico para vista previa de producción
    },
  };
});
