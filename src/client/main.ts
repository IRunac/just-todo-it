import 'vuetify/styles';
import { configure, defineRule } from 'vee-validate';
// eslint-disable-next-line camelcase
import { max, max_value, min, min_value, numeric, required } from '@vee-validate/rules';
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
  defineRule('max_value', max_value);
  defineRule('min_value', min_value);

  configure({
    validateOnBlur: true,
    validateOnInput: true
  });

  app.mount('#app');
}
