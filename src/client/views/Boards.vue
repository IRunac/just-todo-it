<script setup>
import { computed, onMounted, nextTick, reactive, ref } from 'vue';
import { useUserStore } from '../store/user';
import { createBoard as createBoardApi, getUserBoards, deleteBoard as deleteBoardApi} from '../api';
import { useForm } from 'vee-validate';

const TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTLY: 'monthly',
  YEARLY: 'yearly'
}

const schema = { 
  boardType: {
    required: true,
  },
};

const { value, errors, meta, defineInputBinds } = useForm({ validationSchema: schema });
const boardType = defineInputBinds('boardType');

const userStore = useUserStore();
const boards = reactive([]);
const typeValues = computed(() => Object.values(TYPES));
const showForm = ref(false);
const formElem = ref(null);

onMounted(async () => boards.push(... await getUserBoards(userStore.user.id)));

const deleteBoard = async board => {
  await deleteBoardApi(board.id);
  const index = boards.indexOf(board); 
  if (index !== -1) boards.splice(index, 1);
};

const openForm = async () => {
  showForm.value = true;
  await nextTick();
  formElem.value.scrollIntoView({ behavior: 'smooth' });
};

const createBoard = async () => {
  boards.push(await createBoardApi({user_id: userStore.user.id, type: boardType}))
  showForm.value = false;
};
</script>

<template>
  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th>Type</th>
        <th>Created</th>
        <th>Delete</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="board in boards" :key="board.id">
        <td>{{ board.type }}</td>
        <td>{{ board.createdAt}}</td>
        <td><v-btn theme="light" @click="deleteBoard(board)" class="ma-4">Delete</v-btn></td>
      </tr>
    </tbody>
  </v-table>

  <v-btn theme="light" class="mt-5" @click="openForm">Create Board</v-btn>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-form v-show="showForm" @submit.prevent="createBoard" ref="formElem">
          <v-select
            :items="typeValues"
            @update:modelValue="boardType.onInput"
            :modelValue="boardType.value"
            v-bind="boardType"
            name="boardType"
            label="Select board type"
            hide-details="auto"/>
          <div class="text-red" v-show="errors.boardType">{{ errors.boardType }}</div>
          <v-btn type="submit" class="mt-2" :disabled="!meta.valid">Submit</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
