import { defineConfig } from 'vite';

export default defineConfig({
  root: 'web',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
