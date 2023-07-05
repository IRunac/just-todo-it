import { createRouter, createWebHistory } from 'vue-router';
import Boards from '../views/Boards.vue';
import Categories from '../views/Categories.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import TodoItems from '../views/TodoItems.vue';
import Users from '../views/Users.vue';
import { useUserStore } from '../store/user';

const initRouter = () => {
  const userStore = useUserStore();
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
        if (!(userStore.user?.role === 'admin')) return from;
      },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/boards',
      name: 'boards',
      component: Boards,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/todoItems',
      name: 'todoItems',
      component: TodoItems,
      meta: {
        requiresAuth: true
      }
    }
  ];

  const router = createRouter({
    history: createWebHistory(),
    routes
  });

  router.beforeEach(async (to, from) => {
    if (to.meta.requiresAuth && !userStore.user && !(to.name === 'Login')) {
      return '/login';
    }
  });

  return router;
};

export default initRouter;
