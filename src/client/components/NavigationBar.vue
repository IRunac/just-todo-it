<script setup>
import Cookies from 'js-cookie';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  Cookies.remove('jwtToken');
  userStore.logoutUser();
  router.push({ name: 'login' });
}
</script>

<template>
  <v-app-bar app color="primary">
    <v-toolbar-title>Just ToDo It</v-toolbar-title>
    <v-btn><router-link class="text-white" :to="{ name: 'login' }">Login</router-link></v-btn>
    <v-btn v-if="!userStore.user"><router-link class="text-white" :to="{ name: 'register' }">Register</router-link></v-btn>
    <v-btn v-if="userStore.user"><router-link class="text-white" to="" @click.prevent="logout">Logout</router-link></v-btn>
  </v-app-bar>
</template>
