<script setup>
import { ref } from 'vue';
import { useUserStore } from "../store/user";
import router from "../router"; 
const userStore = useUserStore();

const isError = ref(false);
let username = '';
let password = '';

const login = async (event) => {
  event.preventDefault();
  try {
    await userStore.loginUser(username, password);
    router.push('/');
  } catch (error) {
    isError.value = true;
    console.log(error);
  }
}

</script>

<template>
  <h3>Login</h3>
  <v-container>
    <v-row justify="center">
      <v-col cols="3">
        <v-form @submit="login" class="d-flex flex-column w-20">
          <label for="username">Username</label>
          <input v-model="username" name="username">
          <label for="password">Password</label>
          <input v-model="password" name="password">
          <v-btn type="submit" class="d-block">Login</v-btn>
        </v-form>
        <div class="error" v-show="isError">Invalid username or password.</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
</style>
