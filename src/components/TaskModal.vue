<script setup lang="ts">
import { ref, computed } from 'vue';
import useLocalApi from '@/composables/localApi';

const emit = defineEmits(["submit"])
const { tasks } = useLocalApi()

const selectedTask = ref("")

const newName = ref("")
const newColor = ref("")

const computedTasks = computed(() => {
  return tasks.value.concat([{ name: "(create task)" }])
})

function submitModal() {
  if (selectedTask.value == "(create task)") {
    if (newName.value == "(create task)" || tasks.value.find((task) => task.name == newName.value) || !newName.value ||
      tasks.value.find((task) => task.color == newColor.value)) {
      return
    } else {
      emit("submit", selectedTask.value, newName.value, newColor.value)
    }
  } else {
    emit("submit", selectedTask.value, "", "")
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="flex fixed inset-0 w-full h-full bg-black opacity-25"></div>
    <div class="flex fixed inset-0 items-center justify-center z-10">
      <div class="flex flex-col w-90 max-h py-10 gap-4 bg-zinc-800">
        <div class="flex flex-col gap-1 items-center">
          <h3 class="text-xl font-bold">Set Current Task</h3>
          <select class="bg-zinc-800 p-1 border-b-2" v-model="selectedTask">
            <option :value="task.name" v-for="task in computedTasks" :key="task.name">{{ task.name }}
            </option>
          </select>
        </div>
        <div v-if="selectedTask == `(create task)`">
          <form class="flex flex-row gap-1 justify-center">
            <input class="w-40 h-7 p-1 border-1" type="text" v-model="newName" />
            <input class="w-10 h-7 border-0" type="color" v-model="newColor" />
          </form>
        </div>
        <div class="text-center">
          <button class="px-2 py-1 rounded-md bg-blue-500 border border-transparent cursor-pointer"
            @click="submitModal">Set
            Task</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
