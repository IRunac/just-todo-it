<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';

const users = ref([])

onMounted(async() => {
  const token = Cookies.get('jwtToken');
  await axios.get(`/api/users`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    console.log(response);
    users.value = response.data;
  });

});
</script>

<template>
  <table class="users">
    <tr>
      <th>Username</th>
      <th>Role</th>
      <th>Joined</th>
    </tr>
    <tr v-for="user in users">
      <td>{{ user.username }}</td>
      <td>{{ user.role}}</td>
      <td>{{ user.createdAt}}</td>
    </tr>
  </table>
</template>

<style lang="scss">
.users {
  margin: 30px;
}

table, th, td {
  border: 1px solid black;
}
</style>