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
    <li v-if="jwtToken"><a @click="logout">Logout</a></li>
  </ul>
  <div class="router">
    <router-view/>
  </div>
</template>

<style lang="scss">
body {
  background-color: #80CBC4;
  width: 100%;
  margin: 0;
}

h3 {
  margin: 20px;
}

.router {
  margin: 0 auto;
}

ul {
  width: 100%;
  height: 30px;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid black;
  list-style-type: none;
  background-color: #f1f1f1;

  li {
    height: 100%;
    width: 75px;
    display: inline-block;
    border-right: 1px solid black;
  }

  li a {
    display: block;
    color: #000;
    height: 100%;
    width: 75px;
    padding: 5px 16px;
    cursor: pointer;
    text-decoration: none;
    box-sizing: border-box;
  }

  li a:hover {
    background-color: #555;
    color: white;
  }
}
</style>