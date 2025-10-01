<script setup lang="ts">
import { ref, watch } from 'vue';
import useApp from '@/composables/useApp';
import useModals from '@/composables/useModals';

import BaseModal from '@/components/base/BaseModal.vue';
import TaskDropdown from '../tasks/TaskDropdown.vue';

const app = useApp()
const { goalEditModal } = useModals()

const goalTask = ref(-1)
const goalMinutes = ref(0)

function onIdChange(newId: number) {
	const goal = app.goals.getGoal(newId)
	goalTask.value = goal.taskId
	goalMinutes.value = goal.secondsThreshold / 60
}

function modalSubmit() {
	app.goals.editGoal(goalEditModal.id.value, goalTask.value, goalMinutes.value * 60, false)
}

watch(goalEditModal.id, onIdChange)
</script>

<template>
	<BaseModal title="Edit Goal" button-text="Edit" button-color="bg-green-600"
		v-model:active="goalEditModal.active.value" @submit="modalSubmit">
		<div class="flex flex-col w-full">
			<p class="italic">Tracking Task</p>
			<TaskDropdown v-model="goalTask" />
		</div>
		<div class="flex flex-col w-full">
			<p class="italic">Time To Spend</p>
			<div class="flex">
				<input class="mr-2 border-b-2 border-b-white" type="number" v-model="goalMinutes" />
				<span>minutes</span>
			</div>
		</div>
	</BaseModal>
</template>
