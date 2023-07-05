import { getCurrentUser, login, register } from '../api';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),

  actions: {
    async registerUser(email, password) {
      this.user.value = await register(email, password);
    },
    async loginUser(username, password) {
      this.user = await login(username, password);
    },
    async logoutUser() {
      this.user = null;
    },
    async init() {
      this.user = await getCurrentUser();
    }
  }
});
