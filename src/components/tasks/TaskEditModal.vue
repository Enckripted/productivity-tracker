<script setup lang="ts">
import { ref, watch } from 'vue';
import useApp from '@/composables/useApp';
import useModals from '@/composables/useModals';

import BaseModal from '@/components/base/BaseModal.vue';
import TimeBar from './TimeBar.vue';

const app = useApp()
const { taskEditModal } = useModals()

const taskName = ref("")
const taskColor = ref("")

const errorMsg = ref("")

function onIdChange(newId: number) {
	const task = app.tasks.findTaskWithId(newId)
	taskName.value = task.name
	taskColor.value = task.color
}

function modalSubmit() {
	if (!taskName.value || !taskColor.value) {
		errorMsg.value = "Please fill out all fields"
		return
	}
	if (taskName.value.length > 32) {
		errorMsg.value = "Please type a shorter name"
		return
	}
	app.tasks.editTask(taskEditModal.id.value, taskName.value, taskColor.value)
}

watch(taskEditModal.id, onIdChange)
</script>

<template>
	<BaseModal title="Edit Task" button-text="Edit" button-color="bg-green-600 hover:bg-green-500"
		v-model:active="taskEditModal.active.value" @submit="modalSubmit">
		<div class="flex flex-col w-full">
			<label class="italic mb-1">Name</label>
			<input class="border-b-2 border-b-white" type="text" v-model="taskName" />
		</div>
		<div class="flex flex-col w-full">
			<label class="italic mb-1">Color</label>
			<input class="w-full border-0" type="color" v-model="taskColor" />
		</div>
		<div class="flex flex-col w-full">
			<label class="italic mb-1">Preview</label>
			<div class="flex">
				<TimeBar :percentage="100" :color="taskColor" />
			</div>
			<p class="text-sm italic">{{ taskName }} - 2 hours 2 minutes 2 seconds</p>
		</div>
		<p>{{ errorMsg }}</p>
	</BaseModal>
</template>
