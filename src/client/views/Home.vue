<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUserStore } from "../store/user";
import { onMounted } from 'vue'

const userStore = useUserStore();

// hardcoded user
let todoItems = [];

onMounted(async () => {
  if (userStore.isLoggedIn) {
    const token = Cookies.get('jwtToken');
    await axios.get(`/api/users/${userStore.user.id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
      todoItems = response.data['todo_items'];
    });
  }
});
</script>

<template>
  <h3>Hello {{ userStore.user?.username || '' }}</h3>
  <ul class="boards">
    <li v-for="board in userStore.user?.boards">
      {{ board.type }}
      <ul class="todo-items">
        <div v-for="item in userStore.user?.todo_items">
          <li v-if="item.board === board.id">
            {{ item.name }} - Status:
            {{ item.status }}
          </li>
        </div>
      </ul>
      <br>
    </li>
  </ul>
</template>
