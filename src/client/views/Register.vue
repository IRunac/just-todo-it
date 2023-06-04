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
    await axios.post(`/api/auth/register`, registerData).then(response => {
      console.log(response);
      userStore.user = response.data.user;
      userStore.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(userStore.user));
      isSuccess.value = true;
    });
  } catch (error) {
    isError.value = true;
    console.log(error);
  }
};
</script>

<template>
  <h3>Register</h3>
  <form @submit="register" class="form">
    <label for="username">Username</label>
    <input v-model="username" name="username">
    <label for="password">Password</label>
    <input v-model="password" name="password">
    <button type="submit">Register</button>
  </form>
  <div v-if="isError" class="error">User with that username already exists.</div>
  <div v-if="isSuccess" class="success">Thank you for registering.</div>
</template>

<style lang="scss">
  .form {
    margin: 0 auto;
    width: fit-content;
  }

  label {
    display: block;
    margin: 0 auto;
  }

  button {
    display: block;
    margin: 20px auto;
    padding: 3px 10px;
  }

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

  input {
    background: #E4C988;
  }
</style>
