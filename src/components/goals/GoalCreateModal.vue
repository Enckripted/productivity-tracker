<script setup lang="ts">
import { ref } from 'vue';
import useApp from '@/composables/useApp';
import BaseModal from '@/components/base/BaseModal.vue';
import TaskDropdown from '../tasks/TaskDropdown.vue';

const app = useApp()

const active = defineModel<boolean>("active")

const taskId = ref(-1)
const goalMinutes = ref(0)

const errorMsg = ref("")

function submitModal() {
	if (!Number.isInteger(goalMinutes) || goalMinutes.value < 0) {
		return
	}
	if (taskId.value === -1) {
		return
	}

	app.goals.createGoal(taskId.value, goalMinutes.value * 60, false)
}
</script>

<template>
	<BaseModal title="Set Goal" button-text="Set" button-color="bg-green-600" v-model:active="active"
		@submit="submitModal">

		<div class="flex flex-col w-full">
			<p class="italic">Tracking Task</p>
			<TaskDropdown v-model="taskId" />
		</div>
		<div class="flex flex-col w-full">
			<p class="italic">Time To Spend</p>
			<div class="flex">
				<input class="mr-2 border-b-2 border-b-white" type="number" v-model="goalMinutes" />
				<span>minutes</span>
			</div>
		</div>
		<p color="text-red-500">{{ errorMsg }}</p>
	</BaseModal>
</template>
