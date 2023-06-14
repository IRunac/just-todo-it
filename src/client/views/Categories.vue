<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const categories = ref([])

onMounted(async() => {
  const token = Cookies.get('jwtToken');
  const userId = userStore.user.id;
  await axios.get(`/api/users/${userId}/categories`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    categories.value = response.data;
  });
});

const deleteCategory = async (category) => {
  const token = Cookies.get('jwtToken');
  await axios.delete(`/api/categories/${category.id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    const index = categories.value.indexOf(category); 
    if (index !== -1) categories.value.splice(index, 1);
  });
};
</script>

<template>
  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th>Type</th>
        <th>Current State</th>
        <th>Max</th>
        <th>Created</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in categories" :key="category.id">
        <td>{{ category.name }}</td>
        <td>{{ category.value }}</td>
        <td>{{ category.max_value }}</td>
        <td>{{ category.createdAt}}</td>
        <td><v-btn theme="light" @click="deleteCategory(category)" class="ma-4">Delete</v-btn></td>
      </tr>
    </tbody>
  </v-table>
</template>
