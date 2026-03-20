import { defineConfig } from 'vite';

export default defineConfig({
  base: '/santino-frontend/',
  server: {
    port: 5173,
    host: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
  },
  css: {
    devSourcemap: false,
  },
});
