import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: 'assets',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        global: path.resolve(__dirname, 'src/scripts/global.js'),
        design: path.resolve(__dirname, 'src/scripts/design.js'),
        'b2b-theme-editor': path.resolve(__dirname, 'src/scripts/b2b-theme-editor.js'),
        tailwind: path.resolve(__dirname, 'src/styles/tailwind.css')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name][extname]'
      }
    },
    manifest: false,
    minify: 'terser',
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@scripts': path.resolve(__dirname, 'src/scripts'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@components': path.resolve(__dirname, 'src/scripts/components'),
      '@sections': path.resolve(__dirname, 'src/scripts/sections'),
      '@assets': path.resolve(__dirname, 'assets')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    },
    fs: {
      allow: ['.', path.resolve(__dirname, 'assets')]
    }
  }
});
