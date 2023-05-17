import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
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
