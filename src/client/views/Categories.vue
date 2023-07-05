<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue';
import { useUserStore } from '../store/user';
import { createCategory as createCategoryApi, getUserCategories, deleteCategory as deleteCategoryApi } from '../api';
import { useForm } from 'vee-validate';

const schema = reactive({ 
  name: {
    required: true,
    min: 4,
    max: 20,
  },
  color: {
    required: true,
    min: 3,
    max: 12,
  },
  value: {
    required: true,
    numeric: true,
    min_value: 0,
    max_value: 100,
  },
  max_value: {
    required: true,
    numeric: true,
    min_value: 10,
    max_value: 100,
  },
});

const { values, errors, meta, defineInputBinds } = useForm({ validationSchema: schema });
const name = defineInputBinds('name');
const color = defineInputBinds('color');
const value = defineInputBinds('value');
const max_value = defineInputBinds('max_value');
const userStore = useUserStore();
const categories = reactive([])
const showForm = ref(false);
const formElem = ref(null);

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
  categories.push(await createCategoryApi({ ...values, user_id: userStore.user.id}))
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
            v-bind="name"
            label="Name"
            hide-details="auto"
            class="mt-2"
            outlined/>
          <div class="text-red" v-show="errors.name">{{ errors.name }}</div>
          <v-text-field
            v-bind="color"
            label="Color"
            hide-details="auto"
            class="mt-2"
            outlined/>
          <div class="text-red" v-show="errors.color">{{ errors.color }}</div>
          <v-text-field
            v-bind="value"
            label="Value"
            hide-details="auto"
            class="mt-2"
            outlined/>
          <div class="text-red" v-show="errors.value">{{ errors.value }}</div>
          <v-text-field
            v-bind="max_value"
            label="Max Value"
            hide-details="auto"
            class="mt-2"
            outlined/>
          <div class="text-red" v-show="errors.max_value">{{ errors.max_value }}</div>
          <v-btn type="submit" class="mt-2" :disabled="!meta.valid">Submit</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
