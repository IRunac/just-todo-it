<script setup>
import { computed, nextTick, onMounted, ref, reactive } from 'vue';
import { getUsers, deleteUser as deleteUserApi, createUser as createUserApi } from '../api';

const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
}
const users = reactive([]);
const userFormElem = ref(null);
const roleValues = computed(() => Object.values(ROLES));
const showCreateUserForm = ref(false);
const userForm = reactive({
  username: '',
  password: '',
  role: 'user'
})

onMounted(async () => users.push(... await getUsers()));

const deleteUser = async user => {
  console.log(user)
  await deleteUserApi(user.id);
  const index = users.indexOf(user);
  if (index !== -1) users.splice(index, 1);
};

const openUserForm = async () => {
  showCreateUserForm.value = true;
  await nextTick();
  userFormElem.value.scrollIntoView({ behavior: 'smooth' });
};

const createUser = async () => {
  users.push(await createUserApi(userForm))
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
        <v-form v-show="showCreateUserForm" @submit.prevent="createUser" ref="userFormElem" >
          <v-text-field 
            v-model="userForm.username"
            label="Username"
            outlined/>
          <v-text-field
            v-model="userForm.password"
            label="Password"
            outlined/>
          <v-select v-model="userForm.role" :items="roleValues" label="Select user role"/>
          <v-btn type="submit">Submit</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
