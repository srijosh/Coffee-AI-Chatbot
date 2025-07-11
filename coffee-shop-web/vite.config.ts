import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import tailwindcss from '@tailwindcss/vite';

    export default defineConfig({
      plugins: [react(), tailwindcss()],
      preview: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: ['coffee-frontend-7tgb.onrender.com'],
      },
    });