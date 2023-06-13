import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import router from './router';

const pinia = createPinia();
const vuetify = createVuetify({
  components,
  directives
});

createApp(App).use(vuetify).use(pinia).use(router).mount('#app');
