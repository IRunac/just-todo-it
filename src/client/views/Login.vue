<script setup>
import { ref } from 'vue';
import { useUserStore } from "../store/user";
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const isError = ref(false);
const username = ref('');
const password = ref('');

const login = async () => {
  try {
    await userStore.loginUser(username.value, password.value);
    router.push({ name: 'home' });
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
        <v-form @submit.prevent="login" class="d-flex flex-column w-20">
          <v-text-field v-model="username" label="Username" outlined/>
          <v-text-field v-model="password" label="Password" outlined/>
          <v-btn type="submit" class="d-block">Login</v-btn>
        </v-form>
        <div class="error" v-show="isError">Invalid username or password.</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss">
</style>
