import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path:string) => path.replace('/api', '')
      }
    }
  },
  plugins: [vue()],
  build: {
    outDir: 'dist/client',
    // target: 'es2020',
    rollupOptions: {
      input: {
        main: './src/client/main.ts'
      }
    }
  }
});
