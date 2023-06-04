import axios from 'axios';
import Cookies from 'js-cookie';
import { defineStore } from 'pinia';
import { ref } from 'vue';

// export const useUserStore = defineStore('user', {
//   state: () => ({
//     user: ref(null),
//     isLoggedIn: ref(false)
//   }),

//   actions: {
//     async getUser(userId) {
//       const token = Cookies.get('jwtToken');
//       await axios.get(`/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
//         const user = response.data;
//         this.user = user;
//       });
//     },
//     async signUp(email, password) {
//       const res = await fetch('https://localhost:3000/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       });
//       const user = await res.json();
//       this.user = user;
//     },
//     async login(username, password) {
//       await axios.post('/api/auth/login', { username, password }).then(response => {
//         this.user = response.data.user;
//         this.isLoggedIn = true;
//         console.log(this);
//         console.log(this.isLoggedIn);
//       });
//     },
//     async logout() {
//       this.isLoggedIn = false;
//     }
//   }
// });

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const isLoggedIn = ref(false);

  async function getUser(userId) {
    const token = Cookies.get('jwtToken');
    await axios.get(`/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }).then(response => {
      user.value = response.data;
    });
  }
  async function signUp(email, password) {
    const res = await fetch('https://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    this.user.value = await res.json();
  }
  async function login(username, password) {
    await axios.post('/api/auth/login', { username, password }).then(response => {
      user.value = response.data.user;
      isLoggedIn.value = true;
    });
  }
  function logout() {
    isLoggedIn.value = false;
    user.value = null;
  }
  return { user, isLoggedIn, getUser, signUp, login, logout };
});
