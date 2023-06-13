import 'dotenv/config';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

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
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
      styles: { configFile: 'src/client/styles/settings.scss' }
    })
  ],
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      input: {
        main: './src/client/main.ts'
      }
    }
  }
});
