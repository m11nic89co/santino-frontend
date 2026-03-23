import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync } from 'fs';

function copyDirPlugin(src, dest) {
  return {
    name: 'copy-legacy-scripts',
    closeBundle() {
      function copy(s, d) {
        mkdirSync(d, { recursive: true });
        for (const entry of readdirSync(s)) {
          const sp = resolve(s, entry);
          const dp = resolve(d, entry);
          if (statSync(sp).isDirectory()) copy(sp, dp);
          else copyFileSync(sp, dp);
        }
      }
      copy(src, dest);
    },
  };
}

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
  plugins: [
    copyDirPlugin('assets/js', 'dist/assets/js'),
    copyDirPlugin('assets/vendor', 'dist/assets/vendor'),
  ],
});
