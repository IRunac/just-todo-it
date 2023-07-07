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
import { useForm } from 'vee-validate';

const schema = reactive({ 
  name: {
    required: true,
    min: 4,
    max: 20,
  },
  completed_increment: {
    required: true,
    numeric: true,
    min_value: 1,
    max_value: 10,
  },
  failed_increment: {
    required: true,
    numeric: true,
    min_value: 0,
    max_value: 10,
  },
  category_id: {
    required: true,
  },
  board_id: {
    required: true,
  },
});

const { values, errors, meta, defineInputBinds } = useForm({ validationSchema: schema, initialValues: {category_id: []} });
const name = defineInputBinds('name');
const completed_increment = defineInputBinds('completed_increment');
const failed_increment = defineInputBinds('failed_increment');
const category_id = defineInputBinds('category_id');
const board_id = defineInputBinds('board_id');

const userStore = useUserStore();
const todoItems = reactive([])
const categories = reactive([])
const boards = reactive([])
const showForm = ref(false);
const formElem = ref(null);

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
  todoItems.push(await createTodoItemApi({ ...values, user_id: userStore.user.id, status: 'todo' }))
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
            v-bind="name"
            label="Name"
            hide-details="auto"
            class="mt-2"
            outlined/>
          <div class="text-red" v-show="errors.name">{{ errors.name }}</div>
          <v-text-field
            v-bind="completed_increment"
            label="Completed Increment"
            hide-details="auto"
            class="mt-2"
            outlined/>
          <div class="text-red" v-show="errors.completed_increment">{{ errors.completed_increment }}</div>
          <v-text-field
            v-bind="failed_increment"
            label="Failed Increment"
            hide-details="auto"
            class="mt-2"
            outlined/>
          <div class="text-red" v-show="errors.failed_increment">{{ errors.failed_increment }}</div>
          <v-select
            :items="categories.map(category => ({ title: category.name, value: category.id }))"
            @update:modelValue="category_id.onInput"
            :modelValue="category_id.value"
            v-bind="category_id"
            multiple
            label="Select item category"
            hide-details="auto"
            class="mt-2"/>
          <div class="text-red" v-show="errors.category_id">{{ errors.category_id }}</div>
          <v-select
            :items="boards.map(board => ({ title: board.type, value: board.id }))"
            @update:modelValue="board_id.onInput"
            :modelValue="board_id.value"
            v-bind="board_id"
            name="board_id"
            label="Select item board"
            hide-details="auto"
            class="mt-2"/>
          <div class="text-red" v-show="errors.board_id">{{ errors.board_id }}</div>
          <v-btn type="submit" class="mt-2" :disabled="!meta.valid">Submit</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
