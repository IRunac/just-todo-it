<script>
import Cookies from 'js-cookie';

export default {
  name: 'Login',
  data() {
    return {
      jwtToken: Cookies.get('jwtToken'),
    }
  },
  methods: {
    logout(event) {
      event.preventDefault();
      Cookies.remove('jwtToken');
      this.$router.push('/login');
    }
  }
}
</script>

<template>
  <ul id="nav">
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/login">Login</router-link></li>
    <li><router-link to="/register">Sign Up</router-link></li>
    <li v-if="jwtToken"><a @click="logout">Logout</a></li>
  </ul>
  <div class="router">
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  background-color: #80CBC4;
  font-family: sans-serif;
  width: 100%;
  margin: 0;
}

h3 {
  margin: 20px;
}

ul {
  margin: 0;
  padding: 0;
  border-bottom: 2px double teal;
  background-color: #E4C988;

  li {
    display: inline-block;
    border-right: 2px double teal;
  }

  li a {
    display: flex;
    color: #000;
    padding: 5px 16px;
    text-decoration: none;
  }

  li a:hover {
    background-color: #555;
    color: white;
  }
}
</style>