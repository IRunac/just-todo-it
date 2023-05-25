<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      isError: false
    }
  },
  methods: {
    async register(event) {
      event.preventDefault();
      try {
        const { username, password } = this;
        await axios.post(`/api/auth/register`, { username, password }).then(response => {
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
  <h3>Register</h3>
  <form @submit="register" class="form">
    <label for="username">Username</label>
    <input v-model="username" name="username">
    <label for="password">Password</label>
    <input v-model="password" name="password">
    <button type="submit">Register</button>
  </form>
  <div class="error" v-show="isError">User with that username already exists.</div>
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
