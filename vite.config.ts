import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Uso de './' para compatibilidade máxima (APK + GitHub + Cloud)
    const base = './';
    
    return {
      base,
      plugins: [
        react()
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('firebase')) return 'vendor-firebase';
                if (id.includes('lucide-react')) return 'vendor-lucide';
                if (id.includes('react') || id.includes('scheduler') || id.includes('object-assign')) return 'vendor-core';
                if (id.includes('jspdf') || id.includes('html2canvas')) return 'vendor-pdf';
                if (id.includes('xlsx')) return 'vendor-excel';
                if (id.includes('motion') || id.includes('framer-motion')) return 'vendor-animation';
                return 'vendor-utils';
              }
            }
          }
        }
      }
    };
});
