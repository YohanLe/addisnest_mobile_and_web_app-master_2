import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: 5174,
    strictPort: false,
    hmr: {
      port: 5174,
      host: 'localhost',
      protocol: 'ws'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:7002', // Your backend server address
        changeOrigin: true,
        secure: false,
        // Don't rewrite the path - keep /api prefix for backend
      },
      '/auth': {
        target: 'http://localhost:7002', // Your backend server address
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/users': {
        target: 'http://localhost:7002', // Your backend server address
        changeOrigin: true,
        secure: false,
      },
      '/properties': {
        target: 'http://localhost:7002', // Your backend server address
        changeOrigin: true,
        secure: false,
      },
    },
  },
  base: '/'
});
