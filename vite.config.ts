import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { analyzer } from 'vite-bundle-analyzer';
import { visualizer } from 'rollup-plugin-visualizer';
import dynamicImport from '@rollup/plugin-dynamic-import-vars';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: ([
    react(),
    // Dynamic imports plugin
    dynamicImport({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['node_modules/**'],
    }),
    // Compression plugins
    command === 'build' && viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false
    }),
    command === 'build' && viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false
    }),
    // Bundle analyzer - only include when ANALYZE=true
    mode === 'analyze' && analyzer({
      analyzerMode: 'server',
      analyzerPort: 8888,
      openAnalyzer: true
    }),
    // Rollup visualizer for bundle analysis
    command === 'build' && visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    }),
  ] as PluginOption[]).filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __DEV__: JSON.stringify(command === 'serve'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          router: ['react-router-dom'],
          utils: ['clsx', 'class-variance-authority']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: false, // Keep console logs for debugging production issues
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-accordion',
      'clsx',
      'class-variance-authority'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true
  }
}));
