<script lang="ts">
  import axios from 'axios';
  // hardcoded user
  const userId = 4;

  export default {
    name: 'App',
    data() {
      return {
        todoItems: [],
        username: ''
      }
    },
    async mounted() {
      await axios.get(`/api/users/${userId}`).then(response => {
        this.username = response.data.username;
        this.todoItems = response.data['todo_items'];
      });
    }
  }
</script>

<template>
  Hello {{ username }}
  <li v-for="item in todoItems">
    {{ item.name }}
    {{ item.status }}
  </li>
</template>
