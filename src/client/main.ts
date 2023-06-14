import 'vuetify/styles';
import App from './App.vue';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import router from './router';

const pinia = createPinia();
const vuetify = createVuetify();

createApp(App).use(vuetify).use(pinia).use(router).mount('#app');
