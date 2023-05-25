<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      isError: false
    }
  },
  methods: {
    async login(event) {
      event.preventDefault();
      try {
        const { username, password } = this;
        await axios.post(`/api/auth/login`, { username, password }).then(response => {
          console.log(response);
          const { token } = response.data;
          this.$router.push('/');
        });
      } catch (error) {
        this.isError = true;
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
  <div class="error" v-show="isError">Invalid username or password.</div>
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

  input {
    background: #E4C988;
  }
</style>
