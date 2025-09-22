<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useApp from '@/composables/useApp';
import useHelperFunctions from '@/composables/useHelper';

import TaskModal from '@/components/TaskModal.vue';
import TaskMenu from '@/components/menus/TaskMenu.vue';
import TodoMenu from '@/components/menus/TodoMenu.vue';
import GoalsMenu from '@/components/menus/GoalsMenu.vue';

const app = useApp()
const { now, formatTimeSpent, secsBetweenDates } = useHelperFunctions()

const menuType = ref(0)
const showModal = ref(false)


async function handleModalSubmit(taskName: string, newTaskName: string, newTaskColor: string) {
	if (taskName === "(create task)") {
		const res = await app.tasks.createTask(newTaskName, newTaskColor)
		app.tasks.setWorkingTask(res.id)
	} else {
		app.tasks.setWorkingTask(app.tasks.findTaskWithName(taskName).id)
	}
	showModal.value = false
}

onMounted(app.appStartEvent)
</script>

<template>
	<div class="flex flex-col w-3xl mx-auto pt-10 gap-5">
		<div class="flex flex-col w-full justify-start gap-0.25">
			<h1 class="text-5xl font-bold">Welcome!</h1>
			<h3 class="text-2xl">Current task: {{ app.tasks.workingTask.value !== -1 ?
				app.tasks.findTaskWithId(app.tasks.workingTask.value).name : "None" }}</h3>
			<h3 class="text-2xl">Worktime: {{ app.tasks.workingTask.value !== -1 ?
				formatTimeSpent(secsBetweenDates(app.tasks.workingStart.value, now)) : "0 secs" }}</h3>
			<button class="w-25 p-0.5 mt-2 text-lg bg-green-500 rounded-sm cursor-pointer" @click="showModal = true">Set
				task</button>
		</div>
		<div class="flex w-full justify-start text-lg">
			<div class="flex p-0.5 border-2 border-neutral-800 rounded-lg">
				<button :class="menuType === 0 ? 'bg-green-500' : 'bg-transparent'"
					class="w-35 p-0.5 rounded-md cursor-pointer" @click="menuType = 0">
					Tasks
					<span class="bg-red-500 px-1.5 rounded-md">9+</span>
				</button>
				<button :class="menuType === 1 ? 'bg-green-500' : 'bg-transparent'"
					class="w-35 p-0.5 rounded-md cursor-pointer" @click="menuType = 1">
					To-do List
					<span class="bg-red-500 px-1.5 rounded-md">9+</span>
				</button>
				<button :class="menuType === 2 ? 'bg-green-500' : 'bg-transparent'"
					class="w-35 p-0.5 rounded-md cursor-pointer" @click="menuType = 2">
					Goals
					<span class="bg-red-500 px-1.5 rounded-md">9+</span>
				</button>
			</div>
		</div>

		<TaskMenu v-if="menuType === 0" />
		<TodoMenu v-if="menuType === 1" />
		<GoalsMenu v-if="menuType === 2" />
	</div>

	<TaskModal v-if="showModal" @submit="handleModalSubmit" />
</template>
