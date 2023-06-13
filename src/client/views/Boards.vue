<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { onMounted, ref } from 'vue';
import { useUserStore } from '../store/user';

const userStore = useUserStore();
const boards = ref([])

onMounted(async() => {
  const token = Cookies.get('jwtToken');
  const userId = userStore.user.id;
  console.log(userId);
  await axios.get(`/api/users/${userId}/boards`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    boards.value = response.data;
  });
});

const deleteBoard = async (board) => {
  const token = Cookies.get('jwtToken');
  await axios.delete(`/api/boards/${board.id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    const index = boards.value.indexOf(board); 
    if (index !== -1) boards.value.splice(index, 1);
  });
};
</script>

<template>
  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th>Type</th>
        <th>Created</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="board in boards" :key="board.id">
        <td>{{ board.type }}</td>
        <td>{{ board.createdAt}}</td>
        <td><v-btn theme="light" @click="deleteBoard(board)">Delete</v-btn></td>
      </tr>
    </tbody>
  </v-table>
</template>
