<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import useApp from '@/composables/useApp';
import useHelperFunctions from '@/composables/useHelper';

import BaseModal from '@/components/base/BaseModal.vue';
import TaskMenu from '@/components/menus/TaskMenu.vue';
import TodoMenu from '@/components/menus/TodoMenu.vue';
import GoalsMenu from '@/components/menus/GoalsMenu.vue';
import TaskDropdown from '@/components/tasks/TaskDropdown.vue';
import TaskCreateModal from '@/components/tasks/TaskCreateModal.vue';
import SettingsModal from '@/components/SettingsModal.vue';

const app = useApp()
const { now, formatTimeSpent, secsBetweenDates, secsWorkedBetween } = useHelperFunctions()

const menuType = ref(0)

const showSetTaskModal = ref(false)
const showCreationModal = ref(false)
const showSettingsModal = ref(false)

const setTaskSelection = ref(-1)

//TODO: don't copy and paste this and rewrite goals composable to be not bad
const goalsList = computed(() => {
	//we can't use any functions from the composables for timing because we need to have computed update when "now" is updated
	return app.goals.goalsList.value.map((goal) => ({
		id: goal.id,
		taskId: goal.taskId,
		secondsThreshold: goal.secondsThreshold,
		secondsRemaining: Math.max(goal.secondsThreshold - app.tasks.findTaskWithId(goal.taskId).secondsWorkedToday - (app.tasks.workingTask.value === goal.taskId ? secsWorkedBetween(app.tasks.workingStart.value, now.value) : 0), 0),
		completed: app.goals.canCompleteGoal(goal.id),
	}))
})
const goalsCompleted = computed(() => {
	let count = 0
	goalsList.value.forEach((goal) => count += (goal.completed ? 1 : 0))
	return count
})
const goalsRemaining = computed(() => {
	return goalsList.value.length - goalsCompleted.value
})
const curStreak = computed(() => {
	return app.goals.streak.value + (goalsList.value.length > 0
		&& goalsRemaining.value === 0 ? 1 : 0)
})

function openSetTaskModal() {
	setTaskSelection.value = app.tasks.workingTask.value
	showSetTaskModal.value = true
}

function openCreationModal() {
	showSetTaskModal.value = false
	showCreationModal.value = true
}

function openSettingsModal() {
	showSettingsModal.value = true
}

function modalSubmit() {
	if (app.tasks.dayRunning && setTaskSelection.value !== -1)
		app.tasks.setWorkingTask(setTaskSelection.value)
}

onMounted(app.appStartEvent)
</script>

<template>
	<div class="flex flex-col w-3xl mx-auto pt-10 gap-5">
		<div class="flex flex-col w-full justify-start gap-0.25">
			<div class="flex items-center justify-between">
				<h1 class="text-5xl font-bold">Welcome!</h1>
				<div class="flex gap-2">
					<div v-if="curStreak !== 0"
						class="flex w-16 h-7 items-center justify-center bg-amber-600 rounded-2xl">
						<img class="h-full py-1 aspect-square" src="@/assets/flame.svg" />
						<span class="text-black text-lg leading-none">{{ curStreak }}</span>
					</div>
					<img class="cursor-pointer" src="@/assets/settings.svg" @click="openSettingsModal" />
				</div>
			</div>
			<h3 class="text-2xl">Current task: {{ app.tasks.workingTask.value !== -1 ?
				app.tasks.findTaskWithId(app.tasks.workingTask.value).name : "None" }}</h3>
			<h3 class="text-2xl">Worktime: {{ app.tasks.workingTask.value !== -1 ?
				formatTimeSpent(secsBetweenDates(app.tasks.workingStart.value, now)) : "0 secs" }}</h3>
			<button class="w-25 p-0.5 mt-2 text-lg bg-green-600 rounded-sm cursor-pointer" @click="openSetTaskModal">Set
				task</button>
		</div>
		<div class="flex w-full justify-start text-lg">
			<div class="flex p-1 bg-neutral-900 rounded-lg">
				<button :class="menuType === 0 ? 'bg-green-600' : 'bg-transparent'"
					class="w-25 p-0.5 rounded-md cursor-pointer" @click="menuType = 0">
					Tasks
				</button>
				<button :class="menuType === 2 ? 'bg-green-600' : 'bg-transparent'"
					class="w-25 p-0.5 rounded-md cursor-pointer" @click="menuType = 2">
					Goals
					<span v-if="goalsRemaining > 0" class="px-1.5 py-0.5 bg-yellow-500 rounded-lg">{{ goalsRemaining
					}}</span>
				</button>
			</div>
		</div>

		<TaskMenu v-if="menuType === 0" />
		<TodoMenu v-if="menuType === 1" />
		<GoalsMenu v-if="menuType === 2" />
	</div>

	<BaseModal title="Set Task" button-text="Set Task" button-color="bg-green-600 hover:bg-green-500"
		v-model:active="showSetTaskModal" @submit="modalSubmit">
		<TaskDropdown v-model="setTaskSelection" />
		<button class="w-30 p-1 mt-1 bg-blue-600 rounded-md cursor-pointer" @click="openCreationModal">Create
			Task</button>
	</BaseModal>

	<TaskCreateModal @close="openSetTaskModal" v-model:active="showCreationModal" />
	<SettingsModal v-model:active="showSettingsModal" />
</template>
