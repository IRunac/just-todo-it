import { login, register } from '../api';
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

  async function registerUser(email, password) {
    this.user.value = await register(email, password);
  }
  async function loginUser(username, password) {
    const response = await login(username, password);
    console.log(response);
    user.value = response;
    isLoggedIn.value = true;
  }
  function logoutUser() {
    isLoggedIn.value = false;
    user.value = null;
  }
  return { user, isLoggedIn, registerUser, loginUser, logoutUser };
});
