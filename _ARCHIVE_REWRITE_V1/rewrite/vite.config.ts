import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    target: 'es2022',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (id.includes('node_modules/gsap')) return 'vendor-gsap';
          if (id.includes('node_modules/swiper')) return 'vendor-swiper';
          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  server: {
    port: 3002,
    strictPort: false,
  },
});
