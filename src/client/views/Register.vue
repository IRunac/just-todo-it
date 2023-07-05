<script setup>
import { ref } from 'vue';
import { useUserStore } from "../store/user";

const userStore = useUserStore();
const username = ref('');
const password = ref('');
let isError = ref(false);
let isSuccess = ref(false);

const register = async () => {
  try {
    userStore.registerUser(username.value, password.value)
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
        <v-form @submit.prevent="register" class="d-flex flex-column w-20">
          <v-text-field v-model="username" label="Username" outlined/>
          <v-text-field v-model="password" label="Password" outlined/>
          <v-btn type="submit">Register</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  <div v-show="isError" class="error">User with that username already exists.</div>
  <div v-show="isSuccess" class="success">Thank you for registering.</div>
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
