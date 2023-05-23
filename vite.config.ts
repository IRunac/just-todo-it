import 'dotenv/config';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
        rewrite: (path:string) => path.replace('/api', '')
      }
    }
  },
  plugins: [vue()],
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: {
        main: './src/client/main.ts'
      }
    }
  }
});
