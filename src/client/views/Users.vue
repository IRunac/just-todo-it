<script setup>
import axios from 'axios';
import Cookies from 'js-cookie';
import { computed, nextTick, onMounted, ref, reactive } from 'vue';

const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}
const users = ref([]);
const userFormElem = ref(null);
const roleValues = computed(() => Object.values(ROLES));
const showCreateUserForm = ref(false);
const userForm = reactive({
  username: '',
  password: '',
  role: 'user'
})

onMounted(async() => {
  const token = Cookies.get('jwtToken');
  await axios.get(`/api/users`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    users.value = response.data;
  });
});

const deleteUser = async (user) => {
  const token = Cookies.get('jwtToken');
  await axios.delete(`/api/users/${user.id}`, { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
    const index = users.value.indexOf(user); 
    if (index !== -1) users.value.splice(index, 1);
  });
};

const openUserForm = async () => {
  showCreateUserForm.value = true;
  await nextTick();
  userFormElem.value.scrollIntoView({ behavior: 'smooth' });
};

const createUser = async (event) => {
  event.preventDefault();
  const token = Cookies.get('jwtToken');
  const response = await axios.post(`/api/users`, { ...userForm }, { headers: {"Authorization" : `Bearer ${token}`} });
  users.value.push(response.data);
};
</script>

<template>
  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th>Username</th>
        <th>Role</th>
        <th>Joined</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.username }}</td>
        <td>{{ user.role}}</td>
        <td>{{ user.createdAt}}</td>
        <td>
          <v-btn theme="light" class="ma-4" @click="deleteUser(user)">Delete</v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>

  <v-btn theme="light" class="mt-5" @click="openUserForm">Create User</v-btn>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-form v-if="showCreateUserForm" @submit="createUser" ref="userFormElem">
          <v-text-field v-model="userForm.username" label="Username" outlined/>
          <v-text-field v-model="userForm.password" label="Password" outlined/>
          <v-select v-model="userForm.role" :items="roleValues" label="Select user role"/>
          <v-btn type="submit">Submit</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
