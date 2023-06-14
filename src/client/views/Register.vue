<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from "../store/user";

const userStore = useUserStore();
const router = useRouter(); 
const username = ref('');
const password = ref('');
let isError = ref(false);
let isSuccess = ref(false);

const register = async event => {
  event.preventDefault();
  const registerData = {
    username: username.value,
    password: password.value
  };
  try {
    userStore.registerUser()
    userStore.isLoggedIn = true;
    isSuccess.value = true;
    isError.value = false;
  } catch (error) {
    isError.value = true;
    console.log(error);
  }
};
</script>

<template>
  <h3>Register</h3>
  <v-container>
    <v-row justify="center">
      <v-col cols="3">
        <v-form @submit="register" class="d-flex flex-column w-20">
          <v-text-field v-model="username" label="Username" outlined/>
          <v-text-field v-model="password" label="Password" outlined/>
          <v-btn type="submit">Register</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  <div v-if="isError" class="error">User with that username already exists.</div>
  <div v-if="isSuccess" class="success">Thank you for registering.</div>
</template>

<style lang="scss">
  .error {
    color: #b00020;
    margin: 0 auto;
    width: fit-content;
  }

  .success {
    color: green;
    margin: 0 auto;
    width: fit-content;
  }
</style>
