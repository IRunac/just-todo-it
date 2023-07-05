import 'vuetify/styles';
import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import initRouter from './router';
import { useUserStore } from './store/user';

init();

async function init() {
  const app = createApp(App);
  const pinia = createPinia();
  app.use(pinia);

  const userStore = useUserStore();
  await userStore.init();

  const router = initRouter();
  app.use(router);

  const vuetify = createVuetify();
  app.use(vuetify);
  app.mount('#app');
}
