<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useUserStore } from '../store/user';
import { createCategory as createCategoryApi, getUserCategories, deleteCategory as deleteCategoryApi } from '../api';

const userStore = useUserStore();
const categories = reactive([])
const showForm = ref(false);
const formElem = ref(null);
const categoryForm = reactive({
  name: '',
  color: '',
  value: 0,
  max_value: 100,
  user_id: userStore.user.id
})

onMounted(async () => categories.push(... await getUserCategories(userStore.user.id)));

const deleteCategory = async category => {
  await deleteCategoryApi(category.id);
  const index = categories.indexOf(category); 
  if (index !== -1) categories.splice(index, 1);
};

const openForm = async () => {
  showForm.value = true;
  await nextTick();
  formElem.value.scrollIntoView({ behavior: 'smooth' });
};

const createCategory = async () => {
  categories.push(await createCategoryApi(categoryForm))
  showForm.value = false;
};
</script>

<template>
  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th>Type</th>
        <th>Current State</th>
        <th>Max</th>
        <th>Created</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in categories" :key="category.id">
        <td>{{ category.name }}</td>
        <td>{{ category.value }}</td>
        <td>{{ category.max_value }}</td>
        <td>{{ category.createdAt}}</td>
        <td><v-btn theme="light" @click="deleteCategory(category)" class="ma-4">Delete</v-btn></td>
      </tr>
    </tbody>
  </v-table>

  <v-btn theme="light" class="mt-5" @click="openForm">Create Category</v-btn>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-form v-show="showForm" @submit.prevent="createCategory" ref="formElem">
          <v-text-field 
            v-model="categoryForm.name"
            label="Name"
            outlined/>
          <v-text-field
            v-model="categoryForm.color"
            label="Color"
            outlined/>
          <v-text-field
            v-model="categoryForm.value"
            label="Value"
            outlined/>
          <v-text-field
            v-model="categoryForm.max_value"
            label="Max Value"
            outlined/>
          <v-btn type="submit">Submit</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
