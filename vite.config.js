import { defineConfig } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { glob } from 'glob';
import liveReload from 'vite-plugin-live-reload';

function moveOutputPlugin() {
  return {
    name: 'move-output',
    enforce: 'post',
    apply: 'build',
    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (fileName.startsWith('pages/')) {
          const newFileName = fileName.slice('pages/'.length);
          bundle[fileName].fileName = newFileName;
        }
      }
    },
  };
}

// Function to generate the version string (timestamp in this case)
function generateVersion() {
  const now = new Date();
  const timestamp = now.getTime();
  return `v=${timestamp}`;
}

const version = generateVersion();

function htmlVersioningPlugin() {
  return {
    name: 'html-versioning',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(/(\.js|\.css)"/g, `$1?${version}"`);
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [
    liveReload(['./layout/**/*.ejs', './pages/**/*.ejs', './pages/**/*.html']),
    ViteEjsPlugin(),
    moveOutputPlugin(),
    htmlVersioningPlugin(),
  ],
  server: {
    open: 'pages/index.html',
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync('pages/**/*.html')
          .map((file) => [
            path.relative('pages', file.slice(0, file.length - path.extname(file).length)),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        entryFileNames: 'assets/images/[name].js',
        chunkFileNames: 'assets/images/[name].js',
        assetFileNames: 'assets/images/[name][extname]',
      },
    },
    outDir: 'dist',
  },
});
