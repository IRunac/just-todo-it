<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const todoItems = ref([])

onMounted(async() => {
  const token = Cookies.get('jwtToken');
  const userId = userStore.user.id;
  await axios.get(`/api/users/${userId}/todoItems`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    todoItems.value = response.data;
  });
});

const deleteItem = async (item) => {
  const token = Cookies.get('jwtToken');
  await axios.delete(`/api/todoItems/${item.id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    const index = todoItems.value.indexOf(item); 
    if (index !== -1) todoItems.value.splice(index, 1);
  });
};
</script>

<template>
  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Category</th>
        <th>Created</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in todoItems" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.category }}</td>
        <td>{{ item.createdAt}}</td>
        <td><v-btn theme="light" @click="deleteItem(item)">Delete</v-btn></td>
      </tr>
    </tbody>
  </v-table>
</template>
