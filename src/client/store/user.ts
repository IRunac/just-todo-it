import { login, register } from '../api';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isLoggedIn: false
  }),

  actions: {
    async registerUser(email, password) {
      this.user.value = await register(email, password);
    },
    async loginUser(username, password) {
      const response = await login(username, password);
      console.log(response);
      this.user = response;
      this.isLoggedIn = true;
    },
    async logoutUser() {
      this.isLoggedIn = false;
      this.user = null;
    }
  }
});
