import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
import Boards from '../views/Boards.vue';
import Categories from '../views/Categories.vue';
import Cookies from 'js-cookie';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import TodoItems from '../views/TodoItems.vue';
import Users from '../views/Users.vue';
import { useUserStore } from '../store/user';

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/users',
    name: 'users',
    component: Users,
    beforeEnter: (to, from) => {
      const userStore = useUserStore();
      if (!(userStore.user?.role === 'admin')) return from;
    },
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/boards',
    name: 'boards',
    component: Boards
  },
  {
    path: '/categories',
    name: 'categories',
    component: Categories
  },
  {
    path: '/todoItems',
    name: 'todoItems',
    component: TodoItems
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

let isInitialized = false;

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();
  if (!isInitialized) {
    const token = Cookies.get('jwtToken');
    if (token) {
      const response = await axios.get('api/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const user = response.data;
      userStore.user = user;
      userStore.isLoggedIn = true;
      isInitialized = true;
    }
  }
  if (to.meta.requiresAuth && !userStore.isLoggedIn && !(to.name === 'Login')) {
    return '/login';
  }
});

export default router;
