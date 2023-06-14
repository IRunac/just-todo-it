<script setup>
import { useUserStore } from '../store/user';
import { computed } from 'vue';

const userStore = useUserStore();
const isAdmin = computed(() => userStore.user?.role === 'admin');
</script>

<template>
  <v-navigation-drawer
    app
    class="bg-deep-gray"
    theme="dark">
    <v-list>
      <v-list-item
        title="Dashboard"
        :to="{ name: 'home' }"
        router-link/>
      <v-list-item
        v-if="isAdmin"
        title="Users"
        :to="{ name: 'users' }"
        router-link/>
      <v-list-item
        title="Boards"
        :to="{ name: 'boards' }"
        router-link/>
      <v-list-item
        title="Categories"
        :to="{ name: 'categories' }"
        router-link/>
      <v-list-item
        title="Todo Items"
        :to="{ name: 'todoItems' }"
        router-link/>
    </v-list>
  </v-navigation-drawer>
</template>
