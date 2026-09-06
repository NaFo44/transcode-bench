import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  root: 'web',
  base: command === 'build' ? '/transcode-bench/': '/',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
}));
