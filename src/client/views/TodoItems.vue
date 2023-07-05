<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useUserStore } from '../store/user';
import {
  createTodoItem as createTodoItemApi,
  getUserBoards,
  getUserCategories,
  getUserTodoItems,
  deleteTodoItem
} from '../api';

const userStore = useUserStore();
const todoItems = reactive([])
const categories = reactive([])
const boards = reactive([])
const showForm = ref(false);
const formElem = ref(null);
const todoItemForm = reactive({
  name: '',
  status: 'todo',
  completed_increment: 1,
  failed_increment: 1,
  user_id: userStore.user.id,
  category_id: [],
  board_id: null
})

onMounted(async () => {
  todoItems.push(... await getUserTodoItems(userStore.user.id));
  categories.push(... await getUserCategories(userStore.user.id));
  boards.push(... await getUserBoards(userStore.user.id));
});

const deleteItem = async item => {
  await deleteTodoItem(item.id);
  const index = todoItems.indexOf(item);
  if (index !== -1) todoItems.splice(index, 1);
};

const openForm = async () => {
  showForm.value = true;
  await nextTick();
  formElem.value.scrollIntoView({ behavior: 'smooth' });
};

const createTodoItem = async () => {
  todoItems.push(await createTodoItemApi(todoItemForm))
  showForm.value = false;
};
</script>

<template>
  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Category</th>
        <th>Created</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in todoItems" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.status }}</td>
        <td>{{ item.categories.map(category => category.name).join(', ') }}</td>
        <td>{{ item.createdAt}}</td>
        <td><v-btn theme="light" @click="deleteItem(item)" class="ma-4">Delete</v-btn></td>
      </tr>
    </tbody>
  </v-table>

  <v-btn theme="light" class="mt-5" @click="openForm">Create Todo Item</v-btn>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-form v-show="showForm" @submit.prevent="createTodoItem" ref="formElem">
          <v-text-field
            v-model="todoItemForm.name"
            label="Name"
            outlined/>
          <v-text-field
            v-model="todoItemForm.completed_increment"
            label="Completed Increment"
            outlined/>
          <v-text-field
            v-model="todoItemForm.failed_increment"
            label="Failed Increment"
            outlined/>
          <v-select
            v-model="todoItemForm.category_id"
            :items="categories.map(category => ({ title: category.name, value: category.id }))"
            multiple
            label="Select item category"/>
          <v-select
            v-model="todoItemForm.board_id"
            :items="boards.map(board => ({ title: board.type, value: board.id }))"
            label="Select item board"/>
          <v-btn type="submit">Submit</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
