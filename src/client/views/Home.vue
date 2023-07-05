<script setup>
import { useUserStore } from "../store/user";
import { computed } from 'vue';

const ITEM_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
}
const userStore = useUserStore();

const sortedItems = computed(() => {
  const itemsPerBoardAndStatus = {}
  for (const board of userStore.user.boards) {
    const itemsPerBoard = userStore.user.todo_items.filter(item => item.board === board.id);
    itemsPerBoardAndStatus[board.type] = {};
    for (const item_status of Object.values(ITEM_STATUS)) {
      itemsPerBoardAndStatus[board.type][item_status] = itemsPerBoard.filter(item => item.status === item_status);
    }
  }
  return itemsPerBoardAndStatus;
});
</script>

<template>
  <h3>Hello {{ userStore.user?.username || '' }}</h3>
  <v-table theme="dark" density="compact">
    <thead>
      <tr>
        <th></th>
        <th v-for="status in Object.values(ITEM_STATUS)">{{ status }}</th>
      </tr>
    </thead>
    <tbody> 
      <tr v-for="(boardItems, boardType) in sortedItems" :key="boardType">
        <td>{{ boardType }}</td>
        <td v-for="(statusItems, status) in boardItems" :key="status">
          <v-row>
            <v-col v-for="item in statusItems" :key="item.id" class="border pa-0 pl-1 ma-3">
              {{ item.name }}
            </v-col>
          </v-row>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
