import 'vuetify/styles';
import { configure, defineRule } from 'vee-validate';
import { max, min, numeric, required } from '@vee-validate/rules';
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

  defineRule('required', required);
  defineRule('numeric', numeric);
  defineRule('max', max);
  defineRule('min', min);

  configure({
    validateOnBlur: true,
    validateOnInput: true
  });

  app.mount('#app');
}
