<script setup>
import Cookies from 'js-cookie';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = event => {
  event.preventDefault();
  Cookies.remove('jwtToken');
  userStore.logoutUser();
  router.push('/login');
}
</script>

<template>
  <v-app-bar app color="primary">
    <v-toolbar-title>Just ToDo It</v-toolbar-title>
    <v-btn><router-link class="text-white" to="/login">Login</router-link></v-btn>
    <v-btn v-if="!userStore.isLoggedIn"><router-link class="text-white" to="/register">Register</router-link></v-btn>
    <v-btn v-if="userStore.isLoggedIn"><router-link class="text-white" to="" @click="logout">Logout</router-link></v-btn>
  </v-app-bar>
</template>
