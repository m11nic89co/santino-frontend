import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';

/** @param {string | undefined} raw */
function normalizeViteBase(raw) {
  const fallback = '/santino-frontend/';
  if (raw == null || String(raw).trim() === '') return fallback;
  let b = String(raw).trim();
  if (!b.startsWith('/')) b = `/${b}`;
  if (!b.endsWith('/')) b += '/';
  return b;
}

function copyDirPlugin(src, dest) {
  return {
    name: `copy-dir:${src}`,
    closeBundle() {
      if (!existsSync(src)) return;
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
  base: normalizeViteBase(process.env.VITE_BASE),
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
    copyDirPlugin('assets/js',     'dist/assets/js'),
    copyDirPlugin('assets/vendor', 'dist/assets/vendor'),
    copyDirPlugin('assets/img',    'dist/assets/img'),
    copyDirPlugin('assets/logos',  'dist/assets/logos'),
  ],
});
