<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login(event) {
      event.preventDefault();
      try {
        const { username, password } = this;
        await axios.post(`/api/auth/login`, { username, password }).then(response => {
          const { token } = response.data;
          Cookies.set('jwtToken', token);
          this.$router.push('/');
        });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<template>
  <h3>Login</h3>
  <form @submit="login" class="form">
    <label for="username">Username</label>
    <input v-model="username" name="username">
    <label for="password">Password</label>
    <input v-model="password" name="password">
    <button type="submit">Login</button>
  </form>
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
  }
</style>
