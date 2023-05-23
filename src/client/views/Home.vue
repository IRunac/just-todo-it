<script>
import axios from 'axios';
import Cookies from 'js-cookie';
// hardcoded user
const userId = 9;

export default {
  name: 'Home',
  data() {
    return {
      todoItems: [],
      username: ''
    }
  },
  async mounted() {
    const token = Cookies.get('jwtToken');
    await axios.get(`/api/users/${userId}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
      this.username = response.data.username;
      this.todoItems = response.data['todo_items'];
    });
  }
}
</script>

<template>
  <h3>Hello {{ username }}</h3>
  <li v-for="item in todoItems">
    {{ item.name }}
    {{ item.status }}
  </li>
</template>
