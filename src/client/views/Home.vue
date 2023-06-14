<script setup>
import { useUserStore } from "../store/user";
import { computed, ref } from 'vue';

const BoardTypes = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
}

const userStore = useUserStore();
const itemsPerBoardType = ref({});

for (const board of userStore.user.boards) {
  itemsPerBoardType.value[board.type] = userStore.user.todo_items.filter(item => item.board === board.id);
}
</script>

<template>
  <h3>Hello {{ userStore.user?.username || '' }}</h3>

  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th></th>
        <th>TODO</th>
        <th>IN PROGRESS</th>
        <th>DONE</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="board in userStore.user.boards" :key="board.id">
        <td>{{ board.type }}</td>
        <td>
          <div v-for="item in itemsPerBoardType[board.type]" :key="item.id">
            <span v-if="item.status === 'todo'">{{ item.name }}</span>
          </div>
        </td>
        <td>
          <div v-for="item in itemsPerBoardType[board.type]" :key="item.id">
            <span v-if="item.status === 'in-progress'">{{ item.name }}</span>
          </div>
        </td>
        <td>
          <!-- slozit bolju strukturu da izbjegnemo v-for-ova puno -->
          <div v-for="item in itemsPerBoardType[board.type]" :key="item.id">
            <span v-if="item.status === 'done'">{{ item.name }}</span>
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
