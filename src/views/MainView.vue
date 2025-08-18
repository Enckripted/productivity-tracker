<script setup lang="ts">
import { ref } from 'vue';
import useLocalApi from '@/composables/localApi';

import TaskModal from '@/components/TaskModal.vue';
import TimeView from '@/components/TimeView.vue';

const { tasks, dailyTasks, workdayStopped, workingTask, workingStart, createTask, setWorkingTask, startWorkday, stopWorkday } = useLocalApi()

const selectedView = ref(0)
const showModal = ref(false)

function handleWorkdayButton() {
  if (workdayStopped.value)
    startWorkday()
  else
    stopWorkday()
}

function handleModalSubmit(taskName, newTaskName, newTaskColor) {
  if (taskName == "(create task)") {
    createTask(newTaskName, newTaskColor)
    setWorkingTask(newTaskName)
  } else {
    setWorkingTask(taskName)
  }
  showModal.value = false
}
</script>

<template>
  <div class="flex flex-col w-lg mx-auto p-5 gap-5 items-center">
    <div class="flex flex-col items-center">
      <p>Current task: {{ workingTask ? workingTask : "None" }}</p>
      <button @click="showModal = true">Set task</button>
    </div>
    <div class="flex gap-5 justify-center">
      <button @click="selectedView = 0">Daily</button>
      <button @click="selectedView = 1">All Time</button>
    </div>
    <div class="flex flex-col w-full gap-5" v-if="selectedView == 0">
      <TimeView :tasks="dailyTasks" :working-task="workingTask" :working-start="workingStart" />
      <button @click="handleWorkdayButton">{{ workdayStopped ? "Start Workday" : "End Workday" }}</button>
    </div>
    <div class="flex flex-col w-full gap-5" v-if="selectedView == 1">
      <TimeView :tasks="tasks" :working-task="workingTask" :working-start="workingStart" />
    </div>
  </div>

  <TaskModal v-if="showModal" @submit="handleModalSubmit" />
</template>
