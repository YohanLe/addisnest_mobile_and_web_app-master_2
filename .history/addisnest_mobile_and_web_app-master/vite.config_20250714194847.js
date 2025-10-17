import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: false, // Allow Vite to find an available port if 5175 is in use
    hmr: {
      port: 5175, // Use the same port for HMR
      host: 'localhost',
      protocol: 'ws'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: '/'
});
