<script setup lang="ts">
import { computed, ref } from 'vue'
import useApp from '@/composables/useApp';
import useModals from '@/composables/useModals';
import useHelperFunctions from '@/composables/useHelper';

import GoalCreateModal from '../goals/GoalCreateModal.vue';
import GoalEditModal from '../goals/GoalEditModal.vue';
import GoalDeleteModal from '../goals/GoalDeleteModal.vue';

const app = useApp()
const { goalEditModal, goalDeleteModal } = useModals()
const { now, secsWorkedBetween, formatTimeSpent } = useHelperFunctions()

const showModal = ref(false)

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

function openModal() {
	showModal.value = true
}
</script>

<template>
	<div class="flex flex-col w-full gap-5">
		<p v-if="goalsRemaining > 0" class="w-full text-center italic">Complete the remaining {{ goalsRemaining > 1 ?
			`${goalsRemaining} goals` : `goal` }}
			to keep your
			streak!</p>
		<p v-else-if="goalsCompleted > 0" class="w-full text-center italic text-green-400">You've completed all your
			goals, you're all set for
			the day!</p>

		<div class="flex flex-col" v-for="goal of goalsList" :key="goal.id">
			<h3 :class="goal.completed ? 'text-green-400' : 'text-white'" class="text-2xl">Do "{{
				app.tasks.findTaskWithId(goal.taskId).name }}" for at least
				<span class="font-bold">{{ formatTimeSpent(goal.secondsThreshold) }}</span>
				today
			</h3>
			<div class="flex w-full justify-between">
				<p v-if="goal.completed" class="text-green-400 italic">Goal complete!</p>
				<p v-else class="italic">Time left: {{ formatTimeSpent(goal.secondsRemaining) }}</p>
				<div class="flex gap-1">
					<span class="text-blue-300 text-sm italic underline cursor-pointer"
						@click="() => goalEditModal.open(goal.id)">Edit</span>
					<span class="text-sm">-</span>
					<span class="text-red-400 text-sm italic underline cursor-pointer"
						@click="() => goalDeleteModal.open(goal.id)">Delete</span>
				</div>
			</div>
		</div>
		<button class="w-40 p-0.5 mt-2 mx-auto text-lg bg-blue-600 rounded-sm cursor-pointer" @click="openModal">Set
			Goal</button>
	</div>

	<GoalCreateModal v-model:active="showModal" />
	<GoalEditModal />
	<GoalDeleteModal />
</template>
